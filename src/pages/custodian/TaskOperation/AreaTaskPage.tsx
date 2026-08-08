import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, CheckCircle2, MapPin, Clock, ClipboardCheck, ChevronLeft, AlertCircle } from 'lucide-react';

// Mock data — replace with a real fetch by area once the endpoint exists
const MOCK_TASKS = [
  {
    id: 't1',
    title: 'Wipe down all bench press stations',
    description: 'Sanitize benches, pads, and adjustment pins with disinfectant spray.',
    deadline: 'Today, 5:00 PM',
    priority: 'high' as const,
  },
  {
    id: 't2',
    title: 'Restock chalk and resistance bands',
    description: 'Check inventory bin near the rack and refill from supply closet if low.',
    deadline: 'Today, 6:00 PM',
    priority: 'medium' as const,
  },
  {
    id: 't3',
    title: 'Inspect cable machine attachments',
    description: 'Check for fraying or loose pins on all attachments before end of shift.',
    deadline: 'Tomorrow, 9:00 AM',
    priority: 'low' as const,
  },
];

const PRIORITY_STYLES = {
  high: { label: 'High Priority', dot: 'bg-rose-500', badge: 'bg-rose-50 text-rose-600' },
  medium: { label: 'Medium Priority', dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-600' },
  low: { label: 'Low Priority', dot: 'bg-gray-400', badge: 'bg-gray-100 text-gray-500' },
};

type PageState = 'loading' | 'verified' | 'ready';

export default function ZoneTaskPage() {
  const { area } = useParams<{ area: string }>();
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>('loading');
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  const zoneName = area ? decodeURIComponent(area) : 'Zone';

  useEffect(() => {
    // Simulated lookup — swap for a real fetch against the zone/area
    const verifyTimer = setTimeout(() => setPageState('verified'), 1400);
    const readyTimer = setTimeout(() => setPageState('ready'), 2400);
    return () => {
      clearTimeout(verifyTimer);
      clearTimeout(readyTimer);
    };
  }, []);

  const toggleComplete = (id: string) => {
    setCompletedIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  // --- Loading / Verifying state ---
  if (pageState === 'loading' || pageState === 'verified') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 font-['Poppins']">
        <div className="w-full max-w-sm bg-[#0a2e27] rounded-2xl flex flex-col items-center justify-center text-white p-10 shadow-md aspect-square">
          {pageState === 'loading' ? (
            <>
              <Loader2 size={56} className="animate-spin text-emerald-400 mb-4" />
              <h3 className="text-lg font-bold">Checking Zone...</h3>
              <p className="text-xs text-emerald-100/70 mt-1">Looking up tasks for {zoneName}</p>
            </>
          ) : (
            <>
              <CheckCircle2 size={56} className="text-emerald-400 mb-4 animate-bounce" />
              <h3 className="text-lg font-bold">Zone Verified!</h3>
              <p className="text-xs text-emerald-100/70 mt-1">{zoneName} recognized</p>
            </>
          )}
        </div>
      </div>
    );
  }

  // --- Task list state ---
  const allComplete = completedIds.length === MOCK_TASKS.length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-['Poppins']">
      <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-5">

        {/* Back + Zone header */}
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-700 mb-4"
          >
            <ChevronLeft size={16} />
            Back
          </button>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className="bg-emerald-50 text-[#0a2e27] p-3 rounded-xl shrink-0">
              <MapPin size={22} />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-extrabold text-gray-900 truncate">{zoneName}</h1>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                {MOCK_TASKS.length} task{MOCK_TASKS.length !== 1 ? 's' : ''} assigned to this area
              </p>
            </div>
          </div>
        </div>

        {/* Task list */}
        <div className="space-y-3">
          {MOCK_TASKS.map((task) => {
            const isDone = completedIds.includes(task.id);
            const style = PRIORITY_STYLES[task.priority];

            return (
              <div
                key={task.id}
                className={`bg-white rounded-2xl border p-4 sm:p-5 transition-colors ${
                  isDone ? 'border-emerald-100 bg-emerald-50/40' : 'border-gray-100'
                } shadow-sm`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleComplete(task.id)}
                    className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 transition-colors cursor-pointer ${
                      isDone
                        ? 'bg-[#0a2e27] border-[#0a2e27]'
                        : 'border-gray-300 hover:border-[#0a2e27]'
                    }`}
                    title={isDone ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {isDone && <ClipboardCheck size={13} className="text-white" />}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        className={`text-sm font-bold ${
                          isDone ? 'text-gray-400 line-through' : 'text-gray-900'
                        }`}
                      >
                        {task.title}
                      </h3>
                      <span
                        className={`shrink-0 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 ${style.badge}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                        {style.label}
                      </span>
                    </div>

                    <p className={`text-xs mt-1 ${isDone ? 'text-gray-400' : 'text-gray-500'}`}>
                      {task.description}
                    </p>

                    <div className="flex items-center gap-1.5 mt-2.5 text-[11px] font-semibold text-gray-400">
                      <Clock size={12} />
                      Due {task.deadline}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer status */}
        <div
          className={`rounded-2xl p-4 flex items-center gap-3 border ${
            allComplete
              ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
              : 'bg-white border-gray-100 text-gray-500 shadow-sm'
          }`}
        >
          {allComplete ? (
            <>
              <CheckCircle2 size={20} className="shrink-0" />
              <p className="text-xs font-bold">All tasks for {zoneName} completed. Nice work!</p>
            </>
          ) : (
            <>
              <AlertCircle size={20} className="shrink-0 text-gray-400" />
              <p className="text-xs font-semibold">
                {MOCK_TASKS.length - completedIds.length} task
                {MOCK_TASKS.length - completedIds.length !== 1 ? 's' : ''} remaining in this area.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}