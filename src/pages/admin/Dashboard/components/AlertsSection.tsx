import { Bell, AlertCircle, Clock, WifiOff, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface AlertItem {
  id?: string;
  asset?: string;
  task?: string;
  status: string;
  severity: "critical" | "warning" | "info" | "success";
  source?: "incident" | "task";
}

const defaultAlerts: AlertItem[] = [
  { asset: "Barbells", status: "needs excessive repairs", severity: "critical", source: "incident" },
  { task: "Squat Rack", status: "overdue for maintenance", severity: "warning", source: "task" },
  { task: "Cable Machines", status: "scheduled for today", severity: "info", source: "task" },
  { task: "Dumbbells", status: "maintenance completed", severity: "success", source: "task" },
];

const severityConfig: Record<string, { color: string; icon: React.ReactNode; bg: string; border: string }> = {
  critical: {
    color: "bg-red-500",
    icon: <AlertCircle size={16} className="text-red-500" />,
    bg: "bg-red-50 dark:bg-red-200 transition-color duration-300",
    border: "border-l-red-500",
  },
  warning: {
    color: "bg-orange-500",
    icon: <Clock size={16} className="text-orange-500" />,
    bg: "bg-orange-50 dark:bg-orange-200 transition-color duration-300",
    border: "border-l-orange-500",
  },
  info: {
    color: "bg-blue-500",
    icon: <WifiOff size={16} className="text-blue-500" />,
    bg: "bg-blue-50 dark:bg-blue-200 transition-color duration-300",
    border: "border-l-blue-500",
  },
  success: {
    color: "bg-green-500",
    icon: <CheckCircle2 size={16} className="text-green-500" />,
    bg: "bg-green-50 dark:bg-green-200 transition-color duration-300",
    border: "border-l-green-500",
  },
};

interface DashboardAlertsSectionProps {
  alerts?: AlertItem[];
  title?: string;
  subtitle?: string;
}

const DashboardAlertsSection: React.FC<DashboardAlertsSectionProps> = ({
  alerts = defaultAlerts,
  title = "Recent Alerts",
  subtitle = "Asset maintenance notifications",
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 flex flex-col dark:bg-slate-900 transition-colors duration-300 dark:border-slate-700 dark:shadow-none">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-100 text-amber-600">
          <Bell size={22} strokeWidth={2} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-slate-50 font-bold">{title}</h3>
          <p className="text-xs text-gray-400 dark:text-slate-300 for subtitle">{subtitle}</p>
        </div>
      </div>

      <div className="flex-1 mt-6 space-y-3">
        {alerts.map((alert, idx) => {
          const cfg = severityConfig[alert.severity] || severityConfig.info;
          const source = alert.source ?? (alert.task ? "task" : "incident");
          const destination = source === "task" ? "/task-monitor/live-monitor" : "/incident-report";
          const alertTitle = alert.asset ?? alert.task ?? "Maintenance update";
          const recordState = {
            ...(alert.id && source === "task" ? { taskLogId: alert.id } : {}),
            ...(alert.id && source === "incident" ? { incidentId: alert.id } : {}),
            alertSource: source,
            alertTitle,
            alertStatus: alert.status,
            alertSeverity: alert.severity,
          };

          return (
            <button
              type="button"
              key={alert.id ?? idx}
              onClick={() => navigate(destination, { state: recordState })}
              aria-label={`Open ${alertTitle} ${source === "task" ? "maintenance task" : "incident report"}`}
              className={`flex w-full items-center gap-4 rounded-xl border-l-4 p-4 text-left transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#11382C] focus-visible:ring-offset-2 ${cfg.bg} ${cfg.border}`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${cfg.bg}`}>
                {cfg.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-gray-800">
                  {alertTitle}
                </div>
                <div className="text-[12px] text-gray-500 capitalize">{alert.status}</div>
              </div>
              <div className={`w-2.5 h-2.5 rounded-full ${cfg.color} shrink-0`} />
            </button>
          );
        })}
        <div className="text-center pt-3">
          <button className="text-[12px] font-semibold text-[#113129] hover:underline cursor-pointer dark:text-slate-100">
            View All Alerts →
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardAlertsSection;