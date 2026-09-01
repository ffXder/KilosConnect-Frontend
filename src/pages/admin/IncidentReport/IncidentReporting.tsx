import React, { useMemo } from 'react';
import { TriangleAlert } from 'lucide-react';

// COMPONENTS
import IncidentTable from './components/IncidentTable';
import { SidebarNavigationSection } from '../../../components/SidebarNavigationSection';
import IncidentFilterSection from './components/IncidentFilterSection';
import IncidentAddItemModal from './components/IncidentAddItemModal';
import IncidentUpdateStatusModal from './components/IncidentUpdateStatusModal';
import IncidentDetailedModal from './components/IncidentDetailModal';
import StatsCards from './components/StatCard';
import AnalyticsCharts from './components/AnalyticsChartSection';
import { DeleteConfirmModal } from '../../../components/DeleteConfirmModal'; // 1. IMPORT MODAL

// HOOKS AND FORMATTER
import { useAuth } from '../../../hooks/useAuth';
import { useIncidentReports } from '../../../hooks/useIncident';
import { useUrlFilters } from '../../../hooks/useUrlFilters';
import type { IncidentReport, NewIncidentReport } from '../../../types/incident';
import { getDateThreshold } from '../../../utils/dateHelper';

const COLORS = {
  open: '#E67E22',
  resolved: '#2ECC71',
  high: '#E74C3C',
  medium: '#F1C40F',
  low: '#3498DB',
};

