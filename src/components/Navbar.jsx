import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useTheme } from "../contexts/ThemeContext.jsx";

export default function Navbar() {
  const auth = useAuth() || {};
  const { user, logout, loading } = auth;
  const { isDarkMode, toggleDarkMode } = useTheme();
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
      if (
        isProfileMenuOpen &&
        !event.target.closest(".profile-menu-container")
      ) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
  const vendorNavItem =
    user?.role !== "vendor" && user?.role !== "admin"
      ? { path: "/apply-vendor", label: "Become a Vendor", icon: "🏪" }
      : null;

  // Add admin link for admin users
  const adminNavItem =
    user?.role === "admin"
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
        <div className="bg-white dark:bg-gray-900 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
              <div className="flex gap-4">
                <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
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
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=4f46e5&color=fff&bold=true`;
  };

  // Role badge component
  const UserRoleBadge = () => {
    if (!user?.role) return null;

    const roleConfig = {
      admin: {
        color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
        label: "Admin",
        icon: "👑",
      },
      vendor: {
        color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
        label: "Vendor",
        icon: "🏪",
      },
      user: {
        color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
        label: "User",
        icon: "👤",
      },
    };

    const config = roleConfig[user.role];
    if (!config) return null;

    return (
      <span
        className={`px-2.5 py-1 text-xs rounded-full ${config.color} border flex items-center gap-1.5`}
      >
        <span className="text-sm">{config.icon}</span>
        <span className="font-medium">{config.label}</span>
      </span>
    );
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? "shadow-md dark:shadow-gray-900/20" : ""
        }`}
      >
        <div
          className={`${
            isScrolled
              ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800"
              : "bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800"
          } transition-all duration-300`}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link
                to="/"
                className="group flex items-center gap-3 transition-transform duration-300 hover:scale-[1.02]"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow transition-all duration-300">
                    <span className="text-xl">🚍</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    TicketBari
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
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
                        ? "text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-900/30"
                        : "text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800"
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

              {/* Right Section - Auth & Theme Toggle */}
              <div className="hidden md:flex items-center gap-3">
                {/* Theme Toggle Button */}
                <button
                  onClick={toggleDarkMode}
                  className="p-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                  aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {isDarkMode ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  )}
                </button>

                {!user ? (
                  <div className="flex items-center gap-3">
                    <Link
                      to="/login"
                      className="px-5 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
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
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                          {getUserDisplayName()}
                        </span>
                        <UserRoleBadge />
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px]">
                        {getUserEmail()}
                      </span>
                    </div>

                    {/* Profile dropdown toggle */}
                    <div className="relative">
                      <button
                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                        className="relative group focus:outline-none"
                      >
                        <div className="w-10 h-10 rounded-xl border-2 border-white dark:border-gray-800 shadow-sm overflow-hidden bg-gray-100 dark:bg-gray-700">
                          <img
                            src={getUserPhoto()}
                            alt="Profile"
                            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                            onError={(e) => {
                              const name = getUserDisplayName();
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                name
                              )}&background=4f46e5&color=fff`;
                            }}
                          />
                        </div>
                      </button>

                      {/* Profile Dropdown Menu */}
                      {isProfileMenuOpen && (
                        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                          {/* User info in dropdown */}
                          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                                <img
                                  src={getUserPhoto()}
                                  alt="Profile"
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const name = getUserDisplayName();
                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                      name
                                    )}&background=4f46e5&color=fff`;
                                  }}
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                                  {getUserDisplayName()}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                  {getUserEmail()}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Menu Items */}
                          <div className="py-2">
                            <Link
                              to="/dashboard"
                              className="flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                              onClick={() => setIsProfileMenuOpen(false)}
                            >
                              <span className="text-lg">📊</span>
                              <span>Dashboard</span>
                            </Link>

                            <Link
                              to="/user/profile"
                              className="flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                              onClick={() => setIsProfileMenuOpen(false)}
                            >
                              <span className="text-lg">👤</span>
                              <span>My Profile</span>
                            </Link>

                            <Link
                              to="/my-bookings"
                              className="flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                              onClick={() => setIsProfileMenuOpen(false)}
                            >
                              <span className="text-lg">🎫</span>
                              <span>My Bookings</span>
                            </Link>

                            <Link
                              to="/transaction-history"
                              className="flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                              onClick={() => setIsProfileMenuOpen(false)}
                            >
                              <span className="text-lg">💰</span>
                              <span>Transaction History</span>
                            </Link>

                            {/* Vendor specific links */}
                            {user.role === "vendor" && (
                              <Link
                                to="/vendor/dashboard"
                                className="flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                                onClick={() => setIsProfileMenuOpen(false)}
                              >
                                <span className="text-lg">🏪</span>
                                <span>Vendor Dashboard</span>
                              </Link>
                            )}

                            {/* Admin specific links */}
                            {user.role === "admin" && (
                              <>
                                <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                  Admin Panel
                                </div>
                                <Link
                                  to="/admin"
                                  className="flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                  onClick={() => setIsProfileMenuOpen(false)}
                                >
                                  <span className="text-lg">👑</span>
                                  <span>Admin Dashboard</span>
                                </Link>
                                <Link
                                  to="/admin/vendor-applications"
                                  className="flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                  onClick={() => setIsProfileMenuOpen(false)}
                                >
                                  <span className="text-lg">📋</span>
                                  <span>Vendor Applications</span>
                                </Link>
                              </>
                            )}
                          </div>

                          {/* Theme Toggle in Dropdown */}
                          <div className="border-t border-gray-100 dark:border-gray-700 py-2">
                            <button
                              onClick={toggleDarkMode}
                              className="flex items-center gap-3 w-full px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              {isDarkMode ? (
                                <>
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                      fillRule="evenodd"
                                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <span>Light Mode</span>
                                </>
                              ) : (
                                <>
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                  </svg>
                                  <span>Dark Mode</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* Logout button */}
                          <div className="border-t border-gray-100 dark:border-gray-700 pt-2">
                            <button
                              onClick={handleLogout}
                              className="flex items-center gap-3 w-full px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
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

              {/* Mobile Menu Button with Theme Toggle */}
              <div className="md:hidden flex items-center gap-2">
                {/* Theme Toggle for Mobile */}
                <button
                  onClick={toggleDarkMode}
                  className="p-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                  aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {isDarkMode ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  )}
                </button>

                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  {isMobileMenuOpen ? (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
              isMobileMenuOpen
                ? "max-h-screen opacity-100 border-t border-gray-100 dark:border-gray-800"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="container mx-auto px-4 py-4 bg-white dark:bg-gray-900">
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      location.pathname === item.path
                        ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="text-xl">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}

                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                  {!user ? (
                    <div className="flex flex-col gap-3">
                      <Link
                        to="/login"
                        className="w-full py-3 rounded-lg text-gray-700 dark:text-gray-300 font-medium text-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
                      <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                          <img
                            src={getUserPhoto()}
                            alt="Profile"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const name = getUserDisplayName();
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                name
                              )}&background=4f46e5&color=fff`;
                            }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                              {getUserDisplayName()}
                            </p>
                            <UserRoleBadge />
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {getUserEmail()}
                          </p>
                        </div>
                      </div>

                      {/* Mobile user menu */}
                      <div className="space-y-1">
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <span className="text-lg">📊</span>
                          <span>Dashboard</span>
                        </Link>

                        <Link
                          to="/user/profile"
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <span className="text-lg">👤</span>
                          <span>My Profile</span>
                        </Link>

                        <Link
                          to="/my-bookings"
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <span className="text-lg">🎫</span>
                          <span>My Bookings</span>
                        </Link>

                        <Link
                          to="/transaction-history"
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <span className="text-lg">💰</span>
                          <span>Transaction History</span>
                        </Link>

                        {user.role === "vendor" && (
                          <Link
                            to="/vendor/dashboard"
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-lg"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <span className="text-lg">🏪</span>
                            <span>Vendor Dashboard</span>
                          </Link>
                        )}

                        {user.role === "admin" && (
                          <>
                            <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                              Admin Panel
                            </div>
                            <Link
                              to="/admin"
                              className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <span className="text-lg">👑</span>
                              <span>Admin Dashboard</span>
                            </Link>
                          </>
                        )}

                        {/* Theme Toggle in Mobile Menu */}
                        <button
                          onClick={toggleDarkMode}
                          className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                        >
                          {isDarkMode ? (
                            <>
                              <span className="text-lg">☀️</span>
                              <span>Switch to Light Mode</span>
                            </>
                          ) : (
                            <>
                              <span className="text-lg">🌙</span>
                              <span>Switch to Dark Mode</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Logout button in mobile */}
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg mt-4"
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