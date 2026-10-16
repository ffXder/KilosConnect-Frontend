import { useState, useEffect, useCallback } from "react";
import { getMyProfile, updateMyProfile, updateProfileImage, getMyPerformance } from "../services/profileService";
import { useAuth } from "./useAuth";
import type { UserAccount } from "../types/manageAccount";
import type { MyPerformance } from "../types/profile";

const EMPTY: MyPerformance = {
  stats: { tasksCompleted: 0, incidentsReported: 0, itemsLogged: 0, activeDays: 0 },
  recentActivity: [],
};

export function useProfile() {
  const { user } = useAuth(); // get logged-in user's ID from auth context
  const userId = user?.userId || null;
  const [profile, setProfile] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await getMyProfile(userId);
      setProfile(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSaveProfile = async (
    updated: Pick<UserAccount, "firstName" | "lastName" | "email" | "phoneNumber">
  ) => {
    setSaving(true);
    try {
      await updateMyProfile(updated);
      await fetchProfile(); // Refresh after save
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateAvatar = async (imageFile: File) => {
    if (!userId) return;
    setSaving(true);
    try {
      const avatar = await updateProfileImage(userId, imageFile);
      setProfile((prev) =>
        prev ? { ...prev, profileImage: { url: avatar.url, public_id: avatar.public_id } } : prev
    );
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return {
    profile,
    loading,
    error,
    saving,
    refresh: fetchProfile,
    handleSaveProfile,
    handleUpdateAvatar,
  };
}

// for fetching recent activities and performance
export function useMyPerformance() {
  const [data, setData] = useState<MyPerformance>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setData(await getMyPerformance());
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { ...data, loading, error, reload: load };
}