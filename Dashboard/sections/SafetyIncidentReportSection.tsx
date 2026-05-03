import React from "react";

export type Incident = {
  id: string;
  title: string;
  severity: string;
  severityColor: string;
  severityBg: string;
  status: string;
  statusColor: string;
  statusBg: string;
  dateTime: string;
};

// TODO: Replace with MongoDB fetch – e.g. GET /api/incidents
const incidents: Incident[] = [];

const summaryItems = [
  { value: 0, label: "Total Incidents", valueColor: "text-[#1a1a1a]" },
  { value: 0, label: "Pending", valueColor: "text-[#0056d2]" },
  { value: 0, label: "Resolved", valueColor: "text-[#1b9640]" },
];

const Pill = ({
  label,
  color,
  bg,
}: {
  label: string;
  color: string;
  bg: string;
}) => (
  <span
    className="inline-flex items-center justify-center px-3 py-0.5 rounded-full text-[11px] [font-family:'Poppins',Helvetica] font-medium whitespace-nowrap"
    style={{ color, backgroundColor: bg }}
  >
    {label}
  </span>
);

export const SafetyIncidentReportSection : React.FC = () => {
  return (
    <section
      aria-labelledby="incident-reports-title"
      className="w-full bg-white rounded-[16px] border border-[#e8e8e8] shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-5 pb-3 flex-wrap gap-3">
        <h2
          id="incident-reports-title"
          className="[font-family:'Poppins',Helvetica] font-semibold text-[#1a1a1a] text-xl m-0 p-0"
        >
          Recent Incident Reports
        </h2>
        <div className="flex gap-6">
        {summaryItems.map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-1">
            <span className={`[font-family:'Poppins',Helvetica] font-semibold text-2xl leading-none ${item.valueColor}`}>
              {item.value}
            </span>
            <span className="[font-family:'Poppins',Helvetica] font-normal text-[#888] text-[11px] whitespace-nowrap">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>

    {/* Table */}
    <div className="px-6 pb-5 overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-[#efefef]">
            {["ID", "Title", "Severity", "Status", "Date & Time"].map((col) => (
              <th
                key={col}
                className="[font-family:'Poppins',Helvetica] font-semibold text-[#1a1a1a] text-sm text-left py-2 pr-6 last:pr-0 whitespace-nowrap"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {incidents.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="text-center py-10 text-[#bbb] [font-family:'Poppins',Helvetica] text-sm"
              >
                No incident reports available.
              </td>
            </tr>
          ) : (
            incidents.map((inc) => (
              <tr key={inc.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa] transition-colors">
                <td className="py-2.5 pr-6 [font-family:'Poppins',Helvetica] text-[#555] text-sm">{inc.id}</td>
                <td className="py-2.5 pr-6 [font-family:'Poppins',Helvetica] text-[#1a1a1a] text-sm">{inc.title}</td>
                <td className="py-2.5 pr-6">
                  <Pill label={inc.severity} color={inc.severityColor} bg={inc.severityBg} />
                </td>
                <td className="py-2.5 pr-6">
                  <Pill label={inc.status} color={inc.statusColor} bg={inc.statusBg} />
                </td>
                <td className="py-2.5 [font-family:'Poppins',Helvetica] text-[#555] text-sm whitespace-nowrap">{inc.dateTime}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </section>
);
};