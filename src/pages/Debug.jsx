// src/pages/Debug.jsx
import React, { useState } from 'react';

export default function DebugPage() {
  const [result, setResult] = useState('');
  
  const testAuth = async () => {
    try {
      const token = localStorage.getItem('firebaseToken') || 
                   localStorage.getItem('token') || 
                   localStorage.getItem('idToken');
      
      if (!token) {
        setResult('❌ No token found in localStorage');
        return;
      }
      
      setResult('🔍 Testing token...');
      
      // Test server health first
      const healthResponse = await fetch('http://localhost:5000/api/health');
      const healthData = await healthResponse.json();
      
      // Test dashboard endpoint
      const dashResponse = await fetch('http://localhost:5000/api/user/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const results = {
        tokenExists: token ? `Yes (${token.length} chars)` : 'No',
        tokenPreview: token.substring(0, 30) + '...',
        serverHealth: healthData,
        dashboardStatus: dashResponse.status,
        dashboardOk: dashResponse.ok
      };
      
      if (dashResponse.ok) {
        const dashData = await dashResponse.json();
        results.dashboardData = dashData;
      }
      
      setResult(JSON.stringify(results, null, 2));
      
    } catch (error) {
      setResult(`❌ Error: ${error.message}`);
    }
  };
  
  const clearTokens = () => {
    localStorage.removeItem('firebaseToken');
    localStorage.removeItem('token');
    localStorage.removeItem('idToken');
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('firebaseToken');
    sessionStorage.removeItem('authToken');
    setResult('🗑️ All tokens cleared');
  };
  
  const showLocalStorage = () => {
    const allItems = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      allItems[key] = localStorage.getItem(key);
    }
    setResult(JSON.stringify(allItems, null, 2));
  };
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Auth Debug Page</h1>
      
      <div className="space-y-4 mb-8">
        <button 
          onClick={testAuth}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Test Authentication
        </button>
        
        <button 
          onClick={clearTokens}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 ml-4"
        >
          Clear All Tokens
        </button>
        
        <button 
          onClick={showLocalStorage}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 ml-4"
        >
          Show LocalStorage
        </button>
        
        <a 
          href="/dashboard"
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 ml-4"
        >
          Go to Dashboard
        </a>
      </div>
      
      {result && (
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-auto">
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
}