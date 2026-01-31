import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, BookOpen, Receipt, BarChart3, Home, LogOut, User, Shield } from 'lucide-react';
import { useCompany } from '../context/CompanyContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const { selectedCompany, companies, setSelectedCompany } = useCompany();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/companies', label: 'Companies', icon: Building2 },
    { path: '/ledgers', label: 'Ledgers', icon: BookOpen },
    { path: '/vouchers', label: 'Vouchers', icon: Receipt },
    { path: '/reports', label: 'Reports', icon: BarChart3 },
  ];

  const handleLogout = () => {
    logout();
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: '#dc2626',
      manager: '#ea580c',
      accountant: '#16a34a',
      user: '#2563eb'
    };
    return colors[role] || '#6b7280';
  };

  return (
    <nav>
      <div className="container">
        <div className="flex-between">
          <div className="flex gap-3">
            <Link to="/" className="logo flex gap-2" style={{ alignItems: 'center', textDecoration: 'none', color: 'white' }}>
              <Shield size={24} />
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>NexKirana</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Accounting System</div>
              </div>
            </Link>
            
            <ul className="nav-links">
              {navItems.map(({ path, label, icon: Icon }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className={location.pathname === path ? 'active' : ''}
                  >
                    <Icon size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-2">
            {companies.length > 0 && (
              <select
                value={selectedCompany?._id || ''}
                onChange={(e) => {
                  const company = companies.find(c => c._id === e.target.value);
                  setSelectedCompany(company);
                }}
                className="form-control"
                style={{ width: 'auto', minWidth: '200px', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                {companies.map(company => (
                  <option key={company._id} value={company._id} style={{ color: '#000' }}>
                    {company.name}
                  </option>
                ))}
              </select>
            )}
            
            <div className="flex gap-2" style={{ alignItems: 'center', color: 'white', padding: '0.5rem 1rem', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
              <User size={16} />
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>{user?.username}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.8, color: getRoleColor(user?.role) }}>
                  {user?.role?.toUpperCase()} • {user?.department?.toUpperCase()}
                </div>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="btn btn-secondary"
              style={{ padding: '0.5rem 1rem', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              <LogOut size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Logout
            </button>
          </div>
        </div>
      </div>
      
      {/* Internal Use Notice */}
      <div style={{ 
        backgroundColor: 'rgba(0,0,0,0.2)', 
        padding: '0.25rem 0', 
        textAlign: 'center', 
        fontSize: '0.75rem',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div className="container">
          🔒 Internal Use Only • NexKirana Accounting System • Session expires in {user?.expiresIn || '8h'}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;