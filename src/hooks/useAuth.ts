import { useState, useEffect } from 'react';
import { getRole, getUser } from '../services/authService';

export function useAuth() {
  const [auth, setAuth] = useState({
    role: getRole(),
    user: getUser()
  });

  useEffect(() => {
    setAuth({
      role: getRole(),
      user: getUser()
    });
  }, []);

  const user = auth.user;

  return {
    isLoggedIn: !!auth.role && !!auth.user,
    role: auth.role,
    user,
    userId: user?.id ?? user?.sub ?? null, // cover both shapes
  };
}