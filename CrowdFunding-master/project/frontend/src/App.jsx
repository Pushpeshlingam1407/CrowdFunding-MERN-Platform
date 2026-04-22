import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { ToastContainer } from "react-toastify";
import { theme, GlobalStyle } from "./theme/theme";
import Navbar from "./components/ui/Navbar";
import Footer from "./components/ui/Footer";
import "react-toastify/dist/ReactToastify.css";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Projects from "./pages/admin/Projects";
import Users from "./pages/admin/Users";
import Analytics from "./pages/admin/Analytics";
import AdminSettings from "./pages/admin/Settings";
import ProjectDetails from "./pages/ProjectDetails";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Campaigns from "./pages/Campaigns";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import CompanyProfile from "./pages/CompanyProfile";
import PrivateSpace from "./pages/PrivateSpace";
import AdminComplaints from "./pages/admin/Complaints";

// Components
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import Register from "./components/Register";
import CreateProject from "./components/CreateProject";
import EditProject from "./components/EditProject";
import Portfolio from "./components/Portfolio";

// Store
import useAuthStore from "./store/authStore";

const AppContent = () => {
  const location = useLocation();
  const { checkAuth, isAuthenticated, isLoading } = useAuthStore();
  const isAdminPage = location.pathname.startsWith("/admin/");

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.2rem",
          fontWeight: 600,
        }}
      >
        Loading StartupFund...
      </div>
    );
  }

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      {/* Show navbar on all pages except admin pages */}
      {!isAdminPage && <Navbar />}

      <main style={{ flexGrow: 1 }}>
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <Login />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/register"
            element={
              !isAuthenticated ? (
                <Register />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Public pages */}
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/company/:id" element={<CompanyProfile />} />
          <Route
            path="/messages"
            element={
              <PrivateRoute>
                <PrivateSpace />
              </PrivateRoute>
            }
          />
          <Route
            path="/messages/:id"
            element={
              <PrivateRoute>
                <PrivateSpace />
              </PrivateRoute>
            }
          />

          {/* Protected User Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/portfolio"
            element={
              <PrivateRoute>
                <Portfolio />
              </PrivateRoute>
            }
          />
          <Route
            path="/projects/new"
            element={
              <PrivateRoute>
                <CreateProject />
              </PrivateRoute>
            }
          />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route
            path="/projects/:id/edit"
            element={
              <PrivateRoute>
                <EditProject />
              </PrivateRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/projects"
            element={
              <AdminRoute>
                <Projects />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <Users />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <AdminRoute>
                <Analytics />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <AdminRoute>
                <AdminSettings />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/complaints"
            element={
              <AdminRoute>
                <AdminComplaints />
              </AdminRoute>
            }
          />

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
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
