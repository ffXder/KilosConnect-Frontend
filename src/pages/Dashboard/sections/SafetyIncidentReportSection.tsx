import React from "react";
import { useIncidentReports } from "../../../hooks/useIncident";

const Pill = ({ label, color, bg }: { label: string; color: string; bg: string }) => (
  <span className="inline-flex items-center justify-center px-3 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap" style={{ color, backgroundColor: bg }}>
    {label}
  </span>
);

const severityColors: Record<string, { color: string; bg: string }> = {
  Low: { color: "#1a7a4a", bg: "#e6f4ed" },
  Medium: { color: "#e09000", bg: "#fff3e0" },
  High: { color: "#d72c2c", bg: "#fdecea" },
  Urgent: { color: "#b91c1c", bg: "#fee2e2" },
  Critical: { color: "#7f1d1d", bg: "#fecaca" },
};

const statusColors: Record<string, { color: string; bg: string }> = {
  Open: { color: "#0056d2", bg: "#e8f0fe" },
  "In Progress": { color: "#e09000", bg: "#fff3e0" },
  Resolved: { color: "#1b9640", bg: "#e0f5e9" },
};

export const SafetyIncidentReportSection: React.FC = () => {
  const { reports } = useIncidentReports();
  const incidents = reports ?? [];
  const recent = incidents.slice(0, 5); // show only 5 latest

  return (
    <section className="w-full bg-white rounded-[16px] border border-[#e8e8e8] shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 pt-5 pb-3 flex-wrap gap-3">
        <h2 className="font-semibold text-[#1a1a1a] text-xl">Recent Incident Reports</h2>
        <div className="flex gap-6">
          <div className="flex flex-col items-center gap-1">
            <span className="font-semibold text-2xl">{incidents.length}</span>
            <span className="text-[#888] text-[11px]">Total</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="font-semibold text-2xl text-[#0056d2]">{incidents.filter(i => i.status === 'Open').length}</span>
            <span className="text-[#888] text-[11px]">Open</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="font-semibold text-2xl text-[#1b9640]">{incidents.filter(i => i.status === 'Resolved').length}</span>
            <span className="text-[#888] text-[11px]">Resolved</span>
          </div>
        </div>
      </div>
      <div className="px-6 pb-5 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#efefef]">
              {["ID", "Title", "Severity", "Status", "Date & Time"].map(col => (
                <th key={col} className="font-semibold text-[#1a1a1a] text-sm text-left py-2 pr-6 last:pr-0 whitespace-nowrap">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recent.map(inc => (
              <tr key={inc.incidentId} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                <td className="py-2.5 pr-6 text-[#555] text-sm">{inc.incidentId}</td>
                <td className="py-2.5 pr-6 text-[#1a1a1a] text-sm">{inc.title}</td>
                <td className="py-2.5 pr-6"><Pill label={inc.severity} {...(severityColors[inc.severity] ?? { color: '#555', bg: '#f5f5f5' })} /></td>
                <td className="py-2.5 pr-6"><Pill label={inc.status} {...(statusColors[inc.status] ?? { color: '#555', bg: '#f5f5f5' })} /></td>
                <td className="py-2.5 text-[#555] text-sm whitespace-nowrap">{new Date(inc.dateAndTime).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};