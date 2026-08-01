import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, ImageIcon, ClipboardList, ZoomIn, CheckCircle2, Clock, SplitSquareHorizontal, MapPin } from 'lucide-react';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (taskData: any) => Promise<void>;
  onSuccess: (task: any) => void;
  initialData?: any;
}

interface BasisImage {
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ 
  isOpen, 
  onClose, 
  onCreate, 
  onSuccess, 
  initialData 
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'verification'>('details');
  const [basisImage, setBasisImage] = useState<BasisImage | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    area: '',
    priority: 'Medium',
    frequency: 'Daily',
    dayType: null as string | number | null,
    basisImage: null as string | null,
    relatedAsset: '',
    requiresVerification: false
  });

  useEffect(() => {
    if (isOpen) {
      setActiveTab('details');
      if (initialData) {
        setFormData({
          title: initialData.title || '',
          description: initialData.description || '',
          startTime: initialData.startTime || '',
          endTime: initialData.endTime || '',
          area: initialData.area || '',
          priority: initialData.priority || 'Medium',
          frequency: initialData.frequency || 'Daily',
          dayType: initialData.dayType ?? null,
          basisImage: initialData.basisImage || null,
          relatedAsset: initialData.relatedAsset || '',
          requiresVerification: initialData.requiresVerification ?? false
        });
        if (initialData.basisImage) {
          setBasisImage({
            url: initialData.basisImage,
            uploadedAt: initialData.basisUploadedAt || 'Recently',
            uploadedBy: initialData.basisUploadedBy || 'Admin'
          });
        } else {
          setBasisImage(null);
        }
      } else {
        setFormData({
          title: '',
          description: '',
          startTime: '',
          endTime: '',
          area: '',
          priority: 'Medium',
          frequency: 'Daily',
          dayType: null,
          basisImage: null,
          relatedAsset: '',
          requiresVerification: false
        });
        setBasisImage(null);
      }
    }
  }, [initialData, isOpen]);

  const handleFrequencyChange = (freq: string) => {
    setFormData({ ...formData, frequency: freq, dayType: null });
  };

  const handleBasisImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      setBasisImage({
        url,
        uploadedAt: new Date().toLocaleString(),
        uploadedBy: 'Admin',
      });
      setFormData(prev => ({ ...prev, basisImage: url }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveBasisImage = () => {
    setBasisImage(null);
    setFormData(prev => ({ ...prev, basisImage: null }));
  };

  if (!isOpen) return null;

  const isFormInvalid = 
    !formData.title || 
    !formData.area || 
    !formData.startTime || 
    !formData.endTime ||
    (formData.frequency === 'Weekly' && !formData.dayType) ||
    (formData.frequency === 'Monthly' && !formData.dayType);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = initialData ? { ...formData, _id: initialData._id } : formData;
      await onCreate(payload);
      onSuccess(payload);
      onClose();
    } catch (error) {
      console.error("Task submission failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const zones = ["Mezzanine", "Powerlifting Area", "Open WOD Area", "CrossFit Area", "Weightlifting Area", "General Storage", "Maintenance Storage", "Multiple Area", "Front Desk Area", "Outdoor Area", "CR" , "1st Floor", "2nd Floor"];
  const priorities = ["Low", "Medium", "High", "Urgent"];
  const assetOptions = ["None", "Squat Rack", "Barbell", "Dumbbell Set", "Treadmill", "Cable Machine", "Bench Press", "Rowing Machine"];
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const monthDays = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 font-sans">
      <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-[#072821] p-6 text-white relative flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">
              {initialData ? 'Edit Master Task & Verification' : 'Add New Task'}
            </h2>
            <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-lg transition-colors cursor-pointer">
              <X size={20} />
            </button>
          </div>

          {/* Tab Navigation enabled for both Add and Edit modes */}
          <div className="flex gap-2 mt-4 bg-[#042421] p-1 rounded-xl w-fit">
            <button
              type="button"
              onClick={() => setActiveTab('details')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'details' ? 'bg-[#ba6300] text-[#FDFFE0]' : 'text-white/70 hover:text-white'
              }`}
            >
              Task Details
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('verification')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'verification' ? 'bg-[#ba6300] text-[#FDFFE0]' : 'text-white/70 hover:text-white'
              }`}
            >
              Visual Verification Setup
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5 overflow-y-auto flex-1">
          {activeTab === 'details' ? (
            <>
              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-[#1e293b] mb-2 tracking-tight">Task Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Deep Clean Racks"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#06322e] transition-all"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-[#1e293b] mb-2 tracking-tight">Description (Optional)</label>
                <textarea
                  placeholder="Add specific instructions..."
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#06322e] resize-none transition-all"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* Area */}
              <div>
                <label className="block text-sm font-bold text-[#1e293b] mb-2 tracking-tight">Area*</label>
                <select
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:border-[#06322e]"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                >
                  <option value="">Select zone</option>
                  {zones.map(z => <option key={z} value={z}>{z}</option>)}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-bold text-[#1e293b] mb-2 tracking-tight">Priority*</label>
                <select
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:border-[#06322e]"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              {/* Frequency Toggle */}
              <div>
                <label className="block text-sm font-bold text-[#1e293b] mb-2 tracking-tight">Frequency</label>
                <div className="flex gap-2 p-1 bg-gray-50 rounded-2xl border border-gray-100">
                  {['Daily', 'Weekly', 'Monthly'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleFrequencyChange(type)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                        formData.frequency === type 
                          ? "bg-[#ba6300] text-[#FDFFE0] shadow-md" 
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Day type for weekly */}
              {formData.frequency === 'Weekly' && (
                <div>
                  <label className="block text-sm font-bold text-[#1e293b] mb-2 tracking-tight">Day Type (Day of Week) *</label>
                  <div className="flex flex-wrap gap-2">
                    {weekDays.map(day => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => setFormData({ ...formData, dayType: day })}
                        className={`px-3 py-2 rounded-xl text-sm font-bold transition-all border cursor-pointer ${
                          formData.dayType === day
                            ? 'bg-[#ba6300] text-[#FDFFE0] border-[#ba6300]'
                            : 'bg-white text-gray-500 border-gray-200 hover:border-purple-400'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Monthly select day of the month */}
              {formData.frequency === 'Monthly' && (
                <div>
                  <label className="block text-sm font-bold text-[#1e293b] mb-2 tracking-tight">Day Type (Day of Month) *</label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:border-[#06322e]"
                    value={formData.dayType ?? ''}
                    onChange={(e) => setFormData({ ...formData, dayType: Number(e.target.value) })}
                  >
                    <option value="">Select day</option>
                    {monthDays.map(day => (
                      <option key={day} value={day}>
                        {day === 1 ? '1st' : day === 2 ? '2nd' : day === 3 ? '3rd' : `${day}th`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Times */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#1e293b] mb-2">Start Time *</label>
                  <input
                    type="time"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#06322e]"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1e293b] mb-2">End Time *</label>
                  <input
                    type="time"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#06322e]"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  />
                </div>
              </div>

              {/* Related Asset Dropdown */}
              <div>
                <label className="block text-sm font-bold text-[#1e293b] mb-2 tracking-tight">Related Asset?</label>
                <select
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:border-[#06322e]"
                  value={formData.relatedAsset}
                  onChange={(e) => setFormData({ ...formData, relatedAsset: e.target.value })}
                >
                  <option value="">Select related asset (Optional)</option>
                  {assetOptions.map(asset => <option key={asset} value={asset}>{asset}</option>)}
                </select>
              </div>

              {/* Requires Verification Checkbox */}
              <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50/50">
                <input
                  type="checkbox"
                  id="requiresVerification"
                  className="w-5 h-5 rounded border-gray-300 text-[#072821] focus:ring-[#06322e] cursor-pointer"
                  checked={formData.requiresVerification}
                  onChange={(e) => setFormData({ ...formData, requiresVerification: e.target.checked })}
                />
                <label htmlFor="requiresVerification" className="text-sm font-bold text-[#1e293b] cursor-pointer select-none">
                  Requires Verification (Dual-peer evaluation for custodians vs admin direct evaluation)
                </label>
              </div>
            </>
          ) : (
            /* TaskSetupTab integrated view */
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                <SplitSquareHorizontal className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-semibold text-blue-900 mb-0.5">Dual-Image Visual Verification Pipeline</p>
                  <p className="text-sm text-blue-700">
                    Attach a Basis Image to define the expected operational standard for this specific task item. Custodians will reference this image when submitting evidence.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2.5 rounded-lg">
                      <MapPin className="text-green-700" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{formData.area || 'Unassigned Area'}</h3>
                      <p className="text-sm text-gray-500">{formData.title || 'Untitled Task'}</p>
                    </div>
                  </div>
                  <div>
                    {basisImage ? (
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
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <ImageIcon size={16} className="text-green-600" />
                    Reference Basis Image
                  </h4>
                  {basisImage ? (
                    <div className="space-y-3">
                      <div className="relative group rounded-xl overflow-hidden border border-gray-200">
                        <img src={basisImage.url} alt="Basis" className="w-full h-48 object-cover" />
                        <button
                          type="button"
                          onClick={() => setLightboxOpen(true)}
                          className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all cursor-pointer"
                        >
                          <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={28} />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">Uploaded {basisImage.uploadedAt} by {basisImage.uploadedBy}</p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-green-300 text-green-700 rounded-lg text-sm hover:bg-green-50 transition-colors cursor-pointer"
                        >
                          <Upload size={14} />
                          Replace Image
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveBasisImage}
                          className="flex items-center justify-center gap-2 px-3 py-2 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50 transition-colors cursor-pointer"
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
                      <p className="font-medium text-gray-700 mb-1">Click to upload or drag and drop reference standard image</p>
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
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 py-3 px-4 rounded-2xl border border-gray-200 font-bold text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isFormInvalid || submitting}
              className={`flex-1 py-3 px-4 rounded-2xl font-bold transition-all shadow-sm cursor-pointer ${
                isFormInvalid || submitting 
                  ? "bg-gray-100 text-gray-300 cursor-not-allowed" 
                  : "bg-[#072821] hover:bg-[#042421] text-white"
              }`}
            >
              {submitting ? "Saving..." : initialData ? "Save Changes" : "+ Add Task"}
            </button>
          </div>
        </form>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && basisImage && (
        <div
          className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-8"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-white font-semibold">{formData.title} — Basis Reference Image</p>
              <button onClick={() => setLightboxOpen(false)} className="text-white/70 hover:text-white transition-colors cursor-pointer">
                <X size={24} />
              </button>
            </div>
            <img src={basisImage.url} alt="Basis Reference Preview" className="w-full rounded-xl max-h-[75vh] object-contain bg-gray-900" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTaskModal;