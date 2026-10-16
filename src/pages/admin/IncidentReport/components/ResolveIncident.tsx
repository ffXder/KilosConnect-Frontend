import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import type { IncidentReport } from '../../../../types/incident';

type AffectedAsset = { _id: string; assetId: string; name: string };

export interface ResolveIncidentPayload {
  resolutionNote: string;
  repair?: {
    assetId: string;
    cost: number;
    repairDate: string;
    description?: string;
  };
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  incident: IncidentReport | null;
  onSubmit: (
    incident: IncidentReport,
    payload: ResolveIncidentPayload,
    skipRepair: boolean
  ) => Promise<void>;
}

const today = () => new Date().toISOString().slice(0, 10);

const inputClass =
  'w-full px-4 py-2.5 text-[15px] text-gray-900 placeholder:text-gray-400 bg-white border border-gray-200 rounded-xl transition-colors focus:outline-none focus:border-[#0E4961] focus:ring-2 focus:ring-[#0E4961]/20';

const Label: React.FC<{ htmlFor: string; required?: boolean; children: React.ReactNode }> = ({
  htmlFor,
  required,
  children,
}) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-2">
    {children}
    {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
  </label>
);

const IncidentResolveModal: React.FC<Props> = ({ isOpen, onClose, incident, onSubmit }) => {
  const [note, setNote] = useState('');
  const [withRepair, setWithRepair] = useState(false);
  const [assetId, setAssetId] = useState('');
  const [cost, setCost] = useState('');
  const [repairDate, setRepairDate] = useState(today());
  const [repairDesc, setRepairDesc] = useState('');
  const [repairLogged, setRepairLogged] = useState(false); // repair saved, resolve failed
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const noteRef = useRef<HTMLTextAreaElement>(null);

  const asset = (incident?.asset ?? null) as unknown as AffectedAsset | null;

  useEffect(() => {
    if (!isOpen) return;
    setNote(''); setWithRepair(false); setCost(''); setRepairDesc('');
    setRepairDate(today()); setRepairLogged(false); setError(null);
    setAssetId(asset?.assetId ?? '');
  }, [isOpen, incident?._id]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submitting) onClose();
    };
    window.addEventListener('keydown', onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    noteRef.current?.focus();

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, submitting, onClose]);

  if (!isOpen || !incident) return null;

  const costNum = Number(cost);
  const repairValid = !withRepair || (assetId !== '' && cost !== '' && costNum >= 0 && repairDate !== '');
  const isValid = note.trim() !== '' && repairValid;

  const handleSubmit = async () => {
    if (!isValid) return;
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(
        incident,
        {
          resolutionNote: note.trim(),
          ...(withRepair && {
            repair: {
              assetId,
              cost: costNum,
              repairDate,
              description: repairDesc.trim() || undefined,
            },
          }),
        },
        repairLogged
      );
      onClose();
    } catch (err: any) {
      if (err?.repairLogged) setRepairLogged(true);
      setError(err.message ?? 'Failed to resolve incident');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="resolve-title"
        className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh] animate-in fade-in zoom-in-95 duration-200 motion-reduce:animate-none"
      >
        {/* Header */}
        <div className="bg-[#0E4961] px-6 py-6 sm:px-8 text-white flex justify-between items-start gap-4 shrink-0">
          <div className="min-w-0">
            <h2 id="resolve-title" className="text-xl font-bold leading-snug">
              Resolve incident
            </h2>
            <p className="text-sm text-white/60 mt-1.5 truncate">
              <span className="font-mono">{incident.incidentId}</span>
              <span className="mx-1.5" aria-hidden="true">–</span>
              {incident.title}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            aria-label="Close"
            className="shrink-0 -mr-2 -mt-2 p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-8 sm:px-8 space-y-6">
          <div>
            <Label htmlFor="resolve-note" required>Resolution note</Label>
            <textarea
              id="resolve-note"
              ref={noteRef}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              className={`${inputClass} resize-none leading-relaxed`}
              placeholder="What was done to fix this?"
            />
          </div>

          {asset && !repairLogged && (
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={withRepair}
                onChange={(e) => setWithRepair(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-[#0E4961] cursor-pointer"
              />
              <span className="text-[15px] text-gray-700 leading-snug">
                A repair was done on the affected asset
                <span className="block text-sm text-gray-500 mt-0.5">{asset.name}</span>
              </span>
            </label>
          )}

          {withRepair && !repairLogged && (
            <div className="space-y-5 bg-gray-50 rounded-xl p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="repair-cost" required>Cost</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-gray-400 pointer-events-none">
                      ₱
                    </span>
                    <input
                      id="repair-cost"
                      type="number"
                      min={0}
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                      className={`${inputClass} pl-9`}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="repair-date" required>Repair date</Label>
                  <input
                    id="repair-date"
                    type="date"
                    value={repairDate}
                    onChange={(e) => setRepairDate(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="repair-desc">Repair description</Label>
                <textarea
                  id="repair-desc"
                  value={repairDesc}
                  onChange={(e) => setRepairDesc(e.target.value)}
                  rows={3}
                  className={`${inputClass} resize-none leading-relaxed`}
                  placeholder="Optional"
                />
              </div>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2.5 bg-red-50 text-red-700 rounded-xl p-4 text-sm"
            >
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 py-5 sm:px-8 border-t border-gray-100 bg-white flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            onClick={onClose}
            disabled={submitting}
            className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0E4961]/40"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid || submitting}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0E4961]/40 focus-visible:ring-offset-2 ${
              isValid && !submitting
                ? 'bg-[#0E4961] text-white shadow-sm hover:bg-[#062F41] active:scale-[0.98]'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {submitting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <CheckCircle2 size={18} />
            )}
            {repairLogged ? 'Retry resolve' : 'Resolve incident'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncidentResolveModal;