import React from "react";
import { useNavigate } from "react-router-dom";
import { QrCode, Users, AlertTriangle, Package } from "lucide-react";

interface QuickActionsProps {
  reviewCount: number;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ reviewCount }) => {
  const navigate = useNavigate();

  const card =
    "bg-white p-3 sm:p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center gap-2 sm:gap-3 hover:shadow-md hover:border-[#0a2e27] sm:hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 group w-full cursor-pointer dark:bg-slate-900 dark:border-slate-700 dark:shadow-none";
  const iconBox =
    "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-colors shrink-0";
  const title = "block font-extrabold text-gray-900 text-[13px] sm:text-sm dark:text-slate-100";
  const sub = "text-[11px] sm:text-xs text-gray-400 font-medium mt-0.5 block dark:text-slate-300";

  return (
    <div className="font-['Poppins']">
      <h3 className="text-lg font-extrabold text-gray-900 mb-4 dark:text-slate-50">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">

        <button
          onClick={() => navigate("/scan-qr")}
          className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center gap-3 hover:shadow-md hover:border-[#0a2e27] hover:-translate-y-0.5 transition-all group w-full cursor-pointer dark:bg-slate-900 dark:border-slate-700 dark:hover:border-emerald-700 dark:shadow-none"
        >
          <div className="w-12 h-12 rounded-xl bg-[#E6F4EA] text-[#0a2e27] flex items-center justify-center group-hover:bg-[#0a2e27] group-hover:text-white transition-colors shrink-0 dark:bg-emerald-950 dark:text-emerald-300 dark:group-hover:bg-emerald-800 dark:group-hover:text-white">
            <QrCode size={24} />
          </div>
          <div>
            <span className="block font-extrabold text-gray-900 text-sm dark:text-slate-50">Scan QR Code</span>
            <span className="text-xs text-gray-400 font-medium mt-0.5 block dark:text-slate-400">Start maintenance</span>
          </div>
        </button>

        <button
          onClick={() => navigate("/custodian/buddy-system")}
          className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center gap-3 hover:shadow-md hover:border-[#0a2e27] hover:-translate-y-0.5 transition-all group w-full relative cursor-pointer dark:bg-slate-900 dark:border-slate-700 dark:hover:border-emerald-700 dark:shadow-none"
        >
          {reviewCount > 0 && (
            <div className="absolute top-3 right-3 bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full dark:bg-amber-950 dark:text-amber-200">
              {reviewCount > 99 ? "99+" : reviewCount}
            </div>
          )}
          <div className="w-12 h-12 rounded-xl bg-[#E6F4EA] text-[#0a2e27] flex items-center justify-center group-hover:bg-[#0a2e27] group-hover:text-white transition-colors shrink-0 dark:bg-emerald-950 dark:text-emerald-300 dark:group-hover:bg-emerald-800 dark:group-hover:text-white">
            <Users size={24} />
          </div>
          <div>
            <span className="block font-extrabold text-gray-900 text-sm dark:text-slate-50">Peer Review</span>
            <span className="text-xs text-gray-400 font-medium mt-0.5 block dark:text-slate-400">Buddy system</span>
          </div>
        </button>

        <button
          onClick={() => navigate("/custodian/incident-report/submit")}
          className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center gap-3 hover:shadow-md hover:border-[#0a2e27] hover:-translate-y-0.5 transition-all group w-full cursor-pointer dark:bg-slate-900 dark:border-slate-700 dark:hover:border-emerald-700 dark:shadow-none"
        >
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors shrink-0 dark:bg-rose-950 dark:text-rose-300">
            <AlertTriangle size={24} />
          </div>
          <div>
            <span className="block font-extrabold text-gray-900 text-sm dark:text-slate-50">Report Issue</span>
            <span className="text-xs text-gray-400 font-medium mt-0.5 block dark:text-slate-400">Log incident</span>
          </div>
        </button>

        <button
          onClick={() => navigate("/custodian/lost-and-found/submit")}
          className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center gap-3 hover:shadow-md hover:border-[#0a2e27] hover:-translate-y-0.5 transition-all group w-full cursor-pointer dark:bg-slate-900 dark:border-slate-700 dark:hover:border-emerald-700 dark:shadow-none"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors shrink-0 dark:bg-amber-950 dark:text-amber-300">
            <Package size={24} />
          </div>
          <div>
            <span className="block font-extrabold text-gray-900 text-sm dark:text-slate-50">Lost & Found</span>
            <span className="text-xs text-gray-400 font-medium mt-0.5 block dark:text-slate-400">Add item</span>
          </div>
        </button>

      </div>
    </div>
  );
};