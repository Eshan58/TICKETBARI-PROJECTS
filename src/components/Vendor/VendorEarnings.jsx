import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function VendorEarnings() {
  const navigate = useNavigate();
  const [revenueData, setRevenueData] = useState({
    total: 0,
    pending: 0,
    available: 0,
    thisMonth: 0,
    lastMonth: 0,
    totalTicketsSold: 0,
    totalTicketsAdded: 0,
    monthlyRevenue: [],
    ticketSalesByType: [],
    statusDistribution: []
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    fetchRevenueData();
  }, [timeRange]);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API calls
      const mockRevenueData = {
        total: 2450,
        pending: 450,
        available: 2000,
        thisMonth: 1250,
        lastMonth: 1200,
        totalTicketsSold: 45,
        totalTicketsAdded: 28,
        monthlyRevenue: [
          { month: 'Jan', revenue: 1250 },
          { month: 'Feb', revenue: 1450 },
          { month: 'Mar', revenue: 1650 },
          { month: 'Apr', revenue: 1850 },
          { month: 'May', revenue: 2050 },
          { month: 'Jun', revenue: 2450 }
        ],
        ticketSalesByType: [
          { type: 'Bus', count: 25 },
          { type: 'Train', count: 10 },
          { type: 'Flight', count: 5 },
          { type: 'Car', count: 3 },
          { type: 'Launch', count: 2 }
        ],
        statusDistribution: [
          { status: 'pending', count: 8 },
          { status: 'approved', count: 15 },
          { status: 'rejected', count: 3 },
          { status: 'active', count: 2 }
        ]
      };

      const mockTransactions = [
        { id: 1, date: '2024-01-15', description: 'Booking #BK-001', amount: 250, status: 'completed', type: 'credit' },
        { id: 2, date: '2024-01-14', description: 'Booking #BK-002', amount: 150, status: 'completed', type: 'credit' },
        { id: 3, date: '2024-01-13', description: 'Booking #BK-003', amount: 300, status: 'pending', type: 'credit' },
        { id: 4, date: '2024-01-12', description: 'Booking #BK-004', amount: 200, status: 'completed', type: 'credit' },
        { id: 5, date: '2024-01-11', description: 'Booking #BK-005', amount: 100, status: 'completed', type: 'credit' },
        { id: 6, date: '2024-01-10', description: 'Service Fee', amount: 50, status: 'completed', type: 'debit' },
        { id: 7, date: '2024-01-09', description: 'Booking #BK-006', amount: 175, status: 'completed', type: 'credit' },
        { id: 8, date: '2024-01-08', description: 'Booking #BK-007', amount: 225, status: 'pending', type: 'credit' },
      ];

      setRevenueData(mockRevenueData);
      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Error fetching revenue:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
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
    if (revenueData.available <= 0) {
      alert('No available balance to withdraw');
      return;
    }
    alert(`Withdrawal request for ${formatCurrency(revenueData.available)} submitted!`);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        <p className="mt-2 text-gray-600">Loading revenue data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Revenue Overview</h1>
        <p className="text-gray-600">Display Total Revenue, Total Tickets Sold, Total Tickets Added using interactive charts</p>
      </div>

      {/* Time Range Filter */}
      <div className="flex justify-between items-center mb-8">
        <div></div>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Revenue */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center">
            <div className="p-3 bg-white/20 rounded-xl mr-4">
              <span className="text-2xl">💰</span>
            </div>
            <div>
              <p className="text-sm opacity-90">Total Revenue</p>
              <p className="text-3xl font-bold">{formatCurrency(revenueData.total)}</p>
            </div>
          </div>
          <div className="mt-4 text-sm opacity-90">
            <span className="inline-flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Total earnings from all bookings
            </span>
          </div>
        </div>

        {/* Total Tickets Sold */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center">
            <div className="p-3 bg-white/20 rounded-xl mr-4">
              <span className="text-2xl">🎫</span>
            </div>
            <div>
              <p className="text-sm opacity-90">Total Tickets Sold</p>
              <p className="text-3xl font-bold">{revenueData.totalTicketsSold.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-4 text-sm opacity-90">
            <span className="inline-flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Successful bookings
            </span>
          </div>
        </div>

        {/* Total Tickets Added */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center">
            <div className="p-3 bg-white/20 rounded-xl mr-4">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <p className="text-sm opacity-90">Total Tickets Added</p>
              <p className="text-3xl font-bold">{revenueData.totalTicketsAdded.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-4 text-sm opacity-90">
            <span className="inline-flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Total listings created
            </span>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <span className="text-2xl text-blue-600">💳</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Available Balance</p>
              <p className="text-2xl font-bold text-gray-800">{formatCurrency(revenueData.available)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg mr-4">
              <span className="text-2xl text-yellow-600">⏳</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-800">{formatCurrency(revenueData.pending)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg mr-4">
              <span className="text-2xl text-purple-600">📈</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">This Month</p>
              <p className="text-2xl font-bold text-gray-800">{formatCurrency(revenueData.thisMonth)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section Placeholder */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Revenue Charts</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Revenue Chart Placeholder */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">Monthly Revenue Trend</h3>
            <div className="h-64 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-4">📈</div>
                <p className="text-gray-600">Interactive chart showing monthly revenue</p>
                <p className="text-sm text-gray-500 mt-2">(Chart.js or Recharts integration)</p>
              </div>
            </div>
          </div>

          {/* Ticket Sales by Type Chart Placeholder */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">Ticket Sales by Type</h3>
            <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-4">📊</div>
                <p className="text-gray-600">Bar chart showing sales distribution</p>
                <p className="text-sm text-gray-500 mt-2">(Chart.js or Recharts integration)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Withdraw Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Withdraw Funds</h2>
            <p className="text-gray-600 text-sm">Transfer available balance to your bank account</p>
          </div>
          <button
            onClick={handleWithdraw}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 font-medium"
            disabled={revenueData.available <= 0}
          >
            Withdraw {formatCurrency(revenueData.available)}
          </button>
        </div>
        
        <div className="text-sm text-gray-500 space-y-1">
          <p>• Minimum withdrawal amount: ৳100</p>
          <p>• Withdrawals are processed within 3-5 business days</p>
          <p>• A 2.5% processing fee applies to all withdrawals</p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Recent Transactions</h2>
        </div>
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

      {/* Note about Charts */}
      <div className="mt-6 p-6 bg-blue-50 rounded-xl">
        <h3 className="font-semibold text-blue-800 mb-2">📊 Note about Charts:</h3>
        <p className="text-blue-700 text-sm">
          To enable interactive charts, install chart.js or recharts:
          <br />
          <code className="bg-blue-100 px-2 py-1 rounded text-xs mt-1 inline-block">
            npm install chart.js react-chartjs-2
          </code>
          <br />
          <code className="bg-blue-100 px-2 py-1 rounded text-xs mt-1 inline-block">
            npm install recharts
          </code>
        </p>
      </div>
    </div>
  );
}