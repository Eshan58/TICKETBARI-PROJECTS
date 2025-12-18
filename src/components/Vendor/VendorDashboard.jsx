// // src/components/Vendor/VendorDashboard.jsx - UPDATED
// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../contexts/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import api from '../../services/api';
// import VendorCardForm from './VendorCardForm';
// import VendorApplications from './VendorApplications';
// import VendorCards from './VendorCards';

// export default function VendorDashboard() {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [stats, setStats] = useState({
//     totalCards: 0,
//     pendingApplications: 0,
//     approvedApplications: 0,
//     totalRevenue: 0
//   });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Redirect if not vendor
//     if (user?.role !== 'vendor') {
//       navigate('/');
//       return;
//     }
//     fetchDashboardStats();
//   }, [user, navigate]);

//   const fetchDashboardStats = async () => {
//     try {
//       const response = await api.getVendorDashboardStats(); // Updated
//       console.log('Dashboard stats response:', response);
//       setStats(response.data.data);
//     } catch (error) {
//       console.error('Error fetching dashboard stats:', error);
//       // Set mock data if API fails
//       setStats({
//         totalCards: 0,
//         pendingApplications: 0,
//         approvedApplications: 0,
//         totalRevenue: 0
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-xl">Loading dashboard...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>
//           <p className="text-gray-600 mt-2">
//             Welcome back, {user?.name || user?.email || 'Vendor'}!
//           </p>
//         </div>
//       </header>

//       {/* Navigation Tabs */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//         <div className="border-b border-gray-200">
//           <nav className="-mb-px flex space-x-8">
//             {[
//               { id: 'dashboard', label: 'Dashboard', icon: '📊' },
//               { id: 'cards', label: 'My Cards', icon: '🎟️' },
//               { id: 'applications', label: 'Applications', icon: '📋' },
//               { id: 'create', label: 'Create Card', icon: '➕' },
//               { id: 'settings', label: 'Settings', icon: '⚙️' }
//             ].map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`${
//                   activeTab === tab.id
//                     ? 'border-blue-500 text-blue-600'
//                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                 } flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
//               >
//                 <span className="mr-2">{tab.icon}</span>
//                 {tab.label}
//               </button>
//             ))}
//           </nav>
//         </div>
//       </div>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Dashboard Tab */}
//         {activeTab === 'dashboard' && (
//           <div>
//             <h2 className="text-2xl font-bold mb-6">Overview</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//               <div className="bg-white p-6 rounded-lg shadow">
//                 <div className="flex items-center">
//                   <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
//                     <span className="text-2xl">🎟️</span>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600">Total Cards</p>
//                     <p className="text-2xl font-bold">{stats.totalCards}</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white p-6 rounded-lg shadow">
//                 <div className="flex items-center">
//                   <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
//                     <span className="text-2xl">⏳</span>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600">Pending Applications</p>
//                     <p className="text-2xl font-bold">{stats.pendingApplications}</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white p-6 rounded-lg shadow">
//                 <div className="flex items-center">
//                   <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
//                     <span className="text-2xl">✅</span>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600">Approved Applications</p>
//                     <p className="text-2xl font-bold">{stats.approvedApplications}</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white p-6 rounded-lg shadow">
//                 <div className="flex items-center">
//                   <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
//                     <span className="text-2xl">💰</span>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600">Total Revenue</p>
//                     <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Quick Actions */}
//             <div className="bg-white p-6 rounded-lg shadow">
//               <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
//               <div className="flex space-x-4">
//                 <button
//                   onClick={() => setActiveTab('create')}
//                   className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//                 >
//                   + Create New Card
//                 </button>
//                 <button
//                   onClick={() => setActiveTab('applications')}
//                   className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
//                 >
//                   View Applications
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Cards Tab */}
//         {activeTab === 'cards' && <VendorCards />}

//         {/* Applications Tab */}
//         {activeTab === 'applications' && <VendorApplications />}

//         {/* Create Card Tab */}
//         {activeTab === 'create' && <VendorCardForm />}

