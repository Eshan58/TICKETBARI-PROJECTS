// import axios from "axios";

// const API_BASE = import.meta.env.VITE_API_BASE || "https://ticketbari-project-backend.vercel.app";

// // Get token from localStorage
// export function getToken() {
//   const token = localStorage.getItem("firebaseToken");
//   // console.log("🔑 getToken called, token exists:", !!token);
//   if (token) {
//     // console.log("📏 Token length:", token.length);
//     // console.log("🔍 First 50 chars:", token.substring(0, 50));
//   }
//   return token;
// }

// export const getIdToken = getToken;

// // Create axios instance
// const apiClient = axios.create({
//   baseURL: API_BASE,
//   timeout: 15000,
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
// });

// // Request interceptor with better logging
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = getToken();
//     // console.log(`📡 ${config.method?.toUpperCase()} ${config.url}`);

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//       // console.log("✅ Token added to headers");
//     } else {
//       // console.log("⚠️ No token available for request");
//     }

//     return config;
//   },
//   (error) => {
//     console.error("❌ Request interceptor error:", error);
//     return Promise.reject(error);
//   }
// );

// // Response interceptor
// apiClient.interceptors.response.use(
//   (response) => {
//     console.log(
//       `✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${
//         response.status
//       }`
//     );
//     return response;
//   },
//   (error) => {
//     console.error(
//       `❌ API Error: ${error.config?.method?.toUpperCase()} ${
//         error.config?.url
//       }`,
//       {
//         status: error.response?.status,
//         message: error.response?.data?.message || error.message,
//       }
//     );

//     // Handle specific errors
//     if (error.code === "ERR_NETWORK") {
//       console.error(
//         "🔴 Network Error - Check if backend is running on port 5000"
//       );
//     }

//     if (error.response?.status === 401) {
//       console.error("🔴 401 Unauthorized - Token invalid or expired");
//       localStorage.removeItem("firebaseToken");
//     }

//     if (error.response?.status === 403) {
//       console.error("🔴 403 Forbidden - Insufficient permissions");
//     }

//     return Promise.reject(error);
//   }
// );

// // Generic API request
// export const apiRequest = async (
//   endpoint,
//   method = "GET",
//   data = null,
//   params = {}
// ) => {
//   try {
//     // console.log(`📤 API Request: ${method} ${endpoint}`);
//     const response = await apiClient({
//       url: endpoint,
//       method: method.toUpperCase(),
//       data,
//       params,
//     });
//     return response;
//   } catch (error) {
//     console.error(
//       `❌ API Request failed: ${method} ${endpoint}`,
//       error.message
//     );
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

// // PATCH request
// export const apiPatch = (endpoint, data = {}) => {
//   return apiRequest(endpoint, "PATCH", data);
// };

// // DELETE request
// export const apiDelete = (endpoint) => {
//   return apiRequest(endpoint, "DELETE");
// };

// // ========== PUBLIC ENDPOINTS ==========
// export const getAdvertisedTickets = () => apiGet("/api/advertised");
// export const getAllTickets = (params = {}) => apiGet("/api/tickets", params);
// export const getTicketById = (id) => apiGet(`/api/tickets/${id}`);
// export const getHealthStatus = () => apiGet("/api/health");

// // ========== USER ENDPOINTS ==========
// export const getUserProfile = () => apiGet("/api/user/profile");
// export const updateUserProfile = (data) => apiPut("/api/user/profile", data);
// export const getUserDashboard = () => apiGet("/api/user/dashboard");
// export const getMyBookings = () => apiGet("/api/user/bookings");
// export const getBookingById = (id) => apiGet(`/api/user/bookings/${id}`);

// // User Transactions
// export const getUserTransactions = () => apiGet("/api/user/transactions");
// export const getTransactionById = (id) => apiGet(`/api/user/transactions/${id}`);
// export const exportTransactions = (format = "csv") => 
//   apiGet(`/api/user/transactions/export/${format}`);

// // User Booking Operations
// export const createBooking = (data) => apiPost("/api/bookings", data);
// export const cancelBooking = (id) => apiDelete(`/api/bookings/${id}`);
// export const processPayment = (bookingId, data) =>
//   apiPost(`/api/bookings/${bookingId}/pay`, data);
// export const downloadTicket = (bookingId) =>
//   apiGet(`/api/bookings/${bookingId}/download`, {}, { responseType: "blob" });

// // ========== VENDOR ENDPOINTS ==========
// export const submitVendorApplication = (data) =>
//   apiPost("/api/apply-vendor", data);
// export const getMyVendorApplication = () =>
//   apiGet("/api/my-vendor-application");
// export const getVendorTickets = () => apiGet("/api/vendor/tickets");
// export const createVendorTicket = (data) =>
//   apiPost("/api/vendor/tickets", data);
// export const updateVendorTicket = (id, data) =>
//   apiPut(`/api/vendor/tickets/${id}`, data);
// export const deleteVendorTicket = (id) =>
//   apiDelete(`/api/vendor/tickets/${id}`);

// // Vendor Dashboard Endpoints
// export const getVendorDashboardStats = () =>
//   apiGet("/api/vendor/dashboard/stats");
// export const getVendorCards = () => apiGet("/api/vendor/cards");
// export const createVendorCard = (data) => apiPost("/api/vendor/cards", data);
// export const updateVendorCard = (id, data) =>
//   apiPut(`/api/vendor/cards/${id}`, data);
// export const deleteVendorCard = (id) => apiDelete(`/api/vendor/cards/${id}`);
// export const getVendorCardById = (id) => apiGet(`/api/vendor/cards/${id}`);
// export const getVendorApplications = (filter = {}) => apiGet("/api/vendor/applications", filter);
// export const approveVendorApplication = (id) =>
//   apiPut(`/api/vendor/applications/${id}/approve`);
// export const rejectVendorApplication = (id) =>
//   apiPut(`/api/vendor/applications/${id}/reject`);

// // Vendor Profile Endpoints
// export const getVendorProfile = () => apiGet("/api/vendor/profile");
// export const updateVendorProfile = (data) => apiPut("/api/vendor/profile", data);

// // Vendor Bookings Management
// export const getVendorBookings = (params = {}) => apiGet("/api/vendor/bookings", params);
// export const acceptBooking = (id) => apiPut(`/api/vendor/bookings/${id}/accept`);
// export const rejectBooking = (id) => apiPut(`/api/vendor/bookings/${id}/reject`);
// export const updateVendorBookingStatus = (bookingId, status) =>
//   apiPut(`/api/vendor/bookings/${bookingId}/status`, { status });

// // Vendor Revenue & Earnings
// export const getVendorRevenue = (params = {}) => apiGet("/api/vendor/revenue", params);
// export const getVendorEarnings = () => apiGet("/api/vendor/earnings");
// export const requestWithdrawal = (data) => apiPost("/api/vendor/withdrawals", data);
// export const getWithdrawalHistory = () => apiGet("/api/vendor/withdrawals");

