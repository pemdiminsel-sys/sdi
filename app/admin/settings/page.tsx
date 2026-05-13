"use client";

import { useState } from "react";
import { 
  Settings, 
  Database, 
  Shield, 
  Globe, 
  Save, 
  RotateCcw,
  RefreshCw,
  Key,
  Server,
  Mail,
  BellRing,
  Edit3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("api");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Settings saved successfully!");
    }, 1000);
  };

  const tabs = [
    { id: "api", icon: Server, label: "API Configuration" },
    { id: "general", icon: Globe, label: "General Settings" },
    { id: "cms", icon: Database, label: "Static Content (CMS)" },
    { id: "security", icon: Shield, label: "Security & Auth" },
    { id: "notifications", icon: BellRing, label: "Notifications" },
    { id: "email", icon: Mail, label: "Email SMTP" },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">System Settings</h1>
          <p className="text-sm text-slate-400 mt-1">Configure global platform behavior and API integrations</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary text-xs">
            <RotateCcw size={14} className="mr-2" />
            Reset Defaults
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="btn-primary text-xs"
          >
            <Save size={14} className="mr-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigation Tabs */}
        <div className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all border",
                activeTab === tab.id 
                  ? "bg-white/5 border-red-500/30 text-white shadow-[0_0_15px_rgba(239,68,68,0.1)]" 
                  : "border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]"
              )}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {activeTab === "api" && (
            <>
              {/* API Config Section */}
              <div className="glass-card p-6 space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Key size={18} className="text-red-400" />
                  <h2 className="text-lg font-bold text-white">SIPD E-Walidata Integration</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">API Base URL</label>
                    <input 
                      type="text" 
                      defaultValue="https://sipd.go.id/ewalidata/serv"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Kodepemda</label>
                    <input 
                      type="text" 
                      defaultValue="7105"
                      className="input-field font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">API Key / Token</label>
                    <div className="relative">
                      <input 
                        type="password" 
                        defaultValue="••••••••••••••••••••••••••••••••"
                        className="input-field pr-10"
                      />
                      <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                        <RotateCcw size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sync Preferences Section */}
              <div className="glass-card p-6 space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <RefreshCw size={18} className="text-blue-400" />
                  <h2 className="text-lg font-bold text-white">Synchronization Preferences</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                    <div>
                      <div className="text-sm font-bold text-white">Automated Sync</div>
                      <div className="text-[10px] text-slate-500">Enable periodic data ingestion from SIPD</div>
                    </div>
                    <div className="w-10 h-5 bg-red-600 rounded-full relative cursor-pointer shadow-[0_0_8px_rgba(220,38,38,0.4)]">
                      <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all"></div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Sync Frequency (Hours)</label>
                    <select className="input-field text-sm">
                      <option>Every 1 Hour</option>
                      <option>Every 6 Hours</option>
                      <option>Every 12 Hours</option>
                      <option>Daily (at 00:00)</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "general" && (
            <div className="glass-card p-6 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Globe size={18} className="text-green-400" />
                <h2 className="text-lg font-bold text-white">Portal Configuration</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Platform Name</label>
                  <input type="text" defaultValue="Portal Satu Data Indonesia" className="input-field" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Region Title</label>
                  <input type="text" defaultValue="Kabupaten Minahasa Selatan" className="input-field" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Portal Subtitle</label>
                  <input type="text" defaultValue="Transparansi Data untuk Pembangunan berkelanjutan" className="input-field" />
                </div>
              </div>
            </div>
          )}

          {activeTab === "cms" && (
            <div className="space-y-6">
              <div className="glass-card p-6 space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Edit3 size={18} className="text-red-400" />
                  <h2 className="text-lg font-bold text-white">Tentang SDI (About)</h2>
                </div>
                <textarea 
                  rows={6}
                  className="input-field text-sm py-3"
                  placeholder="Tuliskan deskripsi tentang Portal Satu Data Indonesia Minahasa Selatan di sini..."
                  defaultValue="Satu Data Indonesia adalah kebijakan tata kelola Data pemerintah untuk menghasilkan Data yang akurat, mutakhir, terpadu, dan dapat dipertanggungjawabkan, serta mudah diakses dan dibagipakaikan antar Instansi Pusat dan Instansi Daerah..."
                />
              </div>

              <div className="glass-card p-6 space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={18} className="text-blue-400" />
                  <h2 className="text-lg font-bold text-white">Kebijakan Data (Privacy & Policy)</h2>
                </div>
                <textarea 
                  rows={6}
                  className="input-field text-sm py-3"
                  placeholder="Tuliskan kebijakan penggunaan data..."
                  defaultValue="Seluruh data yang dipublikasikan di portal ini mengikuti standar Satu Data Indonesia. Pengguna diperbolehkan menggunakan data untuk keperluan analisis dengan mencantumkan sumber..."
                />
              </div>

              <div className="glass-card p-6 space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Mail size={18} className="text-green-400" />
                  <h2 className="text-lg font-bold text-white">Informasi Kontak</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Alamat Kantor</label>
                    <input type="text" defaultValue="Kantor Bupati Minahasa Selatan, Amurang" className="input-field" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Email Support</label>
                    <input type="email" defaultValue="diskominfo@minsel.go.id" className="input-field" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="glass-card p-6 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={18} className="text-amber-400" />
                <h2 className="text-lg font-bold text-white">Security & Authentication</h2>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-red-900/10 border border-red-500/20 text-xs text-red-200">
                  Perubahan pada pengaturan ini akan mempengaruhi sesi semua pengguna yang sedang aktif.
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <div>
                    <div className="text-sm font-bold text-white">Enforce MFA</div>
                    <div className="text-[10px] text-slate-500">Require Multi-Factor Authentication for all admins</div>
                  </div>
                  <div className="w-10 h-5 bg-slate-700 rounded-full relative cursor-pointer">
                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-slate-400 rounded-full transition-all"></div>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Session Timeout (Minutes)</label>
                  <input type="number" defaultValue="60" className="input-field" />
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="glass-card p-6 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <BellRing size={18} className="text-blue-400" />
                <h2 className="text-lg font-bold text-white">System Notifications</h2>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Sync Failure Alert", desc: "Notify when API synchronization fails" },
                  { label: "New User Registration", desc: "Notify when a new agency admin registers" },
                  { label: "Audit Log Warning", desc: "Notify on suspicious login attempts" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                    <div>
                      <div className="text-sm font-bold text-white">{item.label}</div>
                      <div className="text-[10px] text-slate-500">{item.desc}</div>
                    </div>
                    <div className="w-10 h-5 bg-red-600 rounded-full relative cursor-pointer">
                      <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "email" && (
            <div className="glass-card p-6 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Mail size={18} className="text-purple-400" />
                <h2 className="text-lg font-bold text-white">Email SMTP Configuration</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">SMTP Host</label>
                  <input type="text" placeholder="smtp.gmail.com" className="input-field" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">SMTP Port</label>
                  <input type="text" placeholder="587" className="input-field" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Encryption</label>
                  <select className="input-field text-sm">
                    <option>TLS</option>
                    <option>SSL</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Sender Email</label>
                  <input type="email" placeholder="noreply@minsel.go.id" className="input-field" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
