import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { TbCurrencyTaka } from 'react-icons/tb';
import { 
  FaUser, FaTicketAlt, FaPlus, FaChartBar, 
  FaShoppingCart, FaBars, FaTimes, FaHome,
  FaMoneyBill, FaClipboardList, FaCreditCard
} from 'react-icons/fa';
import api from '../../services/api';

export default function VendorDashboard() {
  const { user, isVendor, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalCards: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    totalRevenue: 0,
    activeBookings: 0,
    monthlyRevenue: 0,
    totalTicketsSold: 0,
    totalTicketsAdded: 0
  });
  
  const [loading, setLoading] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const sidebarRoutes = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaHome />, path: '/vendor/dashboard' },
    { id: 'profile', label: 'Vendor Profile', icon: <FaUser />, path: '/vendor/profile' },
    { id: 'create-card', label: 'Add Ticket', icon: <FaPlus />, path: '/vendor/create-card' },
    { id: 'cards', label: 'My Added Tickets', icon: <FaTicketAlt />, path: '/vendor/cards' },
    { id: 'bookings', label: 'Requested Bookings', icon: <FaShoppingCart />, path: '/vendor/bookings' },
    { id: 'applications', label: 'Applications', icon: <FaClipboardList />, path: '/vendor/applications' },
    { id: 'earnings', label: 'Revenue Overview', icon: <FaChartBar />, path: '/vendor/earnings' },
  ];

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
    
    // Set active tab based on current path
    const currentPath = location.pathname;
    const activeRoute = sidebarRoutes.find(route => currentPath.includes(route.path));
    if (activeRoute) {
      setActiveTab(activeRoute.id);
    }
  }, [user, navigate, isVendor, isAdmin, location]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Try to get vendor stats from API
      const [statsResponse, cardsResponse, bookingsResponse] = await Promise.allSettled([
        api.getVendorStats(),
        api.smartGetVendorCards(),
        api.smartGetVendorBookings({ status: 'pending' })
      ]);

      let totalCards = 0;
      let totalRevenue = 0;
      let activeBookings = 0;
      let pendingApplications = 0;
      let approvedApplications = 0;
      let monthlyRevenue = 0;
      let totalTicketsSold = 0;
      let totalTicketsAdded = 0;

      // Process stats response
      if (statsResponse.status === 'fulfilled' && statsResponse.value?.data?.success) {
        const statsData = statsResponse.value.data.data;
        totalRevenue = statsData.totalRevenue || 0;
        monthlyRevenue = statsData.thisMonthRevenue || 0;
        totalTicketsSold = statsData.totalTicketsSold || 0;
        totalTicketsAdded = statsData.totalTicketsAdded || 0;
      }

      // Process cards response
      if (cardsResponse.status === 'fulfilled' && cardsResponse.value?.data?.success) {
        const cards = cardsResponse.value.data.data || [];
        totalCards = cards.length;
        approvedApplications = cards.filter(card => card.verified === 'approved').length;
        pendingApplications = cards.filter(card => card.verified === 'pending').length;
      }

      // Process bookings response
      if (bookingsResponse.status === 'fulfilled' && bookingsResponse.value?.data?.success) {
        const bookings = bookingsResponse.value.data.data || [];
        activeBookings = bookings.length;
      }

      setStats({
        totalCards,
        pendingApplications,
        approvedApplications,
        totalRevenue,
        activeBookings,
        monthlyRevenue,
        totalTicketsSold,
        totalTicketsAdded
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Fallback to mock data
      setStats({
        totalCards: 12,
        pendingApplications: 3,
        approvedApplications: 24,
        totalRevenue: 2450,
        activeBookings: 8,
        monthlyRevenue: 1250,
        totalTicketsSold: 45,
        totalTicketsAdded: 28
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getCurrentPath = () => {
    const path = window.location.pathname;
    if (path.includes('/vendor/dashboard')) return 'dashboard';
    if (path.includes('/vendor/cards')) return 'cards';
    if (path.includes('/vendor/applications')) return 'applications';
    if (path.includes('/vendor/earnings')) return 'earnings';
    if (path.includes('/vendor/profile')) return 'profile';
    if (path.includes('/vendor/create-card')) return 'create-card';
    if (path.includes('/vendor/bookings')) return 'bookings';
    return 'dashboard';
  };

  useEffect(() => {
    setActiveTab(getCurrentPath());
  }, []);

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
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-md">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 mr-3"
            >
              {showMobileMenu ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="font-bold text-gray-800">Vendor Dashboard</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-800">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar - Desktop */}
        <div className={`hidden lg:block ${sidebarCollapsed ? 'w-20' : 'w-64'} bg-white shadow-lg transition-all duration-300 min-h-screen`}>
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              {!sidebarCollapsed && (
                <Link to={`/dashboard`}><div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold">V</span>
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-800">Vendor Panel</h2>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div></Link>
              )}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            </div>
          </div>

          <nav className="p-4">
            <ul className="space-y-2">
              {sidebarRoutes.map((route) => (
                <li key={route.id}>
                  <Link
                    to={route.path}
                    onClick={() => setActiveTab(route.id)}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                      activeTab === route.id
                        ? 'bg-green-50 text-green-700 border-l-4 border-green-500'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-lg mr-3">{route.icon}</span>
                    {!sidebarCollapsed && <span>{route.label}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="absolute bottom-0 w-full p-4 border-t">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {!sidebarCollapsed && 'Logout'}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileMenu(false)}></div>
            <div className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-lg">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white font-bold">V</span>
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-800">Vendor Panel</h2>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <ul className="space-y-2">
                  {sidebarRoutes.map((route) => (
                    <li key={route.id}>
                      <Link
                        to={route.path}
                        onClick={() => {
                          setActiveTab(route.id);
                          setShowMobileMenu(false);
                        }}
                        className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                          activeTab === route.id
                            ? 'bg-green-50 text-green-700 border-l-4 border-green-500'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span className="text-lg mr-3">{route.icon}</span>
                        <span>{route.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}