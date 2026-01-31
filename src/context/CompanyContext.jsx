import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CompanyContext = createContext();

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};

export const CompanyProvider = ({ children }) => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, loading: authLoading } = useAuth();

  const fetchCompanies = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const response = await axios.get('/api/companies');
      setCompanies(response.data);
      if (response.data.length > 0 && !selectedCompany) {
        setSelectedCompany(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
      // If unauthorized, clear companies
      if (error.response?.status === 401) {
        setCompanies([]);
        setSelectedCompany(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch companies when authentication is complete and user is authenticated
    if (!authLoading && isAuthenticated) {
      fetchCompanies();
    } else if (!authLoading && !isAuthenticated) {
      // Clear companies when not authenticated
      setCompanies([]);
      setSelectedCompany(null);
    }
  }, [isAuthenticated, authLoading]);

  const value = {
    companies,
    selectedCompany,
    setSelectedCompany,
    fetchCompanies,
    loading
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
};