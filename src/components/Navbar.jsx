// Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Navbar() {
  const auth = useAuth() || {}; // prevent undefined
  const { user, logout, loading } = auth;

  if (loading) {
    return (
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-2xl font-bold flex items-center gap-2">
              <span className="inline-block bg-slate-200 rounded-full p-2">
                🚍
              </span>
              <span>TicketBari</span>
            </Link>
          </div>
          <div>Loading...</div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-2xl font-bold flex items-center gap-2">
            <span className="inline-block bg-slate-200 rounded-full p-2">
              🚍
            </span>
            <span>TicketBari</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-4">
          <Link to="/">Home</Link>
          <Link to="/tickets">All Tickets</Link>
          <Link to="/dashboard">Dashboard</Link>
        </nav>

        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <Link to="/login" className="btn">
                Login
              </Link>
              <Link to="/register" className="btn outline">
                Register
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <img
                src={user.photoURL || "https://via.placeholder.com/40"}
                alt="avatar"
                className="w-10 h-10 rounded-full"
              />
              <span>{user.displayName || user.email}</span>
              <button onClick={logout} className="ml-2 btn outline">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
