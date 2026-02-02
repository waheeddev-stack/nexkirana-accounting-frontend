import React, { useState, useEffect } from 'react';
import { Plus, Receipt } from 'lucide-react';
import { useCompany } from '../context/CompanyContext';
import api from '../utils/api';

const Vouchers = () => {
  const { selectedCompany } = useCompany();
  const [vouchers, setVouchers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ledgers, setLedgers] = useState([]);
  const [formData, setFormData] = useState({
    voucherType: 'Payment',
    voucherNumber: '',
    date: new Date().toISOString().split('T')[0],
    entries: [
      { ledger: '', amount: 0, type: 'Dr' },
      { ledger: '', amount: 0, type: 'Cr' }
    ],
    narration: ''
  });

  const voucherTypes = ['Payment', 'Receipt', 'Journal', 'Sales', 'Purchase', 'Contra'];

  useEffect(() => {
    if (selectedCompany) {
      fetchVouchers();
      fetchLedgers();
    }
  }, [selectedCompany]);

  useEffect(() => {
    generateVoucherNumber();
  }, [formData.voucherType]);

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/vouchers?companyId=${selectedCompany._id}`);
      setVouchers(response.data);
    } catch (error) {
      alert('Error fetching vouchers');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLedgers = async () => {
    try {
      const response = await api.get(`/api/ledgers?companyId=${selectedCompany._id}`);
      setLedgers(response.data);
    } catch (error) {
      console.error('Error fetching ledgers:', error);
    }
  };

  const generateVoucherNumber = () => {
    const prefix = formData.voucherType.substring(0, 3).toUpperCase();
    const number = Math.floor(Math.random() * 10000) + 1;
    setFormData(prev => ({
      ...prev,
      voucherNumber: `${prefix}${number.toString().padStart(4, '0')}`
    }));
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEntryChange = (index, field, value) => {
    const newEntries = [...formData.entries];
    newEntries[index] = {
      ...newEntries[index],
      [field]: field === 'amount' ? parseFloat(value) || 0 : value
    };
    setFormData({
      ...formData,
      entries: newEntries
    });
  };

  const addEntry = () => {
    setFormData({
      ...formData,
      entries: [...formData.entries, { ledger: '', amount: 0, type: 'Dr' }]
    });
  };

  const removeEntry = (index) => {
    if (formData.entries.length > 2) {
      const newEntries = formData.entries.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        entries: newEntries
      });
    }
  };

  const handleCreateVoucher = async (e) => {
    e.preventDefault();
    
    const debitTotal = formData.entries
      .filter(entry => entry.type === 'Dr')
      .reduce((sum, entry) => sum + (parseFloat(entry.amount) || 0), 0);
    
    const creditTotal = formData.entries
      .filter(entry => entry.type === 'Cr')
      .reduce((sum, entry) => sum + (parseFloat(entry.amount) || 0), 0);

    if (Math.abs(debitTotal - creditTotal) > 0.01) {
      alert('Debit and Credit totals must be equal');
      return;
    }

    try {
      await api.post('/vouchers', {
        ...formData,
        company: selectedCompany._id,
        totalAmount: debitTotal
      });
      alert('Voucher created successfully');
      fetchVouchers();
      setShowForm(false);
      setFormData({
        voucherType: 'Payment',
        voucherNumber: '',
        date: new Date().toISOString().split('T')[0],
        entries: [
          { ledger: '', amount: 0, type: 'Dr' },
          { ledger: '', amount: 0, type: 'Cr' }
        ],
        narration: ''
      });
    } catch (error) {
      alert('Error creating voucher');
      console.error(error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  if (!selectedCompany) {
    return (
      <main>
        <div className="container">
          <div className="card text-center">
            <Receipt size={48} style={{ margin: '0 auto 1rem', color: '#9ca3af' }} />
            <h3 className="text-lg font-medium mb-2">No Company Selected</h3>
            <p className="text-gray-600">Please select a company to manage vouchers.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="container">
        <div className="flex-between mb-6">
          <h1 className="text-2xl font-bold">Voucher Management</h1>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary flex gap-2"
            style={{ alignItems: 'center' }}
          >
            <Plus size={16} />
            New Voucher
          </button>
        </div>

        {showForm && (
          <div className="modal-overlay">
            <div className="modal" style={{ maxWidth: '800px' }}>
              <h2 className="text-xl font-bold mb-4">Create New Voucher</h2>
              <form onSubmit={handleCreateVoucher}>
                <div className="grid grid-3 gap-4 mb-6">
                  <div className="form-group">
                    <label>Voucher Type *</label>
                    <select
                      name="voucherType"
                      value={formData.voucherType}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    >
                      {voucherTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Voucher Number *</label>
                    <input
                      type="text"
                      name="voucherNumber"
                      value={formData.voucherNumber}
                      onChange={handleInputChange}
                      className="form-control"
                      readOnly
                    />
                  </div>

                  <div className="form-group">
                    <label>Date *</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex-between mb-4">
                    <h3 className="text-lg font-medium">Voucher Entries</h3>
                    <button
                      type="button"
                      onClick={addEntry}
                      className="btn btn-secondary"
                    >
                      <Plus size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                      Add Entry
                    </button>
                  </div>

                  {formData.entries.map((entry, index) => (
                    <div key={index} className="grid grid-4 gap-3 mb-3 p-3" style={{ border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                      <div>
                        <select
                          value={entry.ledger}
                          onChange={(e) => handleEntryChange(index, 'ledger', e.target.value)}
                          className="form-control"
                          required
                        >
                          <option value="">Select Ledger</option>
                          {ledgers.map(ledger => (
                            <option key={ledger._id} value={ledger._id}>
                              {ledger.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Amount"
                          value={entry.amount}
                          onChange={(e) => handleEntryChange(index, 'amount', e.target.value)}
                          className="form-control"
                          required
                        />
                      </div>

                      <div>
                        <select
                          value={entry.type}
                          onChange={(e) => handleEntryChange(index, 'type', e.target.value)}
                          className="form-control"
                        >
                          <option value="Dr">Debit (Dr)</option>
                          <option value="Cr">Credit (Cr)</option>
                        </select>
                      </div>

                      <div>
                        {formData.entries.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeEntry(index)}
                            className="btn btn-danger"
                            style={{ padding: '0.5rem' }}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="form-group mb-6">
                  <label>Narration</label>
                  <textarea
                    name="narration"
                    value={formData.narration}
                    onChange={handleInputChange}
                    className="form-control"
                    rows="3"
                    placeholder="Enter narration (optional)"
                  />
                </div>

                <div className="flex gap-3">
                  <button type="submit" className="btn btn-primary flex-1">
                    Create Voucher
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
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
            <p>Loading vouchers...</p>
          </div>
        ) : (
          <div className="card">
            <table className="table">
              <thead>
                <tr>
                  <th>Voucher No.</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Narration</th>
                </tr>
              </thead>
              <tbody>
                {vouchers.map((voucher) => (
                  <tr key={voucher._id}>
                    <td>
                      <div className="flex gap-3" style={{ alignItems: 'center' }}>
                        <Receipt size={16} style={{ color: '#9ca3af' }} />
                        <span className="font-medium">{voucher.voucherNumber}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${
                        voucher.voucherType === 'Payment' ? 'badge-danger' :
                        voucher.voucherType === 'Receipt' ? 'badge-success' :
                        voucher.voucherType === 'Sales' ? 'badge-info' :
                        voucher.voucherType === 'Purchase' ? 'badge-warning' :
                        'badge-info'
                      }`}>
                        {voucher.voucherType}
                      </span>
                    </td>
                    <td className="text-gray-600">{formatDate(voucher.date)}</td>
                    <td className="font-medium">₹{voucher.totalAmount.toLocaleString()}</td>
                    <td className="text-gray-600">{voucher.narration || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {vouchers.length === 0 && (
              <div className="text-center p-8">
                <Receipt size={48} style={{ margin: '0 auto 1rem', color: '#9ca3af' }} />
                <h3 className="text-lg font-medium mb-2">No Vouchers Found</h3>
                <p className="text-gray-600 mb-4">Create your first voucher to get started.</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="btn btn-primary"
                >
                  Create Voucher
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default Vouchers;