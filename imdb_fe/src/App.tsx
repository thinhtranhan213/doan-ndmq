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
import LoginSuccess from './pages/LoginSuccess/LoginSuccess';
import Profile from './pages/Profile/Profile';
import EditProfile from './pages/EditProfile/EditProfile';
import Layout from './components/Layout/Layout';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import { useAuthStore } from './store/authStore';
import { useBlacklistStore } from './store/blacklistStore';
import { usePlaylistStore } from './store/playlistStore';

// Admin
import AdminRoute from './components/Admin/AdminRoute';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import UserManagement from './pages/Admin/UserManagement';
import ViolationManagement from './pages/Admin/ViolationManagement';
import FilmManagement from './pages/Admin/FilmManagement';
import ReviewManagement from './pages/Admin/ReviewManagement';
import SystemReport from './pages/Admin/SystemReport';

const AUTH_PATHS = ['/login', '/signup', '/forgot-password', '/login-success'];

const AppRoutes: React.FC = () => {
  const location = useLocation();
  const { initializeAuth, isAuthenticated } = useAuthStore();
  const fetchBlacklist = useBlacklistStore((s) => s.fetchBlacklist);
  const initializePlaylists = usePlaylistStore((s) => s.initializePlaylists);

  useEffect(() => { initializeAuth(); }, [initializeAuth]);
  useEffect(() => { fetchBlacklist(); }, [fetchBlacklist]);
  useEffect(() => {
    if (isAuthenticated) {
      initializePlaylists().catch(err => {
        console.error('Failed to initialize playlists:', err);
      });
    }
  }, [isAuthenticated, initializePlaylists]);

  const isAuthPage = AUTH_PATHS.includes(location.pathname);
  const isAdminPage = location.pathname.startsWith('/admin');

  if (isAuthenticated && isAuthPage) return <Navigate to="/" replace />;

  return (
    <>
      <ScrollToTop />
      {!isAuthPage && !isAdminPage && <Navbar />}
      <Routes>
        {/* ── Public / Main ── */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/login" element={<Login />} />
        <Route path="/login-success" element={<LoginSuccess />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/profile"
          element={isAuthenticated ? <Layout><Profile /></Layout> : <Navigate to="/" replace />}
        />
        <Route
          path="/edit-profile"
          element={isAuthenticated ? <Layout><EditProfile /></Layout> : <Navigate to="/" replace />}
        />
        <Route path="/genre/:genreId" element={<Layout><GenrePage /></Layout>} />
        <Route path="/movie/:id" element={<Layout><MovieDetail /></Layout>} />
        <Route path="/search" element={<Layout><Search /></Layout>} />

        {/* ── Admin (isolated layout, role-guarded) ── */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="violations" element={<ViolationManagement />} />
          <Route path="films" element={<FilmManagement />} />
          <Route path="reviews" element={<ReviewManagement />} />
          <Route path="reports" element={<SystemReport />} />
        </Route>
      </Routes>
    </>
  );
};

const App: React.FC = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);

export default App;