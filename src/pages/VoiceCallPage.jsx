import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic, MicOff, Volume2, VolumeX, PhoneOff, Copy, Check,
  MessageCircle, Users, Radio, Shield, Sparkles
} from "lucide-react";
import AdminNavbar from "../components/AdminNavbar";

export default function VoiceCallPage({ currentUser, onStartCall }) {
  const { roomId } = useParams();
  const currentRoom = roomId || "room-sentinel-01";

  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOff, setIsSpeakerOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedMentorPhone, setSelectedMentorPhone] = useState("919876543210");
  const [customProjectName, setCustomProjectName] = useState("SENTINEL Discussion");

  const [participants, setParticipants] = useState([
    { id: "1", name: "Pandu Ranga", role: "UI Lead", isSpeaking: true, avatar: "P", isMicOn: true },
    { id: "2", name: "Sahith Akula", role: "Backend Lead", isSpeaking: false, avatar: "S", isMicOn: true },
    { id: "3", name: "Ratnakar", role: "Cybersecurity Lead", isSpeaking: false, avatar: "R", isMicOn: false },
    { id: "4", name: "Manoj Kumar", role: "Growth Lead", isSpeaking: false, avatar: "M", isMicOn: true },
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCallDuration((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  const fullCallLink = `${window.location.origin}/call/${currentRoom}`;

  const copyCallLink = () => {
    navigator.clipboard.writeText(fullCallLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const generateWhatsAppLink = () => {
    const message = `📞 ${currentUser?.name || "Pandu"} is inviting you to a voice call.\n\n🕒 Time: Now\n👥 Project: ${customProjectName}\n\n👉 Click to Join Voice Room:\n${fullCallLink}\n\nThis invitation link is active now.`;
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${selectedMentorPhone}?text=${encoded}`;
  };

  const mentorsList = [
    { name: "Ratnakar", role: "Cybersecurity Lead", phone: "919876543210" },
    { name: "Sahith Akula", role: "Backend Lead", phone: "919876543211" },
    { name: "Manoj Kumar", role: "Backend & Marketing Lead", phone: "919876543212" },
    { name: "Pandu Ranga", role: "Frontend & UI Lead", phone: "919876543213" },
  ];

  return (
    <div className="min-h-screen bg-[#040508] text-slate-100 selection:bg-amber-500 selection:text-slate-950 flex flex-col">
      <AdminNavbar currentUser={currentUser} onStartCall={onStartCall} />

      <main className="max-w-7xl mx-auto w-full p-4 sm:p-8 space-y-6 text-left flex-1 flex flex-col justify-between">
        {/* Top Voice Room Header */}
        <div className="glass-gold-glow p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-amber-500/40">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-xs font-black uppercase text-emerald-400 font-mono-tech tracking-wider">
                LIVE WEBRTC VOICE ROOM ACTIVE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif italic text-white">
              PROJECT: <span className="text-[#e2b740]">{customProjectName}</span>
            </h1>
            <p className="text-xs text-slate-400 font-mono-tech mt-1">
              ROOM ID: <span className="text-amber-300 font-bold">{currentRoom}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-slate-900 border border-amber-500/30 text-amber-300 font-mono-tech font-bold text-sm flex items-center gap-2 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>{formatDuration(callDuration)}</span>
            </div>

            <button
              onClick={() => setShowInviteModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Invite via WhatsApp</span>
            </button>
          </div>
        </div>

        {/* MAIN WEBRTC VOICE ROOM PARTICIPANTS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left my-auto">
          {participants.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`relative rounded-3xl p-6 glass-gold flex flex-col items-center justify-between text-center min-h-[260px] border transition-all ${
                p.isSpeaking ? "border-amber-400 shadow-xl shadow-amber-500/10" : "border-slate-800"
              }`}
            >
              <div className="w-full flex justify-between items-center mb-4">
                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                  p.isSpeaking ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "bg-slate-800 text-slate-400"
                }`}>
                  {p.isSpeaking ? "Speaking..." : "Connected"}
                </span>

                {p.isMicOn ? (
                  <Mic className="w-4 h-4 text-amber-400" />
                ) : (
                  <MicOff className="w-4 h-4 text-red-400" />
                )}
              </div>

              <div className="relative my-4 flex items-center justify-center">
                {p.isSpeaking && (
                  <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping scale-125 pointer-events-none" />
                )}
                
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 border-2 border-amber-300 flex items-center justify-center text-slate-950 font-black text-2xl shadow-xl shadow-amber-500/20 z-10">
                  {p.avatar}
                </div>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-white">{p.name}</h3>
                <span className="text-xs text-amber-400 font-mono-tech">{p.role}</span>
              </div>

              {p.isSpeaking && (
                <div className="flex items-center gap-1 mt-3">
                  <span className="w-1 bg-amber-400 rounded-full animate-wave-1" />
                  <span className="w-1 bg-amber-400 rounded-full animate-wave-2" />
                  <span className="w-1 bg-amber-400 rounded-full animate-wave-3" />
                  <span className="w-1 bg-amber-400 rounded-full animate-wave-4" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* BOTTOM WEBRTC AUDIO CONTROL BAR */}
        <div className="glass-gold-glow p-4 sm:p-5 rounded-3xl flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 border border-amber-500/40">
          <button
            onClick={copyCallLink}
            className="px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold flex items-center gap-2 hover:border-amber-500/40 transition-all text-slate-300"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
            <span>{copiedLink ? "Link Copied!" : "Copy Room Link"}</span>
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-4 rounded-full border transition-all shadow-lg ${
                isMuted
                  ? "bg-red-500/20 border-red-500/50 text-red-400"
                  : "bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-amber-500/20"
              }`}
              title={isMuted ? "Unmute Mic" : "Mute Mic"}
            >
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>

            <button
              onClick={() => setIsSpeakerOff(!isSpeakerOff)}
              className={`p-4 rounded-full border transition-all shadow-lg ${
                isSpeakerOff
                  ? "bg-red-500/20 border-red-500/50 text-red-400"
                  : "bg-slate-900 border-slate-800 text-slate-300"
              }`}
              title={isSpeakerOff ? "Turn On Speaker" : "Turn Off Speaker"}
            >
              {isSpeakerOff ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </button>

            <Link
              to="/"
              className="px-6 py-3.5 rounded-full bg-red-600 text-white font-black text-xs flex items-center gap-2 shadow-xl shadow-red-600/30 hover:bg-red-700 transition-all"
            >
              <PhoneOff className="w-5 h-5" />
              <span>Leave Voice Room</span>
            </Link>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono-tech text-slate-400 font-bold">
            <Users className="w-4 h-4 text-amber-400" />
            <span>{participants.length} Active Participants</span>
          </div>
        </div>
      </main>

      {/* WHATSAPP INVITATION MODAL */}
      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-lg glass-gold-glow p-6 sm:p-8 rounded-3xl text-left border border-amber-500/40 relative shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-xl font-bold font-serif italic text-white">
                    Send WhatsApp Voice Invitation
                  </h2>
                </div>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="text-slate-400 hover:text-white text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Project / Discussion Topic
                  </label>
                  <input
                    type="text"
                    value={customProjectName}
                    onChange={(e) => setCustomProjectName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Select Lead Mentor to Invite
                  </label>
                  <select
                    value={selectedMentorPhone}
                    onChange={(e) => setSelectedMentorPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    {mentorsList.map((m, idx) => (
                      <option key={idx} value={m.phone}>
                        {m.name} ({m.role}) — {m.phone}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 text-xs space-y-2 text-slate-300 font-mono-tech">
                  <span className="text-[10px] font-bold uppercase text-emerald-400 block">
                    PRE-FILLED WHATSAPP MESSAGE TEMPLATE:
                  </span>
                  <p className="whitespace-pre-line text-slate-200">
                    📞 {currentUser?.name || "Pandu"} is inviting you to a voice call.
                    {"\n\n"}
                    🕒 Time: Now
                    {"\n"}
                    👥 Project: {customProjectName}
                    {"\n\n"}
                    👉 Click to Join Voice Room:
                    {"\n"}
                    {fullCallLink}
                  </p>
                </div>
              </div>

              <a
                href={generateWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 text-center flex items-center justify-center gap-2 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Open WhatsApp & Send Message</span>
              </a>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
