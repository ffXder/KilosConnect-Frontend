import React, { useEffect } from 'react';
import { ArrowLeft, X, MapPin, Clock, CheckCircle2, Circle, Camera, MessageSquare } from 'lucide-react';
import { formatTime } from './ReviewList';
import type { TaskLog, VerificationStatus } from '../../../../types/task';

export const badge = (status: VerificationStatus) => {
  switch (status) {
    case 'Verified':
      return { text: 'Verified', cls: 'bg-emerald-50 text-emerald-800 border-emerald-100 dark:bg-emerald-900 dark:text-emerald-200 dark:border-emerald-700' };
    case 'Pending Review':
      return { text: 'Awaiting review', cls: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-700' };
    case 'Disputed':
      return { text: 'Disputed', cls: 'bg-rose-50 text-rose-800 border-rose-100 dark:bg-rose-900/40 dark:text-rose-200 dark:border-rose-700' };
    case 'Rejected':
      return { text: 'Rejected', cls: 'bg-rose-50 text-rose-800 border-rose-100 dark:bg-rose-900/40 dark:text-rose-200 dark:border-rose-700' };
    default:
      return { text: 'Completed', cls: 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600' };
  }
};

interface SubmissionDetailViewProps {
  submission: TaskLog;
  onClose: () => void;
}

export default function SubmissionDetailView({ submission, onClose }: SubmissionDetailViewProps) {
  const b = badge(submission.verificationStatus);
  const checklist = submission.checklist ?? [];
  const done = checklist.filter((c) => c.isDone).length;
  const flagged =
    submission.verificationStatus === 'Disputed' || submission.verificationStatus === 'Rejected';

  // lock the page behind the overlay and close on Escape
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end font-['Poppins']"
      role="dialog"
      aria-modal="true"
    >
      <style>{`
        @keyframes sdv-in   { from { transform: translateX(100%); } to { transform: none; } }
        @keyframes sdv-fade { from { opacity: 0; } to { opacity: 1; } }
        .sdv-panel    { animation: sdv-in .3s cubic-bezier(.22,.8,.3,1) both; }
        .sdv-backdrop { animation: sdv-fade .3s ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          .sdv-panel, .sdv-backdrop { animation: none; }
        }
      `}</style>

      {/* Backdrop: hidden on phones (panel is full screen), click-to-close on desktop */}
      <div
        className="sdv-backdrop absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Panel: full screen on mobile, right-side drawer from md up */}
      <div className="sdv-panel relative flex flex-col w-full h-full md:max-w-xl lg:max-w-2xl bg-[#f8fafc] dark:bg-slate-950 md:shadow-2xl">

        {/* Header */}
        <div className="bg-[#0a2e27] text-white px-4 md:px-8 pb-4 md:pb-6 pt-[max(1rem,env(safe-area-inset-top))] md:pt-6 shrink-0">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="md:hidden flex items-center gap-2 text-white/80 active:text-white text-sm font-semibold -ml-1 py-1.5 pr-3"
            >
              <ArrowLeft size={20} /> Back
            </button>
            <span className="hidden md:block text-xs font-semibold uppercase tracking-wider text-white/70">
              Submission details
            </span>
            <button
              onClick={onClose}
              className="hidden md:flex p-1.5 -mr-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X size={22} />
            </button>
          </div>
          <h2 className="text-xl md:text-2xl font-bold mt-2 leading-snug">{submission.task.title}</h2>
          <span className={`inline-block mt-2 text-[11px] font-bold px-2.5 py-1 rounded-full border ${b.cls}`}>
            {b.text}
          </span>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-5 md:py-6 space-y-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">

          {/* Meta (side by side from md up) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-700 p-4 grid gap-3 md:grid-cols-2">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-50 dark:bg-emerald-900 text-[#0a2e27] dark:text-emerald-200 p-2 rounded-lg shrink-0">
                <MapPin size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500 dark:text-slate-400">Area</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{submission.task.area}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-emerald-50 dark:bg-emerald-900 text-[#0a2e27] dark:text-emerald-200 p-2 rounded-lg shrink-0">
                <Clock size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500 dark:text-slate-400">Submitted</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{formatTime(submission.completedAt)}</p>
              </div>
            </div>
          </div>

          {/* Review note (first when flagged, since it's what they need to see) */}
          {submission.verificationNote && (
            <div
              className={`rounded-2xl border p-4 ${
                flagged
                  ? 'bg-rose-50 border-rose-100 text-rose-800 dark:bg-rose-900/30 dark:border-rose-700 dark:text-rose-200'
                  : 'bg-white border-gray-100 text-gray-700 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300'
              }`}
            >
              <p className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 mb-1.5">
                <MessageSquare size={14} />
                {submission.verifiedBy
                  ? `Note from ${submission.verifiedBy.firstName}`
                  : 'Review note'}
              </p>
              <p className="text-sm font-medium leading-relaxed">{submission.verificationNote}</p>
            </div>
          )}

          {/* Photo */}
          <div>
            <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Camera size={14} /> Your Submission Photo
            </p>
            {submission.submittedPhoto ? (
              <img
                src={submission.submittedPhoto}
                alt="Your submission"
                className="w-full max-h-72 md:max-h-96 object-cover rounded-2xl bg-gray-900"
              />
            ) : (
              <div className="bg-gray-100 dark:bg-slate-800 rounded-2xl h-32 flex items-center justify-center text-gray-400 dark:text-slate-500 text-sm font-medium">
                No photo submitted
              </div>
            )}
          </div>

          {/* Checklist */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                Checklist
              </p>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded dark:bg-emerald-900 dark:text-emerald-200 dark:border-emerald-700">
                {done}/{checklist.length} done
              </span>
            </div>
            <div className="space-y-2">
              {checklist.length === 0 && (
                <p className="text-sm text-gray-400 dark:text-slate-500 font-medium">No checklist items.</p>
              )}
              {checklist.map((item, i) => (
                <div
                  key={item._id ?? i}
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
        </div>
      </div>
    </div>
  );
}