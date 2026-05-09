import React, { useState } from "react";
import { SidebarNavigationSection } from "../../components/SidebarNavigationSection";
import { LostAndFoundFilters } from "./LostAndFoundFillters";
import { AddLoFItemModal } from "./AddLoFItemModal";
import { LoFItemCard } from "./LoFItemCard";
import { StatCard } from "./StatCard";
import { Archive, AlertCircle, CheckCircle } from "lucide-react"; 
import { useAuth } from "../../hooks/useAuth";
import { useLostAndFound } from "../../hooks/useLostAndFound";
import type { LostAndFound } from "../../types/lostAndFound";

const ZONES = [
  "All Areas",
  "Mezzanine",
  "Powerlifting Area",
  "Open WOD Area",
  "CrossFit Area",
  "Weightlifting Area",
  "General Storage",
  "Maintenance Storage",
];

export const LostAndFoundPage: React.FC = () => {
  const { items, loading, error, handleCreate, handleClaim, handleDelete } = useLostAndFound();
  const [filter, setFilter] = useState<"All" | "Unclaimed" | "Claimed">("All");
  const [zoneFilter, setZoneFilter] = useState("All Areas");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddItem = async (newItemData: Omit<LostAndFound, '_id' | 'lostId' | 'status' | 'claimedBy' | 'claimedAt'>) => {
    await handleCreate(newItemData);
    setIsModalOpen(false);
  };

  const handleClaimItem = async (lostId: string) => {
    const claimantName = prompt('Enter the name of the person claiming this item:');
    if (!claimantName) return;
    await handleClaim(lostId, claimantName);
  };

  const filteredItems = items.filter((item) => {
    const matchesStatus = filter === "All" ? true : item.status === filter;
    const matchesZone = zoneFilter === 'All Areas' ? true : item.areaFound === zoneFilter;
    const matchesSearch = (item.item ?? '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.description ?? '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesZone && matchesSearch;
  });

  const { role,  } = useAuth()
  const userRole = (role ?? 'custodian') as React.ComponentProps<typeof SidebarNavigationSection>["userRole"]

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans">
      <SidebarNavigationSection userRole={userRole} />

      <div className="flex flex-col flex-1 min-w-0 ml-[240px] overflow-y-auto">
        {/* Header structure from IncidentReporting_2.tsx with icons removed[cite: 22] */}
        <header className="flex justify-between items-start px-10 py-8">
          <div>
            <h1 className="[font-family:'Poppins',Helvetica] text-3xl font-bold text-gray-900 tracking-tigh">Lost & Found</h1>
            <p className="[font-family:'Poppins',Helvetica] text-gray-500 text-sm mt-1">Manage items stored in facility zones</p>
          </div>
          {/* Action buttons container removed[cite: 22] */}
        </header>

        <div className="px-10 pb-10 space-y-8">
          <div className="grid grid-cols-3 gap-6">
            <StatCard label="Total Items" count={items.length} color="text-[#1e4d46]" iconBg="bg-[#e6fffa]" icon={Archive} />
            <StatCard label="Unclaimed" count={items.filter(i => i.status === "Unclaimed").length} color="text-[#b45309]" iconBg="bg-[#fffbeb]" icon={AlertCircle} />
            <StatCard label="Claimed" count={items.filter(i => i.status === "Claimed").length} color="text-[#15803d]" iconBg="bg-[#f0fdf4]" icon={CheckCircle} />
          </div>

          <LostAndFoundFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={filter}
            setStatusFilter={setFilter}
            zoneFilter={zoneFilter}
            setZoneFilter={setZoneFilter}
            zones={ZONES}
            onAddItem={() => setIsModalOpen(true)}
          />

          <div className="bg-[#fcfcfc] border border-[#e2e8f0] rounded-[24px] p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item) => (
                <LoFItemCard key={item._id} item={item} onClaim={handleClaimItem} />
              ))}
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && <AddLoFItemModal onClose={() => setIsModalOpen(false)} onSubmit={handleAddItem} />}
    </div>
  );
};