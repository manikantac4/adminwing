import React, { useState } from "react";
import { PhoneCall, PhoneOff, Maximize2, Minimize2, Mic, MicOff, Video, VideoOff, Users } from "lucide-react";

export default function AdminCallWidget({ currentUser, isOpen, onClose }) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  if (!isOpen) return null;

  const roomName = "TuringWings_MentorHQ_LiveCall_2026";
  const userDisplayName = encodeURIComponent(currentUser?.name || "Lead Mentor");
  const jitsiUrl = `https://meet.jit.si/${roomName}#userInfo.displayName="${userDisplayName}"&config.prejoinPageEnabled=false&interfaceConfig.TOOLBAR_BUTTONS=['microphone','camera','desktop','hangup','chat']`;

  return (
    <div
      className={`fixed z-50 bg-[#18191B] border border-slate-700 shadow-2xl transition-all duration-300 flex flex-col font-sans text-white ${
        isMinimized
          ? "bottom-4 left-4 w-72 h-44 rounded-2xl overflow-hidden shadow-glow"
          : "inset-4 sm:inset-10 w-auto h-auto rounded-3xl overflow-hidden"
      }`}
    >
      {/* Call Bar Header */}
      <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#18191B] to-[#A39B89] flex items-center justify-center text-white font-bold animate-pulse">
            <PhoneCall className="w-4 h-4 text-[#C9B27D]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold font-poppins text-white leading-none">
                Real Mentor HQ Audio & Video Call
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <span className="text-[10px] text-[#C9B27D] font-mono mt-0.5 block">
              Active WebRTC Stream • Background PIP Mode Active
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Minimize / Floating PIP Toggle Button */}
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
            className="p-1.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
            title="End Meeting"
          >
            <PhoneOff className="w-4 h-4" />
            <span className="hidden sm:inline">End Call</span>
          </button>
        </div>
      </div>

      {/* Main Video Meeting Frame (Real Jitsi / WebRTC Room) */}
      <div className="flex-1 bg-black relative overflow-hidden">
        <iframe
          src={jitsiUrl}
          allow="camera; microphone; display-capture; autoplay; clipboard-write"
          className="w-full h-full border-0"
          title="Mentor Live Video & Audio Call Room"
        />

        {isMinimized && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center p-2 text-center pointer-events-none">
            <PhoneCall className="w-6 h-6 text-[#C9B27D] animate-bounce mb-1" />
            <span className="text-xs font-bold text-white">Call Active in Background</span>
            <span className="text-[9px] text-slate-400">Browsing website allowed</span>
          </div>
        )}
      </div>

      {/* Bottom Floating Control Bar */}
      {!isMinimized && (
        <div className="bg-slate-900 py-3 px-6 border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-400 font-mono">
            Room: <span className="text-[#C9B27D] font-bold">TuringWings-HQ</span>
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-2.5 rounded-full font-bold transition-all ${
                isMuted ? "bg-red-600 text-white" : "bg-slate-800 text-slate-200 hover:bg-slate-700"
              }`}
              title={isMuted ? "Unmute Mic" : "Mute Mic"}
            >
              {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`p-2.5 rounded-full font-bold transition-all ${
                isVideoOff ? "bg-red-600 text-white" : "bg-slate-800 text-slate-200 hover:bg-slate-700"
              }`}
              title={isVideoOff ? "Turn On Video" : "Turn Off Video"}
            >
              {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2.5 px-5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
            >
              <PhoneOff className="w-4 h-4" />
              <span>Hang Up</span>
            </button>
          </div>

          <span className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Encrypted WebRTC
          </span>
        </div>
      )}
    </div>
  );
}
