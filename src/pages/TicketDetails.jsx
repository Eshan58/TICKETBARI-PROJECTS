// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { apiRequest } from "../services/api.js";

// export default function TicketDetails() {
//   const { id } = useParams();
//   const [ticket, setTicket] = useState(null);
//   const [qty, setQty] = useState(1);
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     apiRequest("/api/tickets/" + id)
//       .then((r) => setTicket(r.data))
//       .catch(() => {});
//   }, [id]);

//   const book = async () => {
//     try {
//       await apiRequest("/api/bookings", "post", {
//         ticketId: id,
//         quantity: qty,
//       });
//       setMessage(
//         "Booking created (pending) — check Dashboard > My Booked Tickets"
//       );
//     } catch (e) {
//       setMessage(e.response?.data?.message || e.message);
//     }
//   };

//   if (!ticket) return <div>Loading ...</div>;
//   const departurePassed = new Date(ticket.departureAt) < new Date();
//   return (
//     // <!-- Details Section Only -->
//     <div className="p-8">
//       {/* Title */}
//       <h2 className="text-3xl font-bold text-gray-800 mb-2">{ticket.title}</h2>

//       {/* Route */}
//       <div className="flex items-center justify-center mb-8 relative">
//         {/* Route Line */}
//         <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent -translate-y-1/2 z-0"></div>

//         {/* From Location */}
//         <div className="bg-white px-6 py-4 rounded-2xl shadow-md z-10">
//           <div className="flex items-center">
//             <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl mr-4">
//               <i className="fas fa-plane-departure text-white text-xl"></i>
//             </div>
//             <div>
//               <p className="text-gray-500 text-sm">From</p>
//               <p className="font-bold text-xl text-gray-800">{ticket.from}</p>
//             </div>
//           </div>
//         </div>

//         {/* Arrow */}
//         <div className="mx-6 z-10">
//           <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full">
//             <i className="fas fa-arrow-right text-white text-xl"></i>
//           </div>
//         </div>

//         {/* To Location */}
//         <div className="bg-white px-6 py-4 rounded-2xl shadow-md z-10">
//           <div className="flex items-center">
//             <div>
//               <p className="text-gray-500 text-sm">To</p>
//               <p className="font-bold text-xl text-gray-800">{ticket.to}</p>
//             </div>
//             <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl ml-4">
//               <i className="fas fa-plane-arrival text-white text-xl"></i>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Details Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {/* Departure Time */}
//         <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-xl border border-blue-100 hover:shadow-md transition-shadow duration-300">
//           <div className="flex items-start">
//             <div className="bg-blue-100 p-3 rounded-lg mr-4">
//               <i className="fas fa-clock text-blue-600 text-lg"></i>
//             </div>
//             <div>
//               <p className="text-gray-600 text-sm font-medium mb-1">
//                 Departure
//               </p>
//               <p className="font-bold text-gray-800">
//                 {new Date(ticket.departureAt).toLocaleDateString()}
//               </p>
//               <p className="text-gray-600">
//                 {new Date(ticket.departureAt).toLocaleTimeString([], {
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 })}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Price */}
//         <div className="bg-gradient-to-br from-purple-50 to-white p-5 rounded-xl border border-purple-100 hover:shadow-md transition-shadow duration-300">
//           <div className="flex items-start">
//             <div className="bg-purple-100 p-3 rounded-lg mr-4">
//               <i className="fas fa-dollar-sign text-purple-600 text-lg"></i>
//             </div>
//             <div>
//               <p className="text-gray-600 text-sm font-medium mb-1">Price</p>
//               <div className="flex items-baseline">
//                 <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//                   ${ticket.price}
//                 </span>
//                 <span className="text-gray-500 text-sm ml-1">/ticket</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Quantity */}
//         <div className="bg-gradient-to-br from-amber-50 to-white p-5 rounded-xl border border-amber-100 hover:shadow-md transition-shadow duration-300">
//           <div className="flex items-start">
//             <div className="bg-amber-100 p-3 rounded-lg mr-4">
//               <i className="fas fa-ticket-alt text-amber-600 text-lg"></i>
//             </div>
//             <div>
//               <p className="text-gray-600 text-sm font-medium mb-1">
//                 Available
//               </p>
//               <div className="flex items-center">
//                 <span className="font-bold text-gray-800 text-xl">
//                   {ticket.quantity}
//                 </span>
//                 <div className="ml-3 w-24 bg-gray-200 rounded-full h-2">
//                   <div
//                     className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full"
//                     style={{ width: `${(ticket.quantity / 20) * 100}%` }}
//                   ></div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Status */}
//         <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-300">
//           <div className="flex items-start">
//             <div className="bg-gray-100 p-3 rounded-lg mr-4">
//               <i className="fas fa-info-circle text-gray-600 text-lg"></i>
//             </div>
//             <div>
//               <p className="text-gray-600 text-sm font-medium mb-1">Status</p>
//               <div className="flex items-center">
//                 {departurePassed ? (
//                   <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
//                     <i className="fas fa-ban mr-1.5"></i> Expired
//                   </span>
//                 ) : ticket.quantity <= 0 ? (
//                   <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
//                     <i className="fas fa-times mr-1.5"></i> Sold Out
//                   </span>
//                 ) : (
//                   <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
//                     <i className="fas fa-check mr-1.5"></i> Available
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Booking Controls */}
//       <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-2xl p-6 border border-gray-200 mb-6">
//         <h3 className="font-bold text-xl text-gray-800 mb-6 flex items-center">
//           <i className="fas fa-shopping-cart mr-3 text-purple-600"></i>
//           Book Your Tickets
//         </h3>

