
// import axios from "axios";

// const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

// let authModule = null;

// export async function getIdToken() {
//   try {
//     if (!authModule) {
//       authModule = await import("../firebase.config.js");
//     }

//     const { auth } = authModule;
//     if (!auth) {
//       console.warn("Firebase auth not available");
//       return null;
//     }

//     const user = auth.currentUser;
//     if (!user) {
//       console.log("No user logged in");
//       return null;
//     }

//     const token = await user.getIdToken();
//     return token;
//   } catch (e) {
//     console.error("Error getting ID token:", e);
//     return null;
//   }
// }

// function normalizeResponse(response) {
//   if (response && typeof response === "object" && "data" in response) {
//     return response;
//   }
//   if (response && typeof response === "object") {
//     return { data: response };
//   }
//   return { data: {} };
// }

// function createErrorResponse(message, status = 500) {
//   console.error("🔴 API Error Response:", message);
//   return {
//     data: {
//       success: false,
//       message: message,
//       error: {
//         code: "API_ERROR",
//         message: message,
//       },
//     },
//     status: status,
//     statusText: status === 503 ? "Service Unavailable" : "Error",
//     headers: {},
//     config: {},
//   };
// }

// export async function apiRequest(
//   endpoint,
//   method = "GET",
//   data = null,
//   opts = {}
// ) {
//   const token = await getIdToken();
//   const headers = {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//     ...(opts.headers || {}),
//   };

//   if (token) {
//     headers["Authorization"] = `Bearer ${token}`;
//   }

//   const url = API_BASE + endpoint;

//   try {
//     const response = await axios({
//       url,
//       method: method.toUpperCase(),
//       data,
//       headers,
//       timeout: 15000,
//       validateStatus: function (status) {
//         return status >= 200 && status < 600;
//       },
//     });

//     return normalizeResponse(response);
//   } catch (error) {
//     console.error(`❌ API Error for ${endpoint}:`, error.message);

//     if (
//       error.code === "ERR_NETWORK" ||
//       error.message.includes("ECONNREFUSED") ||
//       error.message.includes("Network Error")
//     ) {
//       return createErrorResponse(
//         "Backend server is not available. Please start the server on port 5000.",
//         503
//       );
//     }

//     if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
//       return createErrorResponse(
//         "Request timeout. The server is taking too long to respond.",
//         504
//       );
//     }

//     if (error.response) {
//       return normalizeResponse(error.response);
//     }

//     return createErrorResponse(
//       `API request failed: ${error.message || "Unknown error"}`,
//       500
//     );
//   }
// }

// export async function apiGet(endpoint, queryParams = {}) {
//   const queryString = Object.keys(queryParams)
//     .map(
//       (key) =>
//         `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`
//     )
//     .join("&");

//   const url = queryString ? `${endpoint}?${queryString}` : endpoint;
//   return apiRequest(url, "GET");
// }

// export async function apiPost(endpoint, data = {}) {
//   return apiRequest(endpoint, "POST", data);
// }

// export async function apiPut(endpoint, data = {}) {
//   return apiRequest(endpoint, "PUT", data);
// }

// export async function apiDelete(endpoint) {
//   return apiRequest(endpoint, "DELETE");
// }

// // Vendor Application Functions
// export async function submitVendorApplication(applicationData) {
//   return apiPost("/api/apply-vendor", applicationData);
// }

// export async function getMyVendorApplication() {
//   return apiGet("/api/my-vendor-application");
// }

// export async function getVendorApplications(filter = {}) {
//   const { status, page = 1, limit = 10 } = filter;
//   const queryParams = { page, limit };
//   if (status) queryParams.status = status;
//   return apiGet("/api/admin/vendor-applications", queryParams);
// }

// export async function getVendorApplicationById(id) {
//   return apiGet(`/api/admin/vendor-applications/${id}`);
// }

// export async function reviewVendorApplication(id, reviewData) {
//   return apiPut(`/api/admin/vendor-applications/${id}/review`, reviewData);
// }

// // User Functions
// export async function getUserProfile() {
//   return apiGet("/api/user/profile");
// }

// export async function updateUserProfile(profileData) {
//   return apiPut("/api/user/profile", profileData);
// }

// export async function getUserDashboard() {
//   return apiGet("/api/user/dashboard");
// }

// // Admin Functions
// export async function getAdminDashboard() {
//   return apiGet("/api/admin/dashboard");
// }

// export async function getAdminTickets(filter = {}) {
//   const { verified, page = 1, limit = 10 } = filter;
//   const queryParams = { page, limit };
//   if (verified) queryParams.verified = verified;
//   return apiGet("/api/admin/tickets", queryParams);
// }

// export async function verifyTicket(id, status) {
//   return apiPut(`/api/admin/tickets/${id}/verify`, { status });
// }

// export default {
//   apiRequest,
//   apiGet,
//   apiPost,
//   apiPut,
//   apiDelete,
//   getIdToken,
//   submitVendorApplication,
//   getMyVendorApplication,
//   getVendorApplications,
//   getVendorApplicationById,
//   reviewVendorApplication,
//   getUserProfile,
//   updateUserProfile,
//   getUserDashboard,
//   getAdminDashboard,
//   getAdminTickets,
//   verifyTicket,
// };
// api.js - Complete API service for TicketBari
// api.js - Complete API service for TicketBari
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

