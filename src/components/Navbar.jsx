// import React, { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext.jsx";

// export default function Navbar() {
//   const auth = useAuth() || {};
//   const { user, logout, loading } = auth;
//   const location = useLocation();
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   // Handle scroll effect
//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 10);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Close mobile menu on route change
//   useEffect(() => {
//     setIsMobileMenuOpen(false);
//   }, [location]);

//   if (loading) {
//     return (
//       <header className="sticky top-0 z-50">
//         <div className="bg-gradient-to-r from-blue-50 via-white to-purple-50 backdrop-blur-lg bg-opacity-95 transition-all duration-300">
//           <div className="container mx-auto px-6 py-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3 animate-pulse">
//                 <div className="w-12 h-12 bg-gradient-to-br from-blue-200 to-purple-200 rounded-2xl"></div>
//                 <div className="h-8 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
//               </div>
//               <div className="flex gap-4">
//                 <div className="h-10 w-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
//                 <div className="h-10 w-24 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg"></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>
//     );
//   }

//   const navItems = [
//     { path: "/", label: "Home", icon: "🏠" },
//     { path: "/tickets", label: "Tickets", icon: "🎫" },
//     { path: "/dashboard", label: "Dashboard", icon: "📊" },
//     { path: "/apply-vendor", label: "Apply-vendor", icon: "ℹ️" },
//     { path: "/Admin-Vendor-Applications", label: "Vendor List", icon: "*" },
//   ];
//   // <div
//   //   className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-2 ${
//   //     theme === "dark"
//   //       ? "bg-gray-800 border border-gray-700"
//   //       : "bg-white border border-gray-200"
//   //   } opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all`}
//   // >
//   //   <Link
//   //     to="/"
//   //     className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
//   //   >
//   //     Home
//   //   </Link>
//   //   {user.role === "vendor" && (
//   //     <Link
//   //       to="/vendor-dashboard"
//   //       className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
//   //     >
//   //       Vendor Dashboard
//   //     </Link>
//   //   )}
//   //   {user.role === "admin" && (
//   //     <Link
//   //       to="/admin-dashboard"
//   //       className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
//   //     >
//   //       Admin Dashboard
//   //     </Link>
//   //   )}
//   //   <button
//   //     onClick={handleLogout}
//   //     className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 text-red-600"
//   //   >
//   //     Logout
//   //   </button>
//   // </div>;

//   return (
//     <>
//       <header
//         className={`sticky top-0 z-50 transition-all duration-500 ${
//           isScrolled ? "shadow-2xl" : ""
//         }`}
//       >
//         <div
//           className={`${
//             isScrolled
//               ? "bg-white/95 backdrop-blur-xl shadow-lg"
//               : "bg-gradient-to-r from-blue-50 via-white to-purple-50"
//           } transition-all duration-500`}
//         >
//           <div className="container mx-auto px-6 py-4">
//             <div className="flex items-center justify-between">
//               {/* Logo */}
//               <Link
//                 to="/"
//                 className="group flex items-center gap-3 transition-transform duration-300 hover:scale-105"
//               >
//                 <div className="relative">
//                   <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:rotate-12">
//                     <span className="text-2xl">🚍</span>
//                   </div>
//                   <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                     TicketBari
//                   </span>
//                   <span className="text-xs text-gray-500 font-medium">
//                     Travel with Confidence
//                   </span>
//                 </div>
//               </Link>

//               {/* Desktop Navigation */}
//               <nav className="hidden lg:flex items-center gap-1">
//                 {navItems.map((item) => (
//                   <Link
//                     key={item.path}
//                     to={item.path}
//                     className={`group relative px-6 py-3 rounded-xl transition-all duration-300 ${
//                       location.pathname === item.path
//                         ? "text-blue-600 font-semibold"
//                         : "text-gray-700 hover:text-blue-600"
//                     }`}
//                   >
//                     <span className="text-lg mr-2">{item.icon}</span>
//                     {item.label}
//                     {location.pathname === item.path && (
//                       <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
//                     )}
//                     <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
//                   </Link>
//                 ))}
//               </nav>

//               {/* Auth Section */}
//               <div className="hidden md:flex items-center gap-4">
//                 {!user ? (
//                   <>
//                     <Link
//                       to="/login"
//                       className="relative px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-0.5 group overflow-hidden"
//                     >
//                       <span className="relative z-10 flex items-center gap-2">
//                         <svg
//                           className="w-5 h-5"
//                           fill="currentColor"
//                           viewBox="0 0 20 20"
//                         >
//                           <path
//                             fillRule="evenodd"
//                             d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
//                             clipRule="evenodd"
//                           />
//                         </svg>
//                         Login
//                       </span>
//                       <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                     </Link>
//                     <Link
//                       to="/register"
//                       className="relative px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-medium shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 transform hover:-translate-y-0.5 group overflow-hidden"
//                     >
//                       <span className="relative z-10 flex items-center gap-2">
//                         <svg
//                           className="w-5 h-5"
//                           fill="currentColor"
//                           viewBox="0 0 20 20"
//                         >
//                           <path
//                             fillRule="evenodd"
//                             d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
//                             clipRule="evenodd"
//                           />
//                         </svg>
//                         Register
//                       </span>
//                       <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                     </Link>
//                   </>
//                 ) : (
//                   <div className="flex items-center gap-4">
//                     <div className="flex flex-col items-end">
//                       <span className="font-semibold text-gray-800">
//                         {user.displayName || user.email.split("@")[0]}
//                       </span>
//                       <span className="text-xs text-gray-500">
//                         Welcome back!
//                       </span>
//                     </div>
//                     <div className="relative group">
//                       <img
//                         src={
//                           user.photoURL ||
//                           `https://ui-avatars.com/api/?name=${
//                             user.displayName || user.email
//                           }&background=random&color=fff&bold=true`
//                         }
//                         alt="Profile"
//                         className="w-12 h-12 rounded-2xl border-2 border-white shadow-lg object-cover transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl"
//                       />
//                       <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
//                     </div>
//                     <div className="relative">
//                       <button
//                         onClick={logout}
//                         className="px-6 py-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-medium shadow hover:shadow-lg hover:from-gray-200 hover:to-gray-300 transition-all duration-300 transform hover:-translate-y-0.5 group overflow-hidden border border-gray-200"
//                       >
//                         <span className="relative z-10 flex items-center gap-2">
//                           <svg
//                             className="w-5 h-5 text-gray-600"
//                             fill="currentColor"
//                             viewBox="0 0 20 20"
//                           >
//                             <path
//                               fillRule="evenodd"
//                               d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
//                               clipRule="evenodd"
//                             />
//                           </svg>
//                           Logout
//                         </span>
//                         <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Mobile Menu Button */}
//               <button
//                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//                 className="md:hidden p-3 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg hover:shadow-xl transition-all duration-300"
//               >
//                 {isMobileMenuOpen ? (
//                   <svg
//                     className="w-6 h-6 text-gray-700"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M6 18L18 6M6 6l12 12"
//                     />
//                   </svg>
//                 ) : (
//                   <svg
//                     className="w-6 h-6 text-gray-700"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M4 6h16M4 12h16M4 18h16"
//                     />
//                   </svg>
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Mobile Menu */}
//           <div
//             className={`md:hidden transition-all duration-500 ease-in-out overflow-hidden ${
//               isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
//             }`}
//           >
//             <div className="container mx-auto px-6 py-4 border-t border-gray-100 bg-white/95 backdrop-blur-lg">
//               <div className="flex flex-col space-y-4">
//                 {navItems.map((item) => (
//                   <Link
//                     key={item.path}
//                     to={item.path}
//                     className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
//                       location.pathname === item.path
//                         ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 font-semibold"
//                         : "text-gray-700 hover:bg-gray-50"
//                     }`}
//                   >
//                     <span className="text-xl">{item.icon}</span>
//                     {item.label}
//                     {location.pathname === item.path && (
//                       <div className="ml-auto w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
//                     )}
//                   </Link>
//                 ))}

//                 <div className="pt-4 border-t border-gray-100">
//                   {!user ? (
//                     <div className="flex flex-col gap-3">
//                       <Link
//                         to="/login"
//                         className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium text-center shadow-lg hover:shadow-xl transition-all duration-300"
//                       >
//                         Login
//                       </Link>
//                       <Link
//                         to="/register"
//                         className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-medium text-center shadow-lg hover:shadow-xl transition-all duration-300"
//                       >
//                         Register
//                       </Link>
//                     </div>
//                   ) : (
//                     <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
//                       <div className="flex items-center gap-3">
//                         <img
//                           src={
//                             user.photoURL ||
//                             `https://ui-avatars.com/api/?name=${
//                               user.displayName || user.email
//                             }&background=random&color=fff&bold=true`
//                           }
//                           alt="Profile"
//                           className="w-12 h-12 rounded-2xl border-2 border-white shadow"
//                         />
//                         <div>
//                           <p className="font-semibold text-gray-800">
//                             {user.displayName || user.email}
//                           </p>
//                           <p className="text-sm text-gray-600">Logged in</p>
//                         </div>
//                       </div>
//                       <button
//                         onClick={logout}
//                         className="px-4 py-2 rounded-lg bg-white text-gray-700 shadow hover:shadow-lg transition-all duration-300 border border-gray-200"
//                       >
//                         Logout
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Decorative floating elements */}
//       {!isScrolled && (
//         <>
//           <div className="fixed top-4 left-1/4 w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-lg opacity-20 animate-pulse"></div>
//           <div
//             className="fixed top-6 right-1/3 w-3 h-3 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full blur-lg opacity-30 animate-pulse"
//             style={{ animationDelay: "1s" }}
//           ></div>
//           <div
//             className="fixed top-12 left-1/3 w-2 h-2 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full blur-lg opacity-40 animate-pulse"
//             style={{ animationDelay: "2s" }}
//           ></div>
//         </>
//       )}
//     </>
//   );
// }
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Navbar() {
  const auth = useAuth() || {};
  const { user, logout, loading } = auth;
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [location]);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileMenuOpen && !event.target.closest('.profile-menu-container')) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileMenuOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Base navigation items for all users
  const baseNavItems = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/tickets", label: "Tickets", icon: "🎫" },
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
  ];

  // Add vendor application link for non-vendor users
  const vendorNavItem = user?.role !== "vendor" && user?.role !== "admin"
    ? { path: "/apply-vendor", label: "Become a Vendor", icon: "🏪" }
    : null;

  // Add admin link for admin users
  const adminNavItem = user?.role === "admin"
    ? { path: "/admin", label: "Admin Panel", icon: "👑" }
    : null;

  // Combine all navigation items
  const navItems = [
    ...baseNavItems,
    ...(vendorNavItem ? [vendorNavItem] : []),
    ...(adminNavItem ? [adminNavItem] : []),
  ];

  if (loading) {
    return (
      <header className="sticky top-0 z-50">
        <div className="bg-gradient-to-r from-blue-50 via-white to-purple-50 backdrop-blur-lg bg-opacity-95 transition-all duration-300">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 animate-pulse">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-200 to-purple-200 rounded-2xl"></div>
                <div className="h-8 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
              </div>
              <div className="flex gap-4">
                <div className="h-10 w-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
                <div className="h-10 w-24 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  const getUserRoleBadge = () => {
    if (!user?.role) return null;
    
    const roleConfig = {
      admin: { color: "bg-red-100 text-red-800", label: "Admin", icon: "👑" },
      vendor: { color: "bg-green-100 text-green-800", label: "Vendor", icon: "🏪" },
      user: { color: "bg-blue-100 text-blue-800", label: "User", icon: "👤" },
    };
    
    const config = roleConfig[user.role];
    if (!config) return null;
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${config.color} flex items-center gap-1`}>
        <span>{config.icon}</span>
        {config.label}
      </span>
    );
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          isScrolled ? "shadow-2xl" : ""
        }`}
      >
        <div
          className={`${
            isScrolled
              ? "bg-white/95 backdrop-blur-xl shadow-lg"
              : "bg-gradient-to-r from-blue-50 via-white to-purple-50"
          } transition-all duration-500`}
        >
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link
                to="/"
                className="group flex items-center gap-3 transition-transform duration-300 hover:scale-105"
              >
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:rotate-12">
                    <span className="text-2xl">🚍</span>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    TicketBari
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    Travel with Confidence
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`group relative px-6 py-3 rounded-xl transition-all duration-300 ${
                      location.pathname === item.path
                        ? "text-blue-600 font-semibold"
                        : "text-gray-700 hover:text-blue-600"
                    }`}
                  >
                    <span className="text-lg mr-2">{item.icon}</span>
                    {item.label}
                    {location.pathname === item.path && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  </Link>
                ))}
              </nav>

              {/* Auth Section */}
              <div className="hidden md:flex items-center gap-4">
                {!user ? (
                  <>
                    <Link
                      to="/login"
                      className="relative px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-0.5 group overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Login
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Link>
                    <Link
                      to="/register"
                      className="relative px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-medium shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 transform hover:-translate-y-0.5 group overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Register
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Link>
                  </>
                ) : (
                  <div className="flex items-center gap-4 profile-menu-container">
                    {/* User info with role badge */}
                    <div className="flex flex-col items-end">
                      <span className="font-semibold text-gray-800">
                        {user.displayName || user.email?.split("@")[0]}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        {getUserRoleBadge()}
                      </div>
                    </div>
                    
                    {/* Profile dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                        className="relative group"
                      >
                        <img
                          src={
                            user.photoURL ||
                            `https://ui-avatars.com/api/?name=${
                              user.displayName || user.email
                            }&background=random&color=fff&bold=true`
                          }
                          alt="Profile"
                          className="w-12 h-12 rounded-2xl border-2 border-white shadow-lg object-cover transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl"
                        />
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
                      </button>

                      {/* Profile Dropdown Menu */}
                      {isProfileMenuOpen && (
                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
                          <div className="px-4 py-3 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  user.photoURL ||
                                  `https://ui-avatars.com/api/?name=${
                                    user.displayName || user.email
                                  }&background=random&color=fff&bold=true`
                                }
                                alt="Profile"
                                className="w-10 h-10 rounded-xl"
                              />
                              <div>
                                <p className="font-semibold text-gray-800">
                                  {user.displayName || user.email?.split("@")[0]}
                                </p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                              </div>
                            </div>
                          </div>

                          <div className="py-2">
                            <Link
                              to="/dashboard"
                              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                              onClick={() => setIsProfileMenuOpen(false)}
                            >
                              <span className="text-lg">📊</span>
                              <span>Dashboard</span>
                            </Link>

                            <Link
                              to="/user/profile"
                              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                              onClick={() => setIsProfileMenuOpen(false)}
                            >
                              <span className="text-lg">👤</span>
                              <span>My Profile</span>
                            </Link>

                            <Link
                              to="/my-bookings"
                              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                              onClick={() => setIsProfileMenuOpen(false)}
                            >
                              <span className="text-lg">🎫</span>
                              <span>My Bookings</span>
                            </Link>

                            {/* Vendor specific links */}
                            {user.role === "vendor" && (
                              <Link
                                to="/vendor/dashboard"
                                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                                onClick={() => setIsProfileMenuOpen(false)}
                              >
                                <span className="text-lg">🏪</span>
                                <span>Vendor Dashboard</span>
                              </Link>
                            )}

                            {/* Admin specific links */}
                            {user.role === "admin" && (
                              <>
                                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                  Admin Panel
                                </div>
                                <Link
                                  to="/admin"
                                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                                  onClick={() => setIsProfileMenuOpen(false)}
                                >
                                  <span className="text-lg">👑</span>
                                  <span>Admin Dashboard</span>
                                </Link>
                                <Link
                                  to="/admin/vendor-applications"
                                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                                  onClick={() => setIsProfileMenuOpen(false)}
                                >
                                  <span className="text-lg">📋</span>
                                  <span>Vendor Applications</span>
                                </Link>
                                <Link
                                  to="/admin/tickets"
                                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                                  onClick={() => setIsProfileMenuOpen(false)}
                                >
                                  <span className="text-lg">✅</span>
                                  <span>Manage Tickets</span>
                                </Link>
                              </>
                            )}
                          </div>

                          <div className="border-t border-gray-100 pt-2">
                            <button
                              onClick={handleLogout}
                              className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                              </svg>
                              <span>Logout</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-3 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isMobileMenuOpen ? (
                  <svg
                    className="w-6 h-6 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`md:hidden transition-all duration-500 ease-in-out overflow-hidden ${
              isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="container mx-auto px-6 py-4 border-t border-gray-100 bg-white/95 backdrop-blur-lg">
              <div className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      location.pathname === item.path
                        ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    {item.label}
                    {location.pathname === item.path && (
                      <div className="ml-auto w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                    )}
                  </Link>
                ))}

                <div className="pt-4 border-t border-gray-100">
                  {!user ? (
                    <div className="flex flex-col gap-3">
                      <Link
                        to="/login"
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium text-center shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-medium text-center shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Register
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              user.photoURL ||
                              `https://ui-avatars.com/api/?name=${
                                user.displayName || user.email
                              }&background=random&color=fff&bold=true`
                            }
                            alt="Profile"
                            className="w-12 h-12 rounded-2xl border-2 border-white shadow"
                          />
                          <div>
                            <p className="font-semibold text-gray-800">
                              {user.displayName || user.email}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {getUserRoleBadge()}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Mobile User Menu */}
                      <div className="space-y-2">
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-xl"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <span className="text-lg">📊</span>
                          <span>Dashboard</span>
                        </Link>

                        <Link
                          to="/user/profile"
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-xl"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <span className="text-lg">👤</span>
                          <span>My Profile</span>
                        </Link>

                        {user.role === "vendor" && (
                          <Link
                            to="/vendor/dashboard"
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-50 rounded-xl"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <span className="text-lg">🏪</span>
                            <span>Vendor Dashboard</span>
                          </Link>
                        )}

                        {user.role === "admin" && (
                          <>
                            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                              Admin Panel
                            </div>
                            <Link
                              to="/admin"
                              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 rounded-xl"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <span className="text-lg">👑</span>
                              <span>Admin Dashboard</span>
                            </Link>
                            <Link
                              to="/admin/vendor-applications"
                              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 rounded-xl"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <span className="text-lg">📋</span>
                              <span>Vendor Applications</span>
                            </Link>
                            <Link
                              to="/admin/tickets"
                              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 rounded-xl"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <span className="text-lg">✅</span>
                              <span>Manage Tickets</span>
                            </Link>
                          </>
                        )}

                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Decorative floating elements */}
      {!isScrolled && (
        <>
          <div className="fixed top-4 left-1/4 w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-lg opacity-20 animate-pulse"></div>
          <div
            className="fixed top-6 right-1/3 w-3 h-3 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full blur-lg opacity-30 animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="fixed top-12 left-1/3 w-2 h-2 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full blur-lg opacity-40 animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </>
      )}
    </>
  );
}