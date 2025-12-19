
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
// import Payment from "./pages/Payment.jsx";
// import NotFound from "./pages/NotFound.jsx";
// import ProtectedRoute from "./components/ProtectedRoute.jsx";
// import ApplyForVendor from "./pages/vendor/ApplyVendor.jsx";

// // Vendor Components
// import VendorDashboard from "./components/Vendor/VendorDashboard.jsx";
// import VendorProtectedRoute from "./components/Vendor/VendorProtectedRoute.jsx";

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

// // User booking routes
// import MyBookings from "./pages/MyBookings.jsx";
// import BookingDetails from "./pages/BookingDetails.jsx";

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
//           path="dashboard"
//           element={
//             <ProtectedRoute>
//               <Dashboard />
//             </ProtectedRoute>
//           }
//         />
        
//         {/* Payment Route */}
//         <Route
//           path="payment"
//           element={
//             <ProtectedRoute>
//               <Payment />
//             </ProtectedRoute>
//           }
//         />
        
//         {/* User Booking Routes */}
//         <Route
//           path="my-bookings"
//           element={
//             <ProtectedRoute>
//               <MyBookings />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="my-bookings/:id"
//           element={
//             <ProtectedRoute>
//               <BookingDetails />
//             </ProtectedRoute>
//           }
//         />
        
//         <Route path="*" element={<NotFound />} />
//       </Route>

//       {/* Vendor Dashboard Route */}
//       <Route
//         path="/vendor/dashboard"
//         element={
//           <ProtectedRoute>
//             <VendorProtectedRoute>
//               <VendorDashboard />
//             </VendorProtectedRoute>
//           </ProtectedRoute>
//         }
//       />

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
     
//       {/* Debug Route */}
//       <Route path="/debug-auth" element={<DebugAuth />} />

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
// src/App.jsx - COMPLETE VERSION WITH ALL VENDOR ROUTES
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
import Payment from "./pages/Payment.jsx";
import NotFound from "./pages/NotFound.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ApplyForVendor from "./pages/vendor/ApplyVendor.jsx";

// Vendor Components
import VendorProtectedRoute from "./components/Vendor/VendorProtectedRoute.jsx";
import VendorDashboard from "./components/Vendor/VendorDashboard.jsx";
import VendorCards from "./components/Vendor/VendorCards.jsx";
import VendorApplications from "./components/Vendor/VendorApplications.jsx";
import VendorCreateCard from "./components/Vendor/VendorCreateCard.jsx";
import VendorEarnings from "./components/Vendor/VendorEarnings.jsx";
import VendorProfile from "./components/Vendor/VendorProfile.jsx";
import VendorBookings from "./components/Vendor/VendorBookings.jsx";

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

// User booking routes
import MyBookings from "./pages/MyBookings.jsx";
import BookingDetails from "./pages/BookingDetails.jsx";

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
        
        {/* Payment Route */}
        <Route
          path="payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />
        
        {/* User Booking Routes */}
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

      {/* Vendor Routes */}
      <Route
        path="/vendor/*"
        element={
          <ProtectedRoute>
            <VendorProtectedRoute />
          </ProtectedRoute>
        }
      >
        <Route index element={<VendorDashboard />} />
        <Route path="dashboard" element={<VendorDashboard />} />
        <Route path="cards" element={<VendorCards />} />
        <Route path="applications" element={<VendorApplications />} />
        <Route path="create-card" element={<VendorCreateCard />} />
        <Route path="earnings" element={<VendorEarnings />} />
        <Route path="profile" element={<VendorProfile />} />
        <Route path="bookings" element={<VendorBookings />} />
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
     
      {/* Debug Route */}
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