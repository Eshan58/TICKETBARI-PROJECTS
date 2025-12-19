import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTickets: 0,
    totalBookings: 0,
    pendingApprovals: 0,
    pendingVendorApplications: 0,
    totalVendors: 0,
    revenue: 0,
    growthRate: 0,
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [timeFilter, setTimeFilter] = useState("today");
  const [systemStatus, setSystemStatus] = useState({
    apiServer: "online",
    database: "connected",
    firebaseAuth: "active",
    uptime: "99.9%",
  });
  const [chartData, setChartData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [notifications, setNotifications] = useState([]);

  const fetchDashboardData = useCallback(async () => {
    if (!user || user.role !== "admin") {
      navigate("/unauthorized");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // console.log("🔄 Fetching admin dashboard data...");
      
      // Fetch main dashboard stats
      const dashboardRes = await api.getAdminDashboard();
      
      if (dashboardRes.data?.success) {
        const data = dashboardRes.data.data;
        // console.log("📊 Dashboard data received:", data);
        
        // Set stats
        setStats({
          totalUsers: data.stats?.users || 0,
          totalTickets: data.stats?.tickets || 0,
          totalBookings: data.stats?.bookings || 0,
          pendingApprovals: data.stats?.pendingApprovals || 0,
          pendingVendorApplications: data.stats?.pendingVendorApplications || 0,
          totalVendors: data.stats?.vendors || 0,
          revenue: data.stats?.revenue || 0,
          growthRate: data.stats?.growthRate || 0,
        });
        
        // Process recent activity
        const activity = [];
        
        // Add recent users
        if (data.recent?.users) {
          data.recent.users.forEach(user => {
            activity.push({
              id: user._id,
              type: "user",
              action: "registered",
              name: user.name || user.email,
              time: new Date(user.createdAt).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              }),
              timestamp: new Date(user.createdAt),
            });
          });
        }
        
        // Add recent tickets
        if (data.recent?.tickets) {
          data.recent.tickets.forEach(ticket => {
            activity.push({
              id: ticket._id,
              type: "ticket",
              action: ticket.verified === "pending" ? "submitted" : "approved",
              name: ticket.title,
              time: new Date(ticket.createdAt).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              }),
              timestamp: new Date(ticket.createdAt),
              status: ticket.verified,
            });
          });
        }
        
        // Add recent vendor applications
        if (data.recent?.applications) {
          data.recent.applications.forEach(app => {
            activity.push({
              id: app._id,
              type: "vendor",
              action: "applied",
              name: app.businessName,
              time: new Date(app.createdAt).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              }),
              timestamp: new Date(app.createdAt),
              status: app.status,
            });
          });
        }
        
        // Sort by timestamp and limit to 8
        activity.sort((a, b) => b.timestamp - a.timestamp);
        setRecentActivity(activity.slice(0, 8));
        
        // Generate chart data (mock for now)
        setChartData(generateChartData());
        
        // Set last updated time
        setLastUpdated(new Date());
        
        // Check system status
        await checkSystemStatus();
        
      } else {
        throw new Error(dashboardRes.data?.message || "Failed to fetch dashboard data");
      }
      
    } catch (error) {
      console.error("❌ Error fetching dashboard data:", error);
      setError(error.message);
      
      // Use enhanced fallback data
      setStats(getFallbackStats());
      setRecentActivity(getFallbackActivity());
      setChartData(generateChartData());
      
    } finally {
      setLoading(false);
    }
  }, [user, navigate]);

  const getFallbackStats = () => ({
    totalUsers: 156,
    totalTickets: 342,
    totalBookings: 128,
    pendingApprovals: 12,
    pendingVendorApplications: 5,
    totalVendors: 24,
    revenue: 12500,
    growthRate: 12.5,
  });

  const getFallbackActivity = () => [
    { 
      id: 1, 
      type: "user", 
      action: "registered", 
      name: "John Doe", 
      time: "2 min ago",
      status: "success"
    },
    { 
      id: 2, 
      type: "ticket", 
      action: "created", 
      name: "Dhaka to Chittagong", 
      time: "15 min ago",
      status: "pending"
    },
    { 
      id: 3, 
      type: "booking", 
      action: "completed", 
      name: "Booking #TB-12345", 
      time: "1 hour ago",
      status: "success"
    },
    { 
      id: 4, 
      type: "vendor", 
      action: "applied", 
      name: "Travel Express", 
      time: "3 hours ago",
      status: "pending"
    },
    { 
      id: 5, 
      type: "ticket", 
      action: "approved", 
      name: "Khulna to Sylhet", 
      time: "5 hours ago",
      status: "approved"
    },
  ];

  const generateChartData = () => ({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Users',
        data: [65, 78, 66, 44, 56, 67, 75],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
      },
      {
        label: 'Tickets',
        data: [40, 68, 86, 74, 56, 60, 87],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
      },
      {
        label: 'Revenue',
        data: [2400, 3200, 2800, 4000, 3600, 4200, 4800],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        yAxisID: 'y1',
      }
    ]
  });

  const checkSystemStatus = async () => {
    try {
      const healthRes = await api.getHealthStatus();
      const status = {
        apiServer: healthRes.data?.status === "healthy" ? "online" : "offline",
        database: healthRes.data?.services?.database === "connected" ? "connected" : "disconnected",
        firebaseAuth: healthRes.data?.services?.firebase === "initialized" ? "active" : "inactive",
        uptime: "99.9%",
      };
      setSystemStatus(status);
    } catch (err) {
      setSystemStatus({
        apiServer: "offline",
        database: "disconnected",
        firebaseAuth: "inactive",
        uptime: "unknown",
      });
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Auto-refresh every 30 seconds if enabled
    let interval;
    if (autoRefresh) {
      interval = setInterval(fetchDashboardData, 30000);
    }
    
    // Check for new notifications every minute
    const notificationInterval = setInterval(async () => {
      try {
        const pendingAppsRes = await api.getVendorApplications({ status: "pending" });
        const pendingTicketsRes = await api.getAdminTickets({ verified: "pending" });
        
        const newNotifications = [];
        
        if (pendingAppsRes.data?.data?.applications?.length > 0) {
          newNotifications.push({
            id: Date.now(),
            type: "vendor",
            message: `${pendingAppsRes.data.data.applications.length} new vendor applications pending`,
            priority: "high",
            timestamp: new Date(),
          });
        }
        
        if (pendingTicketsRes.data?.data?.tickets?.length > 0) {
          newNotifications.push({
            id: Date.now() + 1,
            type: "ticket",
            message: `${pendingTicketsRes.data.data.tickets.length} tickets need approval`,
            priority: "medium",
            timestamp: new Date(),
          });
        }
        
        if (newNotifications.length > 0) {
          setNotifications(prev => [...newNotifications, ...prev].slice(0, 5));
        }
      } catch (err) {
        // console.log("Error checking notifications:", err);
      }
    }, 60000);
    
    return () => {
      if (interval) clearInterval(interval);
      clearInterval(notificationInterval);
    };
  }, [fetchDashboardData, autoRefresh]);

  const refreshDashboard = () => {
    fetchDashboardData();
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "online":
      case "connected":
      case "active":
      case "success":
      case "approved":
        return "bg-emerald-100 text-emerald-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "offline":
      case "disconnected":
      case "inactive":
      case "error":
        return "bg-rose-100 text-rose-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "user": return "👤";
      case "ticket": return "🎫";
      case "booking": return "📅";
      case "vendor": return "🏢";
      case "payment": return "💰";
      default: return "📝";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-rose-500";
      case "medium": return "bg-amber-500";
      case "low": return "bg-blue-500";
      default: return "bg-slate-500";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatTimeAgo = (date) => {
    if (!date) return "Just now";
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (loading && !stats.totalUsers) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="mt-6 text-lg font-medium text-slate-700">Loading Admin Dashboard...</p>
          <p className="mt-2 text-sm text-slate-500">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-slate-600 mt-2">
              Welcome back, <span className="font-semibold text-blue-600">{user?.name || "Admin"}</span>!
              {lastUpdated && (
                <span className="ml-2 text-sm text-slate-500">
                  Last updated: {formatTimeAgo(lastUpdated)}
                </span>
              )}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all ${
                autoRefresh 
                  ? "bg-blue-100 text-blue-600 hover:bg-blue-200" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${autoRefresh ? "bg-blue-500 animate-pulse" : "bg-slate-400"}`}></span>
              Auto-refresh {autoRefresh ? "ON" : "OFF"}
            </button>
            
            <button
              onClick={refreshDashboard}
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all flex items-center gap-2 text-sm font-medium text-slate-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
        
        {error && (
          <div className="mt-4 p-4 bg-gradient-to-r from-rose-50 to-rose-100 border border-rose-200 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center border border-rose-200">
                <span className="text-rose-500 text-xl">⚠️</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-rose-800">Using fallback data</p>
                <p className="text-sm text-rose-600 mt-1">{error}</p>
                <p className="text-xs text-rose-500 mt-2">Check backend console for details</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="mb-8">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <span className="text-amber-600">🔔</span>
                </div>
                <h3 className="font-semibold text-amber-800">Pending Actions</h3>
              </div>
              <button
                onClick={clearNotifications}
                className="text-sm text-amber-600 hover:text-amber-800"
              >
                Clear all
              </button>
            </div>
            <div className="space-y-2">
              {notifications.map(notification => (
                <div 
                  key={notification.id}
                  className="flex items-center justify-between p-3 bg-white rounded-xl border border-amber-100"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${getPriorityColor(notification.priority)}`}></span>
                    <p className="text-sm text-slate-700">{notification.message}</p>
                  </div>
                  <span className="text-xs text-slate-500">
                    {formatTimeAgo(notification.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Users Card */}
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl border border-blue-100 p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300 group">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-blue-600 mb-1">Total Users</p>
              <h3 className="text-3xl font-bold text-slate-900">{stats.totalUsers.toLocaleString()}</h3>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-2xl text-blue-600">👥</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Link 
              to="/admin/users" 
              className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              View all
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              +{stats.growthRate}%
            </span>
          </div>
        </div>

        {/* Pending Actions Card */}
        <div className="bg-gradient-to-br from-white to-amber-50 rounded-2xl border border-amber-100 p-6 hover:shadow-xl hover:border-amber-200 transition-all duration-300 group">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-amber-600 mb-1">Pending Actions</p>
              <h3 className="text-3xl font-bold text-slate-900">
                {stats.pendingApprovals + stats.pendingVendorApplications}
              </h3>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-2xl text-amber-600">⏳</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Vendor Applications</span>
              <Link 
                to="/admin/vendor-applications" 
                className="text-sm font-medium text-amber-600 hover:text-amber-800"
              >
                {stats.pendingVendorApplications} pending
              </Link>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Ticket Approvals</span>
              <Link 
                to="/admin/tickets?verified=pending" 
                className="text-sm font-medium text-amber-600 hover:text-amber-800"
              >
                {stats.pendingApprovals} pending
              </Link>
            </div>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl border border-emerald-100 p-6 hover:shadow-xl hover:border-emerald-200 transition-all duration-300 group">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-emerald-600 mb-1">Total Revenue</p>
              <h3 className="text-3xl font-bold text-slate-900">{formatCurrency(stats.revenue)}</h3>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-2xl text-emerald-600">💰</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">This month</span>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                +24.5%
              </span>
              <Link 
                to="/admin/reports" 
                className="text-sm font-medium text-emerald-600 hover:text-emerald-800"
              >
                Reports
              </Link>
            </div>
          </div>
        </div>

        {/* Tickets & Bookings Card */}
        <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl border border-purple-100 p-6 hover:shadow-xl hover:border-purple-200 transition-all duration-300 group">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-purple-600 mb-1">Tickets & Bookings</p>
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">{stats.totalTickets.toLocaleString()}</h3>
                  <p className="text-xs text-slate-500">Tickets</p>
                </div>
                <div className="w-px h-8 bg-purple-200"></div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">{stats.totalBookings.toLocaleString()}</h3>
                  <p className="text-xs text-slate-500">Bookings</p>
                </div>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-2xl text-purple-600">🎫</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Link 
              to="/admin/tickets" 
              className="text-sm font-medium text-purple-600 hover:text-purple-800 flex items-center gap-1"
            >
              Manage tickets
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link 
              to="/admin/bookings" 
              className="text-sm font-medium text-purple-600 hover:text-purple-800"
            >
              View bookings
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Priority tasks</span>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Review Vendor Applications */}
              <Link
                to="/admin/vendor-applications"
                className="group bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-xl p-5 hover:shadow-lg hover:border-blue-300 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-xl text-blue-600">📋</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-1">Review Vendor Applications</h3>
                    <p className="text-sm text-slate-600 mb-3">
                      {stats.pendingVendorApplications} applications pending review
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        High Priority
                      </span>
                      <span className="text-sm text-blue-600 group-hover:translate-x-1 transition-transform">
                        Review now →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Approve Tickets */}
              <Link
                to="/admin/tickets?verified=pending"
                className="group bg-gradient-to-r from-emerald-50 to-white border border-emerald-100 rounded-xl p-5 hover:shadow-lg hover:border-emerald-300 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-xl text-emerald-600">✅</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-1">Approve Tickets</h3>
                    <p className="text-sm text-slate-600 mb-3">
                      {stats.pendingApprovals} tickets need verification
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                        Medium Priority
                      </span>
                      <span className="text-sm text-emerald-600 group-hover:translate-x-1 transition-transform">
                        Verify now →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Manage Users */}
              <Link
                to="/admin/users"
                className="group bg-gradient-to-r from-purple-50 to-white border border-purple-100 rounded-xl p-5 hover:shadow-lg hover:border-purple-300 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-xl text-purple-600">👑</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-1">Manage Users</h3>
                    <p className="text-sm text-slate-600 mb-3">
                      {stats.totalUsers.toLocaleString()} total users, {stats.totalVendors} vendors
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                        Regular Task
                      </span>
                      <span className="text-sm text-purple-600 group-hover:translate-x-1 transition-transform">
                        Manage →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* View Reports */}
              <Link
                to="/admin/reports"
                className="group bg-gradient-to-r from-amber-50 to-white border border-amber-100 rounded-xl p-5 hover:shadow-lg hover:border-amber-300 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-xl text-amber-600">📊</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-1">View Reports</h3>
                    <p className="text-sm text-slate-600 mb-3">
                      Detailed analytics and performance metrics
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                        Analytics
                      </span>
                      <span className="text-sm text-amber-600 group-hover:translate-x-1 transition-transform">
                        View reports →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
              <select 
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div 
                  key={activity.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getStatusColor(activity.status)}`}>
                    <span className="text-lg">{getActivityIcon(activity.type)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate">
                      {activity.name}
                    </p>
                    <p className="text-sm text-slate-600 capitalize">
                      {activity.action}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-slate-500 whitespace-nowrap">
                    {activity.time}
                  </span>
                </div>
              ))}
              
              {recentActivity.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl text-slate-400">📝</span>
                  </div>
                  <p className="text-slate-500">No recent activity</p>
                </div>
              )}
              
              {recentActivity.length > 0 && (
                <Link 
                  to="/admin/activity" 
                  className="block text-center text-sm font-medium text-blue-600 hover:text-blue-800 pt-4 border-t border-slate-200"
                >
                  View all activity →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* System Status & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* System Status */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">System Status</h2>
          
          <div className="space-y-4">
            {Object.entries(systemStatus).map(([key, value]) => (
              <div 
                key={key}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(value)}`}></div>
                  <div>
                    <p className="font-medium text-slate-900 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-sm text-slate-600">
                      {key === "uptime" ? "Service reliability" : "Current status"}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(value)}`}>
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-white rounded-xl border border-blue-100">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">💡 Tip:</span> Monitor system performance regularly. 
              High response times may indicate server load issues.
            </p>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Performance Metrics</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600">⚡</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">99.9%</p>
                  <p className="text-sm text-slate-600">Uptime</p>
                </div>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{width: "99.9%"}}></div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <span className="text-emerald-600">🚀</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{"<"} 200ms</p>
                  <p className="text-sm text-slate-600">Avg. Response</p>
                </div>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{width: "95%"}}></div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <span className="text-amber-600">👥</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">+{stats.growthRate}%</p>
                  <p className="text-sm text-slate-600">User Growth</p>
                </div>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{width: `${Math.min(stats.growthRate, 100)}%`}}></div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600">💯</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">98.5%</p>
                  <p className="text-sm text-slate-600">Satisfaction</p>
                </div>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{width: "98.5%"}}></div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <Link 
              to="/admin/settings/performance" 
              className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              View detailed performance analytics
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-600">
              TicketBari Admin Dashboard v2.0 • {new Date().getFullYear()}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Data updates every 30 seconds • Last refresh: {formatTimeAgo(lastUpdated)}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/settings")}
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Settings
            </button>
            <button
              onClick={() => navigate("/admin/help")}
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Help & Support
            </button>
            <button
              onClick={() => window.print()}
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Print Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;