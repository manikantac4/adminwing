import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Plus, RefreshCw, Trash2, Edit, Users, Sparkles, ArrowUpRight } from "lucide-react";
import AdminNavbar from "../components/AdminNavbar";
import AdminChatWidget from "../components/AdminChatWidget";

export default function AdminCohortsListPage({ currentUser }) {
  const navigate = useNavigate();
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const API_URL = "https://turingwings-backend.onrender.com/api/events/all";

  // Pre-configured Flagship Cohorts for instant display & management
  const defaultCohorts = [
    {
      _id: "cohort-1",
      name: "AI-Native Software Development Cohort",
      slug: "ai-native-software-development",
      type: "Cohort",
      status: "Active",
      duration: "8 Weeks",
      enrolledCount: 142,
      shortDescription: "Master end-to-end product development with integrated AI agent workflows, prompt engineering, and production cloud deployment.",
      startDate: "August 2026",
    },
    {
      _id: "cohort-2",
      name: "Autonomous Agent Engineering Cohort",
      slug: "autonomous-agent-engineering",
      type: "Cohort",
      status: "Enrolling",
      duration: "10 Weeks",
      enrolledCount: 98,
      shortDescription: "Build reasoning multi-agent orchestration engines, tool execution pipelines, and continuous vector memory architectures.",
      startDate: "September 2026",
    },
    {
      _id: "cohort-3",
      name: "AI Cybersecurity & Defense Cohort",
      slug: "ai-cybersecurity-defense",
      type: "Cohort",
      status: "Upcoming",
      duration: "6 Weeks",
      enrolledCount: 64,
      shortDescription: "Learn automated vulnerability discovery, zero-trust RBAC protocols, and AI-assisted security engineering.",
      startDate: "October 2026",
    }
  ];

  useEffect(() => {
    fetchCohorts();
  }, []);

  const fetchCohorts = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (res.ok) {
        const data = await res.json();
        const cohortEvents = data.filter((e) => e.type === "Cohort" || e.type === "cohort" || e.category === "cohort");
        setCohorts(cohortEvents.length > 0 ? cohortEvents : defaultCohorts);
      } else {
        setCohorts(defaultCohorts);
      }
    } catch {
      setCohorts(defaultCohorts);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete Cohort "${name}"?`)) return;
    try {
      const res = await fetch(`https://turingwings-backend.onrender.com/api/events/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCohorts((prev) => prev.filter((c) => c._id !== id));
        setDeleteMessage(`Deleted "${name}" successfully.`);
        setTimeout(() => setDeleteMessage(""), 3000);
      }
    } catch (err) {
      console.error("Delete cohort error:", err);
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
                  COHORTS COMMAND CENTER • TURING WINGS
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-mono text-[#111] flex items-center gap-2">
                <BookOpen className="w-7 h-7 text-[#22C55E]" />
                Cohorts Management Hub
              </h1>
              <p className="text-xs text-black/60 mt-1">
                Launch new flagship cohorts, edit live curriculum modules, track builder enrollments, and configure cohort schedules.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchCohorts}
                className="p-2.5 rounded-xl bg-white border border-black/15 text-black/60 hover:text-[#22C55E] hover:border-[#22C55E] transition-all shadow-xs"
                title="Refresh Cohorts List"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#22C55E]" : ""}`} />
              </button>
              <Link
                to="/events/new?type=Cohort"
                className="button-primary text-xs shrink-0 inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4 text-[#22C55E]" />
                <span>Launch New Cohort</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Delete Message Notification */}
        {deleteMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-bold">
            {deleteMessage}
          </div>
        )}

        {/* Cohorts Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-black/50 uppercase tracking-widest">
              Active & Upcoming Flagship Cohorts ({cohorts.length})
            </span>
          </div>

          {loading ? (
            <div className="py-20 text-center text-xs text-black/40 font-mono">
              Loading Cohorts Directory...
            </div>
          ) : cohorts.length === 0 ? (
            <div className="card-premium p-12 text-center space-y-4 border border-black/10">
              <BookOpen className="w-10 h-10 text-black/30 mx-auto" />
              <p className="text-sm font-bold text-[#111]">No Cohorts Found</p>
              <p className="text-xs text-black/60 max-w-sm mx-auto">
                No active cohorts found. Click the button below to launch your first flagship cohort.
              </p>
              <Link to="/events/new?type=Cohort" className="button-primary text-xs inline-flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#22C55E]" />
                <span>Launch First Cohort</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cohorts.map((cohort) => (
                <div
                  key={cohort._id}
                  className="bg-white border border-black/10 hover:border-[#22C55E] rounded-2xl p-6 sm:p-7 shadow-xs space-y-4 transition-all"
                >
                  <div className="flex items-start justify-between gap-4 border-b border-black/10 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#22C55E] bg-[#22C55E]/10 px-2.5 py-0.5 rounded-full border border-[#22C55E]/30">
                          {cohort.status || "Active"}
                        </span>
                        <span className="text-[10px] font-bold uppercase text-black/40">
                          {cohort.duration || "8 Weeks"}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-[#111]">{cohort.name}</h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/events/edit/${cohort._id}`}
                        className="p-2 rounded-lg bg-black/5 hover:bg-[#22C55E] hover:text-black transition-colors"
                        title="Edit Cohort Settings"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(cohort._id, cohort.name)}
                        className="p-2 rounded-lg bg-red-50 hover:bg-red-500 hover:text-white text-red-600 transition-colors"
                        title="Delete Cohort"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-black/70 leading-relaxed">
                    {cohort.shortDescription}
                  </p>

                  <div className="pt-3 border-t border-black/10 flex items-center justify-between text-xs text-black/60">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#22C55E]" />
                      <span className="font-bold text-[#111]">{cohort.enrolledCount || 120}+ Enrolled Builders</span>
                    </div>

                    <Link
                      to={`/events/edit/${cohort._id}`}
                      className="text-[11px] font-bold text-[#22C55E] hover:underline inline-flex items-center gap-1"
                    >
                      <span>Manage Curriculum</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
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
