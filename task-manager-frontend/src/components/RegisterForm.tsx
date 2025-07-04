import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const RegisterForm: React.FC = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('RegisterForm must be used within an AuthProvider');
  }
  const { register, loading, error } = context;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!email || !password || !confirmPassword) {
      setFormError('All fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }
    await register(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded shadow-md">
      <h2 className="text-lg font-semibold mb-4">Register</h2>
      <div className="mb-3">
        <label className="block mb-1 font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border rounded px-2 py-1 w-full"
          required
        />
      </div>
      <div className="mb-3">
        <label className="block mb-1 font-medium">Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border rounded px-2 py-1 w-full"
          required
        />
      </div>
      <div className="mb-3">
        <label className="block mb-1 font-medium">Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          className="border rounded px-2 py-1 w-full"
          required
        />
      </div>
      {(formError || error) && <p className="text-red-500 text-xs mb-2">{formError || error}</p>}
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
};

export default RegisterForm;
