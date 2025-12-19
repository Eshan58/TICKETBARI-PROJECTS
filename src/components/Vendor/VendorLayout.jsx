import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function VendorLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Vendor Navigation */}
      <nav className="bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-white text-xl font-bold">Vendor Dashboard</span>
              </div>
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <Link
                  to="/vendor/dashboard"
                  className="text-green-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/vendor/tickets"
                  className="text-green-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  My Tickets
                </Link>
                <Link
                  to="/vendor/bookings"
                  className="text-green-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Bookings
                </Link>
                <Link
                  to="/vendor/earnings"
                  className="text-green-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Earnings
                </Link>
                <Link
                  to="/vendor/profile"
                  className="text-green-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Profile
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white text-sm">
                {user?.name || user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-white text-green-600 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Logout
              </button>
              <Link
                to="/"
                className="text-white hover:text-gray-200 text-sm font-medium"
              >
                Back to Site
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} TicketBari Vendor Dashboard. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}