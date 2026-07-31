import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Send, Calendar, Layers, Database, CheckCircle2, ShieldCheck, Zap
} from "lucide-react";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminDashboardPage({ currentUser }) {
  const navigate = useNavigate();

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
      publishedBy: "Pandu Ranga",
      createdAt: "Just now",
    },
    {
      id: "2",
      title: "Offensive Cyber Shield Bootcamp — Batch 01",
      category: "Bootcamp Cohort",
      startDate: "September 05, 2026",
      description: "Master zero-trust cloud architecture, vulnerability scanning, and prompt injection defense.",
      statusBadge: "UPCOMING SOON",
      publishedBy: "Ratnakar",
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
    <div className="min-h-screen bg-[#f8f6f0] text-slate-900 selection:bg-amber-500 selection:text-slate-950 flex flex-col">
      <AdminNavbar currentUser={currentUser} />

      <main className="max-w-7xl mx-auto w-full p-4 sm:p-8 overflow-y-auto text-left space-y-8">
        
        {/* MONGODB EVENT & COHORT ANNOUNCEMENT PUBLISHER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form: Post New Cohort / Hackathon */}
          <div className="lg:col-span-6 glass-white p-6 sm:p-8 rounded-3xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-800 font-bold">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold font-serif italic text-slate-900">
                  MONGODB EVENT & HACKATHON PUBLISHER
                </h2>
                <p className="text-xs text-slate-600 font-mono-tech">
                  Post new Cohorts/Hackathons directly to user website
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
                <label className="block font-bold uppercase text-slate-600 mb-1">
                  Title / Event Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI-Powered MERN Hackathon 2026"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase text-slate-600 mb-1">
                    Category
                  </label>
                  <select
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                  >
                    <option value="48-Hour Hackathon">48-Hour Hackathon</option>
                    <option value="Bootcamp Cohort">Bootcamp Cohort</option>
                    <option value="Live Masterclass">Live Masterclass</option>
                    <option value="Community Sprint">Community Sprint</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-600 mb-1">
                    Status Badge
                  </label>
                  <select
                    value={newEvent.statusBadge}
                    onChange={(e) => setNewEvent({ ...newEvent, statusBadge: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                  >
                    <option value="REGISTRATIONS OPEN">REGISTRATIONS OPEN</option>
                    <option value="UPCOMING SOON">UPCOMING SOON</option>
                    <option value="LIVE NOW">LIVE NOW</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">
                  Target Start Date
                </label>
                <input
                  type="text"
                  placeholder="e.g. August 28, 2026"
                  value={newEvent.startDate}
                  onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">
                  Description / Syllabus Summary
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Describe the cohort, rules, or curriculum details..."
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={isPublishing}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isPublishing ? "Saving to MongoDB..." : "Publish to User Website (Save to MongoDB)"}</span>
              </button>
            </form>
          </div>

          {/* Live Stream: Published Events fetched by User Website */}
          <div className="lg:col-span-6 glass-white p-6 sm:p-8 rounded-3xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-600" />
                <h2 className="text-xl font-extrabold font-serif italic text-slate-900">
                  PUBLISHED LIVE ANNOUNCEMENTS
                </h2>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                AUTO-RETRIEVED IN USER WEBSITE
              </span>
            </div>

            <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
              {publishedEvents.map((evt) => (
                <div key={evt.id} className="p-5 rounded-2xl bg-white border border-[#e2b740]/40 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/15 border border-amber-500/30 text-amber-900">
                      {evt.statusBadge}
                    </span>

                    <span className="text-[10px] text-slate-500 font-mono-tech flex items-center gap-1 font-bold">
                      <Calendar className="w-3 h-3 text-amber-600" />
                      {evt.startDate}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900">{evt.title}</h3>
                  <p className="text-xs text-slate-700 leading-relaxed">{evt.description}</p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono-tech font-semibold">
                    <span>Category: {evt.category}</span>
                    <span>By: {evt.publishedBy}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
