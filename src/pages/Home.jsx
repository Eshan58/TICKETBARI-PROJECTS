// // import React, { useEffect, useState } from "react";
// // import { apiRequest } from "../services/api.js";
// // import { Link } from "react-router-dom";

// // export default function Home() {
// //   const [ads, setAds] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     const fetchAds = async () => {
// //       try {
// //         setLoading(true);
// //         const response = await apiRequest("/api/advertised");
// //         setAds(response.data || []);
// //         setError(null);
// //       } catch (err) {
// //         console.error("Error fetching ads:", err);
// //         setError(
// //           "Unable to load advertisements. Backend server may not be running."
// //         );
// //         setAds([]);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchAds();
// //   }, []);

// //   return (
// //     <div>
// //       <section className="mb-6">
// //         <div className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded p-8">
// //           <h1 className="text-3xl font-bold">Find and book tickets easily</h1>
// //           <p className="mt-2">
// //             Book bus, train, launch & flight tickets in minutes.
// //           </p>
// //         </div>
// //       </section>

// //       {error && (
// //         <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded">
// //           ⚠️ {error}
// //         </div>
// //       )}

// //       <section>
// //         <h2 className="text-xl font-semibold mb-3">Advertisement</h2>
// //         {loading ? (
// //           <div className="text-center py-8">Loading advertisements...</div>
// //         ) : (
// //           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //             {ads.length > 0 ? (
// //               ads.map((a) => (
// //                 <div key={a._id} className="bg-white rounded shadow p-4">
// //                   <img
// //                     src={a.image}
// //                     className="h-40 w-full object-cover rounded"
// //                     alt=""
// //                   />
// //                   <h3 className="font-semibold mt-2">{a.title}</h3>
// //                   <p className="mt-1">
// //                     {a.from} → {a.to}
// //                   </p>
// //                   <p className="mt-1">Price: {a.price} BDT</p>
// //                   <Link to={`/tickets/${a._id}`} className="btn mt-3">
// //                     See details
// //                   </Link>
// //                 </div>
// //               ))
// //             ) : (
// //               <div className="col-span-3 text-center py-8 text-gray-500">
// //                 No advertisements available
// //               </div>
// //             )}
// //           </div>
// //         )}
// //       </section>
// //     </div>
// //   );
// // }
// import React, { useEffect, useState } from "react";
// import { apiRequest, testBackendConnection } from "../services/api.js";
// import { Link } from "react-router-dom";

// export default function Home() {
//   const [ads, setAds] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [debugInfo, setDebugInfo] = useState(null);

//   useEffect(() => {
//     const fetchAds = async () => {
//       try {
//         setLoading(true);
//         console.log("📡 Fetching advertisements...");
        
//         // First, test if backend is connected
//         const backendStatus = await testBackendConnection();
//         console.log("🏥 Backend status:", backendStatus);
        
//         if (!backendStatus.success) {
//           throw new Error("Backend server is not running. Please start the server on port 5000.");
//         }

//         // Fetch advertised tickets
//         const response = await apiRequest("/api/advertised");
//         console.log("🎯 Advertisements API response:", response);
        
//         // Handle different response structures
//         let adsData = [];
//         if (response.data) {
//           if (response.data.data && response.data.data.tickets) {
//             // Structure: { data: { tickets: [] } }
//             adsData = response.data.data.tickets;
//           } else if (response.data.tickets) {
//             // Structure: { tickets: [] }
//             adsData = response.data.tickets;
//           } else if (Array.isArray(response.data)) {
//             // Structure: [] (direct array)
//             adsData = response.data;
//           } else if (response.data.data && Array.isArray(response.data.data)) {
//             // Structure: { data: [] }
//             adsData = response.data.data;
//           }
//         }
        
//         console.log(`✅ Extracted ${adsData.length} advertisements`);
        
//         setAds(adsData);
//         setDebugInfo({
//           backendStatus,
//           apiResponse: response.data,
//           extractedCount: adsData.length
//         });
//         setError(null);
        
