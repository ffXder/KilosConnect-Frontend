import React from "react";
import { ShieldCheck, UserRound, UserRoundCog, UsersRound } from "lucide-react";
import type { UserAccount } from "../../../../types/manageAccount";

interface AccountStatsSectionProps {
  accounts: UserAccount[];
}

export const AccountStatsSection: React.FC<AccountStatsSectionProps> = ({ accounts }) => {
  const stats = [
    {
      label: "Total Users",
      count: accounts.length,
      cardClass: "bg-blue-100 border-blue-300 dark:bg-blue-950/50 dark:border-blue-800",
      iconClass: "bg-[#0B4058] text-white dark:bg-blue-200 dark:text-blue-800",
      icon: UsersRound,
    },
    {
      label: "Super Admin",
      count: accounts.filter((account) => account.role === "super_admin").length,
      cardClass: "bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800",
      iconClass: "bg-amber-100 text-amber-700 dark:bg-amber-200 dark:text-amber-800",
      icon: ShieldCheck,
    },
    {
      label: "Admin",
      count: accounts.filter((account) => account.role === "admin").length,
      cardClass: "bg-purple-50 border-purple-200 dark:bg-purple-950/40 dark:border-purple-800",
      iconClass: "bg-purple-100 text-purple-700 dark:bg-purple-200 dark:text-purple-800",
      icon: UserRoundCog,
    },
    {
      label: "Custodian",
      count: accounts.filter((account) => account.role === "custodian").length,
      cardClass: "bg-sky-50 border-sky-200 dark:bg-sky-950/40 dark:border-sky-800",
      iconClass: "bg-sky-100 text-sky-700 dark:bg-sky-200 dark:text-sky-800",
      icon: UserRound,
    },
  ];

  return (
    <div className="grid w-full grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4 lg:gap-5">
      {stats.map(({ label, count, cardClass, iconClass, icon: Icon }) => (
        <div
          key={label}
          className={`flex min-w-0 items-center gap-2 rounded-2xl border p-3 shadow-sm transition-colors duration-300 dark:shadow-none sm:gap-3 sm:p-4 lg:gap-4 lg:p-5 ${cardClass}`}
        >
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-10 sm:w-10 lg:h-12 lg:w-12 ${iconClass}`}
          >
            <Icon size={20} strokeWidth={2} className="lg:size-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xl font-bold leading-tight text-gray-800 dark:text-slate-50 sm:text-2xl">
              {count}
            </div>
            <div className="truncate text-xs font-medium text-gray-600 dark:text-slate-300 sm:text-sm">
              {label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
