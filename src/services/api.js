// import axios from "axios";

// const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

// export async function getIdToken() {
//   // Firebase Auth will be used to get current user token
//   try {
//     const { auth } = await import("../firebase.config.js");
//     const user = auth.currentUser;
//     if (!user) return null;
//     return await user.getIdToken();
//   } catch (e) {
//     return null;
//   }
// }

// export async function apiRequest(
//   endpoint,
//   method = "get",
//   data = null,
//   opts = {}
// ) {
//   const token = await getIdToken();
//   const headers = { ...(opts.headers || {}) };
//   if (token) headers["Authorization"] = `Bearer ${token}`;
//   //   return axios({ url: VITE_API_BASE + endpoint, method, data, headers });
//   return axios({ url: API_BASE + endpoint, method, data, headers });
// }
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export async function getIdToken() {
  try {
    const { auth } = await import("../firebase.config.js");
    const user = auth.currentUser;
    if (!user) return null;
    return await user.getIdToken();
  } catch (e) {
    console.error("Error getting ID token:", e);
    return null;
  }
}

export async function apiRequest(
  endpoint,
  method = "get",
  data = null,
  opts = {}
) {
  const token = await getIdToken();
  const headers = { ...(opts.headers || {}) };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    const response = await axios({
      url: API_BASE + endpoint,
      method,
      data,
      headers,
      timeout: 10000, // 10 second timeout
    });
    return response;
  } catch (error) {
    // Handle connection refused errors gracefully
    if (
      error.code === "ERR_NETWORK" ||
      error.message.includes("ECONNREFUSED")
    ) {
      console.error(
        "Backend server is not running. Please start the server on port 5000."
      );
      // Return mock data for development or show user-friendly message
      return {
        data: {
          tickets: [],
          message: "Backend server is not available. Please start the server.",
        },
      };
    }
    throw error;
  }
}
