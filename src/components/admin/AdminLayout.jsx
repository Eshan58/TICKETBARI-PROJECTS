import React, { useState, useEffect } from "react";
import { Link, useLocation, Outlet, Navigate, NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";

const AdminLayout = () => {
  const location = useLocation();
  const { user, logout, isAdmin, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const adminNavItems = [
    { 
      path: "/admin/dashboard", 
      label: "Dashboard", 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      )
    },
    { 
      path: "/admin/vendor-applications", 
      label: "Vendor Applications", 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      badge: 3
    },
    { 
      path: "/admin/tickets", 
      label: "Ticket Management", 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
      )
    },
    { 
      path: "/admin/users", 
      label: "User Management", 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0c-.828 0-1.5.672-1.5 1.5v4.5c0 .828.672 1.5 1.5 1.5h1.5c.828 0 1.5-.672 1.5-1.5V15c0-.828-.672-1.5-1.5-1.5h-1.5z" />
        </svg>
      )
    },
    { 
      path: "/admin/bookings", 
      label: "Booking Management", 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      path: "/admin/reports", 
      label: "Reports", 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin() || !user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <Link to={`/dashboard`}>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">TB</span>
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-800">TicketBari</h1>
                  <p className="text-xs text-gray-500">ADMINISTRATION PANEL</p>
                </div>
              </div>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {/* <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button> */}

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">{user?.displayName || "Administrator"}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <div className="relative">
                  <img
                    src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'Admin'}&background=3B82F6&color=fff`}
                    alt="Admin"
                    className="w-10 h-10 rounded-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0`}>
          <div className="h-full flex flex-col">
            {/* User Info Section */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'Admin'}&background=3B82F6&color=fff`}
                    alt="Admin"
                    className="w-12 h-12 rounded-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">{user?.displayName || "Administrator"}</h3>
                  <p className="text-sm text-gray-600 truncate">{user?.email}</p>
                  <div className="flex items-center mt-1">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">Super Admin</span>
                    <span className="ml-2 text-xs text-gray-500">ID: #{user?.uid?.slice(-6)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Section */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="mb-6">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">MAIN NAVIGATION</p>
                <nav className="space-y-1">
                  {adminNavItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${isActive 
                          ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                          : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
                            <span className={isActive ? 'text-blue-600' : 'text-gray-600'}>
                              {item.icon}
                            </span>
                          </div>
                          <span className="font-medium">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* System Status Section */}
              <div className="p-3 bg-green-50 border border-green-100 rounded-lg">
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-800">System is operational</p>
                    <p className="text-xs text-green-600 mt-0.5">All services running smoothly</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Logout Section */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={logout}
                className="flex items-center justify-center w-full px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 font-medium rounded-lg border border-red-200 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-02' : ''}`}>
          {/* Page Header */}
          <div className="bg-white border-b border-gray-200">
            <div className="px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {adminNavItems.find(item => item.path === location.pathname)?.label || "Dashboard"}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {location.pathname === "/admin/dashboard" 
                      ? "Overview and analytics" 
                      : `Manage ${adminNavItems.find(item => item.path === location.pathname)?.label.toLowerCase()}`}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Link
                    to="/"
                    className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg border border-gray-300 transition-colors flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    View Site
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-8">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </div>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-200">
            <div className="px-8 py-4">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-sm text-gray-600">
                  © {new Date().getFullYear()} TicketBari Admin Panel. All rights reserved.
                </p>
                <div className="flex items-center space-x-4 mt-2 md:mt-0">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">System Status: Operational</span>
                  </div>
                  <span className="text-xs text-gray-500">v2.1.0</span>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminLayout;