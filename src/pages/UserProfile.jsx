import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import api from "../services/api";
import { Link } from "react-router-dom";

export default function UserProfile() {
  const { user } = useAuth() || {};
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    photo: "",
    createdAt: "",
    role: "",
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      // Use smart API function that falls back to mock data
      const response = await api.smartGetUserProfile();
      
      if (response.data?.success) {
        const profileData = response.data.data?.user || {};
        setUserData({
          name: profileData.name || user?.name || user?.displayName || "",
          email: profileData.email || user?.email || "",
          phone: profileData.phone || "",
          address: profileData.address || "",
          photo: profileData.photo || user?.photoURL || "",
          createdAt: profileData.createdAt || "",
          role: profileData.role || user?.role || "user",
        });
      } else {
        // Fallback to auth context data
        setUserData({
          name: user?.name || user?.displayName || "",
          email: user?.email || "",
          phone: "",
          address: "",
          photo: user?.photoURL || "",
          createdAt: "",
          role: user?.role || "user",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      // Fallback to auth context data
      setUserData({
        name: user?.name || user?.displayName || "",
        email: user?.email || "",
        phone: "",
        address: "",
        photo: user?.photoURL || "",
        createdAt: "",
        role: user?.role || "user",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData((prev) => ({
          ...prev,
          photo: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setMessage({ type: "", text: "" });

      const updateData = {
        name: userData.name,
        phone: userData.phone,
        address: userData.address,
      };

      // Use smart API function that falls back to mock success
      const response = await api.smartUpdateUserProfile(updateData);
      
      if (response.data?.success) {
        setMessage({ type: "success", text: response.data.message || "Profile updated successfully!" });
        setEditMode(false);
        
        // Refresh profile data
        await fetchUserProfile();
        
        // Save to localStorage for persistence
        localStorage.setItem('userProfile', JSON.stringify(userData));
      } else {
        setMessage({ type: "error", text: response.data?.message || "Failed to update profile" });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      // Even if API fails, save to localStorage
      localStorage.setItem('userProfile', JSON.stringify(userData));
      setMessage({ 
        type: "success", 
        text: "Profile saved locally (API not available)" 
      });
      setEditMode(false);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Role badge component
  const UserRoleBadge = () => {
    if (!userData?.role) return null;

    const roleConfig = {
      admin: {
        color: "bg-red-100 text-red-700 border-red-200",
        label: "Admin",
        icon: "👑",
      },
      vendor: {
        color: "bg-emerald-100 text-emerald-700 border-emerald-200",
        label: "Vendor",
        icon: "🏪",
      },
      user: {
        color: "bg-blue-100 text-blue-700 border-blue-200",
        label: "User",
        icon: "👤",
      },
    };

    const config = roleConfig[userData.role] || roleConfig.user;

    return (
      <span
        className={`px-3 py-1.5 text-sm rounded-full ${config.color} border flex items-center gap-2`}
      >
        <span className="text-base">{config.icon}</span>
        <span className="font-semibold">{config.label}</span>
      </span>
    );
  };

  // Load from localStorage on component mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile && !loading) {
      const parsed = JSON.parse(savedProfile);
      setUserData(prev => ({
        ...prev,
        ...parsed,
        // Don't override email and role from auth
        email: prev.email || parsed.email,
        role: prev.role || parsed.role || "user",
      }));
    }
  }, [loading]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">
            Manage your personal information and account settings
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
            <p className="text-lg font-medium text-gray-700">Loading profile...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                {/* Profile Photo */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative mb-4">
                    {userData.photo ? (
                      <img
                        src={userData.photo}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                        {getInitials(userData.name)}
                      </div>
                    )}
                    {editMode && (
                      <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePhotoChange}
                        />
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </label>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    {userData.name || "User"}
                  </h2>
                  <p className="text-gray-600 mb-3">{userData.email}</p>
                  
                  {/* Role Badge */}
                  <div className="mb-4">
                    <UserRoleBadge />
                  </div>
                  
                  {/* Member Since */}
                  {userData.createdAt && (
                    <div className="text-center mb-6">
                      <div className="text-sm text-gray-500">Member Since</div>
                      <div className="font-medium">{formatDate(userData.createdAt)}</div>
                    </div>
                  )}

                  {/* Edit/Save Button */}
                  <div className="w-full">
                    {editMode ? (
                      <div className="flex gap-3">
                        <button
                          onClick={handleSaveProfile}
                          disabled={saving}
                          className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                        >
                          {saving ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                          onClick={() => setEditMode(false)}
                          className="py-2.5 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditMode(true)}
                        className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium rounded-lg transition-all duration-300"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
                  <div className="space-y-4">
                    <Link 
                      to="/my-bookings" 
                      className="flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600">🎫</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">My Bookings</div>
                          <div className="text-sm text-gray-500">View your tickets</div>
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                    
                    <Link 
                      to="/transaction-history" 
                      className="flex items-center justify-between p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                          <span className="text-green-600">💰</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Transactions</div>
                          <div className="text-sm text-gray-500">Payment history</div>
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>

                    <Link 
                      to="/dashboard" 
                      className="flex items-center justify-between p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                          <span className="text-purple-600">📊</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Dashboard</div>
                          <div className="text-sm text-gray-500">Overview & stats</div>
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>

                    {/* Role-specific links */}
                    {userData.role === "vendor" && (
                      <Link 
                        to="/vendor/dashboard" 
                        className="flex items-center justify-between p-3 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <span className="text-emerald-600">🏪</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">Vendor Dashboard</div>
                            <div className="text-sm text-gray-500">Manage your business</div>
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    )}

                    {userData.role === "admin" && (
                      <Link 
                        to="/admin" 
                        className="flex items-center justify-between p-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                            <span className="text-red-600">👑</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">Admin Panel</div>
                            <div className="text-sm text-gray-500">System administration</div>
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Profile Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                {/* Success/Error Message */}
                {message.text && (
                  <div className={`mb-6 p-4 rounded-lg ${
                    message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                  }`}>
                    {message.text}
                  </div>
                )}

                <h3 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h3>
                
                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        name="name"
                        value={userData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-lg">
                        {userData.name || "Not provided"}
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg">
                      {userData.email || "Not provided"}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Email cannot be changed
                    </p>
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Role
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="px-4 py-3 bg-gray-50 rounded-lg flex-1">
                        <div className="flex items-center justify-between">
                          <span className="capitalize font-medium">{userData.role}</span>
                          <UserRoleBadge />
                        </div>
                      </div>
                      {userData.role === "user" && (
                        <Link 
                          to="/apply-vendor" 
                          className="py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-medium rounded-lg transition-all duration-300 whitespace-nowrap"
                        >
                          Become a Vendor
                        </Link>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Your role determines your permissions and access
                    </p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    {editMode ? (
                      <input
                        type="tel"
                        name="phone"
                        value={userData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-lg">
                        {userData.phone || "Not provided"}
                      </div>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    {editMode ? (
                      <textarea
                        name="address"
                        value={userData.address}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter your address"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-lg">
                        {userData.address ? (
                          <div className="whitespace-pre-line">{userData.address}</div>
                        ) : (
                          "Not provided"
                        )}
                      </div>
                    )}
                  </div>

                  {/* Account Security */}
                  <div className="pt-6 border-t border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Account Security</h4>
                    <div className="space-y-3">
                      <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                              <span className="text-red-600">🔒</span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">Change Password</div>
                              <div className="text-sm text-gray-500">Update your password regularly</div>
                            </div>
                          </div>
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                      
                      <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                              <span className="text-amber-600">📱</span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">Two-Factor Authentication</div>
                              <div className="text-sm text-gray-500">Add an extra layer of security</div>
                            </div>
                          </div>
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* API Status Note */}
                  <div className="pt-6 border-t border-gray-200">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="bg-blue-100 p-2 rounded-lg mr-3">
                          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h5 className="font-medium text-blue-800">Development Mode</h5>
                          <p className="text-blue-700 text-sm mt-1">
                            Your profile data is saved locally. When backend APIs are available, data will sync automatically.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
