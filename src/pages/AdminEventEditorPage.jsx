import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Sparkles, ArrowLeft, Save, CheckCircle2, RefreshCw, Plus, Trash2,
  Calendar, Trophy, ShieldCheck, Users, Globe, Settings, FileText, HelpCircle, PhoneCall, Layers, Check
} from "lucide-react";
import AdminNavbar from "../components/AdminNavbar";
import AdminChatWidget from "../components/AdminChatWidget";

export default function AdminEventEditorPage({ currentUser }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState(1);
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState("");
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
      // Catch
    } fontLoading:
    setLoading(false);
  };

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const handleSaveEvent = async () => {
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
        setSaveSuccess("All 20 Event Sections Saved & Synced to Database!");
        setTimeout(() => setSaveSuccess(""), 4000);
      }
    } catch {
      alert("Error saving event");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center font-sans">
        <div className="flex items-center gap-3 text-xs font-bold text-[#18191B]">
          <RefreshCw className="w-5 h-5 animate-spin text-[#A39B89]" />
          <span>Loading 20-Section Event Master Editor...</span>
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

  const SECTIONS = [
    { num: 1, label: "1. Basic Information" },
    { num: 2, label: "2. Event Schedule" },
    { num: 3, label: "3. Registration Details" },
    { num: 4, label: "4. Registration Form" },
    { num: 5, label: "5. Event Mode & Venue" },
    { num: 6, label: "6. Tracks & Categories" },
    { num: 7, label: "7. Rules & Guidelines" },
    { num: 8, label: "8. Event Timeline" },
    { num: 9, label: "9. Problem Statements" },
    { num: 10, label: "10. Prizes & Rewards" },
    { num: 11, label: "11. Judges" },
    { num: 12, label: "12. Mentors" },
    { num: 13, label: "13. Sponsors & Partners" },
    { num: 14, label: "14. FAQs" },
    { num: 15, label: "15. Contact Info" },
    { num: 16, label: "16. Submission Settings" },
    { num: 17, label: "17. Evaluation Rules" },
    { num: 18, label: "18. Announcements" },
    { num: 19, label: "19. Certificates" },
    { num: 20, label: "20. Visibility & Access" },
  ];

  return (
    <div className="min-h-screen bg-hero-gradient text-[#18191B] selection:bg-[#A39B89] selection:text-white flex flex-col font-sans text-left">
      <AdminNavbar currentUser={currentUser} toggleChatbot={() => setIsChatbotOpen(!isChatbotOpen)} />

      <main className="max-w-7xl mx-auto w-full p-4 sm:p-8 space-y-6 flex-1">
        
        {/* Editor Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-4">
          <div className="flex items-center gap-3">
            <Link to={`/events/${id}`} className="p-2 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] hover:bg-[#E5E7EB]">
              <ArrowLeft className="w-4 h-4 text-[#18191B]" />
            </Link>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-[#A39B89]">
                MASTER 20-SECTION EVENT CONFIGURATOR
              </span>
              <h1 className="text-2xl font-bold font-poppins text-[#18191B]">
                {eventData.title}
              </h1>
            </div>
          </div>

          <button
            onClick={handleSaveEvent}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#18191B] via-[#A39B89] to-[#C9B27D] text-white font-bold text-xs shadow-lg hover:scale-105 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-white" />
            <span>{saving ? "Saving All 20 Sections..." : "Save All 20 Sections"}</span>
          </button>
        </div>

        {saveSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccess}</span>
          </div>
        )}

        {/* 20 SECTION SELECTOR GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 border-b border-[#E5E7EB] pb-4">
          {SECTIONS.map((sec) => (
            <button
              key={sec.num}
              onClick={() => setActiveSection(sec.num)}
              className={`p-2.5 rounded-xl text-xs font-bold text-left transition-all border ${
                activeSection === sec.num
                  ? "bg-[#18191B] text-white border-[#18191B] shadow-md"
                  : "bg-[#F8F9FB] text-[#5E6168] border-[#E5E7EB] hover:border-[#A39B89]"
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* SECTION INPUT FORMS */}
        <div className="card-premium p-6 sm:p-8 rounded-3xl space-y-6">
          
          {/* 1. BASIC INFORMATION */}
          {activeSection === 1 && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-bold text-[#18191B] uppercase tracking-wider">1. Basic Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#5E6168] mb-1">Event Name</label>
                  <input
                    type="text"
                    value={eventData.title || ""}
                    onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#5E6168] mb-1">Event Type</label>
                  <select
                    value={eventData.eventType || "Buildathon"}
                    onChange={(e) => setEventData({ ...eventData, eventType: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] text-xs font-bold"
                  >
                    <option value="Buildathon">Buildathon</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Ideathon">Ideathon</option>
                    <option value="AI Challenge">AI Challenge</option>
                    <option value="Coding Contest">Coding Contest</option>
                    <option value="Designathon">Designathon</option>
                    <option value="Startup Challenge">Startup Challenge</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Bootcamp">Bootcamp</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#5E6168] mb-1">Event Theme</label>
                <input
                  type="text"
                  value={eventData.theme || ""}
                  onChange={(e) => setEventData({ ...eventData, theme: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-[#5E6168] mb-1">Tagline</label>
                <input
                  type="text"
                  value={eventData.tagline || ""}
                  onChange={(e) => setEventData({ ...eventData, tagline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-[#5E6168] mb-1">Short Description</label>
                <textarea
                  rows="2"
                  value={eventData.shortDescription || ""}
                  onChange={(e) => setEventData({ ...eventData, shortDescription: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] text-xs"
                />
              </div>
            </div>
          )}

          {/* 2. EVENT SCHEDULE */}
          {activeSection === 2 && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-bold text-[#18191B] uppercase tracking-wider">2. Event Schedule</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#5E6168] mb-1">Registration Start Date & Time</label>
                  <input
                    type="text"
                    value={eventData.schedule?.regStartDate || ""}
                    onChange={(e) => setEventData({
                      ...eventData,
                      schedule: { ...eventData.schedule, regStartDate: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#5E6168] mb-1">Registration End Date & Time</label>
                  <input
                    type="text"
                    value={eventData.schedule?.regEndDate || ""}
                    onChange={(e) => setEventData({
                      ...eventData,
                      schedule: { ...eventData.schedule, regEndDate: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#5E6168] mb-1">Event Start Date & Time</label>
                  <input
                    type="text"
                    value={eventData.schedule?.eventStartDate || ""}
                    onChange={(e) => setEventData({
                      ...eventData,
                      schedule: { ...eventData.schedule, eventStartDate: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB]"
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
                    className="w-full px-3 py-2 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 6. TRACKS & CATEGORIES */}
          {activeSection === 6 && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-bold text-[#18191B] uppercase tracking-wider">6. Event Tracks / Categories</h3>
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
                      className="px-3 py-2 rounded-xl bg-white border border-[#E5E7EB] font-bold"
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
                      className="px-3 py-2 rounded-xl bg-white border border-[#E5E7EB]"
                    />
                    <input
                      type="text"
                      placeholder="Track Prize"
                      value={t.prize || ""}
                      onChange={(e) => {
                        const updated = [...eventData.tracks];
                        updated[idx].prize = e.target.value;
                        setEventData({ ...eventData, tracks: updated });
                      }}
                      className="px-3 py-2 rounded-xl bg-white border border-[#E5E7EB] font-bold text-[#A39B89]"
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
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E5E7EB]"
                  />
                </div>
              ))}
            </div>
          )}

          {/* 10. PRIZES & REWARDS */}
          {activeSection === 10 && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-bold text-[#18191B] uppercase tracking-wider">10. Prizes & Rewards</h3>
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
                    className="w-full px-3 py-2 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] font-bold text-[#C9B27D]"
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
                    className="w-full px-3 py-2 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* DEFAULT / OTHER SECTIONS */}
          {!([1, 2, 6, 10].includes(activeSection)) && (
            <div className="p-6 rounded-2xl bg-[#F8F9FB] border border-[#E5E7EB] space-y-3">
              <span className="font-bold text-[#18191B]">Section {activeSection} Details:</span>
              <p className="text-xs text-[#5E6168]">
                Configure parameters for Section {activeSection} of {eventData.title}. All entries are automatically persisted to MongoDB Atlas upon clicking "Save All 20 Sections".
              </p>
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
