import React, { useState, useEffect } from "react";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalBooked: 0,
      pending: 0,
      confirmed: 0,
      cancelled: 0,
      totalSpent: 0
    },
    recentBookings: [],
    user: {
      name: "",
      email: "",
      role: "",
      memberSince: ""
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  // First check if user is authenticated
  const checkAuthAndFetchData = async () => {
    try {
      setLoading(true);
      
      // Check if we have a token
      const token = getAuthToken();
      
      if (!token) {
        setIsAuthenticated(false);
        setError("Please login to access your dashboard");
        setLoading(false);
        return;
      }
      
      console.log("✅ Token found, attempting to fetch dashboard...");
      setIsAuthenticated(true);
      await fetchDashboardData(token);
      
    } catch (err) {
      console.error('Auth check error:', err);
      setError("Authentication failed. Please login again.");
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const fetchDashboardData = async (token) => {
    try {
      console.log("📡 Fetching dashboard data...");
      
      const response = await fetch('http://localhost:5000/api/user/dashboard', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log("📊 Response status:", response.status);
      
      if (response.status === 401) {
        // Token expired or invalid
        console.log("❌ Token expired or invalid (401)");
        clearAuthToken();
        setIsAuthenticated(false);
        setError("Session expired. Please login again.");
        setLoading(false);
        return;
      }
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("📦 Dashboard data received:", data);
      
      if (data.success) {
        setDashboardData(data.data);
        setError(null);
      } else {
        setError(data.message || 'Failed to load dashboard data');
      }
    } catch (err) {
      console.error('❌ Dashboard fetch error:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get auth token
  const getAuthToken = () => {
    if (typeof window === 'undefined') return null;
    
    // Check all possible locations where token might be stored
    const token = 
      localStorage.getItem('firebaseToken') ||
      localStorage.getItem('authToken') ||
      localStorage.getItem('token') ||
      localStorage.getItem('idToken') || // Firebase often uses idToken
      sessionStorage.getItem('firebaseToken') ||
      sessionStorage.getItem('authToken');
    
    console.log("🔍 Looking for token... found:", token ? "Yes" : "No");
    return token;
  };

  // Clear auth token
  const clearAuthToken = () => {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem('firebaseToken');
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('idToken');
    sessionStorage.removeItem('firebaseToken');
    sessionStorage.removeItem('authToken');
    
    console.log("🗑️ Cleared auth tokens");
  };

  const handleLogin = () => {
    // Redirect to your login page
    window.location.href = '/login';
  };

  const handleLogout = () => {
    clearAuthToken();
    setIsAuthenticated(false);
    setDashboardData({
      stats: { totalBooked: 0, pending: 0, confirmed: 0, cancelled: 0, totalSpent: 0 },
      recentBookings: [],
      user: { name: "", email: "", role: "", memberSince: "" }
    });
    window.location.href = '/login';
  };

  const pendingTickets = dashboardData.recentBookings.filter(ticket => ticket.status === 'pending');

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg">Loading your dashboard...</p>
          <p className="text-gray-400 text-sm mt-2">Checking authentication status</p>
        </div>
      </div>
    );
  }

  if (error && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="text-red-500 text-6xl mb-4">🔒</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-3">Authentication Required</h1>
            <p className="text-gray-600 mb-2">{error}</p>
            <p className="text-gray-500 text-sm">You need to be logged in to view your dashboard</p>
          </div>
          
          <div className="space-y-4">
            <button 
              onClick={handleLogin}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium text-lg shadow-md hover:shadow-lg"
            >
              🔐 Go to Login
            </button>
            
            <button 
              onClick={checkAuthAndFetchData}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              🔄 Retry Connection
            </button>
            
            <button 
              onClick={() => {
                console.log("Debug info:");
                console.log("Token:", getAuthToken());
                console.log("LocalStorage:", localStorage);
                testApiConnection();
              }}
              className="w-full py-3 bg-yellow-50 text-yellow-700 rounded-xl hover:bg-yellow-100 transition-colors font-medium text-sm"
            >
              🐛 Debug Info
            </button>
            
            <div className="text-center mt-8 pt-8 border-t border-gray-200">
              <p className="text-gray-500 text-sm">
                Don't have an account?{' '}
                <a href="/register" className="text-blue-600 hover:underline font-medium">
                  Sign up here
                </a>
              </p>
            </div>
          </div>
        </div>
        
        {/* Debug info */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>Server URL: http://localhost:5000</p>
          <p>Token exists: {getAuthToken() ? "Yes" : "No"}</p>
        </div>
      </div>
    );
  }

  // If there's an error but user is authenticated
  if (error && isAuthenticated) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-4xl mx-auto">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-red-100 rounded-full mr-4">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <div>
              <h3 className="font-bold text-red-800 text-xl">Dashboard Error</h3>
              <p className="text-red-600">{error}</p>
              <p className="text-red-500 text-sm mt-2">Please check your connection or contact support</p>
            </div>
          </div>
          <div className="flex space-x-4 mt-6">
            <button 
              onClick={() => fetchDashboardData(getAuthToken())}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
            >
              🔄 Retry
            </button>
            <button 
              onClick={handleLogout}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
            >
              🚪 Logout
            </button>
            <button 
              onClick={testApiConnection}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              🐛 Test API
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {dashboardData.user.name || 'Traveler'}! Manage your bookings and travel plans.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow p-6 mb-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-2xl">
                    {dashboardData.user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <h3 className="font-bold text-xl">{dashboardData.user.name || 'User'}</h3>
                <p className="text-gray-500 text-sm">{dashboardData.user.email}</p>
                <div className="mt-2">
                  <span className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full capitalize">
                    {dashboardData.user.role || 'user'} Account
                  </span>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-600">
                  <span className="mr-3">📅</span>
                  <div>
                    <p className="text-sm">Member since</p>
                    <p className="font-medium">{dashboardData.user.memberSince ? new Date(dashboardData.user.memberSince).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="mr-3">💰</span>
                  <div>
                    <p className="text-sm">Total spent</p>
                    <p className="font-medium">${dashboardData.stats.totalSpent.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              <nav className="space-y-1">
                <a href="/profile" className="flex items-center p-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors">
                  <span className="mr-3">👤</span> Profile
                </a>
                <a href="/my-tickets" className="flex items-center p-3 rounded-lg bg-blue-50 text-blue-600">
                  <span className="mr-3">🎫</span> My Booked Tickets
                </a>
                <a href="/transactions" className="flex items-center p-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors">
                  <span className="mr-3">💳</span> Transaction History
                </a>
                {dashboardData.user.role === 'vendor' && (
                  <a href="/vendor" className="flex items-center p-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors">
                    <span className="mr-3">🏪</span> Vendor Panel
                  </a>
                )}
                {dashboardData.user.role === 'admin' && (
                  <a href="/admin" className="flex items-center p-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors">
                    <span className="mr-3">👑</span> Admin Panel
                  </a>
                )}
              </nav>
              
              <button 
                onClick={handleLogout}
                className="w-full mt-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                🚪 Logout
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <span className="text-blue-600 text-xl">🎫</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Total Booked</p>
                    <p className="text-2xl font-bold">{dashboardData.stats.totalBooked}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <span className="text-yellow-600 text-xl">⏳</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Pending</p>
                    <p className="text-2xl font-bold">{dashboardData.stats.pending}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <span className="text-green-600 text-xl">✅</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Confirmed</p>
                    <p className="text-2xl font-bold">{dashboardData.stats.confirmed}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <span className="text-red-600 text-xl">❌</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Cancelled</p>
                    <p className="text-2xl font-bold">{dashboardData.stats.cancelled}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-xl shadow p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
                  <p className="text-gray-500">Your latest travel bookings</p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => fetchDashboardData(getAuthToken())}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                  >
                    🔄 Refresh
                  </button>
                  <a 
                    href="/my-tickets"
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
                  >
                    📋 View All
                  </a>
                </div>
              </div>
              
              {dashboardData.recentBookings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-300 text-6xl mb-4">✈️</div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No bookings yet</h3>
                  <p className="text-gray-500 mb-6">Start your journey by booking your first ticket!</p>
                  <a 
                    href="/tickets" 
                    className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-medium"
                  >
                    🎫 Browse Available Tickets
                  </a>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket Details</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departure</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {dashboardData.recentBookings.map((booking) => (
                        <tr key={booking._id} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div className="font-medium text-gray-900">{booking.ticketTitle || booking.ticketId?.title}</div>
                            <div className="text-sm text-gray-600 mt-1">
                              {booking.ticketId?.from} → {booking.ticketId?.to}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              ID: {booking.bookingReference}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            {booking.ticketId?.departureAt 
                              ? new Date(booking.ticketId.departureAt).toLocaleDateString()
                              : 'N/A'}
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              booking.status === 'confirmed' 
                                ? 'bg-green-100 text-green-800'
                                : booking.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="font-bold">${booking.totalPrice?.toFixed(2)}</div>
                            <div className="text-xs text-gray-500">
                              {booking.quantity} ticket{booking.quantity > 1 ? 's' : ''}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a href="/tickets" className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 hover:from-blue-100 hover:to-blue-200 transition-all">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-200 rounded-lg">
                    <span className="text-blue-700 text-xl">🔍</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-gray-900">Book Tickets</h4>
                    <p className="text-gray-600 text-sm">Find buses, trains, launches</p>
                  </div>
                </div>
              </a>
              
              <a href="/my-tickets" className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6 hover:from-green-100 hover:to-green-200 transition-all">
                <div className="flex items-center">
                  <div className="p-3 bg-green-200 rounded-lg">
                    <span className="text-green-700 text-xl">📋</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-gray-900">My Bookings</h4>
                    <p className="text-gray-600 text-sm">View all your tickets</p>
                  </div>
                </div>
              </a>
              
              <a href="/profile" className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6 hover:from-purple-100 hover:to-purple-200 transition-all">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-200 rounded-lg">
                    <span className="text-purple-700 text-xl">👤</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-gray-900">Profile</h4>
                    <p className="text-gray-600 text-sm">Update information</p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Debug function
const testApiConnection = async () => {
  try {
    console.log("🔍 Testing API connection...");
    
    // Test server health
    const healthResponse = await fetch('http://localhost:5000/api/health');
    const healthData = await healthResponse.json();
    console.log("✅ Health check:", healthData);
    
    // Check if token exists
    const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('firebaseToken');
    console.log("🔐 Token exists:", token ? "Yes" : "No");
    
    if (token) {
      console.log("🔑 Token preview:", token.substring(0, 20) + "...");
      
      // Test dashboard endpoint
      try {
        const dashResponse = await fetch('http://localhost:5000/api/user/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        console.log("📊 Dashboard response status:", dashResponse.status);
        
        if (dashResponse.status === 401) {
          console.log("❌ Token is invalid or expired");
        } else if (dashResponse.ok) {
          const dashData = await dashResponse.json();
          console.log("✅ Dashboard data:", dashData);
        }
      } catch (dashError) {
        console.error("❌ Dashboard test error:", dashError);
      }
    }
    
  } catch (err) {
    console.error("❌ API test error:", err);
  }
};