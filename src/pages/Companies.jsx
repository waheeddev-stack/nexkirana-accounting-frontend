import React, { useState } from 'react';
import { Plus, Building2, Edit, Trash2, RotateCcw, AlertCircle } from 'lucide-react';
import { useCompany } from '../context/CompanyContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Companies = () => {
  const { companies, fetchCompanies, selectedCompany, setSelectedCompany } = useCompany();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [showDeleted, setShowDeleted] = useState(false);
  const [deletedCompanies, setDeletedCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    gstin: '',
    pan: '',
    description: '',
    website: ''
  });

  const isAdmin = user?.role === 'admin';

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      phone: '',
      email: '',
      gstin: '',
      pan: '',
      description: '',
      website: ''
    });
    setEditingCompany(null);
    setError('');
  };

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      setError('Only administrators can create companies');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/companies', formData);
      alert(response.data.message || 'Company created successfully');
      fetchCompanies();
      setShowForm(false);
      resetForm();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error creating company';
      setError(errorMessage);
      console.error('Create company error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCompany = (company) => {
    if (!isAdmin) {
      alert('Only administrators can edit companies');
      return;
    }
    
    setEditingCompany(company);
    setFormData({
      name: company.name || '',
      address: company.address || '',
      phone: company.phone || '',
      email: company.email || '',
      gstin: company.gstin || '',
      pan: company.pan || '',
      description: company.description || '',
      website: company.website || ''
    });
    setShowForm(true);
  };

  const handleUpdateCompany = async (e) => {
    e.preventDefault();
    if (!isAdmin || !editingCompany) return;

    setLoading(true);
    setError('');
    
    try {
      const response = await api.put(`/companies/${editingCompany._id}`, formData);
      alert(response.data.message || 'Company updated successfully');
      fetchCompanies();
      setShowForm(false);
      resetForm();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error updating company';
      setError(errorMessage);
      console.error('Update company error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCompany = async (companyId, companyName) => {
    if (!isAdmin) {
      alert('Only administrators can delete companies');
      return;
    }

    if (!confirm(`Are you sure you want to delete "${companyName}"? This action can be undone.`)) {
      return;
    }

    try {
      const response = await api.delete(`/companies/${companyId}`);
      alert(response.data.message || 'Company deleted successfully');
      fetchCompanies();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error deleting company';
      alert(errorMessage);
      console.error('Delete company error:', error);
    }
  };

  const fetchDeletedCompanies = async () => {
    if (!isAdmin) return;
    
    try {
      const response = await api.get('/companies/deleted/list');
      setDeletedCompanies(response.data);
    } catch (error) {
      console.error('Error fetching deleted companies:', error);
    }
  };

  const handleRestoreCompany = async (companyId, companyName) => {
    if (!isAdmin) return;

    if (!confirm(`Are you sure you want to restore "${companyName}"?`)) {
      return;
    }

    try {
      const response = await api.patch(`/companies/${companyId}/restore`);
      alert(response.data.message || 'Company restored successfully');
      fetchCompanies();
      fetchDeletedCompanies();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error restoring company';
      alert(errorMessage);
      console.error('Restore company error:', error);
    }
  };

  const handleSelectCompany = (company) => {
    setSelectedCompany(company);
    alert(`Selected company: ${company.name}`);
  };

  const toggleDeletedView = () => {
    if (!showDeleted) {
      fetchDeletedCompanies();
    }
    setShowDeleted(!showDeleted);
  };

  return (
    <main>
      <div className="container">
        <div className="flex-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Company Management</h1>
            {!isAdmin && (
              <p className="text-sm text-gray-600 mt-1">
                <AlertCircle size={14} style={{ display: 'inline', marginRight: '4px' }} />
                Only administrators can create and manage companies
              </p>
            )}
          </div>
          <div className="flex gap-3">
            {isAdmin && (
              <>
                <button
                  onClick={toggleDeletedView}
                  className="btn btn-secondary"
                >
                  {showDeleted ? 'Show Active' : 'Show Deleted'}
                </button>
                <button
                  onClick={() => setShowForm(true)}
                  className="btn btn-primary flex gap-2"
                  style={{ alignItems: 'center' }}
                >
                  <Plus size={16} />
                  New Company
                </button>
              </>
            )}
          </div>
        </div>

        {showForm && isAdmin && (
          <div className="modal-overlay">
            <div className="modal">
              <h2 className="text-xl font-bold mb-4">
                {editingCompany ? 'Edit Company' : 'Create New Company'}
              </h2>
              
              {error && (
                <div className="alert alert-error mb-4">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <form onSubmit={editingCompany ? handleUpdateCompany : handleCreateCompany}>
                <div className="form-group">
                  <label>Company Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter company name"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Brief description of the company"
                    rows="2"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter company address"
                    rows="3"
                    disabled={loading}
                  />
                </div>

                <div className="grid grid-2 gap-4">
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Phone number"
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Email address"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="grid grid-2 gap-4">
                  <div className="form-group">
                    <label>GSTIN</label>
                    <input
                      type="text"
                      name="gstin"
                      value={formData.gstin}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="GST Identification Number"
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label>PAN</label>
                    <input
                      type="text"
                      name="pan"
                      value={formData.pan}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="PAN Number"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Website</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="https://company-website.com"
                    disabled={loading}
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button 
                    type="submit" 
                    className="btn btn-primary flex-1"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : (editingCompany ? 'Update Company' : 'Create Company')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="btn btn-secondary flex-1"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-3 gap-6">
          {(showDeleted ? deletedCompanies : companies).map((company) => (
            <div
              key={company._id}
              className={`card ${
                selectedCompany?._id === company._id ? 'selected-company' : ''
              } ${showDeleted ? 'deleted-company' : ''}`}
              style={{ 
                cursor: showDeleted ? 'default' : 'pointer',
                border: selectedCompany?._id === company._id ? '2px solid #1e40af' : '1px solid #e5e7eb',
                backgroundColor: showDeleted ? '#fef2f2' : (selectedCompany?._id === company._id ? '#eff6ff' : 'white'),
                opacity: showDeleted ? 0.8 : 1
              }}
              onClick={() => !showDeleted && handleSelectCompany(company)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                  <div 
                    className="p-2" 
                    style={{ 
                      backgroundColor: showDeleted ? '#dc2626' : '#1e40af', 
                      color: 'white', 
                      borderRadius: '8px' 
                    }}
                  >
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{company.name}</h3>
                    {company.description && (
                      <p className="text-sm text-gray-600">{company.description}</p>
                    )}
                    {company.address && (
                      <p className="text-sm text-gray-600">{company.address}</p>
                    )}
                  </div>
                </div>
                
                {isAdmin && !showDeleted && (
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditCompany(company);
                      }}
                      className="btn-icon"
                      title="Edit Company"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCompany(company._id, company.name);
                      }}
                      className="btn-icon btn-danger"
                      title="Delete Company"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}

                {isAdmin && showDeleted && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRestoreCompany(company._id, company.name);
                    }}
                    className="btn-icon btn-success"
                    title="Restore Company"
                  >
                    <RotateCcw size={16} />
                  </button>
                )}
              </div>
              
              <div className="space-y-1">
                {company.phone && (
                  <p className="text-sm text-gray-600">Phone: {company.phone}</p>
                )}
                {company.email && (
                  <p className="text-sm text-gray-600">Email: {company.email}</p>
                )}
                {company.gstin && (
                  <p className="text-sm text-gray-600">GSTIN: {company.gstin}</p>
                )}
                {company.pan && (
                  <p className="text-sm text-gray-600">PAN: {company.pan}</p>
                )}
                {company.website && (
                  <p className="text-sm text-gray-600">
                    Website: <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{company.website}</a>
                  </p>
                )}
                {company.createdBy && (
                  <p className="text-xs text-gray-500 mt-2">
                    Created by: {company.createdBy.username || company.createdBy.email}
                  </p>
                )}
                {showDeleted && company.deletedAt && (
                  <p className="text-xs text-red-600 mt-2">
                    Deleted: {new Date(company.deletedAt).toLocaleDateString()}
                  </p>
                )}
              </div>

              {selectedCompany?._id === company._id && !showDeleted && (
                <div className="mt-3 text-sm font-medium" style={{ color: '#1e40af' }}>
                  ✓ Currently Selected
                </div>
              )}
            </div>
          ))}
        </div>

        {(showDeleted ? deletedCompanies : companies).length === 0 && (
          <div className="card text-center">
            <Building2 size={48} style={{ margin: '0 auto 1rem', color: '#9ca3af' }} />
            <h3 className="text-lg font-medium mb-2">
              {showDeleted ? 'No Deleted Companies' : 'No Companies Found'}
            </h3>
            <p className="text-gray-600 mb-4">
              {showDeleted 
                ? 'No companies have been deleted yet.' 
                : isAdmin 
                  ? 'Create your first company to get started with accounting.'
                  : 'No companies are available. Contact your administrator to create companies.'
              }
            </p>
            {isAdmin && !showDeleted && (
              <button
                onClick={() => setShowForm(true)}
                className="btn btn-primary"
              >
                Create Company
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default Companies;