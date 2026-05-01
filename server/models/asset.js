import mongoose from "mongoose";

const assetSchema = new mongoose.Schema({
  assetId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  condition: { 
    type: String, 
    enum: ["working", "damaged", "need repair", "under repair"],
    default: "working"
  },
  purchaseDate: { type: Date, required: true },
  location: String,
  category: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Asset = mongoose.model("Asset", assetSchema);
