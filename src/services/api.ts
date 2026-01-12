import axios from 'axios';
import { auth } from '@/firebaseConfig';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout:10000,
});

// Add interceptor to include Firebase auth token and auto attach
api.interceptors.request.use(
  async (config) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔐 Auth token added to request');
        // console.log('Token preview:', token.substring(0, 20) + '...');
        
      }
       else {
        console.warn('⚠️ No authenticated user found - request sent without token');
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//response interceptor //handles common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('❌ 401 Unauthorized - Token invalid or expired');
      // Optional: Redirect to login
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

export const verifyStudent = async () => {
  const response = await api.post('/auth/verify-student');
  return response.data;
};
export const verifyStaff = async () => {
  const response = await api.post('/auth/verify-staff');
  return response.data;
};

//Menu
export const getUserMenu = async () => {
  const response = await api.get('/user/menu');
  return response.data;
}

// Create payment order
export const createPaymentOrder = async (
  stallId: string,
  items: Array<{ item_id: string; quantity: number }>
) => {
  console.log('📤 Sending order request:', { stallId, itemCount: items.length });
  const response = await api.post('/user/order/create', {
    stall_id: stallId,
    items: items
  });
  return response.data;
};