// // Vendor Statistics & Analytics
// export const getVendorStats = () => apiGet("/api/vendor/stats");
// export const getVendorAnalytics = (params = {}) => apiGet("/api/vendor/analytics", params);

// // ========== ADMIN ENDPOINTS ==========
// export const getAdminDashboard = () => apiGet("/api/admin/dashboard");
// export const getAdminTickets = (filter = {}) =>
//   apiGet("/api/admin/tickets", filter);
// export const verifyTicket = (id, status) =>
//   apiPut(`/api/admin/tickets/${id}/verify`, { status });
// export const getAdminUsers = (filter = {}) =>
//   apiGet("/api/admin/users", filter);
// export const updateUserRole = (userId, role) =>
//   apiPut(`/api/admin/users/${userId}/role`, { role });
// export const getAdminVendorApplications = (filter = {}) =>
//   apiGet("/api/admin/vendor-applications", filter);
// export const getVendorApplicationById = (id) =>
//   apiGet(`/api/admin/vendor-applications/${id}`);
// export const reviewVendorApplication = (id, data) =>
//   apiPut(`/api/admin/vendor-applications/${id}/review`, data);

// // ========== ADMIN BOOKING ENDPOINTS ==========
// export const getAdminBookings = (filter = {}) =>
//   apiGet("/api/admin/bookings", filter);
// export const getAdminBookingById = (id) => apiGet(`/api/admin/bookings/${id}`);
// export const updateBookingStatus = (bookingId, status) =>
//   apiPut(`/api/admin/bookings/${bookingId}/status`, { status });
// export const getBookingDetails = (bookingId) =>
//   apiGet(`/api/admin/bookings/${bookingId}`);

// export const getAdminReports = (params = {}) =>
//   apiGet("/api/admin/reports", params);

// // ========== DEBUG & TESTING ENDPOINTS ==========
// export const checkAuthStatus = () => apiGet("/api/debug/auth-check");
// export const testToken = (token) =>
//   apiPost("/api/debug/token-check", { token });
// export const makeMeAdmin = () => apiPost("/api/debug/make-me-admin");
// export const getDebugUsers = () => apiGet("/api/debug/users");
// export const getDebugTickets = () => apiGet("/api/debug/tickets");
// export const approveAllTickets = () => apiPost("/api/debug/approve-all");
// export const createSampleTickets = () =>
//   apiPost("/api/debug/create-sample-tickets");
// export const testAdminAccess = () => apiGet("/api/debug/test-admin");
// export const forceSyncUser = (email) =>
//   apiGet(`/api/debug/force-sync/${email}`);

// // ========== PAYMENT ENDPOINTS ==========
// export const createPayment = (data) => apiPost("/api/payments", data);
// export const verifyPayment = (paymentId, data) =>
//   apiPost(`/api/payments/${paymentId}/verify`, data);
// export const getPaymentMethods = () => apiGet("/api/payment-methods");
// export const getPaymentStatus = (paymentId) =>
//   apiGet(`/api/payments/${paymentId}/status`);

// // ========== TEST & UTILITY FUNCTIONS ==========
// export const testBackendConnection = async () => {
//   try {
//     // console.log("🔍 Testing backend connection...");
//     const response = await fetch(`${API_BASE}/api/health`);
//     const data = await response.json();
//     return {
//       success: response.ok,
//       status: response.status,
//       data: data,
//       message: "Backend is running",
//     };
//   } catch (error) {
//     return {
//       success: false,
//       message: error.message,
//       url: API_BASE,
//     };
//   }
// };

// // Test user authentication flow
// export const testAuthFlow = async () => {
//   try {
//     // console.log("🧪 Testing authentication flow...");

//     const results = {
//       backendStatus: null,
//       tokenStatus: null,
//       profileStatus: null,
//       adminStatus: null,
//     };

//     // 1. Test backend connection
//     try {
//       const backendRes = await testBackendConnection();
//       results.backendStatus = backendRes;
//       // console.log(
//       //   "✅ Backend connection:",
//       //   backendRes.success ? "OK" : "FAILED"
//       // );
//     } catch (error) {
//       results.backendStatus = { success: false, error: error.message };
//     }

//     // 2. Test token
//     const token = getToken();
//     results.tokenStatus = {
//       hasToken: !!token,
//       tokenLength: token?.length || 0,
//     };
//     // console.log(
//     //   "✅ Token status:",
//     //   results.tokenStatus.hasToken ? "Present" : "Missing"
//     // );

//     // 3. Test profile endpoint
//     try {
//       const profileRes = await getUserProfile();
//       results.profileStatus = {
//         success: true,
//         email: profileRes.data.data.user.email,
//         role: profileRes.data.user.role,
//       };
//       // console.log(
//       //   "✅ Profile access:",
//       //   `Email: ${results.profileStatus.email}, Role: ${results.profileStatus.role}`
//       // );
//     } catch (error) {
//       results.profileStatus = {
//         success: false,
//         error: error.message,
//         status: error.response?.status,
//       };
//     }

//     // 4. Test admin endpoint (if user is admin)
//     if (
//       results.profileStatus.success &&
//       results.profileStatus.role === "admin"
//     ) {
//       try {
//         const adminRes = await getAdminDashboard();
//         results.adminStatus = {
//           success: true,
//           data: adminRes.data.data,
//         };
//         // console.log("✅ Admin access: Granted");
//       } catch (error) {
//         results.adminStatus = {
//           success: false,
//           error: error.message,
//           status: error.response?.status,
//         };
//       }
//     } else {
//       results.adminStatus = {
//         success: false,
//         error: "User is not admin or profile not accessible",
//         userRole: results.profileStatus.role,
//       };
//     }

//     return results;
//   } catch (error) {
//     console.error("❌ Auth flow test failed:", error);
//     return { success: false, error: error.message };
//   }
// };

// // Force admin mode utility
// export const forceAdminMode = async () => {
//   try {
//     // console.log("👑 Attempting to force admin mode...");

//     // Step 1: Check current user
//     const profile = await getUserProfile();
//     // console.log(
//     //   "Current user:",
//     //   profile.data.user.email,
//     //   "Role:",
//     //   profile.data.user.role
//     // );

//     // Step 2: Make admin if not already
//     if (profile.data.user.role !== "admin") {
//       // console.log("⚠️ User is not admin, making admin...");
//       const makeAdminRes = await makeMeAdmin();
//       // console.log("Make admin result:", makeAdminRes.data.message);

//       // Step 3: Refresh profile
//       const newProfile = await getUserProfile();
//       // console.log("New role:", newProfile.data.user.role);

//       return {
//         success: true,
//         message: "Admin mode forced successfully",
//         oldRole: profile.data.user.role,
//         newRole: newProfile.data.user.role,
//         user: newProfile.data.user,
//       };
//     } else {
//       return {
//         success: true,
//         message: "User is already admin",
//         role: profile.data.user.role,
//         user: profile.data.user,
//       };
//     }
//   } catch (error) {
//     console.error("❌ Force admin mode failed:", error);
//     return {
//       success: false,
//       error: error.message,
//       code: error.response?.status,
//     };
//   }
// };

