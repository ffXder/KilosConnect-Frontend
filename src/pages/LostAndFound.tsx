import React, { useState, useEffect } from "react";
import { SidebarNavigationSection } from "../components/SidebarNavigationSection";

// --- Types for MongoDB Mapping ---
interface LostFoundItem {
  _id: string; // MongoDB ID
  name: string;
  description: string;
  location: string;
  foundBy: string;
  date: string;
  status: "Unclaimed" | "Claimed";
  claimedBy?: string;
  claimedDate?: string;
}

export const LostAndFoundPage: React.FC = () => {
  // Initialized as empty for MongoDB connection
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"All" | "Unclaimed" | "Claimed">("All");

  useEffect(() => {
    const fetchLostFound = async () => {
      try {
        // Example: const res = await fetch('/api/lost-and-found');
        // const data = await res.json();
        // setItems(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchLostFound();
  }, []);

  // Filter logic for the UI tabs
  const filteredItems = items.filter(item => 
    filter === "All" ? true : item.status === filter
  );

  return (
    <div className="flex h-screen bg-[#f4f5f6] overflow-hidden">
      <SidebarNavigationSection />

      <div className="flex flex-col flex-1 min-w-0 ml-[240px] overflow-y-auto">
        {/* Header matching dashboard theme */}
        <header className="flex items-center justify-between px-10 pt-10 pb-6">
          <div>
            <h1 className="[font-family:'Poppins',Helvetica] font-semibold text-[#1f1f1f] text-[32px] leading-tight m-0">
              Lost & Found
            </h1>
            <p className="text-[#6b6b6b] text-sm mt-1">
              Manage items stored in Maintenance and Recovery Storage
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-[#e8e8e8]">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" /></svg>
            </button>
            <img className="w-10 h-10 rounded-full border-2 border-white" src="https://c.animaapp.com/C3N4JJvt/img/profile@2x.png" alt="Profile" />
          </div>
        </header>

        <div className="px-10 pb-10 space-y-6">
          {/* Summary Stats - Updated with icons from image_4bac81.png */}
          <div className="grid grid-cols-3 gap-6">
            <StatCard 
              label="Total Items" 
              count={items.length} 
              color="text-[#0a4a44]" 
              iconBg="bg-[#dcfce7]" 
            />
            <StatCard 
              label="Unclaimed" 
              count={items.filter(i => i.status === "Unclaimed").length} 
              color="text-[#b45309]" 
              iconBg="bg-[#fef3c7]" 
            />
            <StatCard 
              label="Claimed" 
              count={items.filter(i => i.status === "Claimed").length} 
              color="text-[#15803d]" 
              iconBg="bg-[#dcfce7]" 
            />
          </div>

          {/* Search and Filters */}
          <div className="bg-white p-6 rounded-[16px] border border-[#e8e8e8] shadow-sm flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                </span>
                <input type="text" placeholder="Search items..." className="w-full pl-10 pr-4 py-2 bg-white border border-[#e8e8e8] rounded-[8px] focus:outline-none text-sm" />
              </div>
              <button className="bg-[#0a2e27] text-white px-6 py-2 rounded-[8px] text-sm font-medium hover:bg-[#08241f] transition-colors">+ Add Item</button>
            </div>
            <div className="flex gap-2">
              {["All", "Unclaimed", "Claimed"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab as any)}
                  className={`px-5 py-1.5 rounded-[8px] text-sm font-medium transition-all ${
                    filter === tab ? "bg-[#0a2e27] text-white" : "bg-[#f4f5f6] text-[#6b6b6b]"
                  }`}
                >
                  {tab === "All" ? "All Items" : tab}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Area - Populated by MongoDB */}
          <div className="bg-white p-8 rounded-[16px] border border-[#e8e8e8] shadow-sm min-h-[500px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-gray-400 animate-pulse">
                <p>Connecting to database...</p>
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.map((item) => (
                  <ItemCard key={item._id} item={item} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
                <p>No items found in record.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-components for Visual Consistency ---

const StatCard = ({ label, count, color, iconBg }: any) => (
  <div className="flex items-center gap-4 p-6 bg-white border border-[#e8e8e8] rounded-[16px] shadow-sm">
    {/* Icon Container matching image_4bac81.png */}
    <div className={`w-12 h-12 flex items-center justify-center rounded-[10px] ${iconBg}`}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={color} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 8V21H3V8" />
        <path d="M1 3H23V8H1V3Z" />
        <path d="M10 12H14" />
      </svg>
    </div>
    <div>
      <div className="text-[28px] font-bold text-[#1f1f1f] leading-none mb-1">{count}</div>
      <div className="text-xs text-[#6b6b6b] font-medium">{label}</div>
    </div>
  </div>
);

const ItemCard = ({ item }: { item: LostFoundItem }) => (
  <div className="flex flex-col bg-white border border-[#e8e8e8] rounded-[12px] p-5 relative transition-all hover:shadow-md">
    <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
      item.status === "Unclaimed" ? "bg-amber-100 text-amber-600" : "bg-green-100 text-green-600"
    }`}>
      {item.status}
    </span>

    <div className="w-10 h-10 bg-teal-50 rounded-[8px] flex items-center justify-center mb-4">
      <svg width="20" height="20" className="text-teal-600" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /></svg>
    </div>

    <h3 className="font-bold text-[#1f1f1f] text-base mb-1">{item.name}</h3>
    <p className="text-[#6b6b6b] text-xs leading-relaxed mb-4 line-clamp-2">{item.description}</p>

    <div className="space-y-2 mb-6">
      <InfoRow icon="📍" label="Found in" value={item.location} />
      <InfoRow icon="👤" label="Found by" value={item.foundBy} />
      <InfoRow icon="📅" label="Date" value={item.date} />
    </div>

    {item.status === "Claimed" ? (
      <div className="mt-auto pt-4 border-t border-[#f4f5f6] space-y-1">
        <div className="text-[11px] font-semibold text-green-600 flex items-center gap-2"><span>✔️</span> Claimed by: {item.claimedBy}</div>
        <div className="text-[11px] font-semibold text-green-600 flex items-center gap-2"><span>📅</span> On: {item.claimedDate}</div>
      </div>
    ) : (
      <button className="mt-auto w-full py-2 bg-[#0a2e27] text-white text-xs font-semibold rounded-[6px]">
        Mark as Claimed
      </button>
    )}
  </div>
);

const InfoRow = ({ icon, label, value }: any) => (
  <div className="flex items-center gap-2 text-[11px] text-[#4b4b4b]">
    <span className="opacity-70">{icon}</span>
    <span className="font-medium">{label}:</span>
    <span className="text-[#1f1f1f]">{value}</span>
  </div>
);

export default LostAndFoundPage;