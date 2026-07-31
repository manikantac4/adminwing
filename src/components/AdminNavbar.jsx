import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck, LogOut, LayoutDashboard, Users, Menu, X, Bell, MessageSquare } from "lucide-react";

export default function AdminNavbar({ currentUser, unreadCount = 2, toggleChatbot }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("turing_wings_user");
    localStorage.removeItem("turing_wings_token");
    navigate("/login");
  };

  const navLinks = [
    { name: "Home", path: "/", icon: LayoutDashboard },
    { name: "Admin Directory", path: "/users", icon: Users },
  ];

  const notificationsList = [
    { id: "1", title: "New Announcement Published", time: "5m ago", type: "system" },
    { id: "2", title: "Chatbot Message from Ratnakar Karasala", time: "12m ago", type: "chat" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB] py-2.5 px-3 sm:px-8 flex flex-col transition-all shadow-sm">
      <div className="flex items-center justify-between w-full">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-2 sm:gap-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-[#18191B] to-[#A39B89] flex items-center justify-center text-white font-black shadow-md group-hover:scale-105 transition-transform shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#C9B27D]" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-sm sm:text-lg font-bold tracking-wider text-[#18191B] font-poppins">
                  ADMIN<span className="text-[#A39B89]">WING</span>
                </span>
                <span className="hidden xs:inline px-1.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-bold uppercase bg-[#F8F9FB] border border-[#E5E7EB] text-[#5E6168]">
                  HQ
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 pl-4 border-l border-[#E5E7EB]">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#18191B] text-white font-bold shadow-md"
                      : "text-[#5E6168] hover:bg-[#F8F9FB] hover:text-[#18191B]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Action Icons & User Info */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Notification Bell Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="p-2 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] text-[#18191B] hover:bg-[#E5E7EB] transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-[#18191B]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifs && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl p-3 z-50 text-left space-y-2">
                <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2">
                  <span className="text-xs font-bold text-[#18191B]">Notifications</span>
                  <span className="text-[10px] text-[#A39B89] font-bold">{notificationsList.length} New</span>
                </div>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {notificationsList.map((n) => (
                    <div key={n.id} className="p-2 rounded-xl bg-[#F8F9FB] text-xs space-y-0.5">
                      <p className="font-bold text-[#18191B] text-[11px]">{n.title}</p>
                      <span className="text-[10px] text-[#8B9098]">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Chatbot Launcher Button */}
          <button
            onClick={toggleChatbot}
            className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-[#18191B] hover:bg-[#A39B89] text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            title="Open Chatbot Hub"
          >
            <MessageSquare className="w-4 h-4 text-[#C9B27D]" />
            <span className="hidden sm:inline">Mentor Chatbot</span>
          </button>

          {/* User Info Capsule */}
          <div className="flex items-center gap-2 pl-1 sm:pl-3 border-l border-[#E5E7EB]">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#F8F9FB] border border-[#E5E7EB] flex items-center justify-center text-[#18191B] font-bold text-xs">
              {currentUser?.name ? currentUser.name.charAt(0) : "A"}
            </div>
            <div className="text-left hidden lg:block">
              <span className="text-xs font-bold text-[#18191B] block leading-none">
                {currentUser?.name || "Lead Mentor"}
              </span>
              <span className="text-[10px] text-[#5E6168]">
                @{currentUser?.username || "admin"}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-1.5 sm:p-2 rounded-xl bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors flex items-center gap-1 text-xs font-bold"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] text-[#18191B]"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="md:hidden pt-3 pb-2 border-t border-[#E5E7EB] mt-2 space-y-1.5 text-left">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;

            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-[#18191B] text-white font-bold"
                    : "text-[#5E6168] hover:bg-[#F8F9FB]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
