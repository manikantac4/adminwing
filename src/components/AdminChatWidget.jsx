import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare, X, Send, Image as ImageIcon, Paperclip, Download,
  Smile, Folder, FileText, Eye, Bot, Sparkles
} from "lucide-react";

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
    text: "The AdminWing Command Center spatial dashboard is live!",
    time: "08:20 AM",
    type: "text",
    isMe: true,
  },
];

const STICKERS = ["🚀", "💻", "🛡️", "🔥", "⚡", "🥇", "🌐", "🔒", "🎉", "🧠"];

export default function AdminChatWidget({ currentUser, isOpen, onClose }) {
  // Separate Storage Collections: Chat Messages & Media Files
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
  const [previewImage, setPreviewImage] = useState(null);

  const imageInputRef = useRef(null);
  const docInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Sync to database / localStorage collections
  useEffect(() => {
    localStorage.setItem("adminwing_chat_messages", JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("adminwing_media_files", JSON.stringify(mediaCollection));
  }, [mediaCollection]);

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

      const mediaEntry = {
        id: Date.now().toString(),
        sender: currentUser?.name || "Pandu Ranga Tummuri",
        fileName: file.name,
        fileSize: (file.size / 1024).toFixed(1) + " KB",
        fileType: file.type,
        fileData: fileData,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: isImage ? "image" : "document",
      };

      // Add to Chat Messages Collection
      const newMsg = {
        ...mediaEntry,
        role: "Lead Mentor",
        isMe: true,
      };

      setMessages((prev) => [...prev, newMsg]);
      // Add to Separate Media Storage Collection
      setMediaCollection((prev) => [mediaEntry, ...prev]);
    };

    reader.readAsDataURL(file);
    e.target.value = "";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm sm:max-w-md bg-white border border-[#E5E7EB] rounded-3xl shadow-glow overflow-hidden flex flex-col text-left font-sans">
      
      {/* Chatbot Top Header */}
      <div className="bg-[#18191B] p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#A39B89] flex items-center justify-center text-white font-bold">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-poppins text-white leading-none">
              Mentor Chatbot
            </h3>
            <span className="text-[10px] text-[#C9B27D] font-medium block mt-0.5">
              Live Storage Sync • Photos & Files
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMediaFolder(!showMediaFolder)}
            className={`p-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1 ${
              showMediaFolder ? "bg-[#A39B89] text-white border-[#A39B89]" : "bg-slate-800 text-slate-300 border-slate-700"
            }`}
            title="Media Collection"
          >
            <Folder className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold">{mediaCollection.length}</span>
          </button>

          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between bg-[#F8F9FB] min-h-[380px] max-h-[460px]">
        
        {/* MEDIA COLLECTION DRAWER */}
        {showMediaFolder ? (
          <div className="space-y-3 overflow-y-auto max-h-[360px] pr-1">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2">
              <span className="text-xs font-bold text-[#18191B]">Media Storage Collection</span>
              <span className="text-[10px] text-[#5E6168]">{mediaCollection.length} Items</span>
            </div>

            {mediaCollection.length === 0 ? (
              <p className="text-xs text-[#8B9098] text-center py-8">No uploaded photos or files yet</p>
            ) : (
              mediaCollection.map((item) => (
                <div key={item.id} className="p-2.5 rounded-2xl bg-white border border-[#E5E7EB] space-y-2">
                  {item.type === "image" ? (
                    <img
                      src={item.fileData}
                      alt={item.fileName}
                      className="h-24 w-full object-cover rounded-xl border border-[#E5E7EB]"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-xs font-bold text-[#18191B]">
                      <FileText className="w-4 h-4 text-[#A39B89] shrink-0" />
                      <span className="truncate">{item.fileName}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[10px] text-[#5E6168]">
                    <span>By {item.sender}</span>
                    <a
                      href={item.fileData}
                      download={item.fileName}
                      className="px-2 py-0.5 rounded-md bg-[#18191B] hover:bg-[#A39B89] text-white font-bold flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* MESSAGES STREAM */
          <div className="space-y-3 overflow-y-auto max-h-[360px] pr-1 mb-2">
            {messages.map((m) => (
              <div key={m.id} className={`flex flex-col ${m.isMe ? "items-end" : "items-start"}`}>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[11px] font-bold text-[#18191B]">{m.sender}</span>
                  <span className="text-[9px] text-[#8B9098]">{m.time}</span>
                </div>

                <div
                  className={`p-3 rounded-2xl max-w-[85%] text-xs space-y-1.5 shadow-sm ${
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
                        className="max-h-40 w-full object-cover rounded-xl cursor-pointer"
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
                    <div className="p-2 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] flex items-center justify-between gap-2 text-[#18191B]">
                      <div className="flex items-center gap-1.5 overflow-hidden">
                        <FileText className="w-4 h-4 text-[#A39B89] shrink-0" />
                        <span className="font-bold text-[11px] truncate max-w-[120px]">{m.fileName}</span>
                      </div>
                      <a
                        href={m.fileData}
                        download={m.fileName}
                        className="px-2 py-0.5 rounded-md bg-[#18191B] text-white font-bold text-[10px] flex items-center gap-1 shrink-0"
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

        {/* Sticker Selector */}
        {showStickers && (
          <div className="p-2 mb-2 rounded-xl bg-white border border-[#E5E7EB] grid grid-cols-5 gap-1 text-center shadow-md">
            {STICKERS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSendSticker(s)}
                className="text-xl p-1 rounded-lg hover:bg-slate-100"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Hidden Inputs */}
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

        {/* Input Form with Photo, File & Send triggers */}
        <form onSubmit={handleSendMessage} className="pt-2 border-t border-[#E5E7EB] flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowStickers(!showStickers)}
            className="p-2 rounded-xl bg-white border border-[#E5E7EB] text-[#5E6168] hover:bg-slate-100"
            title="Stickers"
          >
            <Smile className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className="p-2 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] text-[#18191B] hover:bg-[#E5E7EB]"
            title="Attach Photo"
          >
            <ImageIcon className="w-4 h-4 text-[#A39B89]" />
          </button>

          <button
            type="button"
            onClick={() => docInputRef.current?.click()}
            className="p-2 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] text-[#5E6168] hover:bg-[#E5E7EB]"
            title="Attach File/Document"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <input
            type="text"
            placeholder="Ask chatbot or type..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#E5E7EB] text-xs text-[#18191B] focus:outline-none focus:border-[#A39B89]"
          />

          <button
            type="submit"
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#18191B] hover:bg-[#A39B89] text-white font-bold text-xs shadow-md transition-all flex items-center gap-1"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-lg w-full">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-8 right-0 text-white text-xs font-bold"
            >
              Close ✕
            </button>
            <img src={previewImage} alt="Preview" className="max-h-[70vh] w-full object-contain rounded-2xl" />
          </div>
        </div>
      )}
    </div>
  );
}
