import React, { useState, useEffect } from "react";
import { apiGet } from "../../services/api";

const AdminReports = () => {
  const [reportData, setReportData] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    avgBookingValue: 0,
    topRoutes: [],
    userGrowth: [],
    bookingTrends: [],
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchReportData();
  }, [timeRange]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      // This is a mock implementation - replace with actual API calls
      // Example: const response = await apiGet("/api/admin/reports", { period: timeRange });
      
      // Mock data for demonstration
      const mockData = {
        totalRevenue: 12500,
        totalBookings: 342,
        avgBookingValue: 36.55,
        topRoutes: [
          { route: "Dhaka → Chittagong", bookings: 145, revenue: 5200 },
          { route: "Khulna → Sylhet", bookings: 89, revenue: 3200 },
          { route: "Rajshahi → Barisal", bookings: 67, revenue: 2400 },
          { route: "Dhaka → Cox's Bazar", bookings: 41, revenue: 1700 },
        ],
        userGrowth: [
          { month: "Jan", users: 120, growth: 0 },
          { month: "Feb", users: 145, growth: 20.8 },
          { month: "Mar", users: 178, growth: 22.8 },
          { month: "Apr", users: 210, growth: 18.0 },
          { month: "May", users: 256, growth: 21.9 },
          { month: "Jun", users: 298, growth: 16.4 },
        ],
        bookingTrends: [
          { day: "Mon", bookings: 45 },
          { day: "Tue", bookings: 52 },
          { day: "Wed", bookings: 48 },
          { day: "Thu", bookings: 61 },
          { day: "Fri", bookings: 78 },
          { day: "Sat", bookings: 92 },
          { day: "Sun", bookings: 85 },
        ],
      };

      setReportData(mockData);
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-2">Platform performance metrics and insights</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">Time Range:</div>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setTimeRange("week")}
              className={`px-3 py-1 text-sm rounded ${timeRange === "week" ? "bg-white shadow" : "text-gray-600"}`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeRange("month")}
              className={`px-3 py-1 text-sm rounded ${timeRange === "month" ? "bg-white shadow" : "text-gray-600"}`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeRange("quarter")}
              className={`px-3 py-1 text-sm rounded ${timeRange === "quarter" ? "bg-white shadow" : "text-gray-600"}`}
            >
              Quarter
            </button>
            <button
              onClick={() => setTimeRange("year")}
              className={`px-3 py-1 text-sm rounded ${timeRange === "year" ? "bg-white shadow" : "text-gray-600"}`}
            >
              Year
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === "overview"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("revenue")}
              className={`px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === "revenue"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Revenue
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === "users"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === "bookings"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Bookings
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-700">Total Revenue</p>
                      <h3 className="text-3xl font-bold mt-2">{formatCurrency(reportData.totalRevenue)}</h3>
                    </div>
                    <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                      <span className="text-2xl">💰</span>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-blue-600">
                    <span className="flex items-center">
                      <span className="text-green-600">↑ 12.5%</span>
                      <span className="ml-2">from last month</span>
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-700">Total Bookings</p>
                      <h3 className="text-3xl font-bold mt-2">{reportData.totalBookings}</h3>
                    </div>
                    <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📅</span>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-green-600">
                    <span className="flex items-center">
                      <span className="text-green-600">↑ 8.3%</span>
                      <span className="ml-2">from last month</span>
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-700">Avg. Booking Value</p>
                      <h3 className="text-3xl font-bold mt-2">{formatCurrency(reportData.avgBookingValue)}</h3>
                    </div>
                    <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📊</span>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-purple-600">
                    <span className="flex items-center">
                      <span className="text-green-600">↑ 4.2%</span>
                      <span className="ml-2">from last month</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Routes */}
                <div className="bg-white border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Routes</h3>
                  <div className="space-y-4">
                    {reportData.topRoutes.map((route, index) => (
                      <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{route.route}</p>
                          <p className="text-sm text-gray-500">{route.bookings} bookings</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(route.revenue)}</p>
                          <p className="text-sm text-green-600">
                            {((route.revenue / reportData.totalRevenue) * 100).toFixed(1)}% of total
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Booking Trends */}
                <div className="bg-white border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Booking Trends</h3>
                  <div className="space-y-3">
                    {reportData.bookingTrends.map((trend, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">{trend.day}</span>
                          <span className="font-medium">{trend.bookings} bookings</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${(trend.bookings / 100) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Revenue Tab */}
          {activeTab === "revenue" && (
            <div className="space-y-6">
              <div className="bg-white border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-4xl mb-2">📈</div>
                    <p>Revenue charts coming soon</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Transport Type</h3>
                  <div className="space-y-4">
                    {[
                      { type: "Bus", revenue: 5400, percentage: 43 },
                      { type: "Train", revenue: 3800, percentage: 30 },
                      { type: "Launch", revenue: 2200, percentage: 18 },
                      { type: "Plane", revenue: 1100, percentage: 9 },
                    ].map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{item.type}</span>
                          <span className="text-gray-600">{formatCurrency(item.revenue)}</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h3>
                  <div className="space-y-4">
                    {[
                      { month: "Jan", revenue: 3200 },
                      { month: "Feb", revenue: 3800 },
                      { month: "Mar", revenue: 4100 },
                      { month: "Apr", revenue: 3900 },
                      { month: "May", revenue: 4500 },
                      { month: "Jun", revenue: 5200 },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="font-medium">{item.month}</span>
                        <span className="text-gray-600">{formatCurrency(item.revenue)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="bg-white border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
                <div className="space-y-4">
                  {reportData.userGrowth.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{item.month}</p>
                        <p className="text-sm text-gray-500">Total users: {item.users}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${item.growth > 0 ? "text-green-600" : "text-red-600"}`}>
                          {item.growth > 0 ? "↑" : "↓"} {Math.abs(item.growth)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">User Types</h3>
                  <div className="space-y-3">
                    {[
                      { type: "Regular Users", count: 256, color: "bg-blue-500" },
                      { type: "Vendors", count: 42, color: "bg-green-500" },
                      { type: "Admins", count: 3, color: "bg-purple-500" },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 ${item.color} rounded-full mr-2`}></div>
                          <span className="font-medium">{item.type}</span>
                        </div>
                        <span className="text-gray-600">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">New Users This Month</h3>
                  <div className="text-center py-8">
                    <div className="text-4xl font-bold text-blue-600">48</div>
                    <p className="text-gray-600 mt-2">+12 from last month</p>
                  </div>
                </div>

                <div className="bg-white border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Users</h3>
                  <div className="text-center py-8">
                    <div className="text-4xl font-bold text-green-600">189</div>
                    <p className="text-gray-600 mt-2">Active in last 30 days</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === "bookings" && (
            <div className="space-y-6">
              <div className="bg-white border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600">Confirmed</p>
                    <p className="text-2xl font-bold mt-1">287</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600">Pending</p>
                    <p className="text-2xl font-bold mt-1">42</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-yellow-600">Cancelled</p>
                    <p className="text-2xl font-bold mt-1">13</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-purple-600">Completed</p>
                    <p className="text-2xl font-bold mt-1">264</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Peak Booking Hours</h3>
                  <div className="space-y-3">
                    {[
                      { hour: "9 AM - 12 PM", percentage: 35 },
                      { hour: "12 PM - 3 PM", percentage: 25 },
                      { hour: "3 PM - 6 PM", percentage: 20 },
                      { hour: "6 PM - 9 PM", percentage: 15 },
                      { hour: "9 PM - 12 AM", percentage: 5 },
                    ].map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{item.hour}</span>
                          <span className="text-gray-600">{item.percentage}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-orange-500 rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Processing Time</h3>
                  <div className="text-center py-8">
                    <div className="text-4xl font-bold text-blue-600">2.4</div>
                    <p className="text-gray-600 mt-2">minutes per booking</p>
                    <div className="mt-4 text-sm text-green-600">
                      <span className="flex items-center justify-center">
                        <span>↓ 0.8 min from last month</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Export and Actions */}
      <div className="flex justify-between items-center bg-white rounded-xl shadow-sm border p-6">
        <div>
          <h3 className="font-semibold text-gray-900">Report Actions</h3>
          <p className="text-sm text-gray-600 mt-1">Export data or schedule reports</p>
        </div>
        <div className="flex space-x-3">
          <button
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            onClick={() => alert("Export feature coming soon!")}
          >
            Export as CSV
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={() => alert("PDF export coming soon!")}
          >
            Export as PDF
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            onClick={() => fetchReportData()}
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* Info Panel */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600">💡</span>
            </div>
          </div>
          <div className="ml-4">
            <h3 className="font-semibold text-blue-900">Report Insights</h3>
            <p className="text-blue-800 mt-1 text-sm">
              • Peak booking hours are between 9 AM - 12 PM (35% of daily bookings)<br/>
              • Dhaka → Chittagong route generates 41.6% of total revenue<br/>
              • User base has grown by 21.9% this month<br/>
              • Average booking value increased by 4.2% from last month
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;