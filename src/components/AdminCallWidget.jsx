import React, { useState, useEffect } from "react";
import {
  PhoneCall, PhoneOff, Maximize2, Minimize2, Mic, MicOff, Video, VideoOff,
  Link as LinkIcon, Check, Monitor, Copy
} from "lucide-react";

export default function AdminCallWidget({ currentUser, isOpen, onClose, roomInfo }) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      console.log("📞 Meeting Call Initialized by Owner:", currentUser?.name || "Lead Mentor");
      console.log("🔗 Room ID:", roomInfo?.roomId || "TuringWings_HQ_Meeting");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const roomId = roomInfo?.roomId || "TuringWings_MentorHQ_Call_2026";
  const userDisplayName = encodeURIComponent(currentUser?.name || "Lead Mentor");
  
  // Real WebRTC Stream with Video, Audio, and Screen Sharing controls
  const jitsiUrl = `https://meet.jit.si/${roomId}#userInfo.displayName="${userDisplayName}"&config.prejoinPageEnabled=false&config.startWithAudioMuted=false&config.startWithVideoMuted=false&interfaceConfig.TOOLBAR_BUTTONS=['microphone','camera','desktop','hangup']`;

  const handleCopyLink = () => {
    const shareableUrl = `${window.location.origin}/?room=${roomId}`;
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      className={`fixed z-50 bg-[#18191B] border border-slate-700 shadow-2xl transition-all duration-300 flex flex-col font-sans text-white ${
        isMinimized
          ? "bottom-4 left-4 w-80 h-48 rounded-2xl overflow-hidden shadow-glow"
          : "bottom-4 right-4 sm:bottom-6 sm:right-6 w-[92vw] sm:w-[480px] h-[520px] rounded-3xl overflow-hidden"
      }`}
    >
      {/* Call Header */}
      <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#18191B] to-[#A39B89] flex items-center justify-center text-white font-bold animate-pulse">
            <PhoneCall className="w-4 h-4 text-[#C9B27D]" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold font-poppins text-white leading-none">
              Mentor Live Meeting
            </h3>
            <span className="text-[10px] text-[#C9B27D] font-mono mt-0.5 block">
              Host: {currentUser?.name || "Lead Mentor"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Instant 1-Click Copy Call Link at Start */}
          <button
            onClick={handleCopyLink}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 text-[#C9B27D] hover:text-white hover:bg-slate-700 transition-colors text-xs font-bold flex items-center gap-1 relative"
            title="Copy Meeting Share Link"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="text-[10px]">{copied ? "Copied!" : "Copy Link"}</span>
          </button>

          {/* Minimize Floating PIP Toggle */}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            title={isMinimized ? "Expand Call Screen" : "Minimize to Floating Call"}
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>

          {/* End Call Button */}
          <button
            onClick={onClose}
            className="p-1.5 px-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1 transition-colors"
            title="End Call"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">End</span>
          </button>
        </div>
      </div>

      {/* Main Video, Audio & Screen Share Frame */}
      <div className="flex-1 bg-black relative overflow-hidden">
        <iframe
          src={jitsiUrl}
          allow="camera; microphone; display-capture; autoplay; clipboard-write"
          className="w-full h-full border-0"
          title="Mentor Live Audio & Video Call Room"
        />

        {isMinimized && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex flex-col items-center justify-center p-2 text-center pointer-events-none">
            <PhoneCall className="w-6 h-6 text-[#C9B27D] animate-bounce mb-1" />
            <span className="text-xs font-bold text-white">Call Active in Background</span>
            <span className="text-[9px] text-slate-300">Browsing website allowed</span>
          </div>
        )}
      </div>

      {/* Bottom Bar Indicator */}
      {!isMinimized && (
        <div className="bg-slate-900 py-2 px-4 border-t border-slate-800 flex items-center justify-between shrink-0 text-[10px] text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live WebRTC • Video, Audio & Screen Share
          </span>
          <button onClick={onClose} className="text-red-400 hover:underline font-bold">
            Cut Call
          </button>
        </div>
      )}
    </div>
  );
}
