// services/api.ts
import axios from 'axios';
import { auth } from '@/firebaseConfig';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor (Attaches Token)
api.interceptors.request.use(async (config) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error getting auth token:', error);
  }
  return config;
});

export default api;

// --- EXISTING ENDPOINTS ---
export const verifyStudent = async () => (await api.post('/auth/verify-student')).data;
export const verifyStaff = async () => (await api.post('/auth/verify-staff')).data;
export const getUserMenu = async () => (await api.get('/user/menu')).data;
export const createPaymentOrder = async (stallId: string, items: any[]) => 
  (await api.post('/user/order/create', { stall_id: stallId, items })).data;
export const verifyOrder = async (data: any) => (await api.post('/user/order/verify', data)).data;

// --- NEW STAFF ENDPOINTS ---

// 1. Get Staff Menu
export const getStaffMenu = async () => {
  const response = await api.get('/staff/menu');
  return response.data;
};

// 2. Delete Menu Item
export const deleteMenuItem = async (itemId: string) => {
  const response = await api.delete(`/staff/menu/${itemId}`);
  return response.data;
};

// 3. Get Orders by Status (e.g., "PAID" or "READY")
export const getStaffOrders = async (status: string) => {
  const response = await api.get(`/staff/orders?status=${status}`);
  return response.data; 
};

// 4. Update Order Status (e.g., PAID -> READY)
export const updateOrderStatus = async (orderId: string, status: string) => {
  const response = await api.patch(`/staff/orders/${orderId}/status`, { status });
  return response.data;
};

// 5. Verify Pickup Code (READY -> CLAIMED)
export const verifyPickup = async (orderId: string, pickupCode: string) => {
  const response = await api.post('/staff/orders/verify-pickup', {
    order_id: orderId,
    pickup_code: pickupCode
  });
  return response.data;
};