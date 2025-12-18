import React from 'react';
import { useParams, Link } from 'react-router-dom';

const BookingDetails = () => {
    const { id } = useParams();
    
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Booking Details</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Booking ID: {id}</p>
                <p className="text-gray-600 mt-2">Booking details will appear here.</p>
                <Link to="/my-bookings" className="text-blue-600 hover:underline mt-4 inline-block">
                    ← Back to My Bookings
                </Link>
            </div>
        </div>
    );
};

export default BookingDetails;