import { useMemo, useState } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import type { TaskLog } from '../../../../types/task';

export const formatTime = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleString('en-PH', {
        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
      })
    : '—';

interface ReviewListProps {
  reviews: TaskLog[];
  onViewDetails: (review: TaskLog) => void;
}

export default function ReviewList({ reviews, onViewDetails }: ReviewListProps) {
  // group the queue by area, keeping the order they were submitted in
  const groups = useMemo(() => {
    const map = new Map<string, TaskLog[]>();
    reviews.forEach((log) => {
      const area = log.task.area;
      map.set(area, [...(map.get(area) ?? []), log]);
    });
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [reviews]);

  // first area starts open; the rest stay collapsed
  const [openAreas, setOpenAreas] = useState<Set<string>>(
    () => new Set(groups.length ? [groups[0][0]] : [])
  );

  const toggle = (area: string) =>
    setOpenAreas((prev) => {
      const next = new Set(prev);
      next.has(area) ? next.delete(area) : next.add(area);
      return next;
    });

  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center dark:bg-slate-900 dark:border-slate-700">
        <p className="text-gray-500 font-medium">No submissions waiting for review.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {groups.map(([area, logs]) => {
        const isOpen = openAreas.has(area);

        return (
          <div key={area} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden dark:bg-slate-900 transition-colors duration-300 dark:shadow-none dark:border dark:border-slate-700">
            {/* Area header (the dropdown toggle) */}
            <button
              type="button"
              onClick={() => toggle(area)}
              aria-expanded={isOpen}
              className="w-full p-4 flex items-center justify-between gap-3 text-left active:bg-gray-50 transition-colors dark:active:bg-slate-700"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="bg-emerald-50 p-2.5 rounded-xl text-[#0a2e27] shrink-0 dark:bg-emerald-900 dark:text-emerald-200">
                  <MapPin size={20} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-gray-900 text-base truncate dark:text-white">
                    {area}
                  </h4>
                  <p className="text-xs text-gray-500 font-medium mt-0.5 dark:text-slate-400">
                    {logs.length} {logs.length === 1 ? 'task' : 'tasks'} to review
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-lg ">
                  {logs.length}
                </span>
                <ChevronDown
                  size={20}
                  className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
              </div>
            </button>

            {/* Tasks in this area */}
            <div
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100 dark:bg-slate-800' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <div className="border-t border-gray-100 divide-y divide-gray-100 dark:border-slate-600 dark:divide-slate-600">
                  {logs.map((item) => {
                    const done = (item.checklist ?? []).filter((c) => c.isDone).length;
                    const total = (item.checklist ?? []).length;

                    return (
                      <div
                        key={item._id}
                        onClick={() => onViewDetails(item)}
                        className="px-4 py-3.5 flex items-center justify-between gap-3 cursor-pointer active:bg-gray-50 transition-colors dark:active:bg-slate-700"
                      >
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 dark:text-white">
                            {item.task.title}
                          </p>
                          <p className="text-xs text-gray-500 font-medium mt-0.5 truncate dark:text-slate-400">
                            {item.completedBy ? `${item.completedBy.firstName} ${item.completedBy.lastName}` : 'Unknown'} · {formatTime(item.completedAt)}
                          </p>
                        </div>
                        <span className="bg-emerald-50 text-[#0a2e27] text-xs font-bold px-2.5 py-1 rounded-lg border border-emerald-100 shrink-0 dark:bg-emerald-900 dark:text-emerald-200 dark:border-emerald-600">
                          {done}/{total}
                        </span>
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
  );
}