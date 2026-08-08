import React from "react";
import { useNavigate } from "react-router-dom";
import { Users, ChevronRight } from "lucide-react";

export const BuddyBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/buddy-system")}
      className="bg-gradient-to-r from-amber-50/60 to-white rounded-2xl p-4 sm:p-5 border border-amber-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 cursor-pointer hover:shadow-md hover:border-amber-300 transition-all group overflow-hidden"
    >
      <div className="flex items-start sm:items-center gap-3 sm:gap-4 w-full min-w-0">
        <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
          <Users size={20} />
        </div>

        <div className="flex-1 min-w-0 space-y-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-extrabold text-gray-900 text-sm sm:text-base truncate">
              Buddy System — Pending Reviews
            </h3>
            <span className="bg-amber-100 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-extrabold tracking-wide shrink-0">
              3 PENDING
            </span>
          </div>
          <p className="text-xs text-gray-500 font-medium">
            Fellow custodians are waiting for your peer verification audit
          </p>
        </div>

        <div className="hidden sm:flex items-center text-amber-500 group-hover:translate-x-1 transition-transform shrink-0">
          <ChevronRight size={22} />
        </div>
      </div>
    </div>
  );
};