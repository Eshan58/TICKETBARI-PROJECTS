
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

// Cache for tokens to avoid repeated imports
let authModule = null;

export async function getIdToken() {
  try {
    // Lazy load the auth module
    if (!authModule) {
      authModule = await import("../firebase.config.js");
    }

    const { auth } = authModule;
    if (!auth) {
      console.warn("Firebase auth not available");
      return null;
    }

    const user = auth.currentUser;
    if (!user) {
      console.log("No user logged in");
      return null;
    }

    const token = await user.getIdToken();
    console.log("🔑 Got ID token:", token ? "Yes" : "No");
    return token;
  } catch (e) {
    console.error("Error getting ID token:", e);
    return null;
  }
}

/**
 * Normalizes API response to a consistent structure
 */
function normalizeResponse(response) {
  // If it's already an axios response
  if (response && typeof response === "object" && "data" in response) {
    return response;
  }

  // If it's a direct data object
  if (response && typeof response === "object") {
    return { data: response };
  }

  // Fallback
  return { data: {} };
}

/**
 * Creates a consistent error response
 */
function createErrorResponse(message, status = 500) {
  console.error("🔴 API Error Response:", message);

  return {
    data: {
      success: false,
      message: message,
      data: {
        tickets: [],
        pagination: {
          page: 1,
          pages: 1,
          total: 0,
          limit: 8,
          hasNext: false,
          hasPrev: false,
        },
      },
      error: {
        code: "API_ERROR",
        message: message,
      },
    },
    status: status,
    statusText: status === 503 ? "Service Unavailable" : "Error",
    headers: {},
    config: {},
  };
}

/**
 * Validates and normalizes the response data structure
 */
function validateAndNormalizeData(data) {
  // If it's a successful response with proper structure
  if (data.success === true || data.success === undefined) {
    // Ensure we have a proper data structure
    if (!data.data && (data.tickets || data.pagination)) {
      // Convert { tickets: [], pagination: {} } to { data: { tickets: [], pagination: {} } }
      return {
        ...data,
        data: {
          tickets: data.tickets || [],
          pagination: data.pagination || {
            page: 1,
            pages: 1,
            total: data.tickets?.length || 0,
            limit: 8,
            hasNext: false,
            hasPrev: false,
          },
        },
      };
    }

    // Ensure data object exists
    if (!data.data) {
      data.data = {
        tickets: [],
        pagination: {
          page: 1,
          pages: 1,
          total: 0,
          limit: 8,
          hasNext: false,
          hasPrev: false,
        },
      };
    }

    // Ensure tickets array exists
    if (!Array.isArray(data.data.tickets)) {
      data.data.tickets = [];
    }

    // Ensure pagination object exists
    if (!data.data.pagination || typeof data.data.pagination !== "object") {
      data.data.pagination = {
        page: 1,
        pages: 1,
        total: data.data.tickets?.length || 0,
        limit: 8,
        hasNext: false,
        hasPrev: false,
      };
    }

    return data;
  }

  // For error responses, ensure consistent structure
  return {
    success: false,
    message: data.message || "Request failed",
    data: {
      tickets: [],
      pagination: {
        page: 1,
        pages: 1,
        total: 0,
        limit: 8,
        hasNext: false,
        hasPrev: false,
      },
    },
    error: data.error || { message: data.message },
  };
}

/**
 * Main API request function
 */
export async function apiRequest(
  endpoint,
  method = "GET",
  data = null,
  opts = {}
) {
  const token = await getIdToken();
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(opts.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = API_BASE + endpoint;

  console.log(`🚀 API Request: ${method} ${url}`);
  if (data) console.log(`📦 Request Data:`, data);
  if (token) console.log(`🔐 Using token: ${token.substring(0, 20)}...`);

  try {
    const response = await axios({
      url,
      method: method.toUpperCase(),
      data,
      headers,
      timeout: 15000, // 15 second timeout
      validateStatus: function (status) {
        // Accept all status codes to handle them manually
        return status >= 200 && status < 600;
      },
    });

    const normalizedResponse = normalizeResponse(response);

    console.log(`✅ API Response from ${endpoint}:`, {
      status: normalizedResponse.status,
      statusText: normalizedResponse.statusText,
      data: normalizedResponse.data,
    });

    // Validate and normalize the response data
    if (normalizedResponse.data) {
      normalizedResponse.data = validateAndNormalizeData(
        normalizedResponse.data
      );
    }

    return normalizedResponse;
  } catch (error) {
    console.error(`❌ API Error for ${endpoint}:`, {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
    });

    // Handle specific error cases

    // Case 1: Network error (backend not running)
    if (
      error.code === "ERR_NETWORK" ||
      error.message.includes("ECONNREFUSED") ||
      error.message.includes("Network Error") ||
      error.message.includes("Failed to fetch")
    ) {
      console.error("🔴 BACKEND CONNECTION ERROR:");
      console.error("   • Backend server is not running");
      console.error("   • Check if server is started on port 5000");
      console.error("   • Run: npm start in your backend folder");
      console.error("   • Verify URL: http://localhost:5000");

      return createErrorResponse(
        "Backend server is not available. Please start the server on port 5000.",
        503
      );
    }

    // Case 2: Timeout
    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      console.error("⏰ REQUEST TIMEOUT:");
      console.error("   • Backend is taking too long to respond");
      console.error("   • Server might be overloaded");

      return createErrorResponse(
        "Request timeout. The server is taking too long to respond.",
        504
      );
    }

    // Case 3: Axios error with response
    if (error.response) {
      console.log(
        `⚠️ Backend returned ${error.response.status}:`,
        error.response.data
      );

      // Normalize error response
      const errorResponse = normalizeResponse(error.response);
      errorResponse.data = validateAndNormalizeData(errorResponse.data);

      return errorResponse;
    }

    // Case 4: Other errors
    console.error("❌ UNKNOWN API ERROR:", error);

    return createErrorResponse(
      `API request failed: ${error.message || "Unknown error"}`,
      500
    );
  }
}

