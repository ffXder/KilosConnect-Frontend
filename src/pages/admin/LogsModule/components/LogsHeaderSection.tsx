import {
  AlertTriangle,
  Database,
  FileText,
  Wrench,
} from "lucide-react";

export default function LogsHeaderSection() {
  const cards = [
    {
      value: 350,
      percent: "+2%",
      icon: Database,
      color: "text-green-500",
    },
    {
      value: 15,
      percent: "+10%",
      icon: AlertTriangle,
      color: "text-red-500",
    },
    {
      value: 8,
      percent: "+3%",
      icon: Wrench,
      color: "text-orange-500",
    },
    {
      value: 54,
      percent: "+3%",
      icon: FileText,
      color: "text-blue-500",
    },
  ];

  return (
    <div className="flex gap-4 flex-wrap">
        {cards.map((card, index) => {
        const Icon = card.icon;

        return (
            <div
              key={index}
              className="
                bg-white
                border
                border-[#E5E7EB]
                rounded-xl
                shadow-sm
                px-4
                py-3
                flex
                items-center
                gap-3
                dark:bg-slate-900
                dark:border-slate-700
              "
            >
              <Icon
                size={24}
                className={card.color}
              />

              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm dark:text-slate-100">
                  {card.value}
                </span>

                <span className="text-[10px] text-green-500 dark:text-emerald-400">
                  {card.percent}
                </span>
              </div>
            </div>
          );
        })}
    </div>
  );
}