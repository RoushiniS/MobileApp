import { API_BASE_URL } from '../config/apiConfig';
import { auth } from '../../firebaseConfig';

export async function fetchData(endpoint: string, options?: RequestInit) {
  const user = auth.currentUser;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (user) {
    const token = await user.getIdToken();
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...(options?.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}