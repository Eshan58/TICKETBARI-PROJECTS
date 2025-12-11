// import React, { useEffect, useState } from "react";
// import { apiRequest } from "../services/api.js";
// import { Link } from "react-router-dom";

// export default function Home() {
//   const [ads, setAds] = useState([]);
//   useEffect(() => {
//     apiRequest("/api/advertised")
//       .then((r) => setAds(r.data))
//       .catch(() => {});
//   }, []);

//   return (
//     <div>
//       <section className="mb-6">
//         <div className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded p-8">
//           <h1 className="text-3xl font-bold">Find and book tickets easily</h1>
//           <p className="mt-2">
//             Book bus, train, launch & flight tickets in minutes.
//           </p>
//         </div>
//       </section>
//       <section>
//         <h2 className="text-xl font-semibold mb-3">Advertisement</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {ads.map((a) => (
//             <div key={a._id} className="bg-white rounded shadow p-4">
//               <img
//                 src={a.image}
//                 className="h-40 w-full object-cover rounded"
//                 alt=""
//               />
//               <h3 className="font-semibold mt-2">{a.title}</h3>
//               <p className="mt-1">
//                 {a.from} → {a.to}
//               </p>
//               <p className="mt-1">Price: {a.price} BDT</p>
//               <Link to={`/tickets/${a._id}`} className="btn mt-3">
//                 See details
//               </Link>
//             </div>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { apiRequest } from "../services/api.js";
import { Link } from "react-router-dom";

export default function Home() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        setLoading(true);
        const response = await apiRequest("/api/advertised");
        setAds(response.data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching ads:", err);
        setError(
          "Unable to load advertisements. Backend server may not be running."
        );
        setAds([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  return (
    <div>
      <section className="mb-6">
        <div className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded p-8">
          <h1 className="text-3xl font-bold">Find and book tickets easily</h1>
          <p className="mt-2">
            Book bus, train, launch & flight tickets in minutes.
          </p>
        </div>
      </section>

      {error && (
        <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded">
          ⚠️ {error}
        </div>
      )}

      <section>
        <h2 className="text-xl font-semibold mb-3">Advertisement</h2>
        {loading ? (
          <div className="text-center py-8">Loading advertisements...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ads.length > 0 ? (
              ads.map((a) => (
                <div key={a._id} className="bg-white rounded shadow p-4">
                  <img
                    src={a.image}
                    className="h-40 w-full object-cover rounded"
                    alt=""
                  />
                  <h3 className="font-semibold mt-2">{a.title}</h3>
                  <p className="mt-1">
                    {a.from} → {a.to}
                  </p>
                  <p className="mt-1">Price: {a.price} BDT</p>
                  <Link to={`/tickets/${a._id}`} className="btn mt-3">
                    See details
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-8 text-gray-500">
                No advertisements available
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
