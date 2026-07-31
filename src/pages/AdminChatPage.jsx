import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Send, PhoneCall, Bot } from "lucide-react";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminChatPage({ currentUser, onStartCall }) {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    {
      id: "1",
      sender: "Ratnakar",
      role: "Cybersecurity Lead",
      text: "Zero-Trust security protocols are synced in MongoDB Atlas.",
      time: "08:15 AM",
      isMe: false,
    },
    {
      id: "2",
      sender: "Sahith Akula",
      role: "Backend Lead",
      text: "Express auth endpoints connected cleanly.",
      time: "08:18 AM",
      isMe: false,
    },
    {
      id: "3",
      sender: "Pandu Ranga",
      role: "UI Lead",
      text: "The AdminWing Command Center is live! Click the link below to join.",
      time: "08:20 AM",
      isMe: true,
    },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg = {
      id: Date.now().toString(),
      sender: currentUser?.name || "Pandu Ranga",
      role: "Lead Mentor",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMe: true,
    };

    setMessages((prev) => [...prev, msg]);
    setNewMessage("");
  };

  const handleQuickVoiceCallLink = () => {
    const roomId = `room-sentinel-${Math.floor(Math.random() * 900 + 100)}`;
    const msg = {
      id: Date.now().toString(),
      sender: currentUser?.name || "Pandu Ranga",
      role: "Lead Mentor",
      text: `📞 Started a Voice Call for SENTINEL Discussion! Join here: ${window.location.origin}/call/${roomId}`,
      isCallLink: true,
      roomId: roomId,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMe: true,
    };

    setMessages((prev) => [...prev, msg]);
  };

  return (
    <div className="min-h-screen bg-[#040508] text-slate-100 selection:bg-amber-500 selection:text-slate-950 flex flex-col">
      <AdminNavbar currentUser={currentUser} onStartCall={onStartCall} />

      <main className="max-w-7xl mx-auto w-full p-4 sm:p-8 flex-1 flex flex-col justify-between text-left">
        {/* Top Header */}
        <div className="glass-gold p-5 rounded-3xl mb-6 flex items-center justify-between border border-amber-500/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-serif italic text-white">
                MENTOR CHATBOT & MESSAGING HUB
              </h1>
              <p className="text-xs text-slate-400 font-mono-tech">
                Real-time channel between Ratnakar, Sahith, Manoj & Pandu
              </p>
            </div>
          </div>

          <button
            onClick={handleQuickVoiceCallLink}
            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 hover:scale-105 transition-all shrink-0"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Share Call Link</span>
          </button>
        </div>

        {/* MESSAGES DISPLAY CONTAINER */}
        <div className="flex-1 space-y-4 overflow-y-auto pr-2 mb-6 my-auto">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col ${msg.isMe ? "items-end" : "items-start"}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-extrabold text-amber-400">{msg.sender}</span>
                <span className="text-[10px] text-slate-500 font-mono-tech">({msg.role})</span>
                <span className="text-[10px] text-slate-600">{msg.time}</span>
              </div>

              <div
                className={`p-4 rounded-2xl max-w-lg text-left text-xs leading-relaxed border ${
                  msg.isCallLink
                    ? "bg-amber-500/15 border-amber-500/40 text-amber-300"
                    : msg.isMe
                    ? "bg-amber-500/20 border-amber-500/30 text-slate-100"
                    : "bg-slate-900 border-slate-800 text-slate-200"
                }`}
              >
                <p>{msg.text}</p>
                
                {msg.isCallLink && (
                  <button
                    onClick={() => navigate(`/call/${msg.roomId}`)}
                    className="mt-3 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs shadow-md flex items-center gap-2 hover:scale-105 transition-all"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Join Call Room Now</span>
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* INPUT FORM */}
        <form onSubmit={handleSendMessage} className="glass-gold p-3 rounded-2xl flex items-center gap-3 border border-amber-500/30">
          <input
            type="text"
            placeholder="Type message or share architectural code..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
          />

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 hover:scale-105 transition-all flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </form>
      </main>
    </div>
  );
}
