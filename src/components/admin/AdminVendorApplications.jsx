
// import React, { useState, useEffect } from "react";
// import api from "../../services/api";

// const AdminVendorApplications = () => {
//   const [applications, setApplications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [stats, setStats] = useState({
//     total: 0,
//     pending: 0,
//     approved: 0,
//     rejected: 0,
//   });
//   const [pagination, setPagination] = useState({
//     page: 1,
//     pages: 1,
//     limit: 10,
//     total: 0,
//   });
//   const [filter, setFilter] = useState("all");
//   const [reviewModal, setReviewModal] = useState({
//     open: false,
//     application: null,
//     status: "",
//     notes: "",
//     readOnly: false,
//   });

//   const fetchApplications = async (page = 1, status = "all") => {
//     setLoading(true);
//     setError("");
    
//     try {
//       const response = await api.getVendorApplications({
//         page,
//         limit: 10,
//         status: status === "all" ? "" : status,
//       });
      
//       if (response.data.success) {
//         setApplications(response.data.data.applications || []);
//         setStats(response.data.data.stats || stats);
//         setPagination(response.data.data.pagination || pagination);
//       } else {
//         setError(response.data.message || "Failed to fetch applications");
//       }
//     } catch (err) {
//       setError(err.message || "Failed to fetch applications");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchApplications(1, filter);
//   }, [filter]);

//   const handleReview = (application) => {
//     setReviewModal({
//       open: true,
//       application,
//       status: "",
//       notes: "",
//       readOnly: false,
//     });
//   };

//   const submitReview = async () => {
//     if (!reviewModal.status) {
//       alert("Please select a status");
//       return;
//     }

//     try {
//       const response = await api.reviewVendorApplication(
//         reviewModal.application._id,
//         {
//           status: reviewModal.status,
//           reviewNotes: reviewModal.notes,
//         }
//       );

//       if (response.data.success) {
//         alert(`Application ${reviewModal.status} successfully`);
//         setReviewModal({ open: false, application: null, status: "", notes: "", readOnly: false });
//         fetchApplications(pagination.page, filter);
//       } else {
//         alert(response.data.message || "Failed to submit review");
//       }
//     } catch (err) {
//       alert(err.message || "Failed to submit review");
//     }
//   };

//   const viewApplicationDetails = (application) => {
//     setReviewModal({
//       open: true,
//       application,
//       status: application.status,
//       notes: application.reviewNotes || "",
//       readOnly: true,
//     });
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "pending": return "bg-yellow-100 text-yellow-800";
//       case "approved": return "bg-green-100 text-green-800";
//       case "rejected": return "bg-red-100 text-red-800";
//       default: return "bg-gray-100 text-gray-800";
//     }
//   };

//   const renderReviewModal = () => {
//     if (!reviewModal.open || !reviewModal.application) return null;

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//         <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//           <h3 className="text-xl font-bold mb-4">
//             {reviewModal.readOnly ? "Application Details" : "Review Application"}
//           </h3>
          
//           <div className="space-y-4 mb-6">
//             <div>
//               <h4 className="font-semibold text-gray-700">Business Information</h4>
//               <div className="grid grid-cols-2 gap-4 mt-2">
//                 <div>
//                   <p className="text-sm text-gray-600">Business Name</p>
//                   <p className="font-medium">{reviewModal.application.businessName}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Contact Person</p>
//                   <p className="font-medium">{reviewModal.application.contactName}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Phone</p>
//                   <p className="font-medium">{reviewModal.application.phone}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Email</p>
//                   <p className="font-medium">{reviewModal.application.userEmail}</p>
//                 </div>
//               </div>
//             </div>

