import React, { useState } from 'react';
import { 
  X, MapPin, Camera, CheckCircle2, 
  ShieldAlert, Flag, Upload, ArrowLeft, AlertTriangle 
} from 'lucide-react';

interface ReviewDetailsModalProps {
  review: {
    area: string;
    cust: string;
    time: string;
    progress: string;
  };
  onClose: () => void;
}

export default function ReviewDetailsModal({ review, onClose }: ReviewDetailsModalProps) {
  const [isFlagging, setIsFlagging] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [flagDescription, setFlagDescription] = useState("");

  const checklistItems = [
    "Test rowing machine resistance and monitor",
    "Check assault bike for loose bolts",
    "Inspect jump boxes for stability",
    "Clean cardio equipment displays"
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPhotoPreview(imageUrl);
    }
  };

  const handleSubmitFlag = () => {
    if (!photoPreview) {
      alert("Please upload a reference photo before submitting the flag.");
      return;
    }

    alert(`Issue flagged for ${review.area}. Admin notification dispatched with attached reference photo!`);
    onClose();
  };

  /* -------------------------------------------------------------------------- */
  /* FLAG ISSUE SUBMISSION VIEW                                                */
  /* -------------------------------------------------------------------------- */
  if (isFlagging) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          
          {/* Header */}
          <div className="bg-rose-700 p-5 flex justify-between items-start shrink-0">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsFlagging(false)} 
                className="text-white/80 hover:text-white transition-colors p-1"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Flag size={20} /> Flag Issue
                </h2>
                <p className="text-sm text-rose-100/90 mt-0.5">{review.area} · Notify Admin</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="text-white/70 hover:text-white transition-colors p-1"
            >
              <X size={24} />
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 overflow-y-auto space-y-5">
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl text-xs font-medium flex items-center gap-2.5">
              <AlertTriangle size={18} className="shrink-0 text-rose-600" />
              <span>A reference photo is required so admins can verify and resolve this issue promptly.</span>
            </div>

            {/* Photo Upload Box */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Reference Photo <span className="text-rose-500">*</span>
              </label>

              {photoPreview ? (
                <div className="relative rounded-xl overflow-hidden border border-[#e2e8f0] h-52 bg-gray-900">
                  <img src={photoPreview} alt="Issue evidence" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => setPhotoPreview(null)}
                    className="absolute top-3 right-3 bg-black/70 hover:bg-black text-white p-1.5 rounded-full text-xs transition"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-[#e2e8f0] hover:border-rose-400 bg-[#f8fafc] hover:bg-rose-50/20 rounded-xl h-48 flex flex-col items-center justify-center cursor-pointer transition p-4 text-center">
                  <div className="bg-rose-100 text-rose-600 p-3 rounded-full mb-2">
                    <Upload size={22} />
                  </div>
                  <span className="text-sm font-bold text-gray-700">Click to upload reference photo</span>
                  <span className="text-xs text-gray-400 mt-1">PNG, JPG or WEBP (Max 10MB)</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handlePhotoUpload}
                    className="hidden" 
                  />
                </label>
              )}
            </div>

            {/* Notes / Description */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Issue Description / Notes
              </label>
              <textarea
                rows={3}
                value={flagDescription}
                onChange={(e) => setFlagDescription(e.target.value)}
                placeholder="Briefly describe what needs attention or repair..."
                className="w-full rounded-xl border border-[#e2e8f0] p-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none bg-[#f8fafc]"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsFlagging(false)}
                className="flex-1 py-3.5 border border-[#e2e8f0] text-gray-700 font-bold rounded-xl text-sm hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitFlag}
                disabled={!photoPreview}
                className="flex-1 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition text-sm flex items-center justify-center gap-2 shadow-sm"
              >
                <Flag size={18} />
                Notify Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /* DEFAULT DETAILS VIEW                                                      */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Dark Green Modal Header */}
        <div className="bg-[#0a2e27] p-5 flex justify-between items-start shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white">Item Details</h2>
            <p className="text-sm text-emerald-100/80 mt-1">Viewing information for {review.area}</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-white/70 hover:text-white transition-colors p-1"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Location / Custodian Meta */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-50 p-2 rounded-lg text-[#0a2e27]">
                <MapPin size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{review.area}</h3>
                <p className="text-sm text-gray-500 font-medium">{review.cust} · {review.time}</p>
              </div>
            </div>
            <span className="text-emerald-700 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              {review.progress}
            </span>
          </div>

          {/* Custodian Submission Photo */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Camera size={14} /> Custodian Submission Photo
            </p>
            <div className="bg-[#516173] rounded-xl h-48 flex flex-col items-center justify-center text-white/80 relative">
              <Camera size={40} className="mb-2 opacity-60" />
              <span className="font-semibold tracking-wide">Live Capture</span>
              <div className="absolute bottom-3 right-3 bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <CheckCircle2 size={14} /> Verified Live
              </div>
            </div>
          </div>

          {/* Maintenance Checklist */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                📋 Maintenance Checklist
              </p>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                4/4 done
              </span>
            </div>
            <div className="space-y-2">
              {checklistItems.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                  <span className="text-sm font-medium text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button 
              onClick={() => {
                alert(`Approved ${review.area}`);
                onClose();
              }}
              className="flex-1 bg-[#0a2e27] hover:bg-[#08241f] text-white font-bold py-3.5 rounded-xl transition flex justify-center items-center gap-2 shadow-sm"
            >
              <CheckCircle2 size={20} />
              Looks Good
            </button>
            <button 
              onClick={() => setIsFlagging(true)}
              className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold py-3.5 rounded-xl transition flex justify-center items-center gap-2"
            >
              <Flag size={20} />
              Flag Issue
            </button>
          </div>

          {/* Permanent Log Notice */}
          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3 flex items-center gap-3">
            <ShieldAlert size={16} className="text-gray-400 shrink-0" />
            <p className="text-xs text-gray-500 font-medium">
              Your action will be permanently logged under <span className="font-bold text-gray-700">CUST-001</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}