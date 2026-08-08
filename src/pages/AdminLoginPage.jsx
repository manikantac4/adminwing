import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, AlertCircle, CheckCircle2, ArrowRight, Sparkles, RefreshCw } from "lucide-react";

export default function AdminLoginPage({ setCurrentUser }) {
  const [formData, setFormData] = useState({ usernameOrEmail: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.usernameOrEmail.trim()) {
      setError("Please fill out your Username or Email address.");
      return;
    }
    if (!formData.password.trim()) {
      setError("Please fill out your Password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("https://turingwings-backend.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usernameOrEmail: formData.usernameOrEmail.trim(),
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid mentor credentials.");
      }

      if (data.role !== "admin") {
        throw new Error("Access Denied: Account is not a registered Lead Mentor Admin.");
      }

      // Store credentials if browser PasswordCredential API is available
      if (window.PasswordCredential && navigator.credentials) {
        try {
          const cred = new window.PasswordCredential({
            id: formData.usernameOrEmail,
            password: formData.password,
            name: data.name || formData.usernameOrEmail,
          });
          await navigator.credentials.store(cred);
        } catch {
          // Native browser auto-fill handles fallback
        }
      }

      const sessionUser = {
        ...data,
        expiresAt: Date.now() + 3 * 60 * 60 * 1000,
      };

      localStorage.setItem("turing_wings_token", data.token);
      localStorage.setItem("turing_wings_user", JSON.stringify(sessionUser));
      setCurrentUser(sessionUser);

      setSuccess(`Welcome Mentor ${data.name || "Lead"}! Authenticated successfully.`);

      setTimeout(() => {
        const targetRedirect = localStorage.getItem("post_login_redirect") || "/";
        localStorage.removeItem("post_login_redirect");
        navigate(targetRedirect);
      }, 800);
    } catch (err) {
      setError(err.message || "Server connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#090909] flex items-center justify-center p-4 sm:p-6 selection:bg-[#22C55E] selection:text-black font-mono">
      <div className="w-full max-w-md bg-white p-6 sm:p-10 rounded-3xl text-left border border-black/10 shadow-xl space-y-6 relative overflow-hidden">
        
        {/* L-Corner Bracket Marks */}
        <span className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-black/20" />
        <span className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-black/20" />
        <span className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-black/20" />
        <span className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-black/20" />

        {/* Brand Header */}
        <div className="flex items-center gap-4">
          <img
            src="/admin-logo.png"
            alt="Admin Wing"
            className="h-14 sm:h-16 w-auto object-contain shrink-0 hover:scale-105 transition-transform"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-wider text-[#111] font-mono">
                ADMIN<span className="text-[#22C55E]">WING</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E]">
                HQ
              </span>
            </div>
            <p className="text-[10px] text-black/50 font-bold uppercase tracking-widest mt-0.5">
              LEAD MENTOR GATEWAY
            </p>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5 font-semibold animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Notification */}
        {success && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Credentials Form with Custom Validation */}
        <form onSubmit={handleLogin} noValidate className="space-y-5">
          <div>
            <label htmlFor="admin-username" className="block text-[10px] font-bold uppercase text-black/50 tracking-wider mb-1.5">
              Username or Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-black/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="admin-username"
                name="username"
                type="email"
                autoComplete="username"
                placeholder="mentor@turingwings.org"
                value={formData.usernameOrEmail}
                onChange={(e) => {
                  setFormData({ ...formData, usernameOrEmail: e.target.value });
                  if (error) setError("");
                }}
                className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-[#FAF8F5] border border-black/15 text-xs text-[#111] focus:outline-none focus:border-[#22C55E] focus:bg-white font-mono font-medium transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-[10px] font-bold uppercase text-black/50 tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-black/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••••••"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (error) setError("");
                }}
                className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-[#FAF8F5] border border-black/15 text-xs text-[#111] focus:outline-none focus:border-[#22C55E] focus:bg-white font-mono font-medium transition-all"
              />
            </div>
          </div>

          {/* Main Submit Button Box */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#090909] text-white hover:bg-[#22C55E] hover:text-[#04160C] font-mono font-bold text-xs tracking-wider py-4 px-6 rounded-2xl flex items-center justify-center gap-2.5 transition-all duration-300 shadow-lg shadow-black/10 group disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#22C55E]" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In to AdminWing</span>
                <ArrowRight className="w-4 h-4 text-[#22C55E] group-hover:text-[#04160C] transition-colors" />
              </>
            )}
          </button>
        </form>

        {/* Footer Gateway Notice */}
        <div className="pt-2 border-t border-black/10 text-center">
          <p className="text-[9px] font-bold uppercase tracking-widest text-black/40">
            PROTECTED LEAD MENTOR ACCESS GATEWAY
          </p>
        </div>

      </div>
    </div>
  );
}
