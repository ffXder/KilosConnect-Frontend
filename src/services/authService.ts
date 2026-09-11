const API_URL = '/api';

type AuthListener = () => void;
const listeners: Set<AuthListener> = new Set();
let accessToken: string | null = null;
let currentUser: any = null;

export function subscribeAuth(listener: AuthListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function notifyAuthChange() {
  listeners.forEach((listener) => listener());
}

export function setAccessToken(token: string | null) { //setters
  accessToken = token;
  notifyAuthChange();
}

export function getAccessToken(): string | null { //getters
  return accessToken
}
export function parseJwt(token: string | null) {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null; // returns null if invalid

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
    );
    
    const decoded = JSON.parse(jsonPayload);

    // checks if token is expired
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return null; 
    }

    return decoded;
  } catch (e) {
    return null;
  }
}

export function getRole(): 'admin' | 'custodian' | null {
  if (!accessToken) return null;
  const decoded = parseJwt(accessToken);
  return decoded?.role || null;
}
 
export function getUser() { 
  if (currentUser) return currentUser;
  if (!accessToken) return null;
  return parseJwt(accessToken);
}

//login
export async function login(username: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, password })
  });
 
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Login failed');
  }
 
  const data = await res.json();

  if (data.mustChangePassword) return data;
  
  if (data.accessToken) {
    setAccessToken(data.accessToken)
  }

  if (data.user) {
    currentUser = data.user;
  }
 
  return data;
};

 // complete temporary password setup
export async function completeAccountSetup(setupToken: string, newPassword: string) {
  const res = await fetch(`${API_URL}/auth/complete-account-setup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ setupToken, newPassword })
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to complete setup');
  }

  return await res.json();
}

export async function logOut() {
  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch(err) {
    console.error('Logout error:', err)
  } finally {
    sessionStorage.setItem('justLoggedOut', 'true');
    
    setAccessToken(null);
    currentUser = null;
    notifyAuthChange();
    localStorage.clear()
    sessionStorage.clear()
    window.location.href = '/login'
  }
};

export const refreshAccessToken = async () => {
  const res = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
  });

  if (!res.ok) {
    setAccessToken(null);
    currentUser = null;
    throw new Error('Refresh failed'); 
  }
    
  const data = await res.json();

  if (data.accessToken) {
    if (data.user) {
      currentUser = data.user;
    } else {
      currentUser = parseJwt(data.accessToken);
    }
    
    setAccessToken(data.accessToken);
  }
    
  return data; 
};

// api interceptir
export async function apiRequest(endpoint: string, options: any = {}) {
  let token = getAccessToken();

  const headers = {
    'Authorization' : `Bearer ${token}`,
    ...options.headers,
  };

  // If body is FormData leave it empty so the browser sets it automatically
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  let res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include'
  });

  if (res.status === 401 || res.status === 403) {
    try {
      const data = await refreshAccessToken();
      const newToken = data.accessToken;

      if (!newToken) throw new Error('No new token received');

      headers['Authorization'] = `Bearer ${newToken}`;
      
      res = await fetch(`${API_URL}${endpoint}`, { 
        ...options, 
        headers, 
        credentials: 'include' 
      });
    } catch (err) {
      console.error("Session dead, logging out...", err);
      logOut(); // this logouts if the session is dead
      return Promise.reject(err);
    }
  }

  return res
};
