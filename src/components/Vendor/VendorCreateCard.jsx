import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

export default function VendorCreateCard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    location: '',
    departureLocation: '',
    destination: '',
    availableSeats: '',
    departureAt: '',
    arrivalAt: '',
    features: '',
    termsConditions: '',
  });

  const categories = [
    'Bus Ticket',
    'Train Ticket',
    'Flight Ticket',
    'Event Ticket',
    'Concert',
    'Sports',
    'Movie',
    'Workshop',
    'Conference',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeatureChange = (e) => {
    const featuresArray = e.target.value.split('\n').filter(f => f.trim() !== '');
    setFormData(prev => ({
      ...prev,
      features: featuresArray
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      const requiredFields = ['title', 'price', 'category', 'location', 'availableSeats', 'departureAt'];
      for (const field of requiredFields) {
        if (!formData[field]) {
          throw new Error(`${field} is required`);
        }
      }

      // Validate numbers
      if (parseFloat(formData.price) <= 0) {
        throw new Error('Price must be greater than 0');
      }

      if (parseInt(formData.availableSeats) <= 0) {
        throw new Error('Available seats must be greater than 0');
      }

      // Prepare data
      const cardData = {
        ...formData,
        vendor: user?._id || user?.id,
        price: parseFloat(formData.price),
        availableSeats: parseInt(formData.availableSeats),
        verified: 'pending', // Default status
        features: Array.isArray(formData.features) ? formData.features : [],
        termsConditions: formData.termsConditions || '',
      };

    //   console.log('Creating card:', cardData);

      // API call
      const response = await api.createVendorCard(cardData);
    //   console.log('Card created:', response.data);

      setSuccess(true);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        category: '',
        location: '',
        departureLocation: '',
        destination: '',
        availableSeats: '',
        departureAt: '',
        arrivalAt: '',
        features: '',
        termsConditions: '',
      });

      // Redirect after success
      setTimeout(() => {
        navigate('/vendor/cards');
      }, 3000);

    } catch (error) {
      console.error('Create card error:', error);
      setError(error.response?.data?.message || error.message || 'Failed to create card');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
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
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Create New Card/Ticket</h1>
        <p className="text-gray-600">Create a new card or ticket for your services</p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Card Created Successfully!</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>Your card has been created and is pending admin approval. Redirecting to your cards...</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">Basic Information</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., Dhaka to Chittagong Bus Service"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Describe your card/ticket details..."
            />
          </div>

          {/* Location & Travel Details */}
          <div className="md:col-span-2 mt-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">Location & Travel Details</h2>
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., Dhaka Bus Terminal"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Departure Location
            </label>
            <input
              type="text"
              name="departureLocation"
              value={formData.departureLocation}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., Dhaka"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destination
            </label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., Chittagong"
            />
          </div>

          {/* Price & Availability */}
          <div className="md:col-span-2 mt-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">Price & Availability</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (৳) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Seats *
            </label>
            <input
              type="number"
              name="availableSeats"
              value={formData.availableSeats}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Number of seats"
            />
          </div>

          {/* Date & Time */}
          <div className="md:col-span-2 mt-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">Date & Time</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Departure Date & Time *
            </label>
            <input
              type="datetime-local"
              name="departureAt"
              value={formData.departureAt}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Arrival Date & Time
            </label>
            <input
              type="datetime-local"
              name="arrivalAt"
              value={formData.arrivalAt}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Features */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Features (one per line)
            </label>
            <textarea
              name="features"
              value={formData.features}
              onChange={handleFeatureChange}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="AC Bus
WiFi Available
Refreshments
Comfortable Seats"
            />
          </div>

          {/* Terms & Conditions */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Terms & Conditions
            </label>
            <textarea
              name="termsConditions"
              value={formData.termsConditions}
              onChange={handleChange}
              rows="2"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Terms and conditions for this card/ticket..."
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/vendor/dashboard')}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-lg hover:from-green-600 hover:to-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating...
              </>
            ) : (
              'Create Card'
            )}
          </button>
        </div>
      </form>

      {/* Help Text */}
      <div className="mt-6 p-6 bg-blue-50 rounded-xl">
        <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Important Information
        </h3>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• All cards require admin approval before appearing publicly</li>
          <li>• You can track approval status in your "My Cards" section</li>
          <li>• Once approved, users can book/purchase your cards</li>
          <li>• You'll receive notifications for new bookings</li>
          <li>• Make sure all information is accurate before submitting</li>
        </ul>
      </div>
    </div>
  );
}