import axios from 'axios';

// Dynamic backend URL configuration for different environments
const getBackendUrl = () => {
  // Check if we're in development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3000/api';
  }
  
  // For production, use your Render backend URL
  // Update this with your actual Render backend URL
  return 'https://nexkirana-accounting-backend.onrender.com/api';
};

const BACKEND_URL = getBackendUrl();

console.log('🔧 Dynamic API Configuration:');
console.log('- Current hostname:', window.location.hostname);
console.log('- Backend URL:', BACKEND_URL);
console.log('- Environment:', window.location.hostname.includes('localhost') ? 'Development' : 'Production');

// Create axios instance with dynamic backend URL
const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
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