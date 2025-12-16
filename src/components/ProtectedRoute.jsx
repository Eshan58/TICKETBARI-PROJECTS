// // components/ProtectedRoute.jsx
// import React from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext.jsx';

// const ProtectedRoute = ({ children, requireAdmin = false }) => {
//   const { user, loading, isAdmin } = useAuth();
//   const location = useLocation();

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//           <p className="mt-4 text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     // Redirect to login but save the attempted location
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   if (requireAdmin && !isAdmin()) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-6xl mb-4">🚫</div>
//           <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
//           <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
//           <a href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
//             Go Back Home
//           </a>
//         </div>
//       </div>
//     );
//   }

//   return children;
// };

// export default ProtectedRoute;
// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login but save the attempted location
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requireAdmin && !isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-4">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don't have administrator privileges to access this page.
          </p>
          <a 
            href="/" 
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back Home
          </a>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;