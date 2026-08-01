import React, { useState } from 'react';
import { SidebarNavigationSection } from '../../../components/SidebarNavigationSection';
import TaskStatsSection from './TaskStatsSection';
import TaskFilterSection from './MonitorFilterSection';
import TaskListSection from './TaskListSection';
import ReviewSubmissionsTab from './ReviewSubmissionsTab';
import { useAuth } from '../../../hooks/useAuth';
import { useTasks } from '../../../hooks/useTask';
import { useTaskLogs } from '../../../hooks/useTaskLog';
import { X, ZoomIn, SplitSquareHorizontal, Image as ImageIcon, Camera } from 'lucide-react';
import type { TaskLog } from '../../../types/task';

export const TaskMonitorPage: React.FC = () => {
  const { logs, loading: isLoading, handleComplete, handleGenerate } = useTaskLogs();
  const { handleArchive } = useTasks();
  const { role } = useAuth();

  const userRole = (role ?? 'custodian') as 'admin' | 'custodian';
  
  const [activeMainTab, setActiveMainTab] = useState<'monitor' | 'submissions'>('monitor');
  const [statusFilter, setStatusFilter] = useState('All Tasks');
  const [frequencyFilter, setFrequencyFilter] = useState('All');
  const [areaFilter, setAreaFilter] = useState('All Areas');
  const [searchTerm, setSearchTerm] = useState('');
  const [generateMessage, setGenerateMessage] = useState<string | null>(null);

  // Verification Side-by-Side Modal State for Task Logs
  const [verificationTask, setVerificationTask] = useState<TaskLog | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const handleGenerateClick = async () => {
    const result = await handleGenerate();
    if (result?.message) {
      setGenerateMessage(result.message);
      setTimeout(() => setGenerateMessage(null), 3000);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesStatus = statusFilter === 'All Tasks' ? true : log.status === statusFilter;
    const matchesFrequency = frequencyFilter === 'All' ? true : log.task?.frequency === frequencyFilter;
    const matchesArea = areaFilter === 'All Areas' ? true : log.task?.area === areaFilter;
    const matchesSearch = log.task?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesFrequency && matchesArea && matchesSearch;
  });

  const liveSubmittedPhotoUrl = verificationTask?.submittedPhoto;

  // extract reference photo URL safely from Cloudinary object or string fallback
  const referencePhotoUrl = verificationTask?.task?.standardPhotoUrl?.url || 
    (typeof verificationTask?.task?.standardPhotoUrl === 'string' ? verificationTask.task.standardPhotoUrl : null);

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <SidebarNavigationSection userRole={userRole} />
      
      <main className="flex-1 w-full overflow-y-auto">
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8">
          
          {/* Header & View Navigation Tabs */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#0f2942]">Task Tracking</h1>
              <p className="text-gray-500 text-sm mt-1">Live maintenance monitor & visual verification pipeline</p>
            </div>

            {/* Main Tabs Toggle */}
            <div className="flex gap-2 p-1.5 bg-gray-200/70 rounded-2xl w-fit">
              <button
                onClick={() => setActiveMainTab('monitor')}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  activeMainTab === 'monitor'
                    ? 'bg-[#113129] text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Live Monitor
              </button>
              <button
                onClick={() => setActiveMainTab('submissions')}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  activeMainTab === 'submissions'
                    ? 'bg-[#113129] text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Review Submissions
              </button>
            </div>
          </div>

          {activeMainTab === 'monitor' ? (
            <>
              <TaskStatsSection tasks={filteredLogs} />
              
              {generateMessage && (
                <div className="px-4 py-3.5 rounded-xl border border-green-200 bg-green-50 text-green-700 text-sm font-semibold">
                  {generateMessage}
                </div>
              )}

              <TaskFilterSection 
                onGenerate={handleGenerateClick}
                showGenerateButton={userRole === 'admin'}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                frequencyFilter={frequencyFilter}
                setFrequencyFilter={setFrequencyFilter}
                areaFilter={areaFilter}
                setAreaFilter={setAreaFilter}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />

              <TaskListSection 
                tasks={filteredLogs} 
                onToggleStatus={handleComplete} 
                onArchive={handleArchive} 
                onViewVerification={(taskLog) => setVerificationTask(taskLog)}
                isLoading={isLoading}
              />
            </>
          ) : (
            <ReviewSubmissionsTab />
          )}
        </div>
      </main>

      {/* Live Photo Verification Modal */}
      {verificationTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 space-y-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col font-sans">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{verificationTask.task.title}</h3>
                <p className="text-sm font-medium text-[#113129]">
                  Location: {verificationTask.task.area} • Completed By: {verificationTask.completedBy?.firstName || 'Custodian'}
                </p>
              </div>
              <button 
                onClick={() => setVerificationTask(null)}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 overflow-y-auto p-1">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Live Submitted Proof
                </span>
                {liveSubmittedPhotoUrl ? (
                  <div className="relative group rounded-2xl overflow-hidden border border-gray-200 aspect-video bg-gray-100">
                    <img 
                      src={liveSubmittedPhotoUrl} 
                      alt="Submitted Proof" 
                      className="w-full h-full object-cover" 
                    />
                    <button
                      type="button"
                      onClick={() => setLightboxOpen(true)}
                      className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all cursor-pointer"
                    >
                      <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={32} />
                    </button>
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                    <Camera size={32} className="mb-2 text-gray-300" />
                    <p className="text-sm font-medium">No live photo uploaded for this task yet.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => setVerificationTask(null)}
                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Viewer */}
      {lightboxOpen && referencePhotoUrl && (
        <div
          className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-8"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-white font-semibold">{verificationTask?.task?.title} — Reference Standard Preview</p>
              <button 
                onClick={() => setLightboxOpen(false)} 
                className="text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>
            <img 
              src={referencePhotoUrl} 
              alt="Fullscreen Preview" 
              className="w-full rounded-xl max-h-[75vh] object-contain bg-gray-900" 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskMonitorPage;