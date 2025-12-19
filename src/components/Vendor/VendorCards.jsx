import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function VendorCards() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await api.getVendorCards();
      console.log('Cards response:', response);
      setCards(response.data.data || []);
    } catch (error) {
      console.error('Error fetching cards:', error);
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (cardId) => {
    if (!window.confirm('Are you sure you want to delete this card?')) return;
    
    try {
      await api.deleteVendorCard(cardId);
      fetchCards(); // Refresh list
    } catch (error) {
      console.error('Error deleting card:', error);
      alert('Failed to delete card');
    }
  };

  const handleEdit = (cardId) => {
    // Navigate to edit page or open edit modal
    alert('Edit functionality coming soon!');
  };

  const getStatusBadge = (verified) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    
    const statusText = {
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[verified] || 'bg-gray-100'}`}>
        {statusText[verified] || verified}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Loading cards...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Cards</h2>
        <button
          onClick={() => navigate('/vendor/dashboard?tab=create')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Create New Card
        </button>
      </div>

      {cards.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <div className="text-4xl mb-4">🎟️</div>
          <p className="text-gray-600 mb-4">You haven't created any cards yet.</p>
          <button
            onClick={() => navigate('/vendor/dashboard?tab=create')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Your First Card
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div key={card._id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-gray-900 truncate">{card.title}</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded whitespace-nowrap">
                    ${card.price}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{card.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">📍</span>
                    <span className="truncate">{card.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">👥</span>
                    <span>{card.availableQuantity || card.availableSlots || 0} slots available</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">📅</span>
                    <span>{new Date(card.departureAt || card.startDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div>
                    {getStatusBadge(card.verified)}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDelete(card._id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                    <button 
                      onClick={() => handleEdit(card._id)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}