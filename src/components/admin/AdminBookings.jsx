import React, { useState, useEffect } from "react";
import { getAdminBookings, updateBookingStatus } from "../../services/api";
import { TbCurrencyTaka } from "react-icons/tb";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    completed: 0,
  });

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await getAdminBookings({ status: filter === "all" ? "" : filter });
      
      if (response.data.success) {
        setBookings(response.data.data.bookings || []);
        setStats(response.data.data.stats || stats);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    if (!window.confirm(`Change booking status to ${newStatus}?`)) {
      return;
    }

    try {
      const response = await updateBookingStatus(bookingId, newStatus);
      
      if (response.data.success) {
        alert(`Booking status updated to ${newStatus}`);
        fetchBookings();
      }
    } catch (error) {
      alert("Failed to update booking status");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "confirmed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      case "completed": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>
        <p className="text-gray-600 mt-2">View and manage all bookings on the platform</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-semibold text-gray-700">Total</h3>
          <p className="text-2xl font-bold mt-1">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-semibold text-yellow-600">Pending</h3>
          <p className="text-2xl font-bold mt-1 text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-semibold text-green-600">Confirmed</h3>
          <p className="text-2xl font-bold mt-1 text-green-600">{stats.confirmed}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-semibold text-red-600">Cancelled</h3>
          <p className="text-2xl font-bold mt-1 text-red-600">{stats.cancelled}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-semibold text-blue-600">Completed</h3>
          <p className="text-2xl font-bold mt-1 text-blue-600">{stats.completed}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-lg ${filter === "pending" ? "bg-yellow-600 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter("confirmed")}
            className={`px-4 py-2 rounded-lg ${filter === "confirmed" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            Confirmed
          </button>
          <button
            onClick={() => setFilter("cancelled")}
            className={`px-4 py-2 rounded-lg ${filter === "cancelled" ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            Cancelled
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-4 py-2 rounded-lg ${filter === "completed" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            <p className="mt-3 text-gray-600">Loading bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <span className="text-2xl">📅</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Bookings Found</h3>
            <p className="text-gray-500">No bookings match the current filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.bookingReference || `BK-${booking._id.substring(0, 8)}`}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(booking.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{booking.userName}</div>
                      <div className="text-sm text-gray-500">{booking.userEmail}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{booking.ticketTitle}</div>
                      <div className="text-sm text-gray-500">
                        {booking.ticketId?.from} → {booking.ticketId?.to}
                      </div>
                      <div className="text-xs text-gray-500">
                        Qty: {booking.quantity}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 flex items-center">
                        <TbCurrencyTaka />{booking.totalPrice}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusUpdate(booking._id, e.target.value)}
                        className="text-sm border rounded px-2 py-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;