import axios from 'axios';

// PRODUCTION: Dynamic backend URL with multiple fallbacks
const getBackendUrl = () => {
  // Production backend URLs (without /api suffix to avoid double prefix)
  const productionUrls = [
    'https://nexkirana-accounting-backend.onrender.com',
    'https://nexkirana-accounting-backend.vercel.app'
  ];
  
  // Check if we're in development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3000';
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
  baseURL: `${BACKEND_URL}/api`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  // Production: Disable credentials for CORS compatibility
  withCredentials: false
});

console.log('✅ API instance created with backend URL:', api.defaults.baseURL);

// Request interceptor to add auth token and debug logging
api.interceptors.request.use(
  (config) => {
    console.log('🚀 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      data: config.data,
      headers: config.headers
    });
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with production error handling
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  async (error) => {
    console.error('❌ API Response Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message
    });
    
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