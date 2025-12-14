import React from "react";

const AdminBookings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>
        <p className="text-gray-600 mt-2">View and manage all bookings on the platform</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <span className="text-2xl">📅</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Booking Management</h3>
          <p className="text-gray-500 mb-6">This feature is currently under development.</p>
          <div className="space-y-3 text-sm text-gray-600">
            <p>• View all platform bookings</p>
            <p>• Manage booking status</p>
            <p>• Process refunds</p>
            <p>• Generate booking reports</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;