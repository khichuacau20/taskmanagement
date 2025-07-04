import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const auth = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <nav className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between shadow">
      <div className="flex items-center gap-4">
        <Link to="/" className="font-bold text-lg tracking-wide">TaskManager</Link>
        <Link to="/" className="hover:underline hidden sm:inline">Dashboard</Link>
        <Link to="/about" className="hover:underline hidden sm:inline">About</Link>
      </div>
      <div className="relative" ref={menuRef}>
        {auth && auth.user ? (
          <>
            <button
              className="flex items-center gap-2 focus:outline-none"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="hidden sm:inline">{auth.user}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded shadow-lg z-10">
                <Link to="/" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
                  My Tasks
                </Link>
                <Link to="/about" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
                  About
                </Link>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setMenuOpen(false);
                    auth.logout();
                    navigate('/login');
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-50">Login</Link>
            <Link to="/register" className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-50">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
