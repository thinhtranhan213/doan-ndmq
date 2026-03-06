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
  }, [initializeAuth]);

  // Don't show Navbar on login/signup/forgot-password page
  const isAuthPage =
    location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/forgot-password';

  // Redirect to login if not authenticated (except on auth pages)
  if (!isAuthenticated && !isAuthPage) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to home if authenticated and trying to access auth pages
  if (isAuthenticated && isAuthPage) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <ScrollToTop />
      {!isAuthPage && <Navbar />}
      <Routes>
        {isAuthenticated ? (
          <>
            {/* Protected Routes - only accessible when authenticated */}
            <Layout>
              <Route path="/" element={<Home />} />
              <Route path="/genre/:genreId" element={<GenrePage />} />
              <Route path="/movie/:id" element={<MovieDetail />} />
              <Route path="/search" element={<Search />} />
            </Layout>
            {/* Redirect back to home if trying to access auth pages while authenticated */}
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/signup" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            {/* Public Routes - only accessible when not authenticated */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            {/* Redirect all other routes to login if not authenticated */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}
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
