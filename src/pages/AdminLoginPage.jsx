import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, Lock, AlertCircle, CheckCircle2, Clock } from "lucide-react";

export default function AdminLoginPage({ setCurrentUser }) {
  const [formData, setFormData] = useState({ usernameOrEmail: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("https://turingwings-backend.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid mentor credentials");
      }

      // 3-Hour Session Persistence
      const sessionUser = {
        ...data,
        expiresAt: Date.now() + 3 * 60 * 60 * 1000,
      };

      localStorage.setItem("turing_wings_token", data.token);
      localStorage.setItem("turing_wings_user", JSON.stringify(sessionUser));
      setCurrentUser(sessionUser);

      setSuccess(`Welcome Mentor ${data.name}! (3-Hour Active Session Started)`);

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      setError(err.message || "Server connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f6f0] text-slate-900 flex items-center justify-center p-4 selection:bg-amber-500 selection:text-slate-950">
      <div className="w-full max-w-md glass-white-glow p-8 rounded-3xl text-left border border-amber-500/40 shadow-2xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-900 font-black">
            <ShieldCheck className="w-7 h-7 text-amber-700" />
          </div>
          <div>
            <h1 className="text-2xl font-black font-serif italic text-slate-900">
              ADMIN<span className="text-[#d97706]">WING</span>
            </h1>
            <span className="text-xs text-slate-600 font-mono-tech font-bold flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-600" />
              <span>3-Hour Session Persistence</span>
            </span>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 font-semibold">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
              Username or Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="ratnakar / sahith / manoj / panduranga"
                value={formData.usernameOrEmail}
                onChange={(e) => setFormData({ ...formData, usernameOrEmail: e.target.value })}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 hover:scale-[1.02] transition-all"
          >
            {loading ? "Authenticating..." : "Sign In to AdminWing"}
          </button>
        </form>

        <div className="pt-2 text-center border-t border-slate-200 text-[11px] text-slate-500 font-mono-tech">
          <span>Protected Lead Mentor Access — 3-Hour Session</span>
        </div>
      </div>
    </div>
  );
}
