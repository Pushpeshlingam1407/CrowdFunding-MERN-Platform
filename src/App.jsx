import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Projects from "./pages/admin/Projects";
import Users from "./pages/admin/Users";
import Analytics from "./pages/admin/Analytics";
import ProjectDetails from "./pages/ProjectDetails";
import UserDashboard from "./pages/UserDashboard";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Campaigns from "./pages/Campaigns";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import ProjectView from './pages/ProjectView';

// Components
import AppNavbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import Footer from "./components/Footer";
import Register from "./components/Register";
import CreateProject from "./components/CreateProject";
import EditProject from './components/EditProject';

// Store
import useAuthStore from "./store/authStore";

const AppContent = () => {
  const location = useLocation();
  const { checkAuth, isAuthenticated, isLoading, isAdmin } = useAuthStore();
  const isAdminLoginPage = location.pathname === '/admin/login';
  const isAdminPage = location.pathname.startsWith('/admin/');

  useEffect(() => {
    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Show navbar everywhere except admin pages */}
      {!isAdminPage && <AppNavbar />}

      <main className="flex-grow-1">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Public pages */}
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/campaigns" element={<Campaigns />} />

          {/* Protected User Routes */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/projects/new" element={<PrivateRoute><CreateProject /></PrivateRoute>} />
          <Route path="/projects/:id" element={<PrivateRoute><ProjectView /></PrivateRoute>} />
          <Route path="/projects/:id/edit" element={<PrivateRoute><EditProject /></PrivateRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/projects" element={<AdminRoute><Projects /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><Users /></AdminRoute>} />
          <Route path="/admin/analytics" element={<AdminRoute><Analytics /></AdminRoute>} />

          {/* Root Route */}
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Show footer everywhere except admin pages */}
      {!isAdminPage && <Footer />}
      <ToastContainer position="bottom-right" />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
