import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, AlertTriangle } from 'lucide-react';

const Register = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '450px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Shield size={32} style={{ color: '#1e40af' }} />
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>NexKirana</h1>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Accounting System</p>
            </div>
          </div>
        </div>
        
        {/* Access Restricted Notice */}
        <div style={{ 
          backgroundColor: '#fef2f2', 
          border: '2px solid #dc2626', 
          borderRadius: '12px', 
          padding: '1.5rem',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <div style={{ 
              backgroundColor: '#dc2626', 
              borderRadius: '50%', 
              padding: '0.75rem',
              color: 'white'
            }}>
              <Lock size={24} />
            </div>
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#dc2626', marginBottom: '0.5rem' }}>
            Access Restricted
          </h2>
          <p style={{ color: '#7f1d1d', fontSize: '0.875rem', lineHeight: '1.5', marginBottom: '1rem' }}>
            Account registration is restricted to authorized administrators only. 
            This system is for internal use by NexKirana personnel.
          </p>
          <div style={{ 
            backgroundColor: '#fbbf24', 
            color: '#92400e', 
            padding: '0.75rem', 
            borderRadius: '8px',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            <AlertTriangle size={16} />
            <span>Contact your system administrator for account creation</span>
          </div>
        </div>
        
        {/* Login Redirect */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
            Already have an account?
          </p>
          <Link 
            to="/login" 
            className="btn btn-primary" 
            style={{ 
              width: '100%', 
              padding: '0.875rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <Shield size={16} />
            Go to Login
          </Link>
        </div>
        
        {/* Footer */}
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          backgroundColor: '#f9fafb', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
            © 2024 NexKirana. All rights reserved.<br/>
            This system is for authorized internal use only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;