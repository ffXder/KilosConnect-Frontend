import { Asset } from "../models/asset.js";

export async function getAllAssets(req, res) {
  try {
    const assets = await Asset.find();
    res.json(assets);
  } catch (error) {
    console.error("Error fetching assets:", error);
    res.status(500).json({ error: "Failed to fetch assets" });
  }
}

export async function getAssetById(req, res) {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ error: "Asset not found" });
    }
    res.json(asset);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch asset" });
  }
}

export async function createAsset(req, res) {
  try {
    const asset = new Asset(req.body);
    await asset.save();
    res.status(201).json(asset);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateAsset(req, res) {
  try {
    const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(asset);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteAsset(req, res) {
  try {
    await Asset.findByIdAndDelete(req.params.id);
    res.json({ message: "Asset deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete asset" });
  }
}
