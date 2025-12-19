import React, { useState, useEffect } from "react";
import api from "../../services/api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    vendors: 0,
    regularUsers: 0,
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.getAdminUsers({
        role: filter === "all" ? "" : filter,
        search: searchTerm || "",
      });
      
      if (response.data?.success) {
        setUsers(response.data.data?.users || []);
        setStats(response.data.data?.stats || stats);
      } else {
        console.error("Failed to fetch users:", response.data?.message);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      // Fallback mock data for testing
      setUsers([
        {
          _id: "1",
          uid: "mRE1Thz7yAb0cEMUgoGGzTzdokk2",
          name: "Ashan Mahdi",
          email: "mahdiashan9@gmail.com",
          photoURL: "https://lh3.googleusercontent.com/a/ACg8ocLKvZA21Ur8e7LSwQQAWd83N2LZyP7e26OQPQZuu38invMRtxzU=s96-c",
          role: "admin",
          createdAt: "2025-12-10T18:37:05.071Z",
          updatedAt: "2025-12-16T13:39:51.290Z"
        },
        {
          _id: "2",
          uid: "user2",
          name: "John Doe",
          email: "john@example.com",
          photoURL: "",
          role: "user",
          createdAt: "2025-12-15T10:00:00.000Z",
          updatedAt: "2025-12-15T10:00:00.000Z"
        },
        {
          _id: "3",
          uid: "user3",
          name: "Jane Smith",
          email: "jane@example.com",
          photoURL: "",
          role: "vendor",
          createdAt: "2025-12-14T09:00:00.000Z",
          updatedAt: "2025-12-14T09:00:00.000Z"
        }
      ]);
      setStats({
        total: 3,
        admins: 1,
        vendors: 1,
        regularUsers: 1,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filter, searchTerm]);

  const handleRoleChange = async (userId, newRole) => {
    if (!window.confirm(`Change user role to ${newRole}?`)) {
      return;
    }

    try {
      const response = await api.updateUserRole(userId, newRole);
      
      if (response.data?.success) {
        alert("User role updated successfully");
        fetchUsers(); // Refresh the list
      } else {
        alert(response.data?.message || "Failed to update user role");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Failed to update user role. Please try again.");
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin": return "bg-red-100 text-red-800";
      case "vendor": return "bg-purple-100 text-purple-800";
      case "user": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Invalid Date";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-2">Manage users, roles, and permissions</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search users by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg transition-colors ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("user")}
              className={`px-4 py-2 rounded-lg transition-colors ${filter === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              Users
            </button>
            <button
              onClick={() => setFilter("vendor")}
              className={`px-4 py-2 rounded-lg transition-colors ${filter === "vendor" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              Vendors
            </button>
            <button
              onClick={() => setFilter("admin")}
              className={`px-4 py-2 rounded-lg transition-colors ${filter === "admin" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              Admins
            </button>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-sm text-gray-500">Total Users</div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-sm text-gray-500">Regular Users</div>
          <div className="text-2xl font-bold text-blue-600">{stats.regularUsers}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-sm text-gray-500">Vendors</div>
          <div className="text-2xl font-bold text-purple-600">{stats.vendors}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-sm text-gray-500">Admins</div>
          <div className="text-2xl font-bold text-red-600">{stats.admins}</div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
            <p className="mt-3 text-gray-600">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Users Found</h3>
            <p className="text-gray-500">No users match the current filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Account Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={user.photoURL || `https://ui-avatars.com/api/?name=${user.name || user.email}&background=random&color=fff`}
                            alt={user.name || "User"}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name || "Unnamed User"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(user.role)}`}>
                        {user.role?.toUpperCase() || "USER"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <select
                          value={user.role || "user"}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="user">User</option>
                          <option value="vendor">Vendor</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button
                          className="text-blue-600 hover:text-blue-900 text-sm px-2 py-1 hover:bg-blue-50 rounded"
                          onClick={() => alert(`Viewing profile for: ${user.email}`)}
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Summary */}
        {!loading && users.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{users.length}</span> of{" "}
              <span className="font-medium">{stats.total}</span> users
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;