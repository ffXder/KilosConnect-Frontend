import React, { useState } from 'react';
import { 
  CircleX, 
  Clock, 
  CircleCheckBig, 
  TriangleAlert,
  Archive // Added[cite: 4]
} from 'lucide-react';
import IncidentItem from './IncidentItem';
import { SidebarNavigationSection } from '../../components/SidebarNavigationSection';
import StatCard from './StatCard';
import IncidentFilterSection from './IncidentFilterSection'; 
import IncidentAddItemModal from './IncidentAddItemModal';
import IncidentUpdateStatusModal from './IncidentUpdateStatusModal';
import { useAuth } from '../../hooks/useAuth';

export interface Incident {
  id: string;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Resolved' | 'Archived'; // Added 'Archived'[cite: 4]
  priority: 'High Severity' | 'Medium Severity' | 'Low Severity';
  location: string;
  reportedBy: string;
  date: string;
}

export interface StatCardProps {
  label: string;
  count: number;
  icon: React.ReactNode;
  colorClass: string;
}


export const IncidentReportPage: React.FC = () => {
  const [activeStatus, setActiveStatus] = useState('All');
  const [activePriority, setActivePriority] = useState('Any Priority');
  const [activeLocation, setActiveLocation] = useState('All Areas'); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  
  const [incidents, setIncidents] = useState<Incident[]>([
    { 
      id: '1', 
      title: 'Squat rack unstable', 
      description: 'The left side squat rack is wobbling and needs immediate attention', 
      status: 'Pending', 
      priority: 'High Severity', 
      location: 'Powerlifting Area', 
      reportedBy: 'Maria Santos', 
      date: '2025-04-24 13:30' 
    },
    { 
      id: '2', 
      title: 'Broken mirror', 
      description: 'Wall mirror has a crack', 
      status: 'Pending', 
      priority: 'Medium Severity', 
      location: 'Mezzanine', 
      reportedBy: 'Juan Cruz', 
      date: '2025-04-24 14:00' 
    }
  ]);

  const handleAddIncident = (newIncident: Omit<Incident, 'id' | 'status'>) => {
    const incidentWithId: Incident = {
      ...newIncident,
      id: Date.now().toString(),
      status: 'Pending'
    };
    setIncidents([incidentWithId, ...incidents]);
  };

  const handleUpdateStatus = (id: string, newStatus: Incident['status']) => {
    setIncidents(prev => prev.map(inc => 
      inc.id === id ? { ...inc, status: newStatus } : inc
    ));
  };

  const handleItemClick = (incident: Incident) => {
    setSelectedIncident(incident);
    setIsUpdateModalOpen(true);
  };

  const filteredIncidents = incidents.filter(incident => {
    // If "All" is selected, we hide Archived items to keep the list clean[cite: 4]
    const matchesStatus = activeStatus === 'All' 
      ? incident.status !== 'Archived' 
      : incident.status === activeStatus;
      
    const matchesPriority = activePriority === 'Any Priority' || incident.priority === activePriority;
    const matchesLocation = activeLocation === 'All Areas' || incident.location === activeLocation; 
    const matchesSearch = incident.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          incident.description.toLowerCase().includes(searchTerm.toLowerCase()); 
    
    return matchesStatus && matchesPriority && matchesLocation && matchesSearch;
  });

  const { role } = useAuth()
  const userRole = (role ?? 'custodian') as React.ComponentProps<typeof SidebarNavigationSection>["userRole"]

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans">
      <SidebarNavigationSection userRole={userRole} />

      <main className="flex-1 ml-[240px] p-10 overflow-y-auto">
        <header className="flex justify-between items-start mb-8">
          <div>
            <h1 className="[font-family:'Poppins',Helvetica] text-3xl font-bold text-gray-900 tracking-tigh">Incident Reporting</h1>
            <p className="[font-family:'Poppins',Helvetica] text-gray-500 text-sm mt-1">Track and manage equipment issues and safety hazards</p>
          </div>
        </header>

        <div className="flex gap-5 mb-8">
          <StatCard 
            label="Pending" 
            count={incidents.filter(i => i.status === 'Pending').length} 
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
          <StatCard 
            label="Archived" 
            count={incidents.filter(i => i.status === 'Archived').length} 
            icon={<Archive className="text-[#64748b]" size={24} />} 
            colorClass="bg-[#f1f5f9]" 
          />
        </div>

        <IncidentFilterSection 
          activeStatus={activeStatus} 
          onStatusChange={setActiveStatus}
          activePriority={activePriority}
          onPriorityChange={setActivePriority}
          activeLocation={activeLocation} 
          onLocationChange={setActiveLocation} 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
          onAddClick={() => setIsAddModalOpen(true)}
        />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden px-2 mb-10">
          {filteredIncidents.length > 0 ? (
            filteredIncidents.map((incident) => (
              <IncidentItem 
                key={incident.id} 
                incident={incident} 
                onClick={handleItemClick} 
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
        />
      </main>
    </div>
  );
};

