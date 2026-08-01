import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X, Camera, CheckCircle2,
  AlertTriangle, Clock, User, Flag, CheckSquare, SwitchCamera
} from 'lucide-react';

export interface ChecklistItem {
  id: number;
  text: string;
  completed: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  zone: string;
  assignedTo: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'In Progress' | 'Completed' | 'Flagged';
  dueDate: string;
  checklist: ChecklistItem[];
  notes?: string;
}

interface TaskDetailsModalProps {
  task: TaskItem;
  onClose: () => void;
  onStatusChange?: (taskId: string, newStatus: TaskItem['status']) => void;
}

// ─── In-app Camera Component ───────────────────────────────────────────────
interface CameraViewProps {
  onCapture: (dataUrl: string) => void;
  onCancel: () => void;
  accentColor?: 'amber' | 'rose';
}

function CameraView({ onCapture, onCancel, accentColor = 'amber' }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const startCamera = useCallback(async (mode: 'environment' | 'user') => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setReady(false);
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setError("Camera access was denied. Please allow camera permissions in your browser settings.");
    }
  }, []);

  useEffect(() => {
    startCamera(facingMode);
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, [facingMode, startCamera]);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    onCapture(dataUrl);
  };

  const ringColor = accentColor === 'rose' ? 'ring-rose-500' : 'ring-amber-500';
  const btnColor = accentColor === 'rose'
    ? 'bg-rose-600 hover:bg-rose-700'
    : 'bg-[#0a2e27] hover:bg-[#08241f]';

  return (
    <div className="space-y-3">
      {error ? (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-sm font-medium text-rose-700 flex items-start gap-3">
          <AlertTriangle size={18} className="text-rose-500 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      ) : (
        <div className={`relative rounded-xl overflow-hidden bg-black ring-2 ${ringColor}`} style={{ aspectRatio: '4/3' }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            onCanPlay={() => setReady(true)}
            className="w-full h-full object-cover"
          />
          {!ready && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <p className="text-white text-xs font-medium">Starting camera...</p>
            </div>
          )}
          <button
            type="button"
            onClick={() => setFacingMode(prev => prev === 'environment' ? 'user' : 'environment')}
            className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
          >
            <SwitchCamera size={18} />
          </button>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 border border-[#e2e8f0] rounded-xl font-bold text-[#4a5568] text-sm hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleCapture}
          disabled={!ready || !!error}
          className={`flex-1 ${btnColor} disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-sm`}
        >
          <Camera size={16} />
          Take Photo
        </button>
      </div>
    </div>
  );
}

// ─── Main Modal ────────────────────────────────────────────────────────────
export default function TaskDetailsModal({ task, onClose, onStatusChange }: TaskDetailsModalProps) {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(task.checklist);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isFlagging, setIsFlagging] = useState(false);
  const [flagReason, setFlagReason] = useState('');

  const toggleCheckitem = (id: number) => {
    setChecklist(prev =>
      prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item)
    );
  };

  const handleCapture = (dataUrl: string) => {
    setPhotoPreview(dataUrl);
    setShowCamera(false);
  };

  const handleRetake = () => {
    setPhotoPreview(null);
    setShowCamera(true);
  };

  const handleComplete = () => {
    if (!photoPreview) {
      alert("A live completion photo is required to submit this task.");
      return;
    }
    if (onStatusChange) onStatusChange(task.id, 'Completed');
    alert(`Task "${task.title}" marked as completed!`);
    onClose();
  };

  const handleFlag = () => {
    if (!photoPreview) {
      alert("A live photo is required to flag an issue.");
      return;
    }
    if (!flagReason.trim()) {
      alert("Please describe the issue before flagging.");
      return;
    }
    if (onStatusChange) onStatusChange(task.id, 'Flagged');
    alert(`Issue flagged for ${task.title}. Admin notified!`);
    onClose();
  };

  const completedCount = checklist.filter(c => c.completed).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm font-['Poppins']">
      <div className="bg-white rounded-[32px] w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className={`${isFlagging ? 'bg-rose-700' : 'bg-[#0a2e27]'} p-6 flex justify-between items-start shrink-0 transition-colors`}>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-white/70">
              {task.priority} Priority · {task.zone}
            </span>
            <h2 className="text-xl font-bold text-white mt-0.5">{task.title}</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto space-y-6">

          {/* Meta */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-[#f8fafc] rounded-2xl border border-[#e2e8f0]">
            <div className="flex items-center gap-3">
              <User size={18} className="text-gray-400 shrink-0" />
              <div>
                <p className="text-xs font-medium text-gray-500">Assigned To</p>
                <p className="text-sm font-bold text-gray-900">{task.assignedTo}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={18} className="text-gray-400 shrink-0" />
              <div>
                <p className="text-xs font-medium text-gray-500">Due Time</p>
                <p className="text-sm font-bold text-gray-900">{task.dueDate}</p>
              </div>
            </div>
          </div>

          {isFlagging ? (
            <div className="space-y-5">
              <div className="bg-rose-50 text-rose-800 p-4 rounded-xl text-sm font-medium flex items-center gap-3 border border-rose-200">
                <AlertTriangle size={20} className="text-rose-600 shrink-0" />
                <span>A live photo and issue description are required to flag this task.</span>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#4a5568] mb-2">
                  Live Photo Evidence <span className="text-rose-500">*</span>
                </label>
                {photoPreview ? (
                  <div className="relative rounded-xl overflow-hidden h-48 bg-gray-900 border border-[#e2e8f0]">
                    <img src={photoPreview} alt="Evidence" className="w-full h-full object-cover" />
                    <button type="button" onClick={handleRetake} className="absolute top-3 right-3 bg-black/70 hover:bg-black text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
                      <Camera size={13} /> Retake
                    </button>
                  </div>
                ) : showCamera ? (
                  <CameraView onCapture={handleCapture} onCancel={() => setShowCamera(false)} accentColor="rose" />
                ) : (
                  <button type="button" onClick={() => setShowCamera(true)} className="w-full border-2 border-dashed border-rose-300 hover:border-rose-400 bg-rose-50/50 rounded-xl h-40 flex flex-col items-center justify-center cursor-pointer transition p-4 text-center">
                    <Camera size={24} className="text-rose-500 mb-2" />
                    <span className="text-sm font-bold text-gray-700">Open Camera</span>
                    <span className="text-xs text-gray-500 mt-1">Live photo only — no saved photos</span>
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-[#4a5568] mb-2">
                  Reason for Flagging <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={flagReason}
                  onChange={(e) => setFlagReason(e.target.value)}
                  placeholder="e.g. Equipment broken, area unsafe, supplies missing..."
                  className="w-full px-4 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:border-[#0a2e27] resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => { setIsFlagging(false); setShowCamera(false); setPhotoPreview(null); }} className="flex-1 py-3.5 border border-[#e2e8f0] rounded-xl font-bold text-[#4a5568] text-sm hover:bg-gray-50 transition-colors">
                  Back
                </button>
                <button onClick={handleFlag} disabled={!photoPreview || !flagReason.trim()} className="flex-1 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-sm">
                  <Flag size={16} /> Submit Flag
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Checklist */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm font-bold text-[#4a5568] flex items-center gap-2">
                    <CheckSquare size={16} /> Task Action Checklist
                  </p>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                    {completedCount}/{checklist.length} Done
                  </span>
                </div>
                <div className="space-y-3">
                  {checklist.map((item) => (
                    <div key={item.id} onClick={() => toggleCheckitem(item.id)}
                      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition ${
                        item.completed ? 'bg-emerald-50/60 border-emerald-100' : 'bg-white border-[#e2e8f0] hover:border-gray-300 shadow-sm'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center border shrink-0 ${
                        item.completed ? 'bg-[#0a2e27] border-[#0a2e27] text-white' : 'border-[#e2e8f0]'
                      }`}>
                        {item.completed && <CheckCircle2 size={16} />}
                      </div>
                      <span className={`text-sm font-medium ${item.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Camera Proof */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm font-bold text-[#4a5568] flex items-center gap-2">
                    <Camera size={16} /> Execution Proof <span className="text-rose-500">*</span>
                  </p>
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">Required</span>
                </div>

                {photoPreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-[#e2e8f0] h-48 bg-gray-900">
                    <img src={photoPreview} alt="Task Completion Proof" className="w-full h-full object-cover" />
                    <button type="button" onClick={handleRetake} className="absolute top-3 right-3 bg-black/70 hover:bg-black text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition">
                      <Camera size={13} /> Retake
                    </button>
                    <div className="absolute bottom-3 left-3 bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                      <CheckCircle2 size={14} /> Photo Captured
                    </div>
                  </div>
                ) : showCamera ? (
                  <CameraView onCapture={handleCapture} onCancel={() => setShowCamera(false)} accentColor="amber" />
                ) : (
                  <button type="button" onClick={() => setShowCamera(true)} className="w-full border-2 border-dashed border-amber-300 hover:border-amber-400 bg-amber-50/50 rounded-xl h-40 flex flex-col items-center justify-center cursor-pointer transition p-4 text-center">
                    <Camera size={26} className="text-amber-600 mb-2" />
                    <span className="text-sm font-bold text-gray-800">Open Camera</span>
                    <span className="text-xs text-gray-500 mt-1">Live photo only — no saved photos</span>
                  </button>
                )}

                {!photoPreview && !showCamera && (
                  <p className="text-xs text-amber-700 font-medium mt-2.5 flex items-center gap-1.5">
                    <AlertTriangle size={14} className="shrink-0 text-amber-600" />
                    You must take a live photo before completing the task.
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button onClick={handleComplete} disabled={!photoPreview} className="flex-1 bg-[#0a2e27] hover:bg-[#08241f] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors flex justify-center items-center gap-2 shadow-sm text-sm">
                  <CheckCircle2 size={18} /> Complete Task
                </button>
                <button onClick={() => { setIsFlagging(true); setShowCamera(false); setPhotoPreview(null); }} className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold px-5 py-3.5 rounded-xl transition-colors flex items-center gap-2 text-sm">
                  <Flag size={18} /> Flag
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}