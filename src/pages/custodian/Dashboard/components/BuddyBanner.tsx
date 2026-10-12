import React from "react";
import { useNavigate } from "react-router-dom";
import { Users, ChevronRight } from "lucide-react";

interface BuddyBannerProps {
  count: number;
}

export const BuddyBanner: React.FC<BuddyBannerProps> = ({ count }) => {
  const navigate = useNavigate();

  if (count === 0) return null;

  return (
    <button
      type="button"
      onClick={() => navigate("/custodian/buddy-system")}
      className="w-full min-w-0 bg-gradient-to-r from-amber-50/60 to-white rounded-2xl p-4 sm:p-5 border border-amber-200/80 shadow-sm flex items-center gap-3 sm:gap-4 text-left cursor-pointer hover:shadow-md hover:border-amber-300 transition-all group dark:from-slate-900 dark:to-slate-900 dark:border-slate-700 dark:hover:border-slate-600 dark:shadow-none"
    >
      <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 dark:bg-amber-950 dark:text-amber-300">
        <Users size={20} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-extrabold text-gray-900 text-sm sm:text-base dark:text-slate-50">
            Buddy System — Pending Reviews
          </h3>
          <span className="bg-amber-100 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-extrabold tracking-wide shrink-0 dark:bg-amber-950 dark:text-amber-200">
            {count} PENDING
          </span>
        </div>
        <p className="text-xs text-gray-500 font-medium mt-0.5 dark:text-slate-300">
          Fellow custodians are waiting for your peer verification audit
        </p>
      </div>

      <ChevronRight
        size={22}
        className="text-amber-500 shrink-0 group-hover:translate-x-1 transition-transform"
      />
    </button>
  );
};