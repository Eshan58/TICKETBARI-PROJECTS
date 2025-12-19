import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const DebugAuth = () => {
  const { user, debugAuth } = useAuth();
  const [authCheck, setAuthCheck] = useState(null);
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);

  const runAuthCheck = async () => {
    setLoading(true);
    try {
      const response = await api.checkAuthStatus();
      setAuthCheck(response.data);
      // console.log("🔍 Auth Check Result:", response.data);
    } catch (error) {
      console.error("❌ Auth Check Error:", error);
      setAuthCheck({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const getDebugInfo = async () => {
    const info = await debugAuth();
    setDebugInfo(info);
    // console.log("🔍 Debug Info:", info);
  };

  const forceAdmin = async () => {
    setLoading(true);
    try {
      const response = await api.makeMeAdmin();
      alert(response.data.message);
      // console.log("👑 Admin force result:", response.data);
    } catch (error) {
      console.error("❌ Force admin error:", error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const testBackend = async () => {
    setLoading(true);
    try {
      const result = await api.testBackendConnection();
      alert(`Backend: ${result.success ? 'Connected' : 'Disconnected'}\n${result.message}`);
    } catch (error) {
      alert("Test failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Auth Debug Tool</h1>
      
      {/* Current User Info */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">Current User (Frontend)</h2>
        {user ? (
          <div className="space-y-2">
            <div className="flex items-center gap-4 mb-3">
              {user.photoURL && (
                <img src={user.photoURL} alt="Profile" className="w-12 h-12 rounded-full" />
              )}
              <div>
                <p className="font-medium">{user.name || user.email}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                  user.role === 'admin' ? 'bg-red-100 text-red-800' :
                  user.role === 'vendor' ? 'bg-green-100 text-green-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {user.role || 'no role'}
                </span>
                {user.isLocalUser && (
                  <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                    Local User
                  </span>
                )}
              </div>
            </div>
            <pre className="text-sm bg-gray-50 p-3 rounded overflow-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        ) : (
          <p className="text-gray-500">No user logged in</p>
        )}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={getDebugInfo}
          disabled={loading}
          className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          Get Firebase Info
        </button>
        
        <button
          onClick={runAuthCheck}
          disabled={loading}
          className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
        >
          {loading ? "Checking..." : "Run Backend Auth Check"}
        </button>
        
        <button
          onClick={forceAdmin}
          disabled={loading || !user}
          className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
        >
          Force Make Me Admin
        </button>
        
        <button
          onClick={testBackend}
          disabled={loading}
          className="px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 transition-colors"
        >
          Test Backend Connection
        </button>
      </div>

      {/* Debug Info Display */}
      {debugInfo && (
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6">
          <h2 className="font-semibold mb-2 text-yellow-800">Firebase Debug Info</h2>
          <pre className="text-sm overflow-auto">{JSON.stringify(debugInfo, null, 2)}</pre>
        </div>
      )}

      {authCheck && (
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h2 className="font-semibold mb-2 text-green-800">Backend Auth Check Result</h2>
          <pre className="text-sm overflow-auto">{JSON.stringify(authCheck, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default DebugAuth;