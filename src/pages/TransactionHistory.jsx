import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import api from "../services/api";

export default function TransactionHistory() {
  const { user } = useAuth() || {};
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("all"); 
  const [stats, setStats] = useState({
    totalSpent: 0,
    totalTransactions: 0,
    completed: 0,
    pending: 0,
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      // Try to fetch real transactions
      const response = await api.getUserTransactions();
      
      if (response.data?.success) {
        const transactionData = response.data.data?.transactions || [];
        setTransactions(transactionData);
        
        // Calculate stats
        const completed = transactionData.filter(t => t.status === "completed").length;
        const pending = transactionData.filter(t => t.status === "pending").length;
        const totalSpent = transactionData
          .filter(t => t.status === "completed")
          .reduce((sum, t) => sum + (t.amount || 0), 0);
        
        setStats({
          totalSpent,
          totalTransactions: transactionData.length,
          completed,
          pending,
        });
      } else {
        // Fallback to sample data
        setTransactions(getSampleTransactions());
        calculateSampleStats();
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      // Fallback to sample data
      setTransactions(getSampleTransactions());
      calculateSampleStats();
    } finally {
      setLoading(false);
    }
  };

  const getSampleTransactions = () => {
    return [
      {
        id: "txn_001",
        ticketId: "tkt_789",
        description: "Dhaka to Chittagong AC Bus",
        amount: 1200,
        status: "completed",
        date: "2024-01-15T10:30:00Z",
        paymentMethod: "bKash",
        transactionId: "BK123456789",
        bookingId: "BK7890123"
      },
      {
        id: "txn_002",
        ticketId: "tkt_456",
        description: "Dhaka to Sylhet Train",
        amount: 800,
        status: "completed",
        date: "2024-01-10T14:20:00Z",
        paymentMethod: "Credit Card",
        transactionId: "CC987654321",
        bookingId: "BK7890124"
      },
      {
        id: "txn_003",
        ticketId: "tkt_123",
        description: "Chittagong to Cox's Bazar Bus",
        amount: 600,
        status: "pending",
        date: "2024-01-05T09:15:00Z",
        paymentMethod: "Nagad",
        transactionId: "NG555666777",
        bookingId: "BK7890125"
      },
      {
        id: "txn_004",
        ticketId: "tkt_999",
        description: "Dhaka to Cox's Bazar Flight",
        amount: 4500,
        status: "completed",
        date: "2023-12-28T16:45:00Z",
        paymentMethod: "Bank Transfer",
        transactionId: "BT888999000",
        bookingId: "BK7890126"
      },
      {
        id: "txn_005",
        ticketId: "tkt_777",
        description: "Dhaka to Rajshahi Bus",
        amount: 900,
        status: "failed",
        date: "2023-12-20T11:10:00Z",
        paymentMethod: "bKash",
        transactionId: "BK444333222",
        bookingId: "BK7890127",
        failureReason: "Insufficient balance"
      },
      {
        id: "txn_006",
        ticketId: "tkt_333",
        description: "Dhaka to Khulna Launch",
        amount: 1500,
        status: "completed",
        date: "2023-12-15T13:25:00Z",
        paymentMethod: "Rocket",
        transactionId: "RK111222333",
        bookingId: "BK7890128"
      },
      {
        id: "txn_007",
        ticketId: "tkt_222",
        description: "Dhaka to Chittagong AC Bus",
        amount: 1200,
        status: "completed",
        date: "2023-12-10T08:45:00Z",
        paymentMethod: "bKash",
        transactionId: "BK999888777",
        bookingId: "BK7890129"
      },
      {
        id: "txn_008",
        ticketId: "tkt_111",
        description: "Sylhet to Dhaka Train",
        amount: 750,
        status: "pending",
        date: "2023-12-05T15:30:00Z",
        paymentMethod: "Credit Card",
        transactionId: "CC666555444",
        bookingId: "BK7890130"
      },
    ];
  };

  const calculateSampleStats = () => {
    const sampleData = getSampleTransactions();
    const completed = sampleData.filter(t => t.status === "completed").length;
    const pending = sampleData.filter(t => t.status === "pending").length;
    const totalSpent = sampleData
      .filter(t => t.status === "completed")
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    
    setStats({
      totalSpent,
      totalTransactions: sampleData.length,
      completed,
      pending,
    });
  };

  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === "all") return true;
    return transaction.status === filter;
  });

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateString;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const config = {
      completed: {
        color: "bg-green-100 text-green-800",
        icon: "✅",
        label: "Completed"
      },
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        icon: "⏳",
        label: "Pending"
      },
      failed: {
        color: "bg-red-100 text-red-800",
        icon: "❌",
        label: "Failed"
      },
    };
    
    const configItem = config[status] || config.pending;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${configItem.color}`}>
        <span>{configItem.icon}</span>
        <span>{configItem.label}</span>
      </span>
    );
  };

  const getPaymentMethodIcon = (method) => {
    const icons = {
      bKash: "🏧",
      Nagad: "📱",
      Rocket: "🚀",
      "Credit Card": "💳",
      "Bank Transfer": "🏦",
      Cash: "💵",
    };
    return icons[method] || "💰";
  };

  const downloadReceipt = (transaction) => {
    // In a real app, this would generate or download a receipt
    alert(`Downloading receipt for ${transaction.transactionId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Transaction History</h1>
          <p className="text-gray-600">
            View all your payment transactions and receipts
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalSpent)}
                </div>
                <div className="text-sm text-gray-500">Total Spent</div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <span className="text-2xl text-blue-600">💰</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.totalTransactions}
                </div>
                <div className="text-sm text-gray-500">Total Transactions</div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <span className="text-2xl text-green-600">📊</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.completed}
                </div>
                <div className="text-sm text-gray-500">Completed</div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                <span className="text-2xl text-emerald-600">✅</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.pending}
                </div>
                <div className="text-sm text-gray-500">Pending</div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                <span className="text-2xl text-amber-600">⏳</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Filter Transactions</h3>
              <p className="text-sm text-gray-500">Showing {filteredTransactions.length} transactions</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === "all"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("completed")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === "completed"
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setFilter("pending")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === "pending"
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter("failed")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === "failed"
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Failed
              </button>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
              <p className="text-lg font-medium text-gray-700">Loading transactions...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">No transactions found</h3>
              <p className="text-gray-500">
                {filter === "all" 
                  ? "You haven't made any transactions yet."
                  : `No ${filter} transactions found.`
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Transaction
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {transaction.description}
                          </div>
                          <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                            <span className="inline-flex items-center gap-1">
                              <span>{getPaymentMethodIcon(transaction.paymentMethod)}</span>
                              <span>{transaction.paymentMethod}</span>
                            </span>
                            <span className="text-gray-300">•</span>
                            <span>ID: {transaction.transactionId}</span>
                          </div>
                          {transaction.failureReason && (
                            <div className="text-sm text-red-600 mt-1">
                              Reason: {transaction.failureReason}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">
                          {formatCurrency(transaction.amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(transaction.status)}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => downloadReceipt(transaction)}
                            className="px-4 py-2 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-medium transition-colors"
                          >
                            Receipt
                          </button>
                          {transaction.status === "pending" && (
                            <button className="px-4 py-2 text-sm bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg font-medium transition-colors">
                              Retry
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Info Notice */}
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-start">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg text-blue-800">Need Help with a Transaction?</h3>
              <p className="text-blue-700 mt-1">
                If you have any issues with your transactions, please contact our support team.
                For failed transactions, refunds are processed within 3-5 business days.
              </p>
              <button className="mt-3 px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="mt-8 flex justify-end">
          <button className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors mr-3">
            Export as CSV
          </button>
          <button className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300">
            Print Statement
          </button>
        </div>
      </div>
    </div>
  );
}
