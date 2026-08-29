import React, { useState } from 'react';
import { 
  CircleX, 
  Clock, 
  CircleCheckBig, 
  TriangleAlert,
  Loader2,
} from 'lucide-react';
import IncidentRow from './components/IncidentRow';
import { SidebarNavigationSection } from '../../../components/SidebarNavigationSection';
import StatCard from './components/StatCard';
import IncidentFilterSection from './components/IncidentFilterSection'; 
import IncidentAddItemModal from './components/IncidentAddItemModal';
import IncidentUpdateStatusModal from './components/IncidentUpdateStatusModal';
import IncidentDetailedModal from './components/IncidentDetailModal';
import { useAuth } from '../../../hooks/useAuth';
import { useIncidentReports } from '../../../hooks/useIncident';
import type { IncidentReport, NewIncidentReport } from '../../../types/incident';
import { getDateThreshold } from '../../../utils/dateHelper';

export interface StatCardProps {
  label: string;
  count: number;
  icon: React.ReactNode;
  colorClass: string;
}

export const IncidentReportPage: React.FC = () => {
  const [activeStatus, setActiveStatus] = useState('All');
  const [activeSeverity, setActiveSeverity] = useState('Any Severity');
  const [activeArea, setActiveArea] = useState('All Areas'); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [selectedIncident, setSelectedIncident] = useState<IncidentReport | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDetailedModalOpen, setIsDetailedModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState('Last 7 Days');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const { reports, loading, error, handleCreate, handleUpdate, handleDelete } = useIncidentReports();
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

  const isYesterday = dateRange === 'Yesterday';

  const threshold = getDateThreshold(
    dateRange,
    customStart ? new Date(customStart) : null
  );
  const endDate = customEnd ? new Date(customEnd) : null;

  const filteredIncidents = incidents.filter(incident => {
    const matchesStatus = activeStatus === 'All' || incident.status === activeStatus;
    const matchesSeverity = activeSeverity === 'Any Severity' || incident.severity === activeSeverity;
    const matchesArea = activeArea === 'All Areas' || incident.area === activeArea;
    const matchesSearch = (incident.title ?? '').toLowerCase().includes(searchTerm.toLowerCase()) || 
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

  const { role } = useAuth();
  const userRole = (role ?? 'custodian') as React.ComponentProps<typeof SidebarNavigationSection>["userRole"];

  return (
    <div className="flex min-h-screen w-full bg-[#f4f5f6]">
      <SidebarNavigationSection userRole={userRole} />

      {/* Main Content Area */}
      <main className="flex-1 w-full p-4 md:p-8 space-y-6 overflow-x-hidden">
        <div className="max-w-[1400px] mx-auto space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#0f2942]">
                Incident Reporting
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Track and manage equipment issues and safety hazards
              </p>
            </div>
          </div>

          {/* Summary Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <StatCard 
              label="Open" 
              count={incidents.filter(i => i.status === 'Open').length} 
              icon={<CircleX className="text-[#EF4444]" size={24} />} 
              colorClass="bg-[#FEE2E2]" 
            />
            <StatCard 
              label="In Progress" 
              count={incidents.filter(i => i.status === 'In Progress').length} 
              icon={<Clock className="text-[#3B82F6]" size={24} />} 
              colorClass="bg-[#DBEAFE]" 
            />
            <StatCard 
              label="Resolved" 
              count={incidents.filter(i => i.status === 'Resolved').length} 
              icon={<CircleCheckBig className="text-[#10B981]" size={24} />} 
              colorClass="bg-[#D1FAE5]" 
            />
          </div>

          {/* Filters */}
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
          />

          {/* Error Banner */}
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <TriangleAlert size={18} />
              <span>Failed to load incidents. Please try refreshing the page.</span>
            </div>
          )}

          {/* Table Container */}
          <div className="bg-white rounded-[20px] border border-[#e2e8f0] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    <th scope="col" className="py-3.5 px-5">ID</th>
                    <th scope="col" className="py-3.5 px-5">Status</th>
                    <th scope="col" className="py-3.5 px-5">Severity</th>
                    <th scope="col" className="py-3.5 px-5">Incident Details</th>
                    <th scope="col" className="py-3.5 px-5">Area</th>
                    <th scope="col" className="py-3.5 px-5">Reported By</th>
                    <th scope="col" className="py-3.5 px-5">Date & Time</th>
                    <th scope="col" className="py-3.5 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="py-16 text-center">
                        <Loader2 className="animate-spin text-[#0F6E56] mx-auto mb-2" size={28} />
                        <p className="text-gray-400 text-sm">Loading incident reports...</p>
                      </td>
                    </tr>
                  ) : filteredIncidents.length > 0 ? (
                    filteredIncidents.map((incident) => (
                      <IncidentRow 
                        key={incident.incidentId} 
                        incident={incident} 
                        onClick={handleItemClick}
                        onViewClick={handleViewDetails}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-16 text-center">
                        <TriangleAlert className="text-gray-300 mx-auto mb-3" size={32} />
                        <p className="text-gray-500 font-medium text-sm">No incidents match the selected filters.</p>
                        <p className="text-gray-400 text-xs mt-1">Try resetting your date range or filter criteria.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modals */}
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
            onDelete={handleDelete}
          />

          <IncidentDetailedModal 
            isOpen={isDetailedModalOpen}
            onClose={() => setIsDetailedModalOpen(false)}
            incident={selectedIncident}
          />
        </div>
      </main>
    </div>
  );
};