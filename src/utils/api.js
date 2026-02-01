import axios from 'axios';

// Get API base URL from environment or default to local
const getApiBaseUrl = () => {
  // Check for environment variable first
  if (import.meta.env.VITE_API_URL) {
    console.log('Using VITE_API_URL:', import.meta.env.VITE_API_URL);
    return import.meta.env.VITE_API_URL;
  }
  
  // Development mode - use local backend
  if (import.meta.env.DEV) {
    console.log('Development mode: using local API');
    return 'http://localhost:3000/api';
  }
  
  // Production fallback - use Render.com backend
  const productionApiUrl = 'https://nexkirana-accounting-backend.onrender.com/api';
  console.log('Production fallback: using', productionApiUrl);
  return productionApiUrl;
};

// Create axios instance with base configuration
const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 30000, // Increased timeout for Vercel cold starts
});

// Log the base URL for debugging
console.log('API Base URL configured:', api.defaults.baseURL);

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