// // Debug user info
// export const debugUserInfo = async () => {
//   try {
//     // console.log("🔍 Debugging user info...");

//     const results = {};

//     // 1. Local storage info
//     results.localStorage = {
//       hasToken: !!localStorage.getItem("firebaseToken"),
//       hasUser: !!localStorage.getItem("user"),
//       tokenLength: localStorage.getItem("firebaseToken")?.length || 0,
//     };

//     // 2. Backend users list
//     try {
//       const usersRes = await getDebugUsers();
//       results.allUsers = usersRes.data.data.users;
//       results.totalUsers = usersRes.data.data.count;

//       // Find admin user
//       results.adminUser = results.allUsers.find(
//         (u) => u.email === "mahdiashan9@gmail.com"
//       );
//     } catch (error) {
//       results.allUsersError = error.message;
//     }

//     // 3. Current auth status
//     try {
//       const authRes = await checkAuthStatus();
//       results.authStatus = authRes.data.data;
//     } catch (error) {
//       results.authStatusError = error.message;
//     }

//     // 4. Current profile
//     try {
//       const profileRes = await getUserProfile();
//       results.currentProfile = profileRes.data.user;
//     } catch (error) {
//       results.profileError = error.message;
//     }

//     return results;
//   } catch (error) {
//     console.error("❌ Debug user info failed:", error);
//     return { success: false, error: error.message };
//   }
// };

// // ========== MOCK DATA FUNCTIONS ==========
// export const getMockBookings = () => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({
//         data: {
//           success: true,
//           data: [
//             {
//               _id: "1",
//               bookingReference: "TB-1765726189204-2",
//               ticketTitle: "Flight to Chittagong",
//               createdAt: "2025-12-14T21:29:00Z",
//               quantity: 1,
//               totalPrice: 4500.0,
//               status: "paid",
//               paymentMethod: "bkash",
//               paidAt: "2025-12-14T21:35:00Z",
//               ticketId: {
//                 departureAt: "2025-12-15T00:00:00Z",
//                 from: "Dhaka",
//                 to: "Chittagong",
//                 airline: "Bangladesh Airlines",
//                 flightNo: "BG-203",
//               },
//             },
//             {
//               _id: "2",
//               bookingReference: "TB-1765726160429-3",
//               ticketTitle: "Business Flight to Chittagong",
//               createdAt: "2025-12-14T21:29:00Z",
//               quantity: 1,
//               totalPrice: 9500.0,
//               status: "paid",
//               paymentMethod: "nagad",
//               paidAt: "2025-12-14T21:40:00Z",
//               ticketId: {
//                 departureAt: "2026-01-20T00:00:00Z",
//                 from: "Dhaka",
//                 to: "Chittagong",
//                 airline: "Premium Airways",
//                 flightNo: "PA-501",
//               },
//             },
//             {
//               _id: "3",
//               bookingReference: "TB-1765726139303-4",
//               ticketTitle: "Business Flight to Chittagong",
//               createdAt: "2025-12-14T21:28:00Z",
//               quantity: 1,
//               totalPrice: 9500.0,
//               status: "confirmed",
//               paymentMethod: null,
//               ticketId: {
//                 departureAt: "2026-01-20T00:00:00Z",
//                 from: "Dhaka",
//                 to: "Chittagong",
//                 airline: "Premium Airways",
//                 flightNo: "PA-502",
//               },
//             },
//           ],
//         },
//       });
//     }, 500);
//   });
// };

// export const getMockBookingById = (id) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({
//         data: {
//           success: true,
//           data: {
//             _id: id,
//             bookingReference: "TB-1765726189204-2",
//             ticketTitle: "Flight to Chittagong",
//             createdAt: "2025-12-14T21:29:00Z",
//             quantity: 2,
//             totalPrice: 9000.0,
//             status: "paid",
//             paymentMethod: "bkash",
//             transactionId: "TRX123456789",
//             paidAt: "2025-12-14T21:35:00Z",
//             passengers: [
//               { name: "Eshan Islam", seat: "12A", passport: "AB1234567" },
//               { name: "Sarah Khan", seat: "12B", passport: "CD7890123" },
//             ],
//             ticketId: {
//               departureAt: "2025-12-15T08:00:00Z",
//               arrivalAt: "2025-12-15T09:30:00Z",
//               from: "Dhaka (DAC)",
//               to: "Chittagong (CGP)",
//               airline: "Bangladesh Airlines",
//               flightNo: "BG-203",
//               aircraft: "Boeing 737-800",
//               gate: "A12",
//               terminal: "Terminal 1",
//               checkInCounter: "Counter 5-8",
//               baggageAllowance: "20kg",
//               cabinClass: "Economy",
//               duration: "1h 30m",
//             },
//           },
//         },
//       });
//     }, 500);
//   });
// };

// // Mock data for transactions
// export const getMockTransactions = () => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({
//         data: {
//           success: true,
//           data: {
//             transactions: [
//               {
//                 id: "txn_001",
//                 ticketId: "tkt_789",
//                 description: "Dhaka to Chittagong AC Bus",
//                 amount: 1200,
//                 status: "completed",
//                 date: "2024-01-15T10:30:00Z",
//                 paymentMethod: "bKash",
//                 transactionId: "BK123456789",
//                 bookingId: "BK7890123"
//               },
//               {
//                 id: "txn_002",
//                 ticketId: "tkt_456",
//                 description: "Dhaka to Sylhet Train",
//                 amount: 800,
//                 status: "completed",
//                 date: "2024-01-10T14:20:00Z",
//                 paymentMethod: "Credit Card",
//                 transactionId: "CC987654321",
//                 bookingId: "BK7890124"
//               },
//               {
//                 id: "txn_003",
//                 ticketId: "tkt_123",
//                 description: "Chittagong to Cox's Bazar Bus",
//                 amount: 600,
//                 status: "pending",
//                 date: "2024-01-05T09:15:00Z",
//                 paymentMethod: "Nagad",
//                 transactionId: "NG555666777",
//                 bookingId: "BK7890125"
//               },
//               {
//                 id: "txn_004",
//                 ticketId: "tkt_999",
//                 description: "Dhaka to Cox's Bazar Flight",
//                 amount: 4500,
//                 status: "completed",
//                 date: "2023-12-28T16:45:00Z",
//                 paymentMethod: "Bank Transfer",
//                 transactionId: "BT888999000",
//                 bookingId: "BK7890126"
//               },
//             ],
//             stats: {
//               totalSpent: 7100,
//               totalTransactions: 4,
//               completed: 3,
//               pending: 1,
//               failed: 0
//             }
//           },
//         },
//       });
//     }, 500);
//   });
// };

