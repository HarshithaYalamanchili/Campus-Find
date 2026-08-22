import axios from 'axios';

// Base API URL (falls back to relative path for Vite proxy / production)
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL ? `${API_BASE_URL}/api` : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('campusfind_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Unauthorized / Expired Token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired, clear localStorage
      const originalRequest = error.config;
      if (
        !originalRequest.url.includes('/auth/login') &&
        !originalRequest.url.includes('/auth/register')
      ) {
        localStorage.removeItem('campusfind_token');
        localStorage.removeItem('campusfind_user');
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

export const itemAPI = {
  getItems: (params) => api.get('/items', { params }),
  getItemById: (id) => api.get(`/items/${id}`),
  createItem: (formData) =>
    api.post('/items', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateItem: (id, formData) =>
    api.put(`/items/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteItem: (id) => api.delete(`/items/${id}`),
  markResolved: (id, data) => api.patch(`/items/${id}/status`, data),
  getMyItems: () => api.get('/items/user/me'),
  getRecentItems: () => api.get('/items/feed/recent'),
};

export const matchAPI = {
  getItemMatches: (itemId) => api.get(`/matches/${itemId}`),
  getUserDashboardMatches: () => api.get('/matches/user/dashboard'),
  compareTwoItems: (itemAId, itemBId) =>
    api.post('/matches/compare', { itemAId, itemBId }),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getCampusStats: () => api.get('/users/stats/campus'),
  submitClaim: (data) => api.post('/users/claims', data),
};

export default api;