/**
 * Test backend connection
 */
export async function testBackendConnection() {
  console.log("🧪 Testing backend connection...");

  try {
    // First try direct fetch to check if server is running
    const healthCheck = await fetch(`${API_BASE}/api/health`, {
      method: "GET",
      headers: { Accept: "application/json" },
    }).catch(() => null);

    if (!healthCheck || !healthCheck.ok) {
      console.error("❌ Backend health check failed");
      return {
        success: false,
        message: "Backend server is not responding",
        url: API_BASE,
      };
    }

    const healthData = await healthCheck.json();
    console.log("🏥 Backend Health:", healthData);

    // Test tickets endpoint
    const ticketsRes = await apiRequest("/api/tickets?limit=1");

    console.log("🎫 Tickets test result:", {
      success: ticketsRes.data?.success,
      ticketsCount: ticketsRes.data?.data?.tickets?.length || 0,
      message: ticketsRes.data?.message,
    });

    return {
      success: true,
      health: healthData,
      tickets: ticketsRes.data,
      url: API_BASE,
    };
  } catch (error) {
    console.error("❌ Backend test failed:", error);
    return {
      success: false,
      message: error.message,
      url: API_BASE,
    };
  }
}

/**
 * Debug function to check backend data
 */
export async function debugBackendData() {
  console.log("🔍 Debugging backend data...");

  const endpoints = [
    "/api/health",
    "/api/debug/tickets",
    "/api/debug/test-filter",
    "/api/tickets-debug",
    "/api/tickets?limit=3",
  ];

  const results = {};

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint}...`);
      const response = await apiRequest(endpoint);
      results[endpoint] = {
        success: response.data?.success,
        status: response.status,
        data: response.data,
      };
    } catch (error) {
      results[endpoint] = {
        success: false,
        error: error.message,
      };
    }
  }

  console.log("📊 Debug results:", results);
  return results;
}

/**
 * Simple GET request helper
 */
export async function apiGet(endpoint, queryParams = {}) {
  const queryString = Object.keys(queryParams)
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`
    )
    .join("&");

  const url = queryString ? `${endpoint}?${queryString}` : endpoint;
  return apiRequest(url, "GET");
}

/**
 * Simple POST request helper
 */
export async function apiPost(endpoint, data = {}) {
  return apiRequest(endpoint, "POST", data);
}

/**
 * Simple PUT request helper
 */
export async function apiPut(endpoint, data = {}) {
  return apiRequest(endpoint, "PUT", data);
}

/**
 * Simple DELETE request helper
 */
export async function apiDelete(endpoint) {
  return apiRequest(endpoint, "DELETE");
}

/**
 * Check if backend is available
 */
export async function isBackendAvailable() {
  try {
    const response = await fetch(`${API_BASE}/api/health`, {
      method: "GET",
      headers: { Accept: "application/json" },
      timeout: 3000,
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Get backend status with detailed info
 */
export async function getBackendStatus() {
  const isAvailable = await isBackendAvailable();

  if (!isAvailable) {
    return {
      available: false,
      message: "Backend server is not running on port 5000",
      url: API_BASE,
      suggestions: [
        "Start the backend server: npm start",
        "Check if port 5000 is already in use",
        "Verify the server is running in the correct directory",
      ],
    };
  }

  try {
    const healthRes = await fetch(`${API_BASE}/api/health`);
    const healthData = await healthRes.json();

    return {
      available: true,
      message: "Backend server is running",
      url: API_BASE,
      health: healthData,
    };
  } catch (error) {
    return {
      available: true,
      message: "Backend is running but health check failed",
      url: API_BASE,
      error: error.message,
    };
  }
}

export default {
  apiRequest,
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  getIdToken,
  testBackendConnection,
  debugBackendData,
  isBackendAvailable,
  getBackendStatus,
};
