import React from "react";
import type { ActivityItem } from "./ProfileMain";

const activityDotColor: Record<ActivityItem["type"], string> = {
  task: "bg-[#072821]",
  incident: "bg-[#ef4444]",
  inventory: "bg-[#3b82f6]",
  log: "bg-[#f59e0b]",
};

const ProfileActivitySection: React.FC<{ activities: ActivityItem[] }> = ({ activities }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-6 dark:bg-slate-900 dark:border-slate-700 dark:shadow-none">
    <h2 className="text-base font-semibold text-[#0d1f1a] mb-4 dark:text-slate-100">Recent Activity</h2>
    <div className="flex flex-col gap-0">
      {activities.map((item, idx) => (
        <div key={item.id} className={`flex items-start justify-between py-4 ${idx !== activities.length - 1 ? "border-b border-[#f3f4f6] dark:border-slate-700" : ""}`}>
          <div className="flex items-start gap-3">
            <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${activityDotColor[item.type]}`} />
            <div>
              <p className="text-sm font-semibold text-[#111827] dark:text-slate-100">{item.title}</p>
              <p className="text-xs text-[#6b7280] mt-0.5 dark:text-slate-300">{item.description}</p>
            </div>
          </div>
          <span className="text-xs text-[#9ca3af] whitespace-nowrap ml-4 mt-0.5 dark:text-slate-400">{item.timeAgo}</span>
        </div>
      ))}
    </div>
  </div>
);

export default ProfileActivitySection;