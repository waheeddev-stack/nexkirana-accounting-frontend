import axios from 'axios';

// Get API base URL from environment or default to local
const getApiBaseUrl = () => {
  // Force production backend URL for now to fix 405 error
  const isProduction = import.meta.env.PROD || window.location.hostname !== 'localhost';
  
  if (isProduction) {
    // Always use Render.com backend in production
    const productionApiUrl = 'https://nexkirana-accounting-backend.onrender.com/api';
    console.log('Production mode: using', productionApiUrl);
    return productionApiUrl;
  }
  
  // Check for environment variable in development
  if (import.meta.env.VITE_API_URL) {
    console.log('Using VITE_API_URL:', import.meta.env.VITE_API_URL);
    return import.meta.env.VITE_API_URL;
  }
  
  // Development fallback
  console.log('Development mode: using local API');
  return 'http://localhost:3000/api';
};

// Log the base URL for debugging
const baseURL = getApiBaseUrl();
console.log('🔧 API Configuration Debug:');
console.log('- Base URL:', baseURL);
console.log('- Environment:', import.meta.env.MODE);
console.log('- Is Production:', import.meta.env.PROD);
console.log('- Hostname:', window.location.hostname);
console.log('- VITE_API_URL:', import.meta.env.VITE_API_URL || 'Not set');

// Create axios instance with base configuration
const api = axios.create({
  baseURL: baseURL,
  timeout: 30000, // Increased timeout for Vercel cold starts
});

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