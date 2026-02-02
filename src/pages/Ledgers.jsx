import React, { useState, useEffect } from 'react';
import { Plus, BookOpen } from 'lucide-react';
import { useCompany } from '../context/CompanyContext';
import api from '../utils/api';

const Ledgers = () => {
  const { selectedCompany } = useCompany();
  const [ledgers, setLedgers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    group: '',
    openingBalance: 0,
    balanceType: 'Dr'
  });

  const ledgerGroups = [
    'Assets', 'Liabilities', 'Income', 'Expenses',
    'Current Assets', 'Fixed Assets', 'Current Liabilities',
    'Capital Account', 'Sales Accounts', 'Purchase Accounts',
    'Direct Expenses', 'Indirect Expenses', 'Direct Incomes',
    'Indirect Incomes', 'Bank Accounts', 'Cash-in-Hand',
    'Sundry Debtors', 'Sundry Creditors'
  ];

  useEffect(() => {
    if (selectedCompany) {
      fetchLedgers();
    }
  }, [selectedCompany]);

  const fetchLedgers = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/ledgers?companyId=${selectedCompany._id}`);
      setLedgers(response.data);
    } catch (error) {
      alert('Error fetching ledgers');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleCreateLedger = async (e) => {
    e.preventDefault();
    try {
      await api.post('/ledgers', {
        ...formData,
        company: selectedCompany._id
      });
      alert('Ledger created successfully');
      fetchLedgers();
      setShowForm(false);
      setFormData({ name: '', group: '', openingBalance: 0, balanceType: 'Dr' });
    } catch (error) {
      alert('Error creating ledger');
      console.error(error);
    }
  };

  if (!selectedCompany) {
    return (
      <main>
        <div className="container">
          <div className="card text-center">
            <BookOpen size={48} style={{ margin: '0 auto 1rem', color: '#9ca3af' }} />
            <h3 className="text-lg font-medium mb-2">No Company Selected</h3>
            <p className="text-gray-600">Please select a company to manage ledgers.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="container">
        <div className="flex-between mb-6">
          <h1 className="text-2xl font-bold">Ledger Management</h1>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary flex gap-2"
            style={{ alignItems: 'center' }}
          >
            <Plus size={16} />
            New Ledger
          </button>
        </div>

        {showForm && (
          <div className="modal-overlay">
            <div className="modal">
              <h2 className="text-xl font-bold mb-4">Create New Ledger</h2>
              <form onSubmit={handleCreateLedger}>
                <div className="form-group">
                  <label>Ledger Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter ledger name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Group *</label>
                  <select
                    name="group"
                    value={formData.group}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  >
                    <option value="">Select Group</option>
                    {ledgerGroups.map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-2 gap-4">
                  <div className="form-group">
                    <label>Opening Balance</label>
                    <input
                      type="number"
                      step="0.01"
                      name="openingBalance"
                      value={formData.openingBalance}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="0.00"
                    />
                  </div>

                  <div className="form-group">
                    <label>Balance Type</label>
                    <select
                      name="balanceType"
                      value={formData.balanceType}
                      onChange={handleInputChange}
                      className="form-control"
                    >
                      <option value="Dr">Debit (Dr)</option>
                      <option value="Cr">Credit (Cr)</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button type="submit" className="btn btn-primary flex-1">
                    Create Ledger
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setFormData({ name: '', group: '', openingBalance: 0, balanceType: 'Dr' });
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

        {loading ? (
          <div className="card text-center">
            <div className="loading" style={{ margin: '0 auto 1rem' }}></div>
            <p>Loading ledgers...</p>
          </div>
        ) : (
          <div className="card">
            <table className="table">
              <thead>
                <tr>
                  <th>Ledger Name</th>
                  <th>Group</th>
                  <th>Opening Balance</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {ledgers.map((ledger) => (
                  <tr key={ledger._id}>
                    <td>
                      <div className="flex gap-3" style={{ alignItems: 'center' }}>
                        <BookOpen size={16} style={{ color: '#9ca3af' }} />
                        <span className="font-medium">{ledger.name}</span>
                      </div>
                    </td>
                    <td className="text-gray-600">{ledger.group}</td>
                    <td>₹{ledger.openingBalance.toLocaleString()}</td>
                    <td>
                      <span className={`badge ${
                        ledger.balanceType === 'Dr' ? 'badge-danger' : 'badge-success'
                      }`}>
                        {ledger.balanceType}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {ledgers.length === 0 && (
              <div className="text-center p-8">
                <BookOpen size={48} style={{ margin: '0 auto 1rem', color: '#9ca3af' }} />
                <h3 className="text-lg font-medium mb-2">No Ledgers Found</h3>
                <p className="text-gray-600 mb-4">Create your first ledger to get started.</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="btn btn-primary"
                >
                  Create Ledger
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default Ledgers;