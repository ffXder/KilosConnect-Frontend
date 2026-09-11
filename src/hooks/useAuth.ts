import { useState, useEffect } from 'react';
import { getRole, getUser, subscribeAuth } from '../services/authService';

export function useAuth() {
  const [auth, setAuth] = useState(() => ({
    role: getRole(),
    user: getUser()
  }));

  useEffect(() => {
    // Sync state when in memory auth state changes
    const syncAuth = () => {
      setAuth({
        role: getRole(),
        user: getUser()
      });
    };

    syncAuth();

    const unsubscribe = subscribeAuth(syncAuth);
    return () => unsubscribe();
  }, []);

  const user = auth.user;

  return {
    isLoggedIn: !!auth.role && !!auth.user,
    role: auth.role,
    user,
    userId: user?._id ?? user?.userId ?? user?.id ?? null,
  };
}