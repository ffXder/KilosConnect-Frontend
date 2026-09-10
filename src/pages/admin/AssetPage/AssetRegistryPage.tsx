import React from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, Search, ChevronDown, Archive, AlertCircle, CheckCircle } from "lucide-react";
import { SidebarNavigationSection } from "../../../components/SidebarNavigationSection";
import { useAuth } from '../../../hooks/useAuth';
import type { Asset, NewAsset } from "../../../types/asset";
import { useAssets } from '../../../hooks/useAssets';
import { useRepairLogs } from "../../../hooks/useRepairLogs";

// assets sub-components
import { AssetRegistryStats } from "./components/AssetRegistryStats";
import { AssetRegistryList } from "./components/AssetRegistryList";
import { AddAssetModal } from "./components/AddAssetModal";
import { UpdateAssetModal } from "./components/UpdateAssetModal";
import { DeleteConfirmModal } from "../../../components/DeleteConfirmModal";

const lofAreas = ["All Areas", "WOD", "Cafe", "Powerlifting", "CrossFit", "Mezzanine", "Other"];

// real values, matching the model's areaPrefixes and condition enum
const assetAreas = [
  "All Areas",
  "Powerlifting Area",
  "CrossFit Area",
  "Mezzanine",
  "General Storage",
  "Maintenance Storage",
  "Open WOD Area",
  "Weightlifting Area",
];

const assetConditions = [
  { label: "Any", value: "Any", active: "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-50", inactive: "text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-100" },
  { label: "Working", value: "Working", active: "bg-emerald-500 text-white shadow-sm", inactive: "text-emerald-600 hover:text-emerald-700 dark:text-emerald-300 dark:hover:text-emerald-200" },
  { label: "Needs Repair", value: "Needs Repair", active: "bg-white text-slate-800 shadow-sm border border-slate-200 dark:bg-slate-700 dark:text-slate-50 dark:border-slate-600", inactive: "text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-100" },
  { label: "Under Repair", value: "Under Repair", active: "bg-blue-500 text-white shadow-sm", inactive: "text-blue-600 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200" },
  { label: "Damaged", value: "Damaged", active: "bg-orange-500 text-white shadow-sm", inactive: "text-orange-600 hover:text-orange-700 dark:text-orange-300 dark:hover:text-orange-200" },
  { label: "Hazardous", value: "Hazardous", active: "bg-red-500 text-white shadow-sm", inactive: "text-red-600 hover:text-red-700 dark:text-red-300 dark:hover:text-red-200" },
  { label: "Decommissioned", value: "Decommissioned", active: "bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-900", inactive: "text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-100" },
];

const assetCategory = [
  "All Categories",
  "Equipment",
  "Machine",
  "Tool"
]

