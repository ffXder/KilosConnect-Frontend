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
    <div
      onClick={() => navigate("/custodian/buddy-system")}
      className="bg-gradient-to-r from-amber-50/60 to-white rounded-2xl p-3.5 sm:p-4 border border-amber-200/80 shadow-sm flex items-center gap-3 cursor-pointer active:scale-[0.99] transition-all dark:from-amber-400/10 dark:to-slate-900 dark:border-amber-200/20"
    >
      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
        <Users size={20} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-extrabold text-gray-900 text-sm truncate dark:text-slate-100">Pending Reviews</h3>
          <span className="bg-amber-100 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-extrabold shrink-0">
            {count} PENDING
          </span>
        </div>
        <p className="text-xs text-gray-500 font-medium mt-0.5 truncate dark:text-slate-300">
          Fellow custodians are waiting for your audit
        </p>
      </div>

      <ChevronRight size={22} className="text-amber-500 shrink-0" />
    </div>
  );
};