import React, { useEffect, useRef } from 'react';
import {
  X,
  MapPin,
  User,
  CalendarClock,
  AlertCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Info,
  Package,
  ClipboardCheck,
} from 'lucide-react';
import type { IncidentReport } from '../../../../types/incident';
import { formatDateTime } from '../../../../utils/formatter';

interface IncidentDetailedModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: IncidentReport | null;
  onResolve?: (incident: IncidentReport) => void;
}

type AffectedAsset = { _id?: string; assetId?: string; name: string };

const Field: React.FC<{
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}> = ({ icon, label, children }) => (
  <div className="min-w-0">
    <dt className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-slate-400 mb-1.5">
      {icon}
      {label}
    </dt>
    <dd className="text-[15px] font-medium text-gray-900 dark:text-slate-100 break-words">{children}</dd>
  </div>
);

const Heading: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = 'text-gray-900 dark:text-slate-100',
}) => <h3 className={`text-sm font-semibold mb-3 ${className}`}>{children}</h3>;

const IncidentDetailedModal: React.FC<IncidentDetailedModalProps> = ({
  isOpen,
  onClose,
  incident,
  onResolve,
}) => {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen || !incident) return null;

  const getStatusConfig = () => {
    switch (incident.status) {
      case 'Open':
        return {
          icon: <AlertCircle size={14} />,
          color: 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300',
          label: 'Pending',
        };
      case 'In Progress':
        return {
          icon: <Clock size={14} />,
          color: 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
          label: 'In progress',
        };
      case 'Resolved':
        return {
          icon: <CheckCircle2 size={14} />,
          color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
          label: 'Resolved',
        };
      default:
        return {
          icon: <AlertCircle size={14} />,
          color: 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-300',
          label: 'Unknown',
        };
    }
  };

  const getSeverityConfig = (severity: string) => {
    if (/Critical|Urgent|High/.test(severity)) {
      return {
        icon: <AlertOctagon size={14} />,
        color: 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300',
      };
    }
    if (severity.includes('Medium')) {
      return {
        icon: <AlertTriangle size={14} />,
        color: 'bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300',
      };
    }
    return {
      icon: <Info size={14} />,
      color: 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
    };
  };

  const status = getStatusConfig();
  const severity = getSeverityConfig(incident.severity);
  const isResolved = incident.status === 'Resolved';

  const incidentAssets = Array.isArray(incident.asset)
    ? incident.asset
    : incident.asset
      ? [incident.asset]
      : [];
  const assets: AffectedAsset[] = [...incidentAssets, ...(incident.affectedAssets ?? [])]
    .map((asset): AffectedAsset =>
      typeof asset === 'string'
        ? { _id: asset, name: asset }
        : { _id: asset._id, assetId: asset.assetId, name: asset.name }
    )
    .filter((asset, index, list) => {
      const key = asset._id ?? asset.assetId ?? asset.name;
      return list.findIndex((item) => (item._id ?? item.assetId ?? item.name) === key) === index;
    });

  const resolutionNote = incident.resolutionNote;

  const reporter = incident.reportedBy
    ? `${incident.reportedBy.firstName} ${incident.reportedBy.lastName}`
    : incident.reportedName || '—';

  const chip = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="incident-title"
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 dark:ring-1 dark:ring-white/10 dark:[color-scheme:dark] w-full max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh] animate-in fade-in zoom-in-95 duration-200 motion-reduce:animate-none"
      >
        {/* Header: just the ID and the title */}
        <div className="bg-[#11382C] px-6 py-6 sm:px-8 text-white flex justify-between items-start gap-4 shrink-0">
          <div className="min-w-0">
            <p className="text-xs text-white/60 mb-2">
              Incident ID: <span className="font-mono">{incident.incidentId}</span>
            </p>
            <h2
              id="incident-title"
              className="text-xl sm:text-2xl font-bold leading-snug break-words"
            >
              {incident.title}
            </h2>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 -mr-2 -mt-2 p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-8 sm:px-8 space-y-8">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
            <Field icon={<AlertCircle size={14} />} label="Status">
              <span className={`${chip} ${status.color}`}>
                {status.icon}
                {status.label}
              </span>
            </Field>
            <Field icon={<Info size={14} />} label="Severity">
              <span className={`${chip} ${severity.color}`}>
                {severity.icon}
                {incident.severity}
              </span>
            </Field>
            <Field icon={<MapPin size={14} />} label="Location">
              {incident.area}
            </Field>
            <Field icon={<User size={14} />} label="Reported by">
              {reporter}
            </Field>
            <Field icon={<CalendarClock size={14} />} label="Date reported">
              {formatDateTime(incident.dateAndTime)}
            </Field>
          </dl>

          {/* Description */}
          <section className="pt-8 border-t border-gray-100 dark:border-slate-700">
            <Heading>Description</Heading>
            <p className="text-[15px] text-gray-600 dark:text-slate-300 leading-7 whitespace-pre-wrap break-words">
              {incident.description || 'No description provided.'}
            </p>
          </section>

          {/* Affected assets */}
          {assets.length > 0 && (
            <section className="pt-8 border-t border-gray-100 dark:border-slate-700">
              <Heading>
                {assets.length > 1 ? `Affected assets (${assets.length})` : 'Affected asset'}
              </Heading>
              <ul className="divide-y divide-gray-100 dark:divide-slate-700">
                {assets.map((a) => (
                  <li
                    key={a._id ?? a.assetId}
                    className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <Package size={18} className="shrink-0 text-gray-400 dark:text-slate-500" />
                    <p className="min-w-0 flex-1 text-[15px] font-medium text-gray-900 dark:text-slate-100 truncate">
                      {a.name}
                    </p>
                    <span className="shrink-0 text-xs font-mono text-gray-500 dark:text-slate-400">{a.assetId}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Resolution note when resolved */}
          {isResolved && resolutionNote && (
            <section className="bg-emerald-50/60 dark:bg-emerald-500/10 rounded-xl p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-emerald-800 dark:text-emerald-300 mb-2">
                <ClipboardCheck size={16} />
                Resolution notes
              </h3>
              <p className="text-[15px] text-gray-700 dark:text-slate-200 leading-7 whitespace-pre-wrap break-words">
                {resolutionNote}
              </p>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 py-5 sm:px-8 border-t border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-900 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-200 dark:border-slate-600 rounded-xl text-sm font-semibold text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#11382C]/40 dark:focus-visible:ring-emerald-500/40"
          >
            Close
          </button>
          {!isResolved && onResolve && (
            <button
              onClick={() => onResolve(incident)}
              className="px-5 py-2.5 bg-[#11382C] dark:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-sm hover:bg-[#0a2a21] dark:hover:bg-emerald-600 transition-colors active:scale-[0.98] inline-flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#11382C]/40 dark:focus-visible:ring-emerald-500/50 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
            >
              <CheckCircle2 size={18} />
              Resolve incident
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncidentDetailedModal;
