import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck, MessageSquare, LogOut, LayoutDashboard, Users, Menu, X } from "lucide-react";

export default function AdminNavbar({ currentUser }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("turing_wings_user");
    localStorage.removeItem("turing_wings_token");
    navigate("/login");
  };

  const navLinks = [
    { name: "Home", path: "/", icon: LayoutDashboard },
    { name: "Live Chat", path: "/chat", icon: MessageSquare },
    { name: "Admin", path: "/users", icon: Users },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-[#e2b740]/40 py-3.5 px-4 sm:px-8 flex flex-col transition-all shadow-sm">
      <div className="flex items-center justify-between w-full">
        {/* Brand Title */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-base sm:text-lg font-black tracking-wider text-slate-900">
                  ADMIN<span className="text-[#d97706]">WING</span>
                </span>
                <span className="px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase bg-amber-500/10 border border-amber-500/30 text-amber-900">
                  HQ COMMAND
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Embedded Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 pl-4 border-l border-slate-200">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 shadow-md font-black"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right User Info & Sign Out */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* User Info Capsule */}
          <div className="flex items-center gap-2 pl-2 sm:pl-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-900 font-black text-xs">
              {currentUser?.name ? currentUser.name.charAt(0) : "A"}
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-xs font-bold text-slate-900 block leading-none">
                {currentUser?.name || "Lead Mentor"}
              </span>
              <span className="text-[10px] text-amber-700 font-mono-tech font-bold">
                @{currentUser?.username || "admin"}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors flex items-center gap-1 text-xs font-bold"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="md:hidden pt-3 pb-2 border-t border-slate-200 mt-2 space-y-1 text-left">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;

            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-amber-500 text-slate-950 font-black"
                    : "text-slate-800 hover:bg-slate-100"
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
