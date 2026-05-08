import React from "react";

export type Task = {
  id: string;
  title: string;
  due: string;
  status: "Completed" | "Pending"; // Removed "In Progress"
  frequency: "Daily" | "Weekly" | "Monthly" | "Weekdays";
};

// Updated mock data to only include Completed and Pending
const tasks: Task[] = [
  { id: "TSK-001", title: "Morning Sanitization Walk", due: "Today, 08:00 AM", status: "Completed", frequency: "Daily" },
  { id: "TSK-002", title: "Inventory Stock Check", due: "Today, 05:00 PM", status: "Pending", frequency: "Weekly" },
  { id: "TSK-003", title: "Fire Safety Inspection", due: "May 15", status: "Pending", frequency: "Monthly" },
  { id: "TSK-004", title: "Pool Chemistry Test", due: "Today, 02:00 PM", status: "Pending", frequency: "Daily" },
];

const summaryCards = [
  { 
    label: "Completed", 
    count: tasks.filter(t => t.status === "Completed").length, 
    bg: "bg-[#d4f5d4]", 
    countColor: "text-[#1b9640]", 
    labelColor: "text-[#1b9640]" 
  },
  { 
    label: "Pending", 
    count: tasks.filter(t => t.status === "Pending").length, 
    bg: "bg-[#e8e8e8]", 
    countColor: "text-[#555]", 
    labelColor: "text-[#555]" 
  },
];

const statusStyle: Record<Task["status"], { color: string; bg: string }> = {
  Completed: { color: "text-[#1b9640]", bg: "bg-[#e0f5e9]" },
  Pending: { color: "text-[#888]", bg: "bg-[#e8e8e8]" },
};

const freqStyle: Record<Task["frequency"], { color: string; bg: string }> = {
  Daily: { color: "text-[#c96a00]", bg: "bg-[#fff0e0]" },
  Weekly: { color: "text-[#7a00c9]", bg: "bg-[#f0e0ff]" },
  Monthly: { color: "text-[#007a8a]", bg: "bg-[#e0f7fa]" },
  Weekdays: { color: "text-[#1b5c2a]", bg: "bg-[#e0f5e9]" },
};

export const TaskStatusPanelSection : React.FC = () => {
  return (
    <aside aria-label="Task Overview" className="w-full h-full bg-white rounded-[16px] border border-[#e8e8e8] shadow-sm flex flex-col overflow-hidden">
      <h2 className="font-semibold text-[#1a1a1a] text-xl px-5 pt-5 pb-0 m-0">Task Overview</h2>
      
      {/* Summary cards: Now showing 2 cards instead of 3 */}
      <div className="flex gap-3 px-5 pt-4 pb-3">
        {summaryCards.map((card) => (
          <div key={card.label} className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-3 rounded-[10px] ${card.bg}`}>
            <span className={`font-bold text-[28px] leading-none ${card.countColor}`}>{card.count}</span>
            <span className={`font-medium text-[11px] text-center leading-tight ${card.labelColor}`}>{card.label}</span>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-5 flex flex-col gap-2.5">
        {tasks.map((task) => {
          const ss = statusStyle[task.status];
          const fs = freqStyle[task.frequency];
          return (
            <div key={task.id} className="bg-[#fafafa] rounded-[10px] p-3.5 border border-[#efefef]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[#aaa] text-[11px]">{task.id}</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium ${fs.bg} ${fs.color}`}>{task.frequency}</span>
              </div>
              <p className="font-semibold text-[#1a1a1a] text-sm m-0 mb-2">{task.title}</p>
              <div className="flex items-center justify-between">
                <span className="text-[#aaa] text-[11px]">{task.due}</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium ${ss.bg} ${ss.color}`}>{task.status}</span>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};