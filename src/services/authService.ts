const API_URL = 'http://localhost:5000/api';
 
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
 
  return data;
}
 
export function logOut() {
  localStorage.removeItem('role');
  localStorage.removeItem('user');
}
 
export function getToken() {
  return localStorage.getItem('role');
}
 
export function getRole() {
  return localStorage.getItem('role') as 'admin' | 'custodian' | null;
}
 
export function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}