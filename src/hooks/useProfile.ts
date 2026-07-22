import { useState, useEffect, useCallback } from "react";
import { getMyProfile, updateMyProfile, updateProfileImage } from "../services/profileService";
import { useAuth } from "./useAuth";
import type { UserAccount } from "../types/manageAccount";

// Fallback mock profile for when backend is unavailable
const mockProfile: UserAccount = {
  userId: "mock-user-id",
  initials: "JC",
  username: "juan.cruz",
  firstName: "Juan",
  lastName: "Cruz",
  email: "juan.cruz@kilos.ph",
  phoneNumber: "+63 912 345 6789",
  role: "admin",
  isArchived: false,
  archivedBy: null,
  archivedAt: null,
  dateAdded: "2024-06-15",
  createdAt: "2024-06-15T00:00:00.000Z",
  profileImage: null,
};

/**
 * Wraps a promise with a timeout so it doesn't hang indefinitely.
 */
const withTimeout = <T,>(promise: Promise<T>, ms: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), ms)
    ),
  ]);
};

export function useProfile() {
  const { userId: authUserId } = useAuth();
  const userId = authUserId || null;
  const [profile, setProfile] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchProfile = useCallback(async () => {
    // Immediately show mock data so UI renders right away
    setProfile(mockProfile);
    setLoading(false);

    // Attempt real API call in background with timeout
    if (userId) {
      try {
        const data = await withTimeout(getMyProfile(userId), 3000);
        if (data) {
          setProfile(data);
        }
      } catch (err: any) {
        // Keep mock data - backend unavailable
        console.warn("Profile API unavailable, using mock data:", err.message);
      }
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
      await fetchProfile();
    } catch (err: any) {
      // Optimistically update local state when backend unavailable
      setProfile((prev) => prev ? { ...prev, ...updated } : prev);
      console.warn("Profile update API unavailable, updated locally:", err.message);
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
      console.warn("Profile avatar update unavailable:", err.message);
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
