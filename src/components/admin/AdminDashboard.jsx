
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBookings: 5,
    confirmed: 2,
    pending: 3,
    totalSpent: 4500,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch user's dashboard data
      const response = await api.getUserDashboard(user.uid);
      
      if (response.data?.success) {
        const data = response.data.data;
        
        setStats({
          totalBookings: data.totalBookings || 5,
          confirmed: data.confirmed || 2,
          pending: data.pending || 3,
          totalSpent: data.totalSpent || 4500,
        });
        
        setRecentBookings(data.recentBookings || [
          { id: 1, route: "Dhaka to Chittagong", date: "2024-01-15", status: "confirmed" },
          { id: 2, route: "Dhaka to Sylhet", date: "2024-01-10", status: "pending" },
          { id: 3, route: "Dhaka to Cox's Bazar", date: "2024-01-05", status: "completed" },
        ]);
      }
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      // Use default data as fallback
      setRecentBookings([
        { id: 1, route: "Dhaka to Chittagong", date: "2024-01-15", status: "confirmed", price: "৳1200", seats: 2 },
        { id: 2, route: "Dhaka to Sylhet", date: "2024-01-10", status: "pending", price: "৳900", seats: 1 },
        { id: 3, route: "Dhaka to Cox's Bazar", date: "2024-01-05", status: "completed", price: "৳1500", seats: 3 },
        { id: 4, route: "Chittagong to Dhaka", date: "2023-12-28", status: "completed", price: "৳1100", seats: 1 },
        { id: 5, route: "Dhaka to Khulna", date: "2023-12-20", status: "completed", price: "৳800", seats: 2 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: {
        color: "bg-green-100 text-green-800",
        text: "Confirmed"
      },
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        text: "Pending"
      },
      completed: {
        color: "bg-blue-100 text-blue-800",
        text: "Completed"
      },
      cancelled: {
        color: "bg-red-100 text-red-800",
        text: "Cancelled"
      }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg font-bold">T</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">TicketBari</h1>
                  <p className="text-xs text-gray-500">Travel with Confidence</p>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-medium text-gray-900">{user?.name || "tamjidtaleb"}</p>
                <p className="text-sm text-gray-500">{user?.email || "tamjidtaleb@gmail.com"}</p>
              </div>
              <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                <img
                  src={`https://ui-avatars.com/api/?name=${user?.name || "tamjidtaleb"}&background=4f46e5&color=fff`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <Link
              to="/dashboard"
              className="flex-1 text-center py-2 px-4 rounded-md bg-white text-blue-600 font-medium shadow-sm"
            >
              Dashboard
            </Link>
            <Link
              to="/user/profile"
              className="flex-1 text-center py-2 px-4 rounded-md text-gray-600 hover:text-gray-900 hover:bg-white transition-colors"
            >
              User Profile
            </Link>
            <Link
              to="/my-bookings"
              className="flex-1 text-center py-2 px-4 rounded-md text-gray-600 hover:text-gray-900 hover:bg-white transition-colors"
            >
              My Booked Tickets
            </Link>
            <Link
              to="/transaction-history"
              className="flex-1 text-center py-2 px-4 rounded-md text-gray-600 hover:text-gray-900 hover:bg-white transition-colors"
            >
              Transaction History
            </Link>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, <span className="font-semibold">{user?.name || "tamjidtaleb"}</span>! Here's your activity summary.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Bookings */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                <span className="text-2xl">🎫</span>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Bookings</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats.totalBookings}</h3>
                <p className="text-sm text-gray-600">All your booked tickets</p>
              </div>
            </div>
          </div>

          {/* Confirmed */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Confirmed</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats.confirmed}</h3>
                <p className="text-sm text-gray-600">Upcoming journeys</p>
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-xl flex items-center justify-center mr-4">
                <span className="text-2xl">⏳</span>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Pending</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats.pending}</h3>
                <p className="text-sm text-gray-600">Waiting for confirmation</p>
              </div>
            </div>
          </div>

          {/* Total Spent */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                <span className="text-2xl">💰</span>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Spent</p>
                <h3 className="text-3xl font-bold text-gray-900">৳{stats.totalSpent.toLocaleString()}</h3>
                <p className="text-sm text-gray-600">All your payments</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
              <Link
                to="/my-bookings"
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                View All
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-lg">🚌</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{booking.route}</h3>
                        <p className="text-sm text-gray-500">
                          {formatDate(booking.date)}
                          {booking.seats && (
                            <span className="ml-3">
                              {booking.seats} {booking.seats === 1 ? 'seat' : 'seats'}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{booking.price || "৳0"}</p>
                      <p className="text-sm text-gray-500">Price</p>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      {getStatusBadge(booking.status)}
                      <Link
                        to={`/booking/${booking.id}`}
                        className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* If no bookings */}
            {recentBookings.length === 0 && (
              <div className="px-6 py-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-gray-400">🎫</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                <p className="text-gray-600 mb-4">Book your first ticket to get started</p>
                <Link
                  to="/tickets"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Tickets
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Quick Book Ticket */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">Quick Book</h3>
                <p className="text-blue-100">Book your next journey</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-xl">🚍</span>
              </div>
            </div>
            <Link
              to="/tickets"
              className="inline-flex items-center justify-center w-full py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Book New Ticket
            </Link>
          </div>

          {/* Invite Friends */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">Invite Friends</h3>
                <p className="text-green-100">Earn rewards together</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-xl">👥</span>
              </div>
            </div>
            <button className="inline-flex items-center justify-center w-full py-3 bg-white text-emerald-600 rounded-lg font-medium hover:bg-emerald-50 transition-colors">
              Invite Now
            </button>
          </div>

          {/* Support */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">Need Help?</h3>
                <p className="text-purple-100">24/7 customer support</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-xl">💬</span>
              </div>
            </div>
            <Link
              to="/support"
              className="inline-flex items-center justify-center w-full py-3 bg-white text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-500">
                TicketBari © {new Date().getFullYear()} • Travel with Confidence
              </p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Terms of Service</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Help Center</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;