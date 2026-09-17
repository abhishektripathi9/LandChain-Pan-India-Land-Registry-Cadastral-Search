/**
 * REST API Client for LandChain Express Backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('landchain_auth_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    // If backend is offline during frontend-only demo, catch gracefully
    console.warn(`[API Client] ${endpoint} request notice:`, err.message);
    return null;
  }
}

export const apiService = {
  // Lands
  getAllLands: () => request('/lands'),
  getLandById: (id) => request(`/lands/${id}`),
  createLand: (data) => request('/lands', { method: 'POST', body: JSON.stringify(data) }),
  updateLandStatus: (id, status, reason) => request(`/lands/${id}/status`, { method: 'PUT', body: JSON.stringify({ status, reason }) }),
  getLandHistory: (id) => request(`/lands/${id}/history`),

  // Users & Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getProfile: () => request('/auth/profile'),

  // IPFS Relay via Backend
  uploadIPFSFile: async (formData) => {
    const token = localStorage.getItem('landchain_auth_token');
    const res = await fetch(`${API_BASE_URL}/ipfs/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    return res.json();
  },
};
