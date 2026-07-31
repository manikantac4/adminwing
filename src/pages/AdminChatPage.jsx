import React, { useState, useEffect, useRef } from "react";
import {
  Send, Image as ImageIcon, Paperclip, Download, Smile, Folder, FileText,
  Trash2, X, Eye, File, Bot, FileSpreadsheet
} from "lucide-react";
import AdminNavbar from "../components/AdminNavbar";

const INITIAL_MESSAGES = [
  {
    id: "1",
    sender: "Ratnakar Karasala",
    role: "Cybersecurity Lead",
    text: "Hey team! Zero-Trust security protocols have been configured for the upcoming Cyber Security Guild track.",
    time: "08:15 AM",
    type: "text",
    isMe: false,
  },
  {
    id: "2",
    sender: "Sahith Akula",
    role: "Backend Lead",
    text: "Awesome! Express routes for user authentication are synced with MongoDB Atlas.",
    time: "08:18 AM",
    type: "text",
    isMe: false,
  },
  {
    id: "3",
    sender: "Pandu Ranga Tummuri",
    role: "UI Lead",
    text: "The AdminWing Command Center spatial glassmorphic dashboard is live!",
    time: "08:20 AM",
    type: "text",
    isMe: true,
  },
];

const STICKERS = ["🚀", "💻", "🛡️", "🔥", "⚡", "🥇", "🌐", "🔒", "🎉", "🧠", "🎯", "👑"];

