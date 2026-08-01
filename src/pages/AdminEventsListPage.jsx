import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Calendar, Users, Trophy, Edit, Trash2, ExternalLink, RefreshCw, Eye, Sparkles } from "lucide-react";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminEventsListPage({ currentUser }) {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteMessage, setDeleteMessage] = useState("");

  const API_URL = "https://turingwings-backend.onrender.com/api/events/all";

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (err) {
      console.error("Failed to fetch admin events:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete event "${name}"?`)) return;
    try {
      const res = await fetch(`https://turingwings-backend.onrender.com/api/events/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e._id !== id));
        setDeleteMessage(`Deleted "${name}" successfully.`);
        setTimeout(() => setDeleteMessage(""), 3000);
      }
    } catch (err) {
      console.error("Delete event error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <AdminNavbar currentUser={currentUser} unreadCount={2} />

      <main className="max-w-7xl mx-auto w-full p-4 sm:p-8 flex-1 flex flex-col gap-6 text-left">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
              🏆 Events & Hackathons Manager
            </h1>
            <p className="text-xs text-slate-400">
              Manage hackathons, buildathons, workshops, registrations, and live dashboards across the Turing Wings platform.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchEvents}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/30"
              title="Refresh List"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-amber-500" : ""}`} />
            </button>
            <Link
              to="/events/new"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-105 transition-all"
            >
              <Plus className="w-4 h-4" /> Create New Event
            </Link>
          </div>
        </div>

        {deleteMessage && (
          <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold">
            {deleteMessage}
          </div>
        )}

        {/* Events List Grid */}
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-sm">
            <RefreshCw className="w-8 h-8 animate-spin text-amber-500 mx-auto mb-2" />
            Loading events directory...
          </div>
        ) : events.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
            <Sparkles className="w-12 h-12 text-amber-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Events Created Yet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Launch your first Hackathon or Buildathon with the 23-phase event creation wizard!
            </p>
            <Link
              to="/events/new"
              className="inline-block px-6 py-3 rounded-2xl bg-amber-500 text-slate-950 font-bold text-xs"
            >
              Create Event Now →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((evt) => (
              <div
                key={evt._id}
                className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 rounded-3xl p-6 flex flex-col justify-between gap-4 transition-all shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        evt.status === "Published"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {evt.status || "Draft"}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {evt.type || "Hackathon"}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                    {evt.name}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {evt.shortDescription || evt.tagline || "No description provided."}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80">
                    <div className="flex items-center gap-1.5 font-bold text-slate-300">
                      <Users className="w-3.5 h-3.5 text-amber-500" />
                      <span>{evt.registrations?.length || 0} Registrations</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{evt.schedule?.eventStart ? new Date(evt.schedule.eventStart).toLocaleDateString() : "TBD"}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <Link
                    to={`/events/edit/${evt._id}`}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs flex items-center gap-1.5 border border-slate-700"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(evt._id, evt.name)}
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
                    title="Delete Event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
