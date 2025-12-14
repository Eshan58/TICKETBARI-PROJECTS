// import React, { useState, useEffect } from "react";
// import api from "../../api";

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
//         setReviewModal({ open: false, application: null, status: "", notes: "" });
//         fetchApplications(pagination.page, filter);
//       } else {
//         alert(response.data.message || "Failed to submit review");
//       }
//     } catch (err) {
//       alert(err.message || "Failed to submit review");
//     }
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
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
//           <h3 className="text-xl font-bold mb-4">
//             Review Application: {reviewModal.application.businessName}
//           </h3>
          
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Status
//             </label>
//             <select
//               className="w-full border rounded-lg p-2"
//               value={reviewModal.status}
//               onChange={(e) => setReviewModal({...reviewModal, status: e.target.value})}
//             >
//               <option value="">Select status</option>
//               <option value="approved">Approve</option>
//               <option value="rejected">Reject</option>
//             </select>
//           </div>

//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Review Notes (Optional)
//             </label>
//             <textarea
//               className="w-full border rounded-lg p-2 h-32"
//               placeholder="Add notes for the applicant..."
//               value={reviewModal.notes}
//               onChange={(e) => setReviewModal({...reviewModal, notes: e.target.value})}
//             />
//           </div>

//           <div className="flex justify-end space-x-3">
//             <button
//               className="px-4 py-2 border rounded-lg hover:bg-gray-50"
//               onClick={() => setReviewModal({ open: false, application: null, status: "", notes: "" })}
//             >
//               Cancel
//             </button>
//             <button
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//               onClick={submitReview}
//               disabled={!reviewModal.status}
//             >
//               Submit Review
//             </button>
//           </div>
//         </div>
//       </div>
//     );
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

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">Vendor Applications</h1>
//         <p className="text-gray-600 mt-2">Review and manage vendor applications submitted by users</p>
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
//                         ) : (
//                           <button
//                             onClick={() => viewApplicationDetails(app)}
//                             className="text-gray-600 hover:text-gray-900 mr-3"
//                           >
//                             View
//                           </button>
//                         )}
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
//                       className="px-3 py-1 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       Previous
//                     </button>
//                     <button
//                       onClick={() => fetchApplications(pagination.page + 1, filter)}
//                       disabled={pagination.page === pagination.pages}
//                       className="px-3 py-1 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
      
      if (response.data.success) {
        setApplications(response.data.data.applications || []);
        setStats(response.data.data.stats || stats);
        setPagination(response.data.data.pagination || pagination);
      } else {
        setError(response.data.message || "Failed to fetch applications");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications(1, filter);
  }, [filter]);

  const handleReview = (application) => {
    setReviewModal({
      open: true,
      application,
      status: "",
      notes: "",
      readOnly: false,
    });
  };

  const submitReview = async () => {
    if (!reviewModal.status) {
      alert("Please select a status");
      return;
    }

    try {
      const response = await api.reviewVendorApplication(
        reviewModal.application._id,
        {
          status: reviewModal.status,
          reviewNotes: reviewModal.notes,
        }
      );

      if (response.data.success) {
        alert(`Application ${reviewModal.status} successfully`);
        setReviewModal({ open: false, application: null, status: "", notes: "", readOnly: false });
        fetchApplications(pagination.page, filter);
      } else {
        alert(response.data.message || "Failed to submit review");
      }
    } catch (err) {
      alert(err.message || "Failed to submit review");
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

  const renderReviewModal = () => {
    if (!reviewModal.open || !reviewModal.application) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-bold mb-4">
            {reviewModal.readOnly ? "Application Details" : "Review Application"}
          </h3>
          
          <div className="space-y-4 mb-6">
            <div>
              <h4 className="font-semibold text-gray-700">Business Information</h4>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-sm text-gray-600">Business Name</p>
                  <p className="font-medium">{reviewModal.application.businessName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contact Person</p>
                  <p className="font-medium">{reviewModal.application.contactName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{reviewModal.application.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{reviewModal.application.userEmail}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700">Business Details</h4>
              <div className="mt-2 space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Business Type</p>
                  <p className="font-medium">{reviewModal.application.businessType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium">{reviewModal.application.address}</p>
                </div>
                {reviewModal.application.website && (
                  <div>
                    <p className="text-sm text-gray-600">Website</p>
                    <p className="font-medium">{reviewModal.application.website}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Description</p>
                  <p className="font-medium">{reviewModal.application.description}</p>
                </div>
              </div>
            </div>
          </div>

          {!reviewModal.readOnly ? (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  className="w-full border rounded-lg p-2"
                  value={reviewModal.status}
                  onChange={(e) => setReviewModal({...reviewModal, status: e.target.value})}
                >
                  <option value="">Select status</option>
                  <option value="approved">Approve</option>
                  <option value="rejected">Reject</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Notes (Optional)
                </label>
                <textarea
                  className="w-full border rounded-lg p-2 h-32"
                  placeholder="Add notes for the applicant..."
                  value={reviewModal.notes}
                  onChange={(e) => setReviewModal({...reviewModal, notes: e.target.value})}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  onClick={() => setReviewModal({ open: false, application: null, status: "", notes: "", readOnly: false })}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  onClick={submitReview}
                  disabled={!reviewModal.status}
                >
                  Submit Review
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Status
                </label>
                <span className={`px-3 py-1 rounded-full ${getStatusColor(reviewModal.status)}`}>
                  {reviewModal.status.toUpperCase()}
                </span>
              </div>
              
              {reviewModal.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Notes
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p>{reviewModal.notes}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Vendor Applications</h1>
        <p className="text-gray-600 mt-2">Review and manage vendor applications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-semibold text-gray-700">Total</h3>
          <p className="text-2xl font-bold mt-1">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-semibold text-yellow-600">Pending</h3>
          <p className="text-2xl font-bold mt-1 text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-semibold text-green-600">Approved</h3>
          <p className="text-2xl font-bold mt-1 text-green-600">{stats.approved}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-semibold text-red-600">Rejected</h3>
          <p className="text-2xl font-bold mt-1 text-red-600">{stats.rejected}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 rounded-lg ${filter === "pending" ? "bg-yellow-600 text-white" : "bg-gray-200 text-gray-700"}`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter("approved")}
              className={`px-4 py-2 rounded-lg ${filter === "approved" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"}`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilter("rejected")}
              className={`px-4 py-2 rounded-lg ${filter === "rejected" ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700"}`}
            >
              Rejected
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading applications...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">
            <p>{error}</p>
            <button
              onClick={() => fetchApplications(pagination.page, filter)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : applications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No vendor applications found.</p>
          </div>
        ) : (
          <>
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
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((app) => (
                    <tr key={app._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{app.businessName}</div>
                        <div className="text-sm text-gray-500">{app.userEmail}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">{app.contactName}</div>
                        <div className="text-sm text-gray-500">{app.phone}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {app.businessType}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(app.status)}`}>
                          {app.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(app.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {app.status === "pending" ? (
                          <button
                            onClick={() => handleReview(app)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Review
                          </button>
                        ) : null}
                        <button
                          onClick={() => viewApplicationDetails(app)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination.pages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(pagination.page * pagination.limit, pagination.total)}
                    </span>{' '}
                    of <span className="font-medium">{pagination.total}</span> results
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => fetchApplications(pagination.page - 1, filter)}
                      disabled={pagination.page === 1}
                      className="px-3 py-1 border rounded-lg disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => fetchApplications(pagination.page + 1, filter)}
                      disabled={pagination.page === pagination.pages}
                      className="px-3 py-1 border rounded-lg disabled:opacity-50"
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

      {renderReviewModal()}
    </div>
  );
};

export default AdminVendorApplications;