// // Mock data for user profile
// export const getMockUserProfile = () => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({
//         data: {
//           success: true,
//           data: {
//             user: {
//               name: "John Doe",
//               email: "john.doe@example.com",
//               phone: "+8801712345678",
//               address: "123 Main Street, Dhaka 1212",
//               photo: "",
//               createdAt: "2024-01-01T00:00:00Z",
//               role: "user",
//               updatedAt: "2024-03-20T10:30:00Z"
//             }
//           }
//         }
//       });
//     }, 500);
//   });
// };

// // Mock data for vendor profile
// export const getMockVendorProfile = () => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({
//         data: {
//           success: true,
//           data: {
//             user: {
//               name: "Vendor User",
//               email: "vendor@example.com",
//               phone: "+8801712345679",
//               businessName: "Travel Express",
//               businessType: "transport",
//               address: "456 Business Road, Dhaka 1213",
//               city: "Dhaka",
//               country: "Bangladesh",
//               bio: "Providing premium travel services since 2010",
//               website: "https://travelexpress.com",
//               facebook: "https://facebook.com/travelexpress",
//               instagram: "https://instagram.com/travelexpress",
//               photo: "https://ui-avatars.com/api/?name=Vendor+User&background=4f46e5&color=fff",
//               role: "vendor",
//               verified: true,
//               createdAt: "2024-01-01T00:00:00Z",
//               updatedAt: "2024-03-20T10:30:00Z"
//             }
//           }
//         }
//       });
//     }, 500);
//   });
// };

// // Mock data for vendor cards/tickets
// export const getMockVendorCards = () => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({
//         data: {
//           success: true,
//           data: [
//             {
//               _id: "1",
//               title: "Dhaka to Chittagong AC Bus",
//               description: "Premium AC bus service with comfortable seating",
//               price: 1200,
//               category: "transport",
//               location: "Dhaka Bus Terminal",
//               from: "Dhaka",
//               to: "Chittagong",
//               transportType: "bus",
//               availableSeats: 15,
//               departureAt: "2024-02-15T08:00:00Z",
//               arrivalAt: "2024-02-15T14:00:00Z",
//               image: "https://via.placeholder.com/400x200?text=Bus+Ticket",
//               perks: {
//                 ac: true,
//                 wifi: true,
//                 food: false,
//                 tv: true,
//                 charging: true,
//                 blanket: true
//               },
//               vendorId: "vendor123",
//               vendorName: "Travel Express",
//               vendorEmail: "vendor@example.com",
//               verified: "approved",
//               status: "active",
//               createdAt: "2024-01-10T10:30:00Z",
//               updatedAt: "2024-01-15T14:20:00Z"
//             },
//             {
//               _id: "2",
//               title: "Sylhet Express Train",
//               description: "Comfortable train journey to Sylhet",
//               price: 800,
//               category: "transport",
//               location: "Dhaka Railway Station",
//               from: "Dhaka",
//               to: "Sylhet",
//               transportType: "train",
//               availableSeats: 25,
//               departureAt: "2024-02-16T07:00:00Z",
//               arrivalAt: "2024-02-16T13:00:00Z",
//               image: "https://via.placeholder.com/400x200?text=Train+Ticket",
//               perks: {
//                 ac: true,
//                 wifi: false,
//                 food: true,
//                 tv: false,
//                 charging: true,
//                 blanket: false
//               },
//               vendorId: "vendor123",
//               vendorName: "Travel Express",
//               vendorEmail: "vendor@example.com",
//               verified: "pending",
//               status: "pending",
//               createdAt: "2024-01-12T14:20:00Z",
//               updatedAt: "2024-01-12T14:20:00Z"
//             },
//             {
//               _id: "3",
//               title: "Cox's Bazar Flight",
//               description: "Quick flight to Cox's Bazar",
//               price: 4500,
//               category: "transport",
//               location: "Hazrat Shahjalal International Airport",
//               from: "Dhaka",
//               to: "Cox's Bazar",
//               transportType: "flight",
//               availableSeats: 8,
//               departureAt: "2024-02-18T10:00:00Z",
//               arrivalAt: "2024-02-18T11:30:00Z",
//               image: "https://via.placeholder.com/400x200?text=Flight+Ticket",
//               perks: {
//                 ac: true,
//                 wifi: true,
//                 food: true,
//                 tv: true,
//                 charging: true,
//                 blanket: true
//               },
//               vendorId: "vendor123",
//               vendorName: "Travel Express",
//               vendorEmail: "vendor@example.com",
//               verified: "rejected",
//               status: "inactive",
//               createdAt: "2024-01-08T09:15:00Z",
//               updatedAt: "2024-01-10T11:30:00Z"
//             }
//           ]
//         }
//       });
//     }, 500);
//   });
// };

// // Mock data for vendor bookings
// export const getMockVendorBookings = () => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({
//         data: {
//           success: true,
//           data: [
//             {
//               _id: "1",
//               bookingId: "BK-001",
//               customer: {
//                 name: "John Doe",
//                 email: "john@example.com",
//                 phone: "+8801711111111"
//               },
//               ticket: {
//                 title: "Dhaka to Chittagong AC Bus",
//                 price: 1200,
//                 _id: "ticket1"
//               },
//               seats: 2,
//               totalPrice: 2400,
//               status: "pending",
//               paymentMethod: "bkash",
//               transactionId: "TRX001",
//               createdAt: "2024-01-15T10:30:00Z",
//               departureDate: "2024-02-15T08:00:00Z"
//             },
//             {
//               _id: "2",
//               bookingId: "BK-002",
//               customer: {
//                 name: "Jane Smith",
//                 email: "jane@example.com",
//                 phone: "+8801722222222"
//               },
//               ticket: {
//                 title: "Sylhet Express Train",
//                 price: 800,
//                 _id: "ticket2"
//               },
//               seats: 1,
//               totalPrice: 800,
//               status: "accepted",
//               paymentMethod: "nagad",
//               transactionId: "TRX002",
//               createdAt: "2024-01-14T14:20:00Z",
//               departureDate: "2024-02-16T07:00:00Z"
//             },
//             {
//               _id: "3",
//               bookingId: "BK-003",
//               customer: {
//                 name: "Mike Johnson",
//                 email: "mike@example.com",
//                 phone: "+8801733333333"
//               },
//               ticket: {
//                 title: "Cox's Bazar Flight",
//                 price: 4500,
//                 _id: "ticket3"
//               },
//               seats: 3,
//               totalPrice: 13500,
//               status: "rejected",
//               paymentMethod: "credit_card",
//               transactionId: "TRX003",
//               createdAt: "2024-01-13T09:15:00Z",
//               departureDate: "2024-02-18T10:00:00Z"
//             }
//           ]
//         }
//       });
//     }, 500);
//   });
// };

