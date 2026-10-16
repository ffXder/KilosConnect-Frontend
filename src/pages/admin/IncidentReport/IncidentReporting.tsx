import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TriangleAlert } from 'lucide-react';

// COMPONENTS
import IncidentTable from './components/IncidentTable';
import { SidebarNavigationSection } from '../../../components/SidebarNavigationSection';
import IncidentFilterSection from './components/IncidentFilterSection';
import IncidentAddItemModal from './components/IncidentAddItemModal';
import IncidentResolveModal from './components/ResolveIncident'; 
import IncidentUpdateStatusModal from './components/IncidentUpdateStatusModal';
import IncidentDetailedModal from './components/IncidentDetailModal';
import StatsCards from './components/StatCard';
import AnalyticsCharts from './components/AnalyticsChartSection';
import { DeleteConfirmModal } from '../../../components/DeleteConfirmModal';

// HOOKS AND FORMATTER
import { useAuth } from '../../../hooks/useAuth';
import { useIncidentReports } from '../../../hooks/useIncident';
import { useAssets } from '../../../hooks/useAssets';
import { useUrlFilters } from '../../../hooks/useUrlFilters';
import type { IncidentReport, NewIncidentReport, ResolveIncidentPayload } from '../../../types/incident';
import { getDateThreshold } from '../../../utils/dateHelper';

const COLORS = {
  open: '#E67E22',
  resolved: '#2ECC71',
  high: '#E74C3C',
  medium: '#F1C40F',
  low: '#3498DB',
};

