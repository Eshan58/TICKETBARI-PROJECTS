import React, { useState, useEffect } from "react";
import { apiRequest, getIdToken } from "../services/api.js"; // Adjust import path as needed
import { TbCurrencyTaka } from "react-icons/tb";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalBooked: 0,
      pending: 0,
      confirmed: 0,
      cancelled: 0,
      totalSpent: 0,
    },
    recentBookings: [],
    user: { name: "", email: "", role: "", memberSince: "" },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      // Try multiple methods to get token
      const token = await getIdToken();
      const localStorageToken =
        localStorage.getItem("firebaseToken") || localStorage.getItem("token");

      console.log("🔍 Token status check:", {
        fromApiJs: token ? "Present" : "Missing",
        fromLocalStorage: localStorageToken ? "Present" : "Missing",
      });

      // Determine which token to use
      let tokenToUse = token || localStorageToken;

      if (!tokenToUse) {
        setError("No authentication token found. Please login again.");
        setLoading(false);

        // Auto-redirect to login after 3 seconds
        setTimeout(() => {
          console.log("🔄 Auto-redirecting to login page");
          window.location.href = "/login";
        }, 3000);
        return;
      }

      // If api.js provided token, use it with apiRequest
      if (token) {
        console.log("📡 Using api.js for request");
        await fetchWithApiUtility(token);
      } else {
        // Fallback to direct fetch with localStorage token
        console.log("📡 Using localStorage token for request");
        await fetchWithToken(tokenToUse);
      }
    } catch (err) {
      console.error("Dashboard initialization error:", err);
      setError(`Initialization error: ${err.message}`);
      setLoading(false);
    }
  };

  const fetchWithApiUtility = async (token) => {
    try {
      console.log("📡 Fetching dashboard data using api.js...");

      // Manually create request with token to ensure it's included
      const response = await apiRequest("/api/user/dashboard", "GET");

      console.log("API.js response:", {
        status: response.status,
        success: response.data?.success,
        hasData: !!response.data?.data,
      });

      if (response.status === 401) {
        setError("Session expired. Please login again.");
        clearAuthTokens();

        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
        return;
      }

      if (response.data?.success && response.data.data) {
        setDashboardData(response.data.data);
      } else {
        setError(response.data?.message || "Failed to load dashboard");
      }
    } catch (err) {
      console.error("API utility error:", err);

      // Fallback to direct fetch if api.js fails
      console.log("⚠️ api.js failed, trying direct fetch...");
      const fallbackToken =
        (await getIdToken()) ||
        localStorage.getItem("firebaseToken") ||
        localStorage.getItem("token");
      if (fallbackToken) {
        await fetchWithToken(fallbackToken);
      } else {
        setError(`API error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchWithToken = async (token) => {
    try {
      console.log("📡 Fetching dashboard data with token...");

      const response = await fetch("http://localhost:5000/api/user/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);

      if (response.status === 401) {
        setError("Session expired. Please login again.");
        clearAuthTokens();

        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response error:", errorText);

        // Try to parse as JSON
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(
            errorData.message || `Server error: ${response.status}`
          );
        } catch {
          throw new Error(`Server error: ${response.status} - ${errorText}`);
        }
      }

      const data = await response.json();
      console.log("📊 Dashboard data received successfully");

      if (data.success) {
        setDashboardData(data.data);
      } else {
        setError(data.message || "Failed to load dashboard");
      }
    } catch (err) {
      console.error("Fetch with token error:", err);

      if (err.message.includes("Failed to fetch")) {
        setError(
          "Cannot connect to server. Please check if the server is running on http://localhost:5000"
        );
      } else if (err.message.includes("NetworkError")) {
        setError("Network error. Please check your internet connection.");
      } else if (err.message.includes("401")) {
        setError("Authentication failed. Please login again.");
        clearAuthTokens();
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const clearAuthTokens = () => {
    localStorage.removeItem("firebaseToken");
    localStorage.removeItem("token");
    sessionStorage.removeItem("firebaseToken");
    sessionStorage.removeItem("token");
    console.log("🗑️ Cleared all auth tokens");
  };

  const handleLogout = () => {
    clearAuthTokens();
    console.log("🚪 Logging out");
    window.location.href = "/login";
  };

  const handleRetry = async () => {
    console.log("🔄 Manually retrying...");
    setError("");
    await fetchDashboardData();
  };

  const handleDebug = () => {
    console.log("🔍 DEBUG INFO:");
    console.log("LocalStorage contents:", {
      firebaseToken: localStorage.getItem("firebaseToken")
        ? `${localStorage.getItem("firebaseToken").substring(0, 30)}...`
        : "Missing",
      token: localStorage.getItem("token")
        ? `${localStorage.getItem("token").substring(0, 30)}...`
        : "Missing",
    });

    console.log("Current state:", {
      loading,
      error: error || "None",
      userData: dashboardData.user.name
        ? `User: ${dashboardData.user.name}`
        : "No user data",
      statsLoaded: dashboardData.stats.totalBooked > 0 ? "Yes" : "No",
    });

    // Show alert with debug info
    const tokenPresent =
      localStorage.getItem("firebaseToken") || localStorage.getItem("token");
    const tokenPreview = tokenPresent
      ? `${tokenPresent.substring(0, 20)}...`
      : "None";

    alert(
      `=== Dashboard Debug Info ===\n\n` +
        `🔐 Token Status: ${tokenPresent ? "Present" : "Missing"}\n` +
        `Token Preview: ${tokenPreview}\n\n` +
        `📊 Dashboard State:\n` +
        `• Loading: ${loading ? "Yes" : "No"}\n` +
        `• Error: ${error || "None"}\n` +
        `• User Data: ${dashboardData.user.name ? "Loaded" : "Not loaded"}\n` +
        `• Stats Loaded: ${
          dashboardData.stats.totalBooked > 0 ? "Yes" : "No"
        }\n\n` +
        `🔧 Actions:\n` +
        `1. Check console for details\n` +
        `2. Use 'Refresh Token' if token is missing\n` +
        `3. Use 'Retry' to fetch data again`
    );
  };

  const handleForceTokenRefresh = async () => {
    console.log("🔄 Forcing token refresh...");

    try {
      // Import firebase auth directly
      const { auth } = await import("../firebase.config.js");
      if (auth.currentUser) {
        console.log("Current user found:", auth.currentUser.email);
        const freshToken = await auth.currentUser.getIdToken(true); // Force refresh
        localStorage.setItem("firebaseToken", freshToken);
        console.log("✅ Got fresh token, stored in localStorage");

        // Retry with new token
        await fetchWithToken(freshToken);
      } else {
        setError("No user logged in. Please login again.");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    } catch (err) {
      console.error("Token refresh error:", err);
      setError(`Token refresh failed: ${err.message}`);
    }
  };

  const handleClearAndRetry = () => {
    console.log("🧹 Clearing tokens and retrying...");
    clearAuthTokens();
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">
            Loading your dashboard...
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Fetching your travel data
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleDebug}
            className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
          >
            Debug Loading
          </button>
          <button
            onClick={() => setLoading(false)}
            className="px-3 py-1 text-sm bg-gray-50 text-gray-600 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-red-100 rounded-full mr-4">
              <span className="text-red-600 text-xl">⚠️</span>
            </div>
            <div>
              <h3 className="font-semibold text-red-800 text-lg">
                Dashboard Error
              </h3>
              <p className="text-red-600 mt-1">{error}</p>
              {error.includes("token") || error.includes("login") ? (
                <p className="text-sm text-red-500 mt-2">
                  Redirecting to login page in 3 seconds...
                </p>
              ) : error.includes("connect") || error.includes("server") ? (
                <p className="text-sm text-red-500 mt-2">
                  Make sure your backend server is running on
                  http://localhost:5000
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-3">Try these solutions:</p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry Request
              </button>
              {/* <button
                onClick={handleForceTokenRefresh}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Refresh Token
              </button> */}
              <button
                onClick={handleClearAndRetry}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Clear & Reload
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Logout
              </button>
              {/* <button
                onClick={handleDebug}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Debug Info
              </button> */}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-red-100">
            <p className="text-xs text-gray-500">
              Need help? Check console for detailed error information.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-4 md:p-6">
      {/* Sidebar */}
      <aside className="md:col-span-1 bg-white rounded-xl p-6 shadow-lg">
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            User Profile
          </h3>
          <div className="flex items-center mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center shadow">
              <span className="text-blue-600 font-bold text-2xl">
                {dashboardData.user.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
            <div className="ml-4">
              <p className="font-medium text-gray-800">
                {dashboardData.user.name || "User"}
              </p>
              <p className="text-sm text-gray-500 truncate max-w-[180px]">
                {dashboardData.user.email}
              </p>
              <span className="inline-block mt-1 text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-700 capitalize">
                {dashboardData.user.role || "user"} Account
              </span>
            </div>
          </div>

          <div className="text-sm text-gray-600 border-t pt-4 space-y-3">
            <div className="flex items-center">
              <span className="mr-3 text-gray-400">📅</span>
              <div>
                <p className="font-medium">Member since</p>
                <p className="text-gray-500">
                  {dashboardData.user.memberSince
                    ? new Date(
                        dashboardData.user.memberSince
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="mr-3 text-gray-400">💰</span>
              <div>
                <p className="font-medium">Total spent</p>
                <p className="text-gray-500 flex items-center">
                  <TbCurrencyTaka />
                  {dashboardData.stats.totalSpent.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <nav className="mb-6">
          <h4 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">
            Navigation
          </h4>
          <ul className="space-y-1">
            <li>
              <a
                href="/profile"
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
              >
                <span className="mr-3">👤</span>
                <span>Profile</span>
              </a>
            </li>
            <li>
              <a
                href="/my-tickets"
                className="flex items-center p-3 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
              >
                <span className="mr-3">🎫</span>
                <span className="font-medium">My Booked Tickets</span>
              </a>
            </li>
            <li>
              <a
                href="/transactions"
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
              >
                <span className="mr-3">💳</span>
                <span>Transaction History</span>
              </a>
            </li>
          </ul>
        </nav>

        <div className="space-y-3">
          <button
            onClick={fetchDashboardData}
            className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Refresh Dashboard
          </button>

          {/* <button
            onClick={handleDebug}
            className="w-full py-2.5 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            Show Debug Info
          </button> */}

          {/* <button
            onClick={handleForceTokenRefresh}
            className="w-full py-2.5 px-4 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors text-sm"
          >
            Refresh Auth Token
          </button> */}

          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <section className="md:col-span-3 space-y-6">
        {/* Welcome Message */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Welcome back, {dashboardData.user.name || "Traveler"}! 👋
              </h1>
              <p className="opacity-90">
                Here's your travel dashboard overview
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-80">
                Last updated:{" "}
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <button
                onClick={fetchDashboardData}
                className="mt-2 text-sm bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded-lg transition-colors"
              >
                ↻ Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Total Booked",
              value: dashboardData.stats.totalBooked,
              color: "blue",
              icon: "🎫",
              description: "All bookings",
            },
            {
              label: "Pending",
              value: dashboardData.stats.pending,
              color: "yellow",
              icon: "⏳",
              description: "Awaiting confirmation",
            },
            {
              label: "Confirmed",
              value: dashboardData.stats.confirmed,
              color: "green",
              icon: "✅",
              description: "Confirmed trips",
            },
            {
              label: "Cancelled",
              value: dashboardData.stats.cancelled,
              color: "red",
              icon: "❌",
              description: "Cancelled bookings",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-5 shadow hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-xl bg-${stat.color}-50`}>
                  <span className={`text-2xl`}>{stat.icon}</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {stat.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-xl p-6 shadow">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Recent Bookings
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Your latest travel bookings
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={fetchDashboardData}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Refresh
              </button>
              {/* <a
                href="/my-tickets"
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                View All
              </a> */}
            </div>
          </div>

          {dashboardData.recentBookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">✈️</div>
              <p className="text-gray-500 text-lg">No bookings yet</p>
              <p className="text-gray-400 text-sm mt-2">
                Start planning your next adventure
              </p>
              <a
                href="/tickets"
                className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Tickets
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {dashboardData.recentBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="border border-gray-200 rounded-xl p-4 hover:border-blue-200 hover:bg-blue-50/50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="mb-3 sm:mb-0">
                      <h3 className="font-medium text-gray-800">
                        {booking.ticketTitle ||
                          booking.ticketId?.title ||
                          "Untitled Booking"}
                      </h3>
                      <div className="flex items-center mt-1 text-sm text-gray-600">
                        <span>{booking.ticketId?.from || "Unknown"}</span>
                        <span className="mx-2">→</span>
                        <span>{booking.ticketId?.to || "Unknown"}</span>
                        {booking.ticketId?.departureAt && (
                          <span className="ml-4 text-gray-500">
                            {new Date(
                              booking.ticketId.departureAt
                            ).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-bold text-lg text-gray-800 flex items-center">
                          <TbCurrencyTaka />
                          {booking.totalPrice?.toFixed(2) || "0.00"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.quantity}{" "}
                          {booking.quantity === 1 ? "ticket" : "tickets"}
                        </div>
                      </div>
                      <span
                        className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : booking.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {booking.status?.charAt(0).toUpperCase() +
                          booking.status?.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow">
            <h3 className="font-semibold text-gray-800 mb-4">Total Spending</h3>
            <div className="text-3xl font-bold text-blue-600 flex items-center">
              <TbCurrencyTaka />
              {dashboardData.stats.totalSpent.toFixed(2)}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Across all your bookings
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow">
            <h3 className="font-semibold text-gray-800 mb-4">Account Type</h3>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center mr-3">
                <span className="text-purple-600">👑</span>
              </div>
              <div>
                <div className="font-medium text-gray-800 capitalize">
                  {dashboardData.user.role || "user"} Account
                </div>
                <div className="text-sm text-gray-500">
                  Full access to all features
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
