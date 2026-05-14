import React, { useState } from 'react';
import { SidebarNavigationSection } from '../components/SidebarNavigationSection';
import { Search, RotateCcw, Package, Users, ClipboardList, AlertTriangle, Archive, Calendar } from 'lucide-react';
import { useArchivedUsers } from '../hooks/archives/useArchivedUsers';
import { useArchivedTasks } from '../hooks/archives/useArchivedTask';
import { useArchivedInventory } from '../hooks/archives/useArchivedInventory';
import { useArchivedIncidents } from '../hooks/archives/useArchivedIncidents';
import { useArchivedLostFound } from '../hooks/archives/useArchivedLostFound';
import { formatDate } from '../utils/formatter';

type ArchiveCategory = 'users' | 'tasks' | 'inventory' | 'incidents' | 'lostfound';

const ArchivePage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<ArchiveCategory>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { archivedUsers, loading: loadingUsers, handleUnarchive: unarchiveUser } = useArchivedUsers();
  const { archivedTasks, loading: loadingTasks, handleUnarchive: unarchiveTask } = useArchivedTasks();
  const { archivedAssets, archivedConsumables, loading: loadingInventory, handleUnarchiveAsset, handleUnarchiveConsumable } = useArchivedInventory();
  const { archivedIncidents, loading: loadingIncidents, handleUnarchive: unarchiveIncident } = useArchivedIncidents();
  const { archivedItems, loading: loadingLostFound, handleUnarchive: unarchiveLostFound } = useArchivedLostFound();

  const loading =
    activeCategory === 'users' ? loadingUsers :
    activeCategory === 'tasks' ? loadingTasks :
    activeCategory === 'inventory' ? loadingInventory :
    activeCategory === 'incidents' ? loadingIncidents :
    loadingLostFound;

  const handleClearFilters = () => {
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
  };

  const isWithinDateRange = (itemDate?: string | null) => {
    if (!itemDate) return true;
    const date = new Date(itemDate);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    if (start && date < start) return false;
    if (end && date > end) return false;
    return true;
  };

  const matchesSearch = (text: string) =>
    text.toLowerCase().includes(searchTerm.toLowerCase());

  // --- Filtered Data ---

  const filteredUsers = archivedUsers.filter(u =>
    matchesSearch(`${u.firstName} ${u.lastName} ${u.username}`) &&
    isWithinDateRange(u.archivedAt)
  );

  const filteredTasks = archivedTasks.filter(t =>
    matchesSearch(`${t.title} ${t.area}`) &&
    isWithinDateRange(t.updatedAt)
  );

  const filteredAssets = archivedAssets.filter(a =>
    matchesSearch(`${a.name} ${a.area}`) &&
    isWithinDateRange(a.archivedAt)
  );

  const filteredConsumables = archivedConsumables.filter(c =>
    matchesSearch(`${c.name} ${c.category} ${c.location}`) &&
    isWithinDateRange(c.archivedAt)
  );

  const filteredIncidents = archivedIncidents.filter(i =>
    matchesSearch(`${i.title} ${i.area}`) &&
    isWithinDateRange(i.archivedAt)
  );

  const filteredLostFound = archivedItems.filter(l =>
    matchesSearch(`${l.item} ${l.areaFound}`) &&
    isWithinDateRange(l.archivedAt)
  );

  const getEmptyCount = () => {
    switch (activeCategory) {
      case 'users': return filteredUsers.length;
      case 'tasks': return filteredTasks.length;
      case 'inventory': return filteredAssets.length + filteredConsumables.length;
      case 'incidents': return filteredIncidents.length;
      case 'lostfound': return filteredLostFound.length;
    }
  };

  const severityColor: Record<string, string> = {
    Low: 'bg-green-100 text-green-600',
    Medium: 'bg-yellow-100 text-yellow-600',
    High: 'bg-orange-100 text-orange-600',
    Urgent: 'bg-red-100 text-red-600',
    Critical: 'bg-red-200 text-red-800',
  };

  const conditionColor: Record<string, string> = {
    'Good Condition': 'bg-green-100 text-green-600',
    'Needs Repair': 'bg-yellow-100 text-yellow-600',
    'Needs Replacement': 'bg-red-100 text-red-600',
    'Under Repair': 'bg-blue-100 text-blue-600',
  };

  const RestoreButton = ({ onClick }: { onClick: () => void }) => (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 text-[13px] font-bold text-[#113129] hover:text-green-700 transition-colors group"
    >
      <RotateCcw size={14} className="group-hover:rotate-[-90deg] transition-transform duration-300" />
      Restore
    </button>
  );

  const renderHeaders = () => {
    const headers: Record<ArchiveCategory, string[]> = {
      users: ['Name', 'User ID', 'Username', 'Role', 'Archived On', 'Actions'],
      tasks: ['Title', 'Area', 'Frequency', 'Priority', 'Archived On', 'Actions'],
      inventory: ['Name', 'ID', 'Type', 'Condition / Category', 'Archived On', 'Actions'],
      incidents: ['Title', 'Incident ID', 'Area', 'Severity', 'Archived On', 'Actions'],
      lostfound: ['Item', 'Lost ID', 'Area Found', 'Status', 'Archived On', 'Actions'],
    };
    return headers[activeCategory];
  };
  
  const renderRows = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={6} className="px-6 py-20 text-center text-slate-400 text-sm">Loading...</td>
        </tr>
      );
    }

    switch (activeCategory) {
      case 'users':
        return filteredUsers.map(user => (
          <tr key={user.userId} className="hover:bg-slate-50/50 transition-colors">
            <td className="px-6 py-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#113129] text-white flex items-center justify-center text-xs font-bold uppercase">
                  {user.firstName[0]}{user.lastName[0]}
                </div>
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
            <td className="px-6 py-4 text-right"><RestoreButton onClick={() => unarchiveUser(user.userId)} /></td>
          </tr>
        ));

      case 'tasks':
        return filteredTasks.map(task => (
          <tr key={task._id} className="hover:bg-slate-50/50 transition-colors">
            <td className="px-6 py-4">
              <p className="text-[14px] font-bold text-slate-900">{task.title}</p>
              {task.description && <p className="text-[12px] text-slate-400 mt-0.5 truncate max-w-[200px]">{task.description}</p>}
            </td>
            <td className="px-6 py-4 text-[13px] text-slate-600">{task.area}</td>
            <td className="px-6 py-4 text-[13px] text-slate-500">{task.frequency}</td>
            <td className="px-6 py-4">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                task.priority === 'High' ? 'bg-red-100 text-red-600' :
                task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                'bg-green-100 text-green-600'
              }`}>
                {task.priority}
              </span>
            </td>
            <td className="px-6 py-4 text-[13px] text-slate-400">{formatDate(task.updatedAt)}</td>
            <td className="px-6 py-4 text-right"><RestoreButton onClick={() => unarchiveTask(task._id)} /></td>
          </tr>
        ));

      case 'inventory':
        return (
          <>
            {filteredAssets.map(asset => (
              <tr key={asset._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-[14px] font-bold text-slate-900">{asset.name}</p>
                  <p className="text-[12px] text-slate-400 mt-0.5">Qty: {asset.quantity}</p>
                </td>
                <td className="px-6 py-4 text-[13px] text-slate-500 font-mono">{asset.assetId}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">Asset</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${conditionColor[asset.condition] ?? ''}`}>
                    {asset.condition}
                  </span>
                </td>
                <td className="px-6 py-4 text-[13px] text-slate-400">{asset.archivedAt ? formatDate(asset.archivedAt) : '—'}</td>
                <td className="px-6 py-4 text-right"><RestoreButton onClick={() => handleUnarchiveAsset(asset.assetId)} /></td>
              </tr>
            ))}
            {filteredConsumables.map(consumable => (
              <tr key={consumable._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-[14px] font-bold text-slate-900">{consumable.name}</p>
                  <p className="text-[12px] text-slate-400 mt-0.5">{consumable.unit} · Qty: {consumable.quantity}</p>
                </td>
                <td className="px-6 py-4 text-[13px] text-slate-500 font-mono">{consumable.consumableId}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-600">Consumable</span>
                </td>
                <td className="px-6 py-4 text-[13px] text-slate-600">{consumable.category}</td>
                <td className="px-6 py-4 text-[13px] text-slate-400">{consumable.archivedAt ? formatDate(consumable.archivedAt) : '—'}</td>
                <td className="px-6 py-4 text-right"><RestoreButton onClick={() => handleUnarchiveConsumable(consumable.consumableId)} /></td>
              </tr>
            ))}
          </>
        );

      case 'incidents':
        return filteredIncidents.map(incident => (
          <tr key={incident._id} className="hover:bg-slate-50/50 transition-colors">
            <td className="px-6 py-4">
              <p className="text-[14px] font-bold text-slate-900">{incident.title}</p>
              <p className="text-[12px] text-slate-400 mt-0.5 truncate max-w-[200px]">{incident.description}</p>
            </td>
            <td className="px-6 py-4 text-[13px] text-slate-500 font-mono">{incident.incidentId}</td>
            <td className="px-6 py-4 text-[13px] text-slate-600">{incident.area}</td>
            <td className="px-6 py-4">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${severityColor[incident.severity] ?? ''}`}>
                {incident.severity}
              </span>
            </td>
            <td className="px-6 py-4 text-[13px] text-slate-400">{incident.archivedAt ? formatDate(incident.archivedAt) : '—'}</td>
            <td className="px-6 py-4 text-right"><RestoreButton onClick={() => unarchiveIncident(incident.incidentId)} /></td>
          </tr>
        ));

      case 'lostfound':
        return filteredLostFound.map(item => (
          <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
            <td className="px-6 py-4">
              <p className="text-[14px] font-bold text-slate-900">{item.item}</p>
              {item.description && <p className="text-[12px] text-slate-400 mt-0.5 truncate max-w-[200px]">{item.description}</p>}
            </td>
            <td className="px-6 py-4 text-[13px] text-slate-500 font-mono">{item.lostId}</td>
            <td className="px-6 py-4 text-[13px] text-slate-600">{item.areaFound}</td>
            <td className="px-6 py-4">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                item.status === 'Claimed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
              }`}>
                {item.status}
              </span>
            </td>
            <td className="px-6 py-4 text-[13px] text-slate-400">{item.archivedAt ? formatDate(item.archivedAt) : '—'}</td>
            <td className="px-6 py-4 text-right"><RestoreButton onClick={() => unarchiveLostFound(item.lostId)} /></td>
          </tr>
        ));
    }
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
                {renderHeaders().map((header, idx, arr) => (
                  <th key={header} className={`px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest ${idx === arr.length - 1 ? 'text-right' : ''}`}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {renderRows()}
            </tbody>
          </table>

          {/* Empty State */}
          {!loading && getEmptyCount() === 0 && (
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