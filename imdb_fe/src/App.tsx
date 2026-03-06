import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import GenrePage from './pages/GenrePage/GenrePage';
import MovieDetail from './pages/MovieDetail/MovieDetail';
import Search from './pages/Search/Search';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import Layout from './components/Layout/Layout';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import { useAuthStore } from './store/authStore';

const AppRoutes: React.FC = () => {
  const location = useLocation();
  const { initializeAuth, isAuthenticated } = useAuthStore();

  // Initialize auth state on app mount
  useEffect(() => {
    initializeAuth();
  }, []);

  // Don't show Navbar on login/signup/forgot-password page
  const isAuthPage =
    location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/forgot-password';

  // TEMPORARILY DISABLED: Allow all routes without authentication
  // // Redirect to login if not authenticated (except on auth pages)
  // if (!isAuthenticated && !isAuthPage) {
  //   return <Navigate to="/login" replace />;
  // }

  // // Redirect to home if authenticated and trying to access auth pages
  // if (isAuthenticated && isAuthPage) {
  //   return <Navigate to="/" replace />;
  // }

  return (
    <>
      <ScrollToTop />
      {!isAuthPage && <Navbar />}
      <Routes>
        {/* Temporarily allow all routes */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/genre/:genreId" element={<Layout><GenrePage /></Layout>} />
        <Route path="/movie/:id" element={<Layout><MovieDetail /></Layout>} />
        <Route path="/search" element={<Layout><Search /></Layout>} />
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
