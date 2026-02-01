import axios from 'axios';

// HARDCODED BACKEND URL - CANNOT FAIL
const BACKEND_URL = 'https://nexkirana-accounting-backend.onrender.com/api';

console.log('🔧 HARDCODED API Configuration:');
console.log('- Backend URL:', BACKEND_URL);
console.log('- This CANNOT call frontend domain');
console.log('- Bypassing all environment variable issues');

// Create axios instance with hardcoded backend URL
const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 30000,
});

console.log('✅ API instance created with backend URL:', api.defaults.baseURL);

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;