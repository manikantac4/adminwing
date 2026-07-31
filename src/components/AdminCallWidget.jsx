import React, { useState, useEffect, useRef } from "react";
import {
  PhoneCall, PhoneOff, Maximize2, Minimize2, Mic, MicOff, Video, VideoOff,
  Monitor, Copy, Check, ShieldCheck, Users, Radio
} from "lucide-react";

export default function AdminCallWidget({ currentUser, isOpen, onClose, roomInfo }) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  const localVideoRef = useRef(null);
  const screenVideoRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);

  // Initialize Native WebRTC Video & Audio Media Stream
  useEffect(() => {
    let mediaStream = null;

    if (isOpen) {
      console.log("📞 Native Custom Meeting Room Started");
      console.log("👤 Host Admin:", currentUser?.name, `(@${currentUser?.username})`);

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
    }

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
      if (screenStream) {
        screenStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen]);

  // Toggle Mic
  const handleToggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  // Toggle Camera
  const handleToggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  // Toggle Native Screen Sharing
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
      className={`fixed z-50 bg-[#18191B] border border-slate-800 shadow-2xl transition-all duration-300 flex flex-col font-sans text-white ${
        isMinimized
          ? "bottom-4 left-4 w-80 h-52 rounded-2xl overflow-hidden shadow-glow"
          : "bottom-4 right-4 sm:bottom-6 sm:right-6 w-[92vw] sm:w-[540px] h-[580px] rounded-3xl overflow-hidden"
      }`}
    >
      {/* Header */}
      <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#18191B] to-[#A39B89] flex items-center justify-center text-white font-bold animate-pulse">
            <ShieldCheck className="w-4.5 h-4.5 text-[#C9B27D]" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold font-poppins text-white leading-none">
              Native Mentor HQ Meeting Room
            </h3>
            <span className="text-[10px] text-[#C9B27D] font-mono mt-0.5 block">
              Host: {currentUser?.name || "Lead Mentor"} (@{currentUser?.username || "admin"})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Copy Meeting Link */}
          <button
            onClick={handleCopyLink}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 text-[#C9B27D] hover:text-white hover:bg-slate-700 transition-colors text-xs font-bold flex items-center gap-1"
            title="Copy Share Link"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="text-[10px]">{copied ? "Copied!" : "Copy Link"}</span>
          </button>

          {/* Minimize PIP Button */}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            title={isMinimized ? "Expand Call" : "Minimize to PIP"}
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>

          {/* End Call Button */}
          <button
            onClick={onClose}
            className="p-1.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1 transition-colors"
            title="End Call"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">End</span>
          </button>
        </div>
      </div>

      {/* Custom Native WebRTC Meeting Video Grid */}
      <div className="flex-1 bg-slate-950 p-3 flex flex-col gap-3 overflow-y-auto">
        {/* Screen Share Stage (if active) */}
        {isScreenSharing ? (
          <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-800 h-64 shrink-0">
            <video ref={screenVideoRef} autoPlay playsInline className="w-full h-full object-contain" />
            <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] font-bold text-emerald-400 flex items-center gap-1">
              <Monitor className="w-3 h-3" />
              <span>Screen Share Active</span>
            </div>
          </div>
        ) : null}

        {/* Participant Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
          
          {/* Main Local Admin Video Card */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 min-h-[160px] flex items-center justify-center">
            {isVideoOff ? (
              <div className="flex flex-col items-center space-y-2">
                <div className="w-14 h-14 rounded-full bg-[#18191B] text-[#C9B27D] border-2 border-[#A39B89] flex items-center justify-center font-black text-xl shadow-md">
                  {currentUser?.name ? currentUser.name.charAt(0) : "A"}
                </div>
                <span className="text-xs font-bold text-white">{currentUser?.name || "Lead Mentor"}</span>
                <span className="text-[9px] text-slate-400 font-mono">Camera Paused</span>
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

            <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] font-bold text-white flex items-center gap-1.5">
              <span>{currentUser?.name || "You"} (Host)</span>
              {isMuted ? <MicOff className="w-3 h-3 text-red-400" /> : <Mic className="w-3 h-3 text-emerald-400" />}
            </div>
          </div>

          {/* Active Mentor Participant Cards */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 min-h-[160px] flex items-center justify-center p-4">
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="w-14 h-14 rounded-full bg-[#A39B89] text-white border-2 border-amber-400 flex items-center justify-center font-black text-xl shadow-md relative">
                R
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
              </div>
              <span className="text-xs font-bold text-white">Ratnakar Karasala</span>
              <span className="text-[9px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                <Radio className="w-3 h-3 animate-pulse" />
                Connected
              </span>
            </div>

            <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] font-bold text-white flex items-center gap-1.5">
              <span>Ratnakar K.</span>
              <Mic className="w-3 h-3 text-emerald-400" />
            </div>
          </div>

        </div>
      </div>

      {/* Custom Audio & Video Meeting Control Bar */}
      {!isMinimized && (
        <div className="bg-slate-900 py-3 px-6 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Users className="w-4 h-4 text-[#C9B27D]" />
            <span className="font-bold text-white">2 Participants</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Mic Button */}
            <button
              onClick={handleToggleMic}
              className={`p-3 rounded-2xl font-bold transition-all shadow-md ${
                isMuted ? "bg-red-600 text-white" : "bg-slate-800 text-white hover:bg-slate-700"
              }`}
              title={isMuted ? "Unmute Mic" : "Mute Mic"}
            >
              {isMuted ? <MicOff className="w-4.5 h-4.5" /> : <Mic className="w-4.5 h-4.5" />}
            </button>

            {/* Camera Button */}
            <button
              onClick={handleToggleVideo}
              className={`p-3 rounded-2xl font-bold transition-all shadow-md ${
                isVideoOff ? "bg-red-600 text-white" : "bg-slate-800 text-white hover:bg-slate-700"
              }`}
              title={isVideoOff ? "Turn On Camera" : "Turn Off Camera"}
            >
              {isVideoOff ? <VideoOff className="w-4.5 h-4.5" /> : <Video className="w-4.5 h-4.5" />}
            </button>

            {/* Screen Share Button */}
            <button
              onClick={handleToggleScreenShare}
              className={`p-3 rounded-2xl font-bold transition-all shadow-md ${
                isScreenSharing ? "bg-emerald-600 text-white" : "bg-slate-800 text-white hover:bg-slate-700"
              }`}
              title="Share Screen"
            >
              <Monitor className="w-4.5 h-4.5" />
            </button>

            {/* End Meeting Button */}
            <button
              onClick={onClose}
              className="p-3 px-5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
            >
              <PhoneOff className="w-4 h-4" />
              <span>Leave Meeting</span>
            </button>
          </div>

          <span className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Native WebRTC
          </span>
        </div>
      )}
    </div>
  );
}
