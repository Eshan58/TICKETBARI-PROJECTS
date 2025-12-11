import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate, useLocation, Link } from 'react-router-dom';

export default function Login(){
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const nav = useNavigate();
  const loc = useLocation();
  const from = loc.state?.from?.pathname || '/';

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try{
      await login(email, password);
      nav(from, { replace: true });
    } catch(err){ setError(err.message); }
  };

  const onGoogle = async () => {
    try{ await loginWithGoogle(); nav(from, { replace: true }); }catch(e){ setError(e.message); }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      {error && <div className="text-red-600">{error}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="input" />
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" className="input" />
        <button className="btn w-full">Login</button>
      </form>
      <div className="mt-3">Or</div>
      <button onClick={onGoogle} className="btn outline w-full mt-2">Continue with Google</button>
      <div className="mt-2 text-sm">Don't have an account? <Link to="/register" className="text-blue-600">Register</Link></div>
    </div>
  );
}