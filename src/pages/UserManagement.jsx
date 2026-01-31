import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Plus, Edit, Trash2, Shield, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

const UserManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
    department: 'accounts'
  });

  // Check if user is admin
  if (user?.role !== 'admin') {
    return (
      <main>
        <div className="container">
          <div className="card text-center">
            <div style={{ marginBottom: '1rem' }}>
              <Shield size={48} style={{ color: '#dc2626', margin: '0 auto' }} />
            </div>
            <h2 style={{ color: '#dc2626', marginBottom: '0.5rem' }}>Access Denied</h2>
            <p style={{ color: '#6b7280' }}>
              Only administrators can access user management features.
            </p>
          </div>
        </div>
      </main>
    );
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingUser) {
        await axios.put(`/api/users/${editingUser._id}`, formData);
        setSuccess('User updated successfully');
      } else {
        await axios.post('/api/auth/register', formData);
        setSuccess('User created successfully');
      }
      
      setFormData({
        username: '',
        email: '',
        password: '',
        role: 'user',
        department: 'accounts'
      });
      setShowCreateForm(false);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      setError(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (userToEdit) => {
    setEditingUser(userToEdit);
    setFormData({
      username: userToEdit.username,
      email: userToEdit.email,
      password: '',
      role: userToEdit.role,
      department: userToEdit.department
    });
    setShowCreateForm(true);
  };

  const handleDeactivate = async (userId) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      try {
        await axios.delete(`/api/users/${userId}`);
        setSuccess('User deactivated successfully');
        fetchUsers();
      } catch (error) {
        setError('Failed to deactivate user');
      }
    }
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

  const getRoleBadgeStyle = (role) => ({
    backgroundColor: getRoleColor(role),
    color: 'white',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: '500'
  });

  if (loading) {
    return (
      <main>
        <div className="container">
          <div className="text-center">
            <div className="loading" style={{ width: '32px', height: '32px', margin: '2rem auto' }}></div>
            <p>Loading users...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="container">
        {/* Header */}
        <div className="flex-between mb-6">
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>
              <Users size={32} style={{ color: '#1e40af' }} />
              User Management
            </h1>
            <p style={{ color: '#6b7280', margin: 0 }}>
              Manage NexKirana system users and permissions
            </p>
          </div>
          <button
            onClick={() => {
              setShowCreateForm(true);
              setEditingUser(null);
              setFormData({
                username: '',
                email: '',
                password: '',
                role: 'user',
                department: 'accounts'
              });
            }}
            className="btn btn-primary"
          >
            <Plus size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
            Create User
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="alert alert-error" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <CheckCircle size={16} />
            {success}
          </div>
        )}

        {/* Create/Edit Form */}
        {showCreateForm && (
          <div className="card mb-6">
            <h3 style={{ marginBottom: '1rem' }}>
              {editingUser ? 'Edit User' : 'Create New User'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-2 gap-4">
                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="form-control"
                    required
                    disabled={editingUser}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-control"
                    required
                    disabled={editingUser}
                  />
                </div>
                {!editingUser && (
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="form-control"
                      required
                      minLength="8"
                    />
                  </div>
                )}
                <div className="form-group">
                  <label>Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="form-control"
                  >
                    <option value="user">User</option>
                    <option value="accountant">Accountant</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="form-control"
                  >
                    <option value="accounts">Accounts</option>
                    <option value="sales">Sales</option>
                    <option value="purchase">Purchase</option>
                    <option value="inventory">Inventory</option>
                    <option value="admin">Administration</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button type="submit" className="btn btn-primary">
                  {editingUser ? 'Update User' : 'Create User'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingUser(null);
                    setError('');
                    setSuccess('');
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Users Table */}
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>System Users</h3>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((userItem) => (
                  <tr key={userItem._id}>
                    <td>
                      <div>
                        <div style={{ fontWeight: '500' }}>{userItem.username}</div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{userItem.email}</div>
                      </div>
                    </td>
                    <td>
                      <span style={getRoleBadgeStyle(userItem.role)}>
                        {userItem.role.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ textTransform: 'capitalize' }}>{userItem.department}</td>
                    <td>
                      {userItem.isActive ? (
                        <span style={{ color: '#16a34a', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <CheckCircle size={14} />
                          Active
                        </span>
                      ) : (
                        <span style={{ color: '#dc2626', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <XCircle size={14} />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      {new Date(userItem.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(userItem)}
                          className="btn btn-secondary"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                        >
                          <Edit size={14} />
                        </button>
                        {userItem._id !== user._id && (
                          <button
                            onClick={() => handleDeactivate(userItem._id)}
                            className="btn btn-danger"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
            © 2024 NexKirana. User Management System - Internal Use Only
          </p>
        </div>
      </div>
    </main>
  );
};

export default UserManagement;