//         if (adsData.length === 0) {
//           console.warn("⚠️ No advertisements found. Check if tickets are marked as 'advertised' in database.");
//         }
//       } catch (err) {
//         console.error("❌ Error fetching ads:", err);
//         const errorMessage = err.response?.data?.message || 
//                             err.message || 
//                             "Unable to load advertisements. Backend server may not be running.";
//         setError(errorMessage);
//         setAds([]);
//         setDebugInfo({
//           error: err.message,
//           suggestion: "Run 'npm start' in your backend folder and ensure tickets are marked as 'advertised: true'"
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAds();
//   }, []);

//   // Function to test backend manually
//   const handleTestBackend = async () => {
//     try {
//       console.log("🧪 Manually testing backend...");
//       const result = await testBackendConnection();
//       alert(`Backend Test Result:\n\nStatus: ${result.success ? '✅ Connected' : '❌ Not Connected'}\nMessage: ${result.message}\n\nCheck console for details.`);
//     } catch (err) {
//       console.error("Test error:", err);
//       alert("Test failed. Check console.");
//     }
//   };

//   // Function to debug advertised endpoint
//   const handleDebugAds = async () => {
//     try {
//       console.log("🔍 Debugging advertisements endpoint...");
//       const response = await fetch("http://localhost:5000/api/advertised");
//       const data = await response.json();
//       console.log("🔍 Raw /api/advertised response:", data);
      
//       // Also check debug endpoint
//       const debugRes = await fetch("http://localhost:5000/api/debug/tickets");
//       const debugData = await debugRes.json();
//       console.log("🔍 Debug tickets data:", debugData);
      
//       alert(`Debug Results:\n\nAdvertised tickets: ${data.data?.tickets?.length || 0}\nTotal in DB: ${debugData.data?.totalTickets || 0}\nApproved & Active: ${debugData.data?.approvedActive || 0}\n\nCheck console for full details.`);
//     } catch (err) {
//       console.error("Debug error:", err);
//       alert("Debug failed. Make sure backend is running.");
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       {/* Hero Section */}
//       <section className="mb-12">
//         <div className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-2xl p-8 md:p-12 shadow-xl">
//           <h1 className="text-4xl md:text-5xl font-bold mb-4">Find and Book Tickets Easily</h1>
//           <p className="text-xl mb-8 opacity-90">
//             Book bus, train, launch & flight tickets in minutes with TicketBari
//           </p>
//           <div className="flex flex-wrap gap-4">
//             <Link 
//               to="/tickets" 
//               className="bg-white text-sky-600 hover:bg-gray-100 px-8 py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
//             >
//               Browse All Tickets
//             </Link>
//             {/* <button 
//               onClick={handleTestBackend}
//               className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-sky-600 px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300"
//             >
//               Test Backend
//             </button> */}
//           </div>
//         </div>
//       </section>

//       {/* Status Banner */}
//       {/* <div className="mb-8 bg-gray-50 rounded-xl p-4 border border-gray-200">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <div className="flex items-center gap-3">
//             <div className={`w-3 h-3 rounded-full ${error ? 'bg-red-500' : 'bg-green-500'}`}></div>
//             <div>
//               <span className="font-medium">Status: {error ? 'Connection Issue' : 'Connected'}</span>
//               {debugInfo && (
//                 <span className="text-sm text-gray-600 ml-4">
//                   Found {ads.length} advertisement{ads.length !== 1 ? 's' : ''}
//                 </span>
//               )}
//             </div>
//           </div>
//           <div className="flex gap-2">
//             <button 
//               onClick={handleDebugAds}
//               className="text-sm bg-purple-100 hover:bg-purple-200 text-purple-800 px-4 py-2 rounded-lg font-medium"
//             >
//               Debug Ads
//             </button>
//             <Link 
//               to="/tickets" 
//               className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-lg font-medium"
//             >
//               View All Tickets
//             </Link>
//           </div>
//         </div>
//       </div> */}

