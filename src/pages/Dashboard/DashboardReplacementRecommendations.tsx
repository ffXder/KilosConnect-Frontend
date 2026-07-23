import { AlertTriangle, Eye, Wrench } from 'lucide-react';

export interface ReplacementItem {
  assetName: string;
  repairCost: number;
  srp: number;
  status: "recommended" | "monitor" | "none";
}

const defaultReplacements: ReplacementItem[] = [
  { assetName: "Barbell #12", repairCost: 4500, srp: 12500, status: "recommended" },
  { assetName: "Cable Machine 3", repairCost: 8500, srp: 45000, status: "monitor" },
  { assetName: "Squat Rack", repairCost: 3200, srp: 18000, status: "none" },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const statusConfig: Record<string, { label: string; icon: React.ReactNode; bgClass: string; textClass: string; badgeClass: string }> = {
  recommended: {
    label: "Recommended Replacement",
    icon: <Wrench size={14} strokeWidth={2.5} />,
    bgClass: "bg-red-50",
    textClass: "text-red-700",
    badgeClass: "bg-red-100 text-red-700 border-red-200",
  },
  monitor: {
    label: "Monitor Closely",
    icon: <Eye size={14} strokeWidth={2.5} />,
    bgClass: "bg-amber-50",
    textClass: "text-amber-700",
    badgeClass: "bg-amber-100 text-amber-700 border-amber-200",
  },
  none: {
    label: "",
    icon: null,
    bgClass: "bg-gray-50",
    textClass: "text-gray-400",
    badgeClass: "",
  },
};

interface DashboardReplacementRecommendationsProps {
  replacements?: ReplacementItem[];
  title?: string;
  subtitle?: string;
}

const DashboardReplacementRecommendations: React.FC<DashboardReplacementRecommendationsProps> = ({
  replacements = defaultReplacements,
  title = "Predictive Replacement Recommendations",
  subtitle = "Assets flagged for potential replacement based on repair costs",
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mt-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-rose-100 text-rose-600">
          <AlertTriangle size={22} strokeWidth={2} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <p className="text-xs text-gray-400">{subtitle}</p>
        </div>
      </div>

      {/* Replacement Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {replacements.map((item) => {
          const config = statusConfig[item.status];
          const costRatio = ((item.repairCost / item.srp) * 100).toFixed(0);

          return (
            <div
              key={item.assetName}
              className={`rounded-xl border p-5 flex flex-col gap-3 ${config.bgClass} ${
                item.status === "recommended"
                  ? "border-red-200"
                  : item.status === "monitor"
                  ? "border-amber-200"
                  : "border-gray-200"
              }`}
            >
              {/* Asset Name */}
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-gray-800 text-sm">{item.assetName}</h4>
                {item.status !== "none" && (
                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-semibold ${config.badgeClass}`}>
                    {config.icon}
                    {config.label}
                  </div>
                )}
              </div>

              {/* Cost Details */}
              <div className="space-y-2 mt-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 font-medium">Repair Cost</span>
                  <span className="text-sm font-bold text-gray-700">{formatCurrency(item.repairCost)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 font-medium">New SRP</span>
                  <span className="text-sm font-bold text-gray-700">{formatCurrency(item.srp)}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-dashed border-gray-200">
                  <span className="text-xs text-gray-500 font-medium">Cost Ratio</span>
                  <span className={`text-xs font-bold ${item.status === "recommended" ? "text-red-600" : item.status === "monitor" ? "text-amber-600" : "text-gray-500"}`}>
                    {costRatio}%
                  </span>
                </div>
              </div>

              {/* Progress bar for cost ratio */}
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    item.status === "recommended" ? "bg-red-500" : item.status === "monitor" ? "bg-amber-500" : "bg-gray-400"
                  }`}
                  style={{ width: `${Math.min(parseInt(costRatio), 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardReplacementRecommendations;

