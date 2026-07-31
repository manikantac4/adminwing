import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare, X, Send, Image as ImageIcon, Paperclip, Download,
  Smile, Folder, FileText, Bot, Maximize2, Minimize2, ChevronLeft
} from "lucide-react";

const BACKEND_CHAT_URL = "https://turingwings-backend.onrender.com/api/chat";

const INITIAL_MESSAGES = [
  {
    id: "1",
    sender: "Ratnakar Karasala",
    role: "Cybersecurity Lead",
    text: "Hey team! Zero-Trust security protocols have been configured for the upcoming Cyber Security Guild track.",
    time: "08:15 AM",
    type: "text",
    isMe: false,
    read: false,
  },
  {
    id: "2",
    sender: "Sahith Akula",
    role: "Backend Lead",
    text: "Awesome! Express routes for user authentication are synced with MongoDB Atlas.",
    time: "08:18 AM",
    type: "text",
    isMe: false,
    read: false,
  },
  {
    id: "3",
    sender: "Pandu Ranga Tummuri",
    role: "UI Lead",
    text: "The AdminWing Command Center spatial dashboard is live!",
    time: "08:20 AM",
    type: "text",
    isMe: true,
    read: true,
  },
];

const STICKERS = ["🚀", "💻", "🛡️", "🔥", "⚡", "🥇", "🌐", "🔒", "🎉", "🧠"];

export default function AdminChatWidget({ currentUser, isOpen, onClose, onMarkAllRead }) {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("adminwing_chat_messages");
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [mediaCollection, setMediaCollection] = useState(() => {
    const saved = localStorage.getItem("adminwing_media_files");
    return saved ? JSON.parse(saved) : [];
  });

  const [text, setText] = useState("");
  const [showStickers, setShowStickers] = useState(false);
  const [showMediaFolder, setShowMediaFolder] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const imageInputRef = useRef(null);
  const docInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Fetch messages from MongoDB Atlas Server (Merged across Phone & Laptop!)
  const fetchBackendMessages = async () => {
    try {
      const res = await fetch(BACKEND_CHAT_URL);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
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

          // Extract Media Items
          const mediaItems = formatted.filter((m) => m.type === "image" || m.type === "document");
          setMediaCollection(mediaItems);
          localStorage.setItem("adminwing_media_files", JSON.stringify(mediaItems));
        }
      }
    } catch {
      // Fallback to local state if offline
    }
  };

  // CONTINUOUS LIVE POLLING (Every 1.5 seconds from MongoDB Atlas)
  useEffect(() => {
    fetchBackendMessages();
    const interval = setInterval(fetchBackendMessages, 1500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // When Chatbot is opened, mark all unread messages as read automatically!
  useEffect(() => {
    if (isOpen) {
      setMessages((prev) => {
        const updated = prev.map((m) => ({ ...m, read: true }));
        localStorage.setItem("adminwing_chat_messages", JSON.stringify(updated));
        return updated;
      });

      // Send read status to MongoDB Atlas server
      fetch(`${BACKEND_CHAT_URL}/read`, { method: "POST" }).catch(() => {});

      if (onMarkAllRead) onMarkAllRead();
    }
  }, [isOpen]);

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
    setShowStickers(false);

    try {
      const res = await fetch(BACKEND_CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        fetchBackendMessages();
      } else {
        throw new Error("Local fallback");
      }
    } catch {
      const fallbackMsg = { id: Date.now().toString(), ...payload };
      setMessages((prev) => [...prev, fallbackMsg]);
    }
  };

  const handleSendSticker = async (sticker) => {
    const payload = {
      sender: currentUser?.name || "Pandu Ranga Tummuri",
      role: "Lead Mentor",
      sticker: sticker,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "sticker",
      isMe: true,
      read: true,
    };

    setShowStickers(false);

    try {
      const res = await fetch(BACKEND_CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        fetchBackendMessages();
      }
    } catch {
      const fallbackMsg = { id: Date.now().toString(), ...payload };
      setMessages((prev) => [...prev, fallbackMsg]);
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
        const res = await fetch(BACKEND_CHAT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          fetchBackendMessages();
        }
      } catch {
        const fallbackMsg = { id: Date.now().toString(), ...payload };
        setMessages((prev) => [...prev, fallbackMsg]);
      }
    };

    reader.readAsDataURL(file);
    e.target.value = "";
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed z-50 bg-white border border-[#E5E7EB] shadow-2xl flex flex-col text-left font-sans transition-all duration-300 ${
        isFullscreen
          ? "inset-0 w-full h-full rounded-none"
          : "inset-0 sm:inset-auto sm:bottom-4 sm:right-4 sm:w-[420px] sm:h-[540px] sm:rounded-3xl w-full h-full rounded-none"
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

          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#A39B89] flex items-center justify-center text-white font-bold shrink-0">
            <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>

          <div>
            <h3 className="text-xs sm:text-sm font-bold font-poppins text-white leading-none">
              Mentor Chatbot Hub
            </h3>
            <span className="text-[9px] sm:text-[10px] text-[#C9B27D] font-medium block mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              MongoDB Atlas Merged (Phone + Laptop)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
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

      {/* Main Content */}
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
                  className={`p-3 rounded-2xl max-w-[88%] sm:max-w-[80%] text-xs space-y-1.5 shadow-sm ${
                    m.isMe
                      ? "bg-[#18191B] text-white"
                      : "bg-white border border-[#E5E7EB] text-[#18191B]"
                  }`}
                >
                  {m.type === "text" && <p className="leading-relaxed">{m.text}</p>}

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
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}

        {showStickers && (
          <div className="p-2 mb-2 rounded-xl bg-white border border-[#E5E7EB] grid grid-cols-5 gap-1.5 text-center shadow-md">
            {STICKERS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSendSticker(s)}
                className="text-2xl p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
              >
                {s}
              </button>
            ))}
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
            onClick={() => setShowStickers(!showStickers)}
            className="p-2 sm:p-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#5E6168] hover:bg-slate-100 transition-colors"
            title="Stickers"
          >
            <Smile className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className="p-2 sm:p-2.5 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] text-[#18191B] hover:bg-[#E5E7EB] transition-colors"
            title="Attach Photo"
          >
            <ImageIcon className="w-4 h-4 text-[#A39B89]" />
          </button>

          <button
            type="button"
            onClick={() => docInputRef.current?.click()}
            className="p-2 sm:p-2.5 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] text-[#5E6168] hover:bg-[#E5E7EB] transition-colors"
            title="Attach File/Document"
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
  );
}
