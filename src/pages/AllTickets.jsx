// import React, { useEffect, useState } from "react";
// import { apiRequest } from "../services/api.js";
// import { Link } from "react-router-dom";

// export default function AllTickets() {
//   const [tickets, setTickets] = useState([]);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [transport, setTransport] = useState("");
//   const [sort, setSort] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [debugInfo, setDebugInfo] = useState({});

//   const fetchTickets = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const query = `?page=${page}&limit=8&transport=${transport}&sort=${sort}`;
     

//       const response = await apiRequest(`/api/tickets${query}`);

//       // Extract data from response
//       const ticketsData = response?.data?.data?.tickets || [];
//       const paginationData = response?.data?.data?.pagination || {};

//       // Debug logging
//       if (ticketsData.length > 0) {
//         const sampleTicket = ticketsData[0];
//         setDebugInfo({
//           totalTickets: ticketsData.length,
//           sampleId: sampleTicket._id,
//           verified: sampleTicket.verified,
//           isActive: sampleTicket.isActive,
//           apiStatus: "success",
//         });
//       }

//       setTickets(ticketsData);
//       setTotalPages(paginationData.pages || 1);

//       if (ticketsData.length === 0) {
//         console.log("⚠️ No tickets found with current filters");
//       }
//     } catch (err) {
//       console.error("❌ Error fetching tickets:", err);
//       const errorMessage =
//         err.response?.data?.message ||
//         "Failed to load tickets. Please try again.";
//       setError(errorMessage);
//       setTickets([]);
//       setDebugInfo({ apiStatus: "error", error: err.message });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTickets();
//   }, [page, transport, sort]);

//   // Reset page when filters change
//   useEffect(() => {
//     setPage(1);
//   }, [transport, sort]);

//   const testBackendEndpoints = async () => {
//     try {
//       console.log("🧪 Testing backend endpoints...");

//       // Test 1: Check database status
//       const debugRes = await fetch(
//         "http://localhost:5000/api/debug/test-filter"
//       );
//       const debugData = await debugRes.json();
//       console.log("📊 Database status:", debugData);

//       // Test 2: Try debug endpoint
//       const ticketsDebugRes = await fetch(
//         "http://localhost:5000/api/tickets-debug"
//       );
//       const ticketsDebugData = await ticketsDebugRes.json();
//       console.log("🔍 Debug tickets:", ticketsDebugData);

//       // Test 3: Try normal endpoint with debug flag
//       const ticketsRes = await fetch(
//         "http://localhost:5000/api/tickets?debug=true"
//       );
//       const ticketsData = await ticketsRes.json();
//       console.log("🎫 Normal tickets (debug mode):", ticketsData);

//       alert(`Test Results:\n
//         Total in DB: ${debugData.debug?.totalInDB || 0}\n
//         Approved: ${debugData.debug?.approved || 0}\n
//         Active: ${debugData.debug?.active || 0}\n
//         Approved & Active: ${debugData.debug?.approvedActive || 0}\n
//         Debug tickets found: ${ticketsDebugData.data?.tickets?.length || 0}\n
//         Normal tickets found: ${ticketsData.data?.tickets?.length || 0}\n
//         Check console for details.`);
//     } catch (err) {
//       console.error("❌ Test error:", err);
//       alert("Error testing endpoints. Check console.");
//     }
//   };

//   const handleDebugRefresh = () => {
//     console.log("🔄 Manual refresh triggered");
//     fetchTickets();
//   };

//   const handleApproveAll = async () => {
//     if (
//       !window.confirm(
//         "Are you sure you want to approve all tickets? This is a debug action."
//       )
//     ) {
//       return;
//     }

//     try {
//       console.log("🔄 Approving all tickets...");
//       const response = await fetch(
//         "http://localhost:5000/api/debug/approve-all",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();
//       console.log("✅ Approve result:", result);
//       alert(result.message || "Tickets approved successfully!");
//       fetchTickets(); // Refresh the ticket list
//     } catch (err) {
//       console.error("❌ Error approving tickets:", err);
//       alert("Failed to approve tickets. Please check if backend is running.");
//     }
//   };