//       {/* Error Display */}
//       {error && (
//         <div className="mb-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl">
//           <div className="flex items-start">
//             <div className="bg-yellow-100 p-3 rounded-lg mr-4">
//               <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//               </svg>
//             </div>
//             <div className="flex-1">
//               <h3 className="font-bold text-lg text-yellow-800">⚠️ Advertisement Error</h3>
//               <p className="text-yellow-700 mt-1">{error}</p>
//               <div className="mt-4 text-sm text-yellow-600">
//                 <p className="font-medium">Troubleshooting steps:</p>
//                 <ol className="list-decimal pl-5 mt-2 space-y-1">
//                   <li>Make sure backend server is running: <code className="bg-yellow-100 px-2 py-1 rounded">npm start</code> in backend folder</li>
//                   <li>Check if tickets are marked as "advertised" in database</li>
//                   <li>Click "Debug Ads" button above for more information</li>
//                   <li>Try the "Test Backend" button to verify connection</li>
//                 </ol>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Advertisements Section */}
//       <section className="mb-12">
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h2 className="text-3xl font-bold text-gray-900">Featured Tickets</h2>
//             <p className="text-gray-600 mt-2">Popular and advertised tickets for quick booking</p>
//           </div>
//           {ads.length > 0 && (
//             <Link 
//               to="/tickets" 
//               className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
//             >
//               View all tickets
//               <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
//               </svg>
//             </Link>
//           )}
//         </div>

//         {loading ? (
//           <div className="text-center py-12">
//             <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
//             <p className="text-lg font-medium text-gray-700">Loading featured tickets...</p>
//             <p className="text-sm text-gray-500 mt-2">Please wait while we fetch the latest offers</p>
//           </div>
//         ) : (
//           <>
//             {ads.length > 0 ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                 {ads.map((ad) => (
//                   <div key={ad._id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 group">
//                     <div className="relative h-48 overflow-hidden">
//                       <img
//                         src={ad.image || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500'}
//                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                         alt={ad.title}
//                         onError={(e) => {
//                           e.target.src = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500';
//                         }}
//                       />
//                       {ad.advertised && (
//                         <div className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full">
//                           🔥 Featured
//                         </div>
//                       )}
//                       {ad.verified === 'approved' && (
//                         <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
//                           ✓ Verified
//                         </div>
//                       )}
//                     </div>
//                     <div className="p-6">
//                       <h3 className="font-bold text-xl mb-2 line-clamp-1 text-gray-900">{ad.title}</h3>
//                       <div className="flex items-center text-gray-600 mb-3">
//                         <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                         </svg>
//                         <span className="font-semibold">
//                           {ad.from} → {ad.to}
//                         </span>
//                       </div>
//                       <div className="flex items-center justify-between mb-4">
//                         <div className="flex items-center">
//                           <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
//                             ad.transportType === 'bus' ? 'bg-blue-100 text-blue-800' :
//                             ad.transportType === 'train' ? 'bg-green-100 text-green-800' :
//                             ad.transportType === 'plane' ? 'bg-purple-100 text-purple-800' :
//                             'bg-amber-100 text-amber-800'
//                           }`}>
//                             {ad.transportType?.charAt(0).toUpperCase() + ad.transportType?.slice(1)}
//                           </span>
//                         </div>
//                         <div className="text-right">
//                           <div className="text-2xl font-bold text-green-600">${ad.price}</div>
//                           <div className="text-sm text-gray-500">per ticket</div>
//                         </div>
//                       </div>
//                       <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
//                         <div className="flex items-center">
//                           <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                           </svg>
//                           {new Date(ad.departureAt).toLocaleDateString('en-US', { 
//                             month: 'short', 
//                             day: 'numeric' 
//                           })}
//                         </div>
//                         <div className="flex items-center">
//                           <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                           </svg>
//                           {ad.availableQuantity || ad.quantity} available
//                         </div>
//                       </div>
//                       <Link 
//                         to={`/tickets/${ad._id}`}
//                         className="block w-full text-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-xl font-bold hover:shadow-lg transition-all duration-300"
//                       >
//                         View Details & Book
//                       </Link>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
//                 <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
//                   <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
//                   </svg>
//                 </div>
//                 <h3 className="text-2xl font-bold text-gray-700 mb-3">No Featured Tickets Available</h3>
//                 <p className="text-gray-600 max-w-md mx-auto mb-8">
//                   There are currently no tickets marked as advertised. Check back later or browse all available tickets.
//                 </p>
//                 <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                   <Link 
//                     to="/tickets" 
//                     className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300"
//                   >
//                     Browse All Tickets
//                   </Link>
//                   <button 
//                     onClick={handleDebugAds}
//                     className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-3 rounded-xl font-bold border border-gray-300 transition-all duration-300"
//                   >
//                     Debug Issue
//                   </button>
//                 </div>
//                 <div className="mt-8 text-sm text-gray-500 max-w-lg mx-auto">
//                   <p className="font-medium mb-2">Why no advertisements?</p>
//                   <ul className="list-disc pl-5 text-left inline-block">
//                     <li>Tickets must be marked as <code className="bg-gray-100 px-2 py-1 rounded">advertised: true</code> in database</li>
//                     <li>Tickets must be <code className="bg-gray-100 px-2 py-1 rounded">verified: 'approved'</code></li>
//                     <li>Tickets must be <code className="bg-gray-100 px-2 py-1 rounded">isActive: true</code></li>
//                   </ul>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </section>

