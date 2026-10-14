import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  MapPin,
  User,
  Calendar,
  CalendarClock,
  UserCheck,
  Image as ImageIcon,
  Camera,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react';
import type { LostAndFound } from '../../../types/lostAndFound';
import { formatDate, formatDateTime } from '../../../utils/formatter';

interface DetailedModalProps {
  item: LostAndFound;
  onClose: () => void;
}

/** Label above value, small icon beside the label. */
const Field: React.FC<{
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  tone?: 'default' | 'success';
}> = ({ icon, label, children, tone = 'default' }) => (
  <div className="min-w-0">
    <dt
      className={`flex items-center gap-1.5 text-xs font-medium mb-1 ${
        tone === 'success'
          ? 'text-emerald-700/80 dark:text-emerald-300/80'
          : 'text-gray-500 dark:text-slate-400'
      }`}
    >
      {icon}
      {label}
    </dt>
    <dd
      className={`text-[15px] font-medium break-words ${
        tone === 'success'
          ? 'text-emerald-900 dark:text-emerald-100'
          : 'text-gray-900 dark:text-slate-100'
      }`}
    >
      {children}
    </dd>
  </div>
);

const Photo: React.FC<{
  url: string;
  alt: string;
  ring?: string;
  onOpen: (url: string, alt: string) => void;
}> = ({ url, alt, ring, onOpen }) => (
  <button
    type="button"
    onClick={() => onOpen(url, alt)}
    aria-label={`Zoom ${alt}`}
    className={`group relative block w-full cursor-zoom-in overflow-hidden rounded-xl ${
      ring ?? 'ring-1 ring-black/5 dark:ring-white/10'
    } focus:outline-none focus-visible:ring-2 focus-visible:ring-[#11382C]/50 dark:focus-visible:ring-emerald-500/60`}
  >
    <img src={url} alt={alt} loading="lazy" className="block h-auto w-full object-contain" />
    <span className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
    <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-lg bg-black/55 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
      <ZoomIn size={13} />
      Zoom
    </span>
  </button>
);

const ImageZoomViewer: React.FC<{
  url: string;
  alt: string;
  onClose: () => void;
}> = ({ url, alt, onClose }) => {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dragRef = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  const clampOffset = (x: number, y: number, nextScale: number) => {
    const stage = stageRef.current;
    if (!stage || nextScale <= 1) return { x: 0, y: 0 };
    const maxX = (stage.clientWidth * (nextScale - 1)) / 2;
    const maxY = (stage.clientHeight * (nextScale - 1)) / 2;
    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    };
  };

  const applyScale = (nextScale: number) => {
    const boundedScale = Math.min(5, Math.max(1, nextScale));
    setScale(boundedScale);
    setOffset((current) => clampOffset(current.x, current.y, boundedScale));
  };

  const reset = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
      } else if (event.key === '+' || event.key === '=') {
        applyScale(scale * 1.25);
      } else if (event.key === '-') {
        applyScale(scale / 1.25);
      } else if (event.key === '0') {
        reset();
      }
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [onClose, scale]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (scale <= 1) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { x: event.clientX, y: event.clientY, ox: offset.x, oy: offset.y };
    setDragging(true);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    setOffset(
      clampOffset(
        drag.ox + (event.clientX - drag.x),
        drag.oy + (event.clientY - drag.y),
        scale,
      ),
    );
  };

  const endDrag = () => {
    dragRef.current = null;
    setDragging(false);
  };

  const toolButton =
    'inline-flex h-9 w-9 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/15 disabled:opacity-30 disabled:hover:bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${alt} image viewer`}
      className="fixed inset-0 z-[70] bg-black/90"
      onClick={(event) => event.stopPropagation()}
    >
      <div
        ref={stageRef}
        className={`absolute inset-0 flex touch-none select-none items-center justify-center overflow-hidden ${
          scale > 1 ? (dragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in'
        }`}
        onWheel={(event) => applyScale(scale * (event.deltaY < 0 ? 1.15 : 1 / 1.15))}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={() => (scale > 1 ? reset() : applyScale(2.5))}
        onClick={(event) => {
          if (event.target === event.currentTarget && scale === 1) onClose();
        }}
      >
        <img
          src={url}
          alt={alt}
          draggable={false}
          className="max-h-full max-w-full object-contain p-4 sm:p-12"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transition: dragging ? 'none' : 'transform .15s ease-out',
          }}
        />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between bg-gradient-to-b from-black/60 to-transparent p-4 sm:p-6">
        <span className="rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white">
          {alt}
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close image viewer"
          className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <X size={20} />
        </button>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 bg-gradient-to-t from-black/60 to-transparent p-4 pb-6">
        <div className="pointer-events-auto flex items-center gap-1 rounded-full bg-white/10 p-1 backdrop-blur">
          <button
            type="button"
            onClick={() => applyScale(scale / 1.25)}
            disabled={scale <= 1}
            aria-label="Zoom out"
            title="Zoom out (-)"
            className={toolButton}
          >
            <ZoomOut size={18} />
          </button>
          <span className="w-14 text-center text-xs font-semibold tabular-nums text-white">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            onClick={() => applyScale(scale * 1.25)}
            disabled={scale >= 5}
            aria-label="Zoom in"
            title="Zoom in (+)"
            className={toolButton}
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
            className={toolButton}
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

