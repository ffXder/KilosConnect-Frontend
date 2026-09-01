import React, { useState, useEffect } from "react";
import ArchivesInfoSection from "./components/ArchivesInfoSection";
import ArchivesStatsSection from "./components/StatsSection";
import TableSection from "./components/TableSection";
import { SidebarNavigationSection } from "../../../components/SidebarNavigationSection";
import { useAuth } from "../../../hooks/useAuth";
import { useArchives } from "../../../hooks/useArchive"; 
import type { ArchiveRecord } from "../../../types/archive";

export const ArchivesPage: React.FC = () => {
  const {
    archives,
    stats,
    loading,
    fetchArchives,
    fetchStats,
    unarchive,
  } = useArchives();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");

  const [viewItem, setViewItem] = useState<ArchiveRecord | null>(null);
  const [restoreItem, setRestoreItem] = useState<ArchiveRecord | null>(null);

  // Initial stats load on mount
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Combined effect to trigger search and module filtering safely
  useEffect(() => {
    const moduleType = selectedType === "All Types" ? undefined : selectedType;
    fetchArchives({
      search: searchQuery || undefined,
      moduleType,
    });
  }, [searchQuery, selectedType, fetchArchives]);

  // Helper to resolve title accurately based on MongoDB payload
  const getItemTitle = (item: ArchiveRecord | null) => {
    if (!item) return "N/A";
    return (
      item.data?.item ||
      item.data?.title ||
      item.data?.name ||
      item.data?.itemName ||
      item.data?.email ||
      item.moduleType
    );
  };

  const handleConfirmRestore = async () => {
    if (!restoreItem) return;

    const targetId = restoreItem._id;

    console.log("Attempting restore for target ID:", targetId);

    const success = await unarchive(targetId);
    if (success) {
      setRestoreItem(null);
      // Refresh list & stats after successful restore
      const moduleType = selectedType === "All Types" ? undefined : selectedType;
      fetchArchives({ search: searchQuery || undefined, moduleType });
      fetchStats();
    } else {
      console.error("Failed to restore record. Check network tab for API path.");
    }
  };
  
  const { role } = useAuth();
  const userRole = (role ?? "admin") as React.ComponentProps<
    typeof SidebarNavigationSection
  >["userRole"];

  // Normalize stats fallback structure
  const formattedStats = {
    total: stats?.total ?? 0,
    byModule: {
      Incident: stats?.byModule?.Incident ?? 0,
      Asset: stats?.byModule?.Asset ?? 0,
      Task: stats?.byModule?.Task ?? 0,
      User: stats?.byModule?.User ?? 0,
      LostAndFound: stats?.byModule?.LostAndFound ?? 0,
    },
  };

  // Safe array extraction
  const tableData: ArchiveRecord[] = Array.isArray(archives)
    ? archives
    : (archives as any)?.data && Array.isArray((archives as any).data)
    ? (archives as any).data
    : [];

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
                Archives
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Historical records of completed and decommissioned items
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <ArchivesStatsSection stats={formattedStats} />

          {/* Filters & Information */}
          <ArchivesInfoSection
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
          />

          {/* Table Container */}
          <TableSection
            items={tableData}
            isLoading={loading}
            onView={(item) => setViewItem(item)}
            onRestore={(item) => setRestoreItem(item)}
          />
        </div>

        {/* --- VIEW MODAL --- */}
        {viewItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-[540px] rounded-[20px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-[#113e33] p-6 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-[17px] font-bold tracking-tight">
                    {getItemTitle(viewItem)}
                  </h3>
                  <p className="text-xs text-emerald-200/80 mt-0.5 tracking-wide font-mono">
                    {viewItem.archiveId || viewItem._id}
                  </p>
                </div>
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/15 border border-white/10 uppercase tracking-wider">
                  {viewItem.moduleType}
                </span>
              </div>

              <div className="p-6 space-y-5">
                {/* Optional Image Preview if present in data payload */}
                {viewItem.data?.itemImage?.url && (
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                      Item Image
                    </label>
                    <div className="rounded-xl overflow-hidden border border-slate-200 max-h-48 flex justify-center bg-slate-50">
                      <img 
                        src={viewItem.data.itemImage.url} 
                        alt={getItemTitle(viewItem)} 
                        className="object-contain h-48 w-full"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                    Description
                  </label>
                  <p className="text-sm text-[#334155] bg-slate-50 p-3.5 rounded-xl border border-slate-100 leading-relaxed">
                    {viewItem.data?.description ||
                      viewItem.data?.details ||
                      viewItem.reason ||
                      "No description provided"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-2">
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                      Original ID
                    </label>
                    <span className="text-xs font-mono font-semibold text-[#1e293b] mt-0.5 block">
                      {viewItem.originalId || "N/A"}
                    </span>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                      Archived By
                    </label>
                    <span className="text-sm font-semibold text-[#1e293b] mt-0.5 block">
                      {viewItem.archivedBy || "System Admin"}
                    </span>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                      Original Date
                    </label>
                    <span className="text-sm font-semibold text-[#1e293b] mt-0.5 block">
                      {new Date(viewItem.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                      Archived Date
                    </label>
                    <span className="text-sm font-semibold text-[#1e293b] mt-0.5 block">
                      {new Date(viewItem.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 flex justify-end">
                <button
                  onClick={() => setViewItem(null)}
                  className="px-5 py-2.5 bg-[#113e33] hover:bg-[#14493c] text-white rounded-xl text-xs font-bold transition-all duration-150 active:scale-[0.98] shadow-sm shadow-slate-900/10 cursor-pointer"
                >
                  Close View
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- RESTORE MODAL --- */}
        {restoreItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-[440px] rounded-[20px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-[#3b82f6] p-6 text-white flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 15H19"
                      />
                    </svg>
                  </div>
                  <h3 className="text-base font-bold tracking-tight">
                    Restore Record
                  </h3>
                </div>
              </div>

              <div className="p-6">
                <p className="text-[#475569] text-sm leading-relaxed">
                  Are you sure you want to restore{" "}
                  <span className="font-bold text-[#0f172a]">
                    "{getItemTitle(restoreItem)}"
                  </span>
                  ? This will relocate the tracking card back onto live production monitors.
                </p>
              </div>

              <div className="px-6 pb-6 pt-2 flex items-center justify-end gap-2.5">
                <button
                  onClick={() => setRestoreItem(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#334155] rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmRestore}
                  disabled={loading}
                  className="px-5 py-2.5 bg-[#3b82f6] hover:bg-[#3f7bdb] text-white rounded-xl text-xs font-bold transition-all duration-150 active:scale-[0.98] shadow-sm shadow-slate-900/10 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Restoring..." : "Confirm Restore"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};