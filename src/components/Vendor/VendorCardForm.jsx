import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function VendorCardForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    location: '',
    availableSlots: '',
    startDate: '',
    endDate: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Validate form
      if (!formData.title || !formData.description || !formData.price || 
          !formData.category || !formData.location || !formData.availableSlots || 
          !formData.startDate || !formData.endDate) {
        throw new Error('Please fill all required fields');
      }

      if (parseFloat(formData.price) <= 0) {
        throw new Error('Price must be greater than 0');
      }

      if (parseInt(formData.availableSlots) <= 0) {
        throw new Error('Available slots must be greater than 0');
      }

      // Prepare data for API
      const cardData = {
        ...formData,
        price: parseFloat(formData.price),
        availableSlots: parseInt(formData.availableSlots)
      };

      console.log('Submitting card data:', cardData);
      
      // Send to API
      const response = await api.createVendorCard(cardData);
      console.log('Create card response:', response);

      setSuccess(true);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        category: '',
        location: '',
        availableSlots: '',
        startDate: '',
        endDate: ''
      });

      // Redirect to cards tab after success
      setTimeout(() => {
        navigate('/vendor/dashboard?tab=cards');
      }, 2000);

    } catch (error) {
      console.error('Error creating card:', error);
      setError(error.message || 'Failed to create card. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Create New Card</h2>
        <p className="text-gray-600 mt-1">Fill in the details for your new card/ticket</p>
      </div>
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          ✅ Card created successfully! Redirecting to your cards...
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Summer Music Festival 2024"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your event or card offering..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price ($) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select category</option>
              <option value="sports">Sports</option>
              <option value="concert">Concert</option>
              <option value="theater">Theater</option>
              <option value="workshop">Workshop</option>
              <option value="conference">Conference</option>
              <option value="festival">Festival</option>
              <option value="exhibition">Exhibition</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location/Venue *
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Dhaka Stadium, Road 12, Dhaka"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Slots *
            </label>
            <input
              type="number"
              name="availableSlots"
              value={formData.availableSlots}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Number of slots"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date & Time *
            </label>
            <input
              type="datetime-local"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date & Time *
            </label>
            <input
              type="datetime-local"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/vendor/dashboard?tab=cards')}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              'Create Card'
            )}
          </button>
        </div>
      </form>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">ℹ️ Note:</h3>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• Cards will be reviewed by admin before appearing publicly</li>
          <li>• You can track approval status in "My Cards" tab</li>
          <li>• Once approved, users can apply for your cards</li>
          <li>• You'll be notified when someone applies for your cards</li>
        </ul>
      </div>
    </div>
  );
}