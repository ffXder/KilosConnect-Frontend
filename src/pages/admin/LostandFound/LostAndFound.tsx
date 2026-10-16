import React, { useState } from "react";
import { SidebarNavigationSection } from "../../../components/SidebarNavigationSection";
import { LostAndFoundFilters } from "./LostAndFoundFillters";
import { AddLoFItemModal } from "./AddLoFItemModal";
import { LoFItemCard } from "./LoFItemCard";
import { StatCard } from "./StatCard";
import { ClaimModal } from "./ClaimModal";
import { LoFDetailedModal } from "./LoFDetailedModal";
import { Archive, AlertCircle, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react"; 
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
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditingPage, setIsEditingPage] = useState(false);
  const [pageInput, setPageInput] = useState("");
  const pageSize = 6;
  const [viewingItem, setViewingItem] = useState<LostAndFound | null>(null);
  const [claimingItem, setClaimingItem] = useState<LostAndFound | null>(null);
  const [filter, setFilter] = useState<"All" | "Unclaimed" | "Claimed">("All");
  const [zoneFilter, setZoneFilter] = useState("All Areas");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const handleStatusFilterChange = (value: "All" | "Unclaimed" | "Claimed") => {
    setFilter(value);
    setCurrentPage(1);
  };
  const handleZoneFilterChange = (value: string) => {
    setZoneFilter(value);
    setCurrentPage(1);
  };
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

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
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedItems = filteredItems.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize,
  );
  const firstVisiblePage = Math.max(1, Math.min(safeCurrentPage - 1, totalPages - 2));
  const visiblePages = Array.from(
    { length: Math.min(3, totalPages) },
    (_, index) => firstVisiblePage + index,
  );
  const commitPageInput = () => {
    const requestedPage = Number(pageInput);
    if (Number.isInteger(requestedPage) && requestedPage >= 1 && requestedPage <= totalPages) {
      setCurrentPage(requestedPage);
    }
    setIsEditingPage(false);
  };

  const { role } = useAuth();
  const userRole = (role ?? 'custodian') as React.ComponentProps<typeof SidebarNavigationSection>["userRole"];

  return (
    <div className="flex min-h-screen w-full bg-[#f4f5f6] text-[#1a1a1a] dark:bg-slate-950 dark:text-slate-50 transition-colors duration-300">
      <SidebarNavigationSection userRole={userRole} />

      {/* Main Container */}
      <main className="flex-1 min-w-0 p-4 md:p-8 space-y-6 overflow-x-hidden dark:bg-slate-950 transition-colors duration-300">
        <div className="mx-auto w-full min-w-0 max-w-[1600px] space-y-6">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h1 className="[font-family:'Poppins',Helvetica] text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-tight dark:text-slate-50">
                Lost and Found
              </h1>
              <p className="text-gray-500 text-sm mt-1 dark:text-slate-300">
                Track your lost and found items here.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard label="Total Items" count={items.length} color="text-blue-600 dark:text-blue-400" iconBg="bg-blue-100 dark:bg-blue-200" cardBg="bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:border-blue-800" icon={Archive} />
            <StatCard label="Unclaimed" count={items.filter(i => i.status === "Unclaimed").length} color="text-amber-600 dark:text-amber-400" iconBg="bg-amber-100 dark:bg-amber-200" cardBg="bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800" icon={AlertCircle} />
            <StatCard label="Claimed" count={items.filter(i => i.status === "Claimed").length} color="text-emerald-600 dark:text-emerald-400" iconBg="bg-emerald-100 dark:bg-emerald-200" cardBg="bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800" icon={CheckCircle} />
          </div>

          {/* Filters Bar */}
          <LostAndFoundFilters
            searchQuery={searchQuery}
            setSearchQuery={handleSearchChange}
            statusFilter={filter}
            setStatusFilter={handleStatusFilterChange}
            zoneFilter={zoneFilter}
            setZoneFilter={handleZoneFilterChange}
            zones={areas}
            onAddItem={() => setIsModalOpen(true)}
          />

          {/* Items Container */}
          <div className="bg-white rounded-2xl border border-[#e8e8e8] shadow-sm p-6 dark:bg-slate-900 dark:border-slate-700 dark:shadow-none">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedItems.map((item) => (
                <LoFItemCard key={item.lostId} item={item} onClaim={handleClaimItem} onView={handleViewItem} />
              ))}
            </div>
            {filteredItems.length === 0 && !loading && (
              <p className="py-8 text-center text-sm text-gray-500 dark:text-slate-300">
                No items match your filters.
              </p>
            )}
            {!loading && (
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#e8e8e8] pt-4 dark:border-slate-700">
                <p className="text-xs text-gray-500 dark:text-slate-300">
                  Showing{" "}
                  <span className="font-semibold text-[#0f2942] dark:text-slate-100">{paginatedItems.length}</span>
                  {" "}of{" "}
                  <span className="font-semibold text-[#0f2942] dark:text-slate-100">{filteredItems.length}</span>
                  {" "}items (Page{" "}
                  <span className="font-semibold text-[#0f2942] dark:text-slate-100">{safeCurrentPage}</span>
                  {" "}of{" "}
                  <span className="font-semibold text-[#0f2942] dark:text-slate-100">{totalPages}</span>)
                </p>
                <nav className="flex items-center gap-1" aria-label="Lost and found pages">
                  <button
                    type="button"
                    onClick={() => setCurrentPage(safeCurrentPage - 1)}
                    disabled={safeCurrentPage <= 1}
                    aria-label="Previous page"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#e2e8f0] text-[#0f2942] transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {visiblePages.map((pageNumber) => (
                    pageNumber === safeCurrentPage ? (
                      <div key={pageNumber} className="flex flex-col items-center">
                        {isEditingPage ? (
                          <input
                            type="number"
                            min={1}
                            max={totalPages}
                            value={pageInput}
                            autoFocus
                            aria-label={`Enter page number, from 1 to ${totalPages}`}
                            onChange={(event) => setPageInput(event.target.value)}
                            onBlur={commitPageInput}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                event.preventDefault();
                                event.currentTarget.blur();
                              }
                            }}
                            className="h-9 w-9 rounded-lg border border-[#0B4058] bg-white text-center text-xs font-semibold text-[#0B4058] outline-none dark:border-emerald-500 dark:bg-slate-800 dark:text-emerald-300"
                          />
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setPageInput(String(safeCurrentPage));
                              setIsEditingPage(true);
                            }}
                            aria-current="page"
                            aria-label={`Current page ${safeCurrentPage}. Click to enter a page number`}
                            className="h-9 w-9 rounded-lg border border-[#0B4058] bg-[#0B4058] text-xs font-semibold text-white dark:border-[#126F91] dark:bg-[#126F91]"
                          >
                            {pageNumber}
                          </button>
                        )}
                        <span className="mt-1 whitespace-nowrap text-[9px] leading-none text-gray-500 dark:text-slate-400">
                          click to enter page
                        </span>
                      </div>
                    ) : (
                      <button
                        key={pageNumber}
                        type="button"
                        onClick={() => setCurrentPage(pageNumber)}
                        aria-label={`Go to page ${pageNumber}`}
                        className="h-9 w-9 rounded-lg border border-[#e2e8f0] text-xs font-medium text-[#0f2942] transition-colors hover:bg-gray-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        {pageNumber}
                      </button>
                    )
                  ))}
                  <button
                    type="button"
                    onClick={() => setCurrentPage(safeCurrentPage + 1)}
                    disabled={safeCurrentPage >= totalPages}
                    aria-label="Next page"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#e2e8f0] text-[#0f2942] transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <ChevronRight size={16} />
                  </button>
                </nav>
              </div>
            )}
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