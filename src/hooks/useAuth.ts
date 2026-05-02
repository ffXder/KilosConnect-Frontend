import { getToken, getRole, getUser } from '../services/authService';
 
export function useAuth() {
  const token = getToken();
  const role = getRole();
  const user = getUser();
 
  return {
    isLoggedIn: !!token,
    role,
    user,
  };
}
