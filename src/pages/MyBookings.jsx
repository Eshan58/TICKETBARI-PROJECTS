import React from 'react';
import { Link } from 'react-router-dom';

const MyBookings = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Your bookings will appear here.</p>
                <Link to="/dashboard" className="text-blue-600 hover:underline mt-4 inline-block">
                    ← Back to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default MyBookings;