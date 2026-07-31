import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Send, Calendar, Layers, Database, CheckCircle2, ShieldCheck, Zap,
  MessageSquare, Sparkles, Plus, Radio, ArrowRight, Eye, Settings, Trash2, RefreshCw
} from "lucide-react";
import AdminNavbar from "../components/AdminNavbar";
import AdminChatWidget from "../components/AdminChatWidget";
import AdminEventWizardModal from "../components/AdminEventWizardModal";

export default function AdminDashboardPage({ currentUser }) {
  const navigate = useNavigate();

  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://turingwings-backend.onrender.com/api/events/admin/all");
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminEvents();
  }, []);

  const handleDeleteEvent = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      const res = await fetch(`https://turingwings-backend.onrender.com/api/events/admin/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchAdminEvents();
      }
    } catch {
      alert("Failed to delete event");
    }
  };

  return (
    <div className="min-h-screen bg-hero-gradient text-[#18191B] selection:bg-[#A39B89] selection:text-white flex flex-col font-sans">
      {/* Event Wizard Modal */}
      <AdminEventWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onEventCreated={() => fetchAdminEvents()}
      />

      <AdminNavbar
        currentUser={currentUser}
        unreadCount={2}
        toggleChatbot={() => setIsChatbotOpen(!isChatbotOpen)}
      />

      <main className="max-w-7xl mx-auto w-full p-4 sm:p-8 overflow-y-auto text-left space-y-8 flex-1">
        {/* HERO COMMAND CENTER */}
        <div className="card-premium p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#A39B89] animate-pulse" />
                <span className="text-xs font-bold uppercase text-[#A39B89] font-mono">
                  HQ COMMAND CENTER • TURING WINGS
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-poppins text-[#18191B]">
                Template-Based Event Generator & Management Portal
              </h1>
              <p className="text-xs text-[#5E6168] mt-1">
                Launch professional Buildathons, Hackathons, AI Challenges & Workshops in seconds without writing frontend code.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsWizardOpen(true)}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#18191B] via-[#A39B89] to-[#C9B27D] text-white font-bold text-xs shadow-lg hover:scale-105 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4 text-white" />
                <span>Create New Event</span>
              </button>

              <button
                onClick={() => setIsChatbotOpen(!isChatbotOpen)}
                className="btn-hero-gradient px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-2 shadow-glow hover:scale-105 transition-all shrink-0"
              >
                <MessageSquare className="w-4 h-4 text-[#C9B27D]" />
                <span className="hidden sm:inline">Chatbot</span>
              </button>
            </div>
          </div>
        </div>

        {/* EVENT MANAGED DIRECTORY GRID */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold font-poppins text-[#18191B]">
                Active Managed Events Directory ({events.length})
              </h2>
              <p className="text-xs text-[#5E6168]">
                Real-time MongoDB Atlas event database synced across public site and admin dashboards.
              </p>
            </div>

            <button
              onClick={fetchAdminEvents}
              className="px-3.5 py-2 rounded-xl bg-white border border-[#E5E7EB] text-xs font-bold text-[#18191B] hover:bg-[#F8F9FB] flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#A39B89] ${loading ? "animate-spin" : ""}`} />
              <span>Refresh Events</span>
            </button>
          </div>

          {events.length === 0 ? (
            <div className="card-premium p-12 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-[#A39B89] mx-auto opacity-50" />
              <h3 className="text-base font-bold text-[#18191B]">No events generated yet</h3>
              <p className="text-xs text-[#5E6168] max-w-md mx-auto">
                Click "Create New Event" to launch the 5-step template wizard and publish your first Buildathon!
              </p>
              <button
                onClick={() => setIsWizardOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-[#18191B] text-white font-bold text-xs hover:bg-[#A39B89] transition-all inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create First Event</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((evt) => (
                <div
                  key={evt._id}
                  onClick={() => navigate(`/events/${evt._id}`)}
                  className="card-premium p-6 rounded-3xl space-y-4 cursor-pointer hover:border-[#A39B89] transition-all hover:scale-[1.01] flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-[#18191B] text-white">
                        {evt.eventType}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-[#F8F9FB] border border-[#E5E7EB] text-[#A39B89]">
                        {evt.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold font-poppins text-[#18191B] line-clamp-1">{evt.title}</h3>
                      <p className="text-xs text-[#5E6168] line-clamp-2 mt-1">{evt.tagline}</p>
                    </div>

                    <div className="pt-3 border-t border-[#E5E7EB] grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                      <div>
                        <span className="text-[#5E6168] block">TEMPLATE</span>
                        <span className="font-bold text-[#18191B]">{evt.templateId}</span>
                      </div>
                      <div>
                        <span className="text-[#5E6168] block">PRIZE POOL</span>
                        <span className="font-bold text-[#C9B27D]">{evt.prizePool}</span>
                      </div>
                      <div>
                        <span className="text-[#5E6168] block">APPLICANTS</span>
                        <span className="font-bold text-emerald-600">{evt.analytics?.registrationsCount || evt.participants?.length || 0}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-xs">
                    <span className="text-[#5E6168] font-mono text-[10px]">Click to Manage</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleDeleteEvent(evt._id, e)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                        title="Delete Event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <span className="font-bold text-[#18191B] flex items-center gap-1">
                        <span>Dashboard</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#A39B89]" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <AdminChatWidget
        currentUser={currentUser}
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
      />
    </div>
  );
}
