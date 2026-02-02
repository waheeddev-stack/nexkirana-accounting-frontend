import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api'; // Use the configured API instance

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [sessionExpiry, setSessionExpiry] = useState(null);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
      
      // Set up session timeout warning
      const expiryTime = localStorage.getItem('tokenExpiry');
      if (expiryTime) {
        setSessionExpiry(new Date(expiryTime));
        setupSessionTimeout(new Date(expiryTime));
      }
    } else {
      setLoading(false);
    }
  }, [token]);

  const setupSessionTimeout = (expiryTime) => {
    const now = new Date();
    const timeUntilExpiry = expiryTime.getTime() - now.getTime();
    const warningTime = timeUntilExpiry - (5 * 60 * 1000); // 5 minutes before expiry

    if (warningTime > 0) {
      setTimeout(() => {
        if (user) {
          alert('Your session will expire in 5 minutes. Please save your work.');
        }
      }, warningTime);
    }

    if (timeUntilExpiry > 0) {
      setTimeout(() => {
        if (user) {
          alert('Your session has expired. You will be logged out.');
          logout();
        }
      }, timeUntilExpiry);
    }
  };

  // Add api interceptor to handle 401 responses
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && user) {
          alert('Your session has expired. Please log in again.');
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [user]);

  const fetchUser = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user, expiresIn } = response.data;
      
      // Calculate expiry time
      const expiryTime = new Date();
      const hoursToAdd = parseInt(expiresIn.replace('h', ''));
      expiryTime.setHours(expiryTime.getHours() + hoursToAdd);
      
      localStorage.setItem('token', token);
      localStorage.setItem('tokenExpiry', expiryTime.toISOString());
      setToken(token);
      setUser({ ...user, expiresIn });
      setSessionExpiry(expiryTime);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setupSessionTimeout(expiryTime);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
    setToken(null);
    setUser(null);
    setSessionExpiry(null);
    delete api.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    sessionExpiry,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};