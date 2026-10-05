import React, { useMemo, useState } from 'react';
import { MapPin, ChevronDown, ChevronRight } from 'lucide-react';
import { useMySubmissions } from '../../../../hooks/useMySubmissions';
import { formatTime } from './ReviewList';
import SubmissionDetailView, { badge } from './SubmissionDetailView';
import type { TaskLog } from '../../../../types/task';

export default function MySubmissions() {
  const { submissions, loading, error } = useMySubmissions();
  const [openAreas, setOpenAreas] = useState<Set<string>>(new Set());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = submissions.find((s) => s._id === selectedId) ?? null;

  const groups = useMemo(() => {
    const map = new Map<string, TaskLog[]>();
    submissions.forEach((log) => {
      const area = log.task.area;
      map.set(area, [...(map.get(area) ?? []), log]);
    });
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [submissions]);

  const toggleArea = (area: string) =>
    setOpenAreas((prev) => {
      const next = new Set(prev);
      next.has(area) ? next.delete(area) : next.add(area);
      return next;
    });

  if (loading) return <p className="text-sm text-gray-500 font-medium dark:text-slate-400">Loading submissions...</p>;
  if (error) return <p className="text-sm text-rose-600 font-medium">{error}</p>;

  if (submissions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center dark:bg-slate-900 dark:border-slate-700">
        <p className="text-gray-500 font-medium text-sm dark:text-slate-400">You haven't submitted any tasks yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {groups.map(([area, logs]) => {
          const isAreaOpen = openAreas.has(area);
          const flaggedCount = logs.filter(
            (l) => l.verificationStatus === 'Disputed' || l.verificationStatus === 'Rejected'
          ).length;

          return (
            <div
              key={area}
              className={`rounded-2xl shadow-sm border overflow-hidden transition-colors duration-300 dark:shadow-none ${
                isAreaOpen
                  ? 'bg-white border-emerald-200 dark:bg-slate-900 dark:border-emerald-700'
                  : 'bg-white border-gray-100 dark:bg-slate-900 dark:border-slate-700'
              }`}
            >
              {/* Area header */}
              <button
                type="button"
                onClick={() => toggleArea(area)}
                aria-expanded={isAreaOpen}
                className={`w-full p-4 flex items-center justify-between gap-3 text-left transition-colors duration-300 ${
                  isAreaOpen
                    ? 'bg-emerald-50 dark:bg-slate-800'
                    : 'bg-transparent active:bg-gray-50 dark:active:bg-slate-700'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="bg-emerald-50 p-2.5 rounded-xl text-[#0a2e27] shrink-0 dark:bg-emerald-900 dark:text-emerald-200">
                    <MapPin size={20} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-900 text-base truncate dark:text-white">{area}</h4>
                    <p className="text-xs text-gray-500 font-medium mt-0.5 dark:text-slate-400">
                      {logs.length} {logs.length === 1 ? 'submission' : 'submissions'}
                      {flaggedCount > 0 && (
                        <span className="text-rose-600 font-bold dark:text-rose-400"> · {flaggedCount} flagged</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-2.5 py-1 rounded-lg dark:bg-emerald-900 dark:text-emerald-200">
                    {logs.length}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`transition-all duration-200 ${
                      isAreaOpen ? 'rotate-180 text-[#0a2e27] dark:text-emerald-300' : 'text-gray-400'
                    }`}
                  />
                </div>
              </button>

              {/* Task rows (tap to open the detail view) */}
              <div
                className={`grid transition-all duration-300 ease-out ${
                  isAreaOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="border-t border-gray-100 divide-y divide-gray-100 dark:border-slate-600 dark:divide-slate-600">
                    {logs.map((item) => {
                      const b = badge(item.verificationStatus);
                      return (
                        <div
                          key={item._id}
                          onClick={() => setSelectedId(item._id)}
                          className="px-4 py-3.5 flex items-center justify-between gap-3 cursor-pointer active:bg-gray-50 transition-colors dark:active:bg-slate-700"
                        >
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 dark:text-white">
                              {item.task.title}
                            </p>
                            <p className="text-xs text-gray-500 font-medium mt-0.5 dark:text-slate-400">
                              {formatTime(item.completedAt)}
                            </p>
                            <span className={`inline-block mt-1.5 text-[11px] font-bold px-2 py-0.5 rounded-full border ${b.cls}`}>
                              {b.text}
                            </span>
                          </div>
                          <ChevronRight size={18} className="text-gray-400 shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selected && (
        <SubmissionDetailView submission={selected} onClose={() => setSelectedId(null)} />
      )}
    </>
  );
}