import React, { useState } from "react";
import { SidebarNavigationSection } from "../../../components/SidebarNavigationSection";
import { LostAndFoundFilters } from "./LostAndFoundFillters";
import { AddLoFItemModal } from "./AddLoFItemModal";
import { LoFItemCard } from "./LoFItemCard";
import { StatCard } from "./StatCard";
import { ClaimModal } from "./ClaimModal";
import { LoFDetailedModal } from "./LoFDetailedModal";
import { Archive, AlertCircle, CheckCircle } from "lucide-react"; 
import { useAuth } from "../../../hooks/useAuth";
import { useLostAndFound } from "../../../hooks/useLostAndFound";
import type { LostAndFound } from "../../../types/lostAndFound";

const areas = [
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
  const [viewingItem, setViewingItem] = useState<LostAndFound | null>(null);
  const [claimingItem, setClaimingItem] = useState<LostAndFound | null>(null);
  const [filter, setFilter] = useState<"All" | "Unclaimed" | "Claimed">("All");
  const [zoneFilter, setZoneFilter] = useState("All Areas");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleViewItem = (item: LostAndFound) => {
    setViewingItem(item);
  };

  const handleAddItem = async (data: any, imageFile: File) => {
      await handleCreate(data, imageFile);
      setIsModalOpen(false);
  };

  const handleClaimItem = (id: string) => {
    const item = items.find(i => i.lostId === id);
    if (item) setClaimingItem(item);
  };

  const handleConfirmClaim = async (claimedBy: string, imageFile: File) => {
    if (!claimingItem) return;
    await handleClaim(claimingItem.lostId, claimedBy, imageFile);
    setClaimingItem(null);
  };

  const filteredItems = items.filter((item) => {
    const matchesStatus = filter === "All" ? true : item.status === filter;
    const matchesZone = zoneFilter === 'All Areas' ? true : item.areaFound === zoneFilter;
    const matchesSearch = (item.item ?? '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.description ?? '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesZone && matchesSearch;
  });

  const { role } = useAuth();
  const userRole = (role ?? 'custodian') as React.ComponentProps<typeof SidebarNavigationSection>["userRole"];

  return (
    <div className="flex min-h-screen w-full bg-[#f4f5f6] font-sans text-[#1a1a1a]">
      <SidebarNavigationSection userRole={userRole} />

      {/* Main Container */}
      <main className="flex-1 w-full p-4 md:p-8 space-y-6 overflow-x-hidden">
        <div className="max-w-[1400px] mx-auto space-y-6">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#0f2942]">
                Lost and Found
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Track your lost and found items here.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard label="Total Items" count={items.length} color="text-[#1e4d46]" iconBg="bg-[#e6fffa]" icon={Archive} />
            <StatCard label="Unclaimed" count={items.filter(i => i.status === "Unclaimed").length} color="text-[#b45309]" iconBg="bg-[#fffbeb]" icon={AlertCircle} />
            <StatCard label="Claimed" count={items.filter(i => i.status === "Claimed").length} color="text-[#15803d]" iconBg="bg-[#f0fdf4]" icon={CheckCircle} />
          </div>

          {/* Filters Bar */}
          <LostAndFoundFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={filter}
            setStatusFilter={setFilter}
            zoneFilter={zoneFilter}
            setZoneFilter={setZoneFilter}
            zones={areas}
            onAddItem={() => setIsModalOpen(true)}
          />

          {/* Items Container */}
          <div className="bg-white rounded-2xl border border-[#e8e8e8] shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <LoFItemCard key={item.lostId} item={item} onClaim={handleClaimItem} onView={handleViewItem} />
              ))}
            </div>
          </div>

        </div>

        {/* --- MODALS --- */}
        {isModalOpen && (
          <AddLoFItemModal onClose={() => setIsModalOpen(false)} onSubmit={handleAddItem} />
        )}
        
        {claimingItem && (
          <ClaimModal
            itemName={claimingItem.item}
            onClose={() => setClaimingItem(null)}
            onConfirm={handleConfirmClaim}
          />
        )}

        {viewingItem && (
          <LoFDetailedModal 
            item={viewingItem} 
            onClose={() => setViewingItem(null)} 
          />
        )}
      </main>
    </div>
  );
};