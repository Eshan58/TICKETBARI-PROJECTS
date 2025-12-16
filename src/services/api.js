
// import axios from "axios";

// const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

// // Get token from localStorage (alias getIdToken for compatibility)
// export function getToken() {
//   return localStorage.getItem("firebaseToken");
// }

// // Alias getIdToken for compatibility with existing code
// export const getIdToken = getToken;

// // Create axios instance with default config
// const apiClient = axios.create({
//   baseURL: API_BASE,
//   timeout: 15000,
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
// });

// // Request interceptor to add auth token
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = getToken();
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor for error handling
// apiClient.interceptors.response.use(
//   (response) => {
//     // Log successful responses in development
//     if (import.meta.env.DEV) {
//       console.log(`✅ API ${response.config.method?.toUpperCase()} ${response.config.url}:`, {
//         status: response.status,
//         data: response.data,
//       });
//     }
//     return response;
//   },
//   (error) => {
//     console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
//       message: error.message,
//       code: error.code,
//       status: error.response?.status,
//       data: error.response?.data,
//     });

//     // Handle specific error cases
//     if (error.code === "ERR_NETWORK" || !error.response) {
//       console.error("🔴 Network Error - Backend might not be running");
//       return Promise.reject(new Error("Backend server is not available. Please start the server on port 5000."));
//     }

//     if (error.response?.status === 401) {
//       console.error("🔴 Authentication Error - Token invalid or expired");
//       localStorage.removeItem("firebaseToken");
//       window.location.href = "/login";
//     }

//     if (error.response?.status === 403) {
//       console.error("🔴 Authorization Error - Insufficient permissions");
//     }

//     return Promise.reject(error);
//   }
// );

// // Generic API request
// export const apiRequest = async (endpoint, method = "GET", data = null, params = {}) => {
//   try {
//     const response = await apiClient({
//       url: endpoint,
//       method: method.toUpperCase(),
//       data,
//       params,
//     });
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

// // GET request
// export const apiGet = (endpoint, params = {}) => {
//   return apiRequest(endpoint, "GET", null, params);
// };

// // POST request
// export const apiPost = (endpoint, data = {}) => {
//   return apiRequest(endpoint, "POST", data);
// };

// // PUT request
// export const apiPut = (endpoint, data = {}) => {
//   return apiRequest(endpoint, "PUT", data);
// };

// // DELETE request
// export const apiDelete = (endpoint) => {
//   return apiRequest(endpoint, "DELETE");
// };

// // ========== PUBLIC ENDPOINTS ==========
// export const getAdvertisedTickets = () => apiRequest("/api/advertised");
// export const getAllTickets = (params = {}) => apiRequest("/api/tickets", "GET", null, params);
// export const getTicketById = (id) => apiRequest(`/api/tickets/${id}`);

// // ========== USER ENDPOINTS ==========
// export const getUserProfile = () => apiRequest("/api/user/profile");
// export const updateUserProfile = (data) => apiRequest("/api/user/profile", "PUT", data);
// export const getUserDashboard = () => apiRequest("/api/user/dashboard");
// export const getMyBookings = () => apiRequest("/api/my-bookings");
// export const createBooking = (data) => apiRequest("/api/bookings", "POST", data);

// // ========== VENDOR ENDPOINTS ==========
// export const submitVendorApplication = (data) => apiRequest("/api/apply-vendor", "POST", data);
// export const getMyVendorApplication = () => apiRequest("/api/my-vendor-application");
// export const getVendorTickets = () => apiRequest("/api/vendor/tickets");
// export const createVendorTicket = (data) => apiRequest("/api/vendor/tickets", "POST", data);

// // ========== ADMIN ENDPOINTS ==========
// export const getAdminDashboard = () => apiRequest("/api/admin/dashboard");
// export const getAdminTickets = (filter = {}) => apiRequest("/api/admin/tickets", "GET", null, filter);
// export const verifyTicket = (id, status) => apiRequest(`/api/admin/tickets/${id}/verify`, "PUT", { status });
// export const getAdminUsers = (filter = {}) => apiRequest("/api/admin/users", "GET", null, filter);
// export const updateUserRole = (userId, role) => apiRequest(`/api/admin/users/${userId}/role`, "PUT", { role });
// export const getVendorApplications = (filter = {}) => apiRequest("/api/admin/vendor-applications", "GET", null, filter);
// export const getVendorApplicationById = (id) => apiRequest(`/api/admin/vendor-applications/${id}`);
// export const reviewVendorApplication = (id, data) => apiRequest(`/api/admin/vendor-applications/${id}/review`, "PUT", data);

// // ========== NEW ADMIN ENDPOINTS ==========
// export const getAdminBookings = (filter = {}) => apiRequest("/api/admin/bookings", "GET", null, filter);
// export const updateBookingStatus = (bookingId, status) => apiRequest(`/api/admin/bookings/${bookingId}/status`, "PUT", { status });
// export const getAdminReports = (params = {}) => apiRequest("/api/admin/reports", "GET", null, params);

