import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Sparkles, ArrowLeft, Save, CheckCircle2, AlertCircle, RefreshCw, Plus, Trash2,
  Calendar, Trophy, ShieldCheck, Users, Globe, Settings, FileText, HelpCircle, PhoneCall
} from "lucide-react";
import AdminNavbar from "../components/AdminNavbar";
import AdminChatWidget from "../components/AdminChatWidget";

export default function AdminEventEditorPage({ currentUser }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("basic");
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState("");
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const fetchEvent = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://turingwings-backend.onrender.com/api/events/admin/${id}`);
      if (res.ok) {
        const data = await res.json();
        setEventData(data);
      }
    } catch {
      // Error handling
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const handleSaveAll = async () => {
    setSaving(true);
    setSaveSuccess("");
    try {
      const res = await fetch(`https://turingwings-backend.onrender.com/api/events/admin/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      if (res.ok) {
        const updated = await res.json();
        setEventData(updated);
        setSaveSuccess("All 20 Event Sections Successfully Updated & Synced with Database!");
        setTimeout(() => setSaveSuccess(""), 4000);
      }
    } catch {
      alert("Error saving event configuration");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center font-sans">
        <div className="flex items-center gap-3 text-xs font-bold text-[#18191B]">
          <RefreshCw className="w-5 h-5 animate-spin text-[#A39B89]" />
          <span>Loading 20-Section Detailed Event Editor...</span>
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

  const TABS = [
    { id: "basic", label: "1. Basic Info & Theme" },
    { id: "schedule", label: "2. Schedule & Dates" },
    { id: "registration", label: "3 & 4. Reg Details & Form" },
    { id: "mode", label: "5. Mode & Venue/Links" },
    { id: "tracks", label: "6. Tracks & Domain" },
    { id: "rules", label: "7. Rules & Guidelines" },
    { id: "timeline", label: "8. Timeline Milestones" },
    { id: "problems", label: "9. Problem Statements" },
    { id: "prizes", label: "10. Prizes & Rewards" },
    { id: "judges", label: "11 & 12. Judges & Mentors" },
    { id: "sponsors", label: "13. Sponsors & Partners" },
    { id: "faqs", label: "14 & 15. FAQs & Contact" },
    { id: "submission", label: "16-19. Submissions & Certs" },
    { id: "access", label: "20. Visibility & Access" },
  ];

  return (
    <div className="min-h-screen bg-hero-gradient text-[#18191B] selection:bg-[#A39B89] selection:text-white flex flex-col font-sans text-left">
      <AdminNavbar currentUser={currentUser} toggleChatbot={() => setIsChatbotOpen(!isChatbotOpen)} />

      <main className="max-w-7xl mx-auto w-full p-4 sm:p-8 space-y-6 flex-1">
        
        {/* Editor Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-4">
          <div className="flex items-center gap-3">
            <Link to={`/events/${id}`} className="p-2 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] hover:bg-[#E5E7EB]">
              <ArrowLeft className="w-4 h-4 text-[#18191B]" />
            </Link>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-[#A39B89]">
                EXHAUSTIVE 20-SECTION EVENT EDITOR
              </span>
              <h1 className="text-2xl font-bold font-poppins text-[#18191B]">
                Editing: {eventData.title}
              </h1>
            </div>
          </div>

          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#18191B] via-[#A39B89] to-[#C9B27D] text-white font-bold text-xs shadow-lg hover:scale-105 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-white" />
            <span>{saving ? "Saving All 20 Sections..." : "Save All Changes"}</span>
          </button>
        </div>

        {saveSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccess}</span>
          </div>
        )}

        {/* Tab Navigation Menu */}
        <div className="flex overflow-x-auto pb-2 gap-2 border-b border-[#E5E7EB]">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                activeTab === t.id
                  ? "bg-[#18191B] text-white border-[#18191B] shadow-sm"
                  : "bg-[#F8F9FB] text-[#5E6168] border-[#E5E7EB] hover:border-[#A39B89]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB CONTENTS */}
        <div className="card-premium p-6 sm:p-8 rounded-3xl space-y-6">
          
          {/* TAB 1: BASIC INFORMATION */}
          {activeTab === "basic" && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-bold text-[#18191B] uppercase tracking-wider">
                1. Basic Information & Presentation Template
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#5E6168] mb-1">Event Name / Title</label>
                  <input
                    type="text"
                    value={eventData.title || ""}
                    onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] text-xs font-bold text-[#18191B]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#5E6168] mb-1">Presentation Design Template (10 Themes)</label>
                  <select
                    value={eventData.templateId || "ai-future"}
                    onChange={(e) => setEventData({ ...eventData, templateId: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] text-xs font-bold text-[#18191B]"
                  >
                    <option value="ai-future">Template 1 — AI Future (Dark Obsidian)</option>
                    <option value="cyberpunk-neon">Template 2 — Cyberpunk Neon Matrix</option>
                    <option value="space-odyssey">Template 3 — Space Odyssey Galaxy</option>
                    <option value="corporate-pro">Template 4 — Corporate Professional</option>
                    <option value="university-campus">Template 5 — University Campus</option>
                    <option value="gaming-arena">Template 6 — Gaming RGB Arena</option>
                    <option value="modern-saas">Template 7 — Modern SaaS Startup</option>
                    <option value="minimal-premium">Template 8 — Minimal Premium Gold</option>
                    <option value="creative-innovation">Template 9 — Creative Innovation</option>
                    <option value="premium-3d">Template 10 — Premium 3D Experience</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#5E6168] mb-1">Tagline</label>
                <input
                  type="text"
                  value={eventData.tagline || ""}
                  onChange={(e) => setEventData({ ...eventData, tagline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] text-xs text-[#18191B]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#5E6168] mb-1">Short Description</label>
                <textarea
                  rows="2"
                  value={eventData.shortDescription || ""}
                  onChange={(e) => setEventData({ ...eventData, shortDescription: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] text-xs text-[#18191B]"
                />
              </div>
            </div>
          )}

          {/* TAB 2: SCHEDULE & DATES */}
          {activeTab === "schedule" && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-bold text-[#18191B] uppercase tracking-wider">
                2. Event Schedule & Milestone Timings
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#5E6168] mb-1">Registration Start Date</label>
                  <input
                    type="text"
                    value={eventData.schedule?.regStartDate || ""}
                    onChange={(e) => setEventData({
                      ...eventData,
                      schedule: { ...eventData.schedule, regStartDate: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] text-xs text-[#18191B]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#5E6168] mb-1">Registration End Date</label>
                  <input
                    type="text"
                    value={eventData.schedule?.regEndDate || ""}
                    onChange={(e) => setEventData({
                      ...eventData,
                      schedule: { ...eventData.schedule, regEndDate: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] text-xs text-[#18191B]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#5E6168] mb-1">Event Start Date</label>
                  <input
                    type="text"
                    value={eventData.schedule?.eventStartDate || ""}
                    onChange={(e) => setEventData({
                      ...eventData,
                      schedule: { ...eventData.schedule, eventStartDate: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] text-xs text-[#18191B]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#5E6168] mb-1">Submission Deadline</label>
                  <input
                    type="text"
                    value={eventData.schedule?.submissionDeadline || ""}
                    onChange={(e) => setEventData({
                      ...eventData,
                      schedule: { ...eventData.schedule, submissionDeadline: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] text-xs text-[#18191B]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: TRACKS */}
          {activeTab === "tracks" && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#18191B] uppercase tracking-wider">
                  6. Event Tracks & Problem Domains
                </h3>
              </div>

              <div className="space-y-3">
                {(eventData.tracks || []).map((t, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#F8F9FB] border border-[#E5E7EB] space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Track Name"
                        value={t.name || t.title || ""}
                        onChange={(e) => {
                          const updated = [...eventData.tracks];
                          updated[idx].name = e.target.value;
                          setEventData({ ...eventData, tracks: updated });
                        }}
                        className="px-3 py-2 rounded-xl bg-white border border-[#E5E7EB] text-xs font-bold text-[#18191B]"
                      />
                      <input
                        type="text"
                        placeholder="Problem Domain"
                        value={t.problemDomain || ""}
                        onChange={(e) => {
                          const updated = [...eventData.tracks];
                          updated[idx].problemDomain = e.target.value;
                          setEventData({ ...eventData, tracks: updated });
                        }}
                        className="px-3 py-2 rounded-xl bg-white border border-[#E5E7EB] text-xs text-[#18191B]"
                      />
                      <input
                        type="text"
                        placeholder="Prize Amount"
                        value={t.prize || ""}
                        onChange={(e) => {
                          const updated = [...eventData.tracks];
                          updated[idx].prize = e.target.value;
                          setEventData({ ...eventData, tracks: updated });
                        }}
                        className="px-3 py-2 rounded-xl bg-white border border-[#E5E7EB] text-xs font-bold text-[#A39B89]"
                      />
                    </div>
                    <textarea
                      rows="2"
                      placeholder="Track Description"
                      value={t.description || ""}
                      onChange={(e) => {
                        const updated = [...eventData.tracks];
                        updated[idx].description = e.target.value;
                        setEventData({ ...eventData, tracks: updated });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#E5E7EB] text-xs text-[#18191B]"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 10: PRIZES */}
          {activeTab === "prizes" && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-bold text-[#18191B] uppercase tracking-wider">
                10. Prizes & Rewards Configuration
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#5E6168] mb-1">Total Prize Pool</label>
                  <input
                    type="text"
                    value={eventData.prizes?.prizePool || eventData.prizePool || ""}
                    onChange={(e) => setEventData({
                      ...eventData,
                      prizePool: e.target.value,
                      prizes: { ...eventData.prizes, prizePool: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] text-xs font-bold text-[#C9B27D]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#5E6168] mb-1">1st Place Winner Prize</label>
                  <input
                    type="text"
                    value={eventData.prizes?.winnerPrize || ""}
                    onChange={(e) => setEventData({
                      ...eventData,
                      prizes: { ...eventData.prizes, winnerPrize: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] text-xs font-bold text-[#18191B]"
                  />
                </div>
              </div>
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
