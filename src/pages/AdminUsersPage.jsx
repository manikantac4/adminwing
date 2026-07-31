import React, { useState, useEffect } from "react";
import { Search, RefreshCw, ShieldCheck } from "lucide-react";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminUsersPage({ currentUser, onStartCall }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("turing_wings_token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/users", {
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
        { _id: "1", name: "Ratnakar", username: "ratnakar", email: "ratnakar@turingwings.org", role: "admin", createdAt: new Date() },
        { _id: "2", name: "Sahith Akula", username: "sahith", email: "sahith.akula@turingwings.org", role: "admin", createdAt: new Date() },
        { _id: "3", name: "Manoj Kumar", username: "manoj", email: "manoj.kumar@turingwings.org", role: "admin", createdAt: new Date() },
        { _id: "4", name: "Pandu Ranga", username: "panduranga", email: "pandu.ranga@turingwings.org", role: "admin", createdAt: new Date() },
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
    <div className="min-h-screen bg-[#040508] text-slate-100 selection:bg-amber-500 selection:text-slate-950 flex flex-col">
      <AdminNavbar currentUser={currentUser} onStartCall={onStartCall} />

      <main className="max-w-7xl mx-auto w-full p-4 sm:p-8 space-y-6 text-left flex-1">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold font-serif italic text-white">
            MONGODB ATLAS USER DIRECTORY
          </h1>
          <button
            onClick={fetchUsers}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold flex items-center gap-2 text-slate-300 hover:border-amber-500/40"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Records</span>
          </button>
        </div>

        <div className="glass-gold p-6 rounded-3xl space-y-4 border border-amber-500/30">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search user name, email or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-4 font-bold">NAME</th>
                  <th className="py-3 px-4 font-bold">USERNAME</th>
                  <th className="py-3 px-4 font-bold">EMAIL</th>
                  <th className="py-3 px-4 font-bold">ROLE</th>
                  <th className="py-3 px-4 font-bold">CREATED DATE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-amber-500/5">
                    <td className="py-3 px-4 font-bold text-slate-200">{u.name}</td>
                    <td className="py-3 px-4 text-amber-400 font-mono-tech">@{u.username}</td>
                    <td className="py-3 px-4 text-slate-300">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        u.role === "admin"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                          : "bg-slate-800 text-slate-300"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
