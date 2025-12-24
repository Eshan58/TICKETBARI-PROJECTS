import React, { useState, useEffect } from "react";
import api from "../services/api";  
import { getToken } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { TbCurrencyTaka } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { 
  FaCalendarAlt, 
  FaClock, 
  FaCheckCircle, 
  FaTicketAlt,
  FaPlane,
  FaSearch,
  FaFilter,
  FaDownload,
  FaExclamationTriangle,
  FaSyncAlt
} from "react-icons/fa";

const MyBookings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  // Mock data for demonstration
  const mockBookings = [
    {
      _id: "1",
      bookingReference: "TB-1765726189204-2",
      ticketTitle: "Flight to Chittagong",
      createdAt: "2025-12-14T21:29:00Z",
      quantity: 1,
      totalPrice: 4500.00,
      status: "paid",
      paymentMethod: "bkash",
      paidAt: "2025-12-14T21:35:00Z",
      ticketId: {
        departureAt: "2025-12-15T00:00:00Z",
        from: "Dhaka",
        to: "Chittagong",
        airline: "Bangladesh Airlines",
        flightNo: "BG-203"
      }
    },
    {
      _id: "2",
      bookingReference: "TB-1765726160429-3",
      ticketTitle: "Business Flight to Chittagong",
      createdAt: "2025-12-14T21:29:00Z",
      quantity: 1,
      totalPrice: 9500.00,
      status: "paid",
      paymentMethod: "nagad",
      paidAt: "2025-12-14T21:40:00Z",
      ticketId: {
        departureAt: "2026-01-20T00:00:00Z",
        from: "Dhaka",
        to: "Chittagong",
        airline: "Premium Airways",
        flightNo: "PA-501"
      }
    },
    {
      _id: "3",
      bookingReference: "TB-1765726139303-4",
      ticketTitle: "Business Flight to Chittagong",
      createdAt: "2025-12-14T21:28:00Z",
      quantity: 1,
      totalPrice: 9500.00,
      status: "confirmed",
      paymentMethod: null,
      ticketId: {
        departureAt: "2026-01-20T00:00:00Z",
        from: "Dhaka",
        to: "Chittagong",
        airline: "Premium Airways",
        flightNo: "PA-502"
      }
    },
    {
      _id: "4",
      bookingReference: "TB-1765726100000-5",
      ticketTitle: "Flight to Cox's Bazar",
      createdAt: "2025-12-10T14:30:00Z",
      quantity: 2,
      totalPrice: 12000.00,
      status: "completed",
      paymentMethod: "card",
      paidAt: "2025-12-10T14:45:00Z",
      ticketId: {
        departureAt: "2025-12-25T00:00:00Z",
        from: "Dhaka",
        to: "Cox's Bazar",
        airline: "Coastal Airlines",
        flightNo: "CA-301"
      }
    }
  ];

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getToken();

      if (!token) {
        setError("Please login to view bookings");
        setLoading(false);
        return;
      }

      // Use smart function that tries real API first, then mock data
      const response = await api.smartGetBookings();
      
      // Handle different response structures
      if (response.data?.success) {
        // Backend response structure
        const data = response.data.data;
        if (data && data.bookings) {
          // Structure: { success: true, data: { bookings: [...] } }
          setBookings(data.bookings);
        } else if (Array.isArray(data)) {
          // Structure: { success: true, data: [...] }
          setBookings(data);
        } else if (Array.isArray(response.data.data)) {
          // Structure: { success: true, data: [...] }
          setBookings(response.data.data);
        } else {
          // If no data structure found, use mock data
          console.warn("Unexpected API response structure, using mock data");
          setBookings(mockBookings);
        }
      } else {
        // Mock data response structure
        setBookings(response.data || mockBookings);
      }
      
    } catch (err) {
      console.error("Bookings error:", err);
      setError(err.message || "Failed to load bookings");
      // Use mock data as fallback
      setBookings(mockBookings);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        icon: "⏳",
        label: "Pending"
      },
      confirmed: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        icon: "✅",
        label: "Confirmed"
      },
      paid: {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: "💳",
        label: "Paid"
      },
      cancelled: {
        bg: "bg-red-100",
        text: "text-red-800",
        icon: "❌",
        label: "Cancelled"
      },
      completed: {
        bg: "bg-purple-100",
        text: "text-purple-800",
        icon: "✓",
        label: "Completed"
      }
    };

    const config = statusConfig[status] || { 
      bg: "bg-gray-100", 
      text: "text-gray-800", 
      icon: "●",
      label: status 
    };

    return (
      <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${config.bg} ${config.text} flex items-center gap-1.5`}>
        <span>{config.icon}</span>
        {config.label.toUpperCase()}
      </span>
    );
  };

  const getPaymentMethodBadge = (method) => {
    if (!method) return null;
    
    const methods = {
      bkash: { color: "bg-pink-100 text-pink-800", label: "Bkash" },
      nagad: { color: "bg-green-100 text-green-800", label: "Nagad" },
      rocket: { color: "bg-purple-100 text-purple-800", label: "Rocket" },
      card: { color: "bg-blue-100 text-blue-800", label: "Card" }
    };

    const config = methods[method] || { color: "bg-gray-100 text-gray-800", label: "N/A" };

    return (
      <span className={`px-2 py-1 rounded text-xs ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const handleViewDetails = (booking) => {
    navigate(`/my-bookings/${booking._id}`);
  };

  const handleDownloadTicket = async (booking) => {
    try {
      alert(`Downloading ticket for booking ${booking.bookingReference}`);
      // In real app: await api.downloadTicket(booking._id)
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download ticket. Please try again.");
    }
  };

  const handlePayNow = (booking) => {
    navigate('/payment', { 
      state: { 
        booking: booking,
        user: user 
      } 
    });
  };

  const filteredBookings = bookings.filter(booking => {
    if (!booking) return false;
    
    const matchesSearch = 
      (booking.ticketTitle?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (booking.bookingReference?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (booking.ticketId?.airline?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: bookings.length,
    paid: bookings.filter(b => b.status === "paid").length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    pending: bookings.filter(b => b.status === "pending").length,
    cancelled: bookings.filter(b => b.status === "cancelled").length,
    completed: bookings.filter(b => b.status === "completed").length,
    totalSpent: bookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0)
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    } catch (e) {
      return "Invalid Date";
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (e) {
      return "Invalid Date";
    }
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
            <p className="mt-4 text-gray-600 font-medium">Loading your bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && bookings.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-50 rounded-full mb-6">
              <FaExclamationTriangle className="text-3xl text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Unable to Load Bookings</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleRefresh}
                className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-600 mt-2">
              View and manage all your flight bookings
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <FaSyncAlt className={`${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={() => navigate('/tickets')}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
            >
              <span className="flex items-center gap-2">
                <FaTicketAlt />
                Book New Ticket
              </span>
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500">Total Bookings</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500">Paid</p>
            <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500">Upcoming</p>
            <p className="text-2xl font-bold text-purple-600">{stats.confirmed + stats.paid}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500">Total Spent</p>
            <p className="text-2xl font-bold text-gray-900 flex items-center">
              <TbCurrencyTaka className="mr-1" />
              {stats.totalSpent.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search bookings by reference, flight, or airline..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <FaFilter className="text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="paid">Paid</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FaTicketAlt className="text-blue-600" />
                All Bookings ({filteredBookings.length})
              </h2>
              <div className="text-sm text-gray-500">
                Showing {filteredBookings.length} of {bookings.length} bookings
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {filteredBookings.length > 0 ? (
              <div className="space-y-6">
                {filteredBookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="group p-6 bg-gradient-to-r from-white to-gray-50 hover:from-blue-50 hover:to-white border border-gray-200 hover:border-blue-200 rounded-xl transition-all duration-300"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      {/* Left Section */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          {getStatusBadge(booking.status)}
                          <div className="text-sm font-mono text-gray-500 bg-gray-100 px-3 py-1 rounded">
                            {booking.bookingReference || `ID: ${booking._id?.slice(-6)}`}
                          </div>
                          {booking.paymentMethod && (
                            <div className="text-sm">
                              Paid via: {getPaymentMethodBadge(booking.paymentMethod)}
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-3">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700">
                            {booking.ticketTitle || "Unnamed Ticket"}
                          </h3>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1.5">
                              <FaCalendarAlt className="text-gray-400" />
                              Booked: {formatDate(booking.createdAt)}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <FaClock className="text-gray-400" />
                              {booking.createdAt ? new Date(booking.createdAt).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit"
                              }) : "N/A"}
                            </span>
                            <span>• {booking.quantity || 1} ticket(s)</span>
                          </div>
                          
                          {booking.ticketId && (
                            <div className="flex flex-wrap items-center gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <FaPlane className="text-gray-400" />
                                <span className="font-medium">
                                  {booking.ticketId.from || "Unknown"} → {booking.ticketId.to || "Unknown"}
                                </span>
                              </div>
                              {booking.ticketId.departureAt && (
                                <div className="text-gray-600">
                                  Departure: {formatDate(booking.ticketId.departureAt)}
                                </div>
                              )}
                              {booking.ticketId.flightNo && (
                                <div className="text-gray-600">
                                  Flight: {booking.ticketId.flightNo} 
                                  {booking.ticketId.airline && ` (${booking.ticketId.airline})`}
                                </div>
                              )}
                            </div>
                          )}
                          
                          {booking.paidAt && (
                            <div className="text-sm text-green-600 flex items-center gap-2">
                              <FaCheckCircle />
                              Paid on: {formatDateTime(booking.paidAt)}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Section */}
                      <div className="flex flex-col items-end gap-4">
                        <div className="text-right">
                          <p className="text-3xl font-bold text-gray-900 flex items-center justify-end">
                            <TbCurrencyTaka className="mr-1 mt-1" />
                            {(booking.totalPrice || 0).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">Total Amount</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={() => handleViewDetails(booking)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                          >
                            <FaTicketAlt />
                            View Details
                          </button>
                          
                          {(booking.status === "paid" || booking.status === "completed") && (
                            <button
                              onClick={() => handleDownloadTicket(booking)}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                            >
                              <FaDownload />
                              Download Ticket
                            </button>
                          )}
                          
                          {booking.status === "confirmed" && (
                            <button
                              onClick={() => handlePayNow(booking)}
                              className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium rounded-lg transition-all shadow-md flex items-center gap-2"
                            >
                              <FaCheckCircle />
                              Pay Now
                            </button>
                          )}
                          
                          {booking.status === "pending" && (
                            <button
                              onClick={() => handlePayNow(booking)}
                              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                            >
                              Complete Payment
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                  <FaTicketAlt className="text-3xl text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Bookings Found</h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                  {searchTerm || statusFilter !== "all" 
                    ? "No bookings match your search criteria." 
                    : "You haven't made any bookings yet."}
                </p>
                <div className="flex gap-3 justify-center">
                  {(searchTerm || statusFilter !== "all") && (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setStatusFilter("all");
                      }}
                      className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-all"
                    >
                      Clear Filters
                    </button>
                  )}
                  {!searchTerm && statusFilter === "all" && (
                    <button
                      onClick={() => navigate('/tickets')}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all shadow-md"
                    >
                      Browse Available Tickets
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Message for Mock Data */}
        {error && bookings.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <FaExclamationTriangle className="text-yellow-500 mt-0.5" />
              <div>
                <p className="text-yellow-800 font-medium">Showing Demo Data</p>
                <p className="text-yellow-600 text-sm mt-1">
                  We're showing demo bookings because the server connection failed. Your real bookings will appear when the server is back online.
                </p>
                <button
                  onClick={handleRefresh}
                  className="mt-2 text-sm text-yellow-700 font-medium hover:text-yellow-800"
                >
                  Try loading real data again →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;