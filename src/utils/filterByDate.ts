export type DatePreset = "All" | "Today" | "Last 7 Days" | "Last 30 Days" | "Custom" | (string & {});

interface DateFilterParams {
    logDate: string | Date | number | null | undefined;
    selectedDate: DatePreset;
    startDate?: string;
    endDate?: string;
}

export function isWithinDateRange(params: DateFilterParams): boolean {
    const {
        logDate,
        selectedDate,
        startDate = "",
        endDate = "",
    }  = params;

    const normalizedPreset = String(selectedDate || "").trim();

    if (!normalizedPreset || normalizedPreset === "All" || normalizedPreset === "All Dates") {
        return true;
    }

    if (!logDate) return false;

    const date = new Date(logDate);
    if (isNaN(date.getTime())) return false; // handles invalid date 

    const now = new Date(); // todays date
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (normalizedPreset) {
        case "Today":
            return date >= todayStart;
        
        case "Last 7 Days": {
            const sevenDaysAgo = new Date(todayStart);
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            return date >= sevenDaysAgo;
        }

        case "Last 30 Days": {
            const thirtyDaysAgo = new Date(todayStart);
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return date >= thirtyDaysAgo
        }

        case "Custom": {
            if (!startDate) return true;
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0); // start day

            const end = endDate ? new Date(endDate) : new Date(startDate);
            end.setHours(23, 59, 59, 999); // end day

            return date >= start && date <= end;
        }

        default: {
            const formattedLogDate = date.toISOString().split("T")[0];
            return formattedLogDate === selectedDate;
        }
            
    }
}
