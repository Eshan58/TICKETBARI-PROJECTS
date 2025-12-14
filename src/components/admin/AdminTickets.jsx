import React, { useState, useEffect } from "react";
import { apiGet, verifyTicket } from "../../services/api";

const AdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 10,
  });

  const fetchTickets = async (page = 1, status = filter) => {
    setLoading(true);
    try {
      const queryParams = { page, limit: 10 };
      if (status !== "all") {
        queryParams.verified = status;
      }
      
      const response = await apiGet("/api/admin/tickets", queryParams);
      
      if (response.data?.success) {
        setTickets(response.data.data?.tickets || []);
        setPagination(response.data.data?.pagination || pagination);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets(1, filter);
  }, [filter]);

  const handleVerifyTicket = async (ticketId, status) => {
    if (!window.confirm(`Are you sure you want to ${status} this ticket?`)) {
      return;
    }

    try {
      const response = await verifyTicket(ticketId, status);
      
      if (response.data?.success) {
        alert(`Ticket ${status} successfully`);
        fetchTickets(pagination.page, filter);
      } else {
        alert(response.data?.message || "Failed to update ticket status");
      }
    } catch (error) {
      alert("Failed to update ticket status. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "approved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTransportIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "bus": return "🚌";
      case "train": return "🚆";
      case "launch": return "⛴️";
      case "plane": return "✈️";
      default: return "🎫";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ticket Management</h1>
          <p className="text-gray-600 mt-2">Review and manage all tickets on the platform</p>
        </div>
        <div className="text-sm text-gray-500">
          Total: <span className="font-semibold">{pagination.total}</span> tickets
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border">
        {/* Filter Tabs */}
        <div className="p-4 border-b">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "all" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Tickets
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "pending" 
                  ? "bg-yellow-600 text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Pending ({tickets.filter(t => t.verified === "pending").length})
            </button>
            <button
              onClick={() => setFilter("approved")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "approved" 
                  ? "bg-green-600 text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilter("rejected")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "rejected" 
                  ? "bg-red-600 text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Rejected
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            <p className="mt-3 text-gray-600">Loading tickets...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <span className="text-2xl">🎫</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Tickets Found</h3>
            <p className="text-gray-500">No tickets match the current filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Route & Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tickets.map((ticket) => (
                  <tr key={ticket._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-50 rounded-lg mr-3">
                          <span className="text-lg">{getTransportIcon(ticket.transportType)}</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{ticket.title || "Unnamed Ticket"}</div>
                          <div className="text-sm text-gray-500">
                            {formatDate(ticket.departureAt)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{ticket.vendorName || "Unknown Vendor"}</div>
                      <div className="text-xs text-gray-500 truncate max-w-xs">
                        ID: {ticket.vendorId?.substring(0, 8)}...
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium">
                        <span className="text-gray-900">{ticket.from || "N/A"}</span>
                        <span className="mx-2 text-gray-400">→</span>
                        <span className="text-gray-900">{ticket.to || "N/A"}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {ticket.transportType?.toUpperCase()} • ${ticket.price || 0}
                        {ticket.quantity && (
                          <span className="ml-2">• Qty: {ticket.quantity}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ticket.verified)}`}>
                        {ticket.verified?.toUpperCase() || "UNKNOWN"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {ticket.verified === "pending" ? (
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleVerifyTicket(ticket._id, "approved")}
                            className="text-green-600 hover:text-green-900 hover:underline"
                            title="Approve Ticket"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleVerifyTicket(ticket._id, "rejected")}
                            className="text-red-600 hover:text-red-900 hover:underline"
                            title="Reject Ticket"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <button
                            onClick={() => handleVerifyTicket(
                              ticket._id, 
                              ticket.verified === "approved" ? "rejected" : "approved"
                            )}
                            className={`px-3 py-1 text-xs rounded ${
                              ticket.verified === "approved" 
                                ? "bg-red-100 text-red-700 hover:bg-red-200" 
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                            }`}
                          >
                            {ticket.verified === "approved" ? "Mark as Rejected" : "Mark as Approved"}
                          </button>
                          <button
                            className="block text-xs text-blue-600 hover:text-blue-800 hover:underline"
                            onClick={() => alert(`Viewing details for ticket: ${ticket._id}`)}
                          >
                            View Details
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-gray-700 mb-2 sm:mb-0">
                Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span> of{" "}
                <span className="font-medium">{pagination.total}</span> results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => fetchTickets(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-sm">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => fetchTickets(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      {!loading && tickets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="text-sm text-gray-500">Total Tickets</div>
            <div className="text-2xl font-bold">{pagination.total}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="text-sm text-gray-500">Pending Approval</div>
            <div className="text-2xl font-bold text-yellow-600">
              {tickets.filter(t => t.verified === "pending").length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="text-sm text-gray-500">Approved</div>
            <div className="text-2xl font-bold text-green-600">
              {tickets.filter(t => t.verified === "approved").length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="text-sm text-gray-500">Rejected</div>
            <div className="text-2xl font-bold text-red-600">
              {tickets.filter(t => t.verified === "rejected").length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTickets;