

// import React, { useState, useEffect } from "react";
// import { apiGet, getToken } from "../services/api";
// import { useAuth } from "../contexts/AuthContext";
// import { TbCurrencyTaka } from "react-icons/tb";
// import { useNavigate, Link } from "react-router-dom"; // Added Link import

// const Dashboard = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [dashboardData, setDashboardData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [paymentMethod, setPaymentMethod] = useState("bkash");
//   const [processingPayment, setProcessingPayment] = useState(false);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       const token = getToken();

//       if (!token) {
//         setError("Please login to view dashboard");
//         setLoading(false);
//         return;
//       }

//       const response = await apiGet("/api/user/dashboard");

//       if (response.data?.success) {
//         setDashboardData(response.data.data);
//       } else {
//         setError("Failed to load dashboard data");
//       }
//     } catch (err) {
//       console.error("Dashboard error:", err);
//       setError(err.message || "Failed to load dashboard");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePayClick = (booking) => {
//     setSelectedBooking(booking);
//     setShowPaymentModal(true);
//   };

//   const handlePayment = async () => {
//     if (!selectedBooking) return;
    
//     setProcessingPayment(true);
//     try {
//       // Simulate payment processing
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       // Show success popup
//       alert(`Payment successful for booking ${selectedBooking.bookingReference || selectedBooking._id}!`);
      
//       // Close modal and refresh data
//       setShowPaymentModal(false);
//       setSelectedBooking(null);
//       fetchDashboardData();
      
//       // You would typically call your payment API here:
//       // const response = await apiPost(`/api/bookings/${selectedBooking._id}/pay`, {
//       //   method: paymentMethod,
//       //   amount: selectedBooking.totalPrice
//       // });
      
//     } catch (error) {
//       alert("Payment failed. Please try again.");
//       console.error("Payment error:", error);
//     } finally {
//       setProcessingPayment(false);
//     }
//   };

//   const handleViewDetails = (booking) => {
//     navigate(`/my-bookings/${booking._id}`);
//   };

//   const getStatusBadge = (status) => {
//     const statusColors = {
//       pending: "bg-yellow-100 text-yellow-800",
//       confirmed: "bg-green-100 text-green-800",
//       cancelled: "bg-red-100 text-red-800",
//       completed: "bg-blue-100 text-blue-800",
//       paid: "bg-purple-100 text-purple-800"
//     };

//     return (
//       <span className={`px-3 py-1 text-xs rounded-full ${statusColors[status] || "bg-gray-100 text-gray-800"}`}>
//         {status.toUpperCase()}
//       </span>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[60vh]">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-[60vh]">
//         <div className="text-center">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
//             <span className="text-2xl">⚠️</span>
//           </div>
//           <h3 className="text-lg font-semibold text-gray-700 mb-2">Error</h3>
//           <p className="text-gray-500">{error}</p>
//           <button
//             onClick={fetchDashboardData}
//             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
//         <p className="text-gray-600 mt-2">
//           Welcome back, {user?.displayName || user?.email}
//         </p>
//       </div>

