import React, { useState } from 'react';
import { SidebarNavigationSection } from '../components/SidebarNavigationSection';
import { Search, RotateCcw, Package, Users, ClipboardList, AlertTriangle, Archive, Calendar } from 'lucide-react';
import { useArchivedUsers } from '../hooks/useArchivedUsers';
import { formatDate } from '../utils/formatter';
import type { UserAccount } from '../types/manageAccount';
type ArchiveCategory = 'users' | 'tasks' | 'inventory' | 'incidents' | 'lostfound';

const ArchivePage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<ArchiveCategory>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { archivedUsers, loading, error, handleUnarchive } = useArchivedUsers();

  const mockData = {
    tasks: [{ _id: 'T-9021', title: 'Deep Clean Racks', subtitle: 'Powerlifting Area', info: 'Archived Mar 15, 2026', date: '2026-03-15' }],
    inventory: [{ _id: 'I-4421', title: 'Cleaning Solution X', subtitle: 'Storage B', info: 'Out of Stock', date: '2026-04-10' }],
    incidents: [{ _id: 'INC-002', title: 'Floor Leak', subtitle: 'Main Hallway', info: 'Resolved Jan 20, 2026', date: '2026-01-20' }],
    lostfound: [{ _id: 'LF-882', title: 'Blue Water Bottle', subtitle: 'Front Desk', info: 'Unclaimed', date: '2026-02-05' }]
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
  };

  // Helper to check if a record falls within the selected date range
  const isWithinDateRange = (itemDate?: string | null) => {
    if (!itemDate) return true;
    const date = new Date(itemDate);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && date < start) return false;
    if (end && date > end) return false;
    return true;
  };

  const filteredUsers = archivedUsers.filter(user => {
    const matchesSearch = `${user.firstName} ${user.lastName} ${user.username}`
      .toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = isWithinDateRange(user.archivedAt);
    return matchesSearch && matchesDate;
  });

  const filteredMockData = (mockData[activeCategory as keyof typeof mockData] || []).filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = isWithinDateRange(item.date);
    return matchesSearch && matchesDate;
  });

  const getHeaders = () => {
    if (activeCategory === 'users') {
      return ['Name', 'User ID', 'Username', 'Role', 'Archived On', 'Actions'];
    }
    return ['Item / Title', 'ID', 'Location / Category', 'Status / Info', 'Actions'];
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <SidebarNavigationSection userRole="admin" />

      <main className="flex-1 ml-[240px] p-10">
        <div className="mb-10">
          <h1 className="[font-family:'Poppins',Helvetica] text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-tight">Archives</h1>
          <p className="[font-family:'Poppins',Helvetica] text-gray-500 text-sm mt-0.5">Manage and restore deactivated records.</p>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-8 bg-slate-100/80 p-1.5 rounded-2xl w-fit border border-slate-200">
          {[
            { id: 'users', label: 'Users', icon: Users },
            { id: 'tasks', label: 'Tasks', icon: ClipboardList },
            { id: 'inventory', label: 'Inventory', icon: Package },
            { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
            { id: 'lostfound', label: 'Lost & Found', icon: Archive },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveCategory(tab.id as ArchiveCategory); handleClearFilters(); }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeCategory === tab.id ? 'bg-white text-[#113129] shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Date Filter Bar */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="relative flex-1 min-w-[300px]">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={`Search archived ${activeCategory}...`}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#113129]/5 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center bg-white border border-slate-200 rounded-xl px-4 py-2 gap-3 shadow-sm">
            <Calendar size={16} className="text-slate-400" />
            <div className="flex items-center gap-2">
              <input 
                type="date" 
                value={startDate} 
                onChange={e => setStartDate(e.target.value)} 
                className="bg-transparent border-none text-[12px] font-bold text-slate-600 outline-none cursor-pointer"
              />
              <span className="text-slate-300 text-xs">—</span>
              <input 
                type="date" 
                value={endDate} 
                onChange={e => setEndDate(e.target.value)} 
                className="bg-transparent border-none text-[12px] font-bold text-slate-600 outline-none cursor-pointer"
              />
            </div>
          </div>

          <button 
            onClick={handleClearFilters} 
            className="flex items-center gap-2 px-4 py-3 text-slate-400 hover:text-red-500 bg-white border border-slate-200 rounded-xl transition-all active:scale-95"
            title="Reset Filters"
          >
            <RotateCcw size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">Reset</span>
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/30">
                {getHeaders().map((header, idx) => (
                  <th key={header} className={`px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest ${idx === getHeaders().length - 1 ? 'text-right' : ''}`}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {activeCategory === 'users' ? (
                filteredUsers.map((user) => (
                  <tr key={user.userId} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#113129] text-white flex items-center justify-center text-xs font-bold uppercase">{user.firstName[0]}{user.lastName[0]}</div>
                        <div>
                          <p className="text-[14px] font-bold text-slate-900 leading-tight">{user.firstName} {user.lastName}</p>
                          <p className="text-[12px] text-slate-400 mt-0.5">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[13px] text-slate-500 font-medium">USER-{user.userId.slice(-7).toUpperCase()}</td>
                    <td className="px-6 py-4 text-[13px] font-bold text-slate-700">{user.username}</td>
                    <td className="px-6 py-4">
                      <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[13px] text-slate-400">{user.archivedAt ? formatDate(user.archivedAt) : '—'}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleUnarchive(user.userId)} className="inline-flex items-center gap-2 text-[13px] font-bold text-[#113129] hover:text-green-700 transition-colors group">
                        <RotateCcw size={14} className="group-hover:rotate-[-90deg] transition-transform duration-300" />
                        Restore
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                filteredMockData.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-5">
                       <p className="text-[14px] font-bold text-slate-900">{item.title}</p>
                    </td>
                    <td className="px-6 py-5 text-[13px] text-slate-500 font-mono">{item._id}</td>
                    <td className="px-6 py-5 text-[13px] text-slate-600">{item.subtitle}</td>
                    <td className="px-6 py-5 text-[12px] font-bold text-slate-400 uppercase">{item.info}</td>
                    <td className="px-6 py-5 text-right">
                      <button className="inline-flex items-center gap-2 text-[13px] font-bold text-[#113129] hover:text-green-700 group transition-colors">
                        <RotateCcw size={14} className="group-hover:rotate-[-90deg] transition-transform duration-300" />
                        Restore
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          
          {/* Empty State */}
          {((activeCategory === 'users' ? filteredUsers.length : filteredMockData.length) === 0) && (
            <div className="py-20 text-center flex flex-col items-center gap-3">
              <Archive size={40} className="text-slate-200" />
              <p className="text-slate-400 font-medium">No records found for the selected criteria.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ArchivePage;