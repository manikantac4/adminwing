import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare, X, Send, Image as ImageIcon, Paperclip, Download,
  Smile, Folder, FileText, Bot, Maximize2, Minimize2, ChevronLeft,
  Camera, CheckCheck, Check, Users, Link as LinkIcon, PhoneCall, Copy,
  CheckCircle2, Circle
} from "lucide-react";
import AdminCallWidget from "./AdminCallWidget";

const BACKEND_CHAT_URL = "https://turingwings-backend.onrender.com/api/chat";
const BACKEND_ADMIN_URL = "https://turingwings-backend.onrender.com/api/admin";

const EMOJI_CATEGORIES = {
  Reactions: ["👍", "❤️", "🔥", "👏", "🎉", "🚀", "💡", "⚡", "💯", "🙌"],
  Tech: ["💻", "🖥️", "📱", "🛡️", "🔒", "⚙️", "🌐", "🧠", "🥇", "📊"],
  Smileys: ["😀", "😎", "🤩", "🥳", "🤖", "👨‍💻", "🙌", "💪", "✨", "🎯"],
};

export default function AdminChatWidget({ currentUser, isOpen, onClose, onMarkAllRead }) {
  const [messages, setMessages] = useState([]);
  const [mediaCollection, setMediaCollection] = useState([]);
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Reactions");
  const [showMediaFolder, setShowMediaFolder] = useState(false);
  const [showOnlineUsers, setShowOnlineUsers] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Real Online Mentors list from MongoDB Atlas
  const [onlineMentors, setOnlineMentors] = useState([]);

  // Live Audio/Video Meeting Room State
  const [isCallActive, setIsCallActive] = useState(false);

  // Live Device Camera Modal State
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const imageInputRef = useRef(null);
  const docInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Send Heartbeat to MongoDB Atlas & Fetch Real Online Mentors
  const syncOnlinePresence = async () => {
    try {
      if (currentUser?.username) {
        await fetch(`${BACKEND_ADMIN_URL}/heartbeat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: currentUser.username }),
        });
      }

      const res = await fetch(`${BACKEND_ADMIN_URL}/online-mentors`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setOnlineMentors(data);
        }
      }
    } catch {
      // Fallback
    }
  };

  // Fetch messages from MongoDB Atlas Server
  const fetchBackendMessages = async () => {
    try {
      const res = await fetch(BACKEND_CHAT_URL);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const formatted = data.map((m) => ({
            id: m._id || m.id,
            sender: m.sender,
            role: m.role,
            text: m.text,
            sticker: m.sticker,
            fileName: m.fileName,
            fileSize: m.fileSize,
            fileType: m.fileType,
            fileData: m.fileData,
            type: m.type,
            isMe: m.sender === (currentUser?.name || "Pandu Ranga Tummuri"),
            read: m.read,
            time: m.time,
          }));

          setMessages(formatted);
          localStorage.setItem("adminwing_chat_messages", JSON.stringify(formatted));

          const mediaItems = formatted.filter((m) => m.type === "image" || m.type === "document");
          setMediaCollection(mediaItems);
          localStorage.setItem("adminwing_media_files", JSON.stringify(mediaItems));
        }
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchBackendMessages();
    syncOnlinePresence();

    const chatInterval = setInterval(fetchBackendMessages, 1200);
    const presenceInterval = setInterval(syncOnlinePresence, 5000);

    return () => {
      clearInterval(chatInterval);
      clearInterval(presenceInterval);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      fetch(`${BACKEND_CHAT_URL}/read`, { method: "POST" }).catch(() => {});
      if (onMarkAllRead) onMarkAllRead();
    }
  }, [isOpen]);

  const handleCopyChatLink = () => {
    const roomUrl = `${window.location.origin}/?room=mentor-hq-call`;
    navigator.clipboard.writeText(roomUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleOpenCamera = async () => {
    try {
      setShowCameraModal(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert("Camera access denied or device camera unavailable: " + err.message);
      setShowCameraModal(false);
    }
  };

  const handleCloseCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }
    setCameraStream(null);
    setShowCameraModal(false);
  };

  const handleCapturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const photoData = canvas.toDataURL("image/jpeg", 0.85);

    handleCloseCamera();

    const payload = {
      sender: currentUser?.name || "Pandu Ranga Tummuri",
      role: "Lead Mentor",
      fileName: `LiveSnapshot_${Date.now()}.jpg`,
      fileSize: "120 KB",
      fileType: "image/jpeg",
      fileData: photoData,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "image",
      isMe: true,
      read: true,
    };

    try {
      await fetch(BACKEND_CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      fetchBackendMessages();
    } catch {
      setMessages((prev) => [...prev, { id: Date.now().toString(), ...payload }]);
    }
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!text.trim()) return;

    const payload = {
      sender: currentUser?.name || "Pandu Ranga Tummuri",
      role: "Lead Mentor",
      text: text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "text",
      isMe: true,
      read: true,
    };

    setText("");
    setShowEmojiPicker(false);

    try {
      await fetch(BACKEND_CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      fetchBackendMessages();
    } catch {
      setMessages((prev) => [...prev, { id: Date.now().toString(), ...payload }]);
    }
  };

  const handleSendEmoji = async (emoji) => {
    const payload = {
      sender: currentUser?.name || "Pandu Ranga Tummuri",
      role: "Lead Mentor",
      sticker: emoji,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "sticker",
      isMe: true,
      read: true,
    };

    setShowEmojiPicker(false);

    try {
      await fetch(BACKEND_CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      fetchBackendMessages();
    } catch {
      setMessages((prev) => [...prev, { id: Date.now().toString(), ...payload }]);
    }
  };

  const handleFileUpload = async (e, forcedType = null) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const fileData = event.target.result;
      const isImage = forcedType === "image" || file.type.startsWith("image/");

      const payload = {
        sender: currentUser?.name || "Pandu Ranga Tummuri",
        role: "Lead Mentor",
        fileName: file.name,
        fileSize: (file.size / 1024).toFixed(1) + " KB",
        fileType: file.type,
        fileData: fileData,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: isImage ? "image" : "document",
        isMe: true,
        read: true,
      };

      try {
        await fetch(BACKEND_CHAT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        fetchBackendMessages();
      } catch {
        setMessages((prev) => [...prev, { id: Date.now().toString(), ...payload }]);
      }
    };

    reader.readAsDataURL(file);
    e.target.value = "";
  };

  if (!isOpen) return null;

  return (
    <>
      {/* REAL WEBRTC AUDIO & VIDEO CALL WIDGET */}
      <AdminCallWidget
        currentUser={currentUser}
        isOpen={isCallActive}
        onClose={() => setIsCallActive(false)}
      />

      <div
        className={`fixed z-50 bg-white border border-[#E5E7EB] shadow-2xl flex flex-col text-left font-sans transition-all duration-300 ${
          isFullscreen
            ? "inset-0 w-full h-full rounded-none"
            : "inset-0 sm:inset-auto sm:bottom-4 sm:right-4 sm:w-[440px] sm:h-[560px] sm:rounded-3xl w-full h-full rounded-none"
        }`}
      >
        {/* Header */}
        <div className="bg-[#18191B] p-3.5 sm:p-4 text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={onClose}
              className="sm:hidden p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              title="Back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#A39B89] flex items-center justify-center text-white font-bold shrink-0 relative">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#18191B]" />
            </div>

            <div>
              <h3 className="text-xs sm:text-sm font-bold font-poppins text-white leading-none">
                Mentor Chatbot Hub
              </h3>
              <button
                onClick={() => setShowOnlineUsers(!showOnlineUsers)}
                className="text-[9px] sm:text-[10px] text-[#C9B27D] font-medium block mt-0.5 hover:underline flex items-center gap-1"
              >
                <Circle className="w-2 h-2 fill-emerald-400 text-emerald-400 animate-pulse" />
                <span>{onlineMentors.length || 1} Mentors Online (MongoDB Atlas)</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Real Audio/Video Meeting Call Button */}
            <button
              onClick={() => setIsCallActive(true)}
              className="p-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 transition-all shadow-md"
              title="Start Live Meeting Call"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Call</span>
            </button>

            {/* Copy Shareable Room Call Link */}
            <button
              onClick={handleCopyChatLink}
              className="p-1.5 rounded-lg bg-slate-800 text-[#C9B27D] hover:text-white hover:bg-slate-700 transition-all flex items-center gap-1 relative"
              title="Copy Group Call Link"
            >
              <LinkIcon className="w-3.5 h-3.5" />
              {copiedLink && (
                <span className="absolute -bottom-7 right-0 px-2 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-bold whitespace-nowrap shadow-md">
                  Link Copied!
                </span>
              )}
            </button>

            {/* Online Directory Toggle Button */}
            <button
              onClick={() => setShowOnlineUsers(!showOnlineUsers)}
              className={`p-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1 ${
                showOnlineUsers ? "bg-[#A39B89] text-white border-[#A39B89]" : "bg-slate-800 text-slate-300 border-slate-700"
              }`}
              title="Online Mentors Directory"
            >
              <Users className="w-3.5 h-3.5" />
            </button>

            {/* Media Folder Toggle */}
            <button
              onClick={() => setShowMediaFolder(!showMediaFolder)}
              className={`px-2 py-1 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 ${
                showMediaFolder ? "bg-[#A39B89] text-white border-[#A39B89]" : "bg-slate-800 text-slate-300 border-slate-700"
              }`}
              title="Media Collection"
            >
              <Folder className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold">{mediaCollection.length}</span>
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="hidden sm:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isFullscreen ? "Exit Full Screen" : "Full Screen"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* REAL ONLINE MENTORS ROSTER DRAWER */}
        {showOnlineUsers && (
          <div className="p-3 bg-[#18191B] border-b border-slate-800 text-white space-y-2 text-xs">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#C9B27D]">
              <span>Real Online Mentors (MongoDB Atlas)</span>
              <button onClick={() => setShowOnlineUsers(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {onlineMentors.length === 0 ? (
                <div className="col-span-2 text-slate-400 text-center py-2">
                  No other mentors online right now
                </div>
              ) : (
                onlineMentors.map((m) => (
                  <div key={m._id} className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#A39B89] text-white font-bold text-xs flex items-center justify-center relative shrink-0">
                      {m.name ? m.name.charAt(0) : "M"}
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-slate-900 bg-emerald-500" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-bold text-[11px] truncate">{m.name}</p>
                      <span className="text-[9px] text-emerald-400 block truncate font-bold">Online Now</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col justify-between bg-[#F8F9FB] p-3 sm:p-4 overflow-hidden">
          {showMediaFolder ? (
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2">
                <span className="text-xs font-bold text-[#18191B]">Media Storage Collection</span>
                <span className="text-[10px] text-[#5E6168]">{mediaCollection.length} Items</span>
              </div>

              {mediaCollection.length === 0 ? (
                <div className="text-center py-12 text-[#8B9098] space-y-1">
                  <Folder className="w-8 h-8 mx-auto text-[#A39B89] opacity-40" />
                  <p className="text-xs font-bold">No uploaded media yet</p>
                  <p className="text-[10px]">Photos and files sent in chat will appear here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {mediaCollection.map((item) => (
                    <div key={item.id} className="p-2.5 rounded-2xl bg-white border border-[#E5E7EB] space-y-2 shadow-sm">
                      {item.type === "image" ? (
                        <img
                          src={item.fileData}
                          alt={item.fileName}
                          className="h-28 w-full object-cover rounded-xl border border-[#E5E7EB]"
                        />
                      ) : (
                        <div className="flex items-center gap-2 text-xs font-bold text-[#18191B] p-2 bg-[#F8F9FB] rounded-xl">
                          <FileText className="w-4 h-4 text-[#A39B89] shrink-0" />
                          <span className="truncate">{item.fileName}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[10px] text-[#5E6168]">
                        <span>By {item.sender}</span>
                        <a
                          href={item.fileData}
                          download={item.fileName}
                          className="px-2 py-1 rounded-md bg-[#18191B] hover:bg-[#A39B89] text-white font-bold flex items-center gap-1 transition-colors"
                        >
                          <Download className="w-3 h-3" />
                          <span>Download</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 mb-2">
              {messages.map((m) => (
                <div key={m.id} className={`flex flex-col ${m.isMe ? "items-end" : "items-start"}`}>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[11px] font-bold text-[#18191B]">{m.sender}</span>
                    <span className="text-[9px] text-[#8B9098]">{m.time}</span>
                  </div>

                  <div
                    className={`p-3 rounded-2xl max-w-[88%] sm:max-w-[82%] text-xs space-y-1.5 shadow-sm relative ${
                      m.isMe
                        ? "bg-[#18191B] text-white"
                        : "bg-white border border-[#E5E7EB] text-[#18191B]"
                    }`}
                  >
                    {m.type === "text" && <p className="leading-relaxed pr-4">{m.text}</p>}

                    {m.type === "sticker" && <div className="text-3xl py-0.5 animate-bounce">{m.sticker}</div>}

                    {m.type === "image" && (
                      <div className="space-y-1.5">
                        <img
                          src={m.fileData}
                          alt={m.fileName}
                          onClick={() => setPreviewImage(m.fileData)}
                          className="max-h-48 sm:max-h-56 w-full object-cover rounded-xl cursor-pointer hover:opacity-95 transition-opacity"
                        />
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="truncate max-w-[130px] font-bold">{m.fileName}</span>
                          <a
                            href={m.fileData}
                            download={m.fileName}
                            className="px-2 py-0.5 rounded-md bg-[#A39B89] text-white font-bold flex items-center gap-1 shrink-0 ml-1"
                          >
                            <Download className="w-3 h-3" />
                            <span>Download</span>
                          </a>
                        </div>
                      </div>
                    )}

                    {m.type === "document" && (
                      <div className="p-2.5 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] flex items-center justify-between gap-2 text-[#18191B]">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <FileText className="w-4 h-4 text-[#A39B89] shrink-0" />
                          <span className="font-bold text-[11px] truncate max-w-[130px] sm:max-w-[160px]">{m.fileName}</span>
                        </div>
                        <a
                          href={m.fileData}
                          download={m.fileName}
                          className="px-2 py-1 rounded-md bg-[#18191B] hover:bg-[#A39B89] text-white font-bold text-[10px] flex items-center gap-1 shrink-0 transition-colors"
                        >
                          <Download className="w-3 h-3" />
                          <span>Download</span>
                        </a>
                      </div>
                    )}

                    {m.isMe && (
                      <div className="flex justify-end pt-0.5">
                        {m.read ? (
                          <span className="flex items-center text-[#C9B27D]" title="Seen by Mentor">
                            <CheckCheck className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="flex items-center text-slate-400" title="Sent to Server">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}

          {showEmojiPicker && (
            <div className="p-2.5 mb-2 rounded-2xl bg-white border border-[#E5E7EB] shadow-xl space-y-2">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-1.5 text-[11px] font-bold text-[#18191B]">
                <div className="flex gap-2">
                  {Object.keys(EMOJI_CATEGORIES).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-2 py-0.5 rounded-lg transition-colors ${
                        activeCategory === cat ? "bg-[#18191B] text-white" : "text-[#5E6168] hover:bg-slate-100"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <button onClick={() => setShowEmojiPicker(false)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>

              <div className="grid grid-cols-5 gap-1.5 text-center max-h-32 overflow-y-auto">
                {EMOJI_CATEGORIES[activeCategory].map((emoji, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendEmoji(emoji)}
                    className="text-2xl p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          <input
            type="file"
            ref={imageInputRef}
            accept="image/*"
            onChange={(e) => handleFileUpload(e, "image")}
            className="hidden"
          />

          <input
            type="file"
            ref={docInputRef}
            accept=".pdf,.doc,.docx,.zip,.rar,.txt,.js,.py,.json,.png,.jpg"
            onChange={(e) => handleFileUpload(e, "document")}
            className="hidden"
          />

          <form onSubmit={handleSendMessage} className="pt-2 border-t border-[#E5E7EB] flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 sm:p-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#5E6168] hover:bg-slate-100 transition-colors"
              title="Emoji & Stickers"
            >
              <Smile className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleOpenCamera}
              className="p-2 sm:p-2.5 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] text-[#18191B] hover:bg-[#E5E7EB] transition-colors"
              title="Take Live Camera Photo"
            >
              <Camera className="w-4 h-4 text-[#A39B89]" />
            </button>

            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="p-2 sm:p-2.5 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] text-[#18191B] hover:bg-[#E5E7EB] transition-colors"
              title="Upload Photo"
            >
              <ImageIcon className="w-4 h-4 text-[#5E6168]" />
            </button>

            <button
              type="button"
              onClick={() => docInputRef.current?.click()}
              className="p-2 sm:p-2.5 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] text-[#5E6168] hover:bg-[#E5E7EB] transition-colors"
              title="Attach Document"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 px-3 py-2 sm:py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-xs text-[#18191B] focus:outline-none focus:border-[#A39B89] font-medium"
            />

            <button
              type="submit"
              className="p-2 sm:px-3.5 sm:py-2.5 rounded-xl bg-[#18191B] hover:bg-[#A39B89] text-white font-bold text-xs shadow-md transition-all flex items-center gap-1"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* LIVE DEVICE CAMERA MODAL */}
        {showCameraModal && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#18191B] border border-slate-800 rounded-3xl p-4 max-w-md w-full space-y-4 text-center">
              <div className="flex items-center justify-between text-white border-b border-slate-800 pb-2">
                <span className="text-xs font-bold flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-[#C9B27D]" />
                  Live Camera Capture
                </span>
                <button onClick={handleCloseCamera} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border border-slate-800">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <canvas ref={canvasRef} className="hidden" />
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handleCloseCamera}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCapturePhoto}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#18191B] via-[#A39B89] to-[#C9B27D] text-white font-bold text-xs shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>Capture & Send Photo</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image Preview Modal */}
        {previewImage && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative max-w-xl w-full">
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute -top-10 right-0 px-3 py-1 bg-white/20 rounded-full text-white text-xs font-bold hover:bg-white/40"
              >
                Close ✕
              </button>
              <img src={previewImage} alt="Preview" className="max-h-[75vh] w-full object-contain rounded-2xl shadow-2xl" />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
