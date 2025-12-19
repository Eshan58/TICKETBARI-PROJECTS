import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TbCurrencyTaka } from "react-icons/tb";
import { apiRequest } from "../services/api.js";
import { useAuth } from "../contexts/AuthContext";

export default function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState("");
  const [departurePassed, setDeparturePassed] = useState(false);

  useEffect(() => {
    fetchTicket();
  }, [id]);

  useEffect(() => {
    if (ticket) {
      const departureDate = new Date(ticket.departureAt);
      const now = new Date();
      setDeparturePassed(departureDate < now);
    }
  }, [ticket]);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      setMessage("");
      // console.log(`📡 Fetching ticket details for ID: ${id}`);

      // FIXED: Use apiRequest instead of direct axios
      const response = await apiRequest(`/api/tickets/${id}`);

      // console.log("✅ Ticket API Response:", response);

      // FIXED: Handle different response structures
      const ticketData = response?.data?.data?.ticket || response?.data?.ticket;

      if (!ticketData) {
        console.error("❌ No ticket data found in response:", response);
        setMessage("Ticket not found or invalid response from server");
        return;
      }

      setTicket(ticketData);
    } catch (error) {
      console.error("❌ Error fetching ticket:", error);
      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Error loading ticket details"
      );
    } finally {
      setLoading(false);
    }
  };

  const book = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!ticket) {
      setMessage("Ticket information is not available");
      return;
    }

    if (departurePassed) {
      setMessage(
        "Cannot book tickets for a departure that has already passed."
      );
      return;
    }

    if (ticket.availableQuantity <= 0) {
      setMessage("Sorry, all tickets have been sold out.");
      return;
    }

    if (qty > ticket.availableQuantity) {
      setMessage(`Only ${ticket.availableQuantity} tickets available.`);
      return;
    }

    try {
      // console.log("📦 Booking request:", {
      //   ticketId: ticket._id,
      //   quantity: qty,
      //   userId: user.uid || user._id,
      // });

      // FIXED: Use apiRequest for booking
      const response = await apiRequest("/api/bookings", "POST", {
        ticketId: ticket._id,
        quantity: qty,
        userId: user.uid || user._id,
      });

      // console.log("✅ Booking response:", response);

      if (response.data.success) {
        setMessage(
          `Successfully booked ${qty} ticket(s)! Booking ID: ${
            response.data.data?.booking?._id || "N/A"
          }`
        );

        // Update ticket quantity
        setTicket((prev) => ({
          ...prev,
          availableQuantity: prev.availableQuantity - qty,
          quantity: prev.quantity - qty,
        }));

        // Reset quantity to 1
        setQty(1);

        // Auto-clear success message after 5 seconds
        setTimeout(() => {
          setMessage("");
        }, 5000);
      } else {
        setMessage(
          response.data.message || "Booking failed. Please try again."
        );
      }
    } catch (error) {
      console.error("❌ Error booking ticket:", error);
      setMessage(
        error.response?.data?.message || error.message || "Error booking ticket"
      );
    }
  };

  const handleQuantityChange = (value) => {
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 1) {
      setQty(1);
    } else if (ticket && numValue > ticket.availableQuantity) {
      setQty(ticket.availableQuantity);
    } else {
      setQty(numValue);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4"></div>
        <p className="text-lg font-medium text-gray-700">
          Loading ticket details...
        </p>
        <p className="text-sm text-gray-500 mt-2">Please wait</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto mb-6">
          <i className="fas fa-exclamation-triangle text-red-600 text-4xl mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-700">Ticket not found</h2>
          <p className="text-gray-600 mt-2">
            The ticket you're looking for doesn't exist or has been removed.
          </p>
        </div>
        <button
          onClick={() => navigate("/tickets")}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-bold"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Browse All Tickets
        </button>
      </div>
    );
  }

  const totalPrice = (qty * parseFloat(ticket.price || 0)).toFixed(2);
  const availableQty = ticket.availableQuantity || ticket.quantity || 0;
  const isSoldOut = availableQty <= 0;
  const isExpired = departurePassed;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Image Section */}
        <div className="relative">
          <img
            src={
              ticket.image ||
              "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
            }
            className="w-full h-80 object-cover"
            alt={ticket.title}
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500";
            }}
          />

          {/* Availability Badge */}
          <div
            className={`absolute top-6 right-6 text-white px-5 py-2 rounded-full shadow-xl font-bold ${
              isSoldOut
                ? "bg-gradient-to-r from-gray-500 to-gray-700"
                : availableQty < 5
                ? "bg-gradient-to-r from-orange-500 to-red-600"
                : "bg-gradient-to-r from-green-500 to-emerald-600"
            }`}
          >
            <i className="fas fa-ticket-alt mr-2"></i>
            {isSoldOut ? "Sold Out" : `${availableQty} tickets left`}
          </div>

          {/* Transport Type Badge */}
          <div className="absolute top-6 left-6 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg font-bold">
            <i
              className={`fas ${
                ticket.transportType === "bus"
                  ? "fa-bus"
                  : ticket.transportType === "train"
                  ? "fa-train"
                  : ticket.transportType === "plane"
                  ? "fa-plane"
                  : "fa-ship"
              } mr-2`}
            ></i>
            {ticket.transportType?.charAt(0).toUpperCase() +
              ticket.transportType?.slice(1)}
          </div>

          {/* Overlay gradient */}
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-white to-transparent"></div>
        </div>

        {/* Content Section */}
        <div className="p-8">
          {/* Title and Verification */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {ticket.title}
            </h1>
            <div
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${
                ticket.verified === "approved"
                  ? "bg-green-100 text-green-800"
                  : ticket.verified === "rejected"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              <i
                className={`fas ${
                  ticket.verified === "approved"
                    ? "fa-check-circle"
                    : ticket.verified === "rejected"
                    ? "fa-times-circle"
                    : "fa-clock"
                } mr-2`}
              ></i>
              {ticket.verified === "approved"
                ? "Verified"
                : ticket.verified === "rejected"
                ? "Rejected"
                : "Pending Approval"}
            </div>
          </div>

          {/* Description */}
          {ticket.description && (
            <div className="mb-10">
              <p className="text-gray-700 leading-relaxed bg-gray-50 p-6 rounded-2xl border border-gray-200">
                {ticket.description}
              </p>
            </div>
          )}

          {/* Route */}
          <div className="flex items-center justify-center mb-10 relative">
            {/* Route Line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent -translate-y-1/2 z-0"></div>

            {/* From Location */}
            <div className="bg-white px-6 py-5 rounded-2xl shadow-lg z-10 border border-blue-100">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl mr-4">
                  <i className="fas fa-map-marker-alt text-white text-2xl"></i>
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-semibold">From</p>
                  <p className="font-bold text-2xl text-gray-900">
                    {ticket.from}
                  </p>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="mx-8 z-10">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-full shadow-lg">
                <i className="fas fa-arrow-right text-white text-2xl"></i>
              </div>
            </div>

            {/* To Location */}
            <div className="bg-white px-6 py-5 rounded-2xl shadow-lg z-10 border border-purple-100">
              <div className="flex items-center">
                <div>
                  <p className="text-gray-500 text-sm font-semibold">To</p>
                  <p className="font-bold text-2xl text-gray-900">
                    {ticket.to}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-xl ml-4">
                  <i className="fas fa-map-marker-alt text-white text-2xl"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {/* Departure Time */}
            <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl border-2 border-blue-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start">
                <div className="bg-blue-100 p-4 rounded-xl mr-4">
                  <i className="fas fa-calendar-alt text-blue-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-semibold mb-2">
                    Departure
                  </p>
                  <p className="font-bold text-lg text-gray-900">
                    {new Date(ticket.departureAt).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-gray-600">
                    {new Date(ticket.departureAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-2xl border-2 border-purple-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start">
                <div className="bg-purple-100 p-4 rounded-xl mr-4">
                  <i className="fas fa-dollar-sign text-purple-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-semibold mb-2">
                    Price
                  </p>
                  <div className="flex items-baseline">
                    <span className="text-3xl flex items-center font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {parseFloat(ticket.price || 0).toFixed(2)}
                    </span>
                    <span className="text-gray-500 text-sm ml-2">/ticket</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity */}
            <div className="bg-gradient-to-br from-amber-50 to-white p-6 rounded-2xl border-2 border-amber-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start">
                <div className="bg-amber-100 p-4 rounded-xl mr-4">
                  <i className="fas fa-ticket-alt text-amber-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-semibold mb-2">
                    Available
                  </p>
                  <div className="flex items-center">
                    <span className="font-bold text-gray-900 text-2xl mr-4">
                      {availableQty}
                    </span>
                    <div className="w-32 bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${
                          availableQty <= 0
                            ? "bg-gray-400"
                            : availableQty < 5
                            ? "bg-gradient-to-r from-orange-400 to-red-500"
                            : "bg-gradient-to-r from-green-400 to-emerald-500"
                        }`}
                        style={{
                          width: `${Math.min(
                            100,
                            (availableQty / (availableQty + 5)) * 100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mt-2">
                    {availableQty <= 0
                      ? "Sold out"
                      : availableQty < 5
                      ? "Low stock"
                      : "In stock"}
                  </p>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border-2 border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start">
                <div className="bg-gray-100 p-4 rounded-xl mr-4">
                  <i className="fas fa-info-circle text-gray-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-semibold mb-2">
                    Status
                  </p>
                  <div className="flex items-center">
                    {isExpired ? (
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-red-100 text-red-800">
                        <i className="fas fa-ban mr-2"></i> Expired
                      </span>
                    ) : isSoldOut ? (
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gray-100 text-gray-800">
                        <i className="fas fa-times mr-2"></i> Sold Out
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-green-100 text-green-800">
                        <i className="fas fa-check mr-2"></i> Available
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Perks */}
          {ticket.perks && ticket.perks.length > 0 && (
            <div className="mb-10">
              <h3 className="font-bold text-xl text-gray-900 mb-4 flex items-center">
                <i className="fas fa-gift mr-3 text-purple-600"></i>
                Included Perks
              </h3>
              <div className="flex flex-wrap gap-3">
                {ticket.perks.map((perk, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 px-4 py-3 rounded-xl flex items-center"
                  >
                    <i className="fas fa-check-circle text-green-500 mr-3"></i>
                    <span className="text-gray-800 font-medium">{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Booking Section */}
          <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-2xl p-8 border-2 border-gray-200 mb-8">
            <h3 className="font-bold text-2xl text-gray-900 mb-8 flex items-center">
              <i className="fas fa-shopping-cart mr-4 text-purple-600"></i>
              Book Your Tickets
            </h3>

            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Quantity Selector */}
              <div className="w-full lg:w-auto">
                <p className="text-gray-700 mb-4 font-semibold text-lg">
                  Select Quantity
                </p>
                <div className="flex items-center">
                  <div className="bg-white border-2 border-gray-300 rounded-2xl shadow-lg p-3 flex items-center">
                    <button
                      onClick={() => handleQuantityChange(qty - 1)}
                      disabled={qty <= 1}
                      className={`w-12 h-12 flex items-center justify-center rounded-xl transition-colors ${
                        qty <= 1
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      type="button"
                    >
                      <i className="fas fa-minus text-lg"></i>
                    </button>
                    <input
                      type="number"
                      value={qty}
                      min="1"
                      max={availableQty}
                      onChange={(e) => handleQuantityChange(e.target.value)}
                      className="w-20 text-center py-3 bg-transparent text-2xl font-bold focus:outline-none"
                      disabled={isSoldOut || isExpired}
                    />
                    <button
                      onClick={() => handleQuantityChange(qty + 1)}
                      disabled={qty >= availableQty}
                      className={`w-12 h-12 flex items-center justify-center rounded-xl transition-colors ${
                        qty >= availableQty
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      type="button"
                    >
                      <i className="fas fa-plus text-lg"></i>
                    </button>
                  </div>
                  <div className="ml-6">
                    <p className="text-gray-600">
                      Max:{" "}
                      <span className="font-bold text-gray-900">
                        {availableQty}
                      </span>
                    </p>
                    <p className="text-gray-500 text-sm">
                      Each ticket:{" "}
                      <span className="font-semibold flex items-center">
                        <TbCurrencyTaka />
                        {parseFloat(ticket.price || 0).toFixed(2)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Price */}
              <div className="text-center lg:text-right">
                <p className="text-gray-700 mb-2 font-semibold text-lg">
                  Total Amount
                </p>
                <div className="flex items-baseline justify-center lg:justify-end ">
                  <span className="text-4xl items-center font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {/* <TbCurrencyTaka className="text-cyan-950"/> */}
                    {totalPrice}
                  </span>
                  <span className="text-gray-600 text-lg ml-3">
                    ({qty} {qty === 1 ? "ticket" : "tickets"})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Message and Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Message Display */}
            <div className="flex-1 min-w-0 w-full">
              {message && (
                <div
                  className={`flex items-center p-5 rounded-2xl ${
                    message.includes("Success") ||
                    message.includes("successfully")
                      ? "bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 text-green-800"
                      : message.includes("Error") ||
                        message.includes("error") ||
                        message.includes("Sorry") ||
                        message.includes("cannot")
                      ? "bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 text-red-800"
                      : "bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 text-blue-800"
                  }`}
                >
                  <i
                    className={`fas ${
                      message.includes("Success") ||
                      message.includes("successfully")
                        ? "fa-check-circle text-green-600"
                        : message.includes("Error") ||
                          message.includes("error") ||
                          message.includes("Sorry") ||
                          message.includes("cannot")
                        ? "fa-exclamation-circle text-red-600"
                        : "fa-info-circle text-blue-600"
                    } text-2xl mr-4`}
                  ></i>
                  <div>
                    <span className="font-semibold text-lg">{message}</span>
                    {message.includes("Success") && (
                      <p className="text-sm text-green-600 mt-1">
                        Check your bookings page for details
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => navigate("/tickets")}
                className="px-8 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-xl hover:shadow-lg transition-all duration-300 font-bold border border-gray-300"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back
              </button>

              <button
                onClick={book}
                disabled={isExpired || isSoldOut || !user || qty < 1}
                className={`relative overflow-hidden group px-12 py-3 rounded-2xl font-bold text-xl shadow-xl transition-all duration-300 ${
                  isExpired || isSoldOut || !user || qty < 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:shadow-2xl transform hover:-translate-y-1"
                }`}
              >
                <div className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <i className="fas fa-shopping-cart mr-4"></i>
                {!user
                  ? "Login to Book"
                  : isExpired
                  ? "Departure Passed"
                  : isSoldOut
                  ? "Sold Out"
                  : "Book Now"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-t-2 border-gray-200 p-5 text-center text-gray-600 text-sm">
          <i className="fas fa-shield-alt mr-2"></i> Secure booking •
          <i className="fas fa-clock mx-2"></i> 24/7 Support •
          <i className="fas fa-undo mx-2"></i> Free cancellation up to 24h
          before departure
        </div>
      </div>
    </div>
  );
}
