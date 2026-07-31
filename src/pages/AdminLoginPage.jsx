import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, Lock, AlertCircle, CheckCircle2 } from "lucide-react";

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
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid mentor credentials");
      }

      if (data.role !== "admin") {
        throw new Error("Access Denied: Account is not a registered Lead Mentor Admin.");
      }

      const sessionUser = {
        ...data,
        expiresAt: Date.now() + 3 * 60 * 60 * 1000,
      };

      localStorage.setItem("turing_wings_token", data.token);
      localStorage.setItem("turing_wings_user", JSON.stringify(sessionUser));
      setCurrentUser(sessionUser);

      setSuccess(`Welcome Mentor ${data.name}! Authenticated successfully.`);

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
    <div className="min-h-screen bg-hero-gradient text-[#18191B] flex items-center justify-center p-4 selection:bg-[#A39B89] selection:text-white font-sans">
      <div className="w-full max-w-md card-premium p-8 rounded-3xl text-left border border-[#E5E7EB] shadow-glow space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#18191B] to-[#A39B89] flex items-center justify-center text-white font-black shadow-md">
            <ShieldCheck className="w-7 h-7 text-[#C9B27D]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-poppins text-[#18191B]">
              ADMIN<span className="text-[#A39B89]">WING</span>
            </h1>
            <span className="text-xs text-[#5E6168] font-mono">
              Lead Mentor Authentication Gateway
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
            <label className="block text-xs font-bold uppercase text-[#5E6168] mb-1">
              Username or Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8B9098] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Enter username or email"
                value={formData.usernameOrEmail}
                onChange={(e) => setFormData({ ...formData, usernameOrEmail: e.target.value })}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#E5E7EB] text-xs text-[#18191B] focus:outline-none focus:border-[#A39B89] font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#5E6168] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8B9098] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#E5E7EB] text-xs text-[#18191B] focus:outline-none focus:border-[#A39B89] font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 btn-hero-gradient font-bold text-xs shadow-md hover:scale-[1.02] transition-all"
          >
            {loading ? "Authenticating..." : "Sign In to AdminWing"}
          </button>
        </form>

        <div className="pt-3 border-t border-[#E5E7EB] text-center text-[11px] text-[#8B9098] font-mono">
          <span>Protected Lead Mentor Access Gateway</span>
        </div>
      </div>
    </div>
  );
}