//       {dashboardData && (
//         <>
//           {/* Stats Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//             <div className="bg-white p-6 rounded-xl shadow-sm border">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-500">Total Bookings</p>
//                   <p className="text-3xl font-bold text-gray-900">
//                     {dashboardData.stats?.totalBooked || 0}
//                   </p>
//                 </div>
//                 <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
//                   <span className="text-2xl">📅</span>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white p-6 rounded-xl shadow-sm border">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-500">Pending</p>
//                   <p className="text-3xl font-bold text-yellow-600">
//                     {dashboardData.stats?.pending || 0}
//                   </p>
//                 </div>
//                 <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
//                   <span className="text-2xl">⏳</span>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white p-6 rounded-xl shadow-sm border">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-500">Confirmed</p>
//                   <p className="text-3xl font-bold text-green-600">
//                     {dashboardData.stats?.confirmed || 0}
//                   </p>
//                 </div>
//                 <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
//                   <span className="text-2xl">✅</span>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white p-6 rounded-xl shadow-sm border">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-500">Total Spent</p>
//                   <p className="text-3xl font-bold text-gray-900 flex items-center">
//                     <TbCurrencyTaka />
//                     {dashboardData.stats?.totalSpent?.toFixed(2) || "0.00"}
//                   </p>
//                 </div>
//                 <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
//                   <span className="text-2xl">💰</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Recent Bookings */}
//           {dashboardData.recentBookings &&
//             dashboardData.recentBookings.length > 0 && (
//               <div className="bg-white rounded-xl shadow-sm border">
//                 <div className="p-6 border-b">
//                   <h2 className="text-lg font-semibold text-gray-900">
//                     Recent Bookings
//                   </h2>
//                 </div>
//                 <div className="p-6">
//                   <div className="space-y-4">
//                     {dashboardData.recentBookings.map((booking) => (
//                       <div
//                         key={booking._id}
//                         className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
//                       >
//                         <div className="flex-1 mb-3 md:mb-0">
//                           <div className="flex items-center gap-3 mb-2">
//                             {getStatusBadge(booking.status)}
//                             <p className="text-sm text-gray-500">
//                               {booking.bookingReference || `#${booking._id?.slice(-6) || 'N/A'}`}
//                             </p>
//                           </div>
//                           <p className="font-medium text-gray-900">
//                             {booking.ticketTitle || "Unknown Ticket"}
//                           </p>
//                           <p className="text-sm text-gray-500">
//                             {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString("en-US", {
//                               year: "numeric",
//                               month: "short",
//                               day: "numeric",
//                               hour: "2-digit",
//                               minute: "2-digit"
//                             }) : "Date not available"}
//                             • {booking.quantity || 1} ticket(s)
//                           </p>
//                           {booking.ticketId?.departureAt && (
//                             <p className="text-xs text-gray-400 mt-1">
//                               Departure: {new Date(booking.ticketId.departureAt).toLocaleDateString()}
//                             </p>
//                           )}
//                         </div>
                        
//                         <div className="flex flex-col md:flex-row md:items-center gap-3">
//                           <div className="text-right md:text-left mb-2 md:mb-0">
//                             <p className="font-semibold text-gray-900 flex items-center justify-end md:justify-start">
//                               <TbCurrencyTaka className="mr-1" />
//                               {booking.totalPrice?.toFixed(2) || "0.00"}
//                             </p>
//                           </div>
                          
//                           {/* <div className="flex gap-2">
//                             <button
//                               onClick={() => handleViewDetails(booking)}
//                               className="px-3 py-1.5 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
//                             >
//                               Details
//                             </button> */}
                            
//                             {/* // In Dashboard.jsx, replace the Pay Now button action: */}
// <button
//     onClick={() => navigate('/payment', { state: { booking, user } })}
//     className="px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
// >
//     Pay Now
// </button>
                            
                            
//                             {booking.status === "pending" && (
//                               <span className="px-3 py-1.5 text-sm bg-gray-100 text-gray-500 rounded-lg">
//                                 Awaiting Approval
//                               </span>
//                             )}
                            
//                             {booking.status === "cancelled" && (
//                               <span className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg">
//                                 Cancelled
//                               </span>
//                             )}
                            
//                             {booking.status === "completed" && (
//                               <span className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg">
//                                 Completed
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
                  
//                   {dashboardData.recentBookings.length > 0 && (
//                     <div className="mt-6 text-center">
//                       <Link
//                         to="/my-bookings"
//                         className="text-blue-600 hover:text-blue-800 font-medium"
//                       >
//                         View All Bookings →
//                       </Link>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//           {/* Empty State */}
//           {(!dashboardData.recentBookings || dashboardData.recentBookings.length === 0) && (
//             <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
//               <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
//                 <span className="text-3xl">📅</span>
//               </div>
//               <h3 className="text-lg font-semibold text-gray-700 mb-2">No Bookings Yet</h3>
//               <p className="text-gray-500 mb-6">You haven't made any bookings yet.</p>
//               <Link
//                 to="/tickets"
//                 className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors inline-block"
//               >
//                 Browse Tickets
//               </Link>
//             </div>
//           )}
//         </>
//       )}

//       {/* Payment Modal */}
//       {showPaymentModal && selectedBooking && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
//             {/* Modal Header */}
//             <div className="p-6 border-b">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-xl font-bold text-gray-900">Complete Payment</h3>
//                 <button
//                   onClick={() => setShowPaymentModal(false)}
//                   className="text-gray-400 hover:text-gray-600"
//                   disabled={processingPayment}
//                 >
//                   ✕
//                 </button>
//               </div>
//               <p className="text-gray-600 mt-2">Complete payment for your booking</p>
//             </div>

//             {/* Modal Body */}
//             <div className="p-6">
//               {/* Booking Info */}
//               <div className="mb-6 p-4 bg-blue-50 rounded-lg">
//                 <div className="flex justify-between items-start mb-2">
//                   <div>
//                     <p className="font-semibold text-gray-800">{selectedBooking.ticketTitle || "Unknown Ticket"}</p>
//                     <p className="text-sm text-gray-600">Booking: {selectedBooking.bookingReference || `#${selectedBooking._id?.slice(-6) || 'N/A'}`}</p>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-lg font-bold text-gray-900 flex items-center">
//                       <TbCurrencyTaka className="mr-1" />
//                       {selectedBooking.totalPrice?.toFixed(2) || "0.00"}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Payment Method Selection */}
//               <div className="mb-6">
//                 <label className="block text-sm font-medium text-gray-700 mb-3">
//                   Select Payment Method
//                 </label>
//                 <div className="grid grid-cols-2 gap-3">
//                   {["bkash", "nagad", "rocket", "card"].map((method) => (
//                     <button
//                       key={method}
//                       type="button"
//                       onClick={() => setPaymentMethod(method)}
//                       className={`p-4 border rounded-lg flex flex-col items-center justify-center transition-all ${
//                         paymentMethod === method
//                           ? "border-blue-500 bg-blue-50"
//                           : "border-gray-200 hover:border-gray-300"
//                       }`}
//                     >
//                       <div className="w-10 h-10 mb-2 flex items-center justify-center">
//                         {method === "bkash" && (
//                           <span className="text-2xl text-pink-600">B</span>
//                         )}
//                         {method === "nagad" && (
//                           <span className="text-2xl text-green-600">N</span>
//                         )}
//                         {method === "rocket" && (
//                           <span className="text-2xl text-purple-600">R</span>
//                         )}
//                         {method === "card" && (
//                           <span className="text-2xl text-blue-600">💳</span>
//                         )}
//                       </div>
//                       <span className="text-sm font-medium capitalize">{method}</span>
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Payment Instructions */}
//               {paymentMethod && (
//                 <div className="mb-6 p-4 bg-gray-50 rounded-lg">
//                   <p className="text-sm text-gray-600 mb-2">
//                     <strong>Payment Instructions:</strong>
//                   </p>
//                   <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
//                     <li>Go to your {paymentMethod} app</li>
//                     <li>Send {selectedBooking.totalPrice?.toFixed(2) || "0.00"} Tk to 017XXXXXXXX</li>
//                     <li>Enter transaction ID after payment</li>
//                     <li>Booking will be confirmed automatically</li>
//                   </ul>
//                 </div>
//               )}
//             </div>

//             {/* Modal Footer */}
//             <div className="p-6 border-t flex gap-3">
//               <button
//                 onClick={() => setShowPaymentModal(false)}
//                 className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
//                 disabled={processingPayment}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handlePayment}
//                 disabled={processingPayment}
//                 className={`flex-1 px-4 py-3 bg-green-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center ${
//                   processingPayment ? "opacity-75 cursor-not-allowed" : "hover:bg-green-700"
//                 }`}
//               >
//                 {processingPayment ? (
//                   <>
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                     Processing...
//                   </>
//                 ) : (
//                   "Confirm Payment"
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

