import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, MessageSquare, PhoneCall, Users, Shield, Cpu } from "lucide-react";

export default function AdminSidebar() {
  const location = useLocation();

  const navItems = [
    { name: "Command Center", path: "/", icon: LayoutDashboard },
    { name: "Live Chatbot Hub", path: "/chat", icon: MessageSquare, badge: "LIVE" },
    { name: "Voice Arena", path: "/call/room-sentinel-01", icon: PhoneCall },
    { name: "MongoDB Users", path: "/users", icon: Users },
  ];

  return (
    <aside className="w-64 bg-[#070911]/80 backdrop-blur-xl border-r border-amber-500/20 p-4 hidden md:flex flex-col justify-between select-none min-h-[calc(100vh-61px)]">
      <div className="space-y-6">
        <div className="px-3 py-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono-tech">
            NAVIGATION MODULES
          </span>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-amber-500/40 text-amber-300 shadow-md shadow-amber-500/10"
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-slate-400"}`} />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500/20 border border-amber-500/40 text-amber-300">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Lead Mentors Status Widget */}
      <div className="p-4 rounded-2xl glass-gold text-left space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-white font-serif italic">
            Lead Mentors
          </span>
        </div>

        <div className="space-y-2 text-[11px] font-semibold text-slate-300">
          <div className="flex items-center justify-between">
            <span>Ratnakar (Cyber)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <div className="flex items-center justify-between">
            <span>Sahith Akula (Backend)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <div className="flex items-center justify-between">
            <span>Manoj Kumar (Backend)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <div className="flex items-center justify-between">
            <span>Pandu Ranga (UI Lead)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
        </div>
      </div>
    </aside>
  );
}