//       {/* Call to Action */}
//       <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl p-8 md:p-12 text-center">
//         <h2 className="text-3xl font-bold mb-4">Ready to Travel?</h2>
//         <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
//           Discover thousands of tickets across Bangladesh. Book now and travel with confidence.
//         </p>
//         <div className="flex flex-wrap gap-4 justify-center">
//           <Link 
//             to="/tickets" 
//             className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
//           >
//             Start Booking
//           </Link>
//           <Link 
//             to="/login" 
//             className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300"
//           >
//             Sign In for More Features
//           </Link>
//         </div>
//       </section>

//       {/* Debug Info (Only in development) */}
//       {process.env.NODE_ENV === 'development' && debugInfo && (
//         <div className="mt-8 p-4 bg-gray-100 rounded-xl text-sm">
//           <details>
//             <summary className="font-medium cursor-pointer">Debug Information</summary>
//             <pre className="mt-2 p-3 bg-gray-900 text-gray-100 rounded-lg overflow-auto text-xs">
//               {JSON.stringify(debugInfo, null, 2)}
//             </pre>
//           </details>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { apiRequest } from "../services/api.js";
import { Link } from "react-router-dom";
import { TbCurrencyTaka } from "react-icons/tb";

export default function Home() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchAllTickets = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("🔍 Fetching ALL approved tickets...");
        
        // First, get database stats
        try {
          const statsRes = await fetch("http://localhost:5000/api/debug/tickets");
          const statsData = await statsRes.json();
          setStats(statsData.data);
          console.log("📊 Database stats:", statsData.data);
        } catch (statsErr) {
          console.log("Could not fetch stats:", statsErr.message);
        }

        // Try to get ALL approved active tickets (not just advertised)
        let allTickets = [];
        
        // Method 1: Try to get tickets with limit 12
        try {
          const response = await apiRequest("/api/tickets?limit=12&page=1");
          console.log("🎯 API Response:", response);
          
          if (response.data) {
            if (response.data.data && response.data.data.tickets) {
              allTickets = response.data.data.tickets;
            } else if (response.data.tickets) {
              allTickets = response.data.tickets;
            }
          }
          
          console.log(`✅ Got ${allTickets.length} tickets from /api/tickets`);
        } catch (apiErr) {
          console.log("API error:", apiErr.message);
        }

        // Method 2: If still empty, try debug endpoint
        if (allTickets.length === 0) {
          try {
            console.log("🔄 Trying debug endpoint...");
            const debugRes = await fetch("http://localhost:5000/api/debug/tickets");
            const debugData = await debugRes.json();
            
            if (debugData.success && debugData.data?.allTickets) {
              // Filter for approved and active tickets
              const approvedActive = debugData.data.allTickets.filter(t => 
                t.verified === "approved" && t.isActive === true
              ).slice(0, 12);
              
              allTickets = approvedActive;
              console.log(`✅ Got ${allTickets.length} tickets from debug endpoint`);
            }
          } catch (debugErr) {
            console.log("Debug endpoint error:", debugErr.message);
          }
        }

        // Method 3: If STILL empty, show ALL tickets regardless of status
        if (allTickets.length === 0 && stats?.allTickets) {
          console.log("⚠️ No approved tickets found, showing ALL tickets...");
          allTickets = stats.allTickets.slice(0, 12);
        }

        setTickets(allTickets);
        
        if (allTickets.length === 0) {
          setError("No tickets found in database. Database might be empty.");
        }
        
      } catch (err) {
        console.error("❌ Error:", err);
        setError(err.message || "Failed to load tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchAllTickets();
  }, []);

  // Approve all tickets
  const handleApproveAll = async () => {
    if (window.confirm("Approve ALL tickets in database? This will make them visible.")) {
      try {
        const res = await fetch("http://localhost:5000/api/debug/approve-all", {
          method: "POST",
        });
        const data = await res.json();
        alert(data.message || "Tickets approved!");
        window.location.reload();
      } catch (err) {
        alert("Error: " + err.message);
      }
    }
  };

  // Check database status
  const handleCheckDB = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/debug/tickets");
      const data = await res.json();
      
      const message = `
Database Status:
──────────────
Total tickets: ${data.data?.totalTickets || 0}
Approved: ${data.data?.approvedTickets || 0}
Active: ${data.data?.activeTickets || 0}
Approved & Active: ${data.data?.approvedActive || 0}
Pending: ${data.data?.pendingTickets || 0}
Future departures: ${data.data?.futureTickets || 0}

Status of tickets shown: ${tickets.length}
      `;
      
      alert(message);
      console.log("Full debug data:", data);
    } catch (err) {
      alert("Cannot connect to database");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-2xl p-8 md:p-12 shadow-xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">TicketBari - Real Tickets</h1>
          {/* <p className="text-xl mb-8 opacity-90">
            Showing real tickets from your MongoDB database
          </p> */}
          <div className="flex flex-wrap gap-4">
            <Link to="/tickets" className="bg-white text-sky-600 hover:bg-gray-100 px-8 py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300">
              Browse All Tickets
            </Link>
            {/* <button onClick={handleCheckDB} className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300">
              Check Database
            </button> */}
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      {/* {stats && (
        <div className="mb-8 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Database Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Tickets</p>
              <p className="text-2xl font-bold text-blue-700">{stats.totalTickets || 0}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-700">{stats.approvedTickets || 0}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-purple-700">{stats.activeTickets || 0}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-amber-700">{stats.pendingTickets || 0}</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Approved & Active</p>
              <p className="text-2xl font-bold text-emerald-700">{stats.approvedActive || 0}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Showing</p>
              <p className="text-2xl font-bold text-gray-800">{tickets.length}</p>
            </div>
          </div>
          {stats.approvedActive === 0 && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 font-medium">
                ⚠️ No approved & active tickets found. 
                <button onClick={handleApproveAll} className="ml-2 text-blue-600 hover:text-blue-800 underline">
                  Click here to approve all tickets
                </button>
              </p>
            </div>
          )}
        </div>
      )} */}

      {/* Error */}
      {error && (
        <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-lg mr-4">
              <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg text-red-800">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tickets Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              🔥 Featured Tickets {tickets.length > 0 && `(${tickets.length})`}
            </h2>
            {/* <p className="text-gray-600 mt-2">
              {loading ? 'Loading...' : 
               tickets.length === 0 ? 'No tickets available' : 
               'Real tickets from your database'}
            </p> */}
          </div>
          <div className="flex gap-3">
            <button onClick={handleApproveAll} className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium shadow-sm">
              Approve All
            </button>
            <button onClick={() => window.location.reload()} className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium shadow-sm">
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
            <p className="text-lg font-medium text-gray-700">Loading tickets from database...</p>
          </div>
        ) : tickets.length > 0 ? (
          <>
            {/* Tickets Grid - Shows ALL tickets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tickets.map((ticket) => (
                <div key={ticket._id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={ticket.image || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500'}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      alt={ticket.title}
                    />
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {ticket.advertised && (
                        <span className="bg-gradient-to-r from-pink-500 to-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                          🔥 Featured
                        </span>
                      )}
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                        ticket.transportType === 'bus' ? 'bg-blue-100 text-blue-800' :
                        ticket.transportType === 'train' ? 'bg-green-100 text-green-800' :
                        ticket.transportType === 'plane' ? 'bg-purple-100 text-purple-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {ticket.transportType?.charAt(0).toUpperCase() + ticket.transportType?.slice(1)}
                      </span>
                    </div>
                    {/* Status Badges */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      {ticket.verified === 'approved' ? (
                        <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          ✓ Verified
                        </span>
                      ) : (
                        <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          ⏳ Pending
                        </span>
                      )}
                      {ticket.isActive && (
                        <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-2 line-clamp-1">{ticket.title}</h3>
                    
                    {/* Route */}
                    <div className="flex items-center text-gray-600 mb-3">
                      <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="font-semibold">{ticket.from} → {ticket.to}</span>
                    </div>
                    
                    {/* Details */}
                    <div className="space-y-3 mb-5">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Departure:</span>
                        <span className="font-medium">
                          {ticket.departureAt ? 
                            new Date(ticket.departureAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            }) : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Price:</span>
                        <span className="text-xl font-bold text-green-600 flex items-center"><TbCurrencyTaka />{ticket.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Available:</span>
                        <span className="font-medium">{ticket.availableQuantity || ticket.quantity || 0}</span>
                      </div>
                    </div>
                    
                    {/* Button */}
                    <Link 
                      to={`/tickets/${ticket._id}`}
                      className="block w-full text-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-lg font-bold hover:shadow-lg transition-all duration-300"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Show more button if we have tickets */}
            {tickets.length > 0 && (
              <div className="mt-10 text-center">
                <Link 
                  to="/tickets" 
                  className="inline-flex items-center px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  View All Tickets
                  <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            )}
          </>
        ) : (
          // Empty State
          <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-8">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">No Tickets Found</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-10">
              Your database doesn't have any tickets, or they're not approved/active.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleApproveAll}
                className="px-8 py-3.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Approve All Tickets
              </button>
              <button 
                onClick={handleCheckDB}
                className="px-8 py-3.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Check Database Status
              </button>
            </div>
            <div className="mt-12 text-sm text-gray-500 max-w-xl mx-auto">
              <p className="font-medium mb-3">Why you might see only one or no tickets:</p>
              <div className="bg-gray-100 p-4 rounded-lg text-left">
                <ul className="list-disc pl-5 space-y-2">
                  <li>Tickets might not be <code className="bg-gray-200 px-2 py-1 rounded">verified: "approved"</code></li>
                  <li>Tickets might not be <code className="bg-gray-200 px-2 py-1 rounded">isActive: true</code></li>
                  <li>Tickets might have past departure dates</li>
                  <li>Database might have only one approved ticket</li>
                  <li>Click "Approve All Tickets" to fix all these issues</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}