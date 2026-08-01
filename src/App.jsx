import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminEventsPage from "./pages/AdminEventsPage";
import AdminLoginPage from "./pages/AdminLoginPage";

function ProtectedRoute({ currentUser, children }) {
  const location = useLocation();

  if (!currentUser) {
    const targetUrl = location.pathname + location.search;
    localStorage.setItem("post_login_redirect", targetUrl);
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppContent() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("turing_wings_user");
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
      if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
        localStorage.removeItem("turing_wings_user");
        localStorage.removeItem("turing_wings_token");
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  });

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute currentUser={currentUser}>
            <AdminDashboardPage currentUser={currentUser} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/events"
        element={
          <ProtectedRoute currentUser={currentUser}>
            <AdminEventsPage currentUser={currentUser} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute currentUser={currentUser}>
            <AdminUsersPage currentUser={currentUser} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/login"
        element={<AdminLoginPage setCurrentUser={setCurrentUser} />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