export const AssetRegistryPage = () => {
  const [activeTab, setActiveTab] = React.useState<"Equipment" | "LostFound">("Equipment");

  // URL params for filter and searching
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") ?? "";
  const selectedZone = searchParams.get("area") ?? "All Areas";
  const selectedStatus = searchParams.get("condition") ?? "Any";
  const selectedCategory = searchParams.get("category") ?? "All Categories"

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === "All Areas" || value === "Any" || value === "All Categories") {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  };

  const {
    assets = [],
    loading,
    error,
    refresh,
    handleCreate,
    handleUpdate, // not yet implemented
    handleUpdateCondition,
    handleArchive,
  } = useAssets();

  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = React.useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [selectedAssetForEdit, setSelectedAssetForEdit] = React.useState<Asset | null>(null);
  const [assetToArchive, setAssetToArchive] = React.useState<Asset | null>(null);

  const { role } = useAuth();
  const userRole = (role ?? 'admin') as any;

  // area, conditon filter using URL params
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.assetId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesZone = selectedZone === "All Areas" || asset.area === selectedZone;
    const matchesStatus = selectedStatus === "Any" || asset.condition === selectedStatus;
    const matchesCategory = selectedCategory == "All Categories" || asset.category == selectedCategory;
    return matchesSearch && matchesZone && matchesStatus && matchesCategory;
  });

  // calling the hooks for assets
  const handleAddAsset = async (newItem: NewAsset) => {
    await handleCreate(newItem);
    setIsAddModalOpen(false);
  };

  const handleUpdateAsset = async (id: string, updates: { condition: string; description?: string }) => {
    await handleUpdateCondition(id, updates.condition, updates.description ?? "");
    setIsUpdateModalOpen(false);
  };

    const handleConfirmArchive = async (reason?: string) => {
    if (!assetToArchive) return;

    try {
      // 1. Pass both the ID and the optional reason to your archive service
      await handleArchive(assetToArchive._id, reason);

      // 2. Close modal and clear selected item state on success
      setIsDeleteModalOpen(false);
      setAssetToArchive(null);
    } catch (error) {
      console.error("Failed to archive item:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-slate-950 transition-color duration-300">
      <SidebarNavigationSection userRole={userRole} />
      <main className="flex-1 w-full overflow-hidden pt-20 md:pt-0">
        <div className="p-8 max-w-[1600px] mx-auto">
          <div className="mb-8">
            <h1 className="[font-family:'Poppins',Helvetica] text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-tight dark:text-slate-50 font-bold">Smart Facility Asset Registry</h1>
            <p className="text-gray-500 text-sm mt-1 dark:text-slate-300 ">Equipment lifecycle monitoring, predictive analytics, and lost-and-found management</p>
          </div>

          <div className="flex border-b border-gray-200 gap-8 text-sm font-semibold mb-6">
            <button onClick={() => setActiveTab("Equipment")} className={`pb-3 transition-all ${activeTab === "Equipment" ? "text-[#10b981] border-b-2 border-[#10b981] dark: text-emerald-500" : "text-gray-400 hover:text-gray-600 dark:text-slate-300 hover:text-slate-100"}`}>
              Equipment Assets
            </button>
            <button onClick={() => setActiveTab("LostFound")} className={`pb-3 transition-all ${activeTab === "LostFound" ? "text-[#10b981] border-b-2 border-[#10b981]  dark: text-emerald-500" : "text-gray-400 hover:text-gray-600 dark:text-slate-300 hover:text-slate-100"}`}>
              Lost & Found
            </button>
          </div>

          {activeTab === "Equipment" ? (
            <>
              {error && (
                <div className="mb-4 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-center justify-between text-sm text-red-600 dark:text-red-400">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                  </div>
                  {/* refetch WIP */}
                  <button onClick={refresh} className="font-semibold underline hover:text-red-700">Retry</button>
                </div>
              )}

              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm w-full mb-5 dark:bg-slate-900 dark:border-slate-700 dark:shadow-none transition-color duration-300">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="relative flex-1 min-w-[260px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      value={searchQuery}
                      onChange={(e) => updateParam("q", e.target.value)}
                      placeholder="Search by asset name or ID..."
                      className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 bg-white dark:bg-slate-800 transition-color duration-300 dark:border-slate-600 dark:text-slate-300"
                    />
                  </div>

                  <button onClick={() => setIsAddModalOpen(true)} className="bg-[#0a2e27] hover:bg-[#07201b] text-white text-sm font-bold px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors dark:bg-[#207D55] dark:hover:bg-[#07201b]">
                    <Plus size={16} /> Add Asset
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase text-[#94a3b8] tracking-widest dark:text-slate-400">Status:</span>
                    <div className="flex flex-wrap items-center gap-1.5 bg-[#f1f5f9] p-1 rounded-[12px] dark:bg-slate-800 transition-color duration-300">
                      {assetConditions.map((statusOption) => {
                        const isActive = selectedStatus === statusOption.value;
                        return (
                          <button
                            key={statusOption.value}
                            type="button"
                            onClick={() => updateParam("condition", statusOption.value)}
                            className={`relative z-10 px-3 py-2 rounded-[9px] text-[11px] font-bold transition-all duration-300 ${
                              isActive ? statusOption.active : statusOption.inactive
                            }`}
                          >
                            {statusOption.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="h-5 w-px bg-gray-200 dark:bg-slate-600" />

                  <div className="relative">
                    <select
                      value={selectedZone}
                      onChange={(e) => updateParam("area", e.target.value)}
                      className="appearance-none pl-4 pr-9 py-2 text-sm border border-gray-200 rounded-lg bg-white font-medium text-gray-700 cursor-pointer focus:outline-none dark:bg-slate-800 dark:border-slate-600 transition-color duration-300 dark:text-slate-300"
                    >
                      {assetAreas.map((a) => <option key={a} value={a}>{a}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>

                  <div className="relative">
                    <select
                      value={selectedCategory}
                      onChange={(e) => updateParam("category", e.target.value)}
                      className="appearance-none pl-4 pr-9 py-2 text-sm border border-gray-200 rounded-lg bg-white font-medium text-gray-700 cursor-pointer focus:outline-none dark:bg-slate-800 transition-color duration-300 dark:border-slate-600 dark:text-slate-300"
                    >
                      {assetCategory.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="m-5">
                <AssetRegistryStats assets={assets} />
              </div>

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden w-full dark:bg-slate-900 dark:border-slate-700 dark:shadow-none transition-color duration-300">
                <AssetRegistryList
                  isLoading={loading}
                  filteredAssets={filteredAssets}
                  onAssetClick={(asset) => { setSelectedAssetForEdit(asset); setIsUpdateModalOpen(true); }}
                  onDeleteAsset={(asset) => { setAssetToArchive(asset); setIsDeleteModalOpen(true); }}
                />
              </div>
            </>
          ) : (
         
            <div className="space-y-6 animate-fadeIn w-full">
              <h1>Work in progress</h1>
            </div>
          )}
        </div>
      </main>

      <AddAssetModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddAsset} />
      <UpdateAssetModal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} asset={selectedAssetForEdit} onUpdate={handleUpdateAsset} />
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setAssetToArchive(null);
        }}
        onConfirm={handleConfirmArchive}
        itemName={assetToArchive?.name || "Selected Asset"}
        itemType="Asset"
      />
    </div>
  );
};