import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QrCode, Users, AlertTriangle, Package } from "lucide-react";

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"assets" | "lostAndFound">("assets");

  return (
    <div className="font-['Poppins']">
      <h3 className="text-lg font-extrabold text-gray-900 mb-4">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

        <button
          onClick={() => navigate("/scan-qr")}
          className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center gap-3 hover:shadow-md hover:border-[#0a2e27] hover:-translate-y-0.5 transition-all group w-full cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl bg-[#E6F4EA] text-[#0a2e27] flex items-center justify-center group-hover:bg-[#0a2e27] group-hover:text-white transition-colors shrink-0">
            <QrCode size={24} />
          </div>
          <div>
            <span className="block font-extrabold text-gray-900 text-sm">Scan QR Code</span>
            <span className="text-xs text-gray-400 font-medium mt-0.5 block">Start maintenance</span>
          </div>
        </button>

        <button
          onClick={() => navigate("/custodian/buddy-system")}
          className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center gap-3 hover:shadow-md hover:border-[#0a2e27] hover:-translate-y-0.5 transition-all group w-full relative cursor-pointer"
        >
          <div className="absolute top-3 right-3 bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
            3
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#E6F4EA] text-[#0a2e27] flex items-center justify-center group-hover:bg-[#0a2e27] group-hover:text-white transition-colors shrink-0">
            <Users size={24} />
          </div>
          <div>
            <span className="block font-extrabold text-gray-900 text-sm">Peer Review</span>
            <span className="text-xs text-gray-400 font-medium mt-0.5 block">Buddy system</span>
          </div>
        </button>

        <button
          onClick={() => navigate("/custodian/incident-report")}
          className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center gap-3 hover:shadow-md hover:border-[#0a2e27] hover:-translate-y-0.5 transition-all group w-full cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div>
            <span className="block font-extrabold text-gray-900 text-sm">Report Issue</span>
            <span className="text-xs text-gray-400 font-medium mt-0.5 block">Log incident</span>
          </div>
        </button>

        <button
          onClick={() => navigate("/asset-registry", { state: { activeTab: "lostAndFound" } })}
          className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center gap-3 hover:shadow-md hover:border-[#0a2e27] hover:-translate-y-0.5 transition-all group w-full cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors shrink-0">
            <Package size={24} />
          </div>
          <div>
            <span className="block font-extrabold text-gray-900 text-sm">Lost & Found</span>
            <span className="text-xs text-gray-400 font-medium mt-0.5 block">Add item</span>
          </div>
        </button>

      </div>
    </div>
  );
};