"use client";

import { useState, useEffect } from "react";
import { 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Database, 
  History,
  Play,
  Settings2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function SyncPage() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/v1/logs");
      const data = await res.json();
      if (data.success && data.data) {
        setLogs(data.data.map((item: any) => ({
          id: item.id || Date.now() + Math.random(),
          type: "full",
          status: item.status,
          date: new Date(item.created_at).toLocaleString(),
          error: item.details?.error,
          records: item.details?.record_count || 0,
          duration: "N/A",
          opd: item.details?.record_count ? 18 : 0
        })));
      }
    } catch (e) {
      console.error("Failed to fetch logs", e);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const startSync = async () => {
    setIsSyncing(true);
    toast.info("Memulai sinkronisasi data dari SIPD E-Walidata...");

    try {
      // Simulate API call
      const res = await fetch("/api/v1/sync", { method: "POST" });
      const data = await res.json();
      
      if (data.success) {
        toast.success("Sinkronisasi berhasil!");
      } else {
        throw new Error(data.error || "Gagal sinkronisasi");
      }
    } catch (error: any) {
      toast.error(`Sinkronisasi Gagal: ${error.message}`);
    } finally {
      setIsSyncing(false);
      fetchLogs();
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Sinkronisasi E-Walidata</h1>
          <p className="text-sm text-slate-400 mt-1">Kelola integrasi data real-time dengan SIPD Kemendagri</p>
        </div>
        <button 
          onClick={startSync}
          disabled={isSyncing}
          className={cn(
            "btn-primary px-6 py-2.5",
            isSyncing && "opacity-50 cursor-not-allowed"
          )}
        >
          <RefreshCw size={16} className={cn("mr-2", isSyncing && "animate-spin")} />
          {isSyncing ? "Syncing..." : "Start Manual Sync"}
        </button>
      </div>

      {/* Sync Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-5 border-l-4 border-l-green-500">
          <div className="flex items-center gap-3 mb-2 text-slate-400">
            <CheckCircle2 size={16} className="text-green-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Last Success</span>
          </div>
          <div className="text-xl font-bold text-white">12 May 2026, 14:00</div>
          <div className="text-[10px] text-slate-500 mt-1">DSSD Integrated: 1,248 Records</div>
        </div>
        
        <div className="glass-card p-5 border-l-4 border-l-blue-500">
          <div className="flex items-center gap-3 mb-2 text-slate-400">
            <Clock size={16} className="text-blue-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Schedule</span>
          </div>
          <div className="text-xl font-bold text-white">Every 6 Hours</div>
          <div className="text-[10px] text-slate-500 mt-1">Next: Today, 20:00 WITA</div>
        </div>

        <div className="glass-card p-5 border-l-4 border-l-red-500">
          <div className="flex items-center gap-3 mb-2 text-slate-400">
            <Settings2 size={16} className="text-red-500" />
            <span className="text-xs font-bold uppercase tracking-wider">API Health</span>
          </div>
          <div className="text-xl font-bold text-white">Stable</div>
          <div className="text-[10px] text-slate-500 mt-1">Latency: 450ms · Kodepemda 7105</div>
        </div>
      </div>

      {/* Sync Logs */}
      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History size={18} className="text-red-400" />
            <h2 className="text-sm font-bold text-white">Sync History Logs</h2>
          </div>
          <button className="text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors">
            Clear Logs
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table w-full">
            <thead>
              <tr>
                <th className="pl-6">Timestamp</th>
                <th>Type</th>
                <th>Status</th>
                <th>Records</th>
                <th>OPD</th>
                <th>Duration</th>
                <th className="pr-6">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingLogs ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-sm">
                    Memuat log...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-sm">
                    Belum ada riwayat sinkronisasi.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="pl-6 text-xs text-slate-400 font-mono">{log.date}</td>
                    <td>
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-bold uppercase border",
                        log.type === "full" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      )}>
                        {log.type}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        {log.status === "success" ? (
                          <CheckCircle2 size={12} className="text-green-500" />
                        ) : (
                          <AlertCircle size={12} className="text-red-500" />
                        )}
                        <span className={cn(
                          "text-xs font-medium",
                          log.status === "success" ? "text-green-400" : "text-red-400"
                        )}>
                          {log.status === "success" ? "Success" : "Failed"}
                        </span>
                      </div>
                      {log.error && <div className="text-[10px] text-red-700 mt-0.5 max-w-[120px] truncate">{log.error}</div>}
                    </td>
                    <td className="text-sm text-slate-200 font-semibold">{log.records.toLocaleString()}</td>
                    <td className="text-xs text-slate-400">{log.opd} Agencies</td>
                    <td className="text-xs text-slate-400">{log.duration}</td>
                    <td className="pr-6">
                      <button className="p-1.5 rounded-lg hover:bg-white/10 text-slate-500 hover:text-white transition-all">
                        <Play size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
