import type { AuditLogs } from '../../../types/auditLogs';
import { formatDateTime } from '../../../utils/formatter';
import { getDisplayName } from '../../../utils/formatUser';
import { formatModuleName } from '../../../utils/formatter'

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalLogs: number;
}

interface Props {
  logs: AuditLogs[];
  pagination?: PaginationData;
  onPageChange?: (newPage: number) => void;
}

// Badge color mapping aligned with filter dropdown types
const getBadge = (type: string) => {
  switch (type) {
    case "Asset":
      return "bg-blue-50 text-blue-600 border-blue-200";

    case "RepairLog":
    case "Task":
      return "bg-yellow-50 text-yellow-600 border-yellow-200";

    case "IncidentReport":
      return "bg-purple-50 text-purple-600 border-purple-200";
      
    case "TaskLog":
      return "bg-red-50 text-red-600 border-red-200";

    case "Lost And Found":
    case "Lost & Found":
      return "bg-amber-50 text-amber-600 border-amber-200";

    case "User":
      return "bg-purple-50 text-purple-600 border-purple-200";

    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
};

export default function LogsTableSection({ logs, pagination, onPageChange }: Props) {
  if (logs.length === 0) {
    return (
      <div className="w-full bg-white border border-[#E5E7EB] rounded-2xl p-8 text-center text-sm text-gray-500 shadow-sm">
        No logs found.
      </div>
    );
  }

  const currentPage = pagination?.currentPage || 1;
  const totalPages = pagination?.totalPages || 1;
  const totalLogs = pagination?.totalLogs || logs.length;
  
  return (
    <div className="w-full bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden">
      
      {/* MOBILE VIEW */}
      <div className="block md:hidden divide-y divide-[#E5E7EB]">
        {logs.map((log, index) => {
          const logKey = (log as any)._id || (log as any).id || index;
          return (
            <div key={logKey} className="p-4 space-y-3 bg-white">
              {/* Card Header: Type Badge & Timestamp */}
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`
                    inline-flex
                    items-center
                    px-2.5
                    py-0.5
                    rounded-full
                    text-xs
                    font-medium
                    border
                    ${getBadge(log.module)}
                  `}
                >
                  {formatModuleName(log.module)}
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  {formatDateTime(log.createdAt)}
                </span>
              </div>

              {/* Main Action & Details */}
              <div>
                <p className="text-sm font-semibold text-[#0f2942]">
                  {log.action}
                </p>
                <p className="text-sm text-gray-500 mt-1 leading-snug">
                  {log.details}
                </p>
              </div>

              {/* Footer Info: User */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-400">Performed by</span>
                <span className="font-medium text-[#0f2942]">
                  {getDisplayName(`${log.performedBy?.firstName || ''} ${log.performedBy?.lastName || ''}`.trim() || 'System')}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* DESKTOP VIEW TABLE */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-gray-50/60">
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500 w-[270px]">
                Timestamp
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500 w-[170px]">
                User ID
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500 w-[140px]">
                Name
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500 w-[130px]">
                Type
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500 w-[130px]">
                Action
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Details
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E5E7EB]">
            {logs.map((log, index) => {
              const logKey = (log as any)._id || (log as any).id || index;
              return (
                <tr
                  key={logKey}
                  className="hover:bg-gray-50/80 transition-colors"
                >
                  {/* date */}
                  <td className="px-5 py-4 text-sm text-[#0f2942] whitespace-nowrap">
                    {formatDateTime(log.createdAt)}
                  </td>

                  {/* user id */}
                  <td className="px-5 py-4 text-sm font-medium text-[#0f2942] whitespace-nowrap">
                    {log.performedBy?.userId || 'N/A'}
                  </td>

                  {/* user name */}
                  <td className="px-5 py-4 text-sm font-medium text-[#0f2942] whitespace-nowrap">
                    {getDisplayName(`${log.performedBy?.firstName || ''} ${log.performedBy?.lastName || ''}`.trim() || 'System')}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    <span
                      className={`
                        inline-flex
                        items-center
                        px-2.5
                        py-0.5
                        rounded-full
                        text-xs
                        font-medium
                        border
                        ${getBadge(log.module)}
                      `}
                    >
                      {formatModuleName(log.module)}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-sm font-semibold text-[#0f2942] whitespace-nowrap">
                    {log.action}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-500">
                    {log.details || "N/A"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* PAGINATION FOOTER */}
      {onPageChange && (
        <div className="px-5 py-3.5 border-t border-[#E5E7EB] bg-white flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Showing <span className="font-semibold text-[#0f2942]">{logs.length}</span> of{" "}
            <span className="font-semibold text-[#0f2942]">{totalLogs}</span> entries (Page{" "}
            <span className="font-semibold text-[#0f2942]">{currentPage}</span> of{" "}
            <span className="font-semibold text-[#0f2942]">{totalPages}</span>)
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-3 py-1.5 text-xs font-medium border border-[#E5E7EB] rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 text-[#0f2942] transition-colors"
            >
              Previous
            </button>

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-3 py-1.5 text-xs font-medium border border-[#E5E7EB] rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 text-[#0f2942] transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

    </div>
  );
}