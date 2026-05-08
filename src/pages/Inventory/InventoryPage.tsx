import React, { useState } from "react";
import { Bell } from "lucide-react";
import { SidebarNavigationSection } from "../../components/SidebarNavigationSection";
import { InventoryAlertBanner } from "./InventoryAlertBanner";
import { InventoryStats } from "./InventoryStats";
import { InventoryToolbar } from "./InventoryToolbar";
import { InventoryList } from "./InventoryList";
import { AddItemModal } from "./AddItemModal";
import { UpdateAssetModal } from "./UpdateAssetModal";
import { UpdateConsumableModal } from "./UpdateConsumableModal";
import { InventoryFilterSection } from "./InventoryFilterSection";
import { useAuth } from '../../hooks/useAuth';
import { ArchiveConfirmModal } from "./ArchiveConfirmModal";

const INITIAL_CONSUMABLES = [
  { _id: "1", name: "Magnesium Chalk", consumableId: "CON-001", quantity: 5, lowStockAlert: 10, unit: "kg", area: "General Storage", description: "Standard gym chalk", lastRestocked: "2024-05-10" },
  { _id: "2", name: "Cleaning Spray", consumableId: "CON-002", quantity: 25, lowStockAlert: 5, unit: "bottles", area: "Maintenance Storage", description: "Disinfectant spray", lastRestocked: null },
  { _id: "3", name: "Microfiber Cloths", consumableId: "CON-003", quantity: 0, lowStockAlert: 15, unit: "pcs", area: "Maintenance Storage", description: "Cleaning cloths", lastRestocked: null },
];

const INITIAL_ASSETS = [
  { _id: "a1", name: "Treadmill X1", assetId: "AST-101", area: "Mezzanine", condition: "Good Condition", description: "Cardio zone treadmill" },
  { _id: "a2", name: "Bench Press", assetId: "AST-102", area: "Powerlifting Area", condition: "Need Repair", description: "Flat bench" },
];

