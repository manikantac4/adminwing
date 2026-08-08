import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, BookOpen, ShieldCheck, Users, ArrowUpRight, Activity, Layers, Calendar, CheckCircle2 } from "lucide-react";
import AdminNavbar from "../components/AdminNavbar";
import AdminChatWidget from "../components/AdminChatWidget";
import { secureFetch, deduplicateItems } from "../utils/api";

export default function AdminDashboardPage({ currentUser }) {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  // Pre-configured Flagship Cohorts overview
  const defaultCohorts = deduplicateItems([
    {
      _id: "cohort-1",
      name: "AI-Native Software Development Cohort",
      status: "Active",
      duration: "8 Weeks",
      enrolledCount: 142,
      startDate: "August 2026",
    },
    {
      _id: "cohort-2",
      name: "Autonomous Agent Engineering Cohort",
      status: "Enrolling",
      duration: "10 Weeks",
      enrolledCount: 98,
      startDate: "September 2026",
    },
    {
      _id: "cohort-3",
      name: "AI Cybersecurity & Defense Cohort",
      status: "Upcoming",
      duration: "6 Weeks",
      enrolledCount: 64,
      startDate: "October 2026",
    },
  ]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoadingEvents(true);
      const res = await secureFetch("https://turingwings-backend.onrender.com/api/events/all");
      if (res.ok) {
        const data = await res.json();
        setEvents(deduplicateItems(data));
      }
    } catch (err) {
      console.error("Error loading events for dashboard:", err);
    } finally {
      setLoadingEvents(false);
    }
  };

  const buildathonEvents = deduplicateItems(events.filter((e) => e.type !== "Cohort" && e.type !== "cohort"));

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#090909] selection:bg-[#22C55E] selection:text-black flex flex-col font-mono">
      <AdminNavbar
        currentUser={currentUser}
        unreadCount={2}
        toggleChatbot={() => setIsChatbotOpen(!isChatbotOpen)}
      />

      <main className="max-w-7xl mx-auto w-full p-4 sm:p-8 overflow-y-auto text-left space-y-8 flex-1">
        
        {/* HQ COMMAND CENTER HEADER */}
        <div className="card-premium p-6 sm:p-8 space-y-4 border border-black/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-pulse" />
                <span className="text-xs font-bold uppercase text-[#22C55E] font-mono">
                  HQ COMMAND CENTER • TURING WINGS
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-mono text-[#111] flex items-center gap-2.5">
                <LayoutDashboard className="w-7 h-7 text-[#22C55E]" />
                <span>Cohort Command Center & Buildathon Manager</span>
              </h1>
              <p className="text-xs text-black/60 mt-1 max-w-3xl">
                Monitor active flagship cohorts, manage enrolled builder squads, track live buildathon submissions, and oversee platform engineering.
              </p>
            </div>
          </div>
        </div>

        {/* METRICS STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white border border-black/10 rounded-2xl p-6 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-black/50">
                Active Flagship Cohorts
              </span>
              <p className="text-3xl font-bold text-[#111]">{defaultCohorts.length}</p>
              <span className="text-[11px] font-bold text-[#22C55E] inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>3 Programs Enrolling</span>
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center text-[#22C55E]">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white border border-black/10 rounded-2xl p-6 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-black/50">
                Live Buildathons & Events
              </span>
              <p className="text-3xl font-bold text-[#111]">{buildathonEvents.length || 4}</p>
              <span className="text-[11px] font-bold text-[#22C55E] inline-flex items-center gap-1">
                <Activity className="w-3.5 h-3.5" />
                <span>Active Sprints</span>
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center text-[#22C55E]">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white border border-black/10 rounded-2xl p-6 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-black/50">
                Total Enrolled Builders
              </span>
              <p className="text-3xl font-bold text-[#111]">304+</p>
              <span className="text-[11px] font-bold text-black/60 inline-flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#22C55E]" />
                <span>Global Engineers</span>
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-black/5 border border-black/10 flex items-center justify-center text-black/70">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* SECTION 1: CURRENT ACTIVE COHORTS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#22C55E]" />
              <h2 className="text-lg font-bold text-[#111]">Current Active Cohorts</h2>
            </div>
            <Link
              to="/cohorts"
              className="text-xs font-bold text-[#22C55E] hover:underline inline-flex items-center gap-1"
            >
              <span>View All Cohorts</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {defaultCohorts.map((cohort) => (
              <div
                key={cohort._id}
                className="bg-white border border-black/10 hover:border-[#22C55E] rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#22C55E] bg-[#22C55E]/10 px-2.5 py-0.5 rounded-full border border-[#22C55E]/30">
                      {cohort.status}
                    </span>
                    <span className="text-[10px] font-bold text-black/40">
                      {cohort.duration}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#111] leading-snug">
                    {cohort.name}
                  </h3>
                </div>

                <div className="pt-3 border-t border-black/10 flex items-center justify-between text-xs text-black/60">
                  <div className="flex items-center gap-1.5 font-bold text-[#111]">
                    <Users className="w-4 h-4 text-[#22C55E]" />
                    <span>{cohort.enrolledCount} Builders</span>
                  </div>
                  <Link
                    to="/cohorts"
                    className="p-2 rounded-lg bg-black/5 hover:bg-[#22C55E] hover:text-black transition-colors"
                    title="Cohort Details"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: CURRENT LIVE BUILDATHONS & EVENTS */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#22C55E]" />
              <h2 className="text-lg font-bold text-[#111]">Current Live Buildathons & Events</h2>
            </div>
            <Link
              to="/events"
              className="text-xs font-bold text-[#22C55E] hover:underline inline-flex items-center gap-1"
            >
              <span>Manage Events</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {loadingEvents ? (
            <div className="py-12 text-center text-xs text-black/40 font-mono">
              Loading Events Directory...
            </div>
          ) : buildathonEvents.length === 0 ? (
            <div className="bg-white border border-black/10 rounded-2xl p-8 text-center text-xs text-black/60">
              No live buildathons active currently.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {buildathonEvents.map((evt) => (
                <div
                  key={evt._id}
                  className="bg-white border border-black/10 hover:border-[#22C55E] rounded-2xl p-6 shadow-xs space-y-4 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#22C55E] bg-[#22C55E]/10 px-2.5 py-0.5 rounded-full border border-[#22C55E]/30">
                          {evt.type || "Buildathon"}
                        </span>
                        <span className="text-[10px] font-bold text-black/40">
                          {evt.status || "Live"}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-[#111]">{evt.name}</h3>
                    </div>

                    <Link
                      to="/events"
                      className="p-2 rounded-lg bg-black/5 hover:bg-[#22C55E] hover:text-black transition-colors"
                      title="Manage Buildathon"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>

                  <p className="text-xs text-black/70 leading-relaxed line-clamp-2">
                    {evt.shortDescription || evt.tagline || "High-speed developer innovation sprint."}
                  </p>

                  <div className="pt-3 border-t border-black/10 flex items-center justify-between text-xs text-black/60">
                    <div className="flex items-center gap-1.5 font-bold text-[#111]">
                      <Calendar className="w-4 h-4 text-[#22C55E]" />
                      <span>{evt.schedule?.eventStart ? new Date(evt.schedule.eventStart).toLocaleDateString() : "Active Sprints"}</span>
                    </div>

                    <Link
                      to="/events"
                      className="text-xs font-bold text-[#22C55E] hover:underline"
                    >
                      Event Portal Link ➔
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

      <AdminChatWidget isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </div>
  );
}
