import { useState, useEffect, useCallback } from 'react';
import { getArchivedReports, unarchiveReport } from '../../services/incidentService';
import type { IncidentReport } from '../../types/incident';

export function useArchivedIncidents() {
  const [archivedIncidents, setArchivedIncidents] = useState<IncidentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArchivedIncidents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getArchivedReports();
      setArchivedIncidents(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArchivedIncidents();
  }, [fetchArchivedIncidents]);

  const handleUnarchive = async (id: string) => {
    try {
      await unarchiveReport(id);
      await fetchArchivedIncidents();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return { archivedIncidents, loading, error, refresh: fetchArchivedIncidents, handleUnarchive };
}