import React, { useState, useEffect, useRef } from "react";
import {
  PhoneCall, PhoneOff, Maximize2, Minimize2, Mic, MicOff, Video, VideoOff,
  Monitor, Copy, Check, ShieldCheck, Users, Radio, Link as LinkIcon
} from "lucide-react";

const BACKEND_ADMIN_URL = "https://turingwings-backend.onrender.com/api/admin";

export default function AdminCallWidget({ currentUser, isOpen, onClose, roomInfo }) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  const [connectedMentors, setConnectedMentors] = useState([]);

  const localVideoRef = useRef(null);
  const screenVideoRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);

  const fetchActiveMentors = async () => {
    try {
      const res = await fetch(`${BACKEND_ADMIN_URL}/online-mentors`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const others = data.filter(
            (m) => m.username !== currentUser?.username && m.name !== currentUser?.name
          );
          setConnectedMentors(others);
        }
      }
    } catch {
      setConnectedMentors([]);
    }
  };

  useEffect(() => {
    let mediaStream = null;

    if (isOpen) {
      fetchActiveMentors();
      const interval = setInterval(fetchActiveMentors, 3000);

      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          mediaStream = stream;
          setLocalStream(stream);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.warn("Camera/Mic permission warning:", err.message);
        });

      return () => {
        clearInterval(interval);
        if (mediaStream) {
          mediaStream.getTracks().forEach((track) => track.stop());
        }
        if (screenStream) {
          screenStream.getTracks().forEach((track) => track.stop());
        }
      };
    }
  }, [isOpen]);

  const handleToggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const handleToggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const handleToggleScreenShare = async () => {
    if (isScreenSharing) {
      if (screenStream) {
        screenStream.getTracks().forEach((track) => track.stop());
        setScreenStream(null);
      }
      setIsScreenSharing(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        setScreenStream(stream);
        setIsScreenSharing(true);
        if (screenVideoRef.current) {
          screenVideoRef.current.srcObject = stream;
        }

        stream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          setScreenStream(null);
        };
      } catch (err) {
        console.warn("Screen share cancelled:", err.message);
      }
    }
  };

  const handleCopyLink = () => {
    const roomId = roomInfo?.roomId || "TuringWings_MentorHQ_Call_2026";
    const shareableUrl = `${window.location.origin}/?room=${roomId}`;
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed z-50 bg-[#18191B] border border-slate-800 shadow-2xl transition-all duration-300 flex flex-col font-sans text-white max-w-full ${
        isFullscreen
          ? "inset-0 w-full h-full rounded-none"
          : isMinimized
          ? "bottom-3 left-3 w-[280px] h-[180px] rounded-2xl overflow-hidden shadow-glow"
          : "bottom-2 right-2 sm:bottom-4 sm:right-4 w-[calc(100vw-1rem)] sm:w-[480px] max-h-[85vh] sm:max-h-[520px] rounded-2xl sm:rounded-3xl overflow-hidden"
      }`}
    >
      {/* Header */}
      <div className="bg-slate-900 px-3 py-2.5 sm:px-4 sm:py-3 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-[#18191B] to-[#A39B89] flex items-center justify-center text-white font-bold shrink-0">
            <ShieldCheck className="w-4 h-4 text-[#C9B27D]" />
          </div>
          <div className="overflow-hidden">
            <h3 className="text-xs sm:text-sm font-bold font-poppins text-white truncate">
              Native Mentor Call
            </h3>
            <span className="text-[9px] sm:text-[10px] text-[#C9B27D] font-mono truncate block">
              Host: {currentUser?.name || "Lead Mentor"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <button
            onClick={handleCopyLink}
            className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-800 text-[#C9B27D] hover:text-white hover:bg-slate-700 transition-colors text-[10px] sm:text-xs font-bold flex items-center gap-1"
            title="Copy Share Link"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span className="hidden xs:inline">{copied ? "Copied!" : "Link"}</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors hidden sm:flex"
            title={isFullscreen ? "Exit Full Screen" : "Full Screen"}
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            title={isMinimized ? "Expand Call" : "Minimize to PIP"}
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClose}
            className="p-1.5 px-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1 transition-colors"
            title="End Call"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">End</span>
          </button>
        </div>
      </div>

      {/* Media Video Stage */}
      <div className="flex-1 bg-slate-950 p-2 sm:p-3 flex flex-col gap-2.5 overflow-y-auto min-h-0">
        {isScreenSharing && (
          <div className="relative rounded-xl overflow-hidden bg-black border border-slate-800 h-44 sm:h-56 shrink-0">
            <video ref={screenVideoRef} autoPlay playsInline className="w-full h-full object-contain" />
            <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-lg text-[9px] font-bold text-emerald-400 flex items-center gap-1">
              <Monitor className="w-3 h-3" />
              <span>Screen Share</span>
            </div>
          </div>
        )}

        <div className={`grid gap-2.5 flex-1 min-h-[180px] ${connectedMentors.length > 0 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
          
          {/* Main Local Admin Video Card */}
          <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 min-h-[160px] flex items-center justify-center">
            {isVideoOff ? (
              <div className="flex flex-col items-center space-y-1.5 p-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#18191B] text-[#C9B27D] border-2 border-[#A39B89] flex items-center justify-center font-black text-xl shadow-md">
                  {currentUser?.name ? currentUser.name.charAt(0) : "A"}
                </div>
                <span className="text-xs font-bold text-white text-center truncate max-w-[140px]">
                  {currentUser?.name || "Lead Mentor"}
                </span>
                <span className="text-[9px] text-slate-400 font-mono">Camera Off</span>
              </div>
            ) : (
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover transform scale-x-[-1]"
              />
            )}

            <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-lg text-[9px] sm:text-[10px] font-bold text-white flex items-center gap-1">
              <span className="truncate max-w-[120px]">{currentUser?.name || "You"} (Host)</span>
              {isMuted ? <MicOff className="w-3 h-3 text-red-400" /> : <Mic className="w-3 h-3 text-emerald-400" />}
            </div>
          </div>

          {/* Dynamic Remote Mentors */}
          {connectedMentors.length === 0 ? (
            <div className="rounded-xl sm:rounded-2xl bg-slate-900/60 border border-dashed border-slate-800 p-4 flex flex-col items-center justify-center text-center space-y-1.5">
              <Users className="w-6 h-6 text-[#A39B89] opacity-50" />
              <p className="text-xs font-bold text-white">Waiting for mentors to join...</p>
              <button
                onClick={handleCopyLink}
                className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-[#C9B27D] font-bold text-[10px] flex items-center gap-1 transition-colors"
              >
                <LinkIcon className="w-3 h-3" />
                <span>{copied ? "Link Copied!" : "Copy Link"}</span>
              </button>
            </div>
          ) : (
            connectedMentors.map((m) => (
              <div key={m._id} className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 min-h-[160px] flex items-center justify-center p-3">
                <div className="flex flex-col items-center space-y-1.5 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#A39B89] text-white border-2 border-emerald-400 flex items-center justify-center font-black text-lg shadow-md relative">
                    {m.name ? m.name.charAt(0) : "M"}
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-900" />
                  </div>
                  <span className="text-xs font-bold text-white truncate max-w-[130px]">{m.name}</span>
                  <span className="text-[9px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                    <Radio className="w-2.5 h-2.5 animate-pulse" />
                    Connected
                  </span>
                </div>

                <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-lg text-[9px] font-bold text-white flex items-center gap-1">
                  <span className="truncate max-w-[100px]">{m.name}</span>
                  <Mic className="w-3 h-3 text-emerald-400" />
                </div>
              </div>
            ))
          )}

        </div>
      </div>

      {/* Control Bar */}
      {!isMinimized && (
        <div className="bg-slate-900 py-2.5 px-3 sm:px-6 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="hidden xs:flex items-center gap-1.5 text-[11px] text-slate-400">
            <Users className="w-3.5 h-3.5 text-[#C9B27D]" />
            <span className="font-bold text-white">{connectedMentors.length + 1}</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 mx-auto xs:mx-0">
            <button
              onClick={handleToggleMic}
              className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl font-bold transition-all shadow-md ${
                isMuted ? "bg-red-600 text-white" : "bg-slate-800 text-white hover:bg-slate-700"
              }`}
              title={isMuted ? "Unmute Mic" : "Mute Mic"}
            >
              {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              onClick={handleToggleVideo}
              className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl font-bold transition-all shadow-md ${
                isVideoOff ? "bg-red-600 text-white" : "bg-slate-800 text-white hover:bg-slate-700"
              }`}
              title={isVideoOff ? "Turn On Camera" : "Turn Off Camera"}
            >
              {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
            </button>

            <button
              onClick={handleToggleScreenShare}
              className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl font-bold transition-all shadow-md ${
                isScreenSharing ? "bg-emerald-600 text-white" : "bg-slate-800 text-white hover:bg-slate-700"
              }`}
              title="Share Screen"
            >
              <Monitor className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2.5 px-4 sm:px-5 rounded-xl sm:rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg transition-transform hover:scale-105"
            >
              <PhoneOff className="w-3.5 h-3.5" />
              <span>Leave</span>
            </button>
          </div>

          <span className="hidden md:flex text-[11px] text-emerald-400 font-mono font-bold items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            WebRTC
          </span>
        </div>
      )}
    </div>
  );
}