// // Mock data for vendor revenue
// export const getMockVendorRevenue = () => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({
//         data: {
//           success: true,
//           data: {
//             totalRevenue: 2450,
//             pending: 450,
//             available: 2000,
//             thisMonth: 1250,
//             lastMonth: 1200,
//             totalTicketsSold: 45,
//             totalTicketsAdded: 28,
//             monthlyRevenue: [
//               { month: 'Jan', revenue: 1250 },
//               { month: 'Feb', revenue: 1450 },
//               { month: 'Mar', revenue: 1650 },
//               { month: 'Apr', revenue: 1850 },
//               { month: 'May', revenue: 2050 },
//               { month: 'Jun', revenue: 2450 }
//             ],
//             ticketSalesByType: [
//               { type: 'Bus', count: 25 },
//               { type: 'Train', count: 10 },
//               { type: 'Flight', count: 5 },
//               { type: 'Car', count: 3 },
//               { type: 'Launch', count: 2 }
//             ],
//             statusDistribution: [
//               { status: 'pending', count: 8 },
//               { status: 'approved', count: 15 },
//               { status: 'rejected', count: 3 },
//               { status: 'active', count: 2 }
//             ]
//           }
//         }
//       });
//     }, 500);
//   });
// };

// // ========== SMART API FUNCTIONS ==========
// export const smartGetBookings = async () => {
//   try {
//     // First try real API
//     const response = await getMyBookings();
//     return response;
//   } catch (error) {
//     // console.log("Real API failed, using mock data");
//     // Fall back to mock data
//     return getMockBookings();
//   }
// };

// export const smartGetBookingById = async (id) => {
//   try {
//     // First try user endpoint
//     const response = await getBookingById(id);
//     return response;
//   } catch (error) {
//     // console.log("User endpoint failed, trying admin endpoint...");
//     try {
//       // Try admin endpoint
//       const response = await getAdminBookingById(id);
//       return response;
//     } catch (secondError) {
//       // console.log("Both API endpoints failed, using mock data");
//       // Fall back to mock data
//       return getMockBookingById(id);
//     }
//   }
// };

// // Smart function for transactions
// export const smartGetTransactions = async () => {
//   try {
//     // First try real API
//     const response = await getUserTransactions();
//     return response;
//   } catch (error) {
//     // console.log("Real API failed, using mock data");
//     // Fall back to mock data
//     return getMockTransactions();
//   }
// };

// // Smart function for user profile
// export const smartGetUserProfile = async () => {
//   try {
//     // First try real API
//     const response = await getUserProfile();
//     return response;
//   } catch (error) {
//     // console.log("Real API failed, using mock data");
//     // Fall back to mock data
//     return getMockUserProfile();
//   }
// };

// // Smart function for vendor profile
// export const smartGetVendorProfile = async () => {
//   try {
//     // First try real API
//     const response = await getVendorProfile();
//     return response;
//   } catch (error) {
//     // console.log("Real API failed, using mock vendor profile");
//     // Fall back to mock data
//     return getMockVendorProfile();
//   }
// };

// // Smart function for vendor cards
// export const smartGetVendorCards = async (params = {}) => {
//   try {
//     // First try real API
//     const response = await getVendorCards(params);
//     return response;
//   } catch (error) {
//     // console.log("Real API failed, using mock vendor cards");
//     // Fall back to mock data
//     return getMockVendorCards();
//   }
// };

// // Smart function for vendor bookings
// export const smartGetVendorBookings = async (params = {}) => {
//   try {
//     // First try real API
//     const response = await getVendorBookings(params);
//     return response;
//   } catch (error) {
//     // console.log("Real API failed, using mock vendor bookings");
//     // Fall back to mock data
//     return getMockVendorBookings();
//   }
// };

// // Smart function for vendor revenue
// export const smartGetVendorRevenue = async (params = {}) => {
//   try {
//     // First try real API
//     const response = await getVendorRevenue(params);
//     return response;
//   } catch (error) {
//     // console.log("Real API failed, using mock vendor revenue");
//     // Fall back to mock data
//     return getMockVendorRevenue();
//   }
// };

