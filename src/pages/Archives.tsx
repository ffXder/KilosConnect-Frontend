import React, { useState } from 'react';
import { SidebarNavigationSection } from '../components/SidebarNavigationSection';
import { Search, MapPin, RotateCcw, ChevronRight, Package, Users, ClipboardList, AlertTriangle, Archive, Filter } from 'lucide-react';

type ArchiveCategory = 'tasks' | 'users' | 'inventory' | 'incidents' | 'lostfound';

const ArchivePage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<ArchiveCategory>('tasks');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // --- MOCK DATA (Connect your API here) ---
  const mockData = {
    tasks: [{ _id: '1', title: 'Deep Clean Racks', subtitle: 'Powerlifting Area', info: 'Archived 2024-03-15' }],
    users: [{ _id: '2', title: 'John Doe', subtitle: 'Custodian Role', info: 'Deactivated 2024-02-10' }],
    inventory: [{ _id: '3', title: 'Cleaning Solution X', subtitle: 'Storage B', info: 'Marked as Out of Stock' }],
    incidents: [{ _id: '4', title: 'Floor Leak', subtitle: 'Main Hallway', info: 'Resolved 2024-01-20' }],
    lostfound: [{ _id: '5', title: 'Blue Water Bottle', subtitle: 'Front Desk', info: 'Unclaimed - Archived' }]
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <SidebarNavigationSection userRole="admin" />
      
      <main className="flex-1 ml-[240px] p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Archives</h1>
          <p className="text-slate-500 text-sm mt-1">Centralized storage for all archived records and deactivated accounts.</p>
        </div>

        {/* --- CATEGORY TABS --- */}
        <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-2xl w-fit">
          {[
            { id: 'tasks', label: 'Tasks', icon: ClipboardList },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'inventory', label: 'Inventory', icon: Package },
            { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
            { id: 'lostfound', label: 'Lost & Found', icon: Archive },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as ArchiveCategory)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeCategory === tab.id 
                ? "bg-white text-[#113129] shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* --- FILTER BAR --- */}
        <div className="bg-white p-4 rounded-[24px] border border-slate-200 shadow-sm mb-8 flex items-center gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={`Search archived ${activeCategory}...`}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:border-[#113129]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-slate-50 border-none rounded-xl p-2.5 text-xs font-bold text-slate-600 outline-none" />
            <span className="text-slate-300">-</span>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-slate-50 border-none rounded-xl p-2.5 text-xs font-bold text-slate-600 outline-none" />
          </div>

          <div className="h-8 w-px bg-slate-200 mx-2" />

          <button 
            onClick={handleClearFilters}
            className="flex items-center gap-2 text-slate-400 hover:text-[#113129] font-bold text-xs px-2 transition-colors"
          >
            <RotateCcw size={16} />
            CLEAR FILTER
          </button>
        </div>

        {/* --- LIST CARDS (UI MATCHED TO SCREENSHOT) --- */}
        <div className="space-y-3">
          {mockData[activeCategory].map((item) => (
            <div 
              key={item._id} 
              className="bg-white border border-slate-100 rounded-[24px] p-4 flex items-center shadow-sm hover:shadow-md transition-all group"
            >
              {/* Left Side Content */}
              <div className="flex-1 pl-4">
                <h3 className="text-lg font-bold text-slate-800">{item.title}</h3>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-sm font-semibold text-slate-400 flex items-center gap-1.5">
                    <MapPin size={14} /> {item.subtitle}
                  </span>
                  <span className="text-xs font-medium text-slate-300">|</span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">{item.info}</span>
                </div>
              </div>

              {/* ACTION AREA (UI FROM SCREENSHOT) */}
              <div className="flex items-center gap-4 pr-2">
                {/* Vertical Divider */}
                <div className="h-12 w-px bg-slate-100" />

                {/* Restore Button (Square Rounded) */}
                <button 
                  className="w-12 h-12 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-[#113129] hover:bg-[#113129]/5 rounded-2xl transition-all active:scale-95"
                  title="Restore Item"
                >
                  <RotateCcw size={20} />
                </button>

                {/* Chevron Arrow */}
                <button className="p-2 text-slate-200 group-hover:text-slate-400 transition-colors">
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ArchivePage;