// // ========== HEALTH & UTILITY ==========
// export const getHealthStatus = () => apiRequest("/api/health");
// export const testBackendConnection = async () => {
//   try {
//     const response = await fetch(`${API_BASE}/api/health`);
//     return {
//       success: response.ok,
//       status: response.status,
//       url: API_BASE,
//     };
//   } catch (error) {
//     return {
//       success: false,
//       message: error.message,
//       url: API_BASE,
//     };
//   }
// };

// // ========== HELPER FUNCTIONS ==========
// export const formatDate = (dateString) => {
//   if (!dateString) return "N/A";
//   try {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   } catch {
//     return "Invalid Date";
//   }
// };

// export const formatCurrency = (amount, currency = "USD") => {
//   return new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: currency,
//   }).format(amount);
// };

// // ========== DEFAULT EXPORT ==========
// const api = {
//   // Core methods
//   request: apiRequest,
//   get: (endpoint, params) => apiRequest(endpoint, "GET", null, params),
//   post: (endpoint, data) => apiRequest(endpoint, "POST", data),
//   put: (endpoint, data) => apiRequest(endpoint, "PUT", data),
//   delete: (endpoint) => apiRequest(endpoint, "DELETE"),
  
//   // Auth
//   getToken,
//   getIdToken,
  
//   // Public
//   getAdvertisedTickets,
//   getAllTickets,
//   getTicketById,
  
//   // User
//   getUserProfile,
//   updateUserProfile,
//   getUserDashboard,
//   getMyBookings,
//   createBooking,
  
//   // Vendor
//   submitVendorApplication,
//   getMyVendorApplication,
//   getVendorTickets,
//   createVendorTicket,
  
//   // Admin
//   getAdminDashboard,
//   getAdminTickets,
//   verifyTicket,
//   getAdminUsers,
//   updateUserRole,
//   getVendorApplications,
//   getVendorApplicationById,
//   reviewVendorApplication,
//   getAdminBookings,
//   updateBookingStatus,
//   getAdminReports,
  
//   // Utility
//   getHealthStatus,
//   testBackendConnection,
//   formatDate,
//   formatCurrency,
// };

// export default api;
// services/api.js
// services/api.js
// services/api.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

// Get token from localStorage
export function getToken() {
  return localStorage.getItem("firebaseToken");
}

export const getIdToken = getToken;

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor
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

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
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
export const getAdvertisedTickets = () => apiGet("/api/advertised");
export const getAllTickets = (params = {}) => apiGet("/api/tickets", params);
export const getTicketById = (id) => apiGet(`/api/tickets/${id}`);

// ========== USER ENDPOINTS ==========
export const getUserProfile = () => apiGet("/api/user/profile");
export const updateUserProfile = (data) => apiPut("/api/user/profile", data);
export const getUserDashboard = () => apiGet("/api/user/dashboard");
export const getMyBookings = () => apiGet("/api/my-bookings");
export const createBooking = (data) => apiPost("/api/bookings", data);

// ========== VENDOR ENDPOINTS ==========
export const submitVendorApplication = (data) => apiPost("/api/apply-vendor", data);
export const getMyVendorApplication = () => apiGet("/api/my-vendor-application");
export const getVendorTickets = () => apiGet("/api/vendor/tickets");
export const createVendorTicket = (data) => apiPost("/api/vendor/tickets", data);

// ========== ADMIN ENDPOINTS ==========
export const getAdminDashboard = () => apiGet("/api/admin/dashboard");
export const getAdminTickets = (filter = {}) => apiGet("/api/admin/tickets", filter);
export const verifyTicket = (id, status) => apiPut(`/api/admin/tickets/${id}/verify`, { status }); // ADDED THIS
export const getAdminUsers = (filter = {}) => apiGet("/api/admin/users", filter);
export const updateUserRole = (userId, role) => apiPut(`/api/admin/users/${userId}/role`, { role });
export const getVendorApplications = (filter = {}) => apiGet("/api/admin/vendor-applications", filter);
export const getVendorApplicationById = (id) => apiGet(`/api/admin/vendor-applications/${id}`);
export const reviewVendorApplication = (id, data) => apiPut(`/api/admin/vendor-applications/${id}/review`, data);
export const getAdminBookings = (filter = {}) => apiGet("/api/admin/bookings", filter);
export const updateBookingStatus = (bookingId, status) => apiPut(`/api/admin/bookings/${bookingId}/status`, { status });
export const getAdminReports = (params = {}) => apiGet("/api/admin/reports", params);

// ========== DEBUG & UTILITY ==========
export const testBackendConnection = async () => {
  try {
    const response = await fetch(`${API_BASE}/`);
    return {
      success: response.ok,
      status: response.status,
      url: API_BASE,
      message: response.ok ? "Backend is running" : "Backend responded with error"
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      url: API_BASE
    };
  }
};

// Default export
const api = {
  // Core methods
  request: apiRequest,
  get: apiGet,
  post: apiPost,
  put: apiPut,
  delete: apiDelete,
  
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
  
  // Admin - ALL EXPORTS INCLUDED
  getAdminDashboard,
  getAdminTickets,
  verifyTicket, // ADDED
  getAdminUsers,
  updateUserRole,
  getVendorApplications,
  getVendorApplicationById,
  reviewVendorApplication,
  getAdminBookings,
  updateBookingStatus,
  getAdminReports,
  
  // Utility
  testBackendConnection,
};

export default api;