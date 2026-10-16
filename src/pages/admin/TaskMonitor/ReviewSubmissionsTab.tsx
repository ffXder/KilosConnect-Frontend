import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle2,
  Eye,
  X,
  AlertTriangle,
  ShieldAlert,
  Loader2,
  RefreshCw,
  XCircle,
  MessageSquare,
  ImageOff,
  PartyPopper,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';
import { useTaskModeration } from '../../../hooks/useTaskModeration';
import { useTasks } from '../../../hooks/useTask';
import type { TaskLog } from '../../../types/task';

/* Keyframes live here so no Tailwind config changes are needed */
const AnimationStyles = () => (
  <style>{`
    @keyframes rs-fade-in { from { opacity: 0 } to { opacity: 1 } }
    @keyframes rs-pop-in { from { opacity: 0; transform: scale(.95) translateY(8px) } to { opacity: 1; transform: scale(1) translateY(0) } }
    @keyframes rs-row-in { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }
    @keyframes rs-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
    .rs-fade-in { animation: rs-fade-in .2s ease-out both }
    .rs-pop-in { animation: rs-pop-in .25s cubic-bezier(.16,1,.3,1) both }
    .rs-row-in { animation: rs-row-in .35s ease-out both }
    .rs-float { animation: rs-float 2.5s ease-in-out infinite }
    @media (prefers-reduced-motion: reduce) {
      .rs-fade-in, .rs-pop-in, .rs-row-in, .rs-float { animation: none }
    }
  `}</style>
);

const getReferenceUrl = (
  log: TaskLog,
  tasks: ReturnType<typeof useTasks>['tasks'],
): string | null => {
  const standardPhotoUrl: unknown =
    log.task?.standardPhotoUrl ??
    tasks.find((task) => task._id === log.task?._id)?.standardPhotoUrl;
  if (typeof standardPhotoUrl === 'string') return standardPhotoUrl;
  if (
    standardPhotoUrl &&
    typeof standardPhotoUrl === 'object' &&
    'url' in standardPhotoUrl &&
    typeof standardPhotoUrl.url === 'string'
  ) {
    return standardPhotoUrl.url;
  }
  return null;
};

const PhotoFallback = ({ className = '' }: { className?: string }) => (
  <div className={`flex items-center justify-center bg-slate-100 text-slate-300 dark:bg-slate-800 dark:text-slate-600 ${className}`}>
    <ImageOff size={22} />
  </div>
);

/* ------------------------------------------------------------------ */
/* Zoomable image viewer                                               */
/* Wheel / buttons / +,- keys to zoom, drag to pan, double-click to    */
/* toggle, 0 to reset, arrow keys or tabs to switch between photos.    */
/* ------------------------------------------------------------------ */
type LightboxImage = { key: string; label: string; url: string };

const MIN_SCALE = 1;
const MAX_SCALE = 5;