//             <div>
//               <h4 className="font-semibold text-gray-700">Business Details</h4>
//               <div className="mt-2 space-y-2">
//                 <div>
//                   <p className="text-sm text-gray-600">Business Type</p>
//                   <p className="font-medium">{reviewModal.application.businessType}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Address</p>
//                   <p className="font-medium">{reviewModal.application.address}</p>
//                 </div>
//                 {reviewModal.application.website && (
//                   <div>
//                     <p className="text-sm text-gray-600">Website</p>
//                     <p className="font-medium">{reviewModal.application.website}</p>
//                   </div>
//                 )}
//                 <div>
//                   <p className="text-sm text-gray-600">Description</p>
//                   <p className="font-medium">{reviewModal.application.description}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {!reviewModal.readOnly ? (
//             <>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Status
//                 </label>
//                 <select
//                   className="w-full border rounded-lg p-2"
//                   value={reviewModal.status}
//                   onChange={(e) => setReviewModal({...reviewModal, status: e.target.value})}
//                 >
//                   <option value="">Select status</option>
//                   <option value="approved">Approve</option>
//                   <option value="rejected">Reject</option>
//                 </select>
//               </div>

//               <div className="mb-6">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Review Notes (Optional)
//                 </label>
//                 <textarea
//                   className="w-full border rounded-lg p-2 h-32"
//                   placeholder="Add notes for the applicant..."
//                   value={reviewModal.notes}
//                   onChange={(e) => setReviewModal({...reviewModal, notes: e.target.value})}
//                 />
//               </div>

//               <div className="flex justify-end space-x-3">
//                 <button
//                   className="px-4 py-2 border rounded-lg hover:bg-gray-50"
//                   onClick={() => setReviewModal({ open: false, application: null, status: "", notes: "", readOnly: false })}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
//                   onClick={submitReview}
//                   disabled={!reviewModal.status}
//                 >
//                   Submit Review
//                 </button>
//               </div>
//             </>
//           ) : (
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Current Status
//                 </label>
//                 <span className={`px-3 py-1 rounded-full ${getStatusColor(reviewModal.status)}`}>
//                   {reviewModal.status.toUpperCase()}
//                 </span>
//               </div>
              
//               {reviewModal.notes && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Review Notes
//                   </label>
//                   <div className="p-3 bg-gray-50 rounded-lg">
//                     <p>{reviewModal.notes}</p>
//                   </div>
//                 </div>
//               )}

//               <div className="flex justify-end">
//                 <button
//                   className="px-4 py-2 border rounded-lg hover:bg-gray-50"
//                   onClick={() => setReviewModal({ open: false, application: null, status: "", notes: "", readOnly: false })}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">Vendor Applications</h1>
//         <p className="text-gray-600 mt-2">Review and manage vendor applications</p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <div className="bg-white p-4 rounded-lg shadow border">
//           <h3 className="text-sm font-semibold text-gray-700">Total</h3>
//           <p className="text-2xl font-bold mt-1">{stats.total}</p>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow border">
//           <h3 className="text-sm font-semibold text-yellow-600">Pending</h3>
//           <p className="text-2xl font-bold mt-1 text-yellow-600">{stats.pending}</p>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow border">
//           <h3 className="text-sm font-semibold text-green-600">Approved</h3>
//           <p className="text-2xl font-bold mt-1 text-green-600">{stats.approved}</p>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow border">
//           <h3 className="text-sm font-semibold text-red-600">Rejected</h3>
//           <p className="text-2xl font-bold mt-1 text-red-600">{stats.rejected}</p>
//         </div>
//       </div>

//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <div className="p-4 border-b">
//           <div className="flex flex-wrap gap-2">
//             <button
//               onClick={() => setFilter("all")}
//               className={`px-4 py-2 rounded-lg ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
//             >
//               All
//             </button>
//             <button
//               onClick={() => setFilter("pending")}
//               className={`px-4 py-2 rounded-lg ${filter === "pending" ? "bg-yellow-600 text-white" : "bg-gray-200 text-gray-700"}`}
//             >
//               Pending
//             </button>
//             <button
//               onClick={() => setFilter("approved")}
//               className={`px-4 py-2 rounded-lg ${filter === "approved" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"}`}
//             >
//               Approved
//             </button>
//             <button
//               onClick={() => setFilter("rejected")}
//               className={`px-4 py-2 rounded-lg ${filter === "rejected" ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700"}`}
//             >
//               Rejected
//             </button>
//           </div>
//         </div>

