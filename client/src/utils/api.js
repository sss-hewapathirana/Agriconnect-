import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach Clerk token to every request
let getToken = null;
export const setTokenGetter = (fn) => { getToken = fn; };

api.interceptors.request.use(async (config) => {
  if (getToken) {
    try {
      const token = await getToken();
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch (e) { /* silent */ }
  }
  return config;
});

// ─── General / Public ────────────────────────────────────────────────────────
export const getFarmersFeed = () => api.get('/api/users/farmers');
export const getProductsFeed = (params) => api.get('/api/products', { params });
export const searchProducts = (query) => api.get('/api/products', { params: { q: query } });

// ─── User & Onboarding ───────────────────────────────────────────────────────
export const onboardUser = (data) => api.post('/api/users', data);
export const getMyProfile = () => api.get('/api/users/me');
export const updateMyProfile = (data) => api.patch('/api/users/me', data);

// ─── Products (Farmer) ───────────────────────────────────────────────────────
export const createProduct = (data) => api.post('/api/products', data);
export const updateProduct = (id, data) => api.patch(`/api/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/api/products/${id}`);
export const getMyProducts = () => api.get('/api/products/mine');

// ─── Orders ──────────────────────────────────────────────────────────────────
export const placeOrder = (data) => api.post('/api/orders', data);
export const getMyOrders = () => api.get('/api/orders/mine');
export const updateOrderStatus = (orderId, status) =>
  api.patch(`/api/orders/${orderId}/status`, { status });

// ─── Reviews ─────────────────────────────────────────────────────────────────
export const submitReview = (data) => api.post('/api/reviews', data);
export const getFarmerReviews = (farmerId) =>
  api.get(`/api/users/farmers/${farmerId}/reviews`);

// ─── Farmer Profile ──────────────────────────────────────────────────────────
export const getFarmerProfile = (farmerId) =>
  api.get(`/api/users/farmers/${farmerId}`);

export default api;
