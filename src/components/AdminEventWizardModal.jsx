import React, { useState } from "react";
import {
  Sparkles, X, ChevronRight, ChevronLeft, Check, Layers, Layout,
  Calendar, Trophy, ShieldCheck, Cpu, Flame, Globe, Zap, CheckCircle2, AlertCircle
} from "lucide-react";

const EVENT_TYPES = [
  { id: "Buildathon", label: "Buildathon", icon: "🚀", desc: "Build & ship working software products in intensive sprints." },
  { id: "Hackathon", label: "Hackathon", icon: "⚡", desc: "High-octane coding marathon & problem solving." },
  { id: "Ideathon", label: "Ideathon", labelText: "Ideathon", icon: "💡", desc: "Pitch ambitious product concepts and architectural blueprints." },
  { id: "AI Challenge", label: "AI Challenge", icon: "🧠", desc: "Train models, build LLM swarms, and AI-powered workflows." },
  { id: "Coding Contest", label: "Coding Contest", icon: "💻", desc: "Competitive algorithmic programming and speed challenges." },
  { id: "Designathon", label: "Designathon", icon: "🎨", desc: "Spatial UI/UX design, glassmorphism, and design systems." },
  { id: "Startup Challenge", label: "Startup Challenge", icon: "🏆", desc: "Pitch venture-ready MVPs to lead mentors & investors." },
  { id: "Workshop", label: "Workshop", icon: "📚", desc: "Interactive hands-on technical masterclass." },
  { id: "Bootcamp", label: "Bootcamp", icon: "🎓", desc: "Multi-week immersive cohort learning sprint." },
];

const DESIGN_TEMPLATES = [
  {
    id: "ai-future",
    name: "AI Future (Dark Obsidian)",
    badge: "RECOMMENDED",
    color: "from-amber-500 to-yellow-600",
    bgPreview: "bg-slate-950 border-amber-500/40 text-white",
    desc: "Glow effects, AI illustrations, champagne gold accents, obsidian surfaces.",
  },
  {
    id: "cyberpunk-neon",
    name: "Cyberpunk Neon",
    badge: "POPULAR",
    color: "from-purple-500 to-pink-600",
    bgPreview: "bg-purple-950 border-pink-500/40 text-white",
    desc: "Neon glassmorphism, glowing grid lines, futuristic cyber aesthetic.",
  },
  {
    id: "minimal-white",
    name: "Minimal White & Gold",
    badge: "CLEAN",
    color: "from-slate-800 to-[#18191B]",
    bgPreview: "bg-white border-slate-300 text-slate-900",
    desc: "Pure white surface, crisp typography, champagne gold highlights.",
  },
  {
    id: "space-galaxy",
    name: "Space Galaxy",
    badge: "CREATIVE",
    color: "from-indigo-600 to-blue-700",
    bgPreview: "bg-slate-900 border-indigo-500/40 text-white",
    desc: "Galaxy deep space dark, floating orbital elements, cosmic vibes.",
  },
  {
    id: "gradient-modern",
    name: "Gradient Modern",
    badge: "TRENDING",
    color: "from-emerald-500 to-teal-600",
    bgPreview: "bg-gradient-to-br from-slate-900 to-slate-950 border-teal-500/40 text-white",
    desc: "Vibrant gradient headers, curved glass cards, smooth transitions.",
  },
  {
    id: "gaming-rgb",
    name: "Gaming RGB",
    badge: "HIGH ENERGY",
    color: "from-red-500 to-amber-500",
    bgPreview: "bg-zinc-950 border-red-500/40 text-white",
    desc: "High energy RGB accents, tournament leaderboard cards.",
  },
];

