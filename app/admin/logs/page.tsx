"use client";

import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Terminal, 
  User, 
  ExternalLink,
  Download,
  AlertTriangle,
  Info,
  ShieldAlert
} from "lucide-react";
import { cn } from "@/lib/utils";

const LOGS = [
  { id: 1, action: "User Login", user: "Admin Utama", target: "System", date: "2026-05-12 14:30:12", status: "success", ip: "192.168.1.1" },
  { id: 2, action: "Trigger Sync", user: "Operator Diskominfo", target: "SIPD API", date: "2026-05-12 14:00:05", status: "success", ip: "192.168.1.45" },
  { id: 3, action: "Update Dataset", user: "Admin Utama", target: "DSSD-1209", date: "2026-05-12 13:45:22", status: "success", ip: "192.168.1.1" },
  { id: 4, action: "Update Dataset", user: "Dinas Kesehatan", target: "DSSD-0045", date: "2026-05-12 11:20:10", status: "success", ip: "10.0.4.12" },
  { id: 5, action: "Failed Sync", user: "System Scheduler", target: "SIPD API", date: "2026-05-12 08:00:00", status: "failed", ip: "127.0.0.1" },
  { id: 6, action: "Change Settings", user: "Admin Utama", target: "API Token", date: "2026-05-11 22:15:30", status: "success", ip: "192.168.1.1" },
];

export default function LogsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Security Audit Logs</h1>
          <p className="text-sm text-slate-400 mt-1">Immutable ledger of all administrative actions and system events</p>
        </div>
        <button className="btn-secondary text-xs">
          <Download size={14} className="mr-2" />
          Export Audit Trail
        </button>
      </div>

      <div className="glass-card p-4 flex gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search by action, user or target ID..." 
            className="input-field pl-10"
          />
        </div>
        <button className="btn-secondary px-4 py-2">Date Range</button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal size={18} className="text-amber-400" />
            <h2 className="text-sm font-bold text-white">Live Event Stream</h2>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Recording</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table w-full">
            <thead>
              <tr>
                <th className="pl-6">Action Event</th>
                <th>Subject (User)</th>
                <th>Object (Target)</th>
                <th>Timestamp</th>
                <th>Status</th>
                <th className="pr-6">Source IP</th>
              </tr>
            </thead>
            <tbody>
              {LOGS.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors border-l-2 border-transparent hover:border-l-red-600">
                  <td className="pl-6">
                    <div className="flex items-center gap-2">
                      {log.status === "failed" ? (
                        <ShieldAlert size={14} className="text-red-500" />
                      ) : (
                        <ShieldCheck size={14} className="text-green-500" />
                      )}
                      <span className="text-sm font-bold text-slate-200">{log.action}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <User size={12} className="text-slate-600" />
                      {log.user}
                    </div>
                  </td>
                  <td>
                    <code className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-300 font-mono">{log.target}</code>
                  </td>
                  <td className="text-xs text-slate-500 font-mono">{log.date}</td>
                  <td>
                    <span className={cn(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded uppercase border",
                      log.status === "success" 
                        ? "bg-green-500/10 text-green-400 border-green-500/20" 
                        : "bg-red-500/10 text-red-400 border-red-500/20"
                    )}>
                      {log.status}
                    </span>
                  </td>
                  <td className="pr-6 text-xs text-slate-600 font-mono">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-5 bg-blue-900/10 border-blue-900/20">
          <div className="flex items-center gap-2 text-blue-400 mb-3">
            <Info size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Storage Info</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">Audit logs are digitally signed and rotated every 90 days. Backups are stored in the secure vault.</p>
        </div>
        <div className="glass-card p-5 bg-amber-900/10 border-amber-900/20">
          <div className="flex items-center gap-2 text-amber-400 mb-3">
            <AlertTriangle size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Unusual Activity</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">System detected 3 failed login attempts from unknown IP in the last 24 hours.</p>
        </div>
        <div className="glass-card p-5 bg-red-900/10 border-red-900/20 flex items-center justify-center cursor-pointer hover:bg-red-900/20 transition-all group">
          <div className="text-center">
            <ExternalLink size={20} className="text-red-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-black text-red-400 uppercase tracking-widest">Verify Ledger</span>
          </div>
        </div>
      </div>
    </div>
  );
}
