import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, BookOpen, Receipt, BarChart3, DollarSign } from 'lucide-react';
import { useCompany } from '../context/CompanyContext';
import api from '../utils/api';

const Dashboard = () => {
  const { selectedCompany } = useCompany();
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
        api.get(`/api/ledgers?companyId=${selectedCompany._id}`),
        api.get(`/api/vouchers?companyId=${selectedCompany._id}`)
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

  const statCards = [
    { title: 'Total Ledgers', value: stats.totalLedgers, icon: BookOpen, color: '#2563eb' },
    { title: 'Total Vouchers', value: stats.totalVouchers, icon: Receipt, color: '#16a34a' },
    { title: 'Today\'s Vouchers', value: stats.todayVouchers, icon: Receipt, color: '#8b5cf6' },
    { title: 'Total Amount', value: `₹${stats.totalAmount.toLocaleString()}`, icon: DollarSign, color: '#f59e0b' },
  ];

  return (
    <main>
      <div className="container">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome to TallyPrime Clone
          </h1>
          {selectedCompany && (
            <p className="text-gray-600">
              Managing: <span className="font-semibold">{selectedCompany.name}</span>
            </p>
          )}
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
          <h2 className="mb-4">Quick Actions</h2>
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
            <p className="text-gray-600 mb-4">No company selected. Please create or select a company to get started.</p>
            <Link to="/companies" className="btn btn-primary">
              Manage Companies
            </Link>
          </div>
        )}
      </div>
    </main>
  );
};

export default Dashboard;