export default function AdminEventWizardModal({ isOpen, onClose, onEventCreated }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    tagline: "Build & Ship Next-Gen Products",
    eventType: "Buildathon",
    templateId: "ai-future",
    mode: "Online",
    startDate: "August 28, 2026",
    endDate: "August 30, 2026",
    prizePool: "$10,000 USD",
    venue: "Turing Wings Virtual Portal",
    backgroundMode: "Gradient",
    description: "Join thousands of builders in this intensive sprint to create AI-powered software products.",
  });

  if (!isOpen) return null;

  const handleNext = () => {
    if (step === 1 && !formData.eventType) return;
    if (step === 3 && (!formData.title.trim() || !formData.description.trim())) {
      setError("Please enter event title and description.");
      return;
    }
    setError("");
    setStep((prev) => Math.min(prev + 1, 5));
  };

  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const handlePublishEvent = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://turingwings-backend.onrender.com/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to publish event");
      }

      setSuccess(`Event "${data.title}" successfully created with ${data.templateId} template!`);
      if (onEventCreated) onEventCreated(data);

      setTimeout(() => {
        setStep(1);
        setSuccess("");
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || "Server connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 selection:bg-[#A39B89] selection:text-white font-sans">
      <div className="bg-white border border-[#E5E7EB] rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl text-left max-h-[90vh] overflow-y-auto relative">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#18191B] text-white flex items-center justify-center font-bold shrink-0">
              <Sparkles className="w-5 h-5 text-[#C9B27D]" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-poppins text-[#18191B]">
                Event Template Generator Wizard
              </h2>
              <span className="text-xs text-[#5E6168] font-mono">
                Step {step} of 5 — {step === 1 ? "Event Category" : step === 2 ? "Design Template" : step === 3 ? "Event Details" : step === 4 ? "Tracks & Timeline" : "Publish Preview"}
              </span>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl text-[#5E6168] hover:bg-[#F8F9FB] hover:text-[#18191B]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#F8F9FB] h-2 rounded-full overflow-hidden border border-[#E5E7EB]">
          <div
            className="bg-gradient-to-r from-[#18191B] via-[#A39B89] to-[#C9B27D] h-full transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 font-semibold">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* STEP 1: SELECT EVENT CATEGORY */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#18191B] uppercase tracking-wider">
              1. Choose Event Type
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {EVENT_TYPES.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, eventType: type.id })}
                  className={`p-4 rounded-2xl border text-left transition-all space-y-1.5 ${
                    formData.eventType === type.id
                      ? "bg-[#18191B] text-white border-[#18191B] shadow-md scale-[1.02]"
                      : "bg-[#F8F9FB] border-[#E5E7EB] text-[#18191B] hover:border-[#A39B89]"
                  }`}
                >
                  <div className="text-2xl">{type.icon}</div>
                  <h4 className="font-bold text-xs">{type.label}</h4>
                  <p className={`text-[10px] line-clamp-2 ${formData.eventType === type.id ? "text-slate-300" : "text-[#5E6168]"}`}>
                    {type.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: SELECT DESIGN TEMPLATE */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#18191B] uppercase tracking-wider">
              2. Choose Presentation Design Template
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DESIGN_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, templateId: tmpl.id })}
                  className={`p-4 rounded-2xl border text-left transition-all space-y-2 relative overflow-hidden ${
                    formData.templateId === tmpl.id
                      ? "border-2 border-[#18191B] shadow-xl ring-2 ring-[#A39B89]/40"
                      : "border-[#E5E7EB] hover:border-[#A39B89]"
                  }`}
                >
                  <div className={`p-3 rounded-xl border ${tmpl.bgPreview} flex items-center justify-between`}>
                    <span className="font-bold text-xs">{tmpl.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold bg-gradient-to-r ${tmpl.color} text-white`}>
                      {tmpl.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5E6168] leading-relaxed">{tmpl.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: CONFIGURE EVENT DETAILS */}
        {step === 3 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-[#18191B] uppercase tracking-wider">
              3. Event Content & Hero Information
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block font-bold uppercase text-[#5E6168] mb-1">
                  Event Title / Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Generative AI & Spatial UI Buildathon 2026"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] text-xs font-bold text-[#18191B] focus:outline-none focus:border-[#A39B89]"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-[#5E6168] mb-1">
                  Tagline / Punchline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Build, Deploy & Ship Autonomous AI Products in 48 Hours"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] text-xs text-[#18191B] focus:outline-none focus:border-[#A39B89]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold uppercase text-[#5E6168] mb-1">
                    Prize Pool
                  </label>
                  <input
                    type="text"
                    value={formData.prizePool}
                    onChange={(e) => setFormData({ ...formData, prizePool: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] text-xs text-[#18191B]"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-[#5E6168] mb-1">
                    Event Mode
                  </label>
                  <select
                    value={formData.mode}
                    onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] text-xs text-[#18191B]"
                  >
                    <option value="Online">Online Virtual</option>
                    <option value="Offline">In-Person Offline</option>
                    <option value="Hybrid">Hybrid Mode</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase text-[#5E6168] mb-1">
                    Background Mode
                  </label>
                  <select
                    value={formData.backgroundMode}
                    onChange={(e) => setFormData({ ...formData, backgroundMode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] text-xs text-[#18191B]"
                  >
                    <option value="Gradient">Gradient Soft</option>
                    <option value="Static">Static Clean White</option>
                    <option value="Particles">Subtle Particles</option>
                    <option value="Geometric">Geometric Cards</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-[#5E6168] mb-1">
                    Start Date
                  </label>
                  <input
                    type="text"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] text-xs text-[#18191B]"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-[#5E6168] mb-1">
                    End Date
                  </label>
                  <input
                    type="text"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] text-xs text-[#18191B]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-[#5E6168] mb-1">
                  Full Description / Overview *
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Explain the objectives, challenge scope, and problem statements..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] text-xs text-[#18191B] focus:outline-none focus:border-[#A39B89]"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: TRACKS & TIMELINE PREVIEW */}
        {step === 4 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-[#18191B] uppercase tracking-wider">
              4. Track Configuration & Automated Timeline
            </h3>

            <div className="p-4 rounded-2xl bg-[#F8F9FB] border border-[#E5E7EB] space-y-3">
              <span className="font-bold text-[#18191B]">Auto-Configured Tracks (Default 3 Tracks):</span>
              <ul className="space-y-2">
                <li className="p-2.5 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-between">
                  <div>
                    <p className="font-bold text-[#18191B]">Track 1: AI & Machine Learning Swarms</p>
                    <p className="text-[10px] text-[#5E6168]">Autonomous multi-agent systems and LLM workflows.</p>
                  </div>
                  <span className="font-bold text-[#A39B89]">$4,000</span>
                </li>
                <li className="p-2.5 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-between">
                  <div>
                    <p className="font-bold text-[#18191B]">Track 2: Full-Stack Web3 & Spatial UI</p>
                    <p className="text-[10px] text-[#5E6168]">Glassmorphism interfaces and high-performance web systems.</p>
                  </div>
                  <span className="font-bold text-[#A39B89]">$3,500</span>
                </li>
                <li className="p-2.5 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-between">
                  <div>
                    <p className="font-bold text-[#18191B]">Track 3: Cybersecurity & Zero-Trust Defense</p>
                    <p className="text-[10px] text-[#5E6168]">Offensive security tools and automated packet auditing.</p>
                  </div>
                  <span className="font-bold text-[#A39B89]">$2,500</span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F9FB] border border-[#E5E7EB] space-y-2">
              <span className="font-bold text-[#18191B]">Assigned Mentor Leads:</span>
              <p className="text-[11px] text-[#5E6168]">
                Ratnakar Karasala, Sahith Akula, Manoj Kumar Allu, Pandu Ranga Tummuri
              </p>
            </div>
          </div>
        )}

        {/* STEP 5: PREVIEW & PUBLISH */}
        {step === 5 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-[#18191B] uppercase tracking-wider">
              5. Final Event Generation Preview
            </h3>

            <div className="p-5 rounded-2xl bg-[#18191B] text-white space-y-3 shadow-lg border border-[#A39B89]/40">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-[#A39B89] text-white">
                  {formData.eventType}
                </span>
                <span className="text-[10px] text-[#C9B27D] font-mono font-bold">
                  Template: {formData.templateId}
                </span>
              </div>

              <h4 className="text-xl font-bold font-poppins text-white">{formData.title || "Untitled Event"}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{formData.tagline}</p>

              <div className="pt-3 border-t border-slate-800 grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                <div>
                  <span className="text-slate-400 block">PRIZE POOL</span>
                  <span className="font-bold text-[#C9B27D]">{formData.prizePool}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">MODE</span>
                  <span className="font-bold text-white">{formData.mode}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">DATES</span>
                  <span className="font-bold text-white">{formData.startDate}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Wizard Nav Controls */}
        <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1 || loading}
            className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-bold text-[#5E6168] hover:bg-[#F8F9FB] disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4 inline mr-1" />
            Back
          </button>

          {step < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-[#18191B] hover:bg-[#A39B89] text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePublishEvent}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#18191B] via-[#A39B89] to-[#C9B27D] text-white font-bold text-xs shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>{loading ? "Generating Event & Routes..." : "Publish Event to Turing Wings"}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
