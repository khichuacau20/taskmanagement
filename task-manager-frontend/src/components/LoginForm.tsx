import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


const LoginForm: React.FC = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  if (!authContext) {
    throw new (globalThis.Error)('AuthContext must be used within an AuthProvider');
  }
  const { login, loading, error, user } = authContext;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/'); // Redirect to task list (home) after login
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!email || !password) {
      setFormError('Email and password are required.');
      return;
    }
    await login(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto p-10 bg-white/90 rounded-3xl shadow-2xl flex flex-col items-center border border-blue-100">
        <h2 className="text-3xl font-extrabold mb-8 text-blue-700 tracking-tight drop-shadow">Welcome Back</h2>
        <div className="mb-6 w-full">
          <label className="block mb-2 font-semibold text-blue-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="border-2 border-blue-100 focus:border-purple-300 focus:ring-2 focus:ring-blue-200 rounded-xl px-4 py-2 w-full bg-blue-50 placeholder-blue-300 transition text-blue-800 shadow-sm"
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="mb-6 w-full">
          <label className="block mb-2 font-semibold text-blue-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border-2 border-blue-100 focus:border-purple-300 focus:ring-2 focus:ring-blue-200 rounded-xl px-4 py-2 w-full bg-blue-50 placeholder-blue-300 transition text-blue-800 shadow-sm"
            placeholder="Enter your password"
            required
          />
        </div>
        {(formError || error) && <p className="text-red-500 text-sm mb-6 w-full text-center font-medium">{formError || error}</p>}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:from-blue-500 hover:to-pink-500 transition-all duration-200 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <div className="mt-8 text-xs text-blue-400 text-center w-full select-none">
          &copy; {new Date().getFullYear()} Task Manager. All rights reserved.
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