//         <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
//           {/* Quantity Selector */}
//           <div className="w-full lg:w-auto">
//             <p className="text-gray-600 mb-3 font-medium">Select Quantity</p>
//             <div className="flex items-center">
//               <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-2 flex items-center">
//                 <button
//                   onClick={() => qty > 1 && setQty(qty - 1)}
//                   className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
//                   type="button"
//                 >
//                   <i className="fas fa-minus"></i>
//                 </button>
//                 <input
//                   type="number"
//                   value={qty}
//                   min="1"
//                   max={ticket.quantity}
//                   onChange={(e) => setQty(parseInt(e.target.value || 1))}
//                   className="w-16 text-center py-2 bg-transparent text-lg font-bold focus:outline-none"
//                 />
//                 <button
//                   onClick={() => qty < ticket.quantity && setQty(qty + 1)}
//                   className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
//                   type="button"
//                 >
//                   <i className="fas fa-plus"></i>
//                 </button>
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm text-gray-500">
//                   Max: <span className="font-semibold">{ticket.quantity}</span>
//                 </p>
//                 <p className="text-xs text-gray-400">
//                   Each ticket: ${ticket.price}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Total Price */}
//           <div className="text-center lg:text-right">
//             <p className="text-gray-600 mb-1 font-medium">Total Amount</p>
//             <div className="flex items-baseline justify-center lg:justify-end">
//               <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//                 ${(qty * ticket.price).toFixed(2)}
//               </span>
//               <span className="text-gray-500 text-sm ml-2">
//                 ({qty} {qty === 1 ? "ticket" : "tickets"})
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Action Area */}
//       <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//         {/* Message Display */}
//         <div className="flex-1 min-w-0">
//           {message && (
//             <div
//               className={`flex items-center p-4 rounded-xl ${
//                 message.includes("Success") || message.includes("success")
//                   ? "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-800"
//                   : message.includes("Error") ||
//                     message.includes("error") ||
//                     message.includes("Sorry")
//                   ? "bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 text-red-800"
//                   : "bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 text-blue-800"
//               }`}
//             >
//               <i
//                 className={`fas ${
//                   message.includes("Success") || message.includes("success")
//                     ? "fa-check-circle text-green-600"
//                     : message.includes("Error") ||
//                       message.includes("error") ||
//                       message.includes("Sorry")
//                     ? "fa-exclamation-circle text-red-600"
//                     : "fa-info-circle text-blue-600"
//                 } text-xl mr-3`}
//               ></i>
//               <span className="font-medium">{message}</span>
//             </div>
//           )}
//         </div>

