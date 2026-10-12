import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Loader2 } from 'lucide-react';
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

  // the list endpoint already populates affectedAssets
  const affected = (incident?.affectedAssets ?? []) as unknown as AffectedAsset[];

  useEffect(() => {
    if (!isOpen) return;
    setNote(''); setWithRepair(false); setCost(''); setRepairDesc('');
    setRepairDate(today()); setRepairLogged(false); setError(null);
    setAssetId(affected.length === 1 ? affected[0]._id : '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, incident?._id]);

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

  const input = "w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#11382C] outline-none";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="bg-[#11382C] p-6 text-white flex justify-between items-start">
          <div className="min-w-0">
            <h2 className="text-xl font-bold">Resolve Incident</h2>
            <p className="text-gray-300 text-sm mt-1 truncate">{incident.incidentId} · {incident.title}</p>
          </div>
          <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-lg"><X size={22} /></button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Resolution Note *</label>
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={3}
              className={`${input} resize-none`} placeholder="What was done to fix this?" />
          </div>

          {affected.length > 0 && !repairLogged && (
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
              <input type="checkbox" checked={withRepair} onChange={e => setWithRepair(e.target.checked)} />
              A repair was done on an affected asset
            </label>
          )}

          {withRepair && !repairLogged && (
            <div className="space-y-4 border border-gray-100 rounded-xl p-4 bg-gray-50">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Asset *</label>
                <select value={assetId} onChange={e => setAssetId(e.target.value)} className={`${input} bg-white`}>
                  <option value="">Select asset</option>
                  {affected.map(a => (
                    <option key={a._id} value={a._id}>{a.name} ({a.assetId})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Cost (₱) *</label>
                  <input type="number" min={0} value={cost} onChange={e => setCost(e.target.value)} className={input} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Repair Date *</label>
                  <input type="date" value={repairDate} onChange={e => setRepairDate(e.target.value)} className={input} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Repair Description</label>
                <textarea value={repairDesc} onChange={e => setRepairDesc(e.target.value)} rows={2}
                  className={`${input} resize-none`} />
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button onClick={onClose} className="px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={!isValid || submitting}
              className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 ${
                isValid && !submitting ? 'bg-[#11382C] text-white hover:bg-[#0a2a21]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}>
              {submitting ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
              {repairLogged ? 'Retry Resolve' : 'Resolve'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentResolveModal;