// import React from "react";
// import { Link } from "react-router-dom";

// export default function Footer() {
//   return (
//     <footer className="bg-slate-900 text-white mt-8">
//       <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
//         <div>
//           <div className="text-2xl font-bold flex items-center gap-2">
//             🚍 TicketBari
//           </div>
//           <p className="mt-2 text-sm">
//             Book bus, train, launch & flight tickets easily
//           </p>
//         </div>
//         <div>
//           <h4 className="font-semibold">Quick Links</h4>
//           <ul className="mt-2 space-y-1 text-sm">
//             <li>
//               <Link to="/">Home</Link>
//             </li>
//             <li>
//               <Link to="/tickets">All Tickets</Link>
//             </li>
//             <li>
//               <Link to="/contact">Contact Us</Link>
//             </li>
//             <li>
//               <Link to="/about">About</Link>
//             </li>
//           </ul>
//         </div>
//         <div>
//           <h4 className="font-semibold">Contact</h4>
//           <p className="mt-2 text-sm">support@ticketbari.example</p>
//           <p className="text-sm">+880 1XXXXXXXXX</p>
//         </div>
//         <div>
//           <h4 className="font-semibold">Payment</h4>
//           <p className="mt-2 text-sm">Stripe</p>
//         </div>
//       </div>
//       <div className="bg-slate-800 text-center text-sm py-2">
//         © 2025 TicketBari. All rights reserved.
//       </div>
//     </footer>
//   );
// }
import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/tickets", label: "Tickets", icon: "🎫" },
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/contact", label: "Contact", icon: "📞" },
    { path: "/about", label: "About", icon: "ℹ️" },
    { path: "/faq", label: "FAQ", icon: "❓" },
  ];

  const services = [
    { name: "Bus Tickets", icon: "🚌" },
    { name: "Train Tickets", icon: "🚆" },
    { name: "Launch Tickets", icon: "🚤" },
    { name: "Flight Tickets", icon: "✈️" },
  ];

  const paymentMethods = [
    { name: "Stripe", icon: "💳", color: "from-blue-500 to-blue-600" },
    { name: "Visa", icon: "💳", color: "from-blue-400 to-blue-500" },
    { name: "Mastercard", icon: "💳", color: "from-red-500 to-orange-500" },
    { name: "PayPal", icon: "💰", color: "from-blue-300 to-blue-400" },
    { name: "bKash", icon: "📱", color: "from-pink-500 to-pink-600" },
  ];

  const socialLinks = [
    { platform: "Facebook", icon: "📘", link: "#", color: "hover:bg-blue-600" },
    { platform: "Twitter", icon: "🐦", link: "#", color: "hover:bg-blue-400" },
    {
      platform: "Instagram",
      icon: "📷",
      link: "#",
      color: "hover:bg-gradient-to-r from-purple-600 to-pink-600",
    },
    { platform: "LinkedIn", icon: "💼", link: "#", color: "hover:bg-blue-700" },
    { platform: "YouTube", icon: "📺", link: "#", color: "hover:bg-red-600" },
  ];

  return (
    <footer className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-purple-900"></div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-400/5 to-purple-400/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Main footer content */}
      <div className="relative z-10">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
            {/* Logo and Description */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:rotate-12">
                    <span className="text-3xl">🚍</span>
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                    TicketBari
                  </h2>
                  <p className="text-sm text-gray-400">
                    Travel with Confidence
                  </p>
                </div>
              </div>

              <p className="text-gray-300 leading-relaxed">
                Your trusted partner for seamless travel experiences. Book bus,
                train, launch & flight tickets with just a few clicks.
                Experience convenience, security, and reliability.
              </p>

              {/* Newsletter Subscription */}
              <div className="space-y-3">
                <h4 className="font-semibold text-white">Stay Updated</h4>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 transition-all duration-300"
                  />
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xl font-bold text-white mb-6 pb-2 border-b border-gray-800/50 relative inline-block">
                Quick Links
                <span className="absolute bottom-0 left-0 w-1/3 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></span>
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="group flex items-center gap-3 text-gray-300 hover:text-white py-2 transition-all duration-300 hover:translate-x-2"
                    >
                      <span className="text-lg group-hover:scale-125 transition-transform duration-300">
                        {item.icon}
                      </span>
                      <span className="relative">
                        {item.label}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-xl font-bold text-white mb-6 pb-2 border-b border-gray-800/50 relative inline-block">
                Our Services
                <span className="absolute bottom-0 left-0 w-1/3 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"></span>
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {services.map((service, index) => (
                  <div
                    key={service.name}
                    className="group p-4 bg-gray-800/30 backdrop-blur-sm rounded-xl hover:bg-gray-800/50 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 hover:scale-105 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl group-hover:rotate-12 transition-transform duration-300">
                        {service.icon}
                      </div>
                      <span className="text-sm font-medium text-gray-300 group-hover:text-white">
                        {service.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact Info */}
              <div className="mt-8 space-y-3">
                <h5 className="font-semibold text-white">Contact Us</h5>
                <a
                  href="mailto:support@ticketbari.example"
                  className="flex items-center gap-3 text-gray-300 hover:text-blue-400 transition-colors duration-300 group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-lg">📧</span>
                  </div>
                  <div>
                    <p className="text-sm">support@ticketbari.example</p>
                    <p className="text-xs text-gray-500">24/7 Support</p>
                  </div>
                </a>
                <a
                  href="tel:+8801XXXXXXXXX"
                  className="flex items-center gap-3 text-gray-300 hover:text-green-400 transition-colors duration-300 group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-lg">📱</span>
                  </div>
                  <div>
                    <p className="text-sm">+880 1XXX-XXXXXX</p>
                    <p className="text-xs text-gray-500">Call us anytime</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Payment & Social */}
            <div>
              <h4 className="text-xl font-bold text-white mb-6 pb-2 border-b border-gray-800/50 relative inline-block">
                Payment Methods
                <span className="absolute bottom-0 left-0 w-1/3 h-0.5 bg-gradient-to-r from-green-500 to-blue-500"></span>
              </h4>
              <div className="flex flex-wrap gap-3 mb-8">
                {paymentMethods.map((method) => (
                  <div
                    key={method.name}
                    className={`group relative p-3 bg-gradient-to-br ${method.color} rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">{method.icon}</div>
                      <p className="text-xs font-semibold text-white">
                        {method.name}
                      </p>
                    </div>
                    <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                ))}
              </div>

              <h4 className="text-xl font-bold text-white mb-6 pb-2 border-b border-gray-800/50 relative inline-block">
                Follow Us
                <span className="absolute bottom-0 left-0 w-1/3 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500"></span>
              </h4>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.platform}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group w-12 h-12 bg-gray-800/50 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${social.color}`}
                  >
                    <span className="text-xl group-hover:scale-125 transition-transform duration-300">
                      {social.icon}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative flex justify-center">
              <div className="px-4 bg-gray-900">
                <div className="w-32 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-gray-400 text-sm">
              © {currentYear} TicketBari. All rights reserved.
            </div>

            <div className="flex items-center gap-6 text-sm">
              <Link
                to="/privacy"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                Terms of Service
              </Link>
              <Link
                to="/cookies"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                Cookie Policy
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400">All systems operational</span>
              </div>
            </div>
          </div>

          {/* Back to top button */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 hover:-translate-y-1 flex items-center justify-center z-50"
            aria-label="Back to top"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}
