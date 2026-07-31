import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminChatPage from "./pages/AdminChatPage";
import VoiceCallPage from "./pages/VoiceCallPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminLoginPage from "./pages/AdminLoginPage";

function AppContent() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("turing_wings_user");
    return saved ? JSON.parse(saved) : { name: "Pandu Ranga", username: "panduranga", role: "admin" };
  });

  const handleStartCall = () => {
    const roomId = `room-sentinel-${Math.floor(Math.random() * 900 + 100)}`;
    navigate(`/call/${roomId}`);
  };

  return (
    <Routes>
      <Route path="/" element={<AdminDashboardPage currentUser={currentUser} onStartCall={handleStartCall} />} />
      <Route path="/chat" element={<AdminChatPage currentUser={currentUser} onStartCall={handleStartCall} />} />
      <Route path="/call/:roomId" element={<VoiceCallPage currentUser={currentUser} onStartCall={handleStartCall} />} />
      <Route path="/call" element={<VoiceCallPage currentUser={currentUser} onStartCall={handleStartCall} />} />
      <Route path="/users" element={<AdminUsersPage currentUser={currentUser} onStartCall={handleStartCall} />} />
      <Route path="/login" element={<AdminLoginPage setCurrentUser={setCurrentUser} />} />
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