// // Smart function for updating profile
// export const smartUpdateUserProfile = async (data) => {
//   try {
//     // First try real API
//     const response = await updateUserProfile(data);
//     return response;
//   } catch (error) {
//     // console.log("Real API failed, simulating success");
//     // Simulate success with mock data
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve({
//           data: {
//             success: true,
//             message: "Profile updated successfully (using mock)",
//             data: {
//               user: {
//                 ...data,
//                 updatedAt: new Date().toISOString()
//               }
//             }
//           }
//         });
//       }, 500);
//     });
//   }
// };

// // Smart function for updating vendor profile
// export const smartUpdateVendorProfile = async (data) => {
//   try {
//     // First try real API
//     const response = await updateVendorProfile(data);
//     return response;
//   } catch (error) {
//     // console.log("Real API failed, simulating success for vendor");
//     // Simulate success with mock data
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve({
//           data: {
//             success: true,
//             message: "Vendor profile updated successfully (using mock)",
//             data: {
//               user: {
//                 ...data,
//                 updatedAt: new Date().toISOString(),
//                 role: 'vendor'
//               }
//             }
//           }
//         });
//       }, 500);
//     });
//   }
// };

// // Smart function for creating vendor card
// export const smartCreateVendorCard = async (data) => {
//   try {
//     // First try real API
//     const response = await createVendorCard(data);
//     return response;
//   } catch (error) {
//     // console.log("Real API failed, simulating success");
//     // Simulate success with mock data
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve({
//           data: {
//             success: true,
//             message: "Ticket created successfully (using mock)",
//             data: {
//               ...data,
//               _id: `card_${Date.now()}`,
//               verified: 'pending',
//               status: 'pending',
//               createdAt: new Date().toISOString(),
//               updatedAt: new Date().toISOString()
//             }
//           }
//         });
//       }, 500);
//     });
//   }
// };

// // Smart function for updating booking status
// export const smartUpdateBookingStatus = async (bookingId, action) => {
//   try {
//     let response;
//     if (action === 'accept') {
//       response = await acceptBooking(bookingId);
//     } else {
//       response = await rejectBooking(bookingId);
//     }
//     return response;
//   } catch (error) {
//     // console.log("Real API failed, simulating success");
//     // Simulate success with mock data
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve({
//           data: {
//             success: true,
//             message: `Booking ${action}ed successfully (using mock)`,
//             data: {
//               bookingId,
//               status: action === 'accept' ? 'accepted' : 'rejected',
//               updatedAt: new Date().toISOString()
//             }
//           }
//         });
//       }, 500);
//     });
//   }
// };

// // Default export
// const api = {
//   // Core methods
//   request: apiRequest,
//   get: apiGet,
//   post: apiPost,
//   put: apiPut,
//   patch: apiPatch,
//   delete: apiDelete,

//   // Auth
//   getToken,
//   getIdToken,

//   // Public
//   getAdvertisedTickets,
//   getAllTickets,
//   getTicketById,
//   getHealthStatus,

//   // User
//   getUserProfile,
//   updateUserProfile,
//   getUserDashboard,
//   getMyBookings,
//   getBookingById,

//   // User Transactions
//   getUserTransactions,
//   getTransactionById,
//   exportTransactions,

//   // User Booking Operations
//   createBooking,
//   cancelBooking,
//   processPayment,
//   downloadTicket,

//   // Vendor (Existing)
//   submitVendorApplication,
//   getMyVendorApplication,
//   getVendorTickets,
//   createVendorTicket,
//   updateVendorTicket,
//   deleteVendorTicket,
//   getVendorDashboardStats,
//   getVendorCards,
//   createVendorCard,
//   updateVendorCard,
//   deleteVendorCard,
//   getVendorApplications,
//   approveVendorApplication,
//   rejectVendorApplication,

//   // Vendor (NEW ENDPOINTS)
//   getVendorProfile,
//   updateVendorProfile,
//   getVendorCardById,
//   getVendorBookings,
//   acceptBooking,
//   rejectBooking,
//   updateVendorBookingStatus,
//   getVendorRevenue,
//   getVendorEarnings,
//   requestWithdrawal,
//   getWithdrawalHistory,
//   getVendorStats,
//   getVendorAnalytics,

//   // Admin
//   getAdminDashboard,
//   getAdminTickets,
//   verifyTicket,
//   getAdminUsers,
//   updateUserRole,
//   getAdminVendorApplications,
//   getVendorApplicationById,
//   reviewVendorApplication,
//   getAdminBookings,
//   getAdminBookingById,
//   updateBookingStatus,
//   getBookingDetails,
//   getAdminReports,

//   // Payment
//   createPayment,
//   verifyPayment,
//   getPaymentMethods,
//   getPaymentStatus,

//   // Debug & Testing
//   checkAuthStatus,
//   testToken,
//   makeMeAdmin,
//   getDebugUsers,
//   getDebugTickets,
//   approveAllTickets,
//   createSampleTickets,
//   testAdminAccess,
//   forceSyncUser,

//   // Mock Data
//   getMockBookings,
//   getMockBookingById,
//   getMockTransactions,
//   getMockUserProfile,
//   getMockVendorProfile,
//   getMockVendorCards,
//   getMockVendorBookings,
//   getMockVendorRevenue,

//   // Smart Functions
//   smartGetBookings,
//   smartGetBookingById,
//   smartGetTransactions,
//   smartGetUserProfile,
//   smartUpdateUserProfile,
//   smartGetVendorProfile,
//   smartGetVendorCards,
//   smartGetVendorBookings,
//   smartGetVendorRevenue,
//   smartUpdateVendorProfile,
//   smartCreateVendorCard,
//   smartUpdateBookingStatus,

//   // Utility functions
//   testBackendConnection,
//   testAuthFlow,
//   forceAdminMode,
//   debugUserInfo,
// };

// export default api;
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "https://ticketbari-project-backend.vercel.app";

// Get token from localStorage
export function getToken() {
  const token = localStorage.getItem("firebaseToken");
  // console.log("🔑 getToken called, token exists:", !!token);
  if (token) {
    // console.log("📏 Token length:", token.length);
    // console.log("🔍 First 50 chars:", token.substring(0, 50));
  }
  return token;
}

export const getIdToken = getToken;

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor with better logging
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    // console.log(`📡 ${config.method?.toUpperCase()} ${config.url}`);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // console.log("✅ Token added to headers");
    } else {
      // console.log("⚠️ No token available for request");
    }

    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(
      `✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${
        response.status
      }`
    );
    return response;
  },
  (error) => {
    console.error(
      `❌ API Error: ${error.config?.method?.toUpperCase()} ${
        error.config?.url
      }`,
      {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      }
    );

    // Handle specific errors
    if (error.code === "ERR_NETWORK") {
      console.error(
        "🔴 Network Error - Check if backend is running on port 5000"
      );
    }

    if (error.response?.status === 401) {
      console.error("🔴 401 Unauthorized - Token invalid or expired");
      localStorage.removeItem("firebaseToken");
    }

    if (error.response?.status === 403) {
      console.error("🔴 403 Forbidden - Insufficient permissions");
    }

    return Promise.reject(error);
  }
);

// Generic API request
export const apiRequest = async (
  endpoint,
  method = "GET",
  data = null,
  params = {}
) => {
  try {
    // console.log(`📤 API Request: ${method} ${endpoint}`);
    const response = await apiClient({
      url: endpoint,
      method: method.toUpperCase(),
      data,
      params,
    });
    return response;
  } catch (error) {
    console.error(
      `❌ API Request failed: ${method} ${endpoint}`,
      error.message
    );
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

// PATCH request
export const apiPatch = (endpoint, data = {}) => {
  return apiRequest(endpoint, "PATCH", data);
};

// DELETE request
export const apiDelete = (endpoint) => {
  return apiRequest(endpoint, "DELETE");
};

// ========== PUBLIC ENDPOINTS ==========
export const getAdvertisedTickets = () => apiGet("/api/advertised");
export const getAllTickets = (params = {}) => apiGet("/api/tickets", params);
export const getTicketById = (id) => apiGet(`/api/tickets/${id}`);
export const getHealthStatus = () => apiGet("/api/health");

// ========== USER ENDPOINTS ==========
export const getUserProfile = () => apiGet("/api/user/profile");
export const updateUserProfile = (data) => apiPut("/api/user/profile", data);
export const getUserDashboard = () => apiGet("/api/user/dashboard");
export const getMyBookings = () => apiGet("/api/user/bookings"); // Changed from /api/my-bookings
export const getBookingById = (id) => apiGet(`/api/user/bookings/${id}`); // Added this line
export const createBooking = (data) => apiPost("/api/bookings", data);
export const cancelBooking = (id) => apiDelete(`/api/bookings/${id}`);
export const processPayment = (bookingId, data) =>
  apiPost(`/api/bookings/${bookingId}/pay`, data);
export const downloadTicket = (bookingId) =>
  apiGet(`/api/bookings/${bookingId}/download`, {}, { responseType: "blob" });

// ========== VENDOR ENDPOINTS ==========
export const submitVendorApplication = (data) =>
  apiPost("/api/apply-vendor", data);
export const getMyVendorApplication = () =>
  apiGet("/api/my-vendor-application");
export const getVendorTickets = () => apiGet("/api/vendor/tickets");
export const createVendorTicket = (data) =>
  apiPost("/api/vendor/tickets", data);
export const updateVendorTicket = (id, data) =>
  apiPut(`/api/vendor/tickets/${id}`, data);
export const deleteVendorTicket = (id) =>
  apiDelete(`/api/vendor/tickets/${id}`);

// Vendor Dashboard Endpoints
export const getVendorDashboardStats = () =>
  apiGet("/api/vendor/dashboard/stats");
export const getVendorCards = () => apiGet("/api/vendor/cards");
export const createVendorCard = (data) => apiPost("/api/vendor/cards", data);
export const updateVendorCard = (id, data) =>
  apiPut(`/api/vendor/cards/${id}`, data);
export const deleteVendorCard = (id) => apiDelete(`/api/vendor/cards/${id}`);
// (Removed duplicate commented line for getVendorApplications – admin version used below)

export const approveVendorApplication = (id) =>
  apiPut(`/api/vendor/applications/${id}/approve`);
export const rejectVendorApplication = (id) =>
  apiPut(`/api/vendor/applications/${id}/reject`);

// ========== ADMIN ENDPOINTS ==========
export const getAdminDashboard = () => apiGet("/api/admin/dashboard");
export const getAdminTickets = (filter = {}) =>
  apiGet("/api/admin/tickets", filter);
export const verifyTicket = (id, status) =>
  apiPut(`/api/admin/tickets/${id}/verify`, { status });
export const getAdminUsers = (filter = {}) =>
  apiGet("/api/admin/users", filter);
export const updateUserRole = (userId, role) =>
  apiPut(`/api/admin/users/${userId}/role`, { role });
// Single source for vendor applications (admin)
export const getVendorApplications = (filter = {}) =>
  apiGet("/api/admin/vendor-applications", filter);
export const getVendorApplicationById = (id) =>
  apiGet(`/api/admin/vendor-applications/${id}`);
export const reviewVendorApplication = (id, data) =>
  apiPut(`/api/admin/vendor-applications/${id}/review`, data);

// ========== ADMIN BOOKING ENDPOINTS ==========
export const getAdminBookings = (filter = {}) =>
  apiGet("/api/admin/bookings", filter);
export const getAdminBookingById = (id) => apiGet(`/api/admin/bookings/${id}`); // Added this line
export const updateBookingStatus = (bookingId, status) =>
  apiPut(`/api/admin/bookings/${bookingId}/status`, { status });
// Removed duplicate getBookingDetails – use getAdminBookingById instead

export const getAdminReports = (params = {}) =>
  apiGet("/api/admin/reports", params);

// ========== DEBUG & TESTING ENDPOINTS ==========
export const checkAuthStatus = () => apiGet("/api/debug/auth-check");
export const testToken = (token) =>
  apiPost("/api/debug/token-check", { token });
export const makeMeAdmin = () => apiPost("/api/debug/make-me-admin");
export const getDebugUsers = () => apiGet("/api/debug/users");
export const getDebugTickets = () => apiGet("/api/debug/tickets");
export const approveAllTickets = () => apiPost("/api/debug/approve-all");
export const createSampleTickets = () =>
  apiPost("/api/debug/create-sample-tickets");
export const testAdminAccess = () => apiGet("/api/debug/test-admin");
export const forceSyncUser = (email) =>
  apiGet(`/api/debug/force-sync/${email}`);

// ========== PAYMENT ENDPOINTS ========== // Added this section
export const createPayment = (data) => apiPost("/api/payments", data);
export const verifyPayment = (paymentId, data) =>
  apiPost(`/api/payments/${paymentId}/verify`, data);
export const getPaymentMethods = () => apiGet("/api/payment-methods");
export const getPaymentStatus = (paymentId) =>
  apiGet(`/api/payments/${paymentId}/status`);

// ========== TEST & UTILITY FUNCTIONS ==========
export const testBackendConnection = async () => {
  try {
    // console.log("🔍 Testing backend connection...");
    const response = await fetch(`${API_BASE}/api/health`);
    const data = await response.json();
    return {
      success: response.ok,
      status: response.status,
      data: data,
      message: "Backend is running",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      url: API_BASE,
    };
  }
};

// Test user authentication flow
export const testAuthFlow = async () => {
  try {
    // console.log("🧪 Testing authentication flow...");

    const results = {
      backendStatus: null,
      tokenStatus: null,
      profileStatus: null,
      adminStatus: null,
    };

    // 1. Test backend connection
    try {
      const backendRes = await testBackendConnection();
      results.backendStatus = backendRes;
      // console.log(
      //   "✅ Backend connection:",
      //   backendRes.success ? "OK" : "FAILED"
      // );
    } catch (error) {
      results.backendStatus = { success: false, error: error.message };
    }

    // 2. Test token
    const token = getToken();
    results.tokenStatus = {
      hasToken: !!token,
      tokenLength: token?.length || 0,
    };
    // console.log(
    //   "✅ Token status:",
    //   results.tokenStatus.hasToken ? "Present" : "Missing"
    // );

    // 3. Test profile endpoint
    try {
      const profileRes = await getUserProfile();
      results.profileStatus = {
        success: true,
        email: profileRes.data.data.user.email,
        role: profileRes.data.user.role,
      };
      // console.log(
      //   "✅ Profile access:",
      //   `Email: ${results.profileStatus.email}, Role: ${results.profileStatus.role}`
      // );
    } catch (error) {
      results.profileStatus = {
        success: false,
        error: error.message,
        status: error.response?.status,
      };
    }

    // 4. Test admin endpoint (if user is admin)
    if (
      results.profileStatus.success &&
      results.profileStatus.role === "admin"
    ) {
      try {
        const adminRes = await getAdminDashboard();
        results.adminStatus = {
          success: true,
          data: adminRes.data.data,
        };
        // console.log("✅ Admin access: Granted");
      } catch (error) {
        results.adminStatus = {
          success: false,
          error: error.message,
          status: error.response?.status,
        };
      }
    } else {
      results.adminStatus = {
        success: false,
        error: "User is not admin or profile not accessible",
        userRole: results.profileStatus.role,
      };
    }

    return results;
  } catch (error) {
    console.error("❌ Auth flow test failed:", error);
    return { success: false, error: error.message };
  }
};

// Force admin mode utility
export const forceAdminMode = async () => {
  try {
    // console.log("👑 Attempting to force admin mode...");

    // Step 1: Check current user
    const profile = await getUserProfile();
    // console.log(
    //   "Current user:",
    //   profile.data.user.email,
    //   "Role:",
    //   profile.data.user.role
    // );

    // Step 2: Make admin if not already
    if (profile.data.user.role !== "admin") {
      // console.log("⚠️ User is not admin, making admin...");
      const makeAdminRes = await makeMeAdmin();
      // console.log("Make admin result:", makeAdminRes.data.message);

      // Step 3: Refresh profile
      const newProfile = await getUserProfile();
      // console.log("New role:", newProfile.data.user.role);

      return {
        success: true,
        message: "Admin mode forced successfully",
        oldRole: profile.data.user.role,
        newRole: newProfile.data.user.role,
        user: newProfile.data.user,
      };
    } else {
      return {
        success: true,
        message: "User is already admin",
        role: profile.data.user.role,
        user: profile.data.user,
      };
    }
  } catch (error) {
    console.error("❌ Force admin mode failed:", error);
    return {
      success: false,
      error: error.message,
      code: error.response?.status,
    };
  }
};

// Debug user info
export const debugUserInfo = async () => {
  try {
    // console.log("🔍 Debugging user info...");

    const results = {};

    // 1. Local storage info
    results.localStorage = {
      hasToken: !!localStorage.getItem("firebaseToken"),
      hasUser: !!localStorage.getItem("user"),
      tokenLength: localStorage.getItem("firebaseToken")?.length || 0,
    };

    // 2. Backend users list
    try {
      const usersRes = await getDebugUsers();
      results.allUsers = usersRes.data.data.users;
      results.totalUsers = usersRes.data.data.count;

      // Find admin user
      results.adminUser = results.allUsers.find(
        (u) => u.email === "mahdiashan9@gmail.com"
      );
    } catch (error) {
      results.allUsersError = error.message;
    }

    // 3. Current auth status
    try {
      const authRes = await checkAuthStatus();
      results.authStatus = authRes.data.data;
    } catch (error) {
      results.authStatusError = error.message;
    }

    // 4. Current profile
    try {
      const profileRes = await getUserProfile();
      results.currentProfile = profileRes.data.user;
    } catch (error) {
      results.profileError = error.message;
    }

    return results;
  } catch (error) {
    console.error("❌ Debug user info failed:", error);
    return { success: false, error: error.message };
  }
};

// ========== MOCK DATA FUNCTIONS ========== // Added this section
export const getMockBookings = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          success: true,
          data: [
            {
              _id: "1",
              bookingReference: "TB-1765726189204-2",
              ticketTitle: "Flight to Chittagong",
              createdAt: "2025-12-14T21:29:00Z",
              quantity: 1,
              totalPrice: 4500.0,
              status: "paid",
              paymentMethod: "bkash",
              paidAt: "2025-12-14T21:35:00Z",
              ticketId: {
                departureAt: "2025-12-15T00:00:00Z",
                from: "Dhaka",
                to: "Chittagong",
                airline: "Bangladesh Airlines",
                flightNo: "BG-203",
              },
            },
            {
              _id: "2",
              bookingReference: "TB-1765726160429-3",
              ticketTitle: "Business Flight to Chittagong",
              createdAt: "2025-12-14T21:29:00Z",
              quantity: 1,
              totalPrice: 9500.0,
              status: "paid",
              paymentMethod: "nagad",
              paidAt: "2025-12-14T21:40:00Z",
              ticketId: {
                departureAt: "2026-01-20T00:00:00Z",
                from: "Dhaka",
                to: "Chittagong",
                airline: "Premium Airways",
                flightNo: "PA-501",
              },
            },
            {
              _id: "3",
              bookingReference: "TB-1765726139303-4",
              ticketTitle: "Business Flight to Chittagong",
              createdAt: "2025-12-14T21:28:00Z",
              quantity: 1,
              totalPrice: 9500.0,
              status: "confirmed",
              paymentMethod: null,
              ticketId: {
                departureAt: "2026-01-20T00:00:00Z",
                from: "Dhaka",
                to: "Chittagong",
                airline: "Premium Airways",
                flightNo: "PA-502",
              },
            },
          ],
        },
      });
    }, 500);
  });
};