// Get token from localStorage (alias getIdToken for compatibility)
export function getToken() {
  return localStorage.getItem("firebaseToken");
}

// Alias getIdToken for compatibility with existing code
export const getIdToken = getToken;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log(`✅ API ${response.config.method?.toUpperCase()} ${response.config.url}:`, {
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  (error) => {
    console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data,
    });

    // Handle specific error cases
    if (error.code === "ERR_NETWORK" || !error.response) {
      console.error("🔴 Network Error - Backend might not be running");
      return Promise.reject(new Error("Backend server is not available. Please start the server on port 5000."));
    }

    if (error.response?.status === 401) {
      console.error("🔴 Authentication Error - Token invalid or expired");
      localStorage.removeItem("firebaseToken");
      window.location.href = "/login";
    }

    if (error.response?.status === 403) {
      console.error("🔴 Authorization Error - Insufficient permissions");
    }

    return Promise.reject(error);
  }
);

// Generic API request
export const apiRequest = async (endpoint, method = "GET", data = null, params = {}) => {
  try {
    const response = await apiClient({
      url: endpoint,
      method: method.toUpperCase(),
      data,
      params,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// GET request
export const apiGet = (endpoint, params = {}) => {
  return apiRequest(endpoint, "GET", null, params);
};

// POST request
export const apiPost = (endpoint, data = {}) => {
  return apiRequest(endpoint, "POST", data);
};

// PUT request
export const apiPut = (endpoint, data = {}) => {
  return apiRequest(endpoint, "PUT", data);
};

// DELETE request
export const apiDelete = (endpoint) => {
  return apiRequest(endpoint, "DELETE");
};

// ========== PUBLIC ENDPOINTS ==========
export const getAdvertisedTickets = () => apiRequest("/api/advertised");
export const getAllTickets = (params = {}) => apiRequest("/api/tickets", "GET", null, params);
export const getTicketById = (id) => apiRequest(`/api/tickets/${id}`);

// ========== USER ENDPOINTS ==========
export const getUserProfile = () => apiRequest("/api/user/profile");
export const updateUserProfile = (data) => apiRequest("/api/user/profile", "PUT", data);
export const getUserDashboard = () => apiRequest("/api/user/dashboard");
export const getMyBookings = () => apiRequest("/api/my-bookings");
export const createBooking = (data) => apiRequest("/api/bookings", "POST", data);

// ========== VENDOR ENDPOINTS ==========
export const submitVendorApplication = (data) => apiRequest("/api/apply-vendor", "POST", data);
export const getMyVendorApplication = () => apiRequest("/api/my-vendor-application");
export const getVendorTickets = () => apiRequest("/api/vendor/tickets");
export const createVendorTicket = (data) => apiRequest("/api/vendor/tickets", "POST", data);

// ========== ADMIN ENDPOINTS ==========
export const getAdminDashboard = () => apiRequest("/api/admin/dashboard");
export const getAdminTickets = (filter = {}) => apiRequest("/api/admin/tickets", "GET", null, filter);
export const verifyTicket = (id, status) => apiRequest(`/api/admin/tickets/${id}/verify`, "PUT", { status });
export const getAdminUsers = (filter = {}) => apiRequest("/api/admin/users", "GET", null, filter);
export const updateUserRole = (userId, role) => apiRequest(`/api/admin/users/${userId}/role`, "PUT", { role });
export const getVendorApplications = (filter = {}) => apiRequest("/api/admin/vendor-applications", "GET", null, filter);
export const getVendorApplicationById = (id) => apiRequest(`/api/admin/vendor-applications/${id}`);
export const reviewVendorApplication = (id, data) => apiRequest(`/api/admin/vendor-applications/${id}/review`, "PUT", data);

// ========== HEALTH & UTILITY ==========
export const getHealthStatus = () => apiRequest("/api/health");
export const testBackendConnection = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/health`);
    return {
      success: response.ok,
      status: response.status,
      url: API_BASE,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      url: API_BASE,
    };
  }
};

// ========== HELPER FUNCTIONS ==========
export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Invalid Date";
  }
};

export const formatCurrency = (amount, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

// ========== DEFAULT EXPORT ==========
const api = {
  // Core methods
  request: apiRequest,
  get: (endpoint, params) => apiRequest(endpoint, "GET", null, params),
  post: (endpoint, data) => apiRequest(endpoint, "POST", data),
  put: (endpoint, data) => apiRequest(endpoint, "PUT", data),
  delete: (endpoint) => apiRequest(endpoint, "DELETE"),
  
  // Auth
  getToken,
  getIdToken,
  
  // Public
  getAdvertisedTickets,
  getAllTickets,
  getTicketById,
  
  // User
  getUserProfile,
  updateUserProfile,
  getUserDashboard,
  getMyBookings,
  createBooking,
  
  // Vendor
  submitVendorApplication,
  getMyVendorApplication,
  getVendorTickets,
  createVendorTicket,
  
  // Admin
  getAdminDashboard,
  getAdminTickets,
  verifyTicket,
  getAdminUsers,
  updateUserRole,
  getVendorApplications,
  getVendorApplicationById,
  reviewVendorApplication,
  
  // Utility
  getHealthStatus,
  testBackendConnection,
  formatDate,
  formatCurrency,
};

export default api;