import React, { useState, useEffect } from "react";
import { apiGet, getToken } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { TbCurrencyTaka } from "react-icons/tb";
import { useNavigate, Link } from "react-router-dom";
import { 
  FaCalendarAlt, 
  FaClock, 
  FaCheckCircle, 
  FaMoneyBillWave,
  FaTicketAlt,
  FaPlane,
  FaUser
} from "react-icons/fa";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for demonstration
  const mockDashboardData = {
    stats: {
      totalBooked: 3,
      pending: 0,
      confirmed: 3,
      totalSpent: 23500.00
    },
    recentBookings: [
      {
        _id: "1",
        bookingReference: "TB-1765726189204-2",
        ticketTitle: "Flight to Chittagong",
        createdAt: "2025-12-14T21:29:00Z",
        quantity: 1,
        totalPrice: 4500.00,
        status: "confirmed",
        ticketId: {
          departureAt: "2025-12-15T00:00:00Z"
        }
      },
      {
        _id: "2",
        bookingReference: "TB-1765726160429-3",
        ticketTitle: "Business Flight to Chittagong",
        createdAt: "2025-12-14T21:29:00Z",
        quantity: 1,
        totalPrice: 9500.00,
        status: "confirmed",
        ticketId: {
          departureAt: "2026-01-20T00:00:00Z"
        }
      },
      {
        _id: "3",
        bookingReference: "TB-1765726139303-4",
        ticketTitle: "Business Flight to Chittagong",
        createdAt: "2025-12-14T21:28:00Z",
        quantity: 1,
        totalPrice: 9500.00,
        status: "confirmed",
        ticketId: {
          departureAt: "2026-01-20T00:00:00Z"
        }
      }
    ],
    upcomingTrips: [
      {
        id: 1,
        destination: "Chittagong",
        date: "Dec 15, 2025",
        time: "09:00 AM",
        status: "confirmed",
        type: "Flight"
      }
    ]
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = getToken();

      if (!token) {
        setError("Please login to view dashboard");
        setLoading(false);
        return;
      }

      // Try to fetch from API first
      try {
        const response = await apiGet("/api/user/dashboard");
        if (response.data?.success) {
          setDashboardData(response.data.data);
        } else {
          // Fallback to mock data if API fails
          setDashboardData(mockDashboardData);
        }
      } catch (apiError) {
        // Use mock data for demonstration
        console.log("Using mock data for demonstration");
        setDashboardData(mockDashboardData);
      }
    } catch (err) {
      console.error("Dashboard error:", err);
      setError(err.message || "Failed to load dashboard");
      // Fallback to mock data
      setDashboardData(mockDashboardData);
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = (booking) => {
    // Navigate directly to payment page with booking details
    navigate('/payment', { 
      state: { 
        booking: booking,
        user: user 
      } 
    });
  };

  const handleViewDetails = (booking) => {
    navigate(`/my-bookings/${booking._id}`);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        icon: "⏳"
      },
      confirmed: {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: "✅"
      },
      cancelled: {
        bg: "bg-red-100",
        text: "text-red-800",
        icon: "❌"
      },
      completed: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        icon: "✓"
      },
      paid: {
        bg: "bg-purple-100",
        text: "text-purple-800",
        icon: "💳"
      }
    };

    const config = statusConfig[status] || { bg: "bg-gray-100", text: "text-gray-800", icon: "●" };

    return (
      <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${config.bg} ${config.text} flex items-center gap-1.5`}>
        <span>{config.icon}</span>
        {status.toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-50 rounded-full mb-6">
            <span className="text-3xl text-red-500">⚠️</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Unable to Load Dashboard</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={fetchDashboardData}
              className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, <span className="font-semibold text-blue-600">{user?.displayName || user?.email || "Guest"}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/tickets')}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
          >
            <span className="flex items-center gap-2">
              <FaTicketAlt />
              Book New Ticket
            </span>
          </button>
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl shadow-sm border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Bookings</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {dashboardData?.stats?.totalBooked || 0}
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <FaCalendarAlt className="text-white text-xl" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-blue-100">
            <p className="text-xs text-gray-500">All time bookings</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-yellow-50 p-6 rounded-2xl shadow-sm border border-yellow-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Pending</p>
              <p className="text-3xl font-bold text-yellow-600 mt-1">
                {dashboardData?.stats?.pending || 0}
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
              <FaClock className="text-white text-xl" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-yellow-100">
            <p className="text-xs text-gray-500">Awaiting confirmation</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-green-50 p-6 rounded-2xl shadow-sm border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Confirmed</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {dashboardData?.stats?.confirmed || 0}
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <FaCheckCircle className="text-white text-xl" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-green-100">
            <p className="text-xs text-gray-500">Active bookings</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-purple-50 p-6 rounded-2xl shadow-sm border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Spent</p>
              <p className="text-3xl font-bold text-gray-900 mt-1 flex items-center">
                <TbCurrencyTaka className="mr-1" />
                {(dashboardData?.stats?.totalSpent || 0).toFixed(2)}
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <FaMoneyBillWave className="text-white text-xl" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-purple-100">
            <p className="text-xs text-gray-500">All transactions</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings - 2/3 width */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FaTicketAlt className="text-blue-600" />
                  Recent Bookings
                </h2>
                <span className="text-sm text-gray-500">
                  Last {dashboardData?.recentBookings?.length || 0} bookings
                </span>
              </div>
            </div>
            
            <div className="p-6">
              {dashboardData?.recentBookings && dashboardData.recentBookings.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.recentBookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="group p-5 bg-gradient-to-r from-white to-gray-50 hover:from-blue-50 hover:to-white border border-gray-200 hover:border-blue-200 rounded-xl transition-all duration-300"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Left Section */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            {getStatusBadge(booking.status)}
                            <div className="text-sm font-mono text-gray-500 bg-gray-100 px-3 py-1 rounded">
                              {booking.bookingReference || `#${booking._id?.slice(-6) || 'N/A'}`}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700">
                              {booking.ticketTitle || "Unknown Ticket"}
                            </h3>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1.5">
                                <FaCalendarAlt className="text-gray-400" />
                                {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }) : "Date not available"}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <FaClock className="text-gray-400" />
                                {booking.createdAt ? new Date(booking.createdAt).toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit"
                                }) : ""}
                              </span>
                              <span>• {booking.quantity || 1} ticket(s)</span>
                            </div>
                            
                            {booking.ticketId?.departureAt && (
                              <div className="flex items-center gap-2 text-sm">
                                <FaPlane className="text-gray-400" />
                                <span className="text-gray-700 font-medium">Departure:</span>
                                <span className="text-gray-600">
                                  {new Date(booking.ticketId.departureAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric"
                                  })}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right Section */}
                        <div className="flex flex-col items-end gap-3">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900 flex items-center justify-end">
                              <TbCurrencyTaka className="mr-1 mt-1" />
                              {booking.totalPrice?.toFixed(2) || "0.00"}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Total Amount</p>
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleViewDetails(booking)}
                              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors flex items-center gap-2"
                            >
                              <span>Details</span>
                            </button>
                            
                            {booking.status === "confirmed" && (
                              <button
                                onClick={() => handlePayNow(booking)}
                                className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium rounded-lg transition-all shadow-md flex items-center gap-2"
                              >
                                <FaMoneyBillWave />
                                Pay Now
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                    <FaTicketAlt className="text-3xl text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No Bookings Yet</h3>
                  <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                    You haven't made any bookings yet. Start your journey by booking your first ticket.
                  </p>
                  <button
                    onClick={() => navigate('/tickets')}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all shadow-md"
                  >
                    Browse Available Tickets
                  </button>
                </div>
              )}
              
              {dashboardData?.recentBookings && dashboardData.recentBookings.length > 0 && (
                <div className="mt-8 text-center">
                  <Link
                    to="/my-bookings"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium group"
                  >
                    View All Bookings
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Upcoming Trips & Quick Actions */}
        <div className="space-y-8">
          {/* Upcoming Trips */}
          <div className="bg-white rounded-2xl shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FaPlane className="text-blue-600" />
                Upcoming Trips
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {dashboardData?.upcomingTrips && dashboardData.upcomingTrips.length > 0 ? (
                  dashboardData.upcomingTrips.map((trip) => (
                    <div key={trip.id} className="p-4 bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-xl">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{trip.destination}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                              {trip.status}
                            </span>
                            <span className="text-xs text-gray-500">{trip.type}</span>
                          </div>
                        </div>
                        <FaPlane className="text-blue-500 mt-1" />
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1.5">
                          <FaCalendarAlt />
                          {trip.date}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <FaClock />
                          {trip.time}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                      <FaCalendarAlt className="text-2xl text-gray-400" />
                    </div>
                    <p className="text-gray-500">No upcoming trips scheduled</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg p-6 text-white">
            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/tickets')}
                className="w-full p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-colors text-left flex items-center gap-3 group"
              >
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30">
                  <FaTicketAlt className="text-lg" />
                </div>
                <div>
                  <p className="font-semibold">Book New Ticket</p>
                  <p className="text-sm text-blue-100">Find and book tickets</p>
                </div>
              </button>
              
              <button
                onClick={() => navigate('/my-bookings')}
                className="w-full p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-colors text-left flex items-center gap-3 group"
              >
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30">
                  <FaCalendarAlt className="text-lg" />
                </div>
                <div>
                  <p className="font-semibold">My Bookings</p>
                  <p className="text-sm text-blue-100">View all bookings</p>
                </div>
              </button>
              
              <button
                onClick={() => navigate('/profile')}
                className="w-full p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-colors text-left flex items-center gap-3 group"
              >
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30">
                  <FaUser className="text-lg" />
                </div>
                <div>
                  <p className="font-semibold">Profile</p>
                  <p className="text-sm text-blue-100">Update your information</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;