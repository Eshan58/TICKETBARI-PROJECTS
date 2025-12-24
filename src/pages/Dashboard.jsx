import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import {
  FaTachometerAlt,
  FaUser,
  FaTicketAlt,
  FaHistory,
  FaStore,
  FaCrown,
  FaCalendarAlt,
  FaClock,
  FaDollarSign,
  FaChartLine,
  FaExclamationCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaSyncAlt
} from "react-icons/fa";
import { TbCurrencyTaka } from "react-icons/tb";

export default function Dashboard() {
  const { user } = useAuth() || {};
  const location = useLocation();
  const [dashboardData, setDashboardData] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch user dashboard data
      const response = await api.getUserDashboard();
      
      if (response.data?.success) {
        const data = response.data.data;
        setDashboardData({
          stats: data.stats || {
            totalBooked: 0,
            pending: 0,
            confirmed: 0,
            cancelled: 0,
            totalSpent: 0
          },
          user: data.user || user || {},
          recentBookings: data.recentBookings || []
        });
        setRecentBookings(data.recentBookings || []);
      }
    } catch (err) {
      console.error("Dashboard error:", err);
      setError(err.message || "Failed to load dashboard data");
      // Set mock data as fallback
      setDashboardData({
        stats: {
          totalBooked: 5,
          pending: 2,
          confirmed: 2,
          cancelled: 1,
          totalSpent: 4500
        },
        user: user || {
          name: "Demo User",
          email: "demo@example.com",
          role: "user"
        },
        recentBookings: []
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (e) {
      return "Invalid Date";
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: "⏳" },
      confirmed: { color: "bg-green-100 text-green-800", icon: "✅" },
      cancelled: { color: "bg-red-100 text-red-800", icon: "❌" },
      completed: { color: "bg-blue-100 text-blue-800", icon: "✓" }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <span className="mr-1">{config.icon}</span>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getUserPhoto = () => {
    if (!user) return "https://ui-avatars.com/api/?name=User&background=4f46e5&color=fff";
    
    if (user.photoURL) return user.photoURL;
    const name = user.name || user.email?.split("@")[0] || "User";
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4f46e5&color=fff`;
  };

  const getUserRoleBadge = () => {
    if (!user?.role) return null;
    
    const roleConfig = {
      admin: { color: "bg-red-100 text-red-800", label: "Admin", icon: "👑" },
      vendor: { color: "bg-emerald-100 text-emerald-800", label: "Vendor", icon: "🏪" },
      user: { color: "bg-blue-100 text-blue-800", label: "User", icon: "👤" }
    };
    
    const config = roleConfig[user.role] || roleConfig.user;
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color} flex items-center gap-2`}>
        <span>{config.icon}</span>
        <span>{config.label}</span>
      </span>
    );
  };

  if (loading && !refreshing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats || {};
  const userData = dashboardData?.user || user || {};

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 sticky top-24">
              {/* User Profile */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border-2 border-white shadow">
                    <img
                      src={getUserPhoto()}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://ui-avatars.com/api/?name=User&background=4f46e5&color=fff";
                      }}
                    />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{userData.name || "User"}</div>
                    <div className="text-sm text-gray-500 truncate max-w-[180px]">
                      {userData.email || "user@example.com"}
                    </div>
                  </div>
                </div>
                <div className="flex justify-center">
                  {getUserRoleBadge()}
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    location.pathname === '/dashboard' 
                      ? 'bg-indigo-50 text-indigo-600 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FaTachometerAlt className="text-lg" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/profile"
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    location.pathname === '/profile' 
                      ? 'bg-indigo-50 text-indigo-600 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FaUser className="text-lg" />
                  <span>User Profile</span>
                </Link>

                <Link
                  to="/my-bookings"
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    location.pathname === '/my-bookings' 
                      ? 'bg-indigo-50 text-indigo-600 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FaTicketAlt className="text-lg" />
                  <span>My Booked Tickets</span>
                </Link>

                <Link
                  to="/transactions"
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    location.pathname === '/transactions' 
                      ? 'bg-indigo-50 text-indigo-600 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FaHistory className="text-lg" />
                  <span>Transaction History</span>
                </Link>

                {/* Vendor specific links */}
                {user?.role === "vendor" && (
                  <>
                    <div className="pt-4 mt-4 border-t border-gray-200">
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-2 px-3">
                        Vendor Dashboard
                      </div>
                      <Link
                        to="/vendor/dashboard"
                        className="flex items-center gap-3 p-3 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                      >
                        <FaStore className="text-lg" />
                        <span className="font-medium">Vendor Dashboard</span>
                      </Link>
                    </div>
                  </>
                )}

                {/* Admin specific links */}
                {user?.role === "admin" && (
                  <>
                    <div className="pt-4 mt-4 border-t border-gray-200">
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-2 px-3">
                        Admin Panel
                      </div>
                      <Link
                        to="/admin"
                        className="flex items-center gap-3 p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <FaCrown className="text-lg" />
                        <span className="font-medium">Admin Panel</span>
                      </Link>
                    </div>
                  </>
                )}
              </nav>

              {/* Quick Actions */}
              <div className="pt-6 mt-6 border-t border-gray-200">
                <div className="text-xs font-semibold text-gray-500 uppercase mb-3 px-3">
                  Quick Actions
                </div>
                <div className="space-y-2">
                  <Link
                    to="/tickets"
                    className="flex items-center gap-2 p-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                  >
                    <span>🔍</span> Browse Tickets
                  </Link>
                  <Link
                    to="/apply-vendor"
                    className="flex items-center gap-2 p-2 text-sm text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                  >
                    <span>🏪</span> Become a Vendor
                  </Link>
                  <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="flex items-center gap-2 p-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded w-full text-left"
                  >
                    <FaSyncAlt className={refreshing ? "animate-spin" : ""} />
                    Refresh Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-2">
                  Welcome back, {userData.name || "User"}! Here's your activity summary.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <FaSyncAlt className={refreshing ? "animate-spin" : ""} />
                  {refreshing ? "Refreshing..." : "Refresh"}
                </button>
                <Link
                  to="/tickets"
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
                >
                  <span className="flex items-center gap-2">
                    <FaTicketAlt />
                    Book New Ticket
                  </span>
                </Link>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <FaExclamationCircle className="text-yellow-500 mt-0.5" />
                  <div>
                    <p className="text-yellow-800 font-medium">Showing Demo Data</p>
                    <p className="text-yellow-600 text-sm mt-1">
                      We're showing demo dashboard data because the server connection failed. Your real data will appear when the server is back online.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FaTicketAlt className="text-blue-600 text-xl" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">{stats.totalBooked || 0}</div>
                    <div className="text-sm text-gray-600">Total Bookings</div>
                  </div>
                </div>
                <p className="text-sm text-gray-500">All your booked tickets</p>
              </div>

              <div className="bg-gradient-to-br from-white to-green-50 p-6 rounded-xl border border-green-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <FaCheckCircle className="text-green-600 text-xl" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-600">{stats.confirmed || 0}</div>
                    <div className="text-sm text-gray-600">Confirmed</div>
                  </div>
                </div>
                <p className="text-sm text-gray-500">Upcoming journeys</p>
              </div>

              <div className="bg-gradient-to-br from-white to-yellow-50 p-6 rounded-xl border border-yellow-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                    <FaClock className="text-yellow-600 text-xl" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-yellow-600">{stats.pending || 0}</div>
                    <div className="text-sm text-gray-600">Pending</div>
                  </div>
                </div>
                <p className="text-sm text-gray-500">Waiting for confirmation</p>
              </div>

              <div className="bg-gradient-to-br from-white to-purple-50 p-6 rounded-xl border border-purple-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                    <FaDollarSign className="text-purple-600 text-xl" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900 flex items-center justify-end">
                      <TbCurrencyTaka className="mr-1" />
                      {stats.totalSpent || 0}
                    </div>
                    <div className="text-sm text-gray-600">Total Spent</div>
                  </div>
                </div>
                <p className="text-sm text-gray-500">All your payments</p>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FaHistory className="text-blue-600" />
                    Recent Bookings
                  </h2>
                  <Link
                    to="/my-bookings"
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View All →
                  </Link>
                </div>
              </div>
              
              <div className="p-6">
                {recentBookings.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ticket
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {recentBookings.slice(0, 5).map((booking) => (
                          <tr key={booking._id} className="hover:bg-gray-50">
                            <td className="px-4 py-4">
                              <div className="font-medium text-gray-900">
                                {booking.ticketTitle || "Unnamed Ticket"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {booking.ticketId?.from || "N/A"} → {booking.ticketId?.to || "N/A"}
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500">
                              {formatDate(booking.createdAt)}
                            </td>
                            <td className="px-4 py-4">
                              <div className="font-bold text-gray-900 flex items-center">
                                <TbCurrencyTaka className="mr-1" />
                                {booking.totalPrice || 0}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              {getStatusBadge(booking.status)}
                            </td>
                            <td className="px-4 py-4">
                              <Link
                                to={`/my-bookings/${booking._id}`}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                View Details
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                      <FaTicketAlt className="text-3xl text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Recent Bookings</h3>
                    <p className="text-gray-500 mb-6">You haven't made any bookings yet.</p>
                    <Link
                      to="/tickets"
                      className="inline-flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
                    >
                      Browse Tickets
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Activity Summary */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaChartLine className="text-blue-600" />
                  Activity Summary
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Confirmed Bookings</span>
                      <span className="text-sm font-medium">{stats.confirmed || 0}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${((stats.confirmed || 0) / (stats.totalBooked || 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Pending Bookings</span>
                      <span className="text-sm font-medium">{stats.pending || 0}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full" 
                        style={{ width: `${((stats.pending || 0) / (stats.totalBooked || 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Cancelled Bookings</span>
                      <span className="text-sm font-medium">{stats.cancelled || 0}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${((stats.cancelled || 0) / (stats.totalBooked || 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upcoming Trips */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaCalendarAlt className="text-blue-600" />
                  Upcoming Trips
                </h3>
                {recentBookings.filter(b => b.status === "confirmed" || b.status === "paid").length > 0 ? (
                  <div className="space-y-4">
                    {recentBookings
                      .filter(b => b.status === "confirmed" || b.status === "paid")
                      .slice(0, 3)
                      .map((booking) => (
                        <div key={booking._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium text-gray-900">
                              {booking.ticketId?.from || "Unknown"} → {booking.ticketId?.to || "Unknown"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.ticketId?.departureAt ? formatDate(booking.ticketId.departureAt) : "Date not set"}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900 flex items-center justify-end">
                              <TbCurrencyTaka className="mr-1" />
                              {booking.totalPrice || 0}
                            </div>
                            <div className="text-xs text-gray-500">{booking.quantity || 1} ticket(s)</div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                      <FaCalendarAlt className="text-2xl text-gray-400" />
                    </div>
                    <p className="text-gray-500">No upcoming trips</p>
                  </div>
                )}
              </div>
            </div>

            {/* Support Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Need Help?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  to="/contact"
                  className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                >
                  <div className="font-medium text-gray-900 mb-2">Contact Support</div>
                  <p className="text-sm text-gray-600">Get help from our support team</p>
                </Link>
                <Link
                  to="/faq"
                  className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                >
                  <div className="font-medium text-gray-900 mb-2">FAQ</div>
                  <p className="text-sm text-gray-600">Find answers to common questions</p>
                </Link>
                <Link
                  to="/tickets"
                  className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                >
                  <div className="font-medium text-gray-900 mb-2">Book New Ticket</div>
                  <p className="text-sm text-gray-600">Find and book your next journey</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}