const BASE_URL = "http://localhost:5000/api";

export async function fetchAssets() {
  // Removed the extra /api here
  const res = await fetch(`${BASE_URL}/assets`); 
  if (!res.ok) throw new Error("Failed to fetch assets");
  return res.json();
}

export async function fetchConsumables() {
  // This one was already perfect!
  const res = await fetch(`${BASE_URL}/consumables`);
  if (!res.ok) throw new Error("Failed to fetch consumables");
  return res.json();
}

