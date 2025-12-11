import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiRequest } from '../services/api.js';

export default function TicketDetails(){
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState('');

  useEffect(()=>{
    apiRequest('/api/tickets/'+id).then(r=>setTicket(r.data)).catch(()=>{});
  },[id]);

  const book = async () => {
    try{
      await apiRequest('/api/bookings', 'post', { ticketId: id, quantity: qty });
      setMessage('Booking created (pending) — check Dashboard > My Booked Tickets');
    } catch(e){ setMessage(e.response?.data?.message || e.message); }
  };

  if (!ticket) return <div>Loading ...</div>;
  const departurePassed = new Date(ticket.departureAt) < new Date();
  return (
    <div className="max-w-3xl mx-auto bg-white rounded shadow p-6">
      <img src={ticket.image} className="w-full h-64 object-cover rounded" />
      <h2 className="text-2xl font-bold mt-3">{ticket.title}</h2>
      <p>{ticket.from} → {ticket.to}</p>
      <p>Price: {ticket.price}</p>
      <p>Quantity left: {ticket.quantity}</p>
      <p>Departure: {new Date(ticket.departureAt).toLocaleString()}</p>

      <div className="mt-4">
        <input type="number" value={qty} min={1} max={ticket.quantity} onChange={e=>setQty(parseInt(e.target.value||1))} className="input w-32 inline-block" />
        <button className="btn ml-2" onClick={book} disabled={departurePassed || ticket.quantity<=0}>Book Now</button>
      </div>
      {message && <div className="mt-3 text-sm">{message}</div>}
    </div>
  );
}