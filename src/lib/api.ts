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
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
  // We'll add this for future filtering functionality
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
};

export const adminApi = {
  getProfile: (adminId: string) => api.get(`/admin/${adminId}`),
  updateProfile: (adminId: string, data: any) => api.put(`/admin/${adminId}`, data),
};

export const inventoryApi = {
  getBySeller: () => api.get('/inventory'),
  create: (data: any) => api.post('/inventory', data),
  update: (inventoryId: string, data: any) => api.put(`/inventory/${inventoryId}`, data),
};

export const sellsApi = {
  create: (data: any) => api.post('/sells', data),
};

export const orderApi = {
  create: (orderData: { sellerId: string; items: { inventoryItemId: string; quantity: number }[] }) => 
    api.post('/orders', orderData),
  getByCustomer: () => api.get('/orders/customer'), // Updated to not require customerId
  getBySeller: () => api.get('/orders/seller'), // Updated to not require sellerId
  getDetails: (orderId: string) => api.get(`/orderdetails/${orderId}`),
};

export default api;