export const getMockBookingById = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          success: true,
          data: {
            _id: id,
            bookingReference: "TB-1765726189204-2",
            ticketTitle: "Flight to Chittagong",
            createdAt: "2025-12-14T21:29:00Z",
            quantity: 2,
            totalPrice: 9000.0,
            status: "paid",
            paymentMethod: "bkash",
            transactionId: "TRX123456789",
            paidAt: "2025-12-14T21:35:00Z",
            passengers: [
              { name: "Eshan Islam", seat: "12A", passport: "AB1234567" },
              { name: "Sarah Khan", seat: "12B", passport: "CD7890123" },
            ],
            ticketId: {
              departureAt: "2025-12-15T08:00:00Z",
              arrivalAt: "2025-12-15T09:30:00Z",
              from: "Dhaka (DAC)",
              to: "Chittagong (CGP)",
              airline: "Bangladesh Airlines",
              flightNo: "BG-203",
              aircraft: "Boeing 737-800",
              gate: "A12",
              terminal: "Terminal 1",
              checkInCounter: "Counter 5-8",
              baggageAllowance: "20kg",
              cabinClass: "Economy",
              duration: "1h 30m",
            },
          },
        },
      });
    }, 500);
  });
};

// ========== SMART API FUNCTIONS ========== // Added this section
export const smartGetBookings = async () => {
  try {
    // First try real API
    const response = await getMyBookings();
    return response;
  } catch (error) {
    // console.log("Real API failed, using mock data");
    // Fall back to mock data
    return getMockBookings();
  }
};