//   const handleClearFilters = () => {
//     setTransport("");
//     setSort("");
//   };

//   const LoadingSpinner = () => (
//     <div className="flex justify-center items-center min-h-[400px]">
//       <div className="text-center">
//         <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
//         <p className="text-lg font-medium text-gray-700">Loading tickets...</p>
//         <p className="text-sm text-gray-500 mt-2">
//           Please wait while we fetch the latest tickets
//         </p>
//       </div>
//     </div>
//   );

//   const ErrorDisplay = () => (
//     <div className="text-center py-8">
//       <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 max-w-md mx-auto">
//         <p className="font-medium">Error Loading Tickets</p>
//         <p className="mt-1">{error}</p>
//       </div>
//       <div className="space-x-4">
//         <button
//           onClick={handleDebugRefresh}
//           className="btn bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded"
//         >
//           Retry
//         </button>
//         <a
//           href="http://localhost:5000/api/debug/tickets"
//           target="_blank"
//           rel="noopener noreferrer"
//           className="btn bg-gray-600 text-white hover:bg-gray-700 px-4 py-2 rounded inline-block"
//         >
//           Check Database
//         </a>
//       </div>
//     </div>
//   );

//   const NoTicketsDisplay = () => (
//     <div className="text-center py-12 bg-gray-50 rounded-lg">
//       <div className="text-gray-500 mb-4">
//         <svg
//           className="w-16 h-16 mx-auto text-gray-300"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth="2"
//             d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//           />
//         </svg>
//       </div>
//       <h3 className="text-lg font-medium text-gray-900 mb-2">
//         No tickets found
//       </h3>
//       <p className="text-gray-500 mb-4">
//         {transport || sort
//           ? "Try changing your filters or search criteria."
//           : "There are currently no tickets available."}
//       </p>

//       <div className="space-x-4 mb-6">
//         {(transport || sort) && (
//           <button
//             onClick={handleClearFilters}
//             className="text-blue-600 hover:text-blue-800 underline"
//           >
//             Clear all filters
//           </button>
//         )}
//         <button
//           onClick={handleDebugRefresh}
//           className="text-gray-600 hover:text-gray-800 underline"
//         >
//           Refresh page
//         </button>
//         <button
//           onClick={testBackendEndpoints}
//           className="text-purple-600 hover:text-purple-800 underline"
//         >
//           Test Backend
//         </button>
//         <a
//           href="http://localhost:5000/api/debug/tickets"
//           target="_blank"
//           rel="noopener noreferrer"
//           className="text-blue-600 hover:text-blue-800 underline"
//         >
//           Check database status
//         </a>
//       </div>

//       <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded text-sm text-left max-w-2xl mx-auto">
//         <p className="font-medium mb-2 text-yellow-800">
//           Troubleshooting Steps:
//         </p>
//         <ol className="list-decimal pl-5 space-y-1 text-yellow-700">
//           <li>Click "Test Backend" to check API endpoints</li>
//           <li>Look for "approvedActive" count (should be greater than 0)</li>
//           <li>If count is 0, use "Approve all tickets" button</li>
//           <li>Check browser console for detailed API response logs</li>
//           <li>Verify backend server is running on port 5000</li>
//         </ol>
//       </div>
//     </div>
//   );

//   const TicketCard = ({ ticket }) => (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200">
//       <div className="relative h-48">
//         <img
//           src={
//             ticket.image ||
//             "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500"
//           }
//           className="w-full h-full object-cover"
//           alt={ticket.title}
//           onError={(e) => {
//             e.target.src =
//               "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500";
//           }}
//         />
//         <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
//           {ticket.verified === "approved" ? "✓ Verified" : "Pending"}
//         </div>
//         {ticket.isActive && (
//           <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
//             Active
//           </div>
//         )}
//       </div>
//       <div className="p-4">
//         <h3 className="font-bold text-lg mb-2 line-clamp-1">{ticket.title}</h3>
//         <div className="space-y-2 mb-4">
//           <div className="flex items-center text-gray-600">
//             <span className="font-medium mr-2">Route:</span>
//             <span className="font-semibold">
//               {ticket.from} → {ticket.to}
//             </span>
//           </div>
//           <div className="flex items-center text-gray-600">
//             <span className="font-medium mr-2">Type:</span>
//             <span className="capitalize bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
//               {ticket.transportType}
//             </span>
//           </div>
//           <div className="flex items-center text-gray-600">
//             <span className="font-medium mr-2">Price:</span>
//             <span className="text-green-600 font-bold text-lg">
//               ${ticket.price}
//             </span>
//           </div>
//           <div className="flex items-center text-gray-600">
//             <span className="font-medium mr-2">Available:</span>
//             <span className="font-semibold">
//               {ticket.availableQuantity || ticket.quantity}
//             </span>
//           </div>
//           {ticket.departureAt && (
//             <div className="flex items-center text-gray-600">
//               <span className="font-medium mr-2">Departure:</span>
//               <span>
//                 {new Date(ticket.departureAt).toLocaleDateString("en-US", {
//                   year: "numeric",
//                   month: "short",
//                   day: "numeric",
//                 })}
//               </span>
//             </div>
//           )}
//         </div>
//         <Link
//           to={`/tickets/${ticket._id}`}
//           className="block w-full text-center bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
//         >
//           View Details & Book
//         </Link>
//       </div>
//     </div>
//   );

//   if (loading) return <LoadingSpinner />;
//   if (error) return <ErrorDisplay />;

//   return (
//     <div className="container mx-auto px-4 py-8">
//       {/* Header with Debug Controls */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
//         <div>
//           <h1 className="text-2xl font-bold">Available Tickets</h1>
//           <p className="text-gray-600 mt-1">
//             Browse and book tickets for your journey
//           </p>
//         </div>

//         <div className="flex flex-wrap gap-2">
//           <button
//             onClick={handleDebugRefresh}
//             className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded flex items-center gap-1"
//             title="Refresh tickets"
//           >
//             <span>🔄</span> Refresh
//           </button>
//           <button
//             onClick={testBackendEndpoints}
//             className="text-sm bg-purple-100 hover:bg-purple-200 text-purple-800 px-3 py-2 rounded flex items-center gap-1"
//             title="Test all backend endpoints"
//           >
//             <span>🧪</span> Test Backend
//           </button>
//           <a
//             href="http://localhost:5000/api/debug/tickets"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-2 rounded flex items-center gap-1"
//           >
//             <span>🔍</span> Debug API
//           </a>
//           <button
//             onClick={handleApproveAll}
//             className="text-sm bg-green-100 hover:bg-green-200 text-green-800 px-3 py-2 rounded flex items-center gap-1"
//             title="Approve all tickets (Debug)"
//           >
//             <span>✅</span> Approve All
//           </button>
//         </div>
//       </div>

//       {/* Filter Controls */}
//       <div className="flex flex-col md:flex-row gap-4 mb-6">
//         <div className="flex-1">
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Filter by Transport
//           </label>
//           <select
//             value={transport}
//             onChange={(e) => setTransport(e.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">All Transport Types</option>
//             <option value="bus">Bus</option>
//             <option value="train">Train</option>
//             <option value="launch">Launch</option>
//             <option value="plane">Plane</option>
//           </select>
//         </div>

//         <div className="flex-1">
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Sort by Price
//           </label>
//           <select
//             value={sort}
//             onChange={(e) => setSort(e.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">Default Sorting (Newest First)</option>
//             <option value="price_asc">Price: Low to High</option>
//             <option value="price_desc">Price: High to Low</option>
//           </select>
//         </div>
//       </div>

