// ============================================================
// utils/api.js — Axios instance with auth interceptors
// ============================================================
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://whatnextbackend.vercel.app/api',
  timeout: 15000,
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally (auto-logout)
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.hash = '/';
    }
    return Promise.reject(err);
  }
);

// ── Auth ─────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  me: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
  changePassword: (data) => API.put('/auth/change-password', data),
  forgotPassword: (email) => API.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => API.post(`/auth/reset-password/${token}`, { password }),
};

// ── Courses ──────────────────────────────────────────────────
export const courseAPI = {
  getAll: (params) => API.get('/courses', { params }),
  getOne: (id) => API.get(`/courses/${id}`),
  create: (data) => API.post('/courses', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => API.put(`/courses/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => API.delete(`/courses/${id}`),
  togglePublish: (id) => API.patch(`/courses/${id}/publish`),
  getAllAdmin: () => API.get('/courses/admin/all'),
  updateProgress: (id, videoId, data) => API.post(`/courses/${id}/progress`, { videoId, ...data }),
  addVideoUrl: (id, data) => API.post(`/courses/${id}/videos/url`, data),
  deleteVideo: (courseId, videoId) => API.delete(`/courses/${courseId}/videos/${videoId}`),
};

// ── Live Classes ─────────────────────────────────────────────
export const liveAPI = {
  getAll: (params) => API.get('/live-classes', { params }),
  getOne: (id) => API.get(`/live-classes/${id}`),
  register: (id) => API.post(`/live-classes/${id}/register`),
  create: (data) => API.post('/live-classes', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => API.put(`/live-classes/${id}`, data),
  delete: (id) => API.delete(`/live-classes/${id}`),
  updateStatus: (id, status) => API.patch(`/live-classes/${id}/status`, { status }),
  setMeetingUrl: (id, data) => API.patch(`/live-classes/${id}/meeting-url`, data),
  sendUrl: (id) => API.post(`/live-classes/${id}/send-url`),
  getRegistrants: (id) => API.get(`/live-classes/${id}/registrants`),
  getAllAdmin: () => API.get('/live-classes/admin/all'),
};

// ── Notes ────────────────────────────────────────────────────
export const notesAPI = {
  getAll: (params) => API.get('/notes', { params }),
  getOne: (id) => API.get(`/notes/${id}`),
  download: (id) => API.get(`/notes/${id}/download`),
  create: (data) => API.post('/notes', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => API.put(`/notes/${id}`, data),
  delete: (id) => API.delete(`/notes/${id}`),
  togglePublish: (id) => API.patch(`/notes/${id}/toggle-publish`),
  getAllAdmin: () => API.get('/notes/admin/all'),
};

// ── Payments ─────────────────────────────────────────────────
export const paymentAPI = {
  createOrder: (data) => API.post('/payments/create-order', data),
  verify: (data) => API.post('/payments/verify', data),
  getMyPayments: () => API.get('/payments/my'),
  getAllAdmin: () => API.get('/payments/admin/all'),
};

// ── Admin ────────────────────────────────────────────────────
export const adminAPI = {
  getStats: () => API.get('/admin/stats'),
  getUsers: () => API.get('/admin/users'),
  getRevenue: () => API.get('/admin/revenue'),
  toggleUser: (id) => API.patch(`/admin/users/${id}/status`),
  changeRole: (id, role) => API.patch(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
};

export default API;
