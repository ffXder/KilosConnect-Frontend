import { Consumable } from "../models/consumable.js";

export async function getAllConsumables(req, res) {
  try {
    const consumables = await Consumable.find();
    res.json(consumables);
  } catch (error) {
    console.error("Error fetching consumables:", error);
    res.status(500).json({ error: "Failed to fetch consumables" });
  }
}

export async function getConsumableById(req, res) {
  try {
    const consumable = await Consumable.findById(req.params.id);
    if (!consumable) {
      return res.status(404).json({ error: "Consumable not found" });
    }
    res.json(consumable);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch consumable" });
  }
}

export async function createConsumable(req, res) {
  try {
    const consumable = new Consumable(req.body);
    await consumable.save();
    res.status(201).json(consumable);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateConsumable(req, res) {
  try {
    const consumable = await Consumable.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(consumable);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteConsumable(req, res) {
  try {
    await Consumable.findByIdAndDelete(req.params.id);
    res.json({ message: "Consumable deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete consumable" });
  }
}
