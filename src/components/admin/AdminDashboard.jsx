import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api"

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
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold mb-2">Welcome back, Admin!</h1>
        <p className="opacity-90">Here's what's happening with your platform today.</p>
        <div className="mt-4 flex items-center gap-2">
          <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">Live Updates</span>
          <span className="text-sm">Last updated: Just now</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <h3 className="text-3xl font-bold mt-2">{stats.users}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/admin/users" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View all users →
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Tickets</p>
              <h3 className="text-3xl font-bold mt-2">{stats.tickets}</h3>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🎫</span>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/admin/tickets" className="text-green-600 hover:text-green-800 text-sm font-medium">
              Manage tickets →
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Approvals</p>
              <h3 className="text-3xl font-bold mt-2">{stats.pendingApprovals}</h3>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">⏳</span>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/admin/tickets" className="text-yellow-600 hover:text-yellow-800 text-sm font-medium">
              Review tickets →
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Vendor Applications</p>
              <h3 className="text-3xl font-bold mt-2">{stats.pendingVendorApplications}</h3>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🏪</span>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/admin/vendor-applications" className="text-purple-600 hover:text-purple-800 text-sm font-medium">
              Review applications →
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/vendor-applications"
            className="p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">📋</span>
              </div>
              <div>
                <h3 className="font-semibold">Review Vendor Apps</h3>
                <p className="text-sm text-gray-600">{stats.pendingVendorApplications} pending</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/tickets"
            className="p-4 border rounded-lg hover:bg-green-50 hover:border-green-200 transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">✅</span>
              </div>
              <div>
                <h3 className="font-semibold">Approve Tickets</h3>
                <p className="text-sm text-gray-600">{stats.pendingApprovals} pending</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/users"
            className="p-4 border rounded-lg hover:bg-purple-50 hover:border-purple-200 transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">👑</span>
              </div>
              <div>
                <h3 className="font-semibold">Manage Users</h3>
                <p className="text-sm text-gray-600">{stats.users} total users</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                  <span className="text-lg">{getActivityIcon(activity.type)}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">
                    <span className="capitalize">{activity.name}</span> {activity.action}
                  </p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 p-2 text-center text-blue-600 hover:text-blue-800 font-medium">
            View all activity →
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-bold mb-4">System Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600">✓</span>
                </div>
                <span className="font-medium">API Server</span>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">Online</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600">✓</span>
                </div>
                <span className="font-medium">Database</span>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">Connected</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600">✓</span>
                </div>
                <span className="font-medium">Firebase Auth</span>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">Active</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600">⚠</span>
                </div>
                <span className="font-medium">Pending Actions</span>
              </div>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                {stats.pendingApprovals + stats.pendingVendorApplications}
              </span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Review pending vendor applications and ticket approvals regularly to keep the platform running smoothly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;