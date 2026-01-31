import React, { useState, useEffect } from 'react';
import { BarChart3, FileText } from 'lucide-react';
import { useCompany } from '../context/CompanyContext';
import axios from 'axios';

const Reports = () => {
  const { selectedCompany } = useCompany();
  const [activeReport, setActiveReport] = useState('trial-balance');
  const [reportData, setReportData] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 3, 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);

  const reports = [
    { id: 'trial-balance', name: 'Trial Balance', icon: BarChart3 },
    { id: 'day-book', name: 'Day Book', icon: FileText }
  ];

  useEffect(() => {
    if (selectedCompany) {
      fetchReportData();
    }
  }, [selectedCompany, activeReport, dateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      let endpoint = '';
      const params = new URLSearchParams({
        companyId: selectedCompany._id,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      });

      switch (activeReport) {
        case 'trial-balance':
          endpoint = `/api/reports/trial-balance?${params}`;
          break;
        case 'day-book':
          endpoint = `/api/reports/day-book?${params}`;
          break;
        default:
          return;
      }

      const response = await axios.get(endpoint);
      setReportData(response.data);
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTrialBalance = () => {
    const totalDebit = reportData.reduce((sum, item) => sum + item.debit, 0);
    const totalCredit = reportData.reduce((sum, item) => sum + item.credit, 0);

    return (
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Ledger Name</th>
              <th>Group</th>
              <th style={{ textAlign: 'right' }}>Debit (₹)</th>
              <th style={{ textAlign: 'right' }}>Credit (₹)</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((item, index) => (
              <tr key={index}>
                <td className="font-medium">{item.ledger}</td>
                <td className="text-gray-600">{item.group}</td>
                <td style={{ textAlign: 'right' }}>
                  {item.debit > 0 ? item.debit.toLocaleString() : '-'}
                </td>
                <td style={{ textAlign: 'right' }}>
                  {item.credit > 0 ? item.credit.toLocaleString() : '-'}
                </td>
              </tr>
            ))}
            <tr style={{ backgroundColor: '#f3f4f6', fontWeight: 'bold' }}>
              <td colSpan="2">Total</td>
              <td style={{ textAlign: 'right' }}>{totalDebit.toLocaleString()}</td>
              <td style={{ textAlign: 'right' }}>{totalCredit.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const renderDayBook = () => {
    return (
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Voucher No.</th>
              <th>Type</th>
              <th>Date</th>
              <th style={{ textAlign: 'right' }}>Amount (₹)</th>
              <th>Narration</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((voucher) => (
              <tr key={voucher._id}>
                <td className="font-medium">{voucher.voucherNumber}</td>
                <td>
                  <span className={`badge ${
                    voucher.voucherType === 'Payment' ? 'badge-danger' :
                    voucher.voucherType === 'Receipt' ? 'badge-success' :
                    'badge-info'
                  }`}>
                    {voucher.voucherType}
                  </span>
                </td>
                <td>{new Date(voucher.date).toLocaleDateString('en-IN')}</td>
                <td style={{ textAlign: 'right' }}>
                  {voucher.totalAmount.toLocaleString()}
                </td>
                <td className="text-gray-600">{voucher.narration || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (!selectedCompany) {
    return (
      <main>
        <div className="container">
          <div className="card text-center">
            <BarChart3 size={48} style={{ margin: '0 auto 1rem', color: '#9ca3af' }} />
            <h3 className="text-lg font-medium mb-2">No Company Selected</h3>
            <p className="text-gray-600">Please select a company to view reports.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="container">
        <div className="flex-between mb-6">
          <h1 className="text-2xl font-bold">Reports</h1>
        </div>

        {/* Report Tabs */}
        <div className="card mb-6">
          <div className="flex gap-2 mb-6">
            {reports.map((report) => (
              <button
                key={report.id}
                onClick={() => setActiveReport(report.id)}
                className={`btn ${
                  activeReport === report.id ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                <report.icon size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                {report.name}
              </button>
            ))}
          </div>

          {/* Date Range Filter */}
          <div className="grid grid-2 gap-4">
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="form-control"
              />
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div>
          <div className="flex-between mb-4">
            <h2 className="text-xl font-semibold">
              {reports.find(r => r.id === activeReport)?.name}
            </h2>
            <div className="text-sm text-gray-600">
              Period: {new Date(dateRange.startDate).toLocaleDateString('en-IN')} to {new Date(dateRange.endDate).toLocaleDateString('en-IN')}
            </div>
          </div>

          {loading ? (
            <div className="card text-center p-8">
              <div className="loading" style={{ margin: '0 auto 1rem' }}></div>
              <p>Loading report data...</p>
            </div>
          ) : reportData.length === 0 ? (
            <div className="card text-center p-8">
              <BarChart3 size={48} style={{ margin: '0 auto 1rem', color: '#9ca3af' }} />
              <h3 className="text-lg font-medium mb-2">No Data Available</h3>
              <p className="text-gray-600">No data found for the selected period.</p>
            </div>
          ) : (
            <>
              {activeReport === 'trial-balance' && renderTrialBalance()}
              {activeReport === 'day-book' && renderDayBook()}
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default Reports;