//         {/* Book Button */}
//         <button
//           onClick={book}
//           disabled={departurePassed || ticket.quantity <= 0}
//           className={`relative overflow-hidden group px-10 py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 ${
//             departurePassed || ticket.quantity <= 0
//               ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//               : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:shadow-xl transform hover:-translate-y-0.5"
//           }`}
//         >
//           <div className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
//           <i className="fas fa-shopping-cart mr-3"></i>
//           {departurePassed
//             ? "Departure Passed"
//             : ticket.quantity <= 0
//             ? "Sold Out"
//             : "Book Now"}
//         </button>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

export default function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState('');
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
      const response = await axios.get(`/api/tickets/${id}`);
      setTicket(response.data);
    } catch (error) {
      console.error('Error fetching ticket:', error);
      setMessage('Error loading ticket details');
    } finally {
      setLoading(false);
    }
  };

  const book = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (departurePassed) {
      setMessage('Cannot book tickets for a departure that has already passed.');
      return;
    }

    if (ticket.quantity <= 0) {
      setMessage('Sorry, all tickets have been sold out.');
      return;
    }

    if (qty > ticket.quantity) {
      setMessage(`Only ${ticket.quantity} tickets available.`);
      return;
    }

    try {
      const response = await axios.post('/api/bookings', {
        ticketId: ticket._id,
        quantity: qty,
        userId: user._id
      });

      setMessage(`Successfully booked ${qty} ticket(s)!`);
      
      // Update ticket quantity
      setTicket(prev => ({
        ...prev,
        quantity: prev.quantity - qty
      }));
      
      // Reset quantity if needed
      if (qty > ticket.quantity - qty) {
        setQty(1);
      }
    } catch (error) {
      console.error('Error booking ticket:', error);
      setMessage(error.response?.data?.message || 'Error booking ticket');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-700">Ticket not found</h2>
        <button 
          onClick={() => navigate('/tickets')}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Browse Tickets
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Image Section */}
        <div className="relative">
          <img 
            src={ticket.image || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'} 
            className="w-full h-80 object-cover" 
            alt={ticket.title} 
          />
          
          {/* Availability Badge */}
          <div className="absolute top-6 right-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2 rounded-full shadow-xl font-bold">
            <i className="fas fa-ticket-alt mr-2"></i>
            {ticket.quantity} tickets left
          </div>
          
          {/* Overlay gradient */}
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-white to-transparent"></div>
        </div>
        
        {/* Content Section */}
        <div className="p-8">
          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{ticket.title}</h1>
          
          {/* Route */}
          <div className="flex items-center justify-center mb-10 relative">
            {/* Route Line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent -translate-y-1/2 z-0"></div>
            
            {/* From Location */}
            <div className="bg-white px-6 py-5 rounded-2xl shadow-lg z-10 border border-blue-100">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl mr-4">
                  <i className="fas fa-plane-departure text-white text-2xl"></i>
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-semibold">From</p>
                  <p className="font-bold text-2xl text-gray-900">{ticket.from}</p>
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
                  <p className="font-bold text-2xl text-gray-900">{ticket.to}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-xl ml-4">
                  <i className="fas fa-plane-arrival text-white text-2xl"></i>
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
                  <i className="fas fa-clock text-blue-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-semibold mb-2">Departure</p>
                  <p className="font-bold text-lg text-gray-900">
                    {new Date(ticket.departureAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    {new Date(ticket.departureAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
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
                  <p className="text-gray-600 text-sm font-semibold mb-2">Price</p>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      ${parseFloat(ticket.price || 0).toFixed(2)}
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
                  <p className="text-gray-600 text-sm font-semibold mb-2">Available</p>
                  <div className="flex items-center">
                    <span className="font-bold text-gray-900 text-2xl">{ticket.quantity}</span>
                    <div className="ml-4 w-32 bg-gray-200 rounded-full h-3">
                      {/* FIXED: Using object for style prop */}
                      <div 
                        className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full" 
                        style={{ 
                          width: `${Math.min(100, (ticket.quantity / (ticket.quantity + 5)) * 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
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
                  <p className="text-gray-600 text-sm font-semibold mb-2">Status</p>
                  <div className="flex items-center">
                    {departurePassed ? (
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-red-100 text-red-800">
                        <i className="fas fa-ban mr-2"></i> Expired
                      </span>
                    ) : ticket.quantity <= 0 ? (
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
          
          {/* Booking Section */}
          <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-2xl p-8 border-2 border-gray-200 mb-8">
            <h3 className="font-bold text-2xl text-gray-900 mb-8 flex items-center">
              <i className="fas fa-shopping-cart mr-4 text-purple-600"></i>
              Book Your Tickets
            </h3>
            
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Quantity Selector */}
              <div className="w-full lg:w-auto">
                <p className="text-gray-700 mb-4 font-semibold text-lg">Select Quantity</p>
                <div className="flex items-center">
                  <div className="bg-white border-2 border-gray-300 rounded-2xl shadow-lg p-3 flex items-center">
                    <button 
                      onClick={() => qty > 1 && setQty(qty - 1)} 
                      className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors text-gray-700"
                      type="button"
                    >
                      <i className="fas fa-minus text-lg"></i>
                    </button>
                    <input 
                      type="number" 
                      value={qty} 
                      min="1" 
                      max={ticket.quantity} 
                      onChange={e => setQty(parseInt(e.target.value) || 1)} 
                      className="w-20 text-center py-3 bg-transparent text-2xl font-bold focus:outline-none"
                    />
                    <button 
                      onClick={() => qty < ticket.quantity && setQty(qty + 1)} 
                      className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors text-gray-700"
                      type="button"
                    >
                      <i className="fas fa-plus text-lg"></i>
                    </button>
                  </div>
                  <div className="ml-6">
                    <p className="text-gray-600">
                      Max: <span className="font-bold text-gray-900">{ticket.quantity}</span>
                    </p>
                    <p className="text-gray-500 text-sm">
                      Each ticket: <span className="font-semibold">${parseFloat(ticket.price || 0).toFixed(2)}</span>
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Total Price */}
              <div className="text-center lg:text-right">
                <p className="text-gray-700 mb-2 font-semibold text-lg">Total Amount</p>
                <div className="flex items-baseline justify-center lg:justify-end">
                  <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    ${(qty * parseFloat(ticket.price || 0)).toFixed(2)}
                  </span>
                  <span className="text-gray-600 text-lg ml-3">
                    ({qty} {qty === 1 ? 'ticket' : 'tickets'})
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Area */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Message Display */}
            <div className="flex-1 min-w-0 w-full">
              {message && (
                <div className={`flex items-center p-5 rounded-2xl ${
                  message.includes('Success') || message.includes('success') 
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 text-green-800' 
                    : message.includes('Error') || message.includes('error') || message.includes('Sorry')
                    ? 'bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 text-red-800'
                    : 'bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 text-blue-800'
                }`}>
                  <i className={`fas ${
                    message.includes('Success') || message.includes('success') 
                      ? 'fa-check-circle text-green-600' 
                      : message.includes('Error') || message.includes('error') || message.includes('Sorry')
                      ? 'fa-exclamation-circle text-red-600'
                      : 'fa-info-circle text-blue-600'
                  } text-2xl mr-4`}></i>
                  <span className="font-semibold text-lg">{message}</span>
                </div>
              )}
            </div>
            
            {/* Book Button */}
            <button 
              onClick={book} 
              disabled={departurePassed || ticket.quantity <= 0}
              className={`relative overflow-hidden group px-12 py-5 rounded-2xl font-bold text-xl shadow-xl transition-all duration-300 ${
                departurePassed || ticket.quantity <= 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:shadow-2xl transform hover:-translate-y-1'
              }`}
            >
              <div className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <i className="fas fa-shopping-cart mr-4"></i>
              {departurePassed ? 'Departure Passed' : ticket.quantity <= 0 ? 'Sold Out' : 'Book Now'}
            </button>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-t-2 border-gray-200 p-5 text-center text-gray-600 text-sm">
          <i className="fas fa-shield-alt mr-2"></i> Secure booking • 
          <i className="fas fa-clock mx-2"></i> 24/7 Support • 
          <i className="fas fa-undo mx-2"></i> Free cancellation up to 24h before departure
        </div>
      </div>
    </div>
  );
}