//       {/* Status Bar */}
//       <div className="mb-4 p-3 bg-gray-50 rounded text-sm">
//         <div className="flex flex-wrap items-center gap-4">
//           <span className="flex items-center gap-1">
//             <span className="w-2 h-2 bg-green-500 rounded-full"></span>
//             API Status: Connected
//           </span>
//           <span>
//             Tickets found: <strong>{tickets.length}</strong>
//           </span>
//           <span>
//             Page: <strong>{page}</strong> of <strong>{totalPages}</strong>
//           </span>
//           <button
//             onClick={testBackendEndpoints}
//             className="ml-auto text-xs bg-purple-100 hover:bg-purple-200 text-purple-800 px-2 py-1 rounded"
//           >
//             Quick Test
//           </button>
//         </div>
//       </div>

//       {/* Tickets Grid */}
//       {tickets.length === 0 ? (
//         <NoTicketsDisplay />
//       ) : (
//         <>
//           <div className="mb-4 text-gray-600">
//             Showing {tickets.length} ticket{tickets.length !== 1 ? "s" : ""}{" "}
//             (Page {page} of {totalPages})
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {tickets.map((ticket) => (
//               <TicketCard key={ticket._id} ticket={ticket} />
//             ))}
//           </div>

//           {/* Pagination controls */}
//           {totalPages > 1 && (
//             <div className="flex justify-center items-center gap-4 mt-8">
//               <button
//                 onClick={() => setPage((prev) => Math.max(1, prev - 1))}
//                 disabled={page === 1}
//                 className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
//               >
//                 Previous
//               </button>
//               <span className="text-gray-700">
//                 Page {page} of {totalPages}
//               </span>
//               <button
//                 onClick={() =>
//                   setPage((prev) => Math.min(totalPages, prev + 1))
//                 }
//                 disabled={page === totalPages}
//                 className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { apiRequest } from "../services/api.js";
import { Link } from "react-router-dom";
import { TbCurrencyTaka } from "react-icons/tb";

export default function AllTickets() {
  const [tickets, setTickets] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [transport, setTransport] = useState("");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const query = `?page=${page}&limit=8&transport=${transport}&sort=${sort}`;
      const endpoint = `/api/tickets${query}`;
      
      console.log("📡 Fetching tickets from:", endpoint);
      
      const response = await apiRequest(endpoint);
      
      console.log("📊 Full API Response:", response);
      
      // FIXED: Handle both response structures
      let ticketsData = [];
      let paginationData = { pages: 1, total: 0 };
      
      if (response && response.data) {
        // Check for both possible response structures
        if (response.data.data && response.data.data.tickets) {
          // Structure 1: { data: { tickets: [], pagination: {} } }
          ticketsData = response.data.data.tickets || [];
          paginationData = response.data.data.pagination || { pages: 1, total: 0 };
        } else if (response.data.tickets) {
          // Structure 2: { tickets: [], pagination: {} }
          ticketsData = response.data.tickets || [];
          paginationData = response.data.pagination || { pages: 1, total: 0 };
        } else if (Array.isArray(response.data)) {
          // Structure 3: Direct array response
          ticketsData = response.data;
        }
        
        // Check if request was successful
        if (response.data.success === false) {
          console.warn("⚠️ API returned success: false", response.data.message);
        }
      }
      
      console.log(`✅ Extracted ${ticketsData.length} tickets`);
      console.log("📊 Pagination data:", paginationData);
      
      // Debug logging
      if (ticketsData.length > 0) {
        const sampleTicket = ticketsData[0];
        setDebugInfo({
          totalTickets: ticketsData.length,
          sampleId: sampleTicket._id,
          verified: sampleTicket.verified,
          isActive: sampleTicket.isActive,
          apiStatus: "success",
          backendResponse: response.data,
        });
      } else {
        setDebugInfo({
          totalTickets: 0,
          apiStatus: "empty",
          backendResponse: response?.data,
          suggestion: "Check /api/debug/tickets endpoint",
        });
      }

      setTickets(ticketsData);
      setTotalPages(paginationData.pages || 1);

      if (ticketsData.length === 0) {
        console.log("⚠️ No tickets found with current filters");
        console.log("🔍 Backend status URL: http://localhost:5000/api/debug/tickets");
        console.log("🔍 Debug endpoint: http://localhost:5000/api/tickets-debug");
      }
    } catch (err) {
      console.error("❌ Error fetching tickets:", err);
      console.log("🔍 Full error object:", err);
      
      // Extract error message from various possible locations
      const errorMessage = 
        err.response?.data?.message || 
        err.data?.message ||
        err.message || 
        "Failed to load tickets. Please check if backend server is running.";
      
      setError(errorMessage);
      setTickets([]);
      setDebugInfo({ 
        apiStatus: "error", 
        error: errorMessage,
        errorObj: err,
        suggestion: "Run 'npm start' in backend folder and ensure it's on port 5000" 
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [page, transport, sort]);

  // Diagnostic check on mount
  useEffect(() => {
    const runDiagnostics = async () => {
      console.log("🔍 Running initial diagnostics...");
      
      try {
        // Test backend connection
        const healthRes = await fetch("http://localhost:5000/api/health");
        const healthData = await healthRes.json();
        console.log("🏥 Backend Health:", healthData);
        
        // Test tickets endpoint directly
        const ticketsRes = await fetch("http://localhost:5000/api/tickets?limit=2");
        const ticketsData = await ticketsRes.json();
        console.log("🎫 Direct tickets fetch:", ticketsData);
        
      } catch (err) {
        console.error("❌ Diagnostic failed - Backend might not be running:", err.message);
        console.log("💡 Solution: Start backend with 'npm start' in the server folder");
      }
    };
    
    runDiagnostics();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [transport, sort]);

  const testBackendEndpoints = async () => {
    try {
      console.log("🧪 Testing backend endpoints...");

      // Test 1: Check database status
      const debugRes = await fetch(
        "http://localhost:5000/api/debug/test-filter"
      );
      const debugData = await debugRes.json();
      console.log("📊 Database status:", debugData);

      // Test 2: Try debug endpoint
      const ticketsDebugRes = await fetch(
        "http://localhost:5000/api/tickets-debug"
      );
      const ticketsDebugData = await ticketsDebugRes.json();
      console.log("🔍 Debug tickets:", ticketsDebugData);

      // Test 3: Try normal endpoint with debug flag
      const ticketsRes = await fetch(
        "http://localhost:5000/api/tickets?debug=true"
      );
      const ticketsData = await ticketsRes.json();
      console.log("🎫 Normal tickets (debug mode):", ticketsData);

      // Test 4: Test through apiRequest
      const apiRes = await apiRequest("/api/tickets?limit=3");
      console.log("🎫 API Request result:", apiRes);

      alert(`Test Results:\n
        Total in DB: ${debugData.debug?.totalInDB || 0}\n
        Approved: ${debugData.debug?.approved || 0}\n
        Active: ${debugData.debug?.active || 0}\n
        Approved & Active: ${debugData.debug?.approvedActive || 0}\n
        Debug tickets found: ${ticketsDebugData.data?.tickets?.length || 0}\n
        Normal tickets found: ${ticketsData.data?.tickets?.length || 0}\n
        API Request tickets: ${apiRes.data?.data?.tickets?.length || 0}\n
        Check console for details.`);
    } catch (err) {
      console.error("❌ Test error:", err);
      alert("Error testing endpoints. Check console. Make sure backend is running on port 5000.");
    }
  };

  const handleDebugRefresh = () => {
    console.log("🔄 Manual refresh triggered");
    console.log("📊 Current debug info:", debugInfo);
    fetchTickets();
  };

  const handleApproveAll = async () => {
    if (
      !window.confirm(
        "Are you sure you want to approve all tickets? This is a debug action."
      )
    ) {
      return;
    }

    try {
      console.log("🔄 Approving all tickets...");
      const response = await fetch(
        "http://localhost:5000/api/debug/approve-all",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ Approve result:", result);
      alert(result.message || "Tickets approved successfully!");
      fetchTickets(); // Refresh the ticket list
    } catch (err) {
      console.error("❌ Error approving tickets:", err);
      alert("Failed to approve tickets. Please check if backend is running.");
    }
  };

  const handleClearFilters = () => {
    setTransport("");
    setSort("");
  };

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
        <p className="text-lg font-medium text-gray-700">Loading tickets...</p>
        <p className="text-sm text-gray-500 mt-2">
          Please wait while we fetch the latest tickets
        </p>
        <button
          onClick={testBackendEndpoints}
          className="mt-4 text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Test Backend Connection
        </button>
      </div>
    </div>
  );

  const ErrorDisplay = () => (
    <div className="text-center py-8">
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 max-w-md mx-auto">
        <p className="font-medium">Error Loading Tickets</p>
        <p className="mt-1">{error}</p>
        <p className="mt-2 text-sm">
          Make sure the backend server is running on port 5000
        </p>
      </div>
      <div className="space-x-4">
        <button
          onClick={handleDebugRefresh}
          className="btn bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded"
        >
          Retry
        </button>
        <button
          onClick={testBackendEndpoints}
          className="btn bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded"
        >
          Test Backend
        </button>
        <a
          href="http://localhost:5000/api/debug/tickets"
          target="_blank"
          rel="noopener noreferrer"
          className="btn bg-gray-600 text-white hover:bg-gray-700 px-4 py-2 rounded inline-block"
        >
          Check Database
        </a>
      </div>
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded text-sm text-left max-w-2xl mx-auto">
        <p className="font-medium mb-2 text-yellow-800">
          Troubleshooting Steps:
        </p>
        <ol className="list-decimal pl-5 space-y-1 text-yellow-700">
          <li>Open terminal in your backend folder</li>
          <li>Run: <code>npm start</code> or <code>node server.js</code></li>
          <li>Wait for "Server running on http://localhost:5000" message</li>
          <li>Click "Test Backend" button above</li>
          <li>If no tickets appear, click "Approve All" button</li>
        </ol>
      </div>
    </div>
  );

  const NoTicketsDisplay = () => (
    <div className="text-center py-12 bg-gray-50 rounded-lg">
      <div className="text-gray-500 mb-4">
        <svg
          className="w-16 h-16 mx-auto text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No tickets found
      </h3>
      <p className="text-gray-500 mb-4">
        {transport || sort
          ? "Try changing your filters or search criteria."
          : "There are currently no tickets available."}
      </p>

      <div className="space-x-4 mb-6">
        {(transport || sort) && (
          <button
            onClick={handleClearFilters}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Clear all filters
          </button>
        )}
        <button
          onClick={handleDebugRefresh}
          className="text-gray-600 hover:text-gray-800 underline"
        >
          Refresh page
        </button>
        <button
          onClick={testBackendEndpoints}
          className="text-purple-600 hover:text-purple-800 underline"
        >
          Test Backend
        </button>
        <button
          onClick={handleApproveAll}
          className="text-green-600 hover:text-green-800 underline"
        >
          Approve All Tickets
        </button>
        <a
          href="http://localhost:5000/api/debug/tickets"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Check database status
        </a>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded text-sm text-left max-w-2xl mx-auto">
        <p className="font-medium mb-2 text-yellow-800">
          Troubleshooting Steps:
        </p>
        <ol className="list-decimal pl-5 space-y-1 text-yellow-700">
          <li>Click "Test Backend" to check API endpoints</li>
          <li>Look for "approvedActive" count (should be greater than 0)</li>
          <li>If count is 0, use "Approve all tickets" button</li>
          <li>Check browser console for detailed API response logs</li>
          <li>Verify backend server is running on port 5000</li>
          <li>Open backend terminal and run: <code>npm start</code></li>
        </ol>
      </div>
    </div>
  );

  const TicketCard = ({ ticket }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200">
      <div className="relative h-48">
        <img
          src={
            ticket.image ||
            "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500"
          }
          className="w-full h-full object-cover"
          alt={ticket.title}
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500";
          }}
        />
        <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
          {ticket.verified === "approved" ? "✓ Verified" : "Pending"}
        </div>
        {ticket.isActive && (
          <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
            Active
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-1">{ticket.title}</h3>
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <span className="font-medium mr-2">Route:</span>
            <span className="font-semibold">
              {ticket.from} → {ticket.to}
            </span>
          </div>
          <div className="flex items-center text-gray-600">
            <span className="font-medium mr-2">Type:</span>
            <span className="capitalize bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              {ticket.transportType}
            </span>
          </div>
          <div className="flex items-center text-gray-600">
            <span className="font-medium mr-2">Price:</span>
            <span className="text-green-600 font-bold text-lg flex items-center">
              <TbCurrencyTaka />{ticket.price}
            </span>
          </div>
          <div className="flex items-center text-gray-600">
            <span className="font-medium mr-2">Available:</span>
            <span className="font-semibold">
              {ticket.availableQuantity || ticket.quantity}
            </span>
          </div>
          {ticket.departureAt && (
            <div className="flex items-center text-gray-600">
              <span className="font-medium mr-2">Departure:</span>
              <span>
                {new Date(ticket.departureAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          )}
        </div>
        <Link
          to={`/tickets/${ticket._id}`}
          className="block w-full text-center bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
        >
          View Details & Book
        </Link>
      </div>
    </div>
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay />;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Debug Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Available Tickets</h1>
          <p className="text-gray-600 mt-1">
            Browse and book tickets for your journey
          </p>
        </div>

        {/* <div className="flex flex-wrap gap-2">
          <button
            onClick={handleDebugRefresh}
            className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded flex items-center gap-1"
            title="Refresh tickets"
          >
            <span>🔄</span> Refresh
          </button>
          <button
            onClick={testBackendEndpoints}
            className="text-sm bg-purple-100 hover:bg-purple-200 text-purple-800 px-3 py-2 rounded flex items-center gap-1"
            title="Test all backend endpoints"
          >
            <span>🧪</span> Test Backend
          </button>
          <a
            href="http://localhost:5000/api/debug/tickets"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-2 rounded flex items-center gap-1"
          >
            <span>🔍</span> Debug API
          </a>
          <button
            onClick={handleApproveAll}
            className="text-sm bg-green-100 hover:bg-green-200 text-green-800 px-3 py-2 rounded flex items-center gap-1"
            title="Approve all tickets (Debug)"
          >
            <span>✅</span> Approve All
          </button>
        </div> */}
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Transport
          </label>
          <select
            value={transport}
            onChange={(e) => setTransport(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Transport Types</option>
            <option value="bus">Bus</option>
            <option value="train">Train</option>
            <option value="launch">Launch</option>
            <option value="plane">Plane</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sort by Price
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Default Sorting (Newest First)</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Status Bar */}
      <div className="mb-4 p-3 bg-gray-50 rounded text-sm">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${tickets.length > 0 ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
            API Status: {tickets.length > 0 ? 'Connected' : 'Connected (No Data)'}
          </span>
          <span>
            Tickets found: <strong>{tickets.length}</strong>
          </span>
          <span>
            Page: <strong>{page}</strong> of <strong>{totalPages}</strong>
          </span>
          <div className="ml-auto flex gap-2">
            <button
              onClick={testBackendEndpoints}
              className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-800 px-2 py-1 rounded"
            >
              Quick Test
            </button>
            <button
              onClick={() => console.log("Debug Info:", debugInfo)}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded"
            >
              Console Log
            </button>
          </div>
        </div>
      </div>

      {/* Tickets Grid */}
      {tickets.length === 0 ? (
        <NoTicketsDisplay />
      ) : (
        <>
          <div className="mb-4 text-gray-600">
            Showing {tickets.length} ticket{tickets.length !== 1 ? "s" : ""}{" "}
            (Page {page} of {totalPages})
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tickets.map((ticket) => (
              <TicketCard key={ticket._id} ticket={ticket} />
            ))}
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
              >
                Previous
              </button>
              <span className="text-gray-700">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}