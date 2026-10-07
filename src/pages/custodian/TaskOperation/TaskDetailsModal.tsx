import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X, Camera, CheckCircle2,
  AlertTriangle, Clock, User, CheckSquare, SwitchCamera
} from 'lucide-react';
import type { TaskLogStatus } from '../../../types/task';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  zone: string;
  startedBy?: string | null;
  completedBy?: string | null;
  priority: 'Low' | 'Medium' | 'High';
  status: TaskLogStatus;
  dueDate: string;
  requiresVerification: boolean;
  checklist: ChecklistItem[];
  notes?: string;
}

interface TaskDetailsModalProps {
  task: TaskItem;
  onClose: () => void;
  onStart: (taskId: string) => Promise<void>;
  onToggleItem: (taskId: string, itemId: string) => Promise<void>;
  onComplete: (taskId: string, photo?: Blob) => Promise<void>;
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

  // for live photo time stamp
  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);

    // timestamp overlay
    const stamp = new Date().toLocaleString('en-PH', {
      timeZone: 'Asia/Manila',
      dateStyle: 'medium',
      timeStyle: 'medium',
    });
    const fontSize = Math.round(canvas.width * 0.03);
    const pad = Math.round(fontSize * 0.6);
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textBaseline = 'bottom';
    const textWidth = ctx.measureText(stamp).width;

    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(0, canvas.height - fontSize - pad * 2, textWidth + pad * 2, fontSize + pad * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(stamp, pad, canvas.height - pad);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    streamRef.current?.getTracks().forEach(t => t.stop());
    onCapture(dataUrl);
  };

  const ringColor = accentColor === 'rose' ? 'ring-rose-500' : 'ring-amber-500';
  const btnColor = accentColor === 'rose'
    ? 'bg-rose-600 hover:bg-rose-700'
    : 'bg-[#0a2e27] hover:bg-[#08241f]';

  return (
    <div className="bg-white rounded-[32px] w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
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
export default function TaskDetailsModal({
  task,
  onClose,
  onStart,
  onToggleItem,
  onComplete,
}: TaskDetailsModalProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const checklist = task.checklist; // always from props (server data)
  const isInProgress = task.status === 'In Progress';
  const completedCount = checklist.filter(c => c.completed).length;
  const allDone = checklist.every(c => c.completed);
  const photoOk = !task.requiresVerification || !!photoPreview;
  const canComplete = isInProgress && allDone && photoOk && !submitting;

  const run = async (fn: () => Promise<void>) => {
    try {
      setSubmitting(true);
      await fn();
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStart = () => run(() => onStart(task.id));

  const toggleCheckitem = (itemId: string) => {
    if (!isInProgress || submitting) return;
    run(() => onToggleItem(task.id, itemId));
  };

  const handleCapture = (dataUrl: string) => {
    setPhotoPreview(dataUrl);
    setShowCamera(false);
  };

  const handleRetake = () => {
    setPhotoPreview(null);
    setShowCamera(true);
  };

  const handleComplete = () =>
  run(async () => {
    const blob = photoPreview ? await (await fetch(photoPreview)).blob() : undefined;
    await onComplete(task.id, blob);

    setShowSuccess(true);                                // show the animation
    await new Promise(r => setTimeout(r, 1800));         // let it play
    onClose();                                           // then go back to the list
  });

  return (
    <div className="fixed inset-0 z-50 bg-white sm:bg-black/60 sm:flex sm:items-center sm:justify-center sm:p-4 dark:bg-slate-950 sm:dark:bg-black/60">
      <div className="relative bg-white w-full h-full sm:h-auto sm:max-w-xl sm:rounded-[32px] sm:max-h-[90vh] overflow-hidden flex flex-col dark:bg-slate-900 dark:border dark:border-slate-700">

        {showSuccess && (
          <div className="success-fade absolute inset-0 z-10 bg-white flex flex-col items-center justify-center gap-3 dark:bg-slate-900">
            <style>{`
              @keyframes drawStroke { to { stroke-dashoffset: 0; } }
              @keyframes popIn {
                0% { transform: scale(0.6); opacity: 0; }
                60% { transform: scale(1.08); opacity: 1; }
                100% { transform: scale(1); opacity: 1; }
              }
              @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
              .success-fade { animation: fadeIn 0.2s ease-out both; }
              .success-icon { animation: popIn 0.5s ease-out both; }
              .success-circle {
                stroke-dasharray: 151; stroke-dashoffset: 151;
                animation: drawStroke 0.6s ease-out 0.1s forwards;
              }
              .success-check {
                stroke-dasharray: 40; stroke-dashoffset: 40;
                animation: drawStroke 0.4s ease-out 0.55s forwards;
              }
              .success-text { animation: fadeIn 0.4s ease-out 0.8s both; }
            `}</style>

            <svg className="success-icon text-[#0a2e27] dark:text-emerald-400" width="110" height="110" viewBox="0 0 52 52">
              <circle className="success-circle" cx="26" cy="26" r="24" fill="none" stroke="currentColor" strokeWidth="3" />
              <path className="success-check" d="M15 27l7 7 15-16" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            <p className="success-text text-xl font-bold text-[#0a2e27] dark:text-emerald-400">Task Completed!</p>
            <p className="success-text text-sm font-medium text-gray-500 dark:text-slate-400">{task.title}</p>
          </div>
        )}

        {/* Header */}
        <div className="bg-[#0a2e27] p-6 flex justify-between items-start shrink-0">
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
          <div className="grid grid-cols-2 gap-4 p-4 bg-[#f8fafc] rounded-2xl border border-[#e2e8f0] dark:bg-slate-800 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <User size={18} className="text-gray-400 shrink-0 dark:text-slate-300" />
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-slate-300">Assigned To</p>
                <p className="text-sm font-bold text-gray-900 dark:text-slate-100">{task.startedBy}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={18} className="text-gray-400 shrink-0 dark:text-slate-300" />
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-slate-300">Due Time</p>
                <p className="text-sm font-bold text-gray-900 dark:text-slate-100">{task.dueDate}</p>
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm font-bold text-[#4a5568] flex items-center gap-2 dark:text-slate-100">
                <CheckSquare size={16} /> Task Action Checklist
              </p>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md dark:bg-emerald-950 dark:text-emerald-200">
                {completedCount}/{checklist.length} Done
              </span>
            </div>

            {task.status === 'Pending' && (
              <p className="text-xs text-gray-500 font-medium mb-3 dark:text-slate-300">
                Start the task to unlock the checklist.
              </p>
            )}

            <div className="space-y-3">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleCheckitem(item.id)}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition ${
                    isInProgress ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                  } ${
                    item.completed
                      ? 'bg-emerald-50/60 border-emerald-100 dark:bg-emerald-950/40 dark:border-emerald-900'
                      : 'bg-white border-[#e2e8f0] hover:border-gray-300 shadow-sm dark:bg-slate-900 dark:border-slate-700 dark:hover:border-slate-600 dark:shadow-none'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center border shrink-0 ${
                    item.completed ? 'bg-[#0a2e27] border-[#0a2e27] text-white' : 'border-[#e2e8f0] dark:border-slate-600'
                  }`}>
                    {item.completed && <CheckCircle2 size={16} />}
                  </div>
                  <span className={`text-sm font-medium ${item.completed ? 'line-through text-gray-400 dark:text-slate-500' : 'text-gray-600 dark:text-slate-200'}`}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Live Camera Proof (only while In Progress) */}
          {isInProgress && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-bold text-[#4a5568] flex items-center gap-2 dark:text-slate-50">
                  <Camera size={16} /> Execution Proof
                  {task.requiresVerification && <span className="text-rose-500">*</span>}
                </p>
                {task.requiresVerification ? (
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md dark:bg-rose-950 dark:text-rose-200">Required</span>
                ) : (
                  <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md dark:bg-slate-800 dark:text-slate-300">Optional</span>
                )}
              </div>

              {photoPreview ? (
                <div className="relative rounded-xl overflow-hidden border border-[#e2e8f0] h-48 bg-gray-900 dark:border-slate-700">
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
                <button type="button" onClick={() => setShowCamera(true)} className="w-full border-2 border-dashed border-amber-300 hover:border-amber-400 bg-amber-50/50 rounded-xl h-40 flex flex-col items-center justify-center cursor-pointer transition p-4 text-center dark:border-amber-900 dark:bg-amber-950/20 dark:hover:bg-amber-950/40">
                  <Camera size={26} className="text-amber-600 mb-2 dark:text-amber-300" />
                  <span className="text-sm font-bold text-gray-800 dark:text-slate-100">Open Camera</span>
                  <span className="text-xs text-gray-500 mt-1 dark:text-slate-300">Live photo only — no saved photos</span>
                </button>
              )}

              {task.requiresVerification && !photoPreview && !showCamera && (
                <p className="text-xs text-amber-700 font-medium mt-2.5 flex items-center gap-1.5 dark:text-amber-300">
                  <AlertTriangle size={14} className="shrink-0 text-amber-600 dark:text-amber-300" />
                  You must take a live photo before completing the task.
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          {task.status === 'Pending' && (
            <button
              onClick={handleStart}
              disabled={submitting}
              className="w-full bg-[#0a2e27] hover:bg-[#08241f] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors text-sm shadow-sm"
            >
              {submitting ? 'Starting...' : 'Start Task'}
            </button>
          )}

          {isInProgress && (
            <div className="space-y-2">
              <button
                onClick={handleComplete}
                disabled={!canComplete}
                className="w-full bg-[#0a2e27] hover:bg-[#08241f] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors flex justify-center items-center gap-2 shadow-sm text-sm"
              >
                <CheckCircle2 size={18} />
                {submitting ? 'Submitting...' : 'Complete Task'}
              </button>
              {!allDone && (
                <p className="text-xs text-gray-500 font-medium text-center dark:text-slate-300">
                  Check off all checklist items to complete this task.
                </p>
              )}
            </div>
          )}

          {task.status === 'Completed' && (
            <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-sm font-bold flex items-center gap-3 border border-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-200 dark:border-emerald-900">
              <CheckCircle2 size={20} className="shrink-0" />
              This task has been completed. 
            </div>
          )}
        </div>
      </div>
    </div>
  );
}