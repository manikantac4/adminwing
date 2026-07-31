import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminChatPage from "./pages/AdminChatPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminLoginPage from "./pages/AdminLoginPage";

function AppContent() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("turing_wings_user");
    if (!saved) return { name: "Pandu Ranga", username: "panduranga", role: "admin" };
    try {
      const parsed = JSON.parse(saved);
      if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
        localStorage.removeItem("turing_wings_user");
        localStorage.removeItem("turing_wings_token");
        return { name: "Pandu Ranga", username: "panduranga", role: "admin" };
      }
      return parsed;
    } catch {
      return { name: "Pandu Ranga", username: "panduranga", role: "admin" };
    }
  });

  return (
    <Routes>
      <Route path="/" element={<AdminDashboardPage currentUser={currentUser} />} />
      <Route path="/chat" element={<AdminChatPage currentUser={currentUser} />} />
      <Route path="/users" element={<AdminUsersPage currentUser={currentUser} />} />
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
