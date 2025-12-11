import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-8">
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <div className="text-2xl font-bold flex items-center gap-2">
            🚍 TicketBari
          </div>
          <p className="mt-2 text-sm">
            Book bus, train, launch & flight tickets easily
          </p>
        </div>
        <div>
          <h4 className="font-semibold">Quick Links</h4>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/tickets">All Tickets</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Contact</h4>
          <p className="mt-2 text-sm">support@ticketbari.example</p>
          <p className="text-sm">+880 1XXXXXXXXX</p>
        </div>
        <div>
          <h4 className="font-semibold">Payment</h4>
          <p className="mt-2 text-sm">Stripe</p>
        </div>
      </div>
      <div className="bg-slate-800 text-center text-sm py-2">
        © 2025 TicketBari. All rights reserved.
      </div>
    </footer>
  );
}