const Placeholder: React.FC<{
  icon: React.ReactNode;
  text: string;
  tone?: 'default' | 'success';
}> = ({ icon, text, tone = 'default' }) => (
  <div
    className={`flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed ${
      tone === 'success'
        ? 'border-emerald-200 bg-emerald-50/60 text-emerald-700/60 dark:border-emerald-500/30 dark:bg-emerald-500/5 dark:text-emerald-300/60'
        : 'border-gray-200 bg-gray-50 text-gray-400 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-500'
    }`}
  >
    {icon}
    <span className="text-xs font-medium">{text}</span>
  </div>
);

export const LoFDetailedModal: React.FC<DetailedModalProps> = ({ item, onClose }) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [zoomedImage, setZoomedImage] = useState<{ url: string; alt: string } | null>(null);

  // Escape to close, lock background scroll, focus the close button
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const isClaimed = item.status === 'Claimed';
  const isUnclaimed = item.status === 'Unclaimed';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="lof-detail-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 dark:bg-slate-900 dark:ring-white/10 animate-in fade-in zoom-in-95 duration-200 motion-reduce:animate-none"
      >
        {/* Header */}
        <div className="bg-[#11382C] px-6 py-5 sm:px-8 text-white flex justify-between items-start gap-4 shrink-0">
          <div className="min-w-0">
            <p className="text-xs text-white/60 mb-1.5">Lost and found</p>
            <h2 id="lof-detail-title" className="text-xl font-bold leading-snug">
              Item details
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 -mr-2 -mt-1 p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Photos */}
            <div className="space-y-6 min-w-0">
              <section>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-3">
                  Item photo (found)
                </h3>
                {item.itemImage?.url ? (
                  <Photo
                    url={item.itemImage.url}
                    alt={item.item}
                    onOpen={(url, alt) => setZoomedImage({ url, alt })}
                  />
                ) : (
                  <Placeholder
                    icon={<ImageIcon size={28} strokeWidth={1.5} />}
                    text="No item image"
                  />
                )}
              </section>

              {isClaimed && (
                <section>
                  <h3 className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-3">
                    Claimant / proof photo
                  </h3>
                  {item.claimedImage?.url ? (
                    <Photo
                      url={item.claimedImage.url}
                      alt="Claimant proof"
                      ring="ring-2 ring-emerald-200 dark:ring-emerald-500/40"
                      onOpen={(url, alt) => setZoomedImage({ url, alt })}
                    />
                  ) : (
                    <Placeholder
                      tone="success"
                      icon={<Camera size={28} strokeWidth={1.5} />}
                      text="No claimant photo recorded"
                    />
                  )}
                </section>
              )}
            </div>

            {/* Info */}
            <div className="space-y-6 min-w-0">
              <div>
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold mb-3 ${
                    isUnclaimed
                      ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300'
                      : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                  }`}
                >
                  {item.status}
                </span>
                <h3 className="text-2xl font-bold leading-snug text-[#1a1a1a] dark:text-slate-50 break-words">
                  {item.item}
                </h3>
                <p className="text-[15px] leading-7 text-gray-600 dark:text-slate-300 mt-2 whitespace-pre-wrap break-words">
                  {item.description || 'No description provided.'}
                </p>
              </div>

              <dl className="space-y-5 pt-6 border-t border-gray-100 dark:border-slate-700">
                <Field icon={<MapPin size={14} />} label="Area found">
                  {item.areaFound}
                </Field>
                <Field icon={<User size={14} />} label="Found by">
                  {item.reportedBy}
                </Field>
                <Field icon={<Calendar size={14} />} label="Date found">
                  {formatDate(item.date)}
                </Field>
              </dl>

              {isClaimed && (
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-5 rounded-xl bg-emerald-50/70 p-5 dark:bg-emerald-500/10">
                  <Field icon={<UserCheck size={14} />} label="Claimed by" tone="success">
                    {item.claimedBy}
                  </Field>
                  <Field icon={<CalendarClock size={14} />} label="Claim date" tone="success">
                    {item.claimedAt ? formatDateTime(item.claimedAt) : '-'}
                  </Field>
                </dl>
              )}
            </div>
            {zoomedImage && (
              <ImageZoomViewer
                url={zoomedImage.url}
                alt={zoomedImage.alt}
                onClose={() => setZoomedImage(null)}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 py-5 sm:px-8 border-t border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-900 flex sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#11382C]/40 dark:focus-visible:ring-emerald-500/40"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
