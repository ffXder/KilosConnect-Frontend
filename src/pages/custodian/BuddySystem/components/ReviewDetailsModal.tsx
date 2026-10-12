import React, { useState, useEffect, useRef } from 'react';
import {
  X, MapPin, Camera, CheckCircle2, Circle,
  ShieldAlert, Flag, ArrowLeft, AlertTriangle
} from 'lucide-react';
import type { TaskLog } from '../../../../types/task';
import { formatTime } from './ReviewList';
import { useAuth } from '../../../../hooks/useAuth';

interface ReviewDetailViewProps {
  review: TaskLog;
  submitting: boolean;
  onApprove: (logId: string, note?: string) => Promise<void>;
  onDispute: (logId: string, reason: string) => Promise<void>;
  onClose: () => void;
}

export default function ReviewDetailView({
  review, submitting, onApprove, onDispute, onClose
}: ReviewDetailViewProps) {
  const [isFlagging, setIsFlagging] = useState(false);
  const [flagDescription, setFlagDescription] = useState('');
  const { user } = useAuth();

  const checklist = review.checklist ?? [];
  const done = checklist.filter((c) => c.isDone).length;
  const area = review.task.area;
  const custodian = review.completedBy
    ? `${review.completedBy.firstName} ${review.completedBy.lastName ?? ''}`.trim()
    : 'Unknown';

  // lock page scroll + close on Escape (ref keeps the listener from re-subscribing every render)
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCloseRef.current();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const handleApprove = async () => {
    try {
      await onApprove(review._id);
      onClose();
    } catch (e) {
      alert((e as Error).message);
    }
  };

  const handleSubmitFlag = async () => {
    if (!flagDescription.trim()) return;
    try {
      await onDispute(review._id, flagDescription.trim());
      onClose();
    } catch (e) {
      alert((e as Error).message);
    }
  };

  const headerBg = isFlagging ? 'bg-rose-700' : 'bg-[#0a2e27]';

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-['Poppins']" role="dialog" aria-modal="true">
      <style>{`
        @keyframes rdv-in   { from { transform: translateX(100%); } to { transform: none; } }
        @keyframes rdv-fade { from { opacity: 0; } to { opacity: 1; } }
        .rdv-panel    { animation: rdv-in .3s cubic-bezier(.22,.8,.3,1) both; will-change: transform; }
        .rdv-backdrop { animation: rdv-fade .3s ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          .rdv-panel, .rdv-backdrop { animation: none; }
        }
      `}</style>

      {/* Backdrop (desktop: click to close) */}
      <div className="rdv-backdrop absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Panel: full screen on mobile, right drawer from md up */}
      <div className="rdv-panel relative flex flex-col w-full h-full md:max-w-xl lg:max-w-2xl bg-[#f8fafc] dark:bg-slate-950 md:shadow-xl">

        {/* Header */}
        <div className={`${headerBg} text-white px-4 md:px-8 pb-4 md:pb-6 pt-[max(1rem,env(safe-area-inset-top))] md:pt-6 shrink-0 transition-colors duration-300`}>
          <div className="flex items-center justify-between">
            <button
              onClick={isFlagging ? () => setIsFlagging(false) : onClose}
              className="flex items-center gap-2 text-white/80 active:text-white hover:text-white text-sm font-semibold -ml-1 py-1.5 pr-3"
            >
              <ArrowLeft size={20} /> Back
            </button>
            <button
              onClick={onClose}
              className="hidden md:flex p-1.5 -mr-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X size={22} />
            </button>
          </div>

          {isFlagging ? (
            <>
              <h2 className="text-xl md:text-2xl font-bold mt-2 flex items-center gap-2">
                <Flag size={22} /> Flag Issue
              </h2>
              <p className="text-sm text-rose-100/90 mt-1">{area} · Notify Admin</p>
            </>
          ) : (
            <>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/70 mt-2">
                Submitted task details
              </p>
              <h2 className="text-xl md:text-2xl font-bold mt-1 leading-snug">{review.task.title}</h2>
            </>
          )}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-5 md:py-6 space-y-5">
          {isFlagging ? (
            <>
              <div className="bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-900/30 dark:border-rose-700 dark:text-rose-200 p-3.5 rounded-xl text-xs font-medium flex items-center gap-2.5">
                <AlertTriangle size={18} className="shrink-0 text-rose-600 dark:text-rose-300" />
                <span>Explain what is wrong with this submission. An admin will review the dispute.</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Reason <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={5}
                  value={flagDescription}
                  onChange={(e) => setFlagDescription(e.target.value)}
                  placeholder="Briefly describe what needs attention or why the work is not acceptable..."
                  className="w-full rounded-xl border border-gray-200 dark:border-slate-700 p-3 text-base focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none bg-white dark:bg-slate-900 dark:text-white"
                />
              </div>
            </>
          ) : (
            <>
              {/* Meta */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-700 p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="bg-emerald-50 dark:bg-emerald-900 text-[#0a2e27] dark:text-emerald-200 p-2 rounded-lg shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-900 dark:text-white truncate">{area}</h3>
                    <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                      {custodian} · {formatTime(review.completedAt)}
                    </p>
                  </div>
                </div>
                <span className="text-emerald-700 dark:text-emerald-200 font-bold text-sm bg-emerald-50 dark:bg-emerald-900 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-700 shrink-0">
                  {done}/{checklist.length}
                </span>
              </div>

              {/* Submission photo */}
              <div>
                <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Camera size={14} /> Custodian Submission Photo
                </p>
                {review.submittedPhoto ? (
                  <div className="relative rounded-2xl overflow-hidden bg-gray-900">
                    <img
                      src={review.submittedPhoto}
                      alt="Submission"
                      decoding="async"
                      className="w-full max-h-72 md:max-h-96 object-cover"
                    />
                    <div className="absolute bottom-3 right-3 bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <CheckCircle2 size={14} /> Live Capture
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-100 dark:bg-slate-800 rounded-2xl h-40 flex items-center justify-center text-gray-400 dark:text-slate-500 text-sm font-medium">
                    No photo submitted
                  </div>
                )}
              </div>

              {/* Checklist */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                    Maintenance Checklist
                  </p>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-900 border border-emerald-100 dark:border-emerald-700 px-2 py-0.5 rounded">
                    {done}/{checklist.length} done
                  </span>
                </div>
                <div className="space-y-2">
                  {checklist.length === 0 && (
                    <p className="text-sm text-gray-400 dark:text-slate-500 font-medium">No checklist items.</p>
                  )}
                  {checklist.map((item, index) => (
                    <div
                      key={item._id ?? index}
                      className={`flex items-center gap-3 p-3.5 border rounded-xl ${
                        item.isDone
                          ? 'bg-emerald-50/50 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800'
                          : 'bg-white border-gray-200 dark:bg-slate-900 dark:border-slate-700'
                      }`}
                    >
                      {item.isDone
                        ? <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                        : <Circle size={18} className="text-gray-300 dark:text-slate-600 shrink-0" />}
                      <span className="text-sm font-medium text-gray-700 dark:text-slate-200">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Accountability */}
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-3 flex items-center gap-3">
                <ShieldAlert size={16} className="text-gray-400 shrink-0" />
                <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                  Your action will be permanently logged under{' '}
                  <span className="font-bold text-gray-700 dark:text-slate-200">{user?.userId}</span>
                </p>
              </div>
            </>
          )}
        </div>

        {/* Pinned action bar */}
        <div className="shrink-0 px-4 md:px-8 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:pb-4 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-700">
          {isFlagging ? (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsFlagging(false)}
                className="flex-1 py-3.5 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-slate-200 font-bold rounded-xl text-sm active:bg-gray-50 dark:active:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitFlag}
                disabled={!flagDescription.trim() || submitting}
                className="flex-[2] bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition text-sm flex items-center justify-center gap-2"
              >
                <Flag size={18} />
                {submitting ? 'Submitting...' : 'Notify Admin'}
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleApprove}
                disabled={submitting}
                className="flex-1 bg-[#0a2e27] hover:bg-[#08241f] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition flex justify-center items-center gap-2"
              >
                <CheckCircle2 size={20} />
                {submitting ? 'Saving...' : 'Looks Good'}
              </button>
              <button
                onClick={() => setIsFlagging(true)}
                disabled={submitting}
                className="flex-1 bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 disabled:opacity-50 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-700 font-bold py-3.5 rounded-xl transition flex justify-center items-center gap-2"
              >
                <Flag size={20} />
                Flag Issue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}