export default function AdminChatPage({ currentUser }) {
  // Persistent chat history from localStorage
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("adminwing_chat_messages");
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [text, setText] = useState("");
  const [showStickers, setShowStickers] = useState(false);
  const [showMediaSidebar, setShowMediaSidebar] = useState(false);
  const [activeMediaTab, setActiveMediaTab] = useState("all");
  const [previewImage, setPreviewImage] = useState(null);

  const imageInputRef = useRef(null);
  const docInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Save chat to localStorage on change
  useEffect(() => {
    localStorage.setItem("adminwing_chat_messages", JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!text.trim()) return;

    const newMsg = {
      id: Date.now().toString(),
      sender: currentUser?.name || "Pandu Ranga Tummuri",
      role: "Lead Mentor",
      text: text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "text",
      isMe: true,
    };

    setMessages((prev) => [...prev, newMsg]);
    setText("");
    setShowStickers(false);
  };

  const handleSendSticker = (sticker) => {
    const newMsg = {
      id: Date.now().toString(),
      sender: currentUser?.name || "Pandu Ranga Tummuri",
      role: "Lead Mentor",
      sticker: sticker,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "sticker",
      isMe: true,
    };

    setMessages((prev) => [...prev, newMsg]);
    setShowStickers(false);
  };

  const handleFileUpload = (e, forcedType = null) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const fileData = event.target.result;
      const isImage = forcedType === "image" || file.type.startsWith("image/");

      const newMsg = {
        id: Date.now().toString(),
        sender: currentUser?.name || "Pandu Ranga Tummuri",
        role: "Lead Mentor",
        fileName: file.name,
        fileSize: (file.size / 1024).toFixed(1) + " KB",
        fileType: file.type,
        fileData: fileData,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: isImage ? "image" : "document",
        isMe: true,
      };

      setMessages((prev) => [...prev, newMsg]);
    };

    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const clearHistory = () => {
    if (window.confirm("Clear chat history?")) {
      setMessages([]);
      localStorage.removeItem("adminwing_chat_messages");
    }
  };

  // Filter media files for the WhatsApp-Style Sidebar
  const mediaItems = messages.filter((m) => m.type === "image" || m.type === "document");

  return (
    <div className="min-h-screen bg-[#f8f6f0] text-slate-900 flex flex-col select-none">
      <AdminNavbar currentUser={currentUser} />

      <div className="max-w-7xl mx-auto w-full p-3 sm:p-6 flex-1 flex flex-col lg:flex-row gap-4 sm:gap-6 text-left overflow-hidden">
        
        {/* MAIN CHAT AREA */}
        <div className="flex-1 glass-white p-3.5 sm:p-6 rounded-3xl flex flex-col justify-between border border-[#e2b740]/40 shadow-xl overflow-hidden min-h-[500px]">
          
          {/* Chat Header */}
          <div className="pb-3 mb-3 border-b border-slate-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-900 font-extrabold shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-extrabold font-serif italic text-slate-900 leading-none">
                  LEAD MENTORS CHAT HUB
                </h1>
                <span className="text-[10px] sm:text-xs text-amber-800 font-mono-tech font-bold block mt-1">
                  Persistent Storage • Image & Document Share
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowMediaSidebar(!showMediaSidebar)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                  showMediaSidebar
                    ? "bg-amber-500 text-slate-950 border-amber-500 shadow-sm"
                    : "bg-white border-slate-200 text-slate-800 hover:bg-slate-100"
                }`}
              >
                <Folder className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Media & Files</span>
                <span className="bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded-full text-[10px] font-black">
                  {mediaItems.length}
                </span>
              </button>

              <button
                onClick={clearHistory}
                className="p-1.5 rounded-xl bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors"
                title="Clear Chat History"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 space-y-3.5 overflow-y-auto pr-1 sm:pr-2 mb-3 my-auto max-h-[550px]">
            {messages.map((m) => (
              <div key={m.id} className={`flex flex-col ${m.isMe ? "items-end" : "items-start"}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-extrabold text-amber-900">{m.sender}</span>
                  <span className="text-[10px] text-slate-500 font-mono-tech">({m.role})</span>
                  <span className="text-[10px] text-slate-400">{m.time}</span>
                </div>

                <div
                  className={`p-3 sm:p-3.5 rounded-2xl max-w-[85%] sm:max-w-md text-xs border space-y-2 shadow-sm ${
                    m.isMe
                      ? "bg-amber-500/15 border-amber-500/30 text-slate-900"
                      : "bg-white border-slate-200 text-slate-800"
                  }`}
                >
                  {/* Text Message */}
                  {m.type === "text" && <p className="leading-relaxed">{m.text}</p>}

                  {/* Sticker Message */}
                  {m.type === "sticker" && (
                    <div className="text-4xl py-1 animate-bounce">{m.sticker}</div>
                  )}

                  {/* Image Attachment with Download Option */}
                  {m.type === "image" && (
                    <div className="space-y-2">
                      <div
                        onClick={() => setPreviewImage(m.fileData)}
                        className="relative rounded-xl overflow-hidden border border-slate-200 group cursor-pointer"
                      >
                        <img
                          src={m.fileData}
                          alt={m.fileName}
                          className="max-h-56 w-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <Eye className="w-6 h-6" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono-tech">
                        <span className="truncate font-bold text-slate-800 max-w-[140px] sm:max-w-[200px]">{m.fileName}</span>
                        <a
                          href={m.fileData}
                          download={m.fileName}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1 shrink-0 ml-2 shadow-sm"
                        >
                          <Download className="w-3 h-3" />
                          <span>Download</span>
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Document / File Attachment with Download Option */}
                  {m.type === "document" && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileText className="w-5 h-5 text-amber-600 shrink-0" />
                        <div className="truncate">
                          <span className="block font-bold text-slate-900 truncate max-w-[120px] sm:max-w-[180px]">{m.fileName}</span>
                          <span className="text-[10px] text-slate-500 font-mono-tech">{m.fileSize}</span>
                        </div>
                      </div>

                      <a
                        href={m.fileData}
                        download={m.fileName}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1 text-[11px] shrink-0 shadow-sm"
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

          {/* Sticker Selector Overlay */}
          {showStickers && (
            <div className="p-3 mb-2 rounded-2xl bg-white border border-amber-300 grid grid-cols-6 gap-2 text-center shadow-lg">
              {STICKERS.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendSticker(s)}
                  className="text-2xl p-2 rounded-xl hover:bg-amber-100 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Separate Hidden File Inputs */}
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

          {/* Chat Input Form with Explicit Separate Attachment Buttons */}
          <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-200 flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setShowStickers(!showStickers)}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 transition-colors shrink-0"
              title="Send Sticker"
            >
              <Smile className="w-4 h-4" />
            </button>

            {/* Explicit Photo Upload Button */}
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="p-2 sm:p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 transition-colors flex items-center gap-1 text-xs font-bold shrink-0"
              title="Upload Image/Photo"
            >
              <ImageIcon className="w-4 h-4 text-amber-600" />
              <span className="hidden md:inline">Photo</span>
            </button>

            {/* Explicit Document/File Upload Button */}
            <button
              type="button"
              onClick={() => docInputRef.current?.click()}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 hover:bg-slate-200 transition-colors flex items-center gap-1 text-xs font-bold shrink-0"
              title="Upload Document or Zip File"
            >
              <Paperclip className="w-4 h-4 text-slate-600" />
              <span className="hidden md:inline">File</span>
            </button>

            <input
              type="text"
              placeholder="Type message or paste code..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-medium min-w-0"
            />

            <button
              type="submit"
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 font-black text-xs shadow-md hover:scale-105 transition-all flex items-center gap-1.5 shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>

        {/* WHATSAPP-STYLE MEDIA & FILES SIDEBAR GALLERY */}
        {showMediaSidebar && (
          <div className="w-full lg:w-80 glass-white p-4 sm:p-5 rounded-3xl border border-[#e2b740]/40 flex flex-col justify-between shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="text-sm font-bold text-slate-900 font-serif italic">
                  Media & Documents Gallery
                </h3>
                <button
                  onClick={() => setShowMediaSidebar(false)}
                  className="text-slate-400 hover:text-slate-700 text-xs font-bold p-1 rounded-lg bg-slate-100"
                >
                  ✕ Close
                </button>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setActiveMediaTab("all")}
                  className={`flex-1 py-1 rounded-lg transition-all ${activeMediaTab === "all" ? "bg-white shadow-sm text-slate-900 font-extrabold" : "text-slate-600"}`}
                >
                  All ({mediaItems.length})
                </button>
                <button
                  onClick={() => setActiveMediaTab("images")}
                  className={`flex-1 py-1 rounded-lg transition-all ${activeMediaTab === "images" ? "bg-white shadow-sm text-slate-900 font-extrabold" : "text-slate-600"}`}
                >
                  Photos
                </button>
                <button
                  onClick={() => setActiveMediaTab("docs")}
                  className={`flex-1 py-1 rounded-lg transition-all ${activeMediaTab === "docs" ? "bg-white shadow-sm text-slate-900 font-extrabold" : "text-slate-600"}`}
                >
                  Files
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {mediaItems.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">No media uploaded yet</p>
                ) : (
                  mediaItems
                    .filter((item) => {
                      if (activeMediaTab === "images") return item.type === "image";
                      if (activeMediaTab === "docs") return item.type === "document";
                      return true;
                    })
                    .map((item) => (
                      <div key={item.id} className="p-3 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-sm">
                        {item.type === "image" ? (
                          <img
                            src={item.fileData}
                            alt={item.fileName}
                            className="h-28 w-full object-cover rounded-xl border border-slate-100"
                          />
                        ) : (
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                            <FileText className="w-5 h-5 text-amber-600 shrink-0" />
                            <span className="truncate">{item.fileName}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono-tech">
                          <span className="truncate max-w-[120px]">By {item.sender}</span>
                          <a
                            href={item.fileData}
                            download={item.fileName}
                            className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1 shadow-sm"
                          >
                            <Download className="w-3 h-3" />
                            <span>Download</span>
                          </a>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FULLSCREEN IMAGE PREVIEW MODAL */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-10 right-0 text-white text-xs font-bold bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700"
            >
              Close ✕
            </button>
            <img
              src={previewImage}
              alt="Preview"
              className="max-h-[80vh] w-full object-contain rounded-2xl shadow-2xl border border-amber-500/40"
            />
          </div>
        </div>
      )}
    </div>
  );
}
