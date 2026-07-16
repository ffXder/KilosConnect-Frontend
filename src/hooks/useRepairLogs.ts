import { useState, useCallback } from "react";
import { createRepairLog, getRepairLogsByAsset } from "../services/repairLogService";
import type { RepairLog, NewRepairLog } from "../types/repairLog";

export function useRepairLogs() {
    const [logs, setLogs] = useState<RepairLog[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchLogsForAsset = useCallback(async (assetMongoId: string) => {
        setLoading(true);
        try {
            const data = await getRepairLogsByAsset(assetMongoId);
            setLogs(data);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleCreate = async (data: NewRepairLog) => {
        try {
            const { updatedAsset } = await createRepairLog(data);
            return updatedAsset;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    // derived values for display
    const maintenanceCount = logs.length;
    const lastMaintenanceDate = logs[0]?.repairDate ?? null; // logs sorted desc by repairDate

    return { logs, loading, error, fetchLogsForAsset, handleCreate, maintenanceCount, lastMaintenanceDate };
}