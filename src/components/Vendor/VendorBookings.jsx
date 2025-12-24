import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function VendorBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockBookings = [
        { 
          id: 1, 
          bookingId: 'BK-001', 
          customer: { name: 'John Doe', email: 'john@example.com', phone: '0123456789' },
          ticket: { title: 'Dhaka to Chittagong', price: 500 },
          date: '2024-01-15T10:30:00', 
          seats: 2, 
          totalPrice: 1000, 
          status: 'pending',
          createdAt: '2024-01-14T15:30:00'
        },
        { 
          id: 2, 
          bookingId: 'BK-002', 
          customer: { name: 'Jane Smith', email: 'jane@example.com', phone: '0123456789' },
          ticket: { title: 'Sylhet Express', price: 250 },
          date: '2024-01-14T08:00:00', 
          seats: 1, 
          totalPrice: 250, 
          status: 'accepted',
          createdAt: '2024-01-13T14:20:00'
        },
        { 
          id: 3, 
          bookingId: 'BK-003', 
          customer: { name: 'Mike Johnson', email: 'mike@example.com', phone: '0123456789' },
          ticket: { title: 'Khulna Special', price: 300 },
          date: '2024-01-13T14:00:00', 
          seats: 4, 
          totalPrice: 1200, 
          status: 'pending',
          createdAt: '2024-01-12T11:15:00'
        },
        { 
          id: 4, 
          bookingId: 'BK-004', 
          customer: { name: 'Sarah Williams', email: 'sarah@example.com', phone: '0123456789' },
          ticket: { title: 'Dhaka to Chittagong', price: 250 },
          date: '2024-01-12T09:00:00', 
          seats: 3, 
          totalPrice: 750, 
          status: 'accepted',
          createdAt: '2024-01-11T16:45:00'
        },
        { 
          id: 5, 
          bookingId: 'BK-005', 
          customer: { name: 'Robert Brown', email: 'robert@example.com', phone: '0123456789' },
          ticket: { title: 'Rajshahi Express', price: 300 },
          date: '2024-01-11T12:00:00', 
          seats: 2, 
          totalPrice: 600, 
          status: 'rejected',
          createdAt: '2024-01-10T10:30:00'
        },
        { 
          id: 6, 
          bookingId: 'BK-006', 
          customer: { name: 'Emily Davis', email: 'emily@example.com', phone: '0123456789' },
          ticket: { title: 'Barisal Cruise', price: 300 },
          date: '2024-01-10T16:00:00', 
          seats: 1, 
          totalPrice: 300, 
          status: 'accepted',
          createdAt: '2024-01-09T13:20:00'
        },
      ];

      let filteredBookings = mockBookings;
      if (filter !== 'all') {
        filteredBookings = mockBookings.filter(booking => booking.status === filter);
      }

      setBookings(filteredBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: '⏳', label: 'Pending' },
      accepted: { color: 'bg-green-100 text-green-800', icon: '✅', label: 'Accepted' },
      rejected: { color: 'bg-red-100 text-red-800', icon: '❌', label: 'Rejected' },
      completed: { color: 'bg-blue-100 text-blue-800', icon: '✓', label: 'Completed' },
      cancelled: { color: 'bg-gray-100 text-gray-800', icon: '✗', label: 'Cancelled' }
    };

    const config = statusConfig[status] || { color: 'bg-gray-100', icon: '❓', label: status };
    
    return (
      <span className={`px-3 py-1 inline-flex items-center text-xs font-semibold rounded-full ${config.color}`}>
        <span className="mr-1">{config.icon}</span>
        {config.label}
      </span>
    );
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusUpdate = async (bookingId, action) => {
    if (!window.confirm(`${action === 'accept' ? 'Accept' : 'Reject'} this booking?`)) return;
    
    try {
      // API call to update booking status
      // await api.updateBookingStatus(bookingId, { status: action === 'accept' ? 'accepted' : 'rejected' });
      alert(`Booking ${bookingId} ${action}ed successfully!`);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/vendor/dashboard')}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Requested Bookings</h1>
        <p className="text-gray-600">Table with user name/email, ticket title, quantity, total price, Accept/Reject buttons</p>
      </div>

      {/* Filter Buttons */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
            filter === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter('accepted')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
            filter === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Accepted
        </button>
        <button
          onClick={() => setFilter('rejected')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
            filter === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Rejected
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
            filter === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
            filter === 'all' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Bookings
        </button>
      </div>

      {/* Stats Cards */}
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
              <p className="text-sm text-gray-500">Accepted</p>
              <p className="text-2xl font-bold text-gray-800">
                {bookings.filter(b => b.status === 'accepted').length}
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
            <div className="p-3 bg-purple-100 rounded-lg mr-4">
              <span className="text-2xl text-purple-600">💰</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800">
                {formatCurrency(bookings.reduce((sum, booking) => sum + booking.totalPrice, 0))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
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
                  Ticket
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seats
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Price
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
                    <div>
                      <div className="font-medium text-gray-900">{booking.customer?.name || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{booking.customer?.email || 'N/A'}</div>
                      <div className="text-xs text-gray-400">Phone: {booking.customer?.phone || 'Not provided'}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{booking.ticket?.title}</div>
                    <div className="text-sm text-gray-500">Price: {formatCurrency(booking.ticket?.price)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(booking.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-center">
                      <span className="inline-block px-2 py-1 bg-gray-100 rounded-full text-sm font-medium">
                        {booking.seats}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-lg font-bold text-green-600">
                      {formatCurrency(booking.totalPrice)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(booking.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {booking.status === 'pending' ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusUpdate(booking.id, 'accept')}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 font-medium"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(booking.id, 'reject')}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 font-medium"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <div className="text-gray-500 text-sm">
                        Action completed
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {bookings.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg mt-6">
          <div className="text-4xl mb-4">📅</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-500">No booking requests match your current filter.</p>
        </div>
      )}

      {/* Export Section */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-1">Export Bookings</h3>
            <p className="text-sm text-gray-500">Download booking reports in different formats</p>
          </div>
          <div className="flex flex-wrap gap-3">
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
    </div>
  );
}