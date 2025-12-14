import React, { useState, useEffect } from "react";
import { Link, useLocation, Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";

const AdminLayout = () => {
  const location = useLocation();
  const { user, logout, isAdmin, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const adminNavItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/admin/vendor-applications", label: "Vendor Applications", icon: "📋" },
    { path: "/admin/tickets", label: "Ticket Management", icon: "🎫" },
    { path: "/admin/users", label: "User Management", icon: "👥" },
    { path: "/admin/bookings", label: "Booking Management", icon: "📅" },
    { path: "/admin/reports", label: "Reports", icon: "📈" },
    { path: "/admin/settings", label: "Settings", icon: "⚙️" },
  ];

  // Redirect non-admin users
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-blue-600 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin() || !user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-900 to-purple-900 text-white transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between p-6 border-b border-blue-800">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">TicketBari</h1>
              <p className="text-xs text-blue-300">Admin Panel</p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-blue-800 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 border-b border-blue-800">
          <div className="flex items-center gap-3">
            <img
              src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'Admin'}&background=random&color=fff&bold=true`}
              alt="Admin"
              className="w-12 h-12 rounded-full border-2 border-blue-400"
            />
            <div>
              <h3 className="font-semibold">{user?.displayName || "Admin User"}</h3>
              <p className="text-sm text-blue-300">Administrator</p>
              <p className="text-xs text-blue-400">{user?.email}</p>
            </div>
          </div>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {adminNavItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    location.pathname === item.path
                      ? "bg-white text-blue-900 font-semibold shadow-lg"
                      : "hover:bg-blue-800 hover:text-white"
                  }`}
                  onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                  {location.pathname === item.path && (
                    <span className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-blue-800">
          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-300 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`lg:pl-64 transition-all duration-300 ${sidebarOpen ? 'lg:pl-64' : ''}`}>
        {/* Header */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-40">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-xl font-bold text-gray-800">
                {adminNavItems.find(item => item.path === location.pathname)?.label || "Admin Dashboard"}
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Online</span>
              </div>
              
              <Link to="/" className="p-2 hover:bg-gray-100 rounded-lg" title="Go to Website">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-white border-t px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <p>© {new Date().getFullYear()} TicketBari Admin Panel. All rights reserved.</p>
            <div className="flex items-center gap-4 mt-2 md:mt-0">
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                System Status: <span className="font-semibold">Online</span>
              </span>
              <span className="text-xs">v1.0.0</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminLayout;