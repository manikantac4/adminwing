import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import AdminChatWidget from "../components/AdminChatWidget";

export default function AdminEventsListPage({ currentUser }) {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

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
    <div className="min-h-screen bg-[#FAFAFA] text-[#090909] selection:bg-[#22C55E] selection:text-black flex flex-col font-mono">
      <AdminNavbar
        currentUser={currentUser}
        unreadCount={2}
        toggleChatbot={() => setIsChatbotOpen(!isChatbotOpen)}
      />

      <main className="max-w-7xl mx-auto w-full p-4 sm:p-8 overflow-y-auto text-left space-y-8 flex-1">
        {/* Top Header Card */}
        <div className="card-premium p-6 sm:p-8 space-y-4 border border-black/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                <span className="text-xs font-bold uppercase text-[#22C55E] font-mono">
                  MANAGEMENT PORTAL • TURING WINGS
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-mono text-[#111] flex items-center gap-2">
                <svg className="w-7 h-7 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.6 15.12a2 2 0 01-1.182-1.182l-.477-2.387a6 6 0 01.517-3.86l.158-.318a6 6 0 00.517-3.86L4.74 3.128A2 2 0 015.922 1.946l2.387.477a6 6 0 003.86-.517l.318-.158a6 6 0 013.86-.517l2.387.477a2 2 0 011.182 1.182l.477 2.387a6 6 0 01-.517 3.86l-.158.318a6 6 0 00-.517 3.86l.477 2.387a2 2 0 01-.547 1.022z" />
                </svg>
                Cohorts & Buildathons Management
              </h1>
              <p className="text-xs text-black/60 mt-1">
                Launch new flagship cohorts, edit active buildathons, update module schedules, and oversee live builder registrations.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchEvents}
                className="p-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#5E6168] hover:text-[#A39B89] hover:border-[#D4CEB8] transition-all shadow-sm"
                title="Refresh Events List"
              >
                <svg className={`w-4 h-4 ${loading ? "animate-spin text-[#A39B89]" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <Link
                to="/events/new"
                className="px-5 py-2.5 rounded-xl bg-[#18191B] hover:bg-[#2A2C30] text-white font-extrabold text-xs flex items-center gap-2 shadow-md transition-all"
              >
                <svg className="w-4 h-4 text-[#A39B89]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Create New Event
              </Link>
            </div>
          </div>
        </div>

        {deleteMessage && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold shadow-sm">
            {deleteMessage}
          </div>
        )}

        {/* Events Grid */}
        {loading ? (
          <div className="py-20 text-center text-[#5E6168] text-sm">
            <svg className="w-8 h-8 animate-spin text-[#A39B89] mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Loading events directory...
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white border border-[#E5E7EB] rounded-3xl p-12 text-center space-y-4 shadow-sm">
            <svg className="w-12 h-12 text-[#A39B89] mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <h3 className="text-lg font-bold text-[#18191B]">No Events Created Yet</h3>
            <p className="text-xs text-[#5E6168] max-w-md mx-auto">
              Launch your first Hackathon or Buildathon with the multi-step event creation wizard!
            </p>
            <Link
              to="/events/new"
              className="inline-block px-6 py-3 rounded-2xl bg-[#18191B] text-white font-bold text-xs shadow-md"
            >
              Create Event Now →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((evt) => (
              <div
                key={evt._id}
                className="bg-white border border-[#E5E7EB] hover:border-[#D4CEB8] rounded-3xl p-6 flex flex-col justify-between gap-4 transition-all shadow-sm hover:shadow-md group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        evt.status === "Published"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {evt.status || "Draft"}
                    </span>
                    <span className="text-[10px] font-mono text-[#5E6168]">
                      {evt.type || "Hackathon"}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#18191B] group-hover:text-[#A39B89] transition-colors line-clamp-1">
                    {evt.name}
                  </h3>

                  <p className="text-xs text-[#5E6168] line-clamp-2 leading-relaxed">
                    {evt.shortDescription || evt.tagline || "No description provided."}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-xs text-[#5E6168] border-t border-[#F3F4F6]">
                    <div className="flex items-center gap-1.5 font-bold text-[#18191B]">
                      <svg className="w-3.5 h-3.5 text-[#A39B89]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span>{evt.registrations?.length || 0} Registrations</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-[#5E6168]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{evt.schedule?.eventStart ? new Date(evt.schedule.eventStart).toLocaleDateString() : "TBD"}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F3F4F6] flex items-center justify-between gap-2">
                  <Link
                    to={`/events/edit/${evt._id}`}
                    className="px-3.5 py-2 rounded-xl bg-[#F8F9FA] hover:bg-[#F3F4F6] text-[#18191B] font-bold text-xs flex items-center gap-1.5 border border-[#E5E7EB]"
                  >
                    <svg className="w-3.5 h-3.5 text-[#A39B89]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Event
                  </Link>

                  <button
                    onClick={() => handleDelete(evt._id, evt.name)}
                    className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-all"
                    title="Delete Event"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* FLOATING INTERACTIVE CHATBOT WIDGET */}
      <AdminChatWidget
        currentUser={currentUser}
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
      />
    </div>
  );
}
