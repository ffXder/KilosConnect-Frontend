import React, { useEffect, useRef } from 'react';
import {
  X,
  MapPin,
  User,
  Calendar,
  CalendarClock,
  UserCheck,
  Image as ImageIcon,
  Camera,
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

/** Photo with a consistent 4:3 frame; opens full size in a new tab. */
const Photo: React.FC<{ url: string; alt: string; ring?: string }> = ({ url, alt, ring }) => (
  <a
    href={url}
    target="_blank"
    rel="noreferrer"
    title="Open full size"
    className={`block aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-slate-800 ${
      ring ?? 'ring-1 ring-black/5 dark:ring-white/10'
    } focus:outline-none focus-visible:ring-2 focus-visible:ring-[#11382C]/50 dark:focus-visible:ring-emerald-500/60`}
  >
    <img src={url} alt={alt} loading="lazy" className="h-full w-full object-cover" />
  </a>
);

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
                  <Photo url={item.itemImage.url} alt={item.item} />
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
