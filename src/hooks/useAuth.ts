import { useState, useEffect } from 'react';
import { getRole, getUser } from '../services/authService';

export function useAuth() {
  const [auth, setAuth] = useState(() => ({
    role: getRole(),
    user: getUser()
  }));

  useEffect(() => {
    // Sync state when localStorage changes across tabs or custom dispatch
    const syncAuth = () => {
      setAuth({
        role: getRole(),
        user: getUser()
      });
    };

    window.addEventListener('storage', syncAuth);
    return () => window.removeEventListener('storage', syncAuth);
  }, []);

  const user = auth.user;

  return {
    isLoggedIn: !!auth.role && !!auth.user,
    role: auth.role,
    user,
    userId: user?._id ?? user?.userId ?? user?.id ?? null,
  };
}