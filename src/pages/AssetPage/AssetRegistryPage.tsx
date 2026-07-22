import React from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, Search, ChevronDown, Archive, AlertCircle, CheckCircle } from "lucide-react";
import { SidebarNavigationSection } from "../../components/SidebarNavigationSection";
import { useAuth } from '../../hooks/useAuth';
import type { Asset, NewAsset } from "../../types/asset";
import { useAssets } from '../../hooks/useAssets';
import { useRepairLogs } from "../../hooks/useRepairLogs";

// assets sub-components
import { AssetRegistryStats } from "./AssetRegistryStats";
import { AssetRegistryList } from "./AssetRegistryList";
import { AddAssetModal } from "./AddAssetModal";
import { UpdateAssetModal } from "./UpdateAssetModal";
import { ArchiveConfirmModal } from "./ArchiveConfirmModal";

const lofAreas = ["All Areas", "WOD", "Cafe", "Powerlifting", "CrossFit", "Mezzanine", "Other"];

// real values, matching the model's areaPrefixes and condition enum
const assetAreas = [
  "All Zones",
  "Powerlifting Area",
  "CrossFit Area",
  "Mezzanine",
  "General Storage",
  "Maintenance Storage",
  "Open WOD Area",
  "Weightlifting Area",
];

const assetConditions = [
  "All Statuses",
  "Working",
  "Needs Repair",
  "Under Repair",
  "Needs Replacement",
  "Hazardous",
  "Decommissioned",
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
  const selectedZone = searchParams.get("area") ?? "All Zones";
  const selectedStatus = searchParams.get("condition") ?? "All Statuses";
  const selectedCategory = searchParams.get("category") ?? "All Categories"

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === "All Zones" || value === "All Statuses" || value === "All Categories") {
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
    handleCreate,
    handleUpdate, // not yet implemented
    handleUpdateCondition,
    handleArchive,
  } = useAssets();

  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = React.useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = React.useState(false);
  const [selectedAssetForEdit, setSelectedAssetForEdit] = React.useState<Asset | null>(null);
  const [assetToArchive, setAssetToArchive] = React.useState<Asset | null>(null);

  const { role } = useAuth();
  const userRole = (role ?? 'admin') as any;

  

  // area, conditon filter using URL params
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.assetId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesZone = selectedZone === "All Zones" || asset.area === selectedZone;
    const matchesStatus = selectedStatus === "All Statuses" || asset.condition === selectedStatus;
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

  const handleConfirmArchive = async () => {
    if (assetToArchive) {
      await handleArchive(assetToArchive.assetId);
      setIsArchiveModalOpen(false);
      setAssetToArchive(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <SidebarNavigationSection userRole={userRole} />
      <main className="flex-1 w-full overflow-hidden">
        <div className="p-8 max-w-[1600px] mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-[#0f2942]">Smart Facility Asset Registry</h1>
            <p className="text-gray-500 text-sm mt-1">Equipment lifecycle monitoring, predictive analytics, and lost-and-found management</p>
          </div>

          <div className="flex border-b border-gray-200 gap-8 text-sm font-semibold mb-6">
            <button onClick={() => setActiveTab("Equipment")} className={`pb-3 transition-all ${activeTab === "Equipment" ? "text-[#10b981] border-b-2 border-[#10b981]" : "text-gray-400 hover:text-gray-600"}`}>
              Equipment Assets
            </button>
            <button onClick={() => setActiveTab("LostFound")} className={`pb-3 transition-all ${activeTab === "LostFound" ? "text-[#10b981] border-b-2 border-[#10b981]" : "text-gray-400 hover:text-gray-600"}`}>
              Lost & Found
            </button>
          </div>

          {activeTab === "Equipment" ? (
            <>
              {loading && <p className="text-sm text-gray-400 mb-3">Loading assets...</p>}
              {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm w-full">
                {/* search barr */}
                <div className="relative flex-1 min-w-[280px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    value={searchQuery}
                    onChange={(e) => updateParam("q", e.target.value)}
                    placeholder="Search by asset name or ID..."
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 bg-white"
                  />
                </div>

                {/* filters */}
                <div className="flex items-center gap-3 flex-wrap">
                  {/* area/zone filter */}
                  <div className="relative">
                    <select
                      value={selectedZone}
                      onChange={(e) => updateParam("area", e.target.value)}
                      className="appearance-none pl-4 pr-9 py-2 text-sm border border-gray-200 rounded-lg bg-white font-medium text-gray-700 cursor-pointer focus:outline-none"
                    >
                      {assetAreas.map((a) => <option key={a} value={a}>{a}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>

                  {/* condition/status filter */}
                  <div className="relative">
                    <select
                      value={selectedStatus}
                      onChange={(e) => updateParam("condition", e.target.value)}
                      className="appearance-none pl-4 pr-9 py-2 text-sm border border-gray-200 rounded-lg bg-white font-medium text-gray-700 cursor-pointer focus:outline-none"
                    >
                      {assetConditions.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>

                  {/* category/types filter */}
                  <div className="relative">
                    <select
                      value={selectedCategory}
                      onChange={(e) => updateParam("category", e.target.value)}
                      className="appearance-none pl-4 pr-9 py-2 text-sm border border-gray-200 rounded-lg bg-white font-medium text-gray-700 cursor-pointer focus:outline-none"
                    >
                      {assetCategory.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>

                  {/* add item button */}
                  <button onClick={() => setIsAddModalOpen(true)} className="bg-[#0a2e27] hover:bg-[#07201b] text-white text-sm font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors">
                    <Plus size={16} /> Add Asset
                  </button>
                </div>
              </div>

              <div className="m-5">
                <AssetRegistryStats assets={assets} />
              </div>

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden w-full">
                <AssetRegistryList
                  filteredAssets={filteredAssets}
                  onAssetClick={(asset) => { setSelectedAssetForEdit(asset); setIsUpdateModalOpen(true); }}
                  onDeleteAsset={(asset) => { setAssetToArchive(asset); setIsArchiveModalOpen(true); }}
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
      <ArchiveConfirmModal isOpen={isArchiveModalOpen} onClose={() => setIsArchiveModalOpen(false)} onConfirm={handleConfirmArchive} itemName={assetToArchive?.name || ""} />

    </div>
  );
};