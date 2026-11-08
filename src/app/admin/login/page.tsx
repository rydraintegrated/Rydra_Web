"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "@/lib/api";
import { Lock, Mail, ShieldAlert, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { RydraLogo } from "@/components/RydraLogo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@rydra.com");
  const [password, setPassword] = useState("RydraAdmin2026!");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await adminApi.login(email, password);
      if (res?.token) {
        localStorage.setItem("rydra_admin_token", res.token);
        localStorage.setItem("rydra_admin_user", JSON.stringify(res.user));
        router.push("/admin");
      } else {
        throw new Error("Missing authentication token from server.");
      }
    } catch (err: any) {
      setError(err?.message || "Invalid credentials. Please verify your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 text-slate-100 font-sans relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#10b982]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#1e293b] border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="mb-4">
            <RydraLogo size="lg" variant="dark" full={true} />
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] font-bold tracking-wider text-[#10b982] bg-[#10b982]/10 border border-[#10b982]/20 px-3 py-1 rounded-full uppercase">
              Super Admin Console
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-400 mt-2 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-[#10b982]" /> Secure Console Authentication
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2.5">
            <ShieldAlert size={16} className="text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Admin Email
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@rydra.com"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#10b982] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#10b982] transition-colors"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#10b982] hover:bg-[#0ea572] active:bg-[#0c8f62] disabled:opacity-60 text-slate-950 font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#10b982]/25 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin text-slate-950" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Log In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Demo Credentials Hint */}
        <div className="mt-6 pt-5 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-400">
            Default credentials: <span className="font-mono text-slate-300">admin@rydra.com</span> /{" "}
            <span className="font-mono text-slate-300">RydraAdmin2026!</span>
          </p>
        </div>
      </div>
    </div>
  );
}

