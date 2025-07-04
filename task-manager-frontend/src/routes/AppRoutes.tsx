import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, Link } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import { AuthContext } from '../context/AuthContext';
const EditTaskLazy = React.lazy(() => import('../pages/EditTask'));

// Protected Route component
const ProtectedRoute: React.FC = () => {
  const auth = useContext(AuthContext);
  if (!auth || !auth.user) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

import Navbar from '../components/common/Navbar';

const AppRoutes: React.FC = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/tasks/:id/edit" element={
          <React.Suspense fallback={<div>Loading...</div>}>
            <EditTaskLazy />
          </React.Suspense>
        } />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Router>
);

export default AppRoutes;