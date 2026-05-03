// LogsServices.ts
const API_URL = "http://localhost:5000/api/audit-logs";

export const getAuditLogs = async () => {
  try {
    // Note: Removed the extra "/audit-logs" from the fetch string
    const response = await fetch(`${API_URL}`, { 
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    throw error;
  }
};