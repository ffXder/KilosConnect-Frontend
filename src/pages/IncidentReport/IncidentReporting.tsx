import React, { useState } from 'react';
import { 
  CircleX, 
  Clock, 
  CircleCheckBig, 
  TriangleAlert,
} from 'lucide-react';
import IncidentItem from './IncidentItem';
import { SidebarNavigationSection } from '../../components/SidebarNavigationSection';
import StatCard from './StatCard';
import IncidentFilterSection from './IncidentFilterSection'; 
import IncidentAddItemModal from './IncidentAddItemModal';
import IncidentUpdateStatusModal from './IncidentUpdateStatusModal';
import IncidentDetailedModal from './IncidentDetailModal';
import { useAuth } from '../../hooks/useAuth';
import { useIncidentReports } from '../../hooks/useIncident';
import type { IncidentReport, NewIncidentReport } from '../../types/incident';
import { getDateThreshold } from '../../utils/dateHelper';

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

  const incidentDate = new Date(incident.dateAndTime); // adjust field name if different
  const matchesStart = threshold ? incidentDate >= threshold : true;
  const matchesEnd = isYesterday
    ? incidentDate < new Date(new Date().setHours(0, 0, 0, 0))
    : endDate
      ? incidentDate <= new Date(new Date(customEnd).setHours(23, 59, 59, 999))
      : true;

  return matchesStatus && matchesSeverity && matchesArea && matchesSearch && matchesStart && matchesEnd;
});

  const { role } = useAuth()
  const userRole = (role ?? 'custodian') as React.ComponentProps<typeof SidebarNavigationSection>["userRole"]

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans">
      <SidebarNavigationSection userRole={userRole} />

      <main className="flex-1 ml-[240px] p-10 overflow-y-auto">
        <header className="flex justify-between items-start mb-8">
          <div>
            <h1 className="[font-family:'Poppins',Helvetica] text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-tight">Incident Reporting</h1>
            <p className="[font-family:'Poppins',Helvetica] text-gray-500 text-sm mt-0.5">Track and manage equipment issues and safety hazards</p>
          </div>
        </header>

        <div className="flex gap-5 mb-8">
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

        <div className="bg-white rounded-[24px] border border-[#e2e8f0] overflow-hidden mt-6 mb-10">
          {filteredIncidents.length > 0 ? (
            filteredIncidents.map((incident) => (
              <IncidentItem 
                key={incident.incidentId} 
                incident={incident} 
                onClick={handleItemClick}
                onViewClick={handleViewDetails} // Pass the new handler here
              />
            ))
          ) : (
            <div className="p-16 text-center">
              <TriangleAlert className="text-gray-300 mx-auto mb-4" size={32} />
              <p className="text-gray-400 font-medium italic">No incidents match the selected filters.</p>
            </div>
          )}
        </div>

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

        {/* Add the Detailed Modal component here */}
        <IncidentDetailedModal 
          isOpen={isDetailedModalOpen}
          onClose={() => setIsDetailedModalOpen(false)}
          incident={selectedIncident}
        />
      </main>
    </div>
  );
};

