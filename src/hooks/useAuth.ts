import { useState, useEffect } from 'react';
import { getRole, getUser, getPermissions, subscribeAuth, refreshAccessToken } from '../services/authService';
import { socket } from '../config/socket';

export function useAuth() {
  const [auth, setAuth] = useState(() => ({
    role: getRole(),
    user: getUser(),
    permissions: getPermissions()
  }));

  const user = auth.user;
  const userId = user?._id ?? user?.id ?? null;

  useEffect(() => {
    // Sync state when in memory auth state changes
    const syncAuth = () => {
      setAuth({
        role: getRole(),
        user: getUser(),
        permissions: getPermissions()
      });
    };

    syncAuth();

    const unsubscribe = subscribeAuth(syncAuth);

    if (userId && !socket.connected) {
      socket.connect();
    }

    const handlePermissionUpdated = async (data: { userId: string }) => {
      if (userId && data.userId === userId) {
        try {
          console.log("WebSocket: Permissions updated. Fetching fresh token...");
          await refreshAccessToken();
        } catch (err) {
          console.error("Failed to refresh token on socket event:", err);
        }
      }
    }

    socket.on('permissions_updated', handlePermissionUpdated);

    return () => {
      unsubscribe();
      socket.off('permissions_updated', handlePermissionUpdated);
    }
  }, [userId]);


  return {
    isLoggedIn: !!auth.role && !!auth.user,
    role: auth.role,
    permissions: auth.permissions,
    user,
    userId
  };
}