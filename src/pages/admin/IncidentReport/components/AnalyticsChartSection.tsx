import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface AnalyticsChartsProps {
  statusData: Array<{ name: string; value: number; color: string }>;
  severityData: Array<{ name: string; value: number; color: string }>;
  areaData: Array<{ name: string; count: number }>;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  statusData,
  severityData,
  areaData,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      {/* By Status Pie Chart */}
      <div className="md:col-span-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
        <h3 className="text-xs font-bold uppercase text-gray-500 tracking-wider">By Status</h3>
        <div className="h-[160px] w-full my-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={statusData} innerRadius={45} outerRadius={65} dataKey="value" stroke="none">
                {statusData.map((entry, index) => (
                  <Cell key={`status-cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-4 text-xs font-semibold text-gray-600">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#E67E22]" /> Open</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#2ECC71]" /> Resolved</span>
        </div>
      </div>

      {/* By Severity Pie Chart */}
      <div className="md:col-span-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
        <h3 className="text-xs font-bold uppercase text-gray-500 tracking-wider">By Severity</h3>
        <div className="h-[160px] w-full my-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={severityData} innerRadius={45} outerRadius={65} dataKey="value" stroke="none">
                {severityData.map((entry, index) => (
                  <Cell key={`severity-cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-3 text-xs font-semibold text-gray-600 flex-wrap">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#E74C3C]" /> High</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#F1C40F]" /> Medium</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#3498DB]" /> Low</span>
        </div>
      </div>

      {/* By Area Bar Chart */}
      <div className="md:col-span-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
        <h3 className="text-xs font-bold uppercase text-gray-500 tracking-wider">By Area</h3>
        <div className="h-[180px] w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={areaData} margin={{ top: 10, right: 20, left: 40, bottom: 0 }}>
              <XAxis type="number" allowDecimals={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={120} />
              <Tooltip />
              <Bar dataKey="count" fill="#E67E22" radius={[0, 4, 4, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;