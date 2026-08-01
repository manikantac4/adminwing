import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import AdminChatWidget from "../components/AdminChatWidget";

const STEPS = [
  "📋 Basic Info",
  "🎨 Branding",
  "🖼️ Template & Theme",
  "📅 Schedule & Timeline",
  "📝 Registration Config",
  "❓ Custom Questions",
  "👥 Eligibility Rules",
  "🚀 Tracks",
  "⚖️ Rules & Policies",
  "🏆 Prizes",
  "👨‍⚖️ Judges & Mentors",
  "🤝 Sponsors",
  "📍 Venue & Support",
  "📢 Live & Submissions",
  "📜 Certificates & Emails",
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
  fontSelection: "Inter",

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
    plagiarismPolicy: "Pre-existing software or plagiarized code will result in disqualification.",
    disqualificationRules: ["Harassment or violation of rules leads to immediate disqualification."],
  },

  prizes: [
    { title: "Grand Winner (1st Place)", reward: "$5,000 Cash + Incubator Pass", category: "Overall", cashAmount: 5000, swag: "Exclusive Trophy + Swag Kit", icon: "Trophy" },
    { title: "Runner Up (2nd Place)", reward: "$2,500 Cash", category: "Runner Up", cashAmount: 2500, swag: "Turing Wings Hoodie", icon: "Award" },
  ],

  judges: [
    { id: "1", name: "Ratnakar Karasala", company: "Turing Wings HQ", designation: "Cybersecurity Lead", bio: "Expert in zero-trust architectures and cloud security.", photo: "", linkedin: "https://linkedin.com" },
  ],

  mentors: [
    { id: "1", name: "Sahith Akula", company: "Turing Wings HQ", designation: "Backend Lead", bio: "Specialist in microservices and distributed agent swarms.", photo: "", linkedin: "https://linkedin.com" },
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
    supportEmail: "support@turingwings.com",
    technicalContact: "tech@turingwings.com",
    emergencyContact: "+91 9876543211",
    discord: "https://discord.gg/turingwings",
    whatsapp: "https://chat.whatsapp.com/turingwings",
    telegram: "https://t.me/turingwings",
  },

  venue: {
    type: "Online",
    name: "Turing Wings Virtual Portal",
    address: "Online Global Platform",
    googleMapsUrl: "",
    hallDetails: "Virtual Auditorium 1",
  },

  liveSettings: {
    enableLiveDashboard: true,
    enableLeaderboard: true,
    enableAnnouncements: true,
    enableCountdown: true,
    enableChat: true,
    enableClarifications: true,
    enableNotifications: true,
    enableProblemReveal: true,
    enableSubmissionPortal: true,
    enableResults: true,
  },

  submissionSettings: {
    allowedTypes: ["GitHub", "ZIP", "PDF", "Video", "Website URL"],
    maxFileSizeMb: 50,
    allowResubmission: true,
    maxAttempts: 5,
  },

  certificates: {
    templateId: "standard_gold",
    releaseDate: "",
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
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

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
    <div className="min-h-screen bg-hero-gradient text-[#18191B] selection:bg-[#A39B89] selection:text-white flex flex-col font-sans">
      <AdminNavbar
        currentUser={currentUser}
        unreadCount={2}
        toggleChatbot={() => setIsChatbotOpen(!isChatbotOpen)}
      />

      <main className="max-w-7xl mx-auto w-full p-4 sm:p-8 overflow-y-auto text-left space-y-8 flex-1">
        {/* Header Strip */}
        <div className="card-premium p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <button
                onClick={() => navigate("/events")}
                className="inline-flex items-center gap-1 text-xs text-[#A39B89] font-bold hover:underline mb-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Events Management
              </button>
              <h1 className="text-2xl sm:text-3xl font-bold font-poppins text-[#18191B]">
                {id ? "✏️ Edit Event" : "🚀 Create New Event"} — 23-Phase Interactive Wizard
              </h1>
              <p className="text-xs text-[#5E6168] mt-1">
                Configure event details, tracks, schedule, prizes, judges, custom registration form, eligibility, and live settings.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleSave("Draft")}
                disabled={loading}
                className="px-4 py-2 rounded-xl bg-white hover:bg-[#F3F4F6] text-[#18191B] font-bold text-xs flex items-center gap-2 border border-[#E5E7EB] shadow-sm transition-all"
              >
                <svg className="w-4 h-4 text-[#A39B89]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Save Draft
              </button>
              <button
                onClick={() => handleSave("Published")}
                disabled={loading}
                className="px-5 py-2 rounded-xl bg-[#18191B] hover:bg-[#2A2C30] text-white font-extrabold text-xs flex items-center gap-2 shadow-md transition-all"
              >
                <svg className="w-4 h-4 text-[#A39B89]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Publish Event
              </button>
            </div>
          </div>
        </div>

        {saveMessage && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold shadow-sm">
            {saveMessage}
          </div>
        )}

        {/* Step Progress Navigation Bar */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-3 overflow-x-auto flex items-center gap-2 shadow-sm scrollbar-thin">
          {STEPS.map((stepName, idx) => (
            <button
              key={stepName}
              onClick={() => setCurrentStep(idx)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                currentStep === idx
                  ? "bg-[#18191B] text-white shadow-md font-extrabold"
                  : currentStep > idx
                  ? "bg-[#FAF8F5] text-[#A39B89] border border-[#D4CEB8]"
                  : "bg-[#F8F9FA] text-[#5E6168] border border-[#E5E7EB] hover:bg-[#F3F4F6]"
              }`}
            >
              <span>{stepName}</span>
              {currentStep > idx && (
                <svg className="w-3.5 h-3.5 text-[#A39B89]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>

        {/* Step Content Container */}
        <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 space-y-6 flex-1 shadow-sm">
          
          {/* STEP 0: BASIC INFORMATION */}
          {currentStep === 0 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-[#18191B]">📋 Phase 1: Basic Event Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#5E6168] mb-1">Event Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      handleInputChange("name", e.target.value);
                      if (!id) handleInputChange("slug", e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                    }}
                    placeholder="e.g. Turing Wings AI Buildathon 2026"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] text-sm text-[#18191B] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5E6168] mb-1">Short Name</label>
                  <input
                    type="text"
                    value={formData.shortName}
                    onChange={(e) => handleInputChange("shortName", e.target.value)}
                    placeholder="e.g. TW-Buildathon-26"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] text-sm text-[#18191B] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5E6168] mb-1">Event Slug (URL)</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] text-sm text-[#18191B] font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5E6168] mb-1">Event Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange("type", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] text-sm text-[#18191B] outline-none"
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
                <label className="block text-xs font-bold text-[#5E6168] mb-1">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => handleInputChange("tagline", e.target.value)}
                  placeholder="e.g. Build Next-Gen AI Applications & Spatial UI Systems in 48 Hours"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] text-sm text-[#18191B] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5E6168] mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={formData.shortDescription}
                  onChange={(e) => handleInputChange("shortDescription", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] text-sm text-[#18191B] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5E6168] mb-1">Full Description & Vision</label>
                <textarea
                  rows={4}
                  value={formData.fullDescription}
                  onChange={(e) => handleInputChange("fullDescription", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] text-sm text-[#18191B] outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 1: BRANDING */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-[#18191B]">🎨 Phase 2: Branding & Media Assets</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#5E6168] mb-1">Event Logo URL</label>
                  <input
                    type="text"
                    value={formData.logo}
                    onChange={(e) => handleInputChange("logo", e.target.value)}
                    placeholder="https://... logo image link"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] text-sm text-[#18191B] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5E6168] mb-1">Hero Banner Image URL</label>
                  <input
                    type="text"
                    value={formData.heroBanner}
                    onChange={(e) => handleInputChange("heroBanner", e.target.value)}
                    placeholder="https://... banner image link"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] text-sm text-[#18191B] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5E6168] mb-1">Thumbnail Card Image URL</label>
                  <input
                    type="text"
                    value={formData.thumbnail}
                    onChange={(e) => handleInputChange("thumbnail", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] text-sm text-[#18191B] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5E6168] mb-1">Intro / Promo Video URL</label>
                  <input
                    type="text"
                    value={formData.introVideo}
                    onChange={(e) => handleInputChange("introVideo", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] text-sm text-[#18191B] outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: TEMPLATE & THEME */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-[#18191B]">🖼️ Phase 3: Template & Visual Design</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#5E6168] mb-1">Select Event Template Module</label>
                  <select
                    value={formData.templateId}
                    onChange={(e) => handleInputChange("templateId", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] text-sm text-[#18191B] outline-none"
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
                  <label className="block text-xs font-bold text-[#5E6168] mb-1">Background Overlay Style</label>
                  <select
                    value={formData.backgroundStyle}
                    onChange={(e) => handleInputChange("backgroundStyle", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] text-sm text-[#18191B] outline-none"
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
              <h2 className="text-xl font-bold text-[#18191B]">📅 Phase 4: Event Timeline & Schedule Dates</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#5E6168] mb-1">Registration Opens</label>
                  <input
                    type="date"
                    value={formData.schedule?.registrationOpen ? formData.schedule.registrationOpen.slice(0, 10) : ""}
                    onChange={(e) => handleNestedChange("schedule", "registrationOpen", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] text-sm text-[#18191B] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5E6168] mb-1">Registration Closes</label>
                  <input
                    type="date"
                    value={formData.schedule?.registrationClose ? formData.schedule.registrationClose.slice(0, 10) : ""}
                    onChange={(e) => handleNestedChange("schedule", "registrationClose", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] text-sm text-[#18191B] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5E6168] mb-1">Event Start Date</label>
                  <input
                    type="date"
                    value={formData.schedule?.eventStart ? formData.schedule.eventStart.slice(0, 10) : ""}
                    onChange={(e) => handleNestedChange("schedule", "eventStart", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] text-sm text-[#18191B] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5E6168] mb-1">Submission Deadline</label>
                  <input
                    type="date"
                    value={formData.schedule?.submissionDeadline ? formData.schedule.submissionDeadline.slice(0, 10) : ""}
                    onChange={(e) => handleNestedChange("schedule", "submissionDeadline", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] text-sm text-[#18191B] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5E6168] mb-1">Winners Announcement Date</label>
                  <input
                    type="date"
                    value={formData.schedule?.winnerAnnouncementDate ? formData.schedule.winnerAnnouncementDate.slice(0, 10) : ""}
                    onChange={(e) => handleNestedChange("schedule", "winnerAnnouncementDate", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] text-sm text-[#18191B] outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: REGISTRATION CONFIG */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-[#18191B]">📝 Phase 5: Registration & Team Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#5E6168] mb-1">Registration Type</label>
                  <select
                    value={formData.registrationConfig?.registrationType}
                    onChange={(e) => handleNestedChange("registrationConfig", "registrationType", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] text-sm text-[#18191B] outline-none"
                  >
                    <option value="Individual">Individual Only</option>
                    <option value="Team">Team (1-4 Members)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5E6168] mb-1">Max Team Size</label>
                  <input
                    type="number"
                    value={formData.registrationConfig?.maxTeamSize}
                    onChange={(e) => handleNestedChange("registrationConfig", "maxTeamSize", parseInt(e.target.value) || 4)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] text-sm text-[#18191B] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5E6168] mb-1">Approval Type</label>
                  <select
                    value={formData.registrationConfig?.approvalType}
                    onChange={(e) => handleNestedChange("registrationConfig", "approvalType", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] text-sm text-[#18191B] outline-none"
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
                <h2 className="text-xl font-bold text-[#18191B]">❓ Phase 6: Custom Registration Questions</h2>
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
                  className="px-3.5 py-1.5 rounded-xl bg-[#18191B] text-white font-bold text-xs"
                >
                  + Add Question
                </button>
              </div>
              {formData.customQuestions?.map((q, idx) => (
                <div key={q.id || idx} className="p-4 rounded-2xl bg-[#F8F9FA] border border-[#E5E7EB] flex items-center gap-4">
                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => {
                      const updated = [...formData.customQuestions];
                      updated[idx].question = e.target.value;
                      setFormData((prev) => ({ ...prev, customQuestions: updated }));
                    }}
                    placeholder={`Question ${idx + 1}...`}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-[#E5E7EB] text-sm text-[#18191B] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = formData.customQuestions.filter((_, i) => i !== idx);
                      setFormData((prev) => ({ ...prev, customQuestions: updated }));
                    }}
                    className="p-2 rounded-xl bg-red-50 text-red-600 border border-red-200"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* STEP 6: ELIGIBILITY RULES (INTERACTIVE) */}
          {currentStep === 6 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-[#18191B]">👥 Phase 7: Eligibility Rules</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#5E6168] mb-1">Target Category</label>
                  <select
                    value={formData.eligibility?.category}
                    onChange={(e) => handleNestedChange("eligibility", "category", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] text-sm text-[#18191B] outline-none"
                  >
                    <option value="Open for All">Open for All</option>
                    <option value="Student">Students Only</option>
                    <option value="Professional">Working Professionals</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5E6168] mb-1">Age Limit</label>
                  <input
                    type="text"
                    value={formData.eligibility?.ageLimit}
                    onChange={(e) => handleNestedChange("eligibility", "ageLimit", e.target.value)}
                    placeholder="e.g. 16+ or No Limit"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] text-sm text-[#18191B] outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5E6168] mb-1">College / Institutional Restrictions</label>
                <input
                  type="text"
                  value={formData.eligibility?.collegeRestrictions}
                  onChange={(e) => handleNestedChange("eligibility", "collegeRestrictions", e.target.value)}
                  placeholder="e.g. None or Open to all accredited universities"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] text-sm text-[#18191B] outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 7: TRACKS */}
          {currentStep === 7 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#18191B]">🚀 Phase 8: Challenge Tracks</h2>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      tracks: [...prev.tracks, { id: Date.now().toString(), name: "", icon: "Bot", description: "" }],
                    }))
                  }
                  className="px-3.5 py-1.5 rounded-xl bg-[#18191B] text-white font-bold text-xs"
                >
                  + Add Track
                </button>
              </div>
              {formData.tracks?.map((t, idx) => (
                <div key={t.id || idx} className="p-4 rounded-2xl bg-[#F8F9FA] border border-[#E5E7EB] space-y-3">
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
                      className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-[#E5E7EB] text-sm text-[#18191B] font-bold outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = formData.tracks.filter((_, i) => i !== idx);
                        setFormData((prev) => ({ ...prev, tracks: updated }));
                      }}
                      className="p-2 rounded-xl bg-red-50 text-red-600 border border-red-200"
                    >
                      Remove
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
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E5E7EB] text-xs text-[#18191B] outline-none"
                  />
                </div>
              ))}
            </div>
          )}

          {/* STEP 8: RULES & POLICIES (INTERACTIVE) */}
          {currentStep === 8 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-[#18191B]">⚖️ Phase 9: Event Rules & Code of Conduct</h2>
              <div>
                <label className="block text-xs font-bold text-[#5E6168] mb-1">Code of Conduct Policy</label>
                <textarea
                  rows={3}
                  value={formData.rules?.codeOfConduct}
                  onChange={(e) => handleNestedChange("rules", "codeOfConduct", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] text-sm text-[#18191B] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5E6168] mb-1">Plagiarism & Code Authenticity Policy</label>
                <textarea
                  rows={3}
                  value={formData.rules?.plagiarismPolicy}
                  onChange={(e) => handleNestedChange("rules", "plagiarismPolicy", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] text-sm text-[#18191B] outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 9: PRIZES */}
          {currentStep === 9 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#18191B]">🏆 Phase 10: Prizes, Rewards & Benefits</h2>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      prizes: [...prev.prizes, { title: "", reward: "", category: "Track Winner", cashAmount: 1000, swag: "Swag Box" }],
                    }))
                  }
                  className="px-3.5 py-1.5 rounded-xl bg-[#18191B] text-white font-bold text-xs"
                >
                  + Add Prize
                </button>
              </div>
              {formData.prizes?.map((p, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#F8F9FA] border border-[#E5E7EB] grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={p.title}
                    onChange={(e) => {
                      const updated = [...formData.prizes];
                      updated[idx].title = e.target.value;
                      setFormData((prev) => ({ ...prev, prizes: updated }));
                    }}
                    placeholder="Prize Title (e.g. Grand Champion)"
                    className="px-3.5 py-2 rounded-xl bg-white border border-[#E5E7EB] text-sm text-[#18191B] font-bold outline-none"
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
                    className="px-3.5 py-2 rounded-xl bg-white border border-[#E5E7EB] text-sm text-[#18191B] outline-none"
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
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E5E7EB] text-sm text-[#18191B] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = formData.prizes.filter((_, i) => i !== idx);
                        setFormData((prev) => ({ ...prev, prizes: updated }));
                      }}
                      className="p-2 rounded-xl bg-red-50 text-red-600 border border-red-200"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 10: JUDGES & MENTORS (INTERACTIVE) */}
          {currentStep === 10 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#18191B]">👨‍⚖️ Phase 11: Judges & Mentors</h2>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      judges: [...prev.judges, { id: Date.now().toString(), name: "", company: "", designation: "", bio: "", linkedin: "" }],
                    }))
                  }
                  className="px-3.5 py-1.5 rounded-xl bg-[#18191B] text-white font-bold text-xs"
                >
                  + Add Judge/Mentor
                </button>
              </div>
              {formData.judges?.map((j, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#F8F9FA] border border-[#E5E7EB] grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={j.name}
                    onChange={(e) => {
                      const updated = [...formData.judges];
                      updated[idx].name = e.target.value;
                      setFormData((prev) => ({ ...prev, judges: updated }));
                    }}
                    placeholder="Full Name"
                    className="px-3.5 py-2 rounded-xl bg-white border border-[#E5E7EB] text-sm text-[#18191B] outline-none"
                  />
                  <input
                    type="text"
                    value={j.designation}
                    onChange={(e) => {
                      const updated = [...formData.judges];
                      updated[idx].designation = e.target.value;
                      setFormData((prev) => ({ ...prev, judges: updated }));
                    }}
                    placeholder="Designation & Company"
                    className="px-3.5 py-2 rounded-xl bg-white border border-[#E5E7EB] text-sm text-[#18191B] outline-none"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={j.bio}
                      onChange={(e) => {
                        const updated = [...formData.judges];
                        updated[idx].bio = e.target.value;
                        setFormData((prev) => ({ ...prev, judges: updated }));
                      }}
                      placeholder="Short Biography..."
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E5E7EB] text-sm text-[#18191B] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = formData.judges.filter((_, i) => i !== idx);
                        setFormData((prev) => ({ ...prev, judges: updated }));
                      }}
                      className="p-2 rounded-xl bg-red-50 text-red-600 border border-red-200"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 11: SPONSORS (INTERACTIVE) */}
          {currentStep === 11 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#18191B]">🤝 Phase 12: Sponsors & Partners</h2>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      sponsors: [...prev.sponsors, { id: Date.now().toString(), name: "", logo: "", website: "", tier: "Gold" }],
                    }))
                  }
                  className="px-3.5 py-1.5 rounded-xl bg-[#18191B] text-white font-bold text-xs"
                >
                  + Add Sponsor
                </button>
              </div>
              {formData.sponsors?.map((s, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#F8F9FA] border border-[#E5E7EB] grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={s.name}
                    onChange={(e) => {
                      const updated = [...formData.sponsors];
                      updated[idx].name = e.target.value;
                      setFormData((prev) => ({ ...prev, sponsors: updated }));
                    }}
                    placeholder="Sponsor Name"
                    className="px-3.5 py-2 rounded-xl bg-white border border-[#E5E7EB] text-sm text-[#18191B] outline-none"
                  />
                  <input
                    type="text"
                    value={s.website}
                    onChange={(e) => {
                      const updated = [...formData.sponsors];
                      updated[idx].website = e.target.value;
                      setFormData((prev) => ({ ...prev, sponsors: updated }));
                    }}
                    placeholder="Website URL"
                    className="px-3.5 py-2 rounded-xl bg-white border border-[#E5E7EB] text-sm text-[#18191B] outline-none"
                  />
                  <div className="flex items-center gap-2">
                    <select
                      value={s.tier}
                      onChange={(e) => {
                        const updated = [...formData.sponsors];
                        updated[idx].tier = e.target.value;
                        setFormData((prev) => ({ ...prev, sponsors: updated }));
                      }}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E5E7EB] text-sm text-[#18191B] outline-none"
                    >
                      <option value="Title">Title Sponsor</option>
                      <option value="Gold">Gold Sponsor</option>
                      <option value="Silver">Silver Sponsor</option>
                      <option value="Community">Community Partner</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = formData.sponsors.filter((_, i) => i !== idx);
                        setFormData((prev) => ({ ...prev, sponsors: updated }));
                      }}
                      className="p-2 rounded-xl bg-red-50 text-red-600 border border-red-200"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 12: VENUE & SUPPORT (INTERACTIVE) */}
          {currentStep === 12 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-[#18191B]">📍 Phase 13: Venue & Support Contacts</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#5E6168] mb-1">Coordinator Name</label>
                  <input
                    type="text"
                    value={formData.contact?.coordinatorName}
                    onChange={(e) => handleNestedChange("contact", "coordinatorName", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] text-sm text-[#18191B] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5E6168] mb-1">Coordinator Email</label>
                  <input
                    type="email"
                    value={formData.contact?.coordinatorEmail}
                    onChange={(e) => handleNestedChange("contact", "coordinatorEmail", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] text-sm text-[#18191B] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5E6168] mb-1">Discord / WhatsApp Link</label>
                  <input
                    type="text"
                    value={formData.contact?.discord}
                    onChange={(e) => handleNestedChange("contact", "discord", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] text-sm text-[#18191B] outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 13: LIVE SETTINGS (INTERACTIVE) */}
          {currentStep === 13 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-[#18191B]">📢 Phase 14: Live Event Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-3 p-4 rounded-2xl bg-[#F8F9FA] border border-[#E5E7EB] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.liveSettings?.enableLiveDashboard}
                    onChange={(e) => handleNestedChange("liveSettings", "enableLiveDashboard", e.target.checked)}
                    className="w-4 h-4 accent-[#18191B]"
                  />
                  <span className="text-xs font-bold text-[#18191B]">Enable Live Event Dashboard & Announcements</span>
                </label>
                <label className="flex items-center gap-3 p-4 rounded-2xl bg-[#F8F9FA] border border-[#E5E7EB] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.liveSettings?.enableLeaderboard}
                    onChange={(e) => handleNestedChange("liveSettings", "enableLeaderboard", e.target.checked)}
                    className="w-4 h-4 accent-[#18191B]"
                  />
                  <span className="text-xs font-bold text-[#18191B]">Enable Live Leaderboard & Results</span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 15: PREVIEW & PUBLISH */}
          {currentStep === 15 && (
            <div className="space-y-6 text-center py-6">
              <svg className="w-12 h-12 text-[#A39B89] mx-auto animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <h2 className="text-2xl font-extrabold text-[#18191B]">Event Creation Ready!</h2>
              <p className="text-sm text-[#5E6168] max-w-lg mx-auto">
                Review event configuration for <span className="text-[#A39B89] font-bold">{formData.name || "Untitled Event"}</span>. Click publish to deploy to Turing Wings platform.
              </p>
              <div className="flex items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => handleSave("Draft")}
                  disabled={loading}
                  className="px-6 py-3 rounded-2xl bg-white text-[#18191B] font-bold text-sm border border-[#E5E7EB] hover:bg-[#F3F4F6]"
                >
                  Save as Draft
                </button>
                <button
                  onClick={() => handleSave("Published")}
                  disabled={loading}
                  className="px-8 py-3 rounded-2xl bg-[#18191B] text-white font-extrabold text-sm shadow-xl hover:bg-[#2A2C30] transition-all"
                >
                  🚀 Publish Live Event Now
                </button>
              </div>
            </div>
          )}

          {/* Bottom Stepper Buttons */}
          <div className="flex items-center justify-between border-t border-[#F3F4F6] pt-6 mt-6">
            <button
              disabled={currentStep === 0}
              onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
              className="px-4 py-2 rounded-xl bg-[#F8F9FA] hover:bg-[#F3F4F6] text-[#18191B] font-bold text-xs disabled:opacity-40 flex items-center gap-1 border border-[#E5E7EB]"
            >
              Previous Phase
            </button>
            <span className="text-xs text-[#5E6168] font-mono">
              Phase {currentStep + 1} of {STEPS.length}
            </span>
            <button
              disabled={currentStep === STEPS.length - 1}
              onClick={() => setCurrentStep((prev) => Math.min(STEPS.length - 1, prev + 1))}
              className="px-5 py-2 rounded-xl bg-[#18191B] hover:bg-[#2A2C30] text-white font-extrabold text-xs flex items-center gap-1 shadow-sm"
            >
              Next Phase
            </button>
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
