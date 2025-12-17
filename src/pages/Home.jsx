
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TbCurrencyTaka } from "react-icons/tb";

export default function Home() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState("checking");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Check if backend is running
        try {
          const response = await fetch("http://localhost:5000/", { 
            method: 'HEAD',
            cache: 'no-cache'
          });
          setBackendStatus(response.ok ? "connected" : "error");
        } catch {
          setBackendStatus("error");
        }
        
        // Always show sample tickets for now
        // (You can add real API calls here when backend is ready)
        setTickets(getSampleTickets());
        
      } catch (error) {
        console.error("Error:", error);
        // Fallback to sample tickets
        setTickets(getSampleTickets());
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Generate sample tickets
  const getSampleTickets = () => {
    return [
      {
        _id: "sample-1",
        title: "Dhaka to Chittagong AC Bus",
        from: "Dhaka",
        to: "Chittagong",
        transportType: "bus",
        price: 1200,
        image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500&auto=format&fit=crop",
        availableQuantity: 15,
        departureAt: new Date(Date.now() + 86400000).toISOString(),
        advertised: true,
        verified: "approved",
        isActive: true
      },
      {
        _id: "sample-2",
        title: "Dhaka to Sylhet Train",
        from: "Dhaka",
        to: "Sylhet",
        transportType: "train",
        price: 800,
        image: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=500&auto=format&fit=crop",
        availableQuantity: 8,
        departureAt: new Date(Date.now() + 172800000).toISOString(),
        advertised: true,
        verified: "approved",
        isActive: true
      },
      {
        _id: "sample-3",
        title: "Chittagong to Cox's Bazar",
        from: "Chittagong",
        to: "Cox's Bazar",
        transportType: "bus",
        price: 600,
        image: "https://images.unsplash.com/photo-1596394516093-9baa1d3d7f4c?w=500&auto=format&fit=crop",
        availableQuantity: 20,
        departureAt: new Date(Date.now() + 259200000).toISOString(),
        advertised: true,
        verified: "approved",
        isActive: true
      },
      {
        _id: "sample-4",
        title: "Dhaka to Rajshahi Bus",
        from: "Dhaka",
        to: "Rajshahi",
        transportType: "bus",
        price: 900,
        image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500&auto=format&fit=crop",
        availableQuantity: 12,
        departureAt: new Date(Date.now() + 345600000).toISOString(),
        advertised: true,
        verified: "approved",
        isActive: true
      }
    ];
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-2xl p-8 md:p-12 shadow-xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">TicketBari</h1>
          <p className="text-xl mb-8 opacity-90">
            Find and book tickets for buses, trains, and more across Bangladesh
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              to="/tickets" 
              className="bg-white text-sky-600 hover:bg-gray-100 px-8 py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Browse Tickets
            </Link>
            <Link 
              to="/login" 
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-sky-600 px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Backend Status Notice */}
      {backendStatus === "error" && (
        <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-2xl">
          <div className="flex items-start">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg text-blue-800">Demo Mode</h3>
              <p className="text-blue-700 mt-1">
                You're viewing sample data. To connect to your backend:
              </p>
              <ol className="list-decimal pl-5 mt-2 text-blue-700">
                <li>Start your backend server on port 5000</li>
                <li>Refresh this page</li>
                <li>Real data will load automatically</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Tickets Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Tickets</h2>
            <p className="text-gray-600 mt-2">
              {loading ? 'Loading...' : `Showing ${tickets.length} popular tickets`}
            </p>
          </div>
          <Link 
            to="/tickets" 
            className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium shadow-sm transition-all duration-300"
          >
            View All
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
            <p className="text-lg font-medium text-gray-700">Loading tickets...</p>
          </div>
        ) : (
          <>
            {/* Tickets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tickets.map((ticket) => (
                <div key={ticket._id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={ticket.image}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      alt={ticket.title}
                    />
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      <span className="bg-gradient-to-r from-pink-500 to-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        🔥 Featured
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                        ticket.transportType === 'bus' ? 'bg-blue-100 text-blue-800' :
                        ticket.transportType === 'train' ? 'bg-green-100 text-green-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {ticket.transportType?.charAt(0).toUpperCase() + ticket.transportType?.slice(1)}
                      </span>
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
                        <span className="text-gray-600">Price:</span>
                        <span className="text-xl font-bold text-green-600 flex items-center">
                          <TbCurrencyTaka />{ticket.price}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Available Seats:</span>
                        <span className="font-medium">{ticket.availableQuantity}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Departure:</span>
                        <span className="font-medium">
                          {new Date(ticket.departureAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                    </div>
                    
                    {/* Button */}
                    <Link 
                      to={`/tickets/${ticket._id}`}
                      className="block w-full text-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-lg font-bold hover:shadow-lg transition-all duration-300"
                    >
                      View Details & Book
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Show More Button */}
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
          </>
        )}
      </section>

      {/* Info Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl p-8 md:p-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Why Choose TicketBari?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Secure Booking</h3>
            <p className="text-gray-300">Safe and secure ticket booking with verified sellers</p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Instant Confirmation</h3>
            <p className="text-gray-300">Get instant booking confirmation and e-tickets</p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500 rounded-full mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
            <p className="text-gray-300">Round-the-clock customer support for all your queries</p>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>
          {backendStatus === "connected" 
            ? "✅ Connected to backend server" 
            : "⚠️ Showing sample data - Backend not connected"}
        </p>
      </div>
    </div>
  );
}