export const InventoryPage = () => {
  const [activeCategory, setActiveCategory] = useState<"All" | "Consumables" | "Assets" >("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedArea, setSelectedArea] = useState("ALL AREAS");
  const [selectedAssetArea, setSelectedAssetArea] = useState("ALL AREAS");
  const [selectedCondition, setSelectedCondition] = useState("ALL CONDITIONS");
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isConsumableUpdateOpen, setIsConsumableUpdateOpen] = useState(false);
  
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [itemToArchive, setItemToArchive] = useState<{ id: string, name: string, type: 'asset' | 'consumable' } | null>(null);

  const [selectedAssetForEdit, setSelectedAssetForEdit] = useState<any>(null);
  const [selectedConsumableForEdit, setSelectedConsumableForEdit] = useState<any>(null);

  const [consumables, setConsumables] = useState(INITIAL_CONSUMABLES);
  const [assets, setAssets] = useState(INITIAL_ASSETS);

 const handleCategoryChange = (category: any) => {
    setActiveCategory(category);
    
    // Set default area filter when switching to Consumables
    if (category === "Consumables") {
      setSelectedArea("General Storage");
    }
  };
  const handleAddItem = (newItem: any) => {
    const idSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

    if (newItem.category === "Consumables") {
      const formattedConsumable = {
        _id: Date.now().toString(),
        name: newItem.name,
        consumableId: `CON-${idSuffix}`,
        quantity: newItem.quantity,
        lowStockAlert: newItem.minQuantity,
        unit: newItem.unit || "pcs",
        area: newItem.zone,
        description: newItem.description,
        lastRestocked: new Date().toISOString().split('T')[0]
      };
      setConsumables(prev => [...prev, formattedConsumable]);
    } else {
      const formattedAsset = {
        _id: Date.now().toString(),
        name: newItem.name,
        assetId: `AST-${idSuffix}`,
        area: newItem.zone,
        condition: "Good Condition",
        description: newItem.description
      };
      setAssets(prev => [...prev, formattedAsset]);
    }
  };

  const handleUpdateAsset = (id: string, updates: any) => {
    setAssets(prev => prev.map(asset => 
      asset._id === id ? { ...asset, ...updates } : asset
    ));
  };

  const handleUpdateConsumable = (id: string, updates: any) => {
    setConsumables(prev => prev.map(item => 
      item._id === id ? { ...item, ...updates } : item
    ));
  };

  const triggerArchiveConsumable = (id: string) => {
    const item = consumables.find(i => i._id === id);
    if (item) {
      setItemToArchive({ id, name: item.name, type: 'consumable' });
      setIsArchiveModalOpen(true);
    }
  };

  const triggerArchiveAsset = (id: string) => {
    const asset = assets.find(a => a._id === id);
    if (asset) {
      setItemToArchive({ id, name: asset.name, type: 'asset' });
      setIsArchiveModalOpen(true);
    }
  };

  const handleConfirmArchive = () => {
    if (!itemToArchive) return;
    
    if (itemToArchive.type === 'consumable') {
      setConsumables(prev => prev.filter(item => item._id !== itemToArchive.id));
    } else {
      setAssets(prev => prev.filter(asset => asset._id !== itemToArchive.id));
    }
    
    setIsArchiveModalOpen(false);
    setItemToArchive(null);
  };

  const { role } = useAuth()
  const userRole = (role ?? 'custodian') as React.ComponentProps<typeof SidebarNavigationSection>["userRole"]

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <SidebarNavigationSection userRole={userRole}/>
      
      {/* Main content area that handles scrolling for the whole page */}
      <div className="flex flex-col flex-1 min-w-0 ml-[240px] overflow-y-auto h-full">
        {/* Sticky Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between px-8 pt-8 pb-4">
          <div>
            <h1 className="[font-family:'Poppins',Helvetica] text-3xl font-bold text-gray-900 tracking-tigh">
              Inventory Management
            </h1>
            <p className="[font-family:'Poppins',Helvetica] text-gray-500 text-sm mt-1">
              Track and manage your gym equipment and supplies!
            </p>
          </div>
        </header>
        
        <main className="p-8 pb-12 flex flex-col gap-6">
        <InventoryFilterSection
          activeCategory={activeCategory}
          searchQuery={searchQuery}
          filter={filter}
          selectedArea={selectedArea}
          selectedAssetArea={selectedAssetArea}
          selectedCondition={selectedCondition}
          mockConsumables={consumables}
          mockAssets={assets}
        >
          {(filterData) => (
            <div className="space-y-8">
              <InventoryAlertBanner 
                outOfStockCount={filterData.outOfStockCount} 
                lowStockCount={filterData.lowStockCount} 
              />
              
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#e8e8e8]">
                <InventoryStats 
                  activeCategory={activeCategory}
            
                  totalItems={
                    activeCategory === "Consumables" 
                      ? consumables.length 
                      : activeCategory === "Assets" 
                        ? assets.length 
                        : consumables.length + assets.length
                  }
                  {...filterData}
                />

                <InventoryToolbar 
                  activeCategory={activeCategory} 
                  setActiveCategory={handleCategoryChange}
                  filter={filter} 
                  setFilter={setFilter}
                  searchQuery={searchQuery} 
                  setSearchQuery={setSearchQuery} 
                  selectedArea={selectedArea} 
                  setSelectedArea={setSelectedArea}
                  selectedAssetArea={selectedAssetArea} 
                  setSelectedAssetArea={setSelectedAssetArea} 
                  selectedCondition={selectedCondition} 
                  setSelectedCondition={setSelectedCondition} 
                  onAddItem={() => setIsAddModalOpen(true)}
                />

                <InventoryList 
                  activeCategory={activeCategory} 
                  filteredConsumables={filterData.filteredConsumables} 
                  filteredAssets={filterData.filteredAssets} 
                  isOutOfStock={filterData.isOutOfStock} 
                  isLowStock={filterData.isLowStock} 
                  onAssetClick={(asset) => {
                    setSelectedAssetForEdit(asset);
                    setIsUpdateModalOpen(true);
                  }}
                  onConsumableClick={(item) => {
                    setSelectedConsumableForEdit(item);
                    setIsConsumableUpdateOpen(true);
                  }}
                  onDeleteConsumable={triggerArchiveConsumable}
                  onDeleteAsset={triggerArchiveAsset}
                />
              </div>
            </div>
          )}
        </InventoryFilterSection>
        </main>
      </div>
      
      <AddItemModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddItem} 
      />

      <UpdateAssetModal 
        isOpen={isUpdateModalOpen} 
        onClose={() => setIsUpdateModalOpen(false)} 
        asset={selectedAssetForEdit} 
        onUpdate={handleUpdateAsset} 
      />

      <UpdateConsumableModal 
        isOpen={isConsumableUpdateOpen}
        onClose={() => setIsConsumableUpdateOpen(false)}
        item={selectedConsumableForEdit}
        onUpdate={handleUpdateConsumable}
      />

      <ArchiveConfirmModal 
        isOpen={isArchiveModalOpen}
        onClose={() => setIsArchiveModalOpen(false)}
        onConfirm={handleConfirmArchive}
        itemName={itemToArchive?.name || ""}
      />
    </div>
  );
};
