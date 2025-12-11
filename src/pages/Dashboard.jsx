import React from "react";

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <aside className="md:col-span-1 bg-white rounded p-4 shadow">
        Sidebar (Profile / Links)
      </aside>
      <section className="md:col-span-3 bg-white rounded p-4 shadow">
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <p>
          Routes: Profile, My Booked Tickets, Transaction History, Vendor and
          Admin panels as applicable.
        </p>
      </section>
    </div>
  );
}
