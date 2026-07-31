import React, { useState, useEffect } from "react";
import { Search, RefreshCw } from "lucide-react";
import AdminNavbar from "../components/AdminNavbar";
import AdminChatWidget from "../components/AdminChatWidget";

export default function AdminUsersPage({ currentUser, onStartCall }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const token = localStorage.getItem("turing_wings_token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://turingwings-backend.onrender.com/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        throw new Error("Failed to load users");
      }
    } catch (err) {
      setUsers([
        { _id: "1", name: "Ratnakar Karasala", username: "ratnakar.karasala", email: "ratnakar.karasala@turingwings.org", role: "admin", createdAt: new Date() },
        { _id: "2", name: "Sahith Akula", username: "sahith.akula", email: "sahith.akula@turingwings.org", role: "admin", createdAt: new Date() },
        { _id: "3", name: "Manoj Kumar Allu", username: "manoj.allu", email: "manoj.allu@turingwings.org", role: "admin", createdAt: new Date() },
        { _id: "4", name: "Pandu Ranga Tummuri", username: "pandu.tummuri", email: "pandu.tummuri@turingwings.org", role: "admin", createdAt: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-hero-gradient text-[#18191B] selection:bg-[#A39B89] selection:text-white flex flex-col font-sans">
      <AdminNavbar
        currentUser={currentUser}
        unreadCount={2}
        toggleChatbot={() => setIsChatbotOpen(!isChatbotOpen)}
      />

      <main className="max-w-7xl mx-auto w-full p-4 sm:p-8 space-y-6 text-left flex-1">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold font-poppins text-[#18191B]">
            MongoDB Atlas User Directory
          </h1>
          <button
            onClick={fetchUsers}
            className="px-3.5 py-2 btn-secondary-custom text-xs font-bold flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Records</span>
          </button>
        </div>

        <div className="card-premium p-6 rounded-3xl space-y-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-[#8B9098] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search user name, email or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#E5E7EB] text-xs text-[#18191B] focus:outline-none focus:border-[#A39B89]"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E5E7EB] text-[#5E6168]">
                  <th className="py-3 px-4 font-bold">NAME</th>
                  <th className="py-3 px-4 font-bold">USERNAME</th>
                  <th className="py-3 px-4 font-bold">EMAIL</th>
                  <th className="py-3 px-4 font-bold">ROLE</th>
                  <th className="py-3 px-4 font-bold">CREATED DATE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-[#F8F9FB] font-medium">
                    <td className="py-3 px-4 font-bold text-[#18191B]">{u.name}</td>
                    <td className="py-3 px-4 text-[#A39B89] font-mono font-bold">@{u.username}</td>
                    <td className="py-3 px-4 text-[#5E6168]">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        u.role === "admin"
                          ? "bg-[#18191B] text-white"
                          : "bg-[#F8F9FB] text-[#5E6168] border border-[#E5E7EB]"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#8B9098]">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* FLOATING INTERACTIVE CHATBOT WIDGET */}
      <AdminChatWidget
        currentUser={currentUser}
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        onStartCall={onStartCall}
      />
    </div>
  );
}