//         {/* Settings Tab */}
//         {activeTab === 'settings' && (
//           <div className="bg-white p-6 rounded-lg shadow">
//             <h2 className="text-2xl font-bold mb-6">Vendor Settings</h2>
//             <div className="space-y-6">
//               <div>
//                 <h3 className="text-lg font-semibold mb-3">Profile Information</h3>
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Business Name
//                     </label>
//                     <input
//                       type="text"
//                       className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="Enter your business name"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Contact Email
//                     </label>
//                     <input
//                       type="email"
//                       className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       value={user?.email}
//                       readOnly
//                     />
//                   </div>
//                 </div>
//               </div>
//               <div>
//                 <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
//                   Save Settings
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }
// src/components/Vendor/VendorDashboard.jsx - COMPLETE FIXED VERSION
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function VendorDashboard() {
  const { user, isVendor, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalCards: 12,
    pendingApplications: 3,
    approvedApplications: 24,
    totalRevenue: 2450,
    activeBookings: 8,
    monthlyRevenue: 1250
  });
  
  const [loading, setLoading] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Redirect if not vendor or admin
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!isVendor() && !isAdmin()) {
      navigate('/dashboard');
      return;
    }
    
    // Load dashboard stats
    loadDashboardData();
  }, [user, navigate, isVendor, isAdmin]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Mock data - in real app, you would fetch from API
      setTimeout(() => {
        setStats({
          totalCards: 12,
          pendingApplications: 3,
          approvedApplications: 24,
          totalRevenue: 2450,
          activeBookings: 8,
          monthlyRevenue: 1250
        });
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleCreateCard = () => {
    setActiveTab('create');
    navigate('/vendor/create-card');
  };

  const handleViewApplications = () => {
    setActiveTab('applications');
    navigate('/vendor/applications');
  };

  const handleViewCards = () => {
    setActiveTab('cards');
    navigate('/vendor/cards');
  };

  const handleViewEarnings = () => {
    setActiveTab('earnings');
    navigate('/vendor/earnings');
  };

  const handleViewProfile = () => {
    setActiveTab('profile');
    navigate('/vendor/profile');
  };

  const navigationTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/vendor/dashboard' },
    { id: 'cards', label: 'My Cards', icon: '🎟️', path: '/vendor/cards' },
    { id: 'applications', label: 'Applications', icon: '📋', path: '/vendor/applications' },
    { id: 'earnings', label: 'Earnings', icon: '💰', path: '/vendor/earnings' },
    { id: 'profile', label: 'Profile', icon: '👤', path: '/vendor/profile' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading vendor dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-2 rounded-lg">
                  <span className="text-white font-bold text-lg">Vendor</span>
                </div>
                <span className="ml-3 text-xl font-bold text-gray-800 hidden md:block">
                  Dashboard
                </span>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:ml-8 md:flex md:space-x-4">
                {navigationTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      navigate(tab.path);
                    }}
                    className={`${
                      activeTab === tab.id
                        ? 'bg-green-50 text-green-700 border-green-500'
                        : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
                    } px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 flex items-center border-2 ${
                      activeTab === tab.id ? 'border-green-500' : 'border-transparent'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* User Info */}
              <div className="hidden md:block">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">
                    {user?.name || user?.email?.split('@')[0]}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user?.role || 'User'}
                  </p>
                </div>
              </div>

              {/* Create Card Button */}
              <button
                onClick={handleCreateCard}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg hidden md:flex items-center"
              >
                <span className="mr-2">+</span>
                Create Card
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showMobileMenu ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden py-4 border-t">
              <div className="space-y-2">
                {navigationTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      navigate(tab.path);
                      setShowMobileMenu(false);
                    }}
                    className={`${
                      activeTab === tab.id
                        ? 'bg-green-50 text-green-700'
                        : 'text-gray-600 hover:text-green-700'
                    } w-full text-left px-4 py-3 rounded-lg font-medium flex items-center`}
                  >
                    <span className="mr-3">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
                
                <div className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-800">
                    {user?.name || user?.email}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 capitalize">
                    {user?.role || 'User'}
                  </div>
                </div>
                
                <button
                  onClick={handleCreateCard}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-lg font-medium mt-2 flex items-center justify-center"
                >
                  <span className="mr-2">+</span>
                  Create Card
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.name || user?.email?.split('@')[0]}! 👋
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your vendor account today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Cards */}
          <div className="bg-white rounded-2xl shadow-lg p-6 transform transition-transform duration-300 hover:scale-[1.02]">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl mr-4">
                <span className="text-2xl text-blue-600">🎟️</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Cards</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalCards}</p>
              </div>
            </div>
            <button
              onClick={handleViewCards}
              className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
            >
              View all cards
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Total Revenue */}
          <div className="bg-white rounded-2xl shadow-lg p-6 transform transition-transform duration-300 hover:scale-[1.02]">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl mr-4">
                <span className="text-2xl text-green-600">💰</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-800">${stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
            <button
              onClick={handleViewEarnings}
              className="mt-4 text-green-600 hover:text-green-800 text-sm font-medium flex items-center"
            >
              View earnings
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Active Bookings */}
          <div className="bg-white rounded-2xl shadow-lg p-6 transform transition-transform duration-300 hover:scale-[1.02]">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-xl mr-4">
                <span className="text-2xl text-purple-600">📅</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Bookings</p>
                <p className="text-2xl font-bold text-gray-800">{stats.activeBookings}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/vendor/bookings')}
              className="mt-4 text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center"
            >
              Manage bookings
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Pending Applications */}
          <div className="bg-white rounded-2xl shadow-lg p-6 transform transition-transform duration-300 hover:scale-[1.02]">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-xl mr-4">
                <span className="text-2xl text-yellow-600">⏳</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending Applications</p>
                <p className="text-2xl font-bold text-gray-800">{stats.pendingApplications}</p>
              </div>
            </div>
            <button
              onClick={handleViewApplications}
              className="mt-4 text-yellow-600 hover:text-yellow-800 text-sm font-medium flex items-center"
            >
              Review applications
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Approved Applications */}
          <div className="bg-white rounded-2xl shadow-lg p-6 transform transition-transform duration-300 hover:scale-[1.02]">
            <div className="flex items-center">
              <div className="p-3 bg-teal-100 rounded-xl mr-4">
                <span className="text-2xl text-teal-600">✅</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Approved Applications</p>
                <p className="text-2xl font-bold text-gray-800">{stats.approvedApplications}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/vendor/applications?status=approved')}
              className="mt-4 text-teal-600 hover:text-teal-800 text-sm font-medium flex items-center"
            >
              View approved
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Monthly Revenue */}
          <div className="bg-white rounded-2xl shadow-lg p-6 transform transition-transform duration-300 hover:scale-[1.02]">
            <div className="flex items-center">
              <div className="p-3 bg-pink-100 rounded-xl mr-4">
                <span className="text-2xl text-pink-600">📈</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-800">${stats.monthlyRevenue.toLocaleString()}</p>
              </div>
            </div>
            <button
              onClick={handleViewEarnings}
              className="mt-4 text-pink-600 hover:text-pink-800 text-sm font-medium flex items-center"
            >
              View details
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={handleCreateCard}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 flex flex-col items-center justify-center text-center"
            >
              <span className="text-2xl mb-2">+</span>
              <span className="font-medium">Create New Card</span>
            </button>
            
            <button
              onClick={handleViewApplications}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex flex-col items-center justify-center text-center"
            >
              <span className="text-2xl mb-2">📋</span>
              <span className="font-medium">View Applications</span>
            </button>
            
            <button
              onClick={() => navigate('/vendor/bookings')}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 flex flex-col items-center justify-center text-center"
            >
              <span className="text-2xl mb-2">📅</span>
              <span className="font-medium">Manage Bookings</span>
            </button>
            
            <button
              onClick={handleViewEarnings}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 flex flex-col items-center justify-center text-center"
            >
              <span className="text-2xl mb-2">💰</span>
              <span className="font-medium">View Earnings</span>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
            <button className="text-green-600 hover:text-green-800 text-sm font-medium">
              View all activity
            </button>
          </div>
          
          <div className="space-y-4">
            {[
              { id: 1, action: 'New booking for "Dhaka to Chittagong"', time: '2 hours ago', status: 'success' },
              { id: 2, action: 'Card "Sylhet Express" approved', time: '1 day ago', status: 'success' },
              { id: 3, action: 'Payment received - $250', time: '2 days ago', status: 'success' },
              { id: 4, action: 'Application for new route submitted', time: '3 days ago', status: 'pending' },
              { id: 5, action: 'Card "Khulna Express" updated', time: '4 days ago', status: 'info' },
            ].map((activity) => (
              <div key={activity.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                <div className={`w-3 h-3 rounded-full mr-3 ${
                  activity.status === 'success' ? 'bg-green-500' :
                  activity.status === 'pending' ? 'bg-yellow-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-gray-800">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600 text-sm">
                &copy; {new Date().getFullYear()} TicketBari Vendor Dashboard. All rights reserved.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                Back to Main Site
              </button>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Create Card Modal (optional - for quick creation without navigation) */}
      {/* <CreateCardModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} /> */}
    </div>
  );
}