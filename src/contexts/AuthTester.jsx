// src/components/AuthTester.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function AuthTester() {
  const { login, debugAuth, clearError, firebaseAvailable, user } = useAuth();
  const [testResult, setTestResult] = useState(null);
  
  const testLogin = async (email, password) => {
    clearError();
    console.clear();
    console.log('🧪 Testing login with:', email);
    
    try {
      const user = await login(email, password);
      console.log('✅ Login successful:', user);
      setTestResult({
        type: 'success',
        message: `Login successful! Welcome ${user.name} (${user.role})`
      });
    } catch (error) {
      console.log('❌ Login failed:', error.message);
      setTestResult({
        type: 'error',
        message: error.message
      });
    }
    
    const debug = debugAuth();
    console.log('🔍 Auth debug info:', debug);
  };
  
  const quickTest = () => {
    const debug = debugAuth();
    console.log('Quick debug:', debug);
    setTestResult({
      type: 'info',
      message: 'Check console for debug info'
    });
  };
  
  return (
    <div style={{
      background: 'white',
      padding: '15px',
      borderRadius: '10px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      maxWidth: '300px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h3 style={{ 
        marginBottom: '10px', 
        color: '#333',
        fontSize: '16px',
        fontWeight: 'bold'
      }}>
        🔧 Auth Tester
      </h3>
      
      <div style={{ 
        fontSize: '12px', 
        color: '#666', 
        marginBottom: '15px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>Firebase: {firebaseAvailable ? '✅' : '❌'}</span>
        {user && (
          <span style={{
            background: user.role === 'admin' ? '#dc2626' : '#059669',
            color: 'white',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '10px'
          }}>
            {user.role}
          </span>
        )}
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          onClick={() => testLogin('test@example.com', 'password123')}
          style={{
            background: '#4F46E5',
            color: 'white',
            padding: '10px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Test User Login
        </button>
        
        <button
          onClick={() => testLogin('mahdiashan9@gmail.com', 'admin123')}
          style={{
            background: '#10B981',
            color: 'white',
            padding: '10px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Admin Login
        </button>
        
        <button
          onClick={quickTest}
          style={{
            background: '#6B7280',
            color: 'white',
            padding: '10px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Debug Info
        </button>
      </div>
      
      {testResult && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          background: testResult.type === 'success' ? '#dcfce7' : 
                     testResult.type === 'error' ? '#fee2e2' : '#dbeafe',
          color: testResult.type === 'success' ? '#166534' : 
                 testResult.type === 'error' ? '#991b1b' : '#1e40af',
          borderRadius: '6px',
          fontSize: '12px'
        }}>
          {testResult.message}
        </div>
      )}
      
      <div style={{ marginTop: '15px', fontSize: '11px', color: '#666' }}>
        <p><strong>Demo Creds:</strong></p>
        <p>test@example.com / password123</p>
        <p>mahdiashan9@gmail.com / admin123</p>
      </div>
    </div>
  );
}