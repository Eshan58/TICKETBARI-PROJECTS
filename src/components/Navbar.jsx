import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Navbar() {
  const auth = useAuth() || {};
  const { user, logout, loading } = auth;
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [location]);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileMenuOpen && !event.target.closest('.profile-menu-container')) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileMenuOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Base navigation items for all users
  const baseNavItems = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/tickets", label: "Tickets", icon: "🎫" },
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
  ];

  // Add vendor application link for non-vendor users
  const vendorNavItem = user?.role !== "vendor" && user?.role !== "admin"
    ? { path: "/apply-vendor", label: "Become a Vendor", icon: "🏪" }
    : null;

  // Add admin link for admin users
  const adminNavItem = user?.role === "admin"
    ? { path: "/admin", label: "Admin Panel", icon: "👑" }
    : null;

  // Combine all navigation items
  const navItems = [
    ...baseNavItems,
    ...(vendorNavItem ? [vendorNavItem] : []),
    ...(adminNavItem ? [adminNavItem] : []),
  ];

  // Loading skeleton
  if (loading) {
    return (
      <header className="sticky top-0 z-50">
        <div className="bg-white backdrop-blur-lg border-b border-gray-100">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
                <div className="h-6 w-32 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="flex gap-4">
                <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
                <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return "";
    return user.name || user.displayName || user.email?.split("@")[0] || "User";
  };

  // Get user email
  const getUserEmail = () => {
    if (!user) return "";
    return user.email || "";
  };

  // Get user photo
  const getUserPhoto = () => {
    if (!user) return null;
    
    if (user.photoURL) return user.photoURL;
    if (user.photo) return user.photo;
    
    const name = getUserDisplayName();
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4f46e5&color=fff&bold=true`;
  };

  // Role badge component
  const UserRoleBadge = () => {
    if (!user?.role) return null;
    
    const roleConfig = {
      admin: { color: "bg-red-100 text-red-700 border-red-200", label: "Admin", icon: "👑" },
      vendor: { color: "bg-emerald-100 text-emerald-700 border-emerald-200", label: "Vendor", icon: "🏪" },
      user: { color: "bg-blue-100 text-blue-700 border-blue-200", label: "User", icon: "👤" },
    };
    
    const config = roleConfig[user.role];
    if (!config) return null;
    
    return (
      <span className={`px-2.5 py-1 text-xs rounded-full ${config.color} border flex items-center gap-1.5`}>
        <span className="text-sm">{config.icon}</span>
        <span className="font-medium">{config.label}</span>
      </span>
    );
  };

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "shadow-md" : ""}`}>
        <div className={`${isScrolled ? "bg-white/95 backdrop-blur-md border-b border-gray-100" : "bg-white border-b border-gray-100"} transition-all duration-300`}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link to="/" className="group flex items-center gap-3 transition-transform duration-300 hover:scale-[1.02]">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow transition-all duration-300">
                    <span className="text-xl">🚍</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    TicketBari
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    Travel with Confidence
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`group relative px-4 py-2.5 rounded-lg transition-all duration-200 mx-1 ${
                      location.pathname === item.path
                        ? "text-indigo-600 font-semibold bg-indigo-50"
                        : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-base mr-2">{item.icon}</span>
                    {item.label}
                    {location.pathname === item.path && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                    )}
                  </Link>
                ))}
              </nav>

              {/* Auth Section */}
              <div className="hidden md:flex items-center gap-3">
                {!user ? (
                  <div className="flex items-center gap-3">
                    <Link
                      to="/login"
                      className="px-5 py-2.5 rounded-lg text-gray-700 font-medium hover:text-indigo-600 hover:bg-gray-50 transition-colors duration-200"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-sm hover:shadow hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                    >
                      Get Started
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 profile-menu-container">
                    {/* User info */}
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-800">
                          {getUserDisplayName()}
                        </span>
                        <UserRoleBadge />
                      </div>
                      <span className="text-xs text-gray-500 truncate max-w-[180px]">
                        {getUserEmail()}
                      </span>
                    </div>
                    
                    {/* Profile dropdown toggle */}
                    <div className="relative">
                      <button
                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                        className="relative group focus:outline-none"
                      >
                        <div className="w-10 h-10 rounded-xl border-2 border-white shadow-sm overflow-hidden bg-gray-100">
                          <img
                            src={getUserPhoto()}
                            alt="Profile"
                            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                            onError={(e) => {
                              const name = getUserDisplayName();
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4f46e5&color=fff`;
                            }}
                          />
                        </div>
                      </button>

                      {/* Profile Dropdown Menu */}
                      {isProfileMenuOpen && (
                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                          {/* User info in dropdown */}
                          <div className="px-4 py-3 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
                                <img
                                  src={getUserPhoto()}
                                  alt="Profile"
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const name = getUserDisplayName();
                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4f46e5&color=fff`;
                                  }}
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-gray-800 truncate">
                                  {getUserDisplayName()}
                                </p>
                                <p className="text-sm text-gray-500 truncate">{getUserEmail()}</p>
                              </div>
                            </div>
                          </div>

                          {/* Menu Items */}
                          <div className="py-2">
                            <Link
                              to="/dashboard"
                              className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                              onClick={() => setIsProfileMenuOpen(false)}
                            >
                              <span className="text-lg">📊</span>
                              <span>Dashboard</span>
                            </Link>

                            <Link
                              to="/user/profile"
                              className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                              onClick={() => setIsProfileMenuOpen(false)}
                            >
                              <span className="text-lg">👤</span>
                              <span>My Profile</span>
                            </Link>

                            <Link
                              to="/my-bookings"
                              className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                              onClick={() => setIsProfileMenuOpen(false)}
                            >
                              <span className="text-lg">🎫</span>
                              <span>My Bookings</span>
                            </Link>

                            {/* Vendor specific links */}
                            {/* {user.role === "vendor" && (
                              <Link
                                to="/vendor/dashboard"
                                className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                                onClick={() => setIsProfileMenuOpen(false)}
                              >
                                <span className="text-lg">🏪</span>
                                <span>Vendor Dashboard</span>
                              </Link>
                            )} */}
                            {user?.role === "vendor" && (
  <Link
    to="/vendor/dashboard"
    className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
    onClick={() => setIsProfileMenuOpen(false)}
  >
    <span className="text-xl">🏪</span>
    <span className="font-medium">Vendor Dashboard</span>
  </Link>
)}

                            {/* Admin specific links */}
                            {user.role === "admin" && (
                              <>
                                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                  Admin Panel
                                </div>
                                <Link
                                  to="/admin"
                                  className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                                  onClick={() => setIsProfileMenuOpen(false)}
                                >
                                  <span className="text-lg">👑</span>
                                  <span>Admin Dashboard</span>
                                </Link>
                                <Link
                                  to="/admin/vendor-applications"
                                  className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                                  onClick={() => setIsProfileMenuOpen(false)}
                                >
                                  <span className="text-lg">📋</span>
                                  <span>Vendor Applications</span>
                                </Link>
                              </>
                            )}
                          </div>

                          {/* Logout button */}
                          <div className="border-t border-gray-100 pt-2">
                            <button
                              onClick={handleLogout}
                              className="flex items-center gap-3 w-full px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                              </svg>
                              <span className="font-medium">Sign Out</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
              >
                {isMobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
              isMobileMenuOpen ? "max-h-screen opacity-100 border-t border-gray-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="container mx-auto px-4 py-4 bg-white">
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      location.pathname === item.path
                        ? "bg-indigo-50 text-indigo-600 font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="text-xl">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}

                <div className="pt-4 border-t border-gray-100">
                  {!user ? (
                    <div className="flex flex-col gap-3">
                      <Link
                        to="/login"
                        className="w-full py-3 rounded-lg text-gray-700 font-medium text-center hover:bg-gray-50 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-center shadow-sm hover:from-indigo-700 hover:to-purple-700 transition-all"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Get Started
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* User info in mobile */}
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={getUserPhoto()}
                            alt="Profile"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const name = getUserDisplayName();
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4f46e5&color=fff`;
                            }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-gray-800 truncate">
                              {getUserDisplayName()}
                            </p>
                            <UserRoleBadge />
                          </div>
                          <p className="text-sm text-gray-500 truncate">
                            {getUserEmail()}
                          </p>
                        </div>
                      </div>

                      {/* Mobile user menu */}
                      <div className="space-y-1">
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <span className="text-lg">📊</span>
                          <span>Dashboard</span>
                        </Link>

                        {/* <Link
                          to="/user/profile"
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <span className="text-lg">👤</span>
                          <span>My Profile</span>
                        </Link> */}

                        {/* <Link
                          to="/my-bookings"
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <span className="text-lg">🎫</span>
                          <span>My Bookings</span>
                        </Link> */}

                        {user.role === "vendor" && (
                          <Link
                            to="/vendor/dashboard"
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-emerald-50 rounded-lg"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <span className="text-lg">🏪</span>
                            <span>Vendor Dashboard</span>
                          </Link>
                        )}

                        {user.role === "admin" && (
                          <>
                            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                              Admin Panel
                            </div>
                            <Link
                              to="/admin"
                              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 rounded-lg"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <span className="text-lg">👑</span>
                              <span>Admin Dashboard</span>
                            </Link>
                          </>
                        )}
                      </div>

                      {/* Logout button in mobile */}
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg mt-4"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        <span className="font-medium">Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}