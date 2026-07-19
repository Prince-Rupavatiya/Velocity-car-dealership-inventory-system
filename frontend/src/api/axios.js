import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://velocity-7aeb.onrender.com/api',
  timeout: 15000, // 15s timeout — Render free tier can cold-start slowly
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach the JWT (if present) to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

// Auto-logout on 401 so stale/expired tokens don't linger
api.interceptors.response.use(
  (response) => {
    console.log(`[API] Response ${response.status}:`, response.data);
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error(`[API] Error ${error.response.status}:`, error.response.data);
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } else if (error.request) {
      // Request was sent but no response received (network error / timeout)
      console.error('[API] No response received:', error.message);
      error.message = 'Server is not responding. It may be starting up — please try again in a moment.';
    } else {
      console.error('[API] Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;

