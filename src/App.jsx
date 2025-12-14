// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import MainLayout from "./layouts/MainLayout.jsx";
// import Home from "./pages/Home.jsx";
// import AllTickets from "./pages/AllTickets.jsx";
// import TicketDetails from "./pages/TicketDetails.jsx";
// import Login from "./pages/Login.jsx";
// import Register from "./pages/Register.jsx";
// import Dashboard from "./pages/Dashboard.jsx";
// import NotFound from "./pages/NotFound.jsx";
// import ProtectedRoute from "./components/ProtectedRoute.jsx";
// import DebugAuth from "./pages/DebugAuth.jsx"; // Add this import
// import ApplyForVendor from "./pages/vendor/ApplyVendor.jsx"; // Add this import
// import AdminVendorApplications from "./components/AdminVendorApplications.jsx"; // Add this import
// import AdminProtectedRoute from "./components/auth/AdminProtectedRoute.jsx";

// export default function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<MainLayout />}>
//         <Route index element={<Home />} />
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
//         <Route path="login" element={<Login />} />
//         <Route path="register" element={<Register />} />
//         <Route
//           path="dashboard/*"
//           element={
//             <ProtectedRoute>
//               <Dashboard />
//             </ProtectedRoute>
//           }
//         />
//         <Route path="apply-vendor" element={<ApplyForVendor />} />
//         {/* <Route path="admin/vendor-applications" element={<AdminVendorApplications />} /> */}
//         <Route
//           path="Admin-Vendor-Applications"
//           element={
//             <AdminProtectedRoute>
//               <AdminVendorApplications />
//             </AdminProtectedRoute>
//           }
//         />
//         {/* <Route path="admin/Admin-Vendor-Applications" element={<AdminVendorApplications />} /> */}
//         {/* Add debug route */}
//         <Route path="debug-auth" element={<DebugAuth />} />
//         <Route path="*" element={<NotFound />} />
//       </Route>
//     </Routes>
//   );
// }
import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import Home from "./pages/Home.jsx";
import AllTickets from "./pages/AllTickets.jsx";
import TicketDetails from "./pages/TicketDetails.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import NotFound from "./pages/NotFound.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ApplyForVendor from "./pages/vendor/ApplyVendor.jsx";
import AdminVendorApplications from "./components/admin/AdminVendorApplications.jsx";
import AdminProtectedRoute from "./components/auth/AdminProtectedRoute.jsx";
import AdminDashboard from "./components/admin/AdminDashboard.jsx";
import AdminBookings from "./components/admin/AdminBookings.jsx";
import AdminTickets from "./components/admin/AdminTickets.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
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
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route
          path="dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="apply-vendor" element={<ApplyForVendor />} />
        
        {/* Admin Routes */}
        <Route
          path="admin"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="admin/vendor-applications"
          element={
            <AdminProtectedRoute>
              <AdminVendorApplications />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="admin/tickets"
          element={
            <AdminProtectedRoute>
              <AdminTickets />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="admin/bookings"
          element={
            <AdminProtectedRoute>
              <AdminBookings />
            </AdminProtectedRoute>
          }
        />
        
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}