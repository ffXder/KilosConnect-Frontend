import { useState, useEffect } from 'react';
import { getRole, getUser } from '../services/authService';
 
export function useAuth() {
  const role = getRole();
  const user = getUser();
 
  return {
    isLoggedIn: !!role && !!user,
    role,
    user,
  };
}