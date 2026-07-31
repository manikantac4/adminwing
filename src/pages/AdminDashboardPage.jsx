import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Send, Calendar, Layers, Database, CheckCircle2, ShieldCheck, Zap,
  MessageSquare, Sparkles, Plus, Radio, ArrowRight
} from "lucide-react";
import AdminNavbar from "../components/AdminNavbar";
import AdminChatWidget from "../components/AdminChatWidget";

export default function AdminDashboardPage({ currentUser, onStartCall }) {
  const navigate = useNavigate();

  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // Form state for publishing new Cohort/Hackathon to MongoDB Atlas
  const [newEvent, setNewEvent] = useState({
    title: "",
    category: "48-Hour Hackathon",
    startDate: "August 28, 2026",
    description: "",
    statusBadge: "REGISTRATIONS OPEN",
  });

  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Simulated live MongoDB Atlas Announcements Collection
  const [publishedEvents, setPublishedEvents] = useState([
    {
      id: "1",
      title: "Global Vibe Coding 48-Hour Sprint",
      category: "48-Hour Hackathon",
      startDate: "August 28, 2026",
      description: "Build full-stack web applications with Cursor AI & Node.js swarms in 48 hours.",
      statusBadge: "REGISTRATIONS OPEN",
      publishedBy: "Pandu Ranga Tummuri",
      createdAt: "Just now",
    },
    {
      id: "2",
      title: "Offensive Cyber Shield Bootcamp — Batch 01",
      category: "Bootcamp Cohort",
      startDate: "September 05, 2026",
      description: "Master zero-trust cloud architecture, vulnerability scanning, and prompt injection defense.",
      statusBadge: "UPCOMING SOON",
      publishedBy: "Ratnakar Karasala",
      createdAt: "2 hours ago",
    },
  ]);

  const handlePublishToUserWebsite = (e) => {
    e.preventDefault();
    if (!newEvent.title.trim() || !newEvent.description.trim()) return;

    setIsPublishing(true);

    setTimeout(() => {
      const created = {
        id: Date.now().toString(),
        ...newEvent,
        publishedBy: currentUser?.name || "Lead Mentor",
        createdAt: "Just now",
      };

      setPublishedEvents((prev) => [created, ...prev]);
      setIsPublishing(false);
      setPublishSuccess(true);

      setNewEvent({
        title: "",
        category: "48-Hour Hackathon",
        startDate: "September 15, 2026",
        description: "",
        statusBadge: "REGISTRATIONS OPEN",
      });

      setTimeout(() => setPublishSuccess(false), 3000);
    }, 800);
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
                Mentor Control Gateway & Announcement Publisher
              </h1>
              <p className="text-xs text-[#5E6168] mt-1">
                Manage upcoming cohorts, hackathons, and real-time mentor communications.
              </p>
            </div>

            <button
              onClick={() => setIsChatbotOpen(!isChatbotOpen)}
              className="btn-hero-gradient px-5 py-3 rounded-xl font-bold text-xs flex items-center gap-2 shadow-glow hover:scale-105 transition-all shrink-0"
            >
              <MessageSquare className="w-4 h-4 text-[#C9B27D]" />
              <span>Open Mentor Chatbot Hub</span>
            </button>
          </div>
        </div>

        {/* MONGODB EVENT & COHORT ANNOUNCEMENT PUBLISHER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form: Post New Cohort / Hackathon */}
          <div className="lg:col-span-6 card-premium p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F8F9FB] border border-[#E5E7EB] flex items-center justify-center text-[#18191B] font-bold">
                <Database className="w-5 h-5 text-[#A39B89]" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-poppins text-[#18191B]">
                  MongoDB Event & Cohort Publisher
                </h2>
                <p className="text-xs text-[#5E6168]">
                  Post new Cohorts/Hackathons directly to user website database
                </p>
              </div>
            </div>

            {publishSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Published to MongoDB Atlas! User website will auto-retrieve.</span>
              </div>
            )}

            <form onSubmit={handlePublishToUserWebsite} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase text-[#5E6168] mb-1">
                  Title / Event Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI-Powered MERN Hackathon 2026"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-xs text-[#18191B] focus:outline-none focus:border-[#A39B89]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase text-[#5E6168] mb-1">
                    Category
                  </label>
                  <select
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-xs text-[#18191B] focus:outline-none focus:border-[#A39B89]"
                  >
                    <option value="48-Hour Hackathon">48-Hour Hackathon</option>
                    <option value="Bootcamp Cohort">Bootcamp Cohort</option>
                    <option value="Live Masterclass">Live Masterclass</option>
                    <option value="Community Sprint">Community Sprint</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase text-[#5E6168] mb-1">
                    Status Badge
                  </label>
                  <select
                    value={newEvent.statusBadge}
                    onChange={(e) => setNewEvent({ ...newEvent, statusBadge: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-xs text-[#18191B] focus:outline-none focus:border-[#A39B89]"
                  >
                    <option value="REGISTRATIONS OPEN">REGISTRATIONS OPEN</option>
                    <option value="UPCOMING SOON">UPCOMING SOON</option>
                    <option value="LIVE NOW">LIVE NOW</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-[#5E6168] mb-1">
                  Target Start Date
                </label>
                <input
                  type="text"
                  placeholder="e.g. August 28, 2026"
                  value={newEvent.startDate}
                  onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-xs text-[#18191B] focus:outline-none focus:border-[#A39B89]"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-[#5E6168] mb-1">
                  Description / Syllabus Summary
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Describe the cohort, rules, or curriculum details..."
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-xs text-[#18191B] focus:outline-none focus:border-[#A39B89]"
                />
              </div>

              <button
                type="submit"
                disabled={isPublishing}
                className="w-full py-3.5 btn-primary-custom font-bold text-xs shadow-md flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-[#C9B27D]" />
                <span>{isPublishing ? "Saving to MongoDB..." : "Publish to User Website (Save to MongoDB)"}</span>
              </button>
            </form>
          </div>

          {/* Live Stream: Published Events fetched by User Website */}
          <div className="lg:col-span-6 card-premium p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#A39B89]" />
                <h2 className="text-xl font-bold font-poppins text-[#18191B]">
                  Published Live Announcements
                </h2>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-[#F8F9FB] text-[#18191B] border border-[#E5E7EB]">
                AUTO-RETRIEVED ON WEBSITE
              </span>
            </div>

            <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
              {publishedEvents.map((evt) => (
                <div key={evt.id} className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#F8F9FB] border border-[#E5E7EB] text-[#18191B]">
                      {evt.statusBadge}
                    </span>

                    <span className="text-[10px] text-[#5E6168] font-mono flex items-center gap-1 font-bold">
                      <Calendar className="w-3 h-3 text-[#A39B89]" />
                      {evt.startDate}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#18191B] font-poppins">{evt.title}</h3>
                  <p className="text-xs text-[#5E6168] leading-relaxed">{evt.description}</p>

                  <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-between text-[10px] text-[#8B9098] font-mono font-semibold">
                    <span>Category: {evt.category}</span>
                    <span>By: {evt.publishedBy}</span>
                  </div>
                </div>
              ))}
            </div>
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
