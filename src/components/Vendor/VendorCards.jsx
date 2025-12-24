import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function VendorCards() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCards();
  }, [filter]);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const response = await api.getVendorCards();
      let filteredCards = response.data.data || [];
      
      if (filter !== 'all') {
        filteredCards = filteredCards.filter(card => card.verified === filter);
      }
      
      setCards(filteredCards);
    } catch (error) {
      console.error('Error fetching cards:', error);
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (cardId) => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) return;
    
    try {
      await api.deleteVendorCard(cardId);
      fetchCards(); // Refresh list
    } catch (error) {
      console.error('Error deleting card:', error);
      alert('Failed to delete ticket');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: '⏳', label: 'Pending' },
      approved: { color: 'bg-green-100 text-green-800', icon: '✅', label: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800', icon: '❌', label: 'Rejected' },
      active: { color: 'bg-blue-100 text-blue-800', icon: '🚀', label: 'Active' },
      completed: { color: 'bg-gray-100 text-gray-800', icon: '✓', label: 'Completed' }
    };

    const config = statusConfig[status] || { color: 'bg-gray-100', icon: '❓', label: status };
    
    return (
      <span className={`px-3 py-1 inline-flex items-center text-xs font-semibold rounded-full ${config.color}`}>
        <span className="mr-1">{config.icon}</span>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        <p className="mt-2 text-gray-600">Loading tickets...</p>
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
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Added Tickets</h1>
            <p className="text-gray-600">3-column grid, shows info and verification status (pending/approved/rejected)</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'all' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              All ({cards.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'approved' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Rejected
            </button>
          </div>
        </div>
      </div>

      {cards.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <div className="text-4xl mb-4">🎫</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
          <p className="text-gray-500 mb-6">You haven't created any tickets yet.</p>
          <button
            onClick={() => navigate('/vendor/create-card')}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 font-medium"
          >
            Create Your First Ticket
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div key={card._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Image Section */}
              {card.image && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={card.image} 
                    alt={card.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              
              {/* Content Section */}
              <div className="p-5">
                {/* Ticket Header */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg truncate">{card.title}</h3>
                    <div className="flex items-center mt-1">
                      <span className="text-sm text-gray-600">{card.from} → {card.to}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">৳{card.price}</div>
                    <div className="text-xs text-gray-500">per ticket</div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mb-4">
                  {getStatusBadge(card.verified || card.status)}
                </div>

                {/* Ticket Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatDate(card.departureAt)} at {formatTime(card.departureAt)}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>{card.availableSeats || card.availableQuantity || 0} seats available</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="capitalize">{card.transportType || card.category}</span>
                  </div>
                </div>

                {/* Perks */}
                {card.perks && Object.keys(card.perks).some(key => card.perks[key]) && (
                  <div className="mb-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-2">Perks:</p>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(card.perks).map(([key, value]) => 
                        value && (
                          <span key={key} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full capitalize">
                            {key}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-4 border-t border-gray-100 flex justify-between">
                  <div className="text-xs text-gray-500">
                    Created: {formatDate(card.createdAt)}
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(card._id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Summary */}
      {cards.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <span className="text-2xl text-green-600">🎫</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Tickets</p>
                <p className="text-2xl font-bold text-gray-800">{cards.length}</p>
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
                  {cards.filter(c => c.verified === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <span className="text-2xl text-blue-600">✅</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Approved</p>
                <p className="text-2xl font-bold text-gray-800">
                  {cards.filter(c => c.verified === 'approved').length}
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
                <p className="text-sm text-gray-500">Total Value</p>
                <p className="text-2xl font-bold text-gray-800">
                  ৳{cards.reduce((sum, card) => sum + (card.price * (card.availableSeats || card.availableQuantity || 1)), 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}