//         {loading ? (
//           <div className="p-8 text-center">
//             <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//             <p className="mt-2 text-gray-600">Loading applications...</p>
//           </div>
//         ) : error ? (
//           <div className="p-8 text-center text-red-600">
//             <p>{error}</p>
//             <button
//               onClick={() => fetchApplications(pagination.page, filter)}
//               className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//             >
//               Retry
//             </button>
//           </div>
//         ) : applications.length === 0 ? (
//           <div className="p-8 text-center text-gray-500">
//             <p>No vendor applications found.</p>
//           </div>
//         ) : (
//           <>
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Business
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Contact
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Type
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Submitted
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {applications.map((app) => (
//                     <tr key={app._id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4">
//                         <div className="font-medium text-gray-900">{app.businessName}</div>
//                         <div className="text-sm text-gray-500">{app.userEmail}</div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="text-sm">{app.contactName}</div>
//                         <div className="text-sm text-gray-500">{app.phone}</div>
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-500">
//                         {app.businessType}
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(app.status)}`}>
//                           {app.status.toUpperCase()}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-500">
//                         {formatDate(app.createdAt)}
//                       </td>
//                       <td className="px-6 py-4 text-sm font-medium">
//                         {app.status === "pending" ? (
//                           <button
//                             onClick={() => handleReview(app)}
//                             className="text-blue-600 hover:text-blue-900 mr-3"
//                           >
//                             Review
//                           </button>
//                         ) : null}
//                         <button
//                           onClick={() => viewApplicationDetails(app)}
//                           className="text-gray-600 hover:text-gray-900"
//                         >
//                           View
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {pagination.pages > 1 && (
//               <div className="px-6 py-4 border-t border-gray-200">
//                 <div className="flex justify-between items-center">
//                   <div className="text-sm text-gray-700">
//                     Showing <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
//                     <span className="font-medium">
//                       {Math.min(pagination.page * pagination.limit, pagination.total)}
//                     </span>{' '}
//                     of <span className="font-medium">{pagination.total}</span> results
//                   </div>
//                   <div className="flex space-x-2">
//                     <button
//                       onClick={() => fetchApplications(pagination.page - 1, filter)}
//                       disabled={pagination.page === 1}
//                       className="px-3 py-1 border rounded-lg disabled:opacity-50"
//                     >
//                       Previous
//                     </button>
//                     <button
//                       onClick={() => fetchApplications(pagination.page + 1, filter)}
//                       disabled={pagination.page === pagination.pages}
//                       className="px-3 py-1 border rounded-lg disabled:opacity-50"
//                     >
//                       Next
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {renderReviewModal()}
//     </div>
//   );
// };

// export default AdminVendorApplications;
import React, { useState, useEffect } from "react";
import api from "../../services/api";

const AdminVendorApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    limit: 10,
    total: 0,
  });
  const [filter, setFilter] = useState("all");
  const [reviewModal, setReviewModal] = useState({
    open: false,
    application: null,
    status: "",
    notes: "",
    readOnly: false,
  });

  const fetchApplications = async (page = 1, status = "all") => {
    setLoading(true);
    setError("");
    
    try {
      const response = await api.getVendorApplications({
        page,
        limit: 10,
        status: status === "all" ? "" : status,
      });
      
      console.log("📊 Vendor applications response:", response.data);
      
      if (response.data.success) {
        setApplications(response.data.data.applications || []);
        setStats(response.data.data.stats || stats);
        setPagination(response.data.data.pagination || pagination);
        console.log(`✅ Loaded ${response.data.data.applications?.length || 0} applications`);
      } else {
        setError(response.data.message || "Failed to fetch applications");
      }
    } catch (err) {
      console.error("❌ Error fetching applications:", err);
      setError(err.response?.data?.message || err.message || "Failed to fetch applications");
      
      // Fallback mock data for testing
      console.log("🔄 Using fallback data for testing");
      const mockApplications = [
        {
          _id: "mock-1",
          userId: "user123",
          userName: "Islam Eshan",
          userEmail: "islameshan451@gmail.com",
          businessName: "Eshan Travels",
          contactName: "Islam Eshan",
          phone: "+8801712345678",
          businessType: "Travel Agency",
          description: "Premium travel services provider",
          address: "Dhaka, Bangladesh",
          status: "pending",
          createdAt: new Date().toISOString(),
        }
      ];
      setApplications(mockApplications);
      setStats({
        total: 1,
        pending: 1,
        approved: 0,
        rejected: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("🔄 Loading vendor applications with filter:", filter);
    fetchApplications(1, filter);
  }, [filter]);

  const handleReview = (application) => {
    console.log("📝 Reviewing application:", application._id);
    setReviewModal({
      open: true,
      application,
      status: "",
      notes: "",
      readOnly: false,
    });
  };

  const submitReview = async () => {
    console.log("🚀 Submitting review:", reviewModal);
    
    if (!reviewModal.status) {
      alert("Please select a status");
      return;
    }

    // Confirm approval
    if (reviewModal.status === "approved") {
      const confirmed = window.confirm(
        `Are you sure you want to approve ${reviewModal.application.businessName}?\n\n` +
        "This will:\n" +
        "1. Change user role to 'vendor'\n" +
        "2. Grant vendor dashboard access\n" +
        "3. Allow ticket creation\n\n" +
        "Click OK to approve."
      );
      
      if (!confirmed) {
        return;
      }
    }

    try {
      console.log(`📤 Sending review for application: ${reviewModal.application._id}`);
      
      const response = await api.reviewVendorApplication(
        reviewModal.application._id,
        {
          status: reviewModal.status,
          reviewNotes: reviewModal.notes,
        }
      );

      console.log("✅ Review response:", response.data);

      if (response.data.success) {
        if (reviewModal.status === "approved") {
          alert(`✅ Application approved!\n\nUser ${reviewModal.application.userEmail} is now a vendor.`);
        } else {
          alert(`Application rejected.`);
        }
        
        setReviewModal({ 
          open: false, 
          application: null, 
          status: "", 
          notes: "", 
          readOnly: false 
        });
        
        // Refresh the applications list
        fetchApplications(pagination.page, filter);
        
        // Show success message with details
        console.log(`✅ User ${reviewModal.application.userEmail} role updated to vendor`);
        
      } else {
        alert(response.data.message || "Failed to submit review");
      }
    } catch (err) {
      console.error("❌ Review submission error:", err);
      
      let errorMessage = "Failed to submit review";
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = "Authentication failed. Please login again.";
        } else if (err.response.status === 403) {
          errorMessage = "You don't have admin permission to review applications.";
        } else if (err.response.status === 404) {
          errorMessage = "Application not found. It may have been deleted.";
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      alert(`❌ ${errorMessage}\n\nCheck console for details.`);
    }
  };

  const viewApplicationDetails = (application) => {
    setReviewModal({
      open: true,
      application,
      status: application.status,
      notes: application.reviewNotes || "",
      readOnly: true,
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "approved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleBadge = (email, status) => {
    if (email === "mahdiashan9@gmail.com") {
      return <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">admin</span>;
    }
    if (status === "approved") {
      return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">vendor</span>;
    }
    return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">user</span>;
  };

  const renderReviewModal = () => {
    if (!reviewModal.open || !reviewModal.application) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold">
              {reviewModal.readOnly ? "Application Details" : "Review Application"}
            </h3>
            <button
              onClick={() => setReviewModal({ 
                open: false, 
                application: null, 
                status: "", 
                notes: "", 
                readOnly: false 
              })}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          {/* Application Summary */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-lg">{reviewModal.application.businessName}</h4>
                <p className="text-gray-600">{reviewModal.application.userEmail}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Status</p>
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(reviewModal.application.status)}`}>
                  {reviewModal.application.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          
          <div className="space-y-6 mb-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Business Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border">
                  <p className="text-sm text-gray-600">Business Name</p>
                  <p className="font-medium mt-1">{reviewModal.application.businessName}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <p className="text-sm text-gray-600">Contact Person</p>
                  <p className="font-medium mt-1">{reviewModal.application.contactName}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium mt-1">{reviewModal.application.phone}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium mt-1">{reviewModal.application.userEmail}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Business Details</h4>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border">
                  <p className="text-sm text-gray-600">Business Type</p>
                  <p className="font-medium mt-1">{reviewModal.application.businessType}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium mt-1">{reviewModal.application.address}</p>
                </div>
                {reviewModal.application.website && (
                  <div className="bg-white p-4 rounded-lg border">
                    <p className="text-sm text-gray-600">Website</p>
                    <p className="font-medium mt-1">
                      <a href={reviewModal.application.website} target="_blank" rel="noopener noreferrer" 
                         className="text-blue-600 hover:text-blue-800">
                        {reviewModal.application.website}
                      </a>
                    </p>
                  </div>
                )}
                <div className="bg-white p-4 rounded-lg border">
                  <p className="text-sm text-gray-600">Description</p>
                  <p className="font-medium mt-1">{reviewModal.application.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Role Change Notice */}
          {!reviewModal.readOnly && reviewModal.status === "approved" && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <span className="text-green-600">⚠️</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Role Change Notice</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>Approving this application will:</p>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      <li>Change user role from <span className="font-semibold">user</span> to <span className="font-semibold">vendor</span></li>
                      <li>Grant access to vendor dashboard</li>
                      <li>Allow creation and management of tickets</li>
                      <li>Enable vendor-specific features</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!reviewModal.readOnly ? (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Decision
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setReviewModal({...reviewModal, status: "approved"})}
                    className={`p-4 border-2 rounded-lg flex flex-col items-center justify-center transition-all ${
                      reviewModal.status === "approved" 
                      ? "border-green-500 bg-green-50 text-green-700" 
                      : "border-gray-300 hover:border-green-400 hover:bg-green-50"
                    }`}
                  >
                    <span className="text-2xl mb-2">✅</span>
                    <span className="font-semibold">Approve</span>
                    <span className="text-sm mt-1 text-gray-600">Grant vendor access</span>
                  </button>
                  <button
                    onClick={() => setReviewModal({...reviewModal, status: "rejected"})}
                    className={`p-4 border-2 rounded-lg flex flex-col items-center justify-center transition-all ${
                      reviewModal.status === "rejected" 
                      ? "border-red-500 bg-red-50 text-red-700" 
                      : "border-gray-300 hover:border-red-400 hover:bg-red-50"
                    }`}
                  >
                    <span className="text-2xl mb-2">❌</span>
                    <span className="font-semibold">Reject</span>
                    <span className="text-sm mt-1 text-gray-600">Decline application</span>
                  </button>
                </div>
                <div className="mt-4 text-center">
                  <span className="text-sm text-gray-600">
                    Selected: <span className="font-semibold">
                      {reviewModal.status === "approved" ? "Approve" : 
                       reviewModal.status === "rejected" ? "Reject" : "None"}
                    </span>
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Notes (Optional)
                </label>
                <textarea
                  className="w-full border rounded-lg p-3 h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add notes for the applicant. These will be visible to them..."
                  value={reviewModal.notes}
                  onChange={(e) => setReviewModal({...reviewModal, notes: e.target.value})}
                />
                <p className="text-xs text-gray-500 mt-1">
                  This feedback will be shared with the applicant
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  className="px-6 py-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setReviewModal({ open: false, application: null, status: "", notes: "", readOnly: false })}
                >
                  Cancel
                </button>
                <button
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    !reviewModal.status 
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                    : reviewModal.status === "approved"
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                  onClick={submitReview}
                  disabled={!reviewModal.status}
                >
                  {reviewModal.status === "approved" ? "Approve Application" : 
                   reviewModal.status === "rejected" ? "Reject Application" : 
                   "Submit Decision"}
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Status
                </label>
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-2 rounded-full ${getStatusColor(reviewModal.status)}`}>
                    {reviewModal.status.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-600">
                    Reviewed on: {formatDate(reviewModal.application.updatedAt || reviewModal.application.createdAt)}
                  </span>
                </div>
              </div>
              
              {reviewModal.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Notes
                  </label>
                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <p className="whitespace-pre-wrap">{reviewModal.notes}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  className="px-6 py-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setReviewModal({ open: false, application: null, status: "", notes: "", readOnly: false })}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const retryFetch = () => {
    fetchApplications(pagination.page, filter);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Vendor Applications</h1>
        <p className="text-gray-600 mt-2">Review and manage vendor applications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border hover:shadow-md transition-shadow">
          <h3 className="text-sm font-semibold text-gray-700">Total</h3>
          <p className="text-2xl font-bold mt-1">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border hover:shadow-md transition-shadow">
          <h3 className="text-sm font-semibold text-yellow-600">Pending</h3>
          <p className="text-2xl font-bold mt-1 text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border hover:shadow-md transition-shadow">
          <h3 className="text-sm font-semibold text-green-600">Approved</h3>
          <p className="text-2xl font-bold mt-1 text-green-600">{stats.approved}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border hover:shadow-md transition-shadow">
          <h3 className="text-sm font-semibold text-red-600">Rejected</h3>
          <p className="text-2xl font-bold mt-1 text-red-600">{stats.rejected}</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === "all" 
                ? "bg-blue-600 text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === "pending" 
                ? "bg-yellow-600 text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Pending ({stats.pending})
            </button>
            <button
              onClick={() => setFilter("approved")}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === "approved" 
                ? "bg-green-600 text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Approved ({stats.approved})
            </button>
            <button
              onClick={() => setFilter("rejected")}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === "rejected" 
                ? "bg-red-600 text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Rejected ({stats.rejected})
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading applications...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <div className="text-red-600 mb-4">
              <p className="font-medium">Error loading applications</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={retryFetch}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
            <div className="mt-4 text-sm text-gray-500">
              <p>Make sure backend is running on port 5000</p>
              <p>Check browser console for details</p>
            </div>
          </div>
        ) : applications.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-500 mb-4">
              <p className="text-xl mb-2">📋 No vendor applications found</p>
              <p className="text-sm">When users apply for vendor access, they'll appear here.</p>
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg inline-block">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> Users can apply from "Become a Vendor" page
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Applications Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Business
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((app) => (
                    <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{app.businessName}</div>
                        <div className="text-sm text-gray-500">{app.userEmail}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {getRoleBadge(app.userEmail, app.status)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium">{app.contactName}</div>
                        <div className="text-sm text-gray-500">{app.phone}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {app.businessType}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(app.status)}`}>
                          {app.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(app.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          {app.status === "pending" ? (
                            <button
                              onClick={() => handleReview(app)}
                              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Review
                            </button>
                          ) : null}
                          <button
                            onClick={() => viewApplicationDetails(app)}
                            className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(pagination.page * pagination.limit, pagination.total)}
                    </span>{' '}
                    of <span className="font-medium">{pagination.total}</span> applications
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => fetchApplications(pagination.page - 1, filter)}
                      disabled={pagination.page === 1}
                      className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-sm text-gray-700">
                      Page {pagination.page} of {pagination.pages}
                    </span>
                    <button
                      onClick={() => fetchApplications(pagination.page + 1, filter)}
                      disabled={pagination.page === pagination.pages}
                      className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Debug Panel for Development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg border">
          <details>
            <summary className="font-medium text-gray-700 cursor-pointer">Debug Information</summary>
            <div className="mt-2 space-y-2">
              <div className="p-3 bg-white rounded text-sm font-mono">
                <p>Applications loaded: {applications.length}</p>
                <p>Filter: {filter}</p>
                <p>Stats: {JSON.stringify(stats)}</p>
                <p>Error: {error || "None"}</p>
                <button 
                  onClick={() => {
                    console.log("Applications:", applications);
                    console.log("Filter:", filter);
                    console.log("Stats:", stats);
                  }}
                  className="mt-2 px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs"
                >
                  Log to Console
                </button>
              </div>
            </div>
          </details>
        </div>
      )}

      {/* Review Modal */}
      {renderReviewModal()}
    </div>
  );
};

export default AdminVendorApplications;