import React, { useState, useEffect, useRef } from 'react';
import { X, Send, ChevronDown, AlertTriangle } from 'lucide-react';
import { useAssets } from '../../../../hooks/useAssets';
import type { NewIncidentReport } from '../../../../types/incident';

interface IncidentAddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (incident: NewIncidentReport) => void;
}

const locations = [
  'Mezzanine', 'Powerlifting Area', 'Open WOD Area',
  'CrossFit Area', 'Café', 'General Storage', 'Maintenance Storage'
];

const severities: NewIncidentReport['severity'][] = ['Low', 'Medium', 'High', 'Urgent', 'Critical'];

/** Current local time in the format datetime-local expects (used as `max`). */
const nowLocal = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

/* Shared field styles (light + dark) */
const inputClass =
  'w-full px-3.5 py-2.5 text-[15px] text-slate-900 placeholder:text-gray-400 bg-white border border-gray-200 rounded-xl transition-colors ' +
  'focus:outline-none focus:border-[#11382C] focus:ring-2 focus:ring-[#11382C]/20 disabled:opacity-60 disabled:cursor-not-allowed ' +
  'dark:text-slate-50 dark:placeholder:text-slate-500 dark:bg-slate-800 dark:border-slate-600 dark:focus:border-emerald-500 dark:focus:ring-emerald-500/20';

/** Horizontal row: label on the left, control on the right (stacks on mobile). */
const FormRow: React.FC<{
  id: string;
  label: string;
  required?: boolean;
  children: React.ReactNode;
}> = ({ id, label, required, children }) => (
  <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] sm:items-start gap-x-4 gap-y-2">
    <label
      htmlFor={id}
      className="text-sm font-medium text-gray-700 dark:text-slate-200 sm:pt-2.5"
    >
      {label}
      {required && (
        <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
      )}
    </label>
    <div className="min-w-0">{children}</div>
  </div>
);

const SelectWrap: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative">
    {children}
    <ChevronDown
      size={18}
      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400 pointer-events-none"
    />
  </div>
);

const IncidentAddItemModal: React.FC<IncidentAddItemModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { assets, loading } = useAssets();
  const titleRef = useRef<HTMLInputElement>(null);

  // form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<NewIncidentReport['severity']>('Low');
  const [area, setArea] = useState('');
  const [dateAndTime, setDateAndTime] = useState('');
  const [asset, setAsset] = useState(''); // single asset _id

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSeverity('Low');
    setArea('');
    setDateAndTime('');
    setAsset('');
  };

  // Start clean every time the modal opens (also covers Cancel / Escape)
  useEffect(() => {
    if (isOpen) resetForm();
  }, [isOpen]);

  // Escape to close, lock background scroll, focus the title field
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    titleRef.current?.focus();

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  const isFormValid =
    title.trim() !== '' && area !== '' && dateAndTime !== '' && asset !== '';

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    onSubmit({
      title,
      description,
      severity,
      area,
      dateAndTime,
      asset
    });

    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="incident-add-title"
        className="w-full max-w-2xl flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 dark:bg-slate-900 dark:ring-white/10 dark:[color-scheme:dark] animate-in fade-in zoom-in-95 duration-200 motion-reduce:animate-none"
      >
        {/* Header */}
        <div className="bg-[#11382C] px-6 py-5 sm:px-8 text-white flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-white/10 flex items-center justify-center">
              <AlertTriangle size={20} />
            </div>
            <div className="min-w-0">
              <h2 id="incident-add-title" className="text-lg font-bold leading-tight">
                Report new incident
              </h2>
              <p className="text-sm text-white/60 mt-0.5">
                Fill in the details and select the affected equipment
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 -mr-2 p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          {/* Fields */}
          <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-8 space-y-5">
            <FormRow id="incident-title-input" label="Incident title" required>
              <input
                ref={titleRef}
                id="incident-title-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                autoComplete="off"
                className={inputClass}
                placeholder="Enter incident title"
              />
            </FormRow>

            <FormRow id="incident-asset" label="Affected asset" required>
              <SelectWrap>
                <select
                  id="incident-asset"
                  value={asset}
                  onChange={(e) => setAsset(e.target.value)}
                  disabled={loading}
                  className={`${inputClass} appearance-none pr-10 cursor-pointer`}
                >
                  <option value="">{loading ? 'Loading assets...' : 'Select an asset'}</option>
                  {assets.map((a) => (
                    <option key={a._id} value={a._id}>
                      {a.name} ({a.assetId})
                    </option>
                  ))}
                </select>
              </SelectWrap>
            </FormRow>

            <FormRow id="incident-severity" label="Severity" required>
              <SelectWrap>
                <select
                  id="incident-severity"
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as NewIncidentReport['severity'])}
                  className={`${inputClass} appearance-none pr-10 cursor-pointer`}
                >
                  {severities.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </SelectWrap>
            </FormRow>

            <FormRow id="incident-area" label="Location" required>
              <SelectWrap>
                <select
                  id="incident-area"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className={`${inputClass} appearance-none pr-10 cursor-pointer`}
                >
                  <option value="" disabled>Select zone</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </SelectWrap>
            </FormRow>

            <FormRow id="incident-datetime" label="Date and time" required>
              <input
                id="incident-datetime"
                value={dateAndTime}
                onChange={(e) => setDateAndTime(e.target.value)}
                type="datetime-local"
                max={nowLocal()}
                className={inputClass}
              />
            </FormRow>

            <FormRow id="incident-description" label="Description">
              <textarea
                id="incident-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className={`${inputClass} resize-none leading-relaxed`}
                placeholder="Describe the issue..."
              />
            </FormRow>
          </div>

          {/* Footer */}
          <div className="shrink-0 px-6 py-5 sm:px-8 border-t border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-900 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="hidden sm:block text-xs text-gray-500 dark:text-slate-400">
              <span className="text-red-500">*</span> Required fields
            </p>
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#11382C]/40 dark:focus-visible:ring-emerald-500/40"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isFormValid}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#11382C]/40 focus-visible:ring-offset-2 dark:focus-visible:ring-emerald-500/50 dark:focus-visible:ring-offset-slate-900 ${
                  isFormValid
                    ? 'bg-[#11382C] text-white shadow-sm hover:bg-[#0a2a21] active:scale-[0.98] dark:bg-emerald-700 dark:hover:bg-emerald-600'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-500'
                }`}
              >
                <Send size={16} />
                Submit report
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IncidentAddItemModal;