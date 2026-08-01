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

    console.log("--- DEBUG DATE FILTER ---");
    console.log("Selected Preset:", selectedDate);
    console.log("Log Date Raw:", logDate);
    console.log("Parsed Log Date:", new Date(logDate!));

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
            const todayEnd = new Date(todayStart);
            todayEnd.setHours(23, 59, 59, 999);
            return date >= todayStart && date <= todayEnd;
        
        case "Last 7 Days": {
            const sevenDaysAgo = new Date(todayStart);
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            
            const endOfToday = new Date(todayStart);
            endOfToday.setHours(23, 59, 59, 999);

            return date >= sevenDaysAgo && date <= endOfToday;
        }

        case "Last 30 Days": {
            const thirtyDaysAgo = new Date(todayStart);
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const endOfToday = new Date(todayStart);
            endOfToday.setHours(23, 59, 59, 999);

            return date >= thirtyDaysAgo && date <= endOfToday;
        }

        case "Custom": {
            if (!startDate && !endDate) return true;
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0); // start day

            const end = endDate ? new Date(endDate) : new Date(startDate);
            end.setHours(23, 59, 59, 999); // end day

            return date >= start && date <= end;
        }

        default: {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            const formattedLocalLogDate = `${year}-${month}-${day}`;

            return formattedLocalLogDate === selectedDate;
        }
            
    }
}
