import axios from 'axios';

// PRODUCTION: Dynamic backend URL with multiple fallbacks
const getBackendUrl = () => {
  // Production backend URLs (try multiple)
  const productionUrls = [
    'https://nexkirana-accounting-backend.onrender.com/api',
    'https://nexkirana-accounting-backend.vercel.app/api'
  ];
  
  // Check if we're in development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3000/api';
  }
  
  // For production, use primary backend URL
  return productionUrls[0];
};

const BACKEND_URL = getBackendUrl();

console.log('🔧 PRODUCTION API Configuration:');
console.log('- Current hostname:', window.location.hostname);
console.log('- Backend URL:', BACKEND_URL);
console.log('- Environment:', window.location.hostname.includes('localhost') ? 'Development' : 'Production');

// Create axios instance with production-ready configuration
const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  // Production: Disable credentials for CORS compatibility
  withCredentials: false
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

// Response interceptor with production error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject(error);
    }
    
    // Production: Retry failed requests once
    if (!originalRequest._retry && error.response?.status >= 500) {
      originalRequest._retry = true;
      
      try {
        // Wait 1 second and retry
        await new Promise(resolve => setTimeout(resolve, 1000));
        return api(originalRequest);
      } catch (retryError) {
        console.log('Retry failed:', retryError.message);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;