export const IncidentReportPage: React.FC = () => {
  const { getParam, updateParam, updateParams, clearAllFilters } = useUrlFilters();

  // Read State directly from URL
  const activeStatus = getParam('status', 'All');
  const activeSeverity = getParam('severity', 'Any Severity');
  const activeArea = getParam('area', 'All Areas');
  const searchTerm = getParam('search', '');
  const dateRange = getParam('dateRange', 'Last 30 Days');
  const customStart = getParam('startDate', '');
  const customEnd = getParam('endDate', '');

  // Local Modal States
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [selectedIncident, setSelectedIncident] = React.useState<IncidentReport | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = React.useState(false);
  const [isDetailedModalOpen, setIsDetailedModalOpen] = React.useState(false);

  // 2. DELETE/ARCHIVE MODAL STATES
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [incidentToDelete, setIncidentToDelete] = React.useState<IncidentReport | null>(null);

  // Setters bound to URL updating
  const setActiveStatus = (val: string) => updateParam('status', val, ['All']);
  const setActiveSeverity = (val: string) => updateParam('severity', val, ['Any Severity']);
  const setActiveArea = (val: string) => updateParam('area', val, ['All Areas']);
  const setSearchTerm = (val: string) => updateParam('search', val, ['']);

  const setDateRange = (val: string) => {
    if (val !== 'Custom Range') {
      updateParams({
        dateRange: { value: val, defaultValues: ['Last 30 Days'] },
        startDate: { value: '', defaultValues: [''] },
        endDate: { value: '', defaultValues: [''] },
      });
    } else {
      updateParam('dateRange', val, ['Last 30 Days']);
    }
  };

  const setCustomStart = (val: string) => updateParam('startDate', val, ['']);
  const setCustomEnd = (val: string) => updateParam('endDate', val, ['']);

  const { reports, loading, error, handleCreate, handleUpdate, handleArchive } = useIncidentReports();
  const incidents = reports ?? [];

  const handleAddIncident = async (newIncident: NewIncidentReport) => {
    await handleCreate(newIncident);
  };

  const handleUpdateStatus = async (id: string, newStatus: IncidentReport['status']) => {
    await handleUpdate(id, { status: newStatus });
  };

  const handleItemClick = (incident: IncidentReport) => {
    setSelectedIncident(incident);
    setIsUpdateModalOpen(true);
  };

  const handleViewDetails = (incident: IncidentReport) => {
    setSelectedIncident(incident);
    setIsDetailedModalOpen(true);
  };

  const handleDeleteClick = (incident: IncidentReport) => {
    setIncidentToDelete(incident);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (reason?: string) => {
    if (!incidentToDelete) return;

    try {
      await handleArchive(incidentToDelete._id);
      
      setIsDeleteModalOpen(false);
      setIncidentToDelete(null);
    } catch (err) {
      console.error('Failed to delete incident:', err);
    }
  };

  // Filtering Logic
  const isYesterday = dateRange === 'Yesterday';
  const threshold = getDateThreshold(dateRange, customStart ? new Date(customStart) : null);
  const endDate = customEnd ? new Date(customEnd) : null;

  const filteredIncidents = incidents.filter((incident) => {
    const matchesStatus = activeStatus === 'All' || incident.status === activeStatus;
    const matchesSeverity = activeSeverity === 'Any Severity' || incident.severity === activeSeverity;
    const matchesArea = activeArea === 'All Areas' || incident.area === activeArea;
    const matchesSearch =
      (incident.title ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (incident.description ?? '').toLowerCase().includes(searchTerm.toLowerCase());

    const incidentDate = new Date(incident.dateAndTime);
    const matchesStart = threshold ? incidentDate >= threshold : true;
    const matchesEnd = isYesterday
      ? incidentDate < new Date(new Date().setHours(0, 0, 0, 0))
      : endDate
      ? incidentDate <= new Date(new Date(customEnd).setHours(23, 59, 59, 999))
      : true;

    return matchesStatus && matchesSeverity && matchesArea && matchesSearch && matchesStart && matchesEnd;
  });

  // Analytics Computation
  const analytics = useMemo(() => {
    const total = incidents.length;
    const openCount = incidents.filter((i) => i.status === 'Open').length;
    const resolvedCount = incidents.filter((i) => i.status === 'Resolved').length;
    const highCount = incidents.filter((i) => i.severity === 'High').length;
    const lowCount = incidents.filter((i) => i.severity === 'Low').length;

    const statusData = [
      { name: 'Open', value: openCount, color: COLORS.open },
      { name: 'Resolved', value: resolvedCount, color: COLORS.resolved },
    ].filter((d) => d.value > 0);

    const severityData = [
      { name: 'High', value: highCount, color: COLORS.high },
      { name: 'Medium', value: incidents.filter((i) => i.severity === 'Medium').length, color: COLORS.medium },
      { name: 'Low', value: lowCount, color: COLORS.low },
    ].filter((d) => d.value > 0);

    const areaCounts: Record<string, number> = {};
    incidents.forEach((i) => {
      if (i.area) areaCounts[i.area] = (areaCounts[i.area] || 0) + 1;
    });

    const areaData = Object.entries(areaCounts).map(([name, count]) => ({ name, count }));

    return { total, openCount, resolvedCount, highCount, lowCount, statusData, severityData, areaData };
  }, [incidents]);

  const { role } = useAuth();
  const userRole = (role ?? 'custodian') as React.ComponentProps<typeof SidebarNavigationSection>['userRole'];

  return (
    <div className="flex min-h-screen w-full bg-[#f4f5f6]">
      <SidebarNavigationSection userRole={userRole} />

      <main className="flex-1 w-full p-4 md:p-8 space-y-6 overflow-x-hidden">
        <div className="max-w-[1400px] mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#0f2942]">Incident Reporting</h1>
            <p className="text-gray-500 text-sm mt-1">Track and manage equipment issues and safety hazards</p>
          </div>

          {/* Metric Cards Component */}
          <StatsCards
            total={analytics.total}
            openCount={analytics.openCount}
            resolvedCount={analytics.resolvedCount}
            highCount={analytics.highCount}
            lowCount={analytics.lowCount}
          />

          {/* Analytics Visualizations Component */}
          <AnalyticsCharts
            statusData={analytics.statusData}
            severityData={analytics.severityData}
            areaData={analytics.areaData}
          />

          {/* Interactive Filters */}
          <IncidentFilterSection
            activeStatus={activeStatus}
            onStatusChange={setActiveStatus}
            activeSeverity={activeSeverity}
            onSeverityChange={setActiveSeverity}
            activeArea={activeArea}
            onAreaChange={setActiveArea}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onAddClick={() => setIsAddModalOpen(true)}
            dateRange={dateRange}
            setDateRange={setDateRange}
            customStart={customStart}
            setCustomStart={setCustomStart}
            customEnd={customEnd}
            setCustomEnd={setCustomEnd}
            onResetFilters={clearAllFilters}
          />

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <TriangleAlert size={18} />
              <span>Failed to load incidents. Please try refreshing the page.</span>
            </div>
          )}

          {/* Incident Table */}
          <IncidentTable
            incidents={filteredIncidents}
            loading={loading}
            onSelectIncident={handleItemClick}
            onViewIncident={handleViewDetails}
            onDeleteIncident={handleDeleteClick}
          />

          {/* Modal Components */}
          <IncidentAddItemModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSubmit={handleAddIncident}
          />

          <IncidentUpdateStatusModal
            isOpen={isUpdateModalOpen}
            onClose={() => setIsUpdateModalOpen(false)}
            incident={selectedIncident}
            onUpdateStatus={handleUpdateStatus}
          />

          <IncidentDetailedModal
            isOpen={isDetailedModalOpen}
            onClose={() => setIsDetailedModalOpen(false)}
            incident={selectedIncident}
          />

          {/* 6. DELETE CONFIRMATION MODAL */}
          <DeleteConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setIncidentToDelete(null);
            }}
            onConfirm={handleConfirmDelete}
            itemName={incidentToDelete?.title || 'Selected Incident'}
            itemType="Incident"
          />
        </div>
      </main>
    </div>
  );
};