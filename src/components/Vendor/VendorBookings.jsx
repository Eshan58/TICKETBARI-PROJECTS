import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function VendorBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockBookings = [
        { id: 1, bookingId: 'BK-001', customer: 'John Doe', card: 'Dhaka to Chittagong', date: '2024-01-15', seats: 2, total: 500, status: 'confirmed' },
        { id: 2, bookingId: 'BK-002', customer: 'Jane Smith', card: 'Sylhet Express', date: '2024-01-14', seats: 1, total: 250, status: 'confirmed' },
        { id: 3, bookingId: 'BK-003', customer: 'Mike Johnson', card: 'Khulna Special', date: '2024-01-13', seats: 4, total: 1200, status: 'pending' },
        { id: 4, bookingId: 'BK-004', customer: 'Sarah Williams', card: 'Dhaka to Chittagong', date: '2024-01-12', seats: 3, total: 750, status: 'completed' },
        { id: 5, bookingId: 'BK-005', customer: 'Robert Brown', card: 'Rajshahi Express', date: '2024-01-11', seats: 2, total: 600, status: 'cancelled' },
        { id: 6, bookingId: 'BK-006', customer: 'Emily Davis', card: 'Barisal Cruise', date: '2024-01-10', seats: 1, total: 300, status: 'confirmed' },
      ];

      let filteredBookings = mockBookings;
      if (filter !== 'all') {
        filteredBookings = mockBookings.filter(booking => booking.status === filter);
      }

      setBookings(filteredBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      confirmed: { color: 'bg-green-100 text-green-800', text: 'Confirmed' },
      cancelled: { color: 'bg-red-100 text-red-800', text: 'Cancelled' },
      completed: { color: 'bg-blue-100 text-blue-800', text: 'Completed' }
    };

    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', text: status };
    
    return (
      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewBooking = (bookingId) => {
    // Navigate to booking details
    alert(`View booking ${bookingId} details - Implement navigation`);
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    if (!window.confirm(`Change booking status to ${newStatus}?`)) return;
    
    try {
      // API call to update booking status
      // await api.updateBookingStatus(bookingId, { status: newStatus });
      alert(`Booking ${bookingId} status updated to ${newStatus}`);
      fetchBookings(); // Refresh list
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Failed to update booking status');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        <p className="mt-2 text-gray-600">Loading bookings...</p>
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
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Bookings Management</h1>
        <p className="text-gray-600">Manage and track all customer bookings</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <span className="text-2xl text-blue-600">📅</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-800">{bookings.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg mr-4">
              <span className="text-2xl text-green-600">✅</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Confirmed</p>
              <p className="text-2xl font-bold text-gray-800">
                {bookings.filter(b => b.status === 'confirmed').length}
              </p>
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
              <p className="text-2xl font-bold text-gray-800">
                {bookings.filter(b => b.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <span className="text-2xl text-blue-600">💰</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800">
                ${bookings.reduce((sum, booking) => sum + booking.total, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            filter === 'all' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            filter === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter('confirmed')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            filter === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Confirmed
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            filter === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter('cancelled')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            filter === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Cancelled
        </button>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Card/Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seats
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
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
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{booking.bookingId}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{booking.customer}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{booking.card}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(booking.date)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{booking.seats}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${booking.total}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(booking.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewBooking(booking.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View
                      </button>
                      {booking.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => handleUpdateStatus(booking.id, 'completed')}
                          className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {bookings.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl shadow-lg mt-6">
          <div className="text-4xl mb-4">📅</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-500">No bookings match your current filter.</p>
        </div>
      )}

      {/* Export/Download Section */}
      <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Export Bookings</h3>
        <div className="flex space-x-4">
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm font-medium">
            Export to CSV
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm font-medium">
            Export to Excel
          </button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 text-sm font-medium">
            Print Report
          </button>
        </div>
      </div>
    </div>
  );
}