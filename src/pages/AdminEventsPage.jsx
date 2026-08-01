import React, { useState, useEffect } from "react";
import { Plus, Calendar, MapPin, Edit3, Trash2, Clock, CheckCircle, RefreshCw, Trophy, Layers } from "lucide-react";
import AdminNavbar from "../components/AdminNavbar";
import AdminChatWidget from "../components/AdminChatWidget";

export default function AdminEventsPage({ currentUser }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    tagline: "",
    status: "upcoming",
    mode: "Hybrid (Discord & Campus Lab)",
    venue: "Turing Wings Innovation HQ",
    startDate: "",
    endDate: "",
    lead: currentUser?.name || "Turing Wings Team",
    description: "",
    trackTitle: "",
    trackDesc: "",
    prizeAmount: "",
  });

  const token = localStorage.getItem("turing_wings_token");
  const API_URL = "https://turingwings-backend.onrender.com/api/events";

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title) return alert("Title is required!");

    const eventPayload = {
      ...formData,
      tracks: formData.trackTitle
        ? [{ title: formData.trackTitle, desc: formData.trackDesc || "Track description", prizePool: formData.prizeAmount || "$5,000" }]
        : editingEvent?.tracks || [],
      prizes: formData.prizeAmount
        ? [{ place: "1st Winner", amount: formData.prizeAmount, perks: "Mentorship & Grant" }]
        : editingEvent?.prizes || [],
    };

    try {
      const method = editingEvent ? "PUT" : "POST";
      const url = editingEvent ? `${API_URL}/${editingEvent._id}` : API_URL;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventPayload),
      });

      if (res.ok) {
        setShowModal(false);
        setEditingEvent(null);
        fetchEvents();
      } else {
        const errData = await res.json();
        alert(errData.message || "Failed to save event");
      }
    } catch (err) {
      console.error("Save event error:", err);
      alert("Network error saving event");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this buildathon event?")) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchEvents();
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const openCreateModal = () => {
    setEditingEvent(null);
    setFormData({
      title: "",
      tagline: "",
      status: "upcoming",
      mode: "Hybrid (Discord & Campus Lab)",
      venue: "Turing Wings Innovation HQ",
      startDate: "",
      endDate: "",
      lead: currentUser?.name || "Turing Wings Team",
      description: "",
      trackTitle: "",
      trackDesc: "",
      prizeAmount: "",
    });
    setShowModal(true);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title || "",
      tagline: event.tagline || "",
      status: event.status || "upcoming",
      mode: event.mode || "",
      venue: event.venue || "",
      startDate: event.startDate || "",
      endDate: event.endDate || "",
      lead: event.lead || currentUser?.name,
      description: event.description || "",
      trackTitle: event.tracks?.[0]?.title || "",
      trackDesc: event.tracks?.[0]?.desc || "",
      prizeAmount: event.prizes?.[0]?.amount || "",
    });
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <AdminNavbar
        currentUser={currentUser}
        unreadCount={2}
        toggleChatbot={() => setIsChatbotOpen(!isChatbotOpen)}
      />

      <main className="max-w-7xl mx-auto w-full p-4 sm:p-8 flex-1 space-y-6 text-left">
        {/* HEADER & ACTION BAR */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Trophy className="w-7 h-7 text-amber-400" />
              <span>Buildathon & Event Manager</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Create, edit, and orchestrate global hackathons and tech masterclasses in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchEvents}
              className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={openCreateModal}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 font-extrabold text-sm shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Buildathon</span>
            </button>
          </div>
        </div>

        {/* EVENTS LIST GRID */}
        {loading ? (
          <div className="text-center py-16 text-slate-400">Loading events from database...</div>
        ) : events.length === 0 ? (
          <div className="text-center py-16 text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
            No events found. Click "Create Buildathon" to add your first event.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => (
              <div
                key={event._id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase border ${
                        event.status === "live"
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : event.status === "completed"
                          ? "bg-slate-800 text-slate-400 border-slate-700"
                          : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                      }`}
                    >
                      {event.status}
                    </span>

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>{event.startDate || "TBD"}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white leading-snug">{event.title}</h3>
                  <p className="text-sm text-slate-400 line-clamp-2">{event.tagline || event.description}</p>

                  <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>{event.mode || "Hybrid"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-amber-400" />
                      <span>{event.tracks?.length || 0} Tracks</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Lead: <strong className="text-slate-200">{event.lead}</strong></span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(event)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      title="Edit Event"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                      title="Delete Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto text-left space-y-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-white">
              {editingEvent ? "Edit Buildathon Event" : "Create New Buildathon Event"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Global 48-Hour Vibe Coding Sprint"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Transform raw concepts into deployed full-stack web applications"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="live">Live Now</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Track Name</label>
                  <input
                    type="text"
                    value={formData.trackTitle}
                    onChange={(e) => setFormData({ ...formData, trackTitle: e.target.value })}
                    placeholder="e.g. Generative UI & Spatial Systems"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Prize Pool / Amount</label>
                  <input
                    type="text"
                    value={formData.prizeAmount}
                    onChange={(e) => setFormData({ ...formData, prizeAmount: e.target.value })}
                    placeholder="e.g. $5,000"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description of the buildathon..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                ></textarea>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black"
                >
                  {editingEvent ? "Save Changes" : "Publish Buildathon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AdminChatWidget
        currentUser={currentUser}
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
      />
    </div>
  );
}
