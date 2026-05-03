import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// --- Database Schema ---
const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  module: { type: String, required: true },
  targetId: { type: String, default: null },
  performedBy: { type: String, required: true },
  details: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

// --- API Routes ---

/**
 * @GET /api/audit-logs
 * Fetches all audit logs from the database
 */
app.get("/api/audit-logs", async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 });
    res.status(200).json(logs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// --- Server Initialization ---
async function startServer() {
  try {
    await mongoose.connect(process.env.KILOS_DATABASE_URI);
    console.log("✅ Connected to MongoDB");
    app.listen(5000, () => console.log("🚀 Server running on port 5000"));
  } catch (err) {
    console.error("❌ Connection Error:", err);
  }
}

startServer();

export default AuditLog;