import React, { useState } from "react";
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
import { useAssets } from "../../hooks/useAssets";
import { useConsumables } from "../../hooks/useConsumables";

export const InventoryPage = () => {
  const [activeInventory, setActiveInventory] = useState<"All" | "Consumables" | "Assets" >("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedArea, setSelectedArea] = useState("All Areas");
  const [selectedAssetArea, setSelectedAssetArea] = useState("All Areas");
  const [selectedCondition, setSelectedCondition] = useState("All Conditions");
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isConsumableUpdateOpen, setIsConsumableUpdateOpen] = useState(false);
  
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [itemToArchive, setItemToArchive] = useState<{ id: string, name: string, type: 'asset' | 'consumable' } | null>(null);

  const [selectedAssetForEdit, setSelectedAssetForEdit] = useState<any>(null);
  const [selectedConsumableForEdit, setSelectedConsumableForEdit] = useState<any>(null);

  const { assets, handleCreate: createAsset, handleUpdate: updateAsset, handleUpdateCondition, handleArchive: archiveAsset } = useAssets();
  const { consumables, handleCreate: createConsumable, handleUpdate: updateConsumable, handleArchive: archiveConsumable } = useConsumables();

 const handleInventoryChange = (type: any) => {
    setActiveInventory(type);
  };
  
  const handleAddItem = async (newItem: any) => {
    if (newItem.category === "Consumables") {
        await createConsumable({
            name: newItem.name,
            category: newItem.category,
            unit: newItem.unit,
            quantity: newItem.quantity,
            lowStockAlert: newItem.minQuantity,
            location: newItem.zone,
            description: newItem.description
        });
    } else {
        await createAsset({
            name: newItem.name,
            condition: newItem.condition || 'Good Condition',
            purchaseDate: newItem.purchaseDate,
            quantity: newItem.quantity,
            area: newItem.zone,
            description: newItem.description
        });
    }
  };

  const handleUpdateAsset = async (id: string, updates: any) => {
    await handleUpdateCondition(id, updates.condition, updates.description);
  };

  const handleUpdateConsumable = async (id: string, updates: any) => {
    await updateConsumable(id, updates);
  };

  const triggerArchiveConsumable = (id: string) => {
    const item = consumables.find(i => i.consumableId === id);
    if (item) {
      setItemToArchive({ id: item.consumableId, name: item.name, type: 'consumable' });
      setIsArchiveModalOpen(true);
    }
  };

  const triggerArchiveAsset = (id: string) => {
    const asset = assets.find(a => a.assetId === id);
    if (asset) {
      setItemToArchive({ id: asset.assetId, name: asset.name, type: 'asset' });
      setIsArchiveModalOpen(true);
    }
  };

  const handleConfirmArchive = async () => {
    if (!itemToArchive) return;
    
    if (itemToArchive.type === 'consumable') {
      await archiveConsumable(itemToArchive.id)
    } else {
      await archiveAsset(itemToArchive.id)
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
      <div className="flex flex-col flex-1 min-w-0 lg:ml-[240px] overflow-y-auto h-full">
        {/* Sticky Header */}
        <header className="flex flex-col gap-4 items-center text-center px-4 py-6 sm:px-6 lg:px-10 lg:flex-row lg:items-start lg:text-left">
          <div>
            <h1 className="[font-family:'Poppins',Helvetica] text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-tight">
              Inventory Management
            </h1>
            <p className="[font-family:'Poppins',Helvetica] text-gray-500 text-sm mt-0.5">
              Track and manage your gym equipment and supplies!
            </p>
          </div>
        </header>
        
        <main className="p-8 pb-12 flex flex-col gap-6">
        <InventoryFilterSection
          activeInventory={activeInventory}
          searchQuery={searchQuery}
          filter={filter}
          selectedArea={selectedArea}
          selectedAssetArea={selectedAssetArea}
          selectedCondition={selectedCondition}
          getConsumables={consumables}
          getAssets={assets}
        >
          {(filterData) => (
            <div className="space-y-8">
              <InventoryAlertBanner 
                outOfStockCount={filterData.outOfStockCount} 
                lowStockCount={filterData.lowStockCount} 
              />
              
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#e8e8e8]">
                <InventoryStats 
                  activeCategory={activeInventory}
            
                  totalItems={
                    activeInventory === "Consumables" 
                      ? consumables.length 
                      : activeInventory === "Assets" 
                        ? assets.length 
                        : consumables.length + assets.length
                  }
                  {...filterData}
                />

                <InventoryToolbar 
                  activeInventory={activeInventory} 
                  setActiveInventory={handleInventoryChange}
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
                  activeInventory={activeInventory} 
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