const ImageLightbox: React.FC<{
  images: LightboxImage[];
  startKey: string;
  onClose: () => void;
}> = ({ images, startKey, onClose }) => {
  const [index, setIndex] = useState(Math.max(0, images.findIndex((i) => i.key === startKey)));
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dragRef = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  const current = images[index];

  const clampOffset = (x: number, y: number, s: number) => {
    const el = stageRef.current;
    if (!el || s <= 1) return { x: 0, y: 0 };
    const maxX = (el.clientWidth * (s - 1)) / 2;
    const maxY = (el.clientHeight * (s - 1)) / 2;
    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    };
  };

  const applyScale = (next: number) => {
    const s = Math.min(MAX_SCALE, Math.max(MIN_SCALE, next));
    setScale(s);
    setOffset((o) => clampOffset(o.x, o.y, s));
  };

  const reset = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  const goTo = (i: number) => {
    setIndex((i + images.length) % images.length);
    reset();
  };

  // Keyboard. Registered in the capture phase so Escape closes only the
  // viewer and never the modal underneath it.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      } else if (e.key === '+' || e.key === '=') {
        applyScale(scale * 1.25);
      } else if (e.key === '-') {
        applyScale(scale / 1.25);
      } else if (e.key === '0') {
        reset();
      } else if (e.key === 'ArrowRight' && images.length > 1 && scale === 1) {
        goTo(index + 1);
      } else if (e.key === 'ArrowLeft' && images.length > 1 && scale === 1) {
        goTo(index - 1);
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  });

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    if (scale <= 1) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    setOffset(clampOffset(d.ox + (e.clientX - d.x), d.oy + (e.clientY - d.y), scale));
  };

  const endDrag = () => {
    dragRef.current = null;
    setDragging(false);
  };

  const toolBtn =
    'inline-flex h-9 w-9 items-center justify-center rounded-full text-white/90 hover:bg-white/15 disabled:opacity-30 disabled:hover:bg-transparent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      className="rs-fade-in fixed inset-0 z-[70] bg-black/90"
    >
      {/* Stage */}
      <div
        ref={stageRef}
        className={`absolute inset-0 flex items-center justify-center overflow-hidden touch-none select-none ${
          scale > 1 ? (dragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in'
        }`}
        onWheel={(e) => applyScale(scale * (e.deltaY < 0 ? 1.15 : 1 / 1.15))}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={() => (scale > 1 ? reset() : applyScale(2.5))}
        onClick={(e) => {
          if (e.target === e.currentTarget && scale === 1) onClose();
        }}
      >
        <img
          key={current.key}
          src={current.url}
          alt={current.label}
          draggable={false}
          className="max-h-full max-w-full object-contain p-4 sm:p-12"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transition: dragging ? 'none' : 'transform .15s ease-out',
          }}
        />
      </div>

      {/* Top bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-4 bg-gradient-to-b from-black/60 to-transparent p-4 sm:p-6">
        <div className="pointer-events-auto flex flex-wrap items-center gap-2">
          {images.length > 1 ? (
            images.map((img, i) => (
              <button
                key={img.key}
                type="button"
                onClick={() => goTo(i)}
                aria-pressed={i === index}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
                  i === index
                    ? 'bg-white text-slate-900'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {img.label}
              </button>
            ))
          ) : (
            <span className="rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white">
              {current.label}
            </span>
          )}
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close image viewer"
          className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <X size={20} />
        </button>
      </div>

      {/* Zoom toolbar */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 bg-gradient-to-t from-black/60 to-transparent p-4 pb-6">
        <div className="pointer-events-auto flex items-center gap-1 rounded-full bg-white/10 p-1 backdrop-blur">
          <button
            type="button"
            onClick={() => applyScale(scale / 1.25)}
            disabled={scale <= MIN_SCALE}
            aria-label="Zoom out"
            title="Zoom out (-)"
            className={toolBtn}
          >
            <ZoomOut size={18} />
          </button>
          <span className="w-14 text-center text-xs font-semibold tabular-nums text-white">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            onClick={() => applyScale(scale * 1.25)}
            disabled={scale >= MAX_SCALE}
            aria-label="Zoom in"
            title="Zoom in (+)"
            className={toolBtn}
          >
            <ZoomIn size={18} />
          </button>
          <span className="mx-1 h-5 w-px bg-white/20" aria-hidden="true" />
          <button
            type="button"
            onClick={reset}
            disabled={scale === 1}
            aria-label="Reset zoom"
            title="Reset (0)"
            className={toolBtn}
          >
            <RotateCcw size={16} />
          </button>
        </div>
        <p className="hidden text-xs text-white/50 sm:block">
          Scroll to zoom · Drag to pan · Double-click to toggle
        </p>
      </div>
    </div>
  );
};

