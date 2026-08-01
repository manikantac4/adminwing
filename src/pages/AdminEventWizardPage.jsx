import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Calendar, Check, ChevronLeft, ChevronRight, Plus, Trash2, Trophy,
  Users, Award, Sparkles, Layers, Shield, HelpCircle, Mail, MapPin,
  Eye, Save, Send, Image as ImageIcon, Video, Code, FileText, CheckCircle2
} from "lucide-react";
import AdminNavbar from "../components/AdminNavbar";

const STEPS = [
  "📋 Basic Info",
  "🎨 Branding",
  "🖼️ Template & Theme",
  "📅 Schedule & Timeline",
  "📝 Registration Config",
  "❓ Custom Questions",
  "👥 Eligibility Rules",
  "🚀 Tracks",
  "⚖️ Event Rules",
  "🏆 Prizes",
  "👨‍⚖️ Judges & Mentors",
  "🤝 Sponsors",
  "📍 Venue & Support",
  "📢 Live Settings",
  "📜 Certificates",
  "✅ Preview & Publish",
];

const INITIAL_EVENT_STATE = {
  name: "",
  shortName: "",
  slug: "",
  type: "Hackathon",
  theme: "AI & Autonomous Systems",
  tagline: "",
  shortDescription: "",
  fullDescription: "",
  objectives: ["Build innovative software solutions", "Demonstrate speed and collaboration"],
  vision: "Empowering developers to transform ambitious ideas into reality.",
  expectedOutcomes: ["Working GitHub code repository", "Live web app URL"],
  status: "Draft",

  logo: "",
  heroBanner: "",
  heroBackground: "",
  thumbnail: "",
  socialShareImage: "",
  galleryImages: [],
  introVideo: "",
  promoVideo: "",
  brandColors: { primary: "#d97706", secondary: "#0f172a", accent: "#f59e0b" },

  templateId: "ai-future",
  backgroundStyle: "particles",

  schedule: {
    registrationOpen: "",
    registrationClose: "",
    teamFormationDeadline: "",
    orientationDate: "",
    eventStart: "",
    problemRevealDate: "",
    mentorSessionDate: "",
    midEvalDate: "",
    submissionDeadline: "",
    presentationRoundDate: "",
    winnerAnnouncementDate: "",
    certificateReleaseDate: "",
  },

  registrationConfig: {
    registrationType: "Team",
    minTeamSize: 1,
    maxTeamSize: 4,
    approvalType: "Auto",
    capacity: 500,
    waitlistEnabled: true,
  },

  customQuestions: [
    { id: "1", question: "Why do you want to participate?", type: "text", required: true },
  ],

  eligibility: {
    category: "Open for All",
    collegeRestrictions: "None",
    graduationYears: ["2025", "2026", "2027", "2028"],
    ageLimit: "16+",
  },

  tracks: [
    { id: "1", name: "AI & Machine Learning", icon: "Bot", description: "Build cutting-edge AI agents or generative tools.", banner: "" },
    { id: "2", name: "Web3 & Cloud Security", icon: "Shield", description: "Design decentralized, zero-trust cloud microservices.", banner: "" },
  ],

  rules: {
    generalRules: ["Participants must abide by the Turing Wings Code of Conduct.", "All code must be written during the event duration."],
    teamRules: ["Teams can consist of 1 to 4 members.", "Cross-college and cross-company teams are permitted."],
    submissionRules: ["Repositories must include a detailed README and setup instructions."],
    evaluationRules: ["Projects will be judged on Innovation, Technical Depth, UI/UX, and Impact."],
    codeOfConduct: "Be respectful, collaborative, and ethical at all times.",
    disqualificationRules: ["Plagiarism or pre-existing code submissions will lead to immediate disqualification."],
  },

  prizes: [
    { title: "Grand Winner (1st Place)", reward: "$5,000 Cash + Incubator Pass", category: "Overall", cashAmount: 5000, swag: "Exclusive Trophy + Swag Kit", icon: "Trophy" },
    { title: "Runner Up (2nd Place)", reward: "$2,500 Cash", category: "Runner Up", cashAmount: 2500, swag: "Turing Wings Hoodie", icon: "Award" },
  ],

  judges: [
    { id: "1", name: "Ratnakar Karasala", company: "Turing Wings HQ", designation: "Cybersecurity Lead", bio: "Expert in zero-trust architectures and cloud security.", photo: "", linkedin: "" },
  ],

  mentors: [
    { id: "1", name: "Sahith Akula", company: "Turing Wings HQ", designation: "Backend Lead", bio: "Specialist in microservices and distributed agent swarms.", photo: "", linkedin: "" },
  ],

  sponsors: [
    { id: "1", name: "Turing Wings", logo: "", website: "https://turingwings.com", description: "Title Sponsor", tier: "Title" },
  ],

  faqs: [
    { question: "Is the event free?", answer: "Yes, participation is 100% free.", category: "General" },
  ],

  contact: {
    coordinatorName: "Manoj Kumar Allu",
    coordinatorEmail: "contact@turingwings.com",
    coordinatorPhone: "+91 9876543210",
    discord: "https://discord.gg/turingwings",
    whatsapp: "https://chat.whatsapp.com/turingwings",
  },

  venue: {
    type: "Online",
    name: "Turing Wings Virtual Portal",
    address: "Online Global Platform",
  },

  liveSettings: {
    enableLiveDashboard: true,
    enableLeaderboard: true,
    enableAnnouncements: true,
    enableCountdown: true,
    enableChat: true,
    enableSubmissionPortal: true,
  },

  submissionSettings: {
    allowedTypes: ["GitHub", "ZIP", "PDF", "Video"],
    maxFileSizeMb: 50,
    allowResubmission: true,
  },

  seo: {
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    visibility: "Public",
  },
};

