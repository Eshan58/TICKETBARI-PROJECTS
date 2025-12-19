import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function VendorEarnings() {
  const navigate = useNavigate();
  const [earnings, setEarnings] = useState({
    total: 0,
    pending: 0,
    available: 0,
    thisMonth: 0,
    lastMonth: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    fetchEarningsData();
  }, [timeRange]);

  const fetchEarningsData = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API calls
      const mockEarnings = {
        total: 2450,
        pending: 450,
        available: 2000,
        thisMonth: 1250,
        lastMonth: 1200,
      };

      const mockTransactions = [
        { id: 1, date: '2024-01-15', description: 'Booking #TRX-001', amount: 250, status: 'completed', type: 'credit' },
        { id: 2, date: '2024-01-14', description: 'Booking #TRX-002', amount: 150, status: 'completed', type: 'credit' },
        { id: 3, date: '2024-01-13', description: 'Booking #TRX-003', amount: 300, status: 'pending', type: 'credit' },
        { id: 4, date: '2024-01-12', description: 'Booking #TRX-004', amount: 200, status: 'completed', type: 'credit' },
        { id: 5, date: '2024-01-11', description: 'Booking #TRX-005', amount: 100, status: 'completed', type: 'credit' },
        { id: 6, date: '2024-01-10', description: 'Service Fee', amount: 50, status: 'completed', type: 'debit' },
        { id: 7, date: '2024-01-09', description: 'Booking #TRX-006', amount: 175, status: 'completed', type: 'credit' },
        { id: 8, date: '2024-01-08', description: 'Booking #TRX-007', amount: 225, status: 'pending', type: 'credit' },
      ];

      setEarnings(mockEarnings);
      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Error fetching earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleWithdraw = () => {
    if (earnings.available <= 0) {
      alert('No available balance to withdraw');
      return;
    }
    alert(`Withdrawal request for ${formatCurrency(earnings.available)} submitted!`);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        <p className="mt-2 text-gray-600">Loading earnings data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => navigate('/vendor/dashboard')}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Earnings</h1>
        <p className="text-gray-600">Track your earnings and transactions</p>
      </div>

      {/* Earnings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-xl mr-4">
              <span className="text-2xl text-green-600">💰</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-800">{formatCurrency(earnings.total)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-xl mr-4">
              <span className="text-2xl text-blue-600">💳</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Available Balance</p>
              <p className="text-2xl font-bold text-gray-800">{formatCurrency(earnings.available)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-xl mr-4">
              <span className="text-2xl text-yellow-600">⏳</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-800">{formatCurrency(earnings.pending)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-xl mr-4">
              <span className="text-2xl text-purple-600">📈</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">This Month</p>
              <p className="text-2xl font-bold text-gray-800">{formatCurrency(earnings.thisMonth)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Withdraw Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Withdraw Funds</h2>
            <p className="text-gray-600 text-sm">Transfer available balance to your bank account</p>
          </div>
          <button
            onClick={handleWithdraw}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 font-medium"
            disabled={earnings.available <= 0}
          >
            Withdraw {formatCurrency(earnings.available)}
          </button>
        </div>
        
        <div className="text-sm text-gray-500 space-y-1">
          <p>• Minimum withdrawal amount: $10</p>
          <p>• Withdrawals are processed within 3-5 business days</p>
          <p>• A 2.5% processing fee applies to all withdrawals</p>
        </div>
      </div>

      {/* Time Range Filter */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Transaction History</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${timeRange === 'week' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}
          >
            This Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${timeRange === 'month' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}
          >
            This Month
          </button>
          <button
            onClick={() => setTimeRange('year')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${timeRange === 'year' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}
          >
            This Year
          </button>
          <button
            onClick={() => setTimeRange('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${timeRange === 'all' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}
          >
            All Time
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{transaction.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    #{transaction.id.toString().padStart(8, '0')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      transaction.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {transactions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">💰</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
          <p className="text-gray-500">Your transaction history will appear here once you start receiving payments.</p>
        </div>
      )}
    </div>
  );
}