/* Photo thumbnail that opens the viewer */
const ZoomablePhoto: React.FC<{
  url: string;
  alt: string;
  frameClass: string;
  onOpen: () => void;
}> = ({ url, alt, frameClass, onOpen }) => (
  <button
    type="button"
    onClick={onOpen}
    aria-label={`View ${alt} full size`}
    className={`group relative block w-full cursor-zoom-in overflow-hidden rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${frameClass}`}
  >
    <img src={url} alt={alt} className="block h-auto w-full object-contain" />
    <span className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
    <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-lg bg-black/55 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
      <ZoomIn size={13} />
      Zoom
    </span>
  </button>
);

export const ReviewSubmissionsTab: React.FC = () => {
  const { disputedQueue, loading, error, refresh, resolve } = useTaskModeration();
  const { tasks } = useTasks();

  const [selectedSub, setSelectedSub] = useState<TaskLog | null>(null);
  const [lightboxKey, setLightboxKey] = useState<string | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [targetLogId, setTargetLogId] = useState<string | null>(null);
  const [resolutionType, setResolutionType] = useState<'APPROVE' | 'REJECT'>('APPROVE');
  const [adminNote, setAdminNote] = useState('');

  const closeInspect = () => {
    setSelectedSub(null);
    setLightboxKey(null);
  };

  const closeResolve = () => {
    if (isActionLoading) return;
    setIsResolveModalOpen(false);
    setActionError(null);
  };

  const handleDirectApprove = async (logId: string) => {
    setIsActionLoading(true);
    setActionError(null);
    try {
      await resolve(logId, 'APPROVE', 'Approved by admin review.');
      if (selectedSub?._id === logId) closeInspect();
    } catch (err: any) {
      console.error('Failed to approve dispute resolution:', err);
      setActionError(err?.message ?? 'Failed to approve the dispute.');
    } finally {
      setIsActionLoading(false);
    }
  };

  const openResolveModal = (logId: string, type: 'APPROVE' | 'REJECT') => {
    setTargetLogId(logId);
    setResolutionType(type);
    setAdminNote('');
    setActionError(null);
    setIsResolveModalOpen(true);
  };

  const handleModalSubmit = async () => {
    if (!targetLogId) return;
    setIsActionLoading(true);
    setActionError(null);
    try {
      await resolve(targetLogId, resolutionType, adminNote.trim() || undefined);
      if (selectedSub?._id === targetLogId) closeInspect();
      setIsResolveModalOpen(false);
      setTargetLogId(null);
    } catch (err: any) {
      console.error('Failed to submit resolution:', err);
      setActionError(err?.message ?? 'Failed to submit the resolution.');
    } finally {
      setIsActionLoading(false);
    }
  };

  // One place for Escape + scroll lock. Escape closes the top-most modal.
  // (The image viewer handles its own Escape first.)
  const anyModalOpen = !!selectedSub || isResolveModalOpen;
  useEffect(() => {
    if (!anyModalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || isActionLoading) return;
      if (isResolveModalOpen) {
        setIsResolveModalOpen(false);
        setActionError(null);
      } else {
        setSelectedSub(null);
        setLightboxKey(null);
      }
    };
    window.addEventListener('keydown', onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [anyModalOpen, isResolveModalOpen, isActionLoading]);

  const referenceUrl = selectedSub ? getReferenceUrl(selectedSub, tasks) : null;
  const proofUrl = selectedSub?.submittedPhoto || null;

  const lightboxImages: LightboxImage[] = [
    ...(referenceUrl ? [{ key: 'reference', label: 'Reference standard', url: referenceUrl }] : []),
    ...(proofUrl ? [{ key: 'proof', label: 'Custodian proof', url: proofUrl }] : []),
  ];

  const targetLog = disputedQueue.find((l) => l._id === targetLogId) ?? null;
  const shownError = error || (!isResolveModalOpen ? actionError : null);
  const isApprove = resolutionType === 'APPROVE';

  return (
    <div className="space-y-6">
      <AnimationStyles />

      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden dark:bg-slate-900 transition-colors duration-300 dark:border-slate-700">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex flex-wrap gap-4 justify-between items-center dark:border-slate-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">Admin Task Moderation Queue</h2>
            <p className="text-sm text-gray-500 mt-0.5 dark:text-slate-300">
              Review and resolve disputed tasks flagged by custodians or peers.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={refresh}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer dark:text-slate-300 dark:hover:text-slate-50 dark:hover:bg-slate-800"
              title="Refresh Queue"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-full border border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-700">
              {disputedQueue.length > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
              )}
              {disputedQueue.length} Disputed
            </span>
          </div>
        </div>

        {/* Error */}
        {shownError && (
          <div className="rs-fade-in p-4 bg-rose-50 border-b border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300">
            <AlertTriangle size={16} />
            <span>{shownError}</span>
          </div>
        )}

        {/* Content */}
        {loading && disputedQueue.length === 0 ? (
          <div className="divide-y divide-gray-100 dark:divide-slate-700">
            {[0, 1, 2].map((i) => (
              <div key={i} className="p-6 flex items-center gap-4 animate-pulse">
                <div className="w-14 h-14 rounded-xl bg-slate-200 dark:bg-slate-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="h-3 w-1/4 rounded bg-slate-100 dark:bg-slate-800" />
                </div>
              </div>
            ))}
          </div>
        ) : disputedQueue.length === 0 ? (
          <div className="rs-fade-in p-14 flex flex-col items-center text-center">
            <div className="rs-float w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 dark:bg-emerald-950/40 dark:text-emerald-400">
              <PartyPopper size={28} />
            </div>
            <p className="font-bold text-slate-800 dark:text-slate-100">All clear!</p>
            <p className="text-sm text-slate-400 dark:text-slate-300">No disputed tasks waiting for admin resolution.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-300">
                  <th className="py-3.5 px-4 md:px-6">Proof</th>
                  <th className="py-3.5 px-4">Task</th>
                  <th className="py-3.5 px-4">Submitted By</th>
                  <th className="py-3.5 px-4">Dispute Reason</th>
                  <th className="py-3.5 px-4 text-right md:pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm dark:divide-slate-700">
                {disputedQueue.map((sub, i) => (
                  <tr
                    key={sub._id}
                    onClick={() => setSelectedSub(sub)}
                    style={{ animationDelay: `${i * 60}ms` }}
                    className="rs-row-in group cursor-pointer hover:bg-slate-50/80 transition-colors dark:hover:bg-slate-800/60"
                  >
                    <td className="py-4 px-4 md:px-6">
                      {sub.submittedPhoto ? (
                        <img
                          src={sub.submittedPhoto}
                          alt="Proof"
                          className="w-14 h-14 rounded-xl object-cover border border-gray-200 transition-transform duration-200 group-hover:scale-105 dark:border-slate-600"
                        />
                      ) : (
                        <PhotoFallback className="w-14 h-14 rounded-xl" />
                      )}
                    </td>

                    <td className="py-4 px-4 max-w-xs">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {sub.task?.title || 'Untitled Task'}
                        </span>
                        <span className="text-xs font-medium text-indigo-600 dark:text-indigo-300">
                          {sub.task?.area || 'General Area'}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-slate-700 font-semibold text-xs dark:text-slate-200">
                      {sub.completedBy?.firstName || 'Custodian'}
                    </td>

                    <td className="py-4 px-4 max-w-sm">
                      {sub.verificationNote ? (
                        <span className="inline-flex items-start gap-1.5 text-xs font-medium text-purple-800 bg-purple-50 border border-purple-200 rounded-lg px-2.5 py-1.5 dark:bg-purple-950/40 dark:text-purple-200 dark:border-purple-700">
                          <AlertTriangle size={13} className="shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{sub.verificationNote}</span>
                        </span>
                      ) : (
                        <span className="text-xs text-slate-300 dark:text-slate-600">—</span>
                      )}
                    </td>

                    <td className="py-4 px-4 md:pr-6 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedSub(sub)}
                          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer dark:hover:text-slate-100 dark:hover:bg-slate-800"
                          title="Inspect"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => openResolveModal(sub._id, 'REJECT')}
                          disabled={isActionLoading}
                          className="inline-flex items-center gap-1 px-3 py-1.5 border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-bold transition-all active:scale-95 disabled:opacity-50 cursor-pointer dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950/70"
                        >
                          <XCircle size={14} />
                          Reject
                        </button>
                        <button
                          onClick={() => handleDirectApprove(sub._id)}
                          disabled={isActionLoading}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                        >
                          <CheckCircle2 size={14} />
                          Approve
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* INSPECT MODAL */}
      {selectedSub && (
        <div
          className="rs-fade-in fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-sm p-0 sm:p-4"
          onClick={() => !isActionLoading && closeInspect()}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="inspect-title"
            className="rs-pop-in bg-white w-full max-w-4xl flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden rounded-t-2xl sm:rounded-2xl shadow-2xl ring-1 ring-black/5 dark:bg-slate-900 dark:text-slate-100 dark:ring-white/10 dark:[color-scheme:dark]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-4 px-6 py-5 sm:px-8 border-b border-slate-200 dark:border-slate-700 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center dark:bg-purple-900/40 dark:text-purple-300">
                  <ShieldAlert size={20} />
                </div>
                <div className="min-w-0">
                  <h3 id="inspect-title" className="text-lg font-bold leading-tight text-gray-900 truncate dark:text-slate-100">
                    {selectedSub.task?.title}
                  </h3>
                  <p className="text-sm text-indigo-600 mt-0.5 truncate dark:text-indigo-300">
                    Location: {selectedSub.task?.area} • Submitted by {selectedSub.completedBy?.firstName || 'Custodian'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeInspect}
                aria-label="Close"
                className="shrink-0 -mr-2 p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/40"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-8 space-y-8">
              {selectedSub.verificationNote && (
                <div className="flex items-start gap-3 rounded-xl border border-purple-200 bg-purple-50 p-4 dark:border-purple-700/60 dark:bg-purple-950/40">
                  <AlertTriangle size={18} className="mt-0.5 shrink-0 text-purple-700 dark:text-purple-300" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-purple-900 dark:text-purple-200">Dispute detail</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-purple-800 break-words dark:text-purple-300">
                      {selectedSub.verificationNote}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Reference */}
                <section>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 dark:text-slate-200">
                    Reference standard photo
                  </h4>
                  {referenceUrl ? (
                    <ZoomablePhoto
                      url={referenceUrl}
                      alt="Reference standard photo"
                      frameClass="ring-1 ring-gray-200 dark:ring-slate-700"
                      onOpen={() => setLightboxKey('reference')}
                    />
                  ) : (
                    <PhotoFallback className="aspect-video w-full rounded-xl ring-1 ring-gray-200 dark:ring-slate-700" />
                  )}
                  <p className="mt-2 text-xs text-gray-500 dark:text-slate-400">Expected setup for this zone.</p>
                </section>

                {/* Proof */}
                <section>
                  <h4 className="text-sm font-semibold text-indigo-600 mb-3 dark:text-indigo-300">
                    Custodian live proof submission
                  </h4>
                  {proofUrl ? (
                    <ZoomablePhoto
                      url={proofUrl}
                      alt="Custodian proof submission"
                      frameClass="ring-2 ring-indigo-500"
                      onOpen={() => setLightboxKey('proof')}
                    />
                  ) : (
                    <PhotoFallback className="aspect-video w-full rounded-xl ring-2 ring-indigo-500/40" />
                  )}
                  <p className="mt-2 text-xs text-gray-500 dark:text-slate-400">
                    Snapshot captured on-site during task wrap-up.
                  </p>
                </section>
              </div>
            </div>

            {/* Footer */}
            <div className="shrink-0 px-6 py-5 sm:px-8 border-t border-slate-200 bg-white flex flex-col-reverse sm:flex-row sm:justify-end gap-3 dark:border-slate-700 dark:bg-slate-900">
              <button
                type="button"
                onClick={closeInspect}
                className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/40"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => openResolveModal(selectedSub._id, 'REJECT')}
                disabled={isActionLoading}
                className="px-5 py-2.5 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] inline-flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40"
              >
                <XCircle size={18} />
                Reject dispute
              </button>
              <button
                type="button"
                onClick={() => openResolveModal(selectedSub._id, 'APPROVE')}
                disabled={isActionLoading}
                className="px-5 py-2.5 bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-sm hover:bg-emerald-800 transition-all active:scale-[0.98] inline-flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
              >
                <CheckCircle2 size={18} />
                Approve dispute
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ZOOMABLE IMAGE VIEWER */}
      {selectedSub && lightboxKey && lightboxImages.length > 0 && (
        <ImageLightbox
          images={lightboxImages}
          startKey={lightboxKey}
          onClose={() => setLightboxKey(null)}
        />
      )}

      {/* RESOLUTION MODAL */}
      {isResolveModalOpen && (
        <div
          className="rs-fade-in fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-sm p-0 sm:p-4"
          onClick={closeResolve}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="resolve-title"
            className="rs-pop-in bg-white w-full max-w-lg flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden rounded-t-2xl sm:rounded-2xl shadow-2xl ring-1 ring-black/5 dark:bg-slate-900 dark:ring-white/10 dark:[color-scheme:dark]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-5 sm:px-8 border-b border-slate-200 dark:border-slate-700 shrink-0">
              <div
                className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isApprove
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                    : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                }`}
              >
                {isApprove ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
              </div>
              <div className="min-w-0">
                <h3 id="resolve-title" className="text-lg font-bold leading-tight text-gray-900 dark:text-slate-100">
                  {isApprove ? 'Approve task submission' : 'Reject task submission'}
                </h3>
                <p className="mt-0.5 text-sm text-gray-500 truncate dark:text-slate-400">
                  {targetLog?.task?.title || 'Provide optional context for the log record.'}
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-8 space-y-5">
              <div>
                <label
                  htmlFor="admin-note"
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2 dark:text-slate-200"
                >
                  <MessageSquare size={14} />
                  Admin resolution note
                  <span className="font-normal text-gray-400 dark:text-slate-500">(optional)</span>
                </label>
                <textarea
                  id="admin-note"
                  autoFocus
                  rows={4}
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder={
                    isApprove
                      ? 'e.g. Verified layout meets standards.'
                      : 'Explain why this submission was rejected...'
                  }
                  className={`w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-[15px] leading-relaxed text-slate-900 placeholder:text-gray-400 outline-none resize-none transition-colors focus:ring-2 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100 dark:placeholder:text-slate-500 ${
                    isApprove
                      ? 'focus:border-sky-500 focus:ring-sky-500/20'
                      : 'focus:border-rose-500 focus:ring-rose-500/20'
                  }`}
                />
              </div>

              {actionError && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 rounded-xl bg-rose-50 p-4 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"
                >
                  <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                  <p>{actionError}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="shrink-0 px-6 py-5 sm:px-8 border-t border-slate-200 bg-white flex flex-col-reverse sm:flex-row sm:justify-end gap-3 dark:border-slate-700 dark:bg-slate-900">
              <button
                type="button"
                onClick={closeResolve}
                disabled={isActionLoading}
                className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/40"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleModalSubmit}
                disabled={isActionLoading}
                className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 text-white rounded-xl text-sm font-semibold shadow-sm disabled:opacity-60 transition-all active:scale-[0.98] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
                  isApprove
                    ? 'bg-emerald-700 hover:bg-emerald-800 focus-visible:ring-emerald-500/50'
                    : 'bg-rose-600 hover:bg-rose-700 focus-visible:ring-rose-500/50'
                }`}
              >
                {isActionLoading && <Loader2 size={16} className="animate-spin" />}
                {isActionLoading ? 'Saving...' : `Confirm ${isApprove ? 'approval' : 'rejection'}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewSubmissionsTab;
