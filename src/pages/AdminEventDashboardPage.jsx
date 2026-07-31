import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Sparkles, ArrowLeft, Users, Trophy, Eye, CheckCircle2, AlertCircle,
  Play, Pause, Archive, Settings, RefreshCw, FileText, ChevronRight, Layers
} from "lucide-react";
import AdminNavbar from "../components/AdminNavbar";
import AdminChatWidget from "../components/AdminChatWidget";

const LIFECYCLE_STAGES = [
  "Draft",
  "Registration Open",
  "Registration Closed",
  "Live Event",
  "Judging",
  "Results Published",
  "Archived",
];

export default function AdminEventDashboardPage({ currentUser }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const fetchEventDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://turingwings-backend.onrender.com/api/events/admin/${id}`);
      if (res.ok) {
        const data = await res.json();
        setEventData(data);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const handleUpdateStatus = async (newStatus) => {
    setUpdating(true);
    try {
      const res = await fetch(`https://turingwings-backend.onrender.com/api/events/admin/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const updated = await res.json();
        setEventData(updated);
        setStatusMessage(`Event lifecycle updated to: "${newStatus}"`);
        setTimeout(() => setStatusMessage(""), 3000);
      }
    } catch {
      alert("Failed to update event stage");
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateTemplate = async (newTemplateId) => {
    setUpdating(true);
    try {
      const res = await fetch(`https://turingwings-backend.onrender.com/api/events/admin/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId: newTemplateId }),
      });

      if (res.ok) {
        const updated = await res.json();
        setEventData(updated);
        setStatusMessage(`Design Template switched to: "${newTemplateId}"`);
        setTimeout(() => setStatusMessage(""), 3000);
      }
    } catch {
      alert("Failed to switch template");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center font-sans">
        <div className="flex items-center gap-3 text-xs font-bold text-[#18191B]">
          <RefreshCw className="w-5 h-5 animate-spin text-[#A39B89]" />
          <span>Loading Event Management Hub...</span>
        </div>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] p-8 text-left font-sans">
        <button onClick={() => navigate("/")} className="text-xs font-bold text-[#A39B89]">
          ← Back to Dashboard
        </button>
        <p className="mt-4 font-bold text-red-600">Event record not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hero-gradient text-[#18191B] flex flex-col font-sans text-left">
      <AdminNavbar currentUser={currentUser} toggleChatbot={() => setIsChatbotOpen(!isChatbotOpen)} />

      <main className="max-w-7xl mx-auto w-full p-4 sm:p-8 space-y-6 flex-1">
        
        {/* Top Breadcrumb & Status Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-2 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] hover:bg-[#E5E7EB]">
              <ArrowLeft className="w-4 h-4 text-[#18191B]" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-[#18191B] text-white">
                  {eventData.eventType}
                </span>
                <span className="text-xs font-mono text-[#A39B89] font-bold">
                  Template: {eventData.templateId}
                </span>
              </div>
              <h1 className="text-2xl font-bold font-poppins text-[#18191B] mt-0.5">
                {eventData.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/events/edit/${eventData._id}`}
              className="px-3.5 py-2 rounded-xl bg-[#18191B] text-white text-xs font-bold hover:bg-[#A39B89] flex items-center gap-1.5 shadow-sm"
            >
              <Settings className="w-3.5 h-3.5 text-[#C9B27D]" />
              <span>Edit 20 Sections</span>
            </Link>

            <a
              href={`https://vybeai.turingwings.org/event-engine/${eventData.slug}`}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] text-xs font-bold text-[#18191B] hover:bg-[#E5E7EB] flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-[#A39B89]" />
              <span>Public Standalone Site</span>
            </a>
          </div>
        </div>

        {statusMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Analytics Statistics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="card-premium p-5 rounded-3xl space-y-1">
            <span className="text-[10px] font-bold uppercase text-[#5E6168] font-mono">REGISTRATIONS</span>
            <p className="text-2xl font-black text-[#18191B]">{eventData.analytics?.registrationsCount || eventData.participants?.length || 0}</p>
            <span className="text-[10px] text-emerald-600 font-bold">Active Participant Applications</span>
          </div>

          <div className="card-premium p-5 rounded-3xl space-y-1">
            <span className="text-[10px] font-bold uppercase text-[#5E6168] font-mono">TEAMS</span>
            <p className="text-2xl font-black text-[#A39B89]">{eventData.analytics?.teamsCount || 0}</p>
            <span className="text-[10px] text-[#5E6168]">Registered Squads</span>
          </div>

          <div className="card-premium p-5 rounded-3xl space-y-1">
            <span className="text-[10px] font-bold uppercase text-[#5E6168] font-mono">PAGE VIEWS</span>
            <p className="text-2xl font-black text-[#18191B]">{eventData.analytics?.viewsCount || 1}</p>
            <span className="text-[10px] text-[#5E6168]">Unique Visitors</span>
          </div>

          <div className="card-premium p-5 rounded-3xl space-y-1">
            <span className="text-[10px] font-bold uppercase text-[#5E6168] font-mono">PRIZE POOL</span>
            <p className="text-2xl font-black text-[#C9B27D]">{eventData.prizePool}</p>
            <span className="text-[10px] text-[#5E6168]">{eventData.mode} Event</span>
          </div>
        </div>

        {/* LIFECYCLE STAGE CONTROLLER */}
        <div className="card-premium p-6 rounded-3xl space-y-4">
          <h3 className="text-sm font-bold text-[#18191B] uppercase tracking-wider">
            Automated Event Lifecycle Control
          </h3>

          <div className="flex flex-wrap gap-2">
            {LIFECYCLE_STAGES.map((stage) => {
              const isActive = eventData.status === stage;
              return (
                <button
                  key={stage}
                  onClick={() => handleUpdateStatus(stage)}
                  disabled={updating}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    isActive
                      ? "bg-[#18191B] text-white border-[#18191B] shadow-md scale-105"
                      : "bg-[#F8F9FB] border-[#E5E7EB] text-[#5E6168] hover:border-[#A39B89]"
                  }`}
                >
                  {stage}
                </button>
              );
            })}
          </div>
        </div>

        {/* TEMPLATE SWITCHER & PARTICIPANTS ROSTER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Change Design Template on the Fly */}
          <div className="lg:col-span-4 card-premium p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-bold text-[#18191B] uppercase tracking-wider">
              Switch Design Template
            </h3>

            <div className="space-y-2 text-xs">
              {[
                { id: "ai-future", name: "AI Future (Dark Obsidian)" },
                { id: "cyberpunk-neon", name: "Cyberpunk Neon" },
                { id: "minimal-white", name: "Minimal White & Gold" },
                { id: "space-galaxy", name: "Space Galaxy" },
                { id: "gradient-modern", name: "Gradient Modern" },
                { id: "gaming-rgb", name: "Gaming RGB" },
              ].map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => handleUpdateTemplate(tmpl.id)}
                  disabled={updating}
                  className={`w-full p-3 rounded-xl border text-left font-bold transition-all flex items-center justify-between ${
                    eventData.templateId === tmpl.id
                      ? "bg-[#18191B] text-white border-[#18191B]"
                      : "bg-[#F8F9FB] text-[#5E6168] border-[#E5E7EB] hover:border-[#A39B89]"
                  }`}
                >
                  <span>{tmpl.name}</span>
                  {eventData.templateId === tmpl.id && <CheckCircle2 className="w-4 h-4 text-[#C9B27D]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Participant Applications List */}
          <div className="lg:col-span-8 card-premium p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#18191B] uppercase tracking-wider">
                Participant Applications ({eventData.participants?.length || 0})
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E5E7EB] text-[#5E6168]">
                    <th className="py-2.5 px-3 font-bold">NAME</th>
                    <th className="py-2.5 px-3 font-bold">EMAIL</th>
                    <th className="py-2.5 px-3 font-bold">TEAM</th>
                    <th className="py-2.5 px-3 font-bold">GITHUB</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {(!eventData.participants || eventData.participants.length === 0) ? (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-[#8B9098]">
                        No participant applications yet for this event.
                      </td>
                    </tr>
                  ) : (
                    eventData.participants.map((p, idx) => (
                      <tr key={idx} className="hover:bg-[#F8F9FB] font-medium">
                        <td className="py-2.5 px-3 font-bold text-[#18191B]">{p.name}</td>
                        <td className="py-2.5 px-3 text-[#5E6168]">{p.email}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-[#A39B89]">{p.teamName || "Solo"}</td>
                        <td className="py-2.5 px-3 text-[#5E6168]">{p.github || "N/A"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

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
