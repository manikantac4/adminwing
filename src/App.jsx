import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminChatPage from "./pages/AdminChatPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminCallWidget from "./components/AdminCallWidget";

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

  // Global Independent Meeting Call Overlay State (Persists across page changes!)
  const [isCallActive, setIsCallActive] = useState(false);
  const [roomInfo, setRoomInfo] = useState({ roomId: "TuringWings_MentorHQ_Call_2026" });

  const handleStartGlobalCall = () => {
    console.log("📞 Meeting Call Triggered by Owner:", currentUser?.name || "Lead Mentor");
    setIsCallActive(true);
  };

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute currentUser={currentUser}>
              <AdminDashboardPage
                currentUser={currentUser}
                isCallActive={isCallActive}
                onStartCall={handleStartGlobalCall}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute currentUser={currentUser}>
              <AdminChatPage
                currentUser={currentUser}
                isCallActive={isCallActive}
                onStartCall={handleStartGlobalCall}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute currentUser={currentUser}>
              <AdminUsersPage
                currentUser={currentUser}
                isCallActive={isCallActive}
                onStartCall={handleStartGlobalCall}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={<AdminLoginPage setCurrentUser={setCurrentUser} />}
        />
      </Routes>

      {/* Global Persistent Meeting Call Overlay (Continues uninterrupted when changing tabs or routes!) */}
      {currentUser && (
        <AdminCallWidget
          currentUser={currentUser}
          isOpen={isCallActive}
          onClose={() => setIsCallActive(false)}
          roomInfo={roomInfo}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
