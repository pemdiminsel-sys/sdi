"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, Mail, Lock, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login
    setTimeout(() => {
      // Set a fake session cookie
      document.cookie = "sdi-admin-session=true; path=/; max-age=86400";
      setIsLoading(false);
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#070e1c] flex items-center justify-center p-4">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md relative animate-fade-in-up">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center shadow-2xl shadow-red-900/40 mb-4">
            <Zap size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">Portal Satu Data Indonesia</h1>
          <p className="text-sm text-slate-500 mt-1">Kabupaten Minahasa Selatan</p>
        </div>

        {/* Card */}
        <div className="glass-card p-8 border-white/10">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck size={20} className="text-red-500" />
              Admin Login
            </h2>
            <p className="text-xs text-slate-500 mt-1">Gunakan kredensial resmi untuk mengakses panel kontrol.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@minsel.go.id"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/5 text-red-600 focus:ring-red-600" />
                <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors">Ingat saya</span>
              </label>
              <Link href="#" className="text-xs text-red-500 hover:text-red-400 font-medium">Lupa password?</Link>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="btn-primary w-full py-3 justify-center text-sm font-bold mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin mr-2" />
                  Authenticating...
                </>
              ) : (
                <>
                  Log In to Admin Panel
                  <ArrowRight size={18} className="ml-2" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-600 mt-8">
          Masalah login? Hubungi <span className="text-slate-400">Tim IT Diskominfo Minsel</span>
        </p>
      </div>
    </div>
  );
}
