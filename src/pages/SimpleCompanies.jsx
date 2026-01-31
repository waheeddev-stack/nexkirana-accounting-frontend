import React, { useState } from 'react';
import { Plus, Building2 } from 'lucide-react';
import { useCompany } from '../context/CompanyContext';
import axios from 'axios';

const Companies = () => {
  const { companies, fetchCompanies, selectedCompany, setSelectedCompany } = useCompany();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    gstin: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/companies', formData);
      alert('Company created successfully');
      fetchCompanies();
      setShowForm(false);
      setFormData({ name: '', address: '', phone: '', email: '', gstin: '' });
    } catch (error) {
      alert('Error creating company');
      console.error(error);
    }
  };

  const handleSelectCompany = (company) => {
    setSelectedCompany(company);
    alert(`Selected company: ${company.name}`);
  };

  return (
    <main>
      <div className="container">
        <div className="flex-between mb-6">
          <h1 className="text-2xl font-bold">Company Management</h1>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary flex gap-2"
            style={{ alignItems: 'center' }}
          >
            <Plus size={16} />
            New Company
          </button>
        </div>

        {showForm && (
          <div className="modal-overlay">
            <div className="modal">
              <h2 className="text-xl font-bold mb-4">Create New Company</h2>
              <form onSubmit={handleCreateCompany}>
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
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>GSTIN</label>
                  <input
                    type="text"
                    name="gstin"
                    value={formData.gstin}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="GST Identification Number"
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button type="submit" className="btn btn-primary flex-1">
                    Create Company
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setFormData({ name: '', address: '', phone: '', email: '', gstin: '' });
                    }}
                    className="btn btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-3 gap-6">
          {companies.map((company) => (
            <div
              key={company._id}
              className={`card ${
                selectedCompany?._id === company._id ? 'selected-company' : ''
              }`}
              onClick={() => handleSelectCompany(company)}
              style={{ 
                cursor: 'pointer',
                border: selectedCompany?._id === company._id ? '2px solid #1e40af' : '1px solid #e5e7eb',
                backgroundColor: selectedCompany?._id === company._id ? '#eff6ff' : 'white'
              }}
            >
              <div className="flex gap-3 mb-4">
                <div 
                  className="p-2" 
                  style={{ 
                    backgroundColor: '#1e40af', 
                    color: 'white', 
                    borderRadius: '8px' 
                  }}
                >
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">{company.name}</h3>
                  {company.address && (
                    <p className="text-sm text-gray-600">{company.address}</p>
                  )}
                </div>
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
              </div>

              {selectedCompany?._id === company._id && (
                <div className="mt-3 text-sm font-medium" style={{ color: '#1e40af' }}>
                  ✓ Currently Selected
                </div>
              )}
            </div>
          ))}
        </div>

        {companies.length === 0 && (
          <div className="card text-center">
            <Building2 size={48} style={{ margin: '0 auto 1rem', color: '#9ca3af' }} />
            <h3 className="text-lg font-medium mb-2">No Companies Found</h3>
            <p className="text-gray-600 mb-4">Create your first company to get started with accounting.</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
            >
              Create Company
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default Companies;