import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, BookOpen, Receipt, BarChart3, DollarSign, Shield, Users, AlertCircle } from 'lucide-react';
import { useCompany } from '../context/CompanyContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Dashboard = () => {
  const { selectedCompany } = useCompany();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalLedgers: 0,
    totalVouchers: 0,
    todayVouchers: 0,
    totalAmount: 0
  });

  useEffect(() => {
    if (selectedCompany) {
      fetchStats();
    }
  }, [selectedCompany]);

  const fetchStats = async () => {
    try {
      const [ledgersRes, vouchersRes] = await Promise.all([
        api.get(`/ledgers?companyId=${selectedCompany._id}`),
        api.get(`/vouchers?companyId=${selectedCompany._id}`)
      ]);

      const today = new Date().toISOString().split('T')[0];
      const todayVouchers = vouchersRes.data.filter(v => 
        v.date.split('T')[0] === today
      );

      const totalAmount = vouchersRes.data.reduce((sum, v) => sum + v.totalAmount, 0);

      setStats({
        totalLedgers: ledgersRes.data.length,
        totalVouchers: vouchersRes.data.length,
        todayVouchers: todayVouchers.length,
        totalAmount
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const quickActions = [
    { title: 'Manage Companies', icon: Building2, link: '/companies', color: '#3b82f6' },
    { title: 'Create Ledger', icon: BookOpen, link: '/ledgers', color: '#10b981' },
    { title: 'New Voucher', icon: Receipt, link: '/vouchers', color: '#8b5cf6' },
    { title: 'View Reports', icon: BarChart3, link: '/reports', color: '#f59e0b' },
  ];

  // Add user management for admins
  if (user?.role === 'admin') {
    quickActions.push({ title: 'Manage Users', icon: Users, link: '/users', color: '#dc2626' });
  }

  const statCards = [
    { title: 'Total Ledgers', value: stats.totalLedgers, icon: BookOpen, color: '#2563eb' },
    { title: 'Total Vouchers', value: stats.totalVouchers, icon: Receipt, color: '#16a34a' },
    { title: 'Today\'s Vouchers', value: stats.todayVouchers, icon: Receipt, color: '#8b5cf6' },
    { title: 'Total Amount', value: `₹${stats.totalAmount.toLocaleString()}`, icon: DollarSign, color: '#f59e0b' },
  ];

  const getRoleDisplayName = (role) => {
    const roleNames = {
      admin: 'Administrator',
      manager: 'Manager',
      accountant: 'Accountant',
      user: 'User'
    };
    return roleNames[role] || role;
  };

  const getDepartmentDisplayName = (dept) => {
    const deptNames = {
      accounts: 'Accounts',
      sales: 'Sales',
      purchase: 'Purchase',
      inventory: 'Inventory',
      admin: 'Administration'
    };
    return deptNames[dept] || dept;
  };

  return (
    <main>
      <div className="container">
        {/* Header with NexKirana Branding */}
        <div className="text-center mb-6">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Shield size={40} style={{ color: '#1e40af' }} />
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                NexKirana Accounting System
              </h1>
              <p style={{ fontSize: '1rem', color: '#6b7280', margin: 0 }}>
                Internal Financial Management Platform
              </p>
            </div>
          </div>
          
          {/* User Welcome */}
          <div style={{ 
            backgroundColor: '#f0f9ff', 
            border: '1px solid #0ea5e9', 
            borderRadius: '12px', 
            padding: '1rem',
            display: 'inline-block',
            marginBottom: '1rem'
          }}>
            <p style={{ margin: 0, color: '#0c4a6e', fontSize: '0.875rem' }}>
              Welcome back, <strong>{user?.username}</strong> • {getRoleDisplayName(user?.role)} • {getDepartmentDisplayName(user?.department)}
            </p>
          </div>

          {selectedCompany && (
            <div style={{ 
              backgroundColor: '#f0fdf4', 
              border: '1px solid #16a34a', 
              borderRadius: '8px', 
              padding: '0.75rem',
              display: 'inline-block'
            }}>
              <p style={{ margin: 0, color: '#15803d', fontSize: '0.875rem' }}>
                Active Company: <strong>{selectedCompany.name}</strong>
              </p>
            </div>
          )}
        </div>

        {/* Internal Use Notice */}
        <div style={{ 
          backgroundColor: '#fef3c7', 
          border: '1px solid #f59e0b', 
          borderRadius: '8px', 
          padding: '0.75rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          <AlertCircle size={16} style={{ color: '#92400e' }} />
          <span style={{ color: '#92400e', fontSize: '0.875rem', fontWeight: '500' }}>
            🔒 This system is for internal use only by authorized NexKirana personnel
          </span>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-4 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="flex-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="stat-value">{stat.value}</p>
                </div>
                <stat.icon size={32} style={{ color: stat.color }} />
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="mb-4" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={20} style={{ color: '#1e40af' }} />
            Quick Actions
          </h2>
          <div className="grid grid-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="card"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="flex gap-2" style={{ alignItems: 'center' }}>
                  <div 
                    className="p-2" 
                    style={{ 
                      backgroundColor: action.color, 
                      color: 'white', 
                      borderRadius: '8px' 
                    }}
                  >
                    <action.icon size={24} />
                  </div>
                  <span className="font-medium">{action.title}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {!selectedCompany && (
          <div className="card text-center">
            <div style={{ marginBottom: '1rem' }}>
              <Building2 size={48} style={{ color: '#6b7280', margin: '0 auto' }} />
            </div>
            <h3 style={{ color: '#374151', marginBottom: '0.5rem' }}>No Company Selected</h3>
            <p className="text-gray-600 mb-4">
              Please create or select a company to access the accounting features and view financial data.
            </p>
            <Link to="/companies" className="btn btn-primary">
              <Building2 size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Manage Companies
            </Link>
          </div>
        )}

        {/* Footer */}
        <div style={{ 
          marginTop: '3rem', 
          padding: '1.5rem', 
          backgroundColor: '#f9fafb', 
          borderRadius: '12px',
          textAlign: 'center',
          border: '1px solid #e5e7eb'
        }}>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
            © 2024 NexKirana. All rights reserved. | Internal Accounting System v1.0<br/>
            <span style={{ fontSize: '0.75rem' }}>
              For technical support, contact your system administrator
            </span>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;