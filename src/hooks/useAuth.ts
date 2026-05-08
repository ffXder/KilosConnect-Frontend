import { useState, useEffect } from 'react';
import { getRole, getUser } from '../services/authService';

export function useAuth() {
  const [auth, setAuth] = useState({
    role: getRole(),
    user: getUser()
  });

  // the user info changes the UI follows
  useEffect(() => {
    setAuth({
      role: getRole(),
      user: getUser()
    });
  }, []);

  return {
    isLoggedIn: !!auth.role && !!auth.user,
    role: auth.role,
    user: auth.user,
  };
}