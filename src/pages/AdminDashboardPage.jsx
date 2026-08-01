import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import AdminChatWidget from "../components/AdminChatWidget";

export default function AdminDashboardPage({ currentUser }) {
  const navigate = useNavigate();
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoadingEvents(true);
      const res = await fetch("https://turingwings-backend.onrender.com/api/events/all");
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (err) {
      console.error("Error loading events for dashboard:", err);
    } finally {
      setLoadingEvents(false);
    }
  };

  return (
    <div className="min-h-screen bg-hero-gradient text-[#18191B] selection:bg-[#A39B89] selection:text-white flex flex-col font-sans">
      <AdminNavbar
        currentUser={currentUser}
        unreadCount={2}
        toggleChatbot={() => setIsChatbotOpen(!isChatbotOpen)}
      />

      <main className="max-w-7xl mx-auto w-full p-4 sm:p-8 overflow-y-auto text-left space-y-8 flex-1">
        
        {/* HERO HEADER SECTION WITH PREMIUM GRADIENT */}
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
                Mentor Control Gateway & Hackathon Manager
              </h1>
              <p className="text-xs text-[#5E6168] mt-1">
                Manage live hackathons, buildathons, real-time registrations, and mentor communications.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/events/new"
                className="px-5 py-3 rounded-xl bg-[#18191B] hover:bg-[#2A2C30] text-white font-extrabold text-xs flex items-center gap-2 shadow-md transition-all shrink-0"
              >
                <svg className="w-4 h-4 text-[#A39B89]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>Launch New Event Wizard</span>
              </Link>
              <button
                onClick={() => setIsChatbotOpen(!isChatbotOpen)}
                className="p-3 rounded-xl bg-white border border-[#E5E7EB] text-[#18191B] hover:text-[#A39B89] hover:border-[#D4CEB8] transition-all shadow-sm shrink-0"
                title="Open Mentor Chatbot Hub"
              >
                <svg className="w-5 h-5 text-[#A39B89]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* QUICK ACTION NAVIGATION CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/events/new"
            className="card-premium p-6 flex flex-col justify-between gap-4 group hover:border-[#D4CEB8] transition-all"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-[#F8F9FB] border border-[#E5E7EB] flex items-center justify-center text-[#18191B]">
                <svg className="w-5 h-5 text-[#A39B89]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#18191B] group-hover:text-[#A39B89] transition-colors">
                Create Event (23-Phase Wizard)
              </h3>
              <p className="text-xs text-[#5E6168] leading-relaxed">
                Launch a full hackathon with custom tracks, prizes, schedule, judges, and registration rules.
              </p>
            </div>
            <span className="text-xs font-bold text-[#A39B89] flex items-center gap-1">
              Start Builder Wizard →
            </span>
          </Link>

          <Link
            to="/events"
            className="card-premium p-6 flex flex-col justify-between gap-4 group hover:border-[#D4CEB8] transition-all"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-[#F8F9FB] border border-[#E5E7EB] flex items-center justify-center text-[#18191B]">
                <svg className="w-5 h-5 text-[#A39B89]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.6 15.12a2 2 0 01-1.182-1.182l-.477-2.387a6 6 0 01.517-3.86l.158-.318a6 6 0 00.517-3.86L4.74 3.128A2 2 0 015.922 1.946l2.387.477a6 6 0 003.86-.517l.318-.158a6 6 0 013.86-.517l2.387.477a2 2 0 011.182 1.182l.477 2.387a6 6 0 01-.517 3.86l-.158.318a6 6 0 00-.517 3.86l.477 2.387a2 2 0 01-.547 1.022z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#18191B] group-hover:text-[#A39B89] transition-colors">
                Manage All Events ({events.length})
              </h3>
              <p className="text-xs text-[#5E6168] leading-relaxed">
                View published buildathons, edit event configurations, monitor registrations, or delete events.
              </p>
            </div>
            <span className="text-xs font-bold text-[#A39B89] flex items-center gap-1">
              View Events List →
            </span>
          </Link>

          <Link
            to="/users"
            className="card-premium p-6 flex flex-col justify-between gap-4 group hover:border-[#D4CEB8] transition-all"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-[#F8F9FB] border border-[#E5E7EB] flex items-center justify-center text-[#18191B]">
                <svg className="w-5 h-5 text-[#A39B89]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#18191B] group-hover:text-[#A39B89] transition-colors">
                Admin & Mentor Directory
              </h3>
              <p className="text-xs text-[#5E6168] leading-relaxed">
                Manage registered Lead Mentors and platform administrative credentials.
              </p>
            </div>
            <span className="text-xs font-bold text-[#A39B89] flex items-center gap-1">
              Open Directory →
            </span>
          </Link>
        </div>

        {/* LIVE MONGODB EVENTS STREAM */}
        <div className="card-premium p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold font-poppins text-[#18191B]">
                Live Platform Events (MongoDB Atlas)
              </h2>
              <p className="text-xs text-[#5E6168]">
                Real-time feed of hackathons and buildathons active across Turing Wings.
              </p>
            </div>
            <Link
              to="/events"
              className="px-4 py-2 rounded-xl bg-white border border-[#E5E7EB] text-[#18191B] font-bold text-xs hover:border-[#D4CEB8]"
            >
              View Full Directory
            </Link>
          </div>

          {loadingEvents ? (
            <div className="py-12 text-center text-[#5E6168] text-xs font-mono">
              Loading live events feed...
            </div>
          ) : events.length === 0 ? (
            <div className="py-12 text-center text-[#5E6168] text-xs">
              No events found. Click "Launch New Event Wizard" above to create one.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.slice(0, 4).map((evt) => (
                <div key={evt._id} className="p-4 rounded-2xl bg-white border border-[#E5E7EB] space-y-2 text-left">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {evt.status || "Published"}
                    </span>
                    <span className="text-[10px] text-[#5E6168] font-mono">
                      {evt.type || "Hackathon"}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#18191B]">{evt.name}</h3>
                  <p className="text-xs text-[#5E6168] line-clamp-2">{evt.shortDescription || evt.tagline}</p>
                  <div className="pt-2 border-t border-[#F3F4F6] flex items-center justify-between text-[10px] text-[#5E6168] font-mono">
                    <span>{evt.registrations?.length || 0} Registrations</span>
                    <Link to={`/events/edit/${evt._id}`} className="text-[#A39B89] font-bold hover:underline">
                      Edit Event →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

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
