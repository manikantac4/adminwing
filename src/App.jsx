import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminChatPage from "./pages/AdminChatPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminCallWidget from "./components/AdminCallWidget";

const BACKEND_ADMIN_URL = "https://turingwings-backend.onrender.com/api/admin";

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

  const [isCallActive, setIsCallActive] = useState(false);
  const [roomInfo, setRoomInfo] = useState({ roomId: "TuringWings_MentorHQ_Call_2026" });

  // Start Meeting Call & Broadcast active status to MongoDB Atlas
  const handleStartGlobalCall = async (customRoomId = null) => {
    const selectedRoom = customRoomId || `TuringWings_Call_${Date.now()}`;
    setRoomInfo({ roomId: selectedRoom });
    setIsCallActive(true);

    try {
      await fetch(`${BACKEND_ADMIN_URL}/calls`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hostName: currentUser?.name || "Lead Mentor",
          hostUsername: currentUser?.username || "admin",
          roomId: selectedRoom,
        }),
      });
    } catch {
      // Offline fallback
    }
  };

  // End Meeting Call & Clear active call broadcast
  const handleEndGlobalCall = async () => {
    setIsCallActive(false);

    try {
      await fetch(`${BACKEND_ADMIN_URL}/calls/end`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hostUsername: currentUser?.username || "admin",
          roomId: roomInfo.roomId,
        }),
      });
    } catch {
      // Fallback
    }
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

      {/* Global Persistent WebRTC Meeting Call Overlay */}
      {currentUser && (
        <AdminCallWidget
          currentUser={currentUser}
          isOpen={isCallActive}
          onClose={handleEndGlobalCall}
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
