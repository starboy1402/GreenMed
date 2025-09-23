import axios from 'axios';

// API base configuration
const API_BASE_URL = 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    console.log('Auth Token present:', !!token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Authorization header set');
    } else {
      console.log('No auth token found');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API endpoint functions
export const plantApi = {
  getAll: () => api.get('/plants'),
  create: (data: any) => api.post('/plants', data),
  getByFilters: (params: any) => api.get('/plants', { params }),
};

export const diseaseApi = {
  getAll: () => api.get('/diseases'),
  create: (data: any) => api.post('/diseases', data),
  search: (plantId?: string, symptom?: string) =>
    api.get('/diseases/search', { params: { plant_id: plantId, symptom } }),
};

export const medicineApi = {
  getAll: () => api.get('/medicines'),
  create: (data: any) => api.post('/medicines', data),
};

export const sellerApi = {
  getPending: () => api.get('/admin/sellers/pending'),
  approve: (sellerId: string) => api.put(`/admin/sellers/${sellerId}/approve`),
  reject: (sellerId: string) => api.put(`/admin/sellers/${sellerId}/reject`),
  getAll: () => api.get('/admin/sellers'),
  updateActiveStatus: (sellerId: string, isActive: boolean) => api.put(`/admin/sellers/${sellerId}/status?isActive=${isActive}`),
};

export const adminApi = {
  getProfile: (adminId: string) => api.get(`/admin/${adminId}`),
  updateProfile: (adminId: string, data: any) => api.put(`/admin/${adminId}`, data),
};

export const inventoryApi = {
  getBySeller: () => api.get('/inventory'),
  getBySellerId: (sellerId: string) => api.get(`/inventory/seller/${sellerId}`),
  create: (data: any) => api.post('/inventory', data),
  update: (inventoryId: string, data: any) => api.put(`/inventory/${inventoryId}`, data),
};

export const orderApi = {
  create: (orderData: { sellerId: string; items: { inventoryItemId: string; quantity: number }[] }) =>
    api.post('/orders', orderData),
  getByCustomer: () => api.get('/orders/customer'),
  getBySeller: () => api.get('/orders/seller'),
  getDetails: (orderId: string) => api.get(`/orderdetails/${orderId}`),
  getAllOrders: () => api.get('/admin/orders'),
  updateStatus: (orderId: number, status: string) => api.put(`/orders/${orderId}/status?status=${status}`),
};

// Add the new paymentApi object
export const paymentApi = {
  processPayment: (orderId: number, paymentData: { paymentMethod: string; transactionId: string }) =>
    api.post(`/payment/order/${orderId}`, paymentData),
};

// Add the new dashboardApi
export const dashboardApi = {
  getAdminStats: () => api.get('/dashboard/admin-stats'),
  getSellerStats: () => api.get('/dashboard/seller-stats'), // Add this new function
  getPublicStats: () => api.get('/dashboard/public-stats'),
};

// Add the new reviewApi
export const reviewApi = {
  getSellerRating: (sellerId: string) => api.get(`/reviews/seller/${sellerId}/rating`),
  getReviewsBySeller: (sellerId: string) => api.get(`/reviews/seller/${sellerId}`),
};

export default api;

