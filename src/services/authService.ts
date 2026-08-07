const API_URL = '/api';

export function parseJwt(token: string | null) {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function getRole(): 'admin' | 'custodian' | null {
  const token = localStorage.getItem('token');
  const decoded = parseJwt(token);
  return decoded?.role || null;
}
 
export function getUser() {
  const user = localStorage.getItem('user');
  if (user) {
    try {
      return JSON.parse(user);
    } catch (e) {
      return null; // if parsing fails
    }
  }
  const token = localStorage.getItem('token');
  return parseJwt(token);
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
  localStorage.setItem('role', data.user.role);  
  localStorage.setItem('user', JSON.stringify(data.user));
  localStorage.setItem('token', data.token)
 
  return data;
};
 
export function logOut() {
  localStorage.clear();
  window.location.href = '/login';
};

export const refreshAccessToken = async () => {
    const res = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok) throw new Error('Refresh failed');
    return data; 
};

// api interceptir
export async function apiRequest(endpoint: string, options: any = {}) {
  let token = localStorage.getItem('token');

  const headers = {
    'Authorization' : `Bearer ${token}`,
    ...options.headers,
  };

  // If body is FormData, we leave it empty so the browser sets it automatically
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
      const newToken = data.accessToken || data.token;

      if (!newToken) throw new Error('No new token received');

      localStorage.setItem('token', newToken);

      headers['Authorization'] = `Bearer ${data.newToken}`;
      
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
