import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  getUser: (id) => api.get(`/auth/users/${id}`),
};

export const donationAPI = {
  create: (data) => api.post('/donations', data),
  getAll: (params) => api.get('/donations', { params }),
  getById: (id) => api.get(`/donations/${id}`),
  update: (id, data) => api.put(`/donations/${id}`, data),
  cancel: (id, reason) => api.patch(`/donations/${id}/cancel`, { reason }),
  getStats: () => api.get('/donations/stats'),
};

export const claimAPI = {
  create: (donationId, data) => api.post(`/claims/${donationId}`, data),
  getAll: (params) => api.get('/claims', { params }),
  getById: (id) => api.get(`/claims/${id}`),
  schedule: (id, data) => api.put(`/claims/${id}/schedule`, data),
  verifyPickup: (id, qrData) => api.post(`/claims/${id}/verify-pickup`, { qrData }),
  cancel: (id, reason) => api.patch(`/claims/${id}/cancel`, { reason }),
};

export const volunteerAPI = {
  getTasks: (params) => api.get('/volunteer', { params }),
  accept: (id) => api.post(`/volunteer/${id}/accept`),
  updateStatus: (id, status) => api.patch(`/volunteer/${id}/status`, { status }),
  verifyDelivery: (id, qrData) => api.post(`/volunteer/${id}/verify-delivery`, { qrData }),
  getStats: () => api.get('/volunteer/stats'),
};

export const notificationAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
};

export const reviewAPI = {
  create: (data) => api.post('/reviews', data),
  getAll: (params) => api.get('/reviews', { params }),
  getById: (id) => api.get(`/reviews/${id}`),
};

export const certificateAPI = {
  generate: (type) => api.post('/certificates/generate', { type }),
  getAll: (params) => api.get('/certificates', { params }),
  getById: (id) => api.get(`/certificates/${id}`),
};

export const emergencyAPI = {
  create: (data) => api.post('/emergency', data),
  getAll: (params) => api.get('/emergency', { params }),
  getById: (id) => api.get(`/emergency/${id}`),
  respond: (id, data) => api.post(`/emergency/${id}/respond`, data),
  updateStatus: (id, status) => api.patch(`/emergency/${id}/status`, { status }),
  cancel: (id) => api.delete(`/emergency/${id}`),
};

export const complaintAPI = {
  create: (data) => api.post('/complaints', data),
  getAll: (params) => api.get('/complaints', { params }),
  getById: (id) => api.get(`/complaints/${id}`),
  update: (id, data) => api.patch(`/complaints/${id}`, data),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getPendingNgos: () => api.get('/admin/ngos/pending'),
  verifyNgo: (id, data) => api.patch(`/admin/ngos/${id}/verify`, data),
  getDonations: (params) => api.get('/admin/donations', { params }),
};

export const analyticsAPI = {
  get: () => api.get('/analytics'),
  getPublic: () => api.get('/analytics/public'),
};

export default api;