export const smartGetBookingById = async (id) => {
  try {
    // First try user endpoint
    const response = await getBookingById(id);
    return response;
  } catch (error) {
    // console.log("User endpoint failed, trying admin endpoint...");
    try {
      // Try admin endpoint
      const response = await getAdminBookingById(id);
      return response;
    } catch (secondError) {
      // console.log("Both API endpoints failed, using mock data");
      // Fall back to mock data
      return getMockBookingById(id);
    }
  }
};

// Default export
const api = {
  // Core methods
  request: apiRequest,
  get: apiGet,
  post: apiPost,
  put: apiPut,
  patch: apiPatch,
  delete: apiDelete,

  // Auth
  getToken,
  getIdToken,

  // Public
  getAdvertisedTickets,
  getAllTickets,
  getTicketById,
  getHealthStatus,

  // User
  getUserProfile,
  updateUserProfile,
  getUserDashboard,
  getMyBookings,
  getBookingById, // Added
  createBooking,
  cancelBooking,
  processPayment,
  downloadTicket,

  // Vendor
  submitVendorApplication,
  getMyVendorApplication,
  getVendorTickets,
  createVendorTicket,
  updateVendorTicket,
  deleteVendorTicket,
  // Vendor
  getVendorDashboardStats, // NEW
  getVendorCards, // NEW
  createVendorCard, // NEW
  updateVendorCard, // NEW
  deleteVendorCard, // NEW
  // Removed duplicate getVendorApplications from Vendor section – kept under Admin only
  approveVendorApplication, // NEW
  rejectVendorApplication, // NEW

  // Admin
  getAdminDashboard,
  getAdminTickets,
  verifyTicket,
  getAdminUsers,
  updateUserRole,
  getVendorApplications, // Single source (admin)
  getVendorApplicationById,
  reviewVendorApplication,
  getAdminBookings,
  getAdminBookingById, // Added
  updateBookingStatus,
  // Removed duplicate getBookingDetails – use getAdminBookingById instead
  getAdminReports,

  // Payment
  createPayment,
  verifyPayment,
  getPaymentMethods,
  getPaymentStatus,

  // Debug & Testing
  checkAuthStatus,
  testToken,
  makeMeAdmin,
  getDebugUsers,
  getDebugTickets,
  approveAllTickets,
  createSampleTickets,
  testAdminAccess,
  forceSyncUser,

  // Mock Data
  getMockBookings,
  getMockBookingById,

  // Smart Functions
  smartGetBookings,
  smartGetBookingById,

  // Utility functions
  testBackendConnection,
  testAuthFlow,
  forceAdminMode,
  debugUserInfo,
};

export default api;