import React, { useState, useEffect } from "react";
import { SidebarNavigationSection } from "../components/SidebarNavigationSection";

// Icons as SVG components to match your image exactly
const PendingIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="#e53e3e" strokeWidth="2"/>
    <path d="M15 9L9 15M9 9L15 15" stroke="#e53e3e" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const InProgressIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="#2b6cb0" strokeWidth="2"/>
    <path d="M12 7V12L15 15" stroke="#2b6cb0" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const ResolvedIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="#38a169" strokeWidth="2"/>
    <path d="M8 12L11 15L16 9" stroke="#38a169" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TotalIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 9V14M12 17H12.01M5.07107 19H18.9289C20.4678 19 21.4292 17.3333 20.6598 16L13.7309 4C12.9614 2.66667 11.0386 2.66667 10.2691 4L3.34025 16C2.57075 17.3333 3.53223 19 5.07107 19Z" stroke="#dd6b20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface Incident {
  _id: string;
  type: string;
  description: string;
  status: "Pending" | "In Progress" | "Resolved";
  priority: string;
  location: string;
  reportedBy: string;
  reportedAt: string;
}

export const IncidentReportPage: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"All" | "Pending" | "In Progress" | "Resolved">("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedIncidentId, setSelectedIncidentId] = useState("");
  const [newStatus, setNewStatus] = useState<"Pending" | "In Progress" | "Resolved">("In Progress");

  const [formData, setFormData] = useState({
    type: "",
    description: "",
    priority: "Medium Priority",
    location: "",
    reportedBy: "Bingbong Marcos", 
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newIncident: Incident = {
      _id: Date.now().toString(),
      ...formData,
      status: "Pending" as const,
      reportedAt: new Date().toLocaleString(),
    };
    setIncidents([newIncident, ...incidents]);
    setIsModalOpen(false);
    setFormData({ type: "", description: "", priority: "Medium Priority", location: "", reportedBy: "Bingbong Marcos" });
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncidentId) return;
    setIncidents((prev) =>
      prev.map((inc) => (inc._id === selectedIncidentId ? { ...inc, status: newStatus } : inc))
    );
    setIsUpdateModalOpen(false);
    setSelectedIncidentId("");
  };

  const filteredIncidents = incidents.filter(
    (incident) => filter === "All" || incident.status === filter
  );

  return (
    <div className="flex h-screen bg-[#f4f5f6] overflow-hidden relative font-sans">
      <SidebarNavigationSection />

      <div className="flex flex-col flex-1 min-w-0 ml-[240px] overflow-y-auto">
        <header className="flex items-center justify-between px-8 pt-8 pb-4">
          <div>
            <h1 className="font-semibold text-[#1f1f1f] text-[32px] leading-tight m-0">Incident Reporting</h1>
            <p className="text-[#6b6b6b] text-base mt-0.5 m-0">Track and manage equipment issues and safety hazards</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-[#e8e8e8]">
               <img className="w-6 h-6" alt="Notifications" src="https://c.animaapp.com/C3N4JJvt/img/notification@2x.png" />
            </button>
            <img className="w-10 h-10 rounded-full border border-[#d8d8d8]" alt="Profile" src="https://c.animaapp.com/C3N4JJvt/img/profile@2x.png" />
          </div>
        </header>

        <div className="flex flex-col flex-1 gap-5 px-6 pb-6">
          {/* STAT CARDS SECTION - MATCHING YOUR IMAGE */}
          <div className="grid grid-cols-4 gap-4">
            <StatCard 
              label="Pending" 
              count={incidents.filter(i => i.status === "Pending").length} 
              Icon={PendingIcon} 
              iconBg="bg-[#fff5f5]" 
            />
            <StatCard 
              label="In Progress" 
              count={incidents.filter(i => i.status === "In Progress").length} 
              Icon={InProgressIcon} 
              iconBg="bg-[#ebf8ff]" 
            />
            <StatCard 
              label="Resolved" 
              count={incidents.filter(i => i.status === "Resolved").length} 
              Icon={ResolvedIcon} 
              iconBg="bg-[#f0fff4]" 
            />
            <StatCard 
              label="Total Incidents" 
              count={incidents.length} 
              Icon={TotalIcon} 
              iconBg="bg-[#fffaf0]" 
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-white rounded-3xl border border-[#e8e8e8] shadow-sm">
            <div className="flex items-center gap-2.5">
              {["All", "Pending", "In Progress", "Resolved"].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s as any)}
                  className={`font-medium text-sm px-6 py-2.5 rounded-[10px] transition-colors ${
                    filter === s ? "bg-[#0a2e27] text-white" : "bg-[#e8e8e8] text-[#4a4a4a]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsUpdateModalOpen(true)}
                className="px-6 py-3 rounded-2xl bg-white border border-[#0a2e27] text-[#0a2e27] font-semibold text-sm transition-colors hover:bg-gray-50"
              >
                Update Status
              </button>
              <button onClick={() => setIsModalOpen(true)} className="px-6 py-3 rounded-2xl bg-[#0a2e27] text-white font-semibold text-sm">
                + Report Incident
              </button>
            </div>
          </div>

          <div className="flex-1 bg-white rounded-3xl p-6 border border-[#e8e8e8] shadow-sm overflow-y-auto">
            {filteredIncidents.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-400 italic">No incidents to display</div>
            ) : (
                <div className="space-y-4">
                {filteredIncidents.map(inc => (
                    <div key={inc._id} className="p-4 border rounded-xl flex justify-between items-center">
                        <div>
                            <p className="font-bold text-[#1a1a1a] m-0">{inc.type}</p>
                            <p className="text-sm text-gray-500 m-0">{inc.location} • Status: <span className="font-semibold text-[#0a2e27]">{inc.status}</span></p>
                        </div>
                    </div>
                ))}
                </div>
            )}
          </div>
        </div>
      </div>

      {/* MODALS REMAIN UNCHANGED */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-[700px] rounded-[24px] overflow-hidden shadow-2xl">
            <div className="bg-[#1c453e] p-6 text-white relative">
              <h2 className="text-xl font-semibold m-0">Report New Incident</h2>
              <p className="text-white/80 text-sm mt-1">Fill in the details to report an equipment issue or safety hazard</p>
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-white/80 hover:text-white text-xl">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Incident Title *</label>
                <input required name="type" value={formData.type} onChange={handleInputChange} placeholder="hi" className="w-full p-3.5 rounded-xl border border-gray-200 outline-none focus:border-[#1c453e]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                <textarea required name="description" value={formData.description} onChange={handleInputChange} placeholder="Describe the issue in detail..." rows={4} className="w-full p-3.5 rounded-xl border border-gray-200 outline-none focus:border-[#1c453e] resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Priority Level *</label>
                  <select name="priority" value={formData.priority} onChange={handleInputChange} className="w-full p-3.5 rounded-xl border border-gray-200 bg-white outline-none">
                    <option>Low Priority</option>
                    <option>Medium Priority</option>
                    <option>High Priority</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                  <input required name="location" value={formData.location} onChange={handleInputChange} className="w-full p-3.5 rounded-xl border border-gray-200 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Reported By *</label>
                <input disabled value={formData.reportedBy} className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-400" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-10 py-3 rounded-xl border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-8 py-3 rounded-xl bg-[#1c453e] text-white font-semibold flex items-center gap-2">
                  <span>+</span> Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isUpdateModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-[700px] rounded-[24px] overflow-hidden shadow-2xl">
            <div className="bg-[#1c453e] p-6 text-white relative">
              <h2 className="text-xl font-semibold m-0">Update Incident Status</h2>
              <p className="text-white/80 text-sm mt-1">Change the current progress status of an existing incident</p>
              <button onClick={() => setIsUpdateModalOpen(false)} className="absolute top-6 right-6 text-white/80 hover:text-white text-xl">✕</button>
            </div>
            <form onSubmit={handleUpdateStatus} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Incident *</label>
                <select required value={selectedIncidentId} onChange={(e) => setSelectedIncidentId(e.target.value)} className="w-full p-3.5 rounded-xl border border-gray-200 bg-white outline-none focus:border-[#1c453e]">
                  <option value="">-- Choose an incident to update --</option>
                  {incidents.map(inc => (
                    <option key={inc._id} value={inc._id}>{inc.type} (Currently: {inc.status})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">New Status *</label>
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value as any)} className="w-full p-3.5 rounded-xl border border-gray-200 bg-white outline-none focus:border-[#1c453e]">
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
              <div className="flex gap-3 pt-6">
                <button type="button" onClick={() => setIsUpdateModalOpen(false)} className="px-10 py-3 rounded-xl border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-10 py-3 rounded-xl bg-[#1c453e] text-white font-semibold">Update Progress</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// StatCard updated to match the alignment in your image
const StatCard = ({ label, count, Icon, iconBg }: any) => (
  <div className="p-6 bg-white rounded-[20px] border border-[#e8e8e8] shadow-sm flex items-center gap-4">
    <div className={`p-4 rounded-[12px] ${iconBg} flex items-center justify-center`}>
      <Icon />
    </div>
    <div>
      <div className="font-bold text-[32px] text-[#1a1a1a] leading-tight">{count}</div>
      <div className="text-sm font-medium text-gray-500">{label}</div>
    </div>
  </div>
);