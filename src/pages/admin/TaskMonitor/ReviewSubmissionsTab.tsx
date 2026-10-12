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
  MessageSquare,
  ImageOff,
  PartyPopper
} from 'lucide-react';
import { useTaskModeration } from '../../../hooks/useTaskModeration';
import type { TaskLog } from '../../../types/task';

/* Keyframes live here so no Tailwind config changes are needed */
const AnimationStyles = () => (
  <style>{`
    @keyframes rs-fade-in { from { opacity: 0 } to { opacity: 1 } }
    @keyframes rs-pop-in { from { opacity: 0; transform: scale(.95) translateY(8px) } to { opacity: 1; transform: scale(1) translateY(0) } }
    @keyframes rs-row-in { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }
    @keyframes rs-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
    .rs-fade-in { animation: rs-fade-in .2s ease-out both }
    .rs-pop-in { animation: rs-pop-in .25s cubic-bezier(.16,1,.3,1) both }
    .rs-row-in { animation: rs-row-in .35s ease-out both }
    .rs-float { animation: rs-float 2.5s ease-in-out infinite }
  `}</style>
);

const getReferenceUrl = (log: TaskLog): string | null => {
  const s = (log.task as any)?.standardPhotoUrl;
  return typeof s === 'string' ? s : s?.url || null;
};

const PhotoFallback = ({ className = '' }: { className?: string }) => (
  <div className={`flex items-center justify-center bg-slate-100 text-slate-300 dark:bg-slate-800 dark:text-slate-600 ${className}`}>
    <ImageOff size={22} />
  </div>
);

