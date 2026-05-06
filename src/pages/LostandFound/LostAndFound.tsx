import React, { useState } from "react";
import { SidebarNavigationSection } from "../../components/SidebarNavigationSection";
import { StatCard } from "./StatCard";
import { LoFItemCard } from "./LoFItemsCard";
import { AddLoFItemModal } from "./AddLoFItemModal";
import { 
  Search, 
  Bell, 
  Archive, 
  AlertCircle, 
  CheckCircle, 
  Plus, 
  MapPin 
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";


export interface LostFoundItem {
  _id: string;
  name: string;
  description: string;
  location: string;
  foundBy: string;
  date: string;
  status: "Unclaimed" | "Claimed";
  claimedBy?: string;
  claimedDate?: string;
}

const ZONES = [
  "All Areas", 
  "Mezzanine", 
  "Powerlifting Area", 
  "Open WOD Area", 
  "CrossFit Area", 
  "Café", 
  "General Storage", 
  "Maintenance Storage"
];

const mockItems: LostFoundItem[] = [
  {
    _id: "1",
    name: "AquaFlask 32oz",
    description: "Black insulated water bottle with a silver handle and a 'Kilos PH' sticker.",
    location: "Powerlifting Area",
    foundBy: "John Doe (Staff)",
    date: "2026-05-01",
    status: "Unclaimed"
  },
  {
    _id: "2",
    name: "Leather Lifting Belt",
    description: "Brown leather belt, size Medium. Shows heavy wear around the buckle.",
    location: "CrossFit Area",
    foundBy: "Jane Smith (Gym Lead)",
    date: "2026-04-28",
    status: "Claimed",
    claimedBy: "Robert Fox",
    claimedDate: "2026-04-30"
  }
];

export const LostAndFoundPage: React.FC = () => {
  const [items, setItems] = useState<LostFoundItem[]>(mockItems);
  const [filter, setFilter] = useState<"All" | "Unclaimed" | "Claimed">("All");
  const [zoneFilter, setZoneFilter] = useState("All Areas");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddItem = (newItemData: any) => {
    const newItem: LostFoundItem = {
      ...newItemData,
      _id: Math.random().toString(36).substr(2, 9),
      status: "Unclaimed"
    };
    setItems([newItem, ...items]);
    setIsModalOpen(false);
  };

  // Restored Claim Functionality
  const handleClaimItem = (id: string) => {
    const claimantName = prompt("Enter the name of the person claiming this item:");
    if (!claimantName) return;

    setItems(items.map(item => 
      item._id === id 
        ? { 
            ...item, 
            status: "Claimed", 
            claimedBy: claimantName, 
            claimedDate: new Date().toISOString().split('T')[0] 
          } 
        : item
    ));
  };

  const filteredItems = items.filter((item) => {
    const matchesStatus = filter === "All" ? true : item.status === filter;
    const matchesZone = zoneFilter === "All Areas" ? true : item.location === zoneFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesZone && matchesSearch;
  });

  const { role } = useAuth()
    const userRole = (role ?? 'custodian') as React.ComponentProps<typeof SidebarNavigationSection>["userRole"]

  return (
    <div className="flex h-screen bg-[#f8f9fa] overflow-hidden font-sans">
      <SidebarNavigationSection userRole={userRole} />

      <div className="flex flex-col flex-1 min-w-0 ml-[240px] overflow-y-auto">
        <header className="flex items-center justify-between px-10 pt-10 pb-6">
          <div>
            <h1 className="[font-family:'Poppins',Helvetica] font-semibold text-[#1f1f1f] text-2xl md:text-[36px]">Lost & Found</h1>
            <p className="text-[#64748b] text-sm mt-1 font-normal">Manage items stored in facility zones</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-[#e2e8f0] text-gray-500 hover:bg-gray-50 transition-colors">
              <Bell size={20} />
            </button>
            <img className="w-10 h-10 rounded-full border border-gray-200" src="https://c.animaapp.com/C3N4JJvt/img/profile@2x.png" alt="Profile" />
          </div>
        </header>

        <div className="px-10 pb-10 space-y-8">
          <div className="grid grid-cols-3 gap-6">
            <StatCard label="Total Items" count={items.length} color="text-[#1e4d46]" iconBg="bg-[#e6fffa]" icon={Archive} />
            <StatCard label="Unclaimed" count={items.filter(i => i.status === "Unclaimed").length} color="text-[#b45309]" iconBg="bg-[#fffbeb]" icon={AlertCircle} />
            <StatCard label="Claimed" count={items.filter(i => i.status === "Claimed").length} color="text-[#15803d]" iconBg="bg-[#f0fdf4]" icon={CheckCircle} />
          </div>

          <div className="bg-white p-6 rounded-[16px] border border-[#e2e8f0] shadow-sm space-y-7">
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                    <input 
                    type="text" 
                    placeholder="Search items..." 
                    className="w-full pl-12 pr-4 py-3 bg-white border border-[#e2e8f0] rounded-full text-sm font-normal focus:outline-none focus:border-[#1e4d46] transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button 
                onClick={() => setIsModalOpen(true)} 
                className="bg-[#1e4d46] text-white px-6 py-3 rounded-[10px] text-sm font-semibold flex items-center gap-2 hover:bg-[#163a35] transition-all"
                >
                <Plus size={18} />
                Add Item
                </button>
            </div>

            <div className="flex bg-[#f1f5f9] w-fit p-1.5 rounded-[10px] gap-1">
              {["All", "Unclaimed", "Claimed"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab as any)}
                  className={`px-7 py-2.5 rounded-[8px] text-[15px] font-semibold transition-all ${
                    filter === tab 
                      ? "bg-[#1e4d46] text-white shadow-sm" 
                      : "text-[#64748b] hover:text-gray-800"
                  }`}
                >
                  {tab === "All" ? "All Items" : tab}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3.5 pt-1">
              <div className="flex items-center gap-2 text-[#94a3b8] min-w-fit">
                <MapPin size={17} />
                <span className="text-[11px] font-bold uppercase tracking-wider">Area:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {ZONES.map((zone) => (
                  <button
                    key={zone}
                    onClick={() => setZoneFilter(zone)}
                    className={`px-4.5 py-2 rounded-full text-[12.5px] font-semibold transition-all ${
                      zoneFilter === zone 
                        ? "bg-[#1e4d46] text-white shadow-sm" 
                        : "bg-[#f1f3f5] text-[#64748b] hover:bg-gray-200"
                    }`}
                  >
                    {zone}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <LoFItemCard key={item._id} item={item} onClaim={handleClaimItem} />
            ))}
          </div>
        </div>
      </div>
      {isModalOpen && (
        <AddLoFItemModal 
          onClose={() => setIsModalOpen(false)} 
          onSubmit={handleAddItem}
        />
      )}
    </div>
  );
};