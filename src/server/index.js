import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173" })); // your Vite port
app.use(express.json());

const client = new MongoClient(process.env.KILOS_DATABASE_URI);
let db;

async function connectDB() {
  await client.connect();
  db = client.db("test"); // your DB name
  console.log("✅ Connected to MongoDB");
}

// ─── ASSETS ───────────────────────────────────────────
app.get("/api/assets", async (req, res) => {
  try {
    const data = await db
      .collection("assets")
      .find({ isArchived: false })
      .sort({ createdAt: -1 })
      .toArray();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── CONSUMABLES ──────────────────────────────────────
app.get("/api/consumables", async (req, res) => {
  try {
    const data = await db
      .collection("consumables")
      .find({ isArchived: false })
      .sort({ createdAt: -1 })
      .toArray();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

connectDB().then(() => {
  app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
});