export const ReviewSubmissionsTab: React.FC = () => {
  const { disputedQueue, loading, error, refresh, resolve } = useTaskModeration();

  const [selectedSub, setSelectedSub] = useState<TaskLog | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [targetLogId, setTargetLogId] = useState<string | null>(null);
  const [resolutionType, setResolutionType] = useState<'APPROVE' | 'REJECT'>('APPROVE');
  const [adminNote, setAdminNote] = useState('');

  const handleDirectApprove = async (logId: string) => {
    setIsActionLoading(true);
    try {
      await resolve(logId, 'APPROVE', 'Approved by admin review.');
      if (selectedSub?._id === logId) setSelectedSub(null);
    } catch (err) {
      console.error('Failed to approve dispute resolution:', err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const openResolveModal = (logId: string, type: 'APPROVE' | 'REJECT') => {
    setTargetLogId(logId);
    setResolutionType(type);
    setAdminNote('');
    setIsResolveModalOpen(true);
  };

  const handleModalSubmit = async () => {
    if (!targetLogId) return;
    setIsActionLoading(true);
    try {
      await resolve(targetLogId, resolutionType, adminNote.trim() || undefined);
      if (selectedSub?._id === targetLogId) setSelectedSub(null);
      setIsResolveModalOpen(false);
      setTargetLogId(null);
    } catch (err) {
      console.error('Failed to submit resolution:', err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const referenceUrl = selectedSub ? getReferenceUrl(selectedSub) : null;

  return (
    <div className="space-y-6">
      <AnimationStyles />

      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden dark:bg-slate-900 transition-colors duration-300 dark:border-slate-700">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex flex-wrap gap-4 justify-between items-center dark:border-slate-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">Admin Task Moderation Queue</h2>
            <p className="text-sm text-gray-500 mt-0.5 dark:text-slate-300">
              Review and resolve disputed tasks flagged by custodians or peers.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={refresh}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer dark:text-slate-300 dark:hover:text-slate-50 dark:hover:bg-slate-800"
              title="Refresh Queue"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-full border border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-700">
              {disputedQueue.length > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
              )}
              {disputedQueue.length} Disputed
            </span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rs-fade-in p-4 bg-rose-50 border-b border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300">
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Content */}
        {loading && disputedQueue.length === 0 ? (
          <div className="divide-y divide-gray-100 dark:divide-slate-700">
            {[0, 1, 2].map((i) => (
              <div key={i} className="p-6 flex items-center gap-4 animate-pulse">
                <div className="w-14 h-14 rounded-xl bg-slate-200 dark:bg-slate-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="h-3 w-1/4 rounded bg-slate-100 dark:bg-slate-800" />
                </div>
              </div>
            ))}
          </div>
        ) : disputedQueue.length === 0 ? (
          <div className="rs-fade-in p-14 flex flex-col items-center text-center">
            <div className="rs-float w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 dark:bg-emerald-950/40 dark:text-emerald-400">
              <PartyPopper size={28} />
            </div>
            <p className="font-bold text-slate-800 dark:text-slate-100">All clear!</p>
            <p className="text-sm text-slate-400 dark:text-slate-300">No disputed tasks waiting for admin resolution.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-300">
                  <th className="py-3.5 px-4 md:px-6">Proof</th>
                  <th className="py-3.5 px-4">Task</th>
                  <th className="py-3.5 px-4">Submitted By</th>
                  <th className="py-3.5 px-4">Dispute Reason</th>
                  <th className="py-3.5 px-4 text-right md:pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm dark:divide-slate-700">
                {disputedQueue.map((sub, i) => (
                  <tr
                    key={sub._id}
                    onClick={() => setSelectedSub(sub)}
                    style={{ animationDelay: `${i * 60}ms` }}
                    className="rs-row-in group cursor-pointer hover:bg-slate-50/80 transition-colors dark:hover:bg-slate-800/60"
                  >
                    <td className="py-4 px-4 md:px-6">
                      {sub.submittedPhoto ? (
                        <img
                          src={sub.submittedPhoto}
                          alt="Proof"
                          className="w-14 h-14 rounded-xl object-cover border border-gray-200 transition-transform duration-200 group-hover:scale-105 dark:border-slate-600"
                        />
                      ) : (
                        <PhotoFallback className="w-14 h-14 rounded-xl" />
                      )}
                    </td>

                    <td className="py-4 px-4 max-w-xs">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {sub.task?.title || 'Untitled Task'}
                        </span>
                        <span className="text-xs font-medium text-indigo-600 dark:text-indigo-300">
                          {sub.task?.area || 'General Area'}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-slate-700 font-semibold text-xs dark:text-slate-200">
                      {sub.completedBy?.firstName || 'Custodian'}
                    </td>

                    <td className="py-4 px-4 max-w-sm">
                      {sub.verificationNote ? (
                        <span className="inline-flex items-start gap-1.5 text-xs font-medium text-purple-800 bg-purple-50 border border-purple-200 rounded-lg px-2.5 py-1.5 dark:bg-purple-950/40 dark:text-purple-200 dark:border-purple-700">
                          <AlertTriangle size={13} className="shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{sub.verificationNote}</span>
                        </span>
                      ) : (
                        <span className="text-xs text-slate-300 dark:text-slate-600">—</span>
                      )}
                    </td>

                    <td className="py-4 px-4 md:pr-6 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedSub(sub)}
                          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer dark:hover:text-slate-100 dark:hover:bg-slate-800"
                          title="Inspect"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => openResolveModal(sub._id, 'REJECT')}
                          disabled={isActionLoading}
                          className="inline-flex items-center gap-1 px-3 py-1.5 border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-bold transition-all active:scale-95 disabled:opacity-50 cursor-pointer dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950/70"
                        >
                          <XCircle size={14} />
                          Reject
                        </button>
                        <button
                          onClick={() => handleDirectApprove(sub._id)}
                          disabled={isActionLoading}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                        >
                          <CheckCircle2 size={14} />
                          Approve
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* INSPECT MODAL */}
      {selectedSub && (
        <div
          className="rs-fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
          onClick={() => setSelectedSub(null)}
        >
          <div
            className="rs-pop-in bg-white rounded-3xl max-w-4xl w-full p-6 space-y-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-transparent dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-slate-200 pb-4 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-100 text-purple-700 rounded-2xl dark:bg-purple-900/40 dark:text-purple-300">
                  <ShieldAlert size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100">{selectedSub.task?.title}</h3>
                  <p className="text-sm font-medium text-indigo-600 dark:text-indigo-300">
                    Location: {selectedSub.task?.area} • Submitted by {selectedSub.completedBy?.firstName || 'Custodian'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSub(null)}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            {selectedSub.verificationNote && (
              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex items-start gap-3 dark:bg-purple-950/40 dark:border-purple-700">
                <AlertTriangle size={18} className="text-purple-700 shrink-0 mt-0.5 dark:text-purple-300" />
                <div>
                  <p className="font-bold text-purple-900 text-sm dark:text-purple-200">Dispute Detail:</p>
                  <p className="text-sm text-purple-700 dark:text-purple-300">{selectedSub.verificationNote}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto p-1">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                  Reference Standard Photo
                </span>
                <div className="aspect-video rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700">
                  {referenceUrl ? (
                    <img src={referenceUrl} alt="Basis Reference" className="w-full h-full object-cover" />
                  ) : (
                    <PhotoFallback className="w-full h-full" />
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  Expected setup for this zone.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-300">
                  Custodian Live Proof Submission
                </span>
                <div className="aspect-video rounded-2xl overflow-hidden border-2 border-indigo-500 shadow-inner">
                  {selectedSub.submittedPhoto ? (
                    <img src={selectedSub.submittedPhoto} alt="Submission Proof" className="w-full h-full object-cover" />
                  ) : (
                    <PhotoFallback className="w-full h-full" />
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  Snapshot captured on-site during task wrap-up.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setSelectedSub(null)}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors cursor-pointer dark:bg-slate-800 dark:border-slate-600 dark:text-slate-50 dark:hover:bg-slate-700"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => openResolveModal(selectedSub._id, 'REJECT')}
                disabled={isActionLoading}
                className="px-5 py-2.5 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 rounded-xl font-bold transition-all active:scale-95 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950/70"
              >
                <XCircle size={18} />
                <span>Reject Dispute</span>
              </button>
              <button
                type="button"
                onClick={() => openResolveModal(selectedSub._id, 'APPROVE')}
                disabled={isActionLoading}
                className="px-5 py-2.5 bg-emerald-700 text-white rounded-xl font-bold hover:bg-emerald-800 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <CheckCircle2 size={18} />
                <span>Approve Dispute</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESOLUTION MODAL */}
      {isResolveModalOpen && (
        <div
          className="rs-fade-in fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
          onClick={() => setIsResolveModalOpen(false)}
        >
          <div
            className="rs-pop-in bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-transparent dark:bg-slate-900 dark:border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3 dark:border-slate-700">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  resolutionType === 'APPROVE'
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                    : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                }`}
              >
                {resolutionType === 'APPROVE' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">
                  {resolutionType === 'APPROVE' ? 'Approve Task Submission' : 'Reject Task Submission'}
                </h3>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  Provide optional context or notes for the log record.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5 dark:text-slate-300">
                <MessageSquare size={14} />
                <span>Admin Resolution Note</span>
              </label>
              <textarea
                rows={3}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder={
                  resolutionType === 'APPROVE'
                    ? 'Optional note (e.g. Verified layout meets standards).'
                    : 'Explain why this submission was rejected...'
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm outline-none resize-none dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
            </div>

            <div className="flex gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setIsResolveModalOpen(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors cursor-pointer dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleModalSubmit}
                disabled={isActionLoading}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-white rounded-xl font-bold disabled:opacity-50 transition-all active:scale-95 cursor-pointer ${
                  resolutionType === 'APPROVE' ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {isActionLoading && <Loader2 size={16} className="animate-spin" />}
                {isActionLoading ? 'Saving...' : `Confirm ${resolutionType === 'APPROVE' ? 'Approval' : 'Rejection'}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewSubmissionsTab;