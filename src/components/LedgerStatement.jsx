import React, { useState, useEffect } from 'react';
import { useCompany } from '../context/CompanyContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const LedgerStatement = ({ onClose }) => {
  const { selectedCompany } = useCompany();
  const [ledgers, setLedgers] = useState([]);
  const [selectedLedger, setSelectedLedger] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 3, 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [statement, setStatement] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedCompany) {
      fetchLedgers();
    }
  }, [selectedCompany]);

  const fetchLedgers = async () => {
    try {
      const response = await api.get(`/ledgers?companyId=${selectedCompany._id}`);
      setLedgers(response.data);
    } catch (error) {
      toast.error('Error fetching ledgers');
    }
  };

  const generateStatement = async () => {
    if (!selectedLedger) {
      toast.error('Please select a ledger');
      return;
    }

    try {
      setLoading(true);
      const params = new URLSearchParams({
        ledgerId: selectedLedger,
        companyId: selectedCompany._id,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      });

      const response = await api.get(`/reports/ledger-statement?${params}`);
      setStatement(response.data);
    } catch (error) {
      toast.error('Error generating ledger statement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Ledger Statement</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Ledger
              </label>
              <select
                value={selectedLedger}
                onChange={(e) => setSelectedLedger(e.target.value)}
                className="input-field"
              >
                <option value="">Choose Ledger</option>
                {ledgers.map(ledger => (
                  <option key={ledger._id} value={ledger._id}>
                    {ledger.name} ({ledger.group})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="input-field"
              />
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={generateStatement}
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Generating...' : 'Generate Statement'}
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {statement ? (
            <div>
              <div className="mb-6 text-center">
                <h3 className="text-lg font-bold">{statement.ledger}</h3>
                <p className="text-gray-600">Group: {statement.group}</p>
                <p className="text-sm text-gray-500">
                  Period: {new Date(dateRange.startDate).toLocaleDateString()} to {new Date(dateRange.endDate).toLocaleDateString()}
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Voucher</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Particulars</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Debit</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Credit</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {statement.transactions.map((transaction, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {transaction.voucherNumber}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            transaction.voucherType === 'Opening' ? 'bg-gray-100 text-gray-800' :
                            transaction.voucherType === 'Payment' ? 'bg-red-100 text-red-800' :
                            transaction.voucherType === 'Receipt' ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {transaction.voucherType}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                          {transaction.particulars}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">
                          {transaction.debit > 0 ? transaction.debit.toLocaleString() : '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">
                          {transaction.credit > 0 ? transaction.credit.toLocaleString() : '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">
                          {transaction.balance.toLocaleString()} {transaction.balanceType}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Closing Balance:</span>
                  <span className="font-bold text-lg">
                    ₹{statement.closingBalance.toLocaleString()} {statement.closingBalanceType}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">Select a ledger and date range to generate statement</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LedgerStatement;