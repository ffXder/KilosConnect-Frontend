import React, { useState } from 'react';
import { X, Clock, MapPin, Camera, ZoomIn } from 'lucide-react';
import { VerificationBadge } from './VerificationBadge';
import type { TaskLog } from '../../../types/task';
import { formatTo12Hour, formatDateTime } from '../../../utils/formatter';

interface Props {
  log: TaskLog;
  onClose: () => void;
}

const Row = ({ label, value }: { label: string; value?: React.ReactNode }) => (
  <div className="flex justify-between text-sm py-2 border-b border-slate-100 last:border-0 dark:border-slate-800">
    <span className="text-slate-500 dark:text-slate-400">{label}</span>
    <span className="font-semibold text-slate-800 dark:text-slate-100">{value || '—'}</span>
  </div>
);

/* Staff member wiping down a barbell on a rack */
const MaintenanceAnimation = () => (
  <svg viewBox="0 0 240 150" className="w-full max-w-xs" role="img" aria-label="Staff maintaining gym equipment">
    {/* floor */}
    <line x1="10" y1="140" x2="230" y2="140" strokeWidth="3" strokeLinecap="round"
      className="stroke-slate-300 dark:stroke-slate-600" />

    {/* rack posts */}
    <rect x="135" y="118" width="5" height="22" rx="2" className="fill-slate-400 dark:fill-slate-500" />
    <rect x="190" y="118" width="5" height="22" rx="2" className="fill-slate-400 dark:fill-slate-500" />

    {/* barbell */}
    <line x1="100" y1="118" x2="228" y2="118" strokeWidth="5" strokeLinecap="round"
      className="stroke-slate-500 dark:stroke-slate-300" />
    <rect x="104" y="98" width="9" height="40" rx="2" className="fill-slate-700 dark:fill-slate-400" />
    <rect x="115" y="103" width="8" height="30" rx="2" className="fill-slate-600 dark:fill-slate-500" />
    <rect x="215" y="98" width="9" height="40" rx="2" className="fill-slate-700 dark:fill-slate-400" />
    <rect x="204" y="103" width="8" height="30" rx="2" className="fill-slate-600 dark:fill-slate-500" />

    {/* person: legs */}
    <rect x="61" y="104" width="9" height="32" rx="3" className="fill-slate-700 dark:fill-slate-300" />
    <rect x="72" y="104" width="9" height="32" rx="3" className="fill-slate-700 dark:fill-slate-300" />
    <rect x="58" y="134" width="14" height="6" rx="3" className="fill-slate-900 dark:fill-slate-100" />
    <rect x="70" y="134" width="14" height="6" rx="3" className="fill-slate-900 dark:fill-slate-100" />

    {/* person: body (brand green) */}
    <rect x="57" y="60" width="28" height="48" rx="9" fill="#0B4058" className="dark:fill-emerald-700" />

    {/* person: head + cap */}
    <circle cx="71" cy="46" r="11" fill="#f2c9a0" />
    <path d="M60 44 a11 11 0 0 1 22 0 z" fill="#0B4058" className="dark:fill-emerald-700" />

    {/* wiping arm */}
    <line x1="80" y1="70" x2="112" y2="116" stroke="#f2c9a0" strokeWidth="7" strokeLinecap="round">
      <animate attributeName="x2" values="112;150;112" dur="1.2s" repeatCount="indefinite" />
    </line>

    {/* cloth */}
    <rect x="104" y="110" width="16" height="12" rx="3" fill="#60a5fa">
      <animate attributeName="x" values="104;142;104" dur="1.2s" repeatCount="indefinite" />
    </rect>

    {/* sparkles on clean metal */}
    {[
      { cx: 150, cy: 106, begin: '0s' },
      { cx: 178, cy: 128, begin: '0.4s' },
      { cx: 205, cy: 108, begin: '0.8s' },
    ].map((s, i) => (
      <circle key={i} cx={s.cx} cy={s.cy} r="3" fill="#fde047" opacity="0">
        <animate attributeName="opacity" values="0;1;0" dur="1.2s" begin={s.begin} repeatCount="indefinite" />
        <animate attributeName="r" values="1;4;1" dur="1.2s" begin={s.begin} repeatCount="indefinite" />
      </circle>
    ))}
  </svg>
);

export const TaskLogDetailModal: React.FC<Props> = ({ log, onClose }) => {
  const [zoom, setZoom] = useState(false);
  const { task } = log;

  const renderBody = () => {
    switch (log.status) {
      case 'In Progress':
        return (
          <div className="flex flex-col items-center py-6 gap-3 rounded-2xl bg-blue-50 border border-blue-100 dark:bg-blue-950/30 dark:border-blue-900">
            <MaintenanceAnimation />
            <p className="font-bold text-slate-800 dark:text-slate-100">Task is in progress</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Started by {log.startedBy?.firstName || 'a custodian'}
              {log.startedAt ? ` • ${formatDateTime(log.startedAt)}` : ''}
            </p>
          </div>
        );

      case 'Completed':
      case 'Pending Review':
        return (
          <div className="space-y-4">
            {log.submittedPhoto ? (
              <div
                className="relative group rounded-2xl overflow-hidden border border-slate-200 aspect-video bg-gray-100 cursor-pointer dark:border-slate-700 dark:bg-slate-800"
                onClick={() => setZoom(true)}
              >
                <img src={log.submittedPhoto} alt="Submitted proof" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all">
                  <ZoomIn className="text-white opacity-0 group-hover:opacity-100" size={32} />
                </div>
              </div>
            ) : (
              <div className="aspect-video rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 dark:border-slate-700 dark:text-slate-500">
                <Camera size={32} className="mb-2" />
                <p className="text-sm">No photo submitted</p>
              </div>
            )}
            <div>
              <Row label="Started by" value={log.startedBy?.firstName} />
              <Row label="Started at" value={log.startedAt && formatDateTime(log.startedAt)} />
              <Row label="Completed by" value={log.completedBy?.firstName} />
              <Row label="Completed at" value={log.completedAt && formatDateTime(log.completedAt)} />
              <Row label="Verification" value={<VerificationBadge status={log.verificationStatus} />} />
            </div>
          </div>
        );

      case 'Missed':
        return (
          <p className="py-10 text-center text-rose-600 font-semibold dark:text-rose-400">
            This task was missed.
          </p>
        );

      default: // Pending
        return (
          <div className="flex flex-col items-center py-10 gap-3 text-slate-500 dark:text-slate-400">
            <Clock size={40} className="text-slate-300 dark:text-slate-600" />
            <p className="font-bold text-slate-700 dark:text-slate-200">Task has not been started</p>
            <p className="text-sm">Details will appear here once a custodian begins.</p>
          </div>
        );
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto border border-transparent dark:bg-slate-900 dark:border-slate-700"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start border-b border-slate-200 pb-4 dark:border-slate-700">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-slate-50">{task?.title}</h3>
              <p className="text-sm text-slate-500 flex items-center gap-1 mt-1 dark:text-slate-400">
                <MapPin size={13} /> {task?.area} • {formatTo12Hour(task?.startTime)} – {formatTo12Hour(task?.endTime)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 cursor-pointer dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300"
            >
              <X size={18} />
            </button>
          </div>

          {renderBody()}
        </div>
      </div>

      {zoom && log.submittedPhoto && (
        <div
          className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-8"
          onClick={() => setZoom(false)}
        >
          <img src={log.submittedPhoto} alt="Fullscreen" className="max-h-[80vh] rounded-xl object-contain" />
        </div>
      )}
    </>
  );
};