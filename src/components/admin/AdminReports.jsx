import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    tickets: 0,
    bookings: 0,
    pendingApprovals: 0,
    pendingVendorApplications: 0,
    vendors: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const dashboardRes = await api.apiGet("/api/admin/dashboard");
      
      if (dashboardRes.data.success) {
        setStats(dashboardRes.data.data);
      }

      // Mock recent activity
      setRecentActivity([
        { id: 1, type: "user", action: "registered", name: "John Doe", time: "2 min ago" },
        { id: 2, type: "ticket", action: "created", name: "Dhaka to Chittagong", time: "15 min ago" },
        { id: 3, type: "booking", action: "completed", name: "Booking #TB-12345", time: "1 hour ago" },
        { id: 4, type: "vendor", action: "applied", name: "Travel Express", time: "3 hours ago" },
        { id: 5, type: "ticket", action: "approved", name: "Khulna to Sylhet", time: "5 hours ago" },
      ]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "user": return "👤";
      case "ticket": return "🎫";
      case "booking": return "📅";
      case "vendor": return "🏪";
      default: return "📝";
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "user": return "bg-blue-100 text-blue-800";
      case "ticket": return "bg-green-100 text-green-800";
      case "booking": return "bg-purple-100 text-purple-800";
      case "vendor": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor and manage your platform activities</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
            Last updated: Just now
          </div>
          <button 
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Users Card */}
        <div className="bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <span className="text-2xl text-blue-600">👥</span>
            </div>
            <span className="text-sm font-medium text-gray-500">Total</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-2">{stats.users}</h3>
          <p className="text-gray-600 mb-4">Registered Users</p>
          <Link 
            to="/admin/users" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            View Details
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Tickets Card */}
        <div className="bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <span className="text-2xl text-green-600">🎫</span>
            </div>
            <span className="text-sm font-medium text-gray-500">Total</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-2">{stats.tickets}</h3>
          <p className="text-gray-600 mb-4">Platform Tickets</p>
          <Link 
            to="/admin/tickets" 
            className="inline-flex items-center text-green-600 hover:text-green-700 font-medium text-sm"
          >
            Manage Tickets
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Pending Approvals Card */}
        <div className="bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <span className="text-2xl text-yellow-600">⏳</span>
            </div>
            <div className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
              Pending
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-2">{stats.pendingApprovals}</h3>
          <p className="text-gray-600 mb-4">Ticket Approvals</p>
          <Link 
            to="/admin/tickets" 
            className="inline-flex items-center text-yellow-600 hover:text-yellow-700 font-medium text-sm"
          >
            Review Now
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Vendor Applications Card */}
        <div className="bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <span className="text-2xl text-purple-600">🏪</span>
            </div>
            <div className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
              New
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-2">{stats.pendingVendorApplications}</h3>
          <p className="text-gray-600 mb-4">Vendor Applications</p>
          <Link 
            to="/admin/vendor-applications" 
            className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium text-sm"
          >
            Review Apps
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Two Column Layout: Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions Section */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">Quick Actions</h2>
            <p className="text-gray-600 text-sm mt-1">Perform common administrative tasks</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <Link
                to="/admin/vendor-applications"
                className="flex items-center justify-between p-4 border rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <span className="text-xl text-blue-600">📋</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Vendor Applications</h3>
                    <p className="text-sm text-gray-600">{stats.pendingVendorApplications} pending review</p>
                  </div>
                </div>
                <span className="text-gray-400 group-hover:text-blue-600 transition-colors">→</span>
              </Link>

              <Link
                to="/admin/tickets"
                className="flex items-center justify-between p-4 border rounded-lg hover:border-green-300 hover:bg-green-50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <span className="text-xl text-green-600">✅</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Ticket Approvals</h3>
                    <p className="text-sm text-gray-600">{stats.pendingApprovals} pending approval</p>
                  </div>
                </div>
                <span className="text-gray-400 group-hover:text-green-600 transition-colors">→</span>
              </Link>

              <Link
                to="/admin/users"
                className="flex items-center justify-between p-4 border rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <span className="text-xl text-purple-600">👑</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">User Management</h3>
                    <p className="text-sm text-gray-600">{stats.users} registered users</p>
                  </div>
                </div>
                <span className="text-gray-400 group-hover:text-purple-600 transition-colors">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All
              </button>
            </div>
            <p className="text-gray-600 text-sm mt-1">Latest platform activities</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                    <span className="text-lg">{getActivityIcon(activity.type)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">
                      <span className="capitalize">{activity.name}</span> {activity.action}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                        {activity.type}
                      </span>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* System Status Section */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">System Status</h2>
          <p className="text-gray-600 text-sm mt-1">Current platform health and metrics</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-xl">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">API Server</h3>
                  <p className="text-sm text-gray-600">Backend Services</p>
                </div>
              </div>
              <div className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full inline-block">
                Operational
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-xl">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Database</h3>
                  <p className="text-sm text-gray-600">Primary Storage</p>
                </div>
              </div>
              <div className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full inline-block">
                Connected
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-xl">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Authentication</h3>
                  <p className="text-sm text-gray-600">User Auth System</p>
                </div>
              </div>
              <div className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full inline-block">
                Active
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-600 text-xl">⚠</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Pending Tasks</h3>
                  <p className="text-sm text-gray-600">Requires Attention</p>
                </div>
              </div>
              <div className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full inline-block">
                {stats.pendingApprovals + stats.pendingVendorApplications} Items
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-sm">💡</span>
              </div>
              <div>
                <p className="text-blue-800 font-medium">Administrator Tip</p>
                <p className="text-blue-700 text-sm mt-1">
                  Review pending vendor applications and ticket approvals daily to maintain platform quality and ensure timely service for users.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;