
import apiClient from '../api/axiosClient';
import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string;
  user: string | null;
  token: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load user and token from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('authToken');
    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }
  }, []);

  // Persist user and token to localStorage
  useEffect(() => {
    if (user && token) {
      localStorage.setItem('user', user);
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
    }
  }, [user, token]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError('');
    try {
      // Call backend API for login
      const response = await apiClient.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      setUser(user.email || user.username || user.id || '');
      setToken(token);
    } catch (err: any) {
        console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid credentials');
      setUser(null);
      setToken(null);
    }
    setLoading(false);
  };

  const register = async (email: string, password: string) => {
    setLoading(true);
    setError('');
    // Replace with real API call
    await new Promise((res) => setTimeout(res, 800));
    if (email && password.length >= 6) {
      setUser(email);
      setToken('mock-token-123');
    } else {
      setError('Registration failed');
      setUser(null);
      setToken(null);
    }
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ login, register, logout, loading, error, user, token }}>
      {children}
    </AuthContext.Provider>
  );
};
