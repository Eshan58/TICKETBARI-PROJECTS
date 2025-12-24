import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TbCurrencyTaka } from "react-icons/tb";
import { 
  FaArrowLeft, 
  FaCalendarAlt, 
  FaClock, 
  FaUser, 
  FaTicketAlt,
  FaPrint,
  FaDownload,
  FaCheckCircle,
  FaCreditCard,
  FaQrcode,
  FaMapMarkerAlt,
  FaPlane,
  FaExclamationTriangle,
  FaSyncAlt
} from 'react-icons/fa';
import api from "../services/api";

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data for demonstration
  const mockBooking = {
    _id: id || "1",
    bookingReference: "TB-1765726189204-2",
    ticketTitle: "Flight to Chittagong",
    createdAt: "2025-12-14T21:29:00Z",
    quantity: 2,
    totalPrice: 9000.00,
    status: "paid",
    paymentMethod: "bkash",
    transactionId: "TRX123456789",
    paidAt: "2025-12-14T21:35:00Z",
    passengers: [
      { name: "Eshan Islam", seat: "12A", passport: "AB1234567" },
      { name: "Sarah Khan", seat: "12B", passport: "CD7890123" }
    ],
    ticketId: {
      departureAt: "2025-12-15T08:00:00Z",
      arrivalAt: "2025-12-15T09:30:00Z",
      from: "Dhaka (DAC)",
      to: "Chittagong (CGP)",
      airline: "Bangladesh Airlines",
      flightNo: "BG-203",
      aircraft: "Boeing 737-800",
      gate: "A12",
      terminal: "Terminal 1",
      checkInCounter: "Counter 5-8",
      baggageAllowance: "20kg",
      cabinClass: "Economy",
      duration: "1h 30m"
    }
  };

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use smart function that tries multiple endpoints
      const response = await api.smartGetBookingById(id);
      
      // Handle different response structures
      if (response.data?.success) {
        const data = response.data.data;
        // Handle different structures
        if (data?.booking) {
          setBooking(data.booking); // { success: true, data: { booking: {...} } }
        } else if (data) {
          setBooking(data); // { success: true, data: {...} }
        } else if (response.data) {
          setBooking(response.data); // { success: true, ...bookingData }
        } else {
          throw new Error("Invalid response structure");
        }
      } else {
        // Direct data (mock or alternative API)
        setBooking(response.data || mockBooking);
      }
      
    } catch (err) {
      console.error("Booking details error:", err);
      setError(err.message || "Failed to load booking details");
      // Fallback to mock data
      setBooking(mockBooking);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchBookingDetails();
  };

  const handlePrintTicket = () => {
    window.print();
  };

  const handleDownloadTicket = () => {
    alert(`Downloading ticket for booking ${booking?.bookingReference || booking?._id}`);
    // In real app: api.downloadTicket(booking._id)
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return { date: 'N/A', time: 'N/A' };
    
    try {
      const date = new Date(dateString);
      return {
        date: date.toLocaleDateString('en-US', { 
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        time: date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      };
    } catch (error) {
      return { date: 'Invalid Date', time: '' };
    }
  };

  // Format short date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  if (loading && !refreshing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Loading booking details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-50 rounded-full mb-6">
              <FaExclamationTriangle className="text-3xl text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Unable to Load Booking</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleRefresh}
                className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/my-bookings')}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to My Bookings
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Safe access to booking data
  const bookingData = booking || mockBooking;
  const departure = formatDateTime(bookingData?.ticketId?.departureAt);
  const arrival = formatDateTime(bookingData?.ticketId?.arrivalAt);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header with Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <button
              onClick={() => navigate('/my-bookings')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 group"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              Back to My Bookings
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">Booking Details</h1>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 text-gray-500 hover:text-gray-700"
                title="Refresh"
              >
                <FaSyncAlt className={`${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <p className="text-gray-600 mt-2">
              Booking Reference: <span className="font-mono font-semibold">{bookingData.bookingReference || `ID: ${bookingData._id?.slice(-6)}`}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handlePrintTicket}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <FaPrint />
              Print Ticket
            </button>
            <button
              onClick={handleDownloadTicket}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <FaDownload />
              Download PDF
            </button>
          </div>
        </div>

        {/* Demo Data Warning */}
        {error && bookingData && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <FaExclamationTriangle className="text-yellow-500 mt-0.5" />
              <div>
                <p className="text-yellow-800 font-medium">Showing Demo Data</p>
                <p className="text-yellow-600 text-sm mt-1">
                  We're showing demo booking details because the server connection failed. Your real booking details will appear when the server is back online.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Booking Status Card */}
        <div className={`rounded-2xl shadow-lg p-6 text-white ${
          bookingData.status === 'paid' ? 'bg-gradient-to-r from-green-500 to-green-600' :
          bookingData.status === 'confirmed' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
          bookingData.status === 'pending' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
          bookingData.status === 'completed' ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
          'bg-gradient-to-r from-gray-500 to-gray-600'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <FaCheckCircle className="text-3xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  Booking {bookingData.status === 'paid' ? 'Confirmed' : 
                  bookingData.status === 'confirmed' ? 'Confirmed' : 
                  bookingData.status?.charAt(0).toUpperCase() + bookingData.status?.slice(1) || 'Unknown'}
                </h2>
                <p className="opacity-90 mt-2">
                  {bookingData.status === 'paid' ? 'Your flight ticket has been issued successfully' :
                   bookingData.status === 'confirmed' ? 'Your booking is confirmed. Please complete payment.' :
                   bookingData.status === 'pending' ? 'Your booking is pending confirmation' :
                   bookingData.status === 'completed' ? 'Your journey has been completed' :
                   'Booking status: ' + (bookingData.status || 'unknown')}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold flex items-center justify-end">
                <TbCurrencyTaka className="mr-2" />
                {(bookingData.totalPrice || 0).toFixed(2)}
              </div>
              <p className="opacity-90 mt-1">Total Amount {bookingData.status === 'paid' ? 'Paid' : 'Due'}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Flight Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Flight Information */}
            <div className="bg-white rounded-2xl shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FaTicketAlt className="text-blue-600" />
                  Flight Information
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {/* Flight Route */}
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{bookingData.ticketId?.from?.split(' ')[0] || 'Departure'}</div>
                      <div className="text-sm text-gray-500">{bookingData.ticketId?.from || 'Not specified'}</div>
                      <div className="mt-2 text-lg font-semibold">{departure.time}</div>
                      <div className="text-sm text-gray-500">{departure.date}</div>
                    </div>
                    
                    <div className="flex-1 px-8">
                      <div className="relative">
                        <div className="h-1 bg-gray-300 rounded-full"></div>
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-blue-600 rounded-full"></div>
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-green-600 rounded-full"></div>
                        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <FaPlane className="text-blue-600 text-xl" />
                        </div>
                      </div>
                      <div className="text-center mt-2 text-sm text-gray-500">
                        Duration: {bookingData.ticketId?.duration || 'N/A'}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{bookingData.ticketId?.to?.split(' ')[0] || 'Arrival'}</div>
                      <div className="text-sm text-gray-500">{bookingData.ticketId?.to || 'Not specified'}</div>
                      <div className="mt-2 text-lg font-semibold">{arrival.time}</div>
                      <div className="text-sm text-gray-500">{arrival.date}</div>
                    </div>
                  </div>

                  {/* Flight Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Flight Number</p>
                      <p className="font-semibold">{bookingData.ticketId?.flightNo || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Airline</p>
                      <p className="font-semibold">{bookingData.ticketId?.airline || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Aircraft</p>
                      <p className="font-semibold">{bookingData.ticketId?.aircraft || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Class</p>
                      <p className="font-semibold">{bookingData.ticketId?.cabinClass || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Airport Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <FaMapMarkerAlt className="text-blue-600" />
                        Departure Airport
                      </h3>
                      <p className="text-gray-600">Terminal: {bookingData.ticketId?.terminal || 'N/A'}</p>
                      <p className="text-gray-600">Gate: {bookingData.ticketId?.gate || 'N/A'}</p>
                      <p className="text-gray-600">Check-in: {bookingData.ticketId?.checkInCounter || 'N/A'}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <FaMapMarkerAlt className="text-green-600" />
                        Arrival Airport
                      </h3>
                      <p className="text-gray-600">Baggage Claim: Carousel 3</p>
                      <p className="text-gray-600">Ground Transport: Available</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Passengers Information */}
            <div className="bg-white rounded-2xl shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FaUser className="text-blue-600" />
                  Passenger Information
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {bookingData.passengers?.map((passenger, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{passenger.name}</h3>
                          <div className="mt-2 grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Seat Number</p>
                              <p className="font-medium">{passenger.seat || 'Not assigned'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Passport Number</p>
                              <p className="font-medium">{passenger.passport || 'N/A'}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Passenger {index + 1}</div>
                          <div className="mt-2">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                              {bookingData.ticketId?.cabinClass || 'Standard'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!bookingData.passengers || bookingData.passengers.length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                      No passenger information available
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="space-y-8">
            {/* Booking Summary */}
            <div className="bg-white rounded-2xl shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">Booking Summary</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Booking Date</span>
                    <span className="font-semibold">
                      {formatDate(bookingData.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Number of Tickets</span>
                    <span className="font-semibold">{bookingData.quantity || 1}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Baggage Allowance</span>
                    <span className="font-semibold">{bookingData.ticketId?.baggageAllowance || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status</span>
                    <span className={`font-semibold ${
                      bookingData.status === 'paid' ? 'text-green-600' :
                      bookingData.status === 'confirmed' ? 'text-blue-600' :
                      bookingData.status === 'pending' ? 'text-yellow-600' :
                      bookingData.status === 'completed' ? 'text-purple-600' :
                      'text-gray-600'
                    }`}>
                      {(bookingData.status || 'UNKNOWN').toUpperCase()}
                    </span>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total {bookingData.status === 'paid' ? 'Paid' : 'Amount'}</span>
                      <span className="text-2xl font-bold text-gray-900 flex items-center">
                        <TbCurrencyTaka className="mr-1" />
                        {(bookingData.totalPrice || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-2xl shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FaCreditCard className="text-blue-600" />
                  Payment Information
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-semibold capitalize">{bookingData.paymentMethod || 'Not paid'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Transaction ID</span>
                    <span className="font-mono font-semibold">{bookingData.transactionId || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Payment Date</span>
                    <span className="font-semibold">
                      {bookingData.paidAt ? formatDate(bookingData.paidAt) : 'N/A'}
                    </span>
                  </div>
                  {bookingData.status === 'confirmed' && (
                    <button
                      onClick={() => navigate('/payment', { state: { booking: bookingData } })}
                      className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium rounded-lg transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <FaCreditCard />
                      Complete Payment
                    </button>
                  )}
                  {bookingData.status === 'pending' && (
                    <button
                      onClick={() => navigate('/payment', { state: { booking: bookingData } })}
                      className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white font-medium rounded-lg transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <FaCreditCard />
                      Make Payment
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* QR Code for Boarding */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-lg p-6 text-white text-center">
              <h3 className="text-lg font-bold mb-4">Digital Boarding Pass</h3>
              <div className="bg-white p-4 rounded-lg inline-block mb-4">
                <FaQrcode className="text-6xl text-blue-900" />
              </div>
              <p className="text-blue-100 text-sm">
                Show this QR code at the gate for boarding
              </p>
              <div className="mt-4 text-sm space-y-1">
                <p>Booking: {bookingData.bookingReference || 'N/A'}</p>
                <p>Flight: {bookingData.ticketId?.flightNo || 'N/A'}</p>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Important Notes</h3>
              <ul className="text-sm text-yellow-800 space-y-2">
                <li>• Check-in opens 3 hours before departure</li>
                <li>• Boarding closes 30 minutes before departure</li>
                <li>• Bring valid ID and passport for international flights</li>
                <li>• Arrive at the airport at least 2 hours before departure</li>
                <li>• Carry a printed copy of your booking confirmation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Support Information */}
        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <p className="text-gray-600">
            Need help? Contact our customer support at 
            <span className="font-semibold"> support@ticketbari.com</span> or call 
            <span className="font-semibold"> +880 9610-123456</span>
          </p>
          <div className="mt-4 flex justify-center gap-6">
            <button
              onClick={() => navigate('/contact')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Contact Support
            </button>
            <button
              onClick={() => navigate('/faq')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View FAQ
            </button>
            <button
              onClick={() => navigate('/cancellation-policy')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Cancellation Policy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;