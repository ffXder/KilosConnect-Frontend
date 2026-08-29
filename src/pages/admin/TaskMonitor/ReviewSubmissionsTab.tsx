import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Eye, 
  X, 
  AlertTriangle, 
  ShieldAlert, 
  Loader2,
  RefreshCw,
  XCircle,
  MessageSquare
} from 'lucide-react';
import { useTaskModeration } from '../../../hooks/useTaskModeration'
import type { TaskLog } from '../../../types/task';

export const ReviewSubmissionsTab: React.FC = () => {
  const { 
    disputedQueue, 
    loading, 
    error, 
    refresh, 
    resolve 
  } = useTaskModeration();

  // Local UI State
  const [selectedSub, setSelectedSub] = useState<TaskLog | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  
  // Resolution Modal State (Reject / Custom Note)
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [targetLogId, setTargetLogId] = useState<string | null>(null);
  const [resolutionType, setResolutionType] = useState<'APPROVE' | 'REJECT'>('APPROVE');
  const [adminNote, setAdminNote] = useState<string>('');

  // Handle Direct Approval
  const handleDirectApprove = async (logId: string) => {
    setIsActionLoading(true);
    try {
      await resolve(logId, 'APPROVE', 'Approved by admin review.');
      if (selectedSub?._id === logId) {
        setSelectedSub(null);
      }
    } catch (err) {
      console.error("Failed to approve dispute resolution:", err);
    } finally {
      setIsActionLoading(false);
    }
  };

  // Open Resolution Modal for Rejection or Adding Notes
  const openResolveModal = (logId: string, type: 'APPROVE' | 'REJECT') => {
    setTargetLogId(logId);
    setResolutionType(type);
    setAdminNote('');
    setIsResolveModalOpen(true);
  };

  // Submit Resolution with Admin Note
  const handleModalSubmit = async () => {
    if (!targetLogId) return;

    setIsActionLoading(true);
    try {
      await resolve(targetLogId, resolutionType, adminNote.trim() || undefined);
      if (selectedSub?._id === targetLogId) {
        setSelectedSub(null);
      }
      setIsResolveModalOpen(false);
      setTargetLogId(null);
    } catch (err) {
      console.error("Failed to submit resolution:", err);
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex flex-wrap gap-4 justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Admin Task Moderation Queue</h2>
            <p className="text-sm text-gray-500 mt-0.5">Review and resolve disputed tasks flagged by custodians or peers.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={refresh}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              title="Refresh Queue"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-full border border-purple-200">
              {disputedQueue.length} Disputed Queue
            </span>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 bg-rose-50 border-b border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Content Queue */}
        {loading && disputedQueue.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-2" />
            <p className="text-xs font-medium">Loading disputed tasks for moderation review...</p>
          </div>
        ) : disputedQueue.length === 0 ? (
          <div className="p-12 text-center text-slate-400 font-medium text-sm">
            All clear! No disputed tasks waiting for admin resolution.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {disputedQueue.map((sub) => (
              <div key={sub._id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-start space-x-4">
                  <img 
                    src={sub.submittedPhoto || 'https://via.placeholder.com/150'} 
                    alt="Submission Proof" 
                    className="w-20 h-20 rounded-xl object-cover border border-gray-200 shadow-xs shrink-0" 
                  />
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-bold text-gray-900">{sub.task?.title || 'Untitled Task'}</h3>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 flex items-center gap-1">
                        <ShieldAlert size={12} />
                        <span>Disputed</span>
                      </span>
                    </div>
                    <p className="text-sm font-medium text-indigo-600">{sub.task?.area || 'General Area'}</p>
                    <p className="text-xs text-gray-500">
                      Submitted by <span className="font-semibold text-gray-700">
                        {sub.completedBy ? `${sub.completedBy.firstName}` : 'Custodian'}
                      </span>
                    </p>

                    {sub.verificationNote && (
                      <div className="text-xs p-2.5 rounded-xl mt-2 bg-purple-50 text-purple-900 border border-purple-200 font-medium flex items-start gap-2">
                        <AlertTriangle size={14} className="shrink-0 mt-0.5 text-purple-700" />
                        <div>
                          <strong>Dispute Reason:</strong> {sub.verificationNote}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-end md:self-center">
                  <button
                    onClick={() => setSelectedSub(sub)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Eye size={16} />
                    <span>Inspect</span>
                  </button>

                  <button
                    onClick={() => openResolveModal(sub._id, 'REJECT')}
                    disabled={isActionLoading}
                    className="px-4 py-2 border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl text-sm font-bold transition-all shadow-xs disabled:opacity-50 flex items-center gap-1 cursor-pointer"
                  >
                    <XCircle size={16} />
                    <span>Reject</span>
                  </button>
                  
                  <button
                    onClick={() => handleDirectApprove(sub._id)}
                    disabled={isActionLoading}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-bold transition-all shadow-xs flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    <CheckCircle2 size={16} />
                    <span>Approve</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* INSPECT MODAL */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 space-y-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-100 text-purple-700 rounded-2xl">
                  <ShieldAlert size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedSub.task?.title}</h3>
                  <p className="text-sm font-medium text-indigo-600">
                    Location: {selectedSub.task?.area} • Submitted by {selectedSub.completedBy?.firstName || 'Custodian'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedSub(null)}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {selectedSub.verificationNote && (
              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex items-start gap-3 text-purple-900 text-xs">
                <AlertTriangle size={18} className="text-purple-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-purple-900 text-sm">Dispute Detail</p>
                  <p className="mt-0.5 leading-relaxed">{selectedSub.verificationNote}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto p-1">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Reference Standard Photo</span>
                <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
                  <img 
                    src={""} 
                    alt="Basis Reference" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <p className="text-xs text-gray-500">Expected layout configuration setup for this specific zone.</p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Custodian Live Proof Submission</span>
                <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden border-2 border-indigo-500 shadow-inner">
                  <img 
                    src={`${selectedSub.submittedPhoto}`} 
                    alt="Submission Proof" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <p className="text-xs text-gray-500">Uploaded snapshot captured on-site during task wrap-up.</p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => setSelectedSub(null)}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Close
              </button>
              
              <button
                type="button"
                onClick={() => openResolveModal(selectedSub._id, 'REJECT')}
                disabled={isActionLoading}
                className="px-5 py-2.5 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 rounded-xl font-bold transition-all flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer"
              >
                <XCircle size={18} />
                <span>Reject Dispute</span>
              </button>

              <button
                type="button"
                onClick={() => openResolveModal(selectedSub._id, 'APPROVE')}
                disabled={isActionLoading}
                className="px-5 py-2.5 bg-emerald-700 text-white rounded-xl font-bold hover:bg-emerald-800 shadow-xs transition-all flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                <CheckCircle2 size={18} />
                <span>Approve Dispute</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESOLUTION MODAL WITH ADMIN NOTE */}
      {isResolveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center space-x-3 border-b pb-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                resolutionType === 'APPROVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
              }`}>
                {resolutionType === 'APPROVE' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {resolutionType === 'APPROVE' ? 'Approve Task Submission' : 'Reject Task Submission'}
                </h3>
                <p className="text-xs text-gray-500">Provide optional context or administrative notes for the log record.</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                <MessageSquare size={14} />
                <span>Admin Resolution Note</span>
              </label>
              <textarea
                rows={3}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder={
                  resolutionType === 'APPROVE' 
                    ? "Optional note (e.g. Verified layout meets acceptable tolerance standards)."
                    : "Explain why this submission was rejected..."
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm outline-none resize-none"
              />
            </div>

            <div className="flex space-x-3 pt-2 border-t">
              <button
                type="button"
                onClick={() => setIsResolveModalOpen(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleModalSubmit}
                disabled={isActionLoading}
                className={`flex-1 px-4 py-2.5 text-white rounded-xl font-bold disabled:opacity-50 shadow-xs transition-colors cursor-pointer ${
                  resolutionType === 'APPROVE' ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {isActionLoading ? "Saving..." : `Confirm ${resolutionType === 'APPROVE' ? 'Approval' : 'Rejection'}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewSubmissionsTab;