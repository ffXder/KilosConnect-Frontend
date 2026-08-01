import { useState, useRef } from 'react';
import {
  MapPin,
  Upload,
  ImageIcon,
  ClipboardList,
  X,
  ZoomIn,
  CheckCircle2,
  Clock,
  SplitSquareHorizontal,
} from 'lucide-react';

interface MaintenanceTask {
  id: string;
  zone: string;
  task: string;
  completed: boolean;
}

interface BasisImage {
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

const zones = [
  { name: 'Mezzanine', qrCode: 'QR-MEZ-001' },
  { name: 'Powerlifting Area', qrCode: 'QR-PWL-001' },
  { name: 'WOD Area', qrCode: 'QR-WOD-001' },
  { name: 'Weightlifting Area', qrCode: 'QR-WLT-001' },
  { name: 'CrossFit Area', qrCode: 'QR-CFT-001' },
];

const taskTemplates: Record<string, MaintenanceTask[]> = {
  'Mezzanine': [
    { id: '1', zone: 'Mezzanine', task: 'Check cable machine tension and alignment', completed: false },
    { id: '2', zone: 'Mezzanine', task: 'Inspect weight stack pins for damage', completed: false },
    { id: '3', zone: 'Mezzanine', task: 'Clean and sanitize equipment surfaces', completed: false },
    { id: '4', zone: 'Mezzanine', task: 'Check floor matting for wear and tear', completed: false },
  ],
  'Powerlifting Area': [
    { id: '1', zone: 'Powerlifting Area', task: 'Inspect barbell sleeves for smooth rotation', completed: false },
    { id: '2', zone: 'Powerlifting Area', task: 'Check rack safety pins and j-hooks', completed: false },
    { id: '3', zone: 'Powerlifting Area', task: 'Inspect platform for cracks or damage', completed: false },
    { id: '4', zone: 'Powerlifting Area', task: 'Verify all weight plates are present and undamaged', completed: false },
  ],
  'WOD Area': [
    { id: '1', zone: 'WOD Area', task: 'Test rowing machine resistance and monitor', completed: false },
    { id: '2', zone: 'WOD Area', task: 'Check assault bike for loose bolts', completed: false },
    { id: '3', zone: 'WOD Area', task: 'Inspect jump boxes for stability', completed: false },
    { id: '4', zone: 'WOD Area', task: 'Clean cardio equipment displays', completed: false },
  ],
  'Weightlifting Area': [
    { id: '1', zone: 'Weightlifting Area', task: 'Check Olympic barbell knurling condition', completed: false },
    { id: '2', zone: 'Weightlifting Area', task: 'Inspect bumper plates for cracks', completed: false },
    { id: '3', zone: 'Weightlifting Area', task: 'Verify platform levelness', completed: false },
    { id: '4', zone: 'Weightlifting Area', task: 'Test barbell collar grip strength', completed: false },
  ],
  'CrossFit Area': [
    { id: '1', zone: 'CrossFit Area', task: 'Inspect pull-up bar mounting', completed: false },
    { id: '2', zone: 'CrossFit Area', task: 'Check rig bolts and connections', completed: false },
    { id: '3', zone: 'CrossFit Area', task: 'Test resistance bands for wear', completed: false },
    { id: '4', zone: 'CrossFit Area', task: 'Verify kettlebell handle integrity', completed: false },
  ],
};

export function TaskSetupTab() {
  const [basisImages, setBasisImages] = useState<Record<string, BasisImage>>({});
  const [setupZone, setSetupZone] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; label: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBasisImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !setupZone) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      setBasisImages(prev => ({
        ...prev,
        [setupZone]: {
          url,
          uploadedAt: new Date().toLocaleString(),
          uploadedBy: 'Admin',
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveBasisImage = (zone: string) => {
    setBasisImages(prev => {
      const next = { ...prev };
      delete next[zone];
      return next;
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <SplitSquareHorizontal className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
        <div>
          <p className="font-semibold text-blue-900 mb-0.5">Dual-Image Visual Verification Pipeline</p>
          <p className="text-sm text-blue-700">
            Attach a Basis Image to each zone to define the expected operational standard. Custodians will see this reference photo when submitting their maintenance evidence, enabling direct visual comparison.
          </p>
        </div>
      </div>

      {zones.map((zone) => {
        const basis = basisImages[zone.name];
        const isExpanded = setupZone === zone.name;
        const tasks = taskTemplates[zone.name] || [];

        return (
          <div key={zone.name} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2.5 rounded-lg">
                  <MapPin className="text-green-700" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{zone.name}</h3>
                  <p className="text-sm text-gray-500">{zone.qrCode} · {tasks.length} tasks</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {basis ? (
                  <span className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full">
                    <CheckCircle2 size={13} />
                    Basis Image Set
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium px-3 py-1.5 rounded-full">
                    <Clock size={13} />
                    No Basis Image
                  </span>
                )}
                <button
                  onClick={() => setSetupZone(isExpanded ? null : zone.name)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {isExpanded ? 'Collapse' : 'Configure'}
                </button>
              </div>
            </div>

            {isExpanded && (
              <div className="border-t border-gray-100 p-5 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <ImageIcon size={16} className="text-green-600" />
                      Basis Image
                    </h4>
                    {basis ? (
                      <div className="space-y-3">
                        <div className="relative group rounded-xl overflow-hidden">
                          <img src={basis.url} alt="Basis" className="w-full h-44 object-cover" />
                          <button
                            onClick={() => setLightboxImage({ url: basis.url, label: `${zone.name} — Basis Image` })}
                            className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all"
                          >
                            <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={28} />
                          </button>
                        </div>
                        <p className="text-xs text-gray-500">Uploaded {basis.uploadedAt} by {basis.uploadedBy}</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-green-300 text-green-700 rounded-lg text-sm hover:bg-green-50 transition-colors"
                          >
                            <Upload size={14} />
                            Replace Image
                          </button>
                          <button
                            onClick={() => handleRemoveBasisImage(zone.name)}
                            className="flex items-center justify-center gap-2 px-3 py-2 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50 transition-colors"
                          >
                            <X size={14} />
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-green-400 hover:bg-green-50 transition-all"
                      >
                        <Upload className="mx-auto mb-3 text-gray-400" size={32} />
                        <p className="font-medium text-gray-700 mb-1">Click to upload or drag and drop reference images</p>
                        <p className="text-xs text-gray-400 mt-2">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleBasisImageUpload}
                    />
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <ClipboardList size={16} className="text-green-600" />
                      Maintenance Checklist
                    </h4>
                    <div className="space-y-2">
                      {tasks.map((t, i) => (
                        <div key={t.id} className="flex items-start gap-2.5 bg-white rounded-lg p-3 border border-gray-100">
                          <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span className="text-sm text-gray-700">{t.task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-white font-semibold">{lightboxImage.label}</p>
              <button onClick={() => setLightboxImage(null)} className="text-white/70 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <img src={lightboxImage.url} alt={lightboxImage.label} className="w-full rounded-xl max-h-[75vh] object-contain bg-gray-900" />
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskSetupTab;