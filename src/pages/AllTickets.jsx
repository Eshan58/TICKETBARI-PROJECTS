import React, { useEffect, useState } from "react";
import { apiRequest } from "../services/api.js";
import { Link } from "react-router-dom";

export default function AllTickets() {
  const [tickets, setTickets] = useState([]);
  const [page, setPage] = useState(1);
  const [transport, setTransport] = useState("");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      setError(null);
      try {
        const q = `?page=${page}&limit=8&transport=${transport}&sort=${sort}`;
        const response = await apiRequest("/api/tickets" + q);

        // Clean solution: Extract tickets from the API response structure
        // Structure: response.data = { success: true, data: { tickets: [...], pagination: {...} } }
        const ticketsData = response?.data?.data?.tickets || [];

        setTickets(ticketsData);
      } catch (err) {
        console.error("Error fetching tickets:", err);
        setError("Failed to load tickets. Please try again later.");
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [page, transport, sort]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
          <p>Loading tickets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="btn bg-blue-600 text-white hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Available Tickets</h1>

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
            <option value="">Default Sorting</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {tickets.length === 0 ? (
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
              ></path>
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
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tickets.map((ticket) => (
              <div
                key={ticket._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative h-48">
                  <img
                    src={ticket.image}
                    className="w-full h-full object-cover"
                    alt={ticket.title}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-1">
                    {ticket.title}
                  </h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium mr-2">Route:</span>
                      <span>
                        {ticket.from} → {ticket.to}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium mr-2">Type:</span>
                      <span className="capitalize">{ticket.transportType}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium mr-2">Price:</span>
                      <span className="text-green-600 font-bold">
                        ${ticket.price}
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/tickets/${ticket._id}`}
                    className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination controls */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
            >
              Previous
            </button>
            <span className="text-gray-700">Page {page}</span>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={tickets.length < 8}
              className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
