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
  BellRing
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Settings saved successfully!");
    }, 1000);
  };

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
          {[
            { id: "api", icon: Server, label: "API Configuration" },
            { id: "general", icon: Globe, label: "General Settings" },
            { id: "security", icon: Shield, label: "Security & Auth" },
            { id: "notifications", icon: BellRing, label: "Notifications" },
            { id: "email", icon: Mail, label: "Email SMTP" },
          ].map((tab) => (
            <button
              key={tab.id}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all border",
                tab.id === "api" 
                  ? "bg-white/5 border-red-500/30 text-white" 
                  : "border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]"
              )}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-6">
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
                <p className="text-[10px] text-slate-600 mt-2">Jangan pernah membagikan API key ini. Digunakan untuk otentikasi ke server Kemendagri.</p>
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

          {/* Data Backup Section */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Database size={18} className="text-amber-400" />
              <h2 className="text-lg font-bold text-white">Data Retention & Backup</h2>
            </div>
            <p className="text-xs text-slate-400">Manage how long records are cached and stored before refreshing.</p>
            <div className="flex gap-3">
              <button className="flex-1 btn-secondary text-xs py-2">Create Manual Backup</button>
              <button className="flex-1 btn-secondary text-xs py-2">Clear Sync Logs</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
