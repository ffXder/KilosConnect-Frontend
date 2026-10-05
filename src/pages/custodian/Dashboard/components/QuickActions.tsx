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
      <h3 className="text-base sm:text-lg font-extrabold text-gray-900 mb-3 sm:mb-4 dark:text-slate-50">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">

        <button onClick={() => navigate("/scan-qr")} className={card}>
          <div className={`${iconBox} bg-[#E6F4EA] text-[#0a2e27] group-hover:bg-[#0a2e27] group-hover:text-white`}>
            <QrCode className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <span className={title}>Scan QR Code</span>
            <span className={sub}>Start maintenance</span>
          </div>
        </button>

        <button onClick={() => navigate("/custodian/buddy-system")} className={`${card} relative`}>
          {reviewCount > 0 && (
            <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {reviewCount > 99 ? "99+" : reviewCount}
            </div>
          )}
          <div className={`${iconBox} bg-[#E6F4EA] text-[#0a2e27] group-hover:bg-[#0a2e27] group-hover:text-white`}>
            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <span className={title}>Peer Review</span>
            <span className={sub}>Buddy system</span>
          </div>
        </button>

        <button onClick={() => navigate("/custodian/incident-report/submit")} className={card}>
          <div className={`${iconBox} bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white`}>
            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <span className={title}>Report Issue</span>
            <span className={sub}>Log incident</span>
          </div>
        </button>

        <button onClick={() => navigate("/custodian/lost-and-found/submit")} className={card}>
          <div className={`${iconBox} bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white`}>
            <Package className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <span className={title}>Lost & Found</span>
            <span className={sub}>Add item</span>
          </div>
        </button>

      </div>
    </div>
  );
};