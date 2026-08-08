import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ListTodo, CheckCircle, Users, X, MapPin } from "lucide-react";
import type { TaskItem } from "../../TaskOperation/TaskDetailsModal";

interface StatsProps {
  pendingCount: number;
  completedCount: number;
  onTabChange: (tab: "all" | "pending" | "completed") => void;
  tasks: TaskItem[];
  onViewDetails: (task: TaskItem) => void;  // ← ADD THIS LINE
}

interface StatsProps {
  pendingCount: number;
  completedCount: number;
  onTabChange: (tab: "all" | "pending" | "completed") => void;
  tasks: TaskItem[];
}

export const StatsOverview: React.FC<StatsProps> = ({
  pendingCount,
  completedCount,
  onTabChange,
  tasks,
  onViewDetails,
}) => {
  const navigate = useNavigate();
  const [modalType, setModalType] = useState<"pending" | "completed" | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Pending Tasks */}
        <div
          onClick={() => { setModalType("pending"); onTabChange("pending"); }}
          className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-gray-200 transition-all"
        >
          <div className="p-3 bg-[#E6F4EA] text-[#0a2e27] rounded-xl shrink-0">
            <ListTodo size={22} />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">{pendingCount}</p>
            <p className="text-xs font-medium text-gray-500 mt-0.5">Tasks Today</p>
          </div>
        </div>

        {/* Completed Count */}
        <div
          onClick={() => { setModalType("completed"); onTabChange("completed"); }}
          className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-gray-200 transition-all"
        >
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
            <CheckCircle size={22} />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">{completedCount}</p>
            <p className="text-xs font-medium text-gray-500 mt-0.5">Completed</p>
          </div>
        </div>

        {/* To Review */}
        <div
          onClick={() => navigate("/buddy-system")}
          className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-gray-200 transition-all"
        >
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl shrink-0">
            <Users size={22} />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">3</p>
            <p className="text-xs font-medium text-gray-500 mt-0.5">To Review</p>
          </div>
        </div>
      </div>

      {/* POPUP MODAL */}
      {modalType && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            <div className="bg-[#0a2e27] p-6 flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                  {modalType === "pending" ? (
                    <><ListTodo size={20} /> Active Tasks</>
                  ) : (
                    <><CheckCircle size={20} /> Completed Tasks</>
                  )}
                </h3>
                <p className="text-xs font-medium text-white/60 mt-0.5">
                  {modalType === "pending" ? pendingCount : completedCount}{" "}
                  {modalType === "pending" ? "Tasks Remaining" : "Total Completed"}
                </p>
              </div>
              <button
                onClick={() => setModalType(null)}
                className="text-white/60 hover:text-white cursor-pointer transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto p-6 space-y-3">
              {tasks
                .filter((t) =>
                  modalType === "pending"
                    ? t.status === "Pending" || t.status === "In Progress"
                    : t.status === "Completed"
                )
                .map((task) => (
                  <div key={task.id} className="bg-white border border-gray-100 shadow-sm rounded-2xl p-4 flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl shrink-0 ${
                      modalType === "pending"
                        ? "bg-[#E6F4EA] text-[#0a2e27]"
                        : "bg-emerald-50 text-emerald-600"
                    }`}>
                      {modalType === "pending" ? <ListTodo size={18} /> : <CheckCircle size={18} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-sm truncate">{task.title}</h4>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500 font-medium">
                        <span className="flex items-center gap-1"><MapPin size={12} /> {task.zone}</span>
                        <span>·</span>
                        <span>{task.dueDate}</span>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          task.status === "Completed"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};