export default function AdminEventWizardPage({ currentUser }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [formData, setFormData] = useState(INITIAL_EVENT_STATE);

  const API_URL = "https://turingwings-backend.onrender.com/api/events";

  useEffect(() => {
    if (id) {
      fetchEventDetails();
    }
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/${id}`);
      if (res.ok) {
        const data = await res.json();
        setFormData({ ...INITIAL_EVENT_STATE, ...data });
      }
    } catch (err) {
      console.error("Failed to load event for edit:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  const handleSave = async (statusOverride) => {
    try {
      setLoading(true);
      const payload = {
        ...formData,
        status: statusOverride || formData.status,
      };

      const url = id ? `${API_URL}/${id}` : API_URL;
      const method = id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const saved = await res.json();
        setSaveMessage(`✅ Event ${statusOverride === "Published" ? "Published" : "Saved"} Successfully!`);
        setTimeout(() => {
          navigate("/events");
        }, 1200);
      } else {
        const errData = await res.json();
        setSaveMessage(`❌ Error: ${errData.message}`);
      }
    } catch (err) {
      console.error("Save event failed:", err);
      setSaveMessage("❌ Connection error while saving event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <AdminNavbar currentUser={currentUser} unreadCount={2} />

      <main className="max-w-7xl mx-auto w-full p-4 sm:p-8 flex-1 flex flex-col gap-6 text-left">
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <button
              onClick={() => navigate("/events")}
              className="inline-flex items-center gap-1 text-xs text-amber-400 font-bold hover:underline mb-1"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Events Management
            </button>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {id ? "✏️ Edit Event" : "🚀 Create New Event"} — 23-Phase Event Builder
            </h1>
            <p className="text-xs text-slate-400">
              Configure event details, tracks, schedule, prizes, judges, custom registration form, and live settings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSave("Draft")}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 border border-slate-700"
            >
              <Save className="w-4 h-4 text-amber-400" /> Save Draft
            </button>
            <button
              onClick={() => handleSave("Published")}
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <Send className="w-4 h-4" /> Publish Event
            </button>
          </div>
        </div>

        {saveMessage && (
          <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
            {saveMessage}
          </div>
        )}

        {/* Step Progress Navigation Bar */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 overflow-x-auto flex items-center gap-2 scrollbar-thin">
          {STEPS.map((stepName, idx) => (
            <button
              key={stepName}
              onClick={() => setCurrentStep(idx)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                currentStep === idx
                  ? "bg-amber-500 text-slate-950 shadow-md font-extrabold"
                  : currentStep > idx
                  ? "bg-slate-800 text-amber-400 border border-amber-500/20"
                  : "bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-900"
              }`}
            >
              <span>{stepName}</span>
              {currentStep > idx && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
            </button>
          ))}
        </div>

        {/* Step Content Container */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 flex-1 shadow-2xl">
          
          {/* STEP 0: BASIC INFORMATION */}
          {currentStep === 0 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
                📋 Phase 1: Basic Event Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Event Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      handleInputChange("name", e.target.value);
                      if (!id) {
                        handleInputChange("slug", e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                      }
                    }}
                    placeholder="e.g. Turing Wings AI Buildathon 2026"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Short Name</label>
                  <input
                    type="text"
                    value={formData.shortName}
                    onChange={(e) => handleInputChange("shortName", e.target.value)}
                    placeholder="e.g. TW-Buildathon-26"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Event Slug (Auto-Generated URL)</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    placeholder="e.g. tw-buildathon-2026"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-amber-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Event Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange("type", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-amber-500 outline-none"
                  >
                    <option value="Hackathon">Hackathon</option>
                    <option value="Ideathon">Ideathon</option>
                    <option value="Buildathon">Buildathon</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Bootcamp">Bootcamp</option>
                    <option value="Coding Contest">Coding Contest</option>
                    <option value="Startup Challenge">Startup Challenge</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => handleInputChange("tagline", e.target.value)}
                  placeholder="e.g. Build Next-Gen AI Applications & Spatial UI Systems in 48 Hours"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={formData.shortDescription}
                  onChange={(e) => handleInputChange("shortDescription", e.target.value)}
                  placeholder="Concise overview for event cards and social sharing..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Description & Vision</label>
                <textarea
                  rows={4}
                  value={formData.fullDescription}
                  onChange={(e) => handleInputChange("fullDescription", e.target.value)}
                  placeholder="Detailed breakdown of event objectives, problem statements, and vision..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-amber-500 outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 1: BRANDING */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
                🎨 Phase 2: Branding & Media Assets
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Event Logo URL</label>
                  <input
                    type="text"
                    value={formData.logo}
                    onChange={(e) => handleInputChange("logo", e.target.value)}
                    placeholder="https://... logo image link"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Hero Banner Image URL</label>
                  <input
                    type="text"
                    value={formData.heroBanner}
                    onChange={(e) => handleInputChange("heroBanner", e.target.value)}
                    placeholder="https://... banner image link"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Thumbnail Card Image URL</label>
                  <input
                    type="text"
                    value={formData.thumbnail}
                    onChange={(e) => handleInputChange("thumbnail", e.target.value)}
                    placeholder="https://... thumbnail image link"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Intro / Promo Video URL</label>
                  <input
                    type="text"
                    value={formData.introVideo}
                    onChange={(e) => handleInputChange("introVideo", e.target.value)}
                    placeholder="https://youtube.com/... or mp4 link"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-amber-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: TEMPLATE & THEME */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
                🖼️ Phase 3: Template & Visual Design
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Select Event Template Module</label>
                  <select
                    value={formData.templateId}
                    onChange={(e) => handleInputChange("templateId", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-amber-500 outline-none"
                  >
                    <option value="ai-future">AI Future (Gold & Glassmorphism)</option>
                    <option value="cyberpunk">Cyberpunk Neon</option>
                    <option value="space">Space Odyssey</option>
                    <option value="corporate">Corporate Pro</option>
                    <option value="premium-3d">Premium 3D Spatial</option>
                    <option value="minimal">Minimal Light</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Background Overlay Style</label>
                  <select
                    value={formData.backgroundStyle}
                    onChange={(e) => handleInputChange("backgroundStyle", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-amber-500 outline-none"
                  >
                    <option value="particles">Interactive Floating Particles</option>
                    <option value="gradient">Animated Soft Gradient</option>
                    <option value="static">Clean Static Canvas</option>
                    <option value="threejs">3D Three.js Wave</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SCHEDULE */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
                📅 Phase 4: Event Timeline & Schedule Dates
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Registration Opens</label>
                  <input
                    type="date"
                    value={formData.schedule?.registrationOpen ? formData.schedule.registrationOpen.slice(0, 10) : ""}
                    onChange={(e) => handleNestedChange("schedule", "registrationOpen", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Registration Closes</label>
                  <input
                    type="date"
                    value={formData.schedule?.registrationClose ? formData.schedule.registrationClose.slice(0, 10) : ""}
                    onChange={(e) => handleNestedChange("schedule", "registrationClose", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Event Start Date</label>
                  <input
                    type="date"
                    value={formData.schedule?.eventStart ? formData.schedule.eventStart.slice(0, 10) : ""}
                    onChange={(e) => handleNestedChange("schedule", "eventStart", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Submission Deadline</label>
                  <input
                    type="date"
                    value={formData.schedule?.submissionDeadline ? formData.schedule.submissionDeadline.slice(0, 10) : ""}
                    onChange={(e) => handleNestedChange("schedule", "submissionDeadline", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Winners Announcement Date</label>
                  <input
                    type="date"
                    value={formData.schedule?.winnerAnnouncementDate ? formData.schedule.winnerAnnouncementDate.slice(0, 10) : ""}
                    onChange={(e) => handleNestedChange("schedule", "winnerAnnouncementDate", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-amber-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: REGISTRATION CONFIG */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
                📝 Phase 5: Registration & Team Settings
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Registration Type</label>
                  <select
                    value={formData.registrationConfig?.registrationType}
                    onChange={(e) => handleNestedChange("registrationConfig", "registrationType", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-amber-500 outline-none"
                  >
                    <option value="Individual">Individual Only</option>
                    <option value="Team">Team (1-4 Members)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Max Team Size</label>
                  <input
                    type="number"
                    value={formData.registrationConfig?.maxTeamSize}
                    onChange={(e) => handleNestedChange("registrationConfig", "maxTeamSize", parseInt(e.target.value) || 4)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Approval Type</label>
                  <select
                    value={formData.registrationConfig?.approvalType}
                    onChange={(e) => handleNestedChange("registrationConfig", "approvalType", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-amber-500 outline-none"
                  >
                    <option value="Auto">Auto-Approve Instant</option>
                    <option value="Manual">Manual Admin Review</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: CUSTOM QUESTIONS */}
          {currentStep === 5 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
                  ❓ Phase 6: Custom Registration Questions
                </h2>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      customQuestions: [
                        ...prev.customQuestions,
                        { id: Date.now().toString(), question: "", type: "text", required: false },
                      ],
                    }))
                  }
                  className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add Question
                </button>
              </div>

              {formData.customQuestions?.map((q, idx) => (
                <div key={q.id || idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-4">
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) => {
                        const updated = [...formData.customQuestions];
                        updated[idx].question = e.target.value;
                        setFormData((prev) => ({ ...prev, customQuestions: updated }));
                      }}
                      placeholder={`Question ${idx + 1}...`}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = formData.customQuestions.filter((_, i) => i !== idx);
                      setFormData((prev) => ({ ...prev, customQuestions: updated }));
                    }}
                    className="p-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* STEP 7: TRACKS */}
          {currentStep === 7 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
                  🚀 Phase 8: Challenge Tracks
                </h2>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      tracks: [
                        ...prev.tracks,
                        { id: Date.now().toString(), name: "", icon: "Bot", description: "" },
                      ],
                    }))
                  }
                  className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add Track
                </button>
              </div>

              {formData.tracks?.map((t, idx) => (
                <div key={t.id || idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <input
                      type="text"
                      value={t.name}
                      onChange={(e) => {
                        const updated = [...formData.tracks];
                        updated[idx].name = e.target.value;
                        setFormData((prev) => ({ ...prev, tracks: updated }));
                      }}
                      placeholder="Track Title (e.g. AI Agent Swarms)"
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white font-bold outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = formData.tracks.filter((_, i) => i !== idx);
                        setFormData((prev) => ({ ...prev, tracks: updated }));
                      }}
                      className="p-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={t.description}
                    onChange={(e) => {
                      const updated = [...formData.tracks];
                      updated[idx].description = e.target.value;
                      setFormData((prev) => ({ ...prev, tracks: updated }));
                    }}
                    placeholder="Track objectives and problem statement brief..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none"
                  />
                </div>
              ))}
            </div>
          )}

          {/* STEP 9: PRIZES */}
          {currentStep === 9 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
                  🏆 Phase 10: Prizes, Rewards & Benefits
                </h2>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      prizes: [
                        ...prev.prizes,
                        { title: "", reward: "", category: "Track Winner", cashAmount: 1000, swag: "Swag Box" },
                      ],
                    }))
                  }
                  className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add Prize
                </button>
              </div>

              {formData.prizes?.map((p, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={p.title}
                    onChange={(e) => {
                      const updated = [...formData.prizes];
                      updated[idx].title = e.target.value;
                      setFormData((prev) => ({ ...prev, prizes: updated }));
                    }}
                    placeholder="Prize Title (e.g. Grand Champion)"
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white font-bold outline-none"
                  />
                  <input
                    type="text"
                    value={p.reward}
                    onChange={(e) => {
                      const updated = [...formData.prizes];
                      updated[idx].reward = e.target.value;
                      setFormData((prev) => ({ ...prev, prizes: updated }));
                    }}
                    placeholder="Reward Description ($5,000 Cash + Swag)"
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white outline-none"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={p.cashAmount || 0}
                      onChange={(e) => {
                        const updated = [...formData.prizes];
                        updated[idx].cashAmount = parseInt(e.target.value) || 0;
                        setFormData((prev) => ({ ...prev, prizes: updated }));
                      }}
                      placeholder="Cash Amount $"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = formData.prizes.filter((_, i) => i !== idx);
                        setFormData((prev) => ({ ...prev, prizes: updated }));
                      }}
                      className="p-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 15: PREVIEW & PUBLISH */}
          {currentStep === 15 && (
            <div className="space-y-6 text-center py-6">
              <Sparkles className="w-12 h-12 text-amber-400 mx-auto animate-pulse" />
              <h2 className="text-2xl font-extrabold text-white">Event Creation Ready!</h2>
              <p className="text-sm text-slate-300 max-w-lg mx-auto">
                Review event configuration for <span className="text-amber-400 font-bold">{formData.name || "Untitled Event"}</span>. Click publish to deploy to Turing Wings platform.
              </p>

              <div className="flex items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => handleSave("Draft")}
                  disabled={loading}
                  className="px-6 py-3 rounded-2xl bg-slate-800 text-slate-200 font-bold text-sm border border-slate-700 hover:bg-slate-700"
                >
                  Save as Draft
                </button>
                <button
                  onClick={() => handleSave("Published")}
                  disabled={loading}
                  className="px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/25 hover:scale-105 transition-all"
                >
                  🚀 Publish Live Event Now
                </button>
              </div>
            </div>
          )}

          {/* Bottom Wizard Stepper Navigation Buttons */}
          <div className="flex items-center justify-between border-t border-slate-800 pt-6 mt-6">
            <button
              disabled={currentStep === 0}
              onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs disabled:opacity-40 flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Previous Phase
            </button>

            <span className="text-xs text-slate-400 font-mono">
              Phase {currentStep + 1} of {STEPS.length}
            </span>

            <button
              disabled={currentStep === STEPS.length - 1}
              onClick={() => setCurrentStep((prev) => Math.min(STEPS.length - 1, prev + 1))}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs flex items-center gap-1 shadow-md"
            >
              Next Phase <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
