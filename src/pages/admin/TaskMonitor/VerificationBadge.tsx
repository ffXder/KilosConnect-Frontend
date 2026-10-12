import React from 'react';
import { ShieldCheck, ShieldAlert, ShieldX, ShieldQuestion } from 'lucide-react';

const styles = {
  verified: {
    cls: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    icon: ShieldCheck,
    label: 'Verified',
  },
  disputed: {
    cls: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-700',
    icon: ShieldAlert,
    label: 'Disputed',
  },
  rejected: {
    cls: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
    icon: ShieldX,
    label: 'Rejected',
  },
  pending: {
    cls: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
    icon: ShieldQuestion,
    label: 'Awaiting Review',
  },
  none: {
    cls: 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
    icon: ShieldQuestion,
    label: 'Not Submitted',
  },
};

const resolve = (value?: string) => {
  const v = value?.toLowerCase();
  if (!v) return styles.none;
  if (v.includes('verif') || v.includes('approv')) return styles.verified;
  if (v.includes('disput')) return styles.disputed;
  if (v.includes('reject')) return styles.rejected;
  if (v.includes('pend')) return styles.pending;
  return styles.none;
};

export const VerificationBadge: React.FC<{ status?: string }> = ({ status }) => {
  const { cls, icon: Icon, label } = resolve(status);
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${cls}`}>
      <Icon size={12} /> {label}
    </span>
  );
};