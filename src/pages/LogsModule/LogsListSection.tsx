import React from 'react';

export interface LogEntry {
  id: string; 
  title: string;
  description: string;
  user: string;
  timestamp: string;
  rawDate: string;
  type: string;
  icon: React.ReactNode;
  bg: string;
}

interface Props {
  logs: LogEntry[];
  activeFilter: string;
  dateRange: string;
  customStart?: string;
  customEnd?: string;
}

export const LogsListSection: React.FC<Props> = ({ logs, activeFilter }) => {
  const filteredLogs = activeFilter === 'All Logs'
    ? logs
    : logs.filter(log => log.type === activeFilter);

  return (
    <div className="flex flex-col gap-4">
      {filteredLogs.map((log) => (
        <div key={log.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
          <div className="flex gap-5 items-start">
            <div className={`w-14 h-14 rounded-2xl ${log.bg} flex items-center justify-center shrink-0`}>
              {log.icon}
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg leading-tight">{log.title}</h3>
              <p className="text-gray-500 text-sm mt-0.5">{log.description}</p>
              <div className="flex gap-2 items-center mt-3 text-gray-400 text-xs font-medium">
                <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">{log.user}</span>
                <span className="text-[10px] mx-1">📅</span>
                <span>{log.timestamp}</span>
              </div>
            </div>
          </div>
          <span className="px-4 py-1.5 rounded-full bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border border-gray-100">
            {log.type}
          </span>
        </div>
      ))}

      {filteredLogs.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-20 flex flex-col items-center justify-center">
          <p className="text-gray-300 font-medium italic">No activity logs available for this filter.</p>
        </div>
      )}
    </div>
  );
};