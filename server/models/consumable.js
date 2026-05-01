import mongoose from "mongoose";

const consumableSchema = new mongoose.Schema({
  consumableId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String },
  unit: { type: String },
  quantity: { type: Number, default: 0 },
  lowStockAlert: { type: Number, default: 0 },
  location: { type: String },
  isArchived: { type: Boolean, default: false }
}, {
  // This automatically manages your createdAt and updatedAt fields!
  timestamps: true 
});

export const Consumable = mongoose.model("Consumable", consumableSchema);
