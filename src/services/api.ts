import axios from 'axios';
import { auth } from '@/firebaseConfig';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken(false); // Use cached token

      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error attaching auth token:', error);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.warn(`401 Unauthorized. Refreshing token...`);
      
      originalRequest._retry = true;
      
      try {
        const user = auth.currentUser;
        if (user) {
          const newToken = await user.getIdToken(true); // Force refresh

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ---------- API HELPERS ----------
export const verifyStudent = async () => (await api.post('/auth/verify-student')).data;
export const verifyStaff = async () => (await api.post('/auth/verify-staff')).data;
export const getUserMenu = async () => (await api.get('/user/menu')).data;

export const createPaymentOrder = async (stallId: string, items: any[]) =>
  (await api.post('/user/order/create', { stall_id: stallId, items })).data;

export const verifyOrder = async (data: any) =>
  (await api.post('/user/order/verify', data)).data;

export const getStaffMenu = async () => {
  const response = await api.get('/staff/menu');
  return response.data;
};

export const deleteMenuItem = async (itemId: string) => {
  const response = await api.delete(`/staff/menu/${itemId}`);
  return response.data;
};

export const getStaffOrders = async (status: string) => {
  const response = await api.get(`/staff/orders?status=${status}`);
  return response.data; 
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const response = await api.patch(`/staff/orders/${orderId}/status`, { status });
  return response.data;
};


export const verifyPickup = async (orderId: string, pickupCode: string) =>
  (await api.post('/staff/orders/verify-pickup', {
    order_id: orderId,
    pickup_code: pickupCode
  })).data;
