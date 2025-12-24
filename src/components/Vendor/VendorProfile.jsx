import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function VendorProfile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    businessType: '',
    address: '',
    city: '',
    country: 'Bangladesh',
    bio: '',
    website: '',
    facebook: '',
    twitter: '',
    instagram: '',
  });

  const [profilePicture, setProfilePicture] = useState('');

  useEffect(() => {
    fetchVendorProfile();
  }, []);

  const fetchVendorProfile = async () => {
    try {
      setLoading(true);
      const response = await api.smartGetVendorProfile();
      const vendorData = response.data.data?.user || {};
      
      setProfileData({
        name: vendorData.name || user?.name || '',
        email: vendorData.email || user?.email || '',
        phone: vendorData.phone || user?.phone || '',
        businessName: vendorData.businessName || user?.businessName || '',
        businessType: vendorData.businessType || user?.businessType || '',
        address: vendorData.address || user?.address || '',
        city: vendorData.city || user?.city || '',
        country: vendorData.country || user?.country || 'Bangladesh',
        bio: vendorData.bio || user?.bio || '',
        website: vendorData.website || user?.website || '',
        facebook: vendorData.facebook || user?.facebook || '',
        twitter: vendorData.twitter || user?.twitter || '',
        instagram: vendorData.instagram || user?.instagram || '',
      });
      
      setProfilePicture(vendorData.photo || user?.photo || user?.photoURL || '');
    } catch (error) {
      console.error('Error fetching vendor profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      // Upload to imgbb
      const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
      if (!IMGBB_API_KEY) {
        setError('Image upload API key not configured');
        return;
      }

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      if (data.success) {
        setProfilePicture(data.data.url);
        setSuccess('Profile picture uploaded successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error?.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      setError('Failed to upload profile picture');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Validate
      if (!profileData.name || !profileData.email) {
        throw new Error('Name and email are required');
      }

      // Update profile with picture
      const updatedProfile = {
        ...profileData,
        photo: profilePicture,
        role: 'vendor'
      };

      const response = await api.smartUpdateVendorProfile(updatedProfile);
      
      // Update auth context
      if (response.data.data?.user) {
        updateUser(response.data.data.user);
      }
      
      setSuccess('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = () => {
    alert('Password change functionality coming soon!');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion requested. This feature is under development.');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        <p className="mt-2 text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Vendor Profile</h1>
        <p className="text-gray-600">Display profile picture, name, email, role etc.</p>
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
              <h3 className="text-sm font-medium text-green-800">Success</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>{success}</p>
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

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6">
          {/* Profile Header with Picture */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white text-4xl font-bold">
                {profilePicture ? (
                  <img 
                    src={profilePicture} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = profileData.name?.charAt(0) || 'V';
                    }}
                  />
                ) : (
                  profileData.name?.charAt(0) || 'V'
                )}
              </div>
              <label htmlFor="profile-picture" className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input 
                  id="profile-picture" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleProfilePictureChange}
                />
              </label>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{profileData.name || 'Vendor Name'}</h2>
              <p className="text-gray-600 mb-4">{profileData.email || 'vendor@example.com'}</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {user?.role || 'Vendor'}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {user?.verified ? 'Verified' : 'Pending Verification'}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleChange}
                  required
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="+880 1XXX XXXXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={profileData.businessName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Your business name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Type
                </label>
                <select
                  name="businessType"
                  value={profileData.businessType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select type</option>
                  <option value="transport">Transport Service</option>
                  <option value="events">Events & Entertainment</option>
                  <option value="tourism">Tourism & Travel</option>
                  <option value="retail">Retail</option>
                  <option value="services">Services</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={profileData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Bangladesh"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={profileData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Street address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={profileData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="City"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={profileData.website}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio / About
              </label>
              <textarea
                name="bio"
                value={profileData.bio}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Tell us about your business..."
              />
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Social Media Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facebook
                  </label>
                  <input
                    type="url"
                    name="facebook"
                    value={profileData.facebook}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="https://facebook.com/username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Twitter
                  </label>
                  <input
                    type="url"
                    name="twitter"
                    value={profileData.twitter}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="https://twitter.com/username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instagram
                  </label>
                  <input
                    type="url"
                    name="instagram"
                    value={profileData.instagram}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="https://instagram.com/username"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-lg hover:from-green-600 hover:to-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={handleChangePassword}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Change Password
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Account Information */}
      <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Account Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Account Type</p>
            <p className="font-medium capitalize">{user?.role || 'Vendor'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Member Since</p>
            <p className="font-medium">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Account Status</p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Active
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Verification Status</p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {user?.verified ? 'Verified' : 'Pending Verification'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}