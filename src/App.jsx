// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import { AuthProvider } from "./contexts/AuthContext.jsx";
// import MainLayout from "./layouts/MainLayout.jsx";
// import Home from "./pages/Home.jsx";
// import AllTickets from "./pages/AllTickets.jsx";
// import TicketDetails from "./pages/TicketDetails.jsx";
// import Login from "./pages/Login.jsx";
// import Register from "./pages/Register.jsx";
// import Dashboard from "./pages/Dashboard.jsx";
// import NotFound from "./pages/NotFound.jsx";
// import ProtectedRoute from "./components/ProtectedRoute.jsx";
// import ApplyForVendor from "./pages/vendor/ApplyVendor.jsx";

// // Admin Components
// import AdminLayout from "./components/admin/AdminLayout.jsx";
// import AdminDashboard from "./components/admin/AdminDashboard.jsx";
// import AdminUsers from "./components/admin/AdminUsers.jsx";
// import AdminTickets from "./components/admin/AdminTickets.jsx";
// import AdminVendorApplications from "./components/admin/AdminVendorApplications.jsx";
// import AdminBookings from "./components/admin/AdminBookings.jsx";
// import AdminSettings from "./components/admin/AdminSettings.jsx";
// import AdminReports from "./components/admin/AdminReports.jsx";
// import DebugAuth from "./components/DebugAuth.jsx";

// function AppRoutes() {
//   return (
//     <Routes>
//       {/* Public Routes */}
//       <Route path="/" element={<MainLayout />}>
//         <Route index element={<Home />} />
//         <Route path="login" element={<Login />} />
//         <Route path="register" element={<Register />} />
//         <Route path="apply-vendor" element={<ApplyForVendor />} />
        
//         {/* Protected User Routes */}
//         <Route
//           path="tickets"
//           element={
//             <ProtectedRoute>
//               <AllTickets />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="tickets/:id"
//           element={
//             <ProtectedRoute>
//               <TicketDetails />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="dashboard/*"
//           element={
//             <ProtectedRoute>
//               <Dashboard />
//             </ProtectedRoute>
//           }
//         />
        
//         <Route path="*" element={<NotFound />} />
//       </Route>

//       {/* Admin Routes */}
//       <Route
//         path="/admin/*"
//         element={
//           <ProtectedRoute requireAdmin={true}>
//             <AdminLayout />
//           </ProtectedRoute>
//         }
//       >
//         <Route index element={<AdminDashboard />} />
//         <Route path="dashboard" element={<AdminDashboard />} />
//         <Route path="users" element={<AdminUsers />} />
//         <Route path="tickets" element={<AdminTickets />} />
//         <Route path="vendor-applications" element={<AdminVendorApplications />} />
//         <Route path="bookings" element={<AdminBookings />} />
//         <Route path="reports" element={<AdminReports />} />
//         <Route path="settings" element={<AdminSettings />} />
//       </Route>
     
// <Route path="/debug-auth" element={<DebugAuth />} />

//     </Routes>
//   );
// }

// export default function App() {
//   return (
//     <AuthProvider>
//       <AppRoutes />
//     </AuthProvider>
//   );
// }
import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import Home from "./pages/Home.jsx";
import AllTickets from "./pages/AllTickets.jsx";
import TicketDetails from "./pages/TicketDetails.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Payment from "./pages/Payment.jsx"; // ADD THIS IMPORT
import NotFound from "./pages/NotFound.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ApplyForVendor from "./pages/vendor/ApplyVendor.jsx";

// Admin Components
import AdminLayout from "./components/admin/AdminLayout.jsx";
import AdminDashboard from "./components/admin/AdminDashboard.jsx";
import AdminUsers from "./components/admin/AdminUsers.jsx";
import AdminTickets from "./components/admin/AdminTickets.jsx";
import AdminVendorApplications from "./components/admin/AdminVendorApplications.jsx";
import AdminBookings from "./components/admin/AdminBookings.jsx";
import AdminSettings from "./components/admin/AdminSettings.jsx";
import AdminReports from "./components/admin/AdminReports.jsx";
import DebugAuth from "./components/DebugAuth.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import BookingDetails from "./pages/BookingDetails.jsx";

// User booking routes
// import MyBookings from "./pages/MyBookings.jsx"; // You might want to create this
// import BookingDetails from "./pages/BookingDetails.jsx"; // You might want to create this

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="apply-vendor" element={<ApplyForVendor />} />
        
        {/* Protected User Routes */}
        <Route
          path="tickets"
          element={
            <ProtectedRoute>
              <AllTickets />
            </ProtectedRoute>
          }
        />
        <Route
          path="tickets/:id"
          element={
            <ProtectedRoute>
              <TicketDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* ADD THESE PAYMENT ROUTES */}
        <Route
          path="payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />
        {/* Optional: Add booking routes if you have them */}
        <Route
          path="my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="my-bookings/:id"
          element={
            <ProtectedRoute>
              <BookingDetails />
            </ProtectedRoute>
          }
        />
        
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="tickets" element={<AdminTickets />} />
        <Route path="vendor-applications" element={<AdminVendorApplications />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
     
      <Route path="/debug-auth" element={<DebugAuth />} />

    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}