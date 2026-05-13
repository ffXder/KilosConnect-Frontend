import React from "react";
import { useTaskLogs } from "../../../hooks/useTaskLog";
import { formatTime } from "../../../utils/formatter";

const statusStyle: Record<string, { color: string; bg: string }> = {
  Completed: { color: "text-[#1b9640]", bg: "bg-[#e0f5e9]" },
  Pending: { color: "text-[#888]", bg: "bg-[#e8e8e8]" },
};

const freqStyle: Record<string, { color: string; bg: string }> = {
  Daily: { color: "text-[#c96a00]", bg: "bg-[#fff0e0]" },
  Weekly: { color: "text-[#7a00c9]", bg: "bg-[#f0e0ff]" },
  Monthly: { color: "text-[#007a8a]", bg: "bg-[#e0f7fa]" },
  Weekdays: { color: "text-[#1b5c2a]", bg: "bg-[#e0f5e9]" },
};

export const TaskStatusPanelSection: React.FC = () => {
  const { logs, loading, error } = useTaskLogs();

  const completedCount = logs.filter(t => t.status === "Completed").length;
  const pendingCount = logs.filter(t => t.status === "Pending").length;

  const summaryCards = [
    { label: "Completed", count: completedCount, bg: "bg-[#d4f5d4]", countColor: "text-[#1b9640]", labelColor: "text-[#1b9640]" },
    { label: "Pending", count: pendingCount, bg: "bg-[#e8e8e8]", countColor: "text-[#555]", labelColor: "text-[#555]" },
  ];

  const recentTasks = logs.slice(0, 10);

  if (loading) return (
    <aside className="w-full h-full bg-white rounded-[16px] border border-[#e8e8e8] shadow-sm flex items-center justify-center">
      <p className="text-sm text-[#aaa]">Loading tasks...</p>
    </aside>
  );

  if (error) return (
    <aside className="w-full h-full bg-white rounded-[16px] border border-[#e8e8e8] shadow-sm flex items-center justify-center">
      <p className="text-sm text-red-400">Failed to load tasks.</p>
    </aside>
  );

  return (
    <aside aria-label="Task Overview" className="w-full h-full bg-white rounded-[16px] border border-[#e8e8e8] shadow-sm flex flex-col overflow-hidden">
      <h2 className="font-semibold text-[#1a1a1a] text-xl px-5 pt-5 pb-0 m-0">Task Overview</h2>

      <div className="flex gap-3 px-5 pt-4 pb-3">
        {summaryCards.map((card) => (
          <div key={card.label} className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-3 rounded-[10px] ${card.bg}`}>
            <span className={`font-bold text-[28px] leading-none ${card.countColor}`}>{card.count}</span>
            <span className={`font-medium text-[11px] text-center leading-tight ${card.labelColor}`}>{card.label}</span>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-5 flex flex-col gap-2.5">
        {recentTasks.map((task) => {
          const ss = statusStyle[task.status] ?? statusStyle["Pending"];
          const fs = freqStyle[task.task.frequency] ?? freqStyle["Daily"];
          return (
            <div key={task._id} className="bg-[#fafafa] rounded-[10px] p-3.5 border border-[#efefef]">
              <p className="font-semibold text-[#1a1a1a] text-sm m-0 mb-2">{task.task.title}</p>
              <div className="flex items-center justify-between">
                <span className="text-[#aaa] text-[11px]">Task Due: {task.task.endTime}</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium ${ss.bg} ${ss.color}`}>{task.status}</span>
              </div>
            </div>
          );
        })}

        {recentTasks.length === 0 && (
          <p className="text-center text-sm text-[#bbb] py-6">No tasks for today.</p>
        )}
      </div>

      {logs.length > 10 && (
        <p className="text-center text-[11px] text-[#bbb] py-3 border-t border-[#f0f0f0] mt-1">
          Showing 10 of {logs.length} —{" "}
          <a href="/task-monitor" className="text-[#1a4d3e] font-medium ml-1 hover:underline">
            View all
          </a>
        </p>
      )}
    </aside>
  );
};