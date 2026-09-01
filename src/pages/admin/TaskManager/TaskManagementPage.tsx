import React, { useState } from 'react';
import { SidebarNavigationSection } from '../../../components/SidebarNavigationSection';
import TaskFilterSection from './TaskFilterSection';
import TaskManagementSection from './TaskTableSection';
import AddTaskModal from './AddITaskModals';
import { useAuth } from '../../../hooks/useAuth';
import { useTasks } from '../../../hooks/useTask';
import type { Task } from '../../../types/task';
import { useSearchParams } from 'react-router-dom';
import { QrCode, Download, X, Check, Printer } from 'lucide-react';

// List of facility areas (matches your zones)
const AREAS = [
  "Mezzanine", 
  "Powerlifting Area", 
  "Open WOD Area", 
  "CrossFit Area", 
  "Weightlifting Area", 
  "General Storage", 
  "Maintenance Storage", 
  "Multiple Area", 
  "Front Desk Area", 
  "Outdoor Area", 
  "CR", 
  "1st Floor", 
  "2nd Floor"
];

// Helper to generate a clean QR Code Image URL for downloading/displaying
const getQrImageUrl = (areaName: string) => {
  const encodedData = encodeURIComponent(`AREA:${areaName}`);
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedData}&margin=10`;
};

export const TaskManagementPage: React.FC = () => {
  const { tasks, loading, handleCreate, handleUpdate, handleArchive } = useTasks();
  const { role } = useAuth();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [downloadingAll, setDownloadingAll] = useState(false);

  // URL search params
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get('q') ?? '';
  const selectedFrequency = searchParams.get('frequency') ?? 'All';
  const selectedArea = searchParams.get('area') ?? 'All Areas';

  const updateParam = (key: string, value: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (!value || value === 'All' || value === 'All Areas') {
      nextParams.delete(key);
    } else {
      nextParams.set(key, value);
    }
    setSearchParams(nextParams);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFrequency = selectedFrequency === 'All' ? true : task.frequency === selectedFrequency;
    const matchesArea = selectedArea === 'All Areas' ? true : task.area === selectedArea;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFrequency && matchesArea && matchesSearch;
  });

  // Download a single area QR code
  const downloadSingleQR = async (areaName: string) => {
    try {
      const url = getQrImageUrl(areaName);
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `QR_${areaName.replace(/\s+/g, '_')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Failed to download QR code:', err);
    }
  };

  // Download all area QR codes sequentially
  const handleDownloadAll = async () => {
    setDownloadingAll(true);
    for (const area of AREAS) {
      await downloadSingleQR(area);
      // Brief pause between downloads to prevent browser blocking multiple popups
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
    setDownloadingAll(false);
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-slate-950 transition-color duration-300">
      <SidebarNavigationSection userRole={(role ?? 'custodian') as 'admin' | 'custodian'} />
      <main className="flex-1 w-full overflow-hidden">
        <div className="p-8 max-w-[1600px] mx-auto space-y-8">
          
          {/* Header & QR Action */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="[font-family:'Poppins',Helvetica] text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-tight dark:text-slate-50 font-bold">Manage Tasks</h1>
            
            {/* Admin-only QR Code Action Button */}
            {role === 'admin' && (
              <button
                onClick={() => setIsQrModalOpen(true)}
                className="bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 px-5 py-3 rounded-[16px] text-[14px] font-bold flex items-center gap-2.5 transition-all shadow-sm active:scale-95 cursor-pointer dark:bg-slate-950 transition-color duration-300 dark:border-slate-600"
              >
                <QrCode size={18} className="text-[#113129] dark:text-slate-50" />
                <span className='dark:text-slate-50'>Area QR Codes</span>
              </button>
            )}
          </div>
          
          <TaskFilterSection 
            onAddTask={() => {
              setEditingTask(null);
              setIsModalOpen(true);
            }}
            showAddButton={true}
            hideStatus={true}
            searchTerm={searchTerm}
            setSearchTerm={(val) => updateParam('q', val)}
            frequencyFilter={selectedFrequency}
            setFrequencyFilter={(val) => updateParam('frequency', val)}
            areaFilter={selectedArea}
            setAreaFilter={(val) => updateParam('area', val)}
            statusFilter="" 
            setStatusFilter={() => {}}
          />

          <TaskManagementSection 
            tasks={filteredTasks} 
            onArchive={handleArchive} 
            loading={loading} 
            onEdit={(t) => { setEditingTask(t); setIsModalOpen(true); }} 
          />
        </div>

        {/* Task Creation / Editing Modal */}
        <AddTaskModal 
          isOpen={isModalOpen} 
          onClose={() => { setEditingTask(null); setIsModalOpen(false); }} 
          onCreate={editingTask ? (d) => handleUpdate(editingTask._id, d) : handleCreate}
          onSuccess={() => {}}
          initialData={editingTask}
        />

        {/* Area QR Codes Modal */}
        {isQrModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
            <div className="bg-white rounded-[28px] max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100">
              
              {/* Modal Header */}
              <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
                    <QrCode className="text-[#113129]" size={26} />
                    Facility Area QR Codes
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Print and post these QR codes in their respective facility zones for quick custodian scanning.
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleDownloadAll}
                    disabled={downloadingAll}
                    className="bg-[#113129] text-white px-5 py-2.5 rounded-[14px] text-sm font-semibold flex items-center gap-2 hover:bg-[#0a211b] transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <Download size={16} />
                    <span>{downloadingAll ? 'Downloading...' : 'Download All'}</span>
                  </button>
                  
                  <button
                    onClick={() => setIsQrModalOpen(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* QR Codes Grid */}
              <div className="p-6 md:p-8 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 bg-[#f8fafc]">
                {AREAS.map((area) => (
                  <div
                    key={area}
                    className="bg-white p-5 rounded-[20px] border border-gray-200/80 shadow-xs flex flex-col items-center hover:border-gray-300 transition-all group"
                  >
                    <div className="bg-gray-50 p-3 rounded-[16px] border border-gray-100 mb-4 w-full flex items-center justify-center">
                      <img
                        src={getQrImageUrl(area)}
                        alt={`QR Code for ${area}`}
                        className="w-44 h-44 object-contain"
                        loading="lazy"
                      />
                    </div>
                    
                    <span className="font-bold text-gray-800 text-center text-sm mb-4 line-clamp-1">
                      {area}
                    </span>

                    <button
                      onClick={() => downloadSingleQR(area)}
                      className="w-full mt-auto py-2.5 px-4 bg-slate-100 hover:bg-[#113129] hover:text-white text-gray-700 text-xs font-semibold rounded-[12px] flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Download size={14} />
                      <span>Download QR</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => setIsQrModalOpen(false)}
                  className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-[12px] hover:bg-gray-50 text-sm transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TaskManagementPage;