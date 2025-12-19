import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function DebugAuth() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testAuth = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('firebaseToken') || 
                   localStorage.getItem('token');
      
      if (!token) {
        setResult('❌ No token found in localStorage');
        return;
      }
      
      setResult('🔍 Testing token...\n');
      
      // Test 1: Server health
      const healthResponse = await fetch('https://ticketbari-project-backend.vercel.app/api/health');
      const healthData = await healthResponse.json();
      setResult(prev => prev + `✅ Server health: ${JSON.stringify(healthData, null, 2)}\n\n`);
      
      // Test 2: Dashboard endpoint with token
      const dashResponse = await fetch('https://ticketbari-project-backend.vercel.app/api/user/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setResult(prev => prev + `📊 Dashboard response status: ${dashResponse.status}\n`);
      
      if (dashResponse.ok) {
        const dashData = await dashResponse.json();
        setResult(prev => prev + `✅ Dashboard data: ${JSON.stringify(dashData, null, 2)}`);
      } else if (dashResponse.status === 401) {
        setResult(prev => prev + '❌ 401 Unauthorized - Token is invalid or expired');
      } else {
        setResult(prev => prev + `❌ Error: ${dashResponse.statusText}`);
      }
      
    } catch (error) {
      setResult(`💥 Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const showLocalStorage = () => {
    const allItems = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      // Hide full tokens for security
      if (key.includes('token') || key.includes('Token')) {
        allItems[key] = value ? `${value.substring(0, 30)}... (${value.length} chars)` : 'empty';
      } else {
        allItems[key] = value;
      }
    }
    setResult(JSON.stringify(allItems, null, 2));
  };

  const clearTokens = () => {
    localStorage.removeItem('firebaseToken');
    localStorage.removeItem('token');
    localStorage.removeItem('idToken');
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('firebaseToken');
    sessionStorage.removeItem('authToken');
    setResult('🗑️ All tokens cleared from storage');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🔐 Authentication Debugger</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button 
                onClick={testAuth}
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium disabled:opacity-50"
              >
                {loading ? 'Testing...' : '🔍 Test Authentication'}
              </button>
              
              <button 
                onClick={showLocalStorage}
                className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium"
              >
                📦 Show LocalStorage
              </button>
              
              <button 
                onClick={clearTokens}
                className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium"
              >
                🗑️ Clear All Tokens
              </button>
              
              <Link 
                to="/login"
                className="block w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium text-center"
              >
                🔑 Go to Login
              </Link>
              
              <Link 
                to="/dashboard"
                className="block w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium text-center"
              >
                📊 Go to Dashboard
              </Link>
            </div>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Token Status</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Firebase Token:</p>
                <p className="font-mono text-sm break-all">
                  {localStorage.getItem('firebaseToken') 
                    ? `✅ Present (${localStorage.getItem('firebaseToken').length} chars)`
                    : '❌ Not found'}
                </p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm">Server Status:</p>
                <p className="text-sm">
                  <a href="https://ticketbari-project-backend.vercel.app/api/health" target="_blank" rel="noopener noreferrer" 
                     className="text-blue-400 hover:text-blue-300">
                    https://ticketbari-project-backend.vercel.app/api/health
                  </a>
                </p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm">Dashboard Endpoint:</p>
                <p className="text-sm">
                  <a href="https://ticketbari-project-backend.vercel.app/api/user/dashboard" target="_blank" rel="noopener noreferrer"
                     className="text-blue-400 hover:text-blue-300">
                    https://ticketbari-project-backend.vercel.app/api/user/dashboard
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {result && (
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Results</h2>
            <pre className="bg-black p-4 rounded-lg overflow-auto text-green-400 font-mono text-sm">
              {result}
            </pre>
          </div>
        )}
        
        <div className="mt-8 p-6 bg-gray-800 rounded-xl">
          <h3 className="text-lg font-semibold mb-3">Debug Instructions</h3>
          <ol className="list-decimal pl-5 space-y-2 text-gray-300">
            <li>Login using email/password or Google</li>
            <li>Check if token is saved to localStorage (should see "Firebase Token: ✅ Present")</li>
            <li>Click "Test Authentication" to verify token works with server</li>
            <li>If 401 error, check server console for Firebase errors</li>
            <li>Visit dashboard page to test full flow</li>
          </ol>
        </div>
      </div>
    </div>
  );
}