export const IncidentReportPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
  const [isResolveModalOpen, setIsResolveModalOpen] = React.useState(false);

  // DELETE/ARCHIVE MODAL STATES
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [incidentToDelete, setIncidentToDelete] = React.useState<IncidentReport | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 10;

  // Setters bound to URL updating
  const setActiveStatus = (val: string) => {
    setCurrentPage(1);
    updateParam('status', val, ['All']);
  };
  const setActiveSeverity = (val: string) => {
    setCurrentPage(1);
    updateParam('severity', val, ['Any Severity']);
  };
  const setActiveArea = (val: string) => {
    setCurrentPage(1);
    updateParam('area', val, ['All Areas']);
  };
  const setSearchTerm = (val: string) => {
    setCurrentPage(1);
    updateParam('search', val, ['']);
  };

  const setDateRange = (val: string) => {
    setCurrentPage(1);
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

  const setCustomStart = (val: string) => {
    setCurrentPage(1);
    updateParam('startDate', val, ['']);
  };
  const setCustomEnd = (val: string) => {
    setCurrentPage(1);
    updateParam('endDate', val, ['']);
  };
  const resetFilters = () => {
    setCurrentPage(1);
    clearAllFilters();
  };

  const { reports, loading, error, handleCreate, handleUpdate, handleArchive, handleResolve } = useIncidentReports();
  const { assets } = useAssets();
  const incidents = reports ?? [];
  const alertNavigation = location.state as {
    incidentId?: string;
    alertTitle?: string;
    alertSeverity?: 'critical' | 'warning' | 'info' | 'success';
  } | null;
  const alertIncidentId = alertNavigation?.incidentId;
  const alertIncident = alertIncidentId
  ? incidents.find((item) => item._id === alertIncidentId) ?? null
  : incidents
      .filter((incident) => {
        const matchesTitle =
          incident.title === alertNavigation?.alertTitle ||
          incident.area === alertNavigation?.alertTitle ||
          incident.asset?.name === alertNavigation?.alertTitle;
        const matchesSeverity =
          alertNavigation?.alertSeverity === 'critical'
            ? incident.severity === 'Critical' || incident.severity === 'Urgent'
            : alertNavigation?.alertSeverity === 'warning'
              ? incident.severity !== 'Critical' && incident.severity !== 'Urgent'
              : true;
        return matchesTitle && matchesSeverity && incident.status !== 'Resolved';
      })
      .sort((a, b) => Date.parse(b.dateAndTime) - Date.parse(a.dateAndTime))[0] ?? null;

  const handleAddIncident = async (newIncident: NewIncidentReport) => {
    try {
      await handleCreate(newIncident);
      setIsAddModalOpen(false);
    } catch (err) {
      console.error('Failed to create incident report:', err);
    }
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

  const handleOpenResolve = (incident: IncidentReport) => {
    setSelectedIncident(incident);
    setIsDetailedModalOpen(false); // Close details modal if open
    setIsResolveModalOpen(true);  // Open resolve modal
  };

  const handleResolveSubmit = async (
    incident: IncidentReport,
    payload: ResolveIncidentPayload,
    skipRepair: boolean
  ) => {
    try {
      await handleResolve(incident, payload);
      setIsResolveModalOpen(false);
      setSelectedIncident(null);
    } catch (err: any) {
      console.error('Failed to resolve incident:', err);
      throw err;
    }
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
  const filteredIncidents = useMemo(() => {
    const isYesterday = dateRange === 'Yesterday';
    const threshold = getDateThreshold(dateRange, customStart ? new Date(customStart) : null);

    return incidents.filter((incident) => {
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
        : customEnd
          ? incidentDate <= new Date(new Date(customEnd).setHours(23, 59, 59, 999))
          : true;

      return (
        (matchesStatus && matchesSeverity && matchesArea && matchesSearch && matchesStart && matchesEnd) ||
        incident._id === alertIncident?._id
      );
    });
  }, [
    incidents,
    activeStatus,
    activeSeverity,
    activeArea,
    searchTerm,
    dateRange,
    customStart,
    customEnd,
    alertIncident,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredIncidents.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedIncidents = filteredIncidents.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize,
  );
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeStatus, activeSeverity, activeArea, searchTerm, dateRange, customStart, customEnd]);

  React.useEffect(() => {
    if (!alertIncident || loading) return;
    const incidentIndex = filteredIncidents.findIndex((incident) => incident._id === alertIncident._id);
    if (incidentIndex >= 0) setCurrentPage(Math.floor(incidentIndex / pageSize) + 1);
  }, [alertIncident, filteredIncidents, loading]);

  React.useEffect(() => {
    if (!alertIncident || loading || !paginatedIncidents.some((incident) => incident._id === alertIncident._id)) {
      return;
    }
    document.getElementById(`incident-${alertIncident._id}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, [alertIncident, loading, paginatedIncidents]);

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
    <div className="flex min-h-screen w-full flex-col md:flex-row bg-[#f4f5f6] dark:bg-slate-950 transition-colors duration-300">
      <SidebarNavigationSection userRole={userRole} />

      <main className="flex-1 min-w-0 p-4 pt-20 md:p-8 md:pt-8 overflow-x-hidden dark:bg-slate-950 transition-colors duration-300">
        <div className="mx-auto w-full min-w-0 max-w-[1600px] space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#0f2942] dark:text-slate-50">Incident Reporting</h1>
            <p className="text-gray-500 text-sm mt-1 dark:text-slate-300">Track and manage equipment issues and safety hazards</p>
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
            onResetFilters={resetFilters}
          />

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <TriangleAlert size={18} />
              <span>Failed to load incidents. Please try refreshing the page.</span>
            </div>
          )}

          {/* Incident Table */}
          <IncidentTable
            incidents={paginatedIncidents}
            highlightedIncidentId={alertIncident?._id}
            loading={loading}
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            totalIncidents={filteredIncidents.length}
            onPageChange={setCurrentPage}
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
            onClose={() => {
              setIsDetailedModalOpen(false);
              if (alertNavigation) {
                navigate(`${location.pathname}${location.search}${location.hash}`, {
                  replace: true,
                  state: null,
                });
              }
            }}
            incident={selectedIncident}
            onResolve={handleOpenResolve}
          />

          <IncidentResolveModal
            isOpen={isResolveModalOpen}
            onClose={() => setIsResolveModalOpen(false)}
            incident={selectedIncident}
            onSubmit={handleResolveSubmit}
          />

          {/* DELETE CONFIRMATION MODAL */}
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
