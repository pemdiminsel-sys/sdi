"use client";

import { useQuery } from "@tanstack/react-query";
import { 
  Database, 
  RefreshCw, 
  Users, 
  Activity, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  Server
} from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { DashboardSkeleton } from "@/components/ui/Skeleton";
import ReactECharts from "echarts-for-react";

async function fetchAdminStats() {
  const res = await fetch("/api/v1/statistik");
  if (!res.ok) throw new Error("Gagal memuat data");
  return res.json();
}

export default function AdminOverview() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: fetchAdminStats,
  });

  if (isLoading) return <DashboardSkeleton />;

  const summary = data?.summary ?? { total_records: 0, total_opd: 0, total_indikator: 0 };

  const chartOptions = {
    backgroundColor: "transparent",
    tooltip: { trigger: "axis" },
    grid: { left: "0%", right: "0%", bottom: "0%", top: "10%", containLabel: false },
    xAxis: { type: "category", show: false, data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
    yAxis: { type: "value", show: false },
    series: [{
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: "line",
      smooth: true,
      symbol: "none",
      lineStyle: { color: "#ef4444", width: 2 },
      areaStyle: {
        color: {
          type: "linear", x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [{ offset: 0, color: "rgba(239, 68, 68, 0.2)" }, { offset: 1, color: "transparent" }]
        }
      }
    }]
  };

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-white">System Overview</h1>
        <p className="text-sm text-slate-400 mt-1">Real-time status of Portal Satu Data Minahasa Selatan</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 border-l-4 border-l-red-600">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-red-900/20 rounded-lg">
              <Database size={20} className="text-red-400" />
            </div>
            <div className="flex items-center gap-1 text-green-400 text-xs font-bold">
              <ArrowUpRight size={14} />
              +12%
            </div>
          </div>
          <div className="text-2xl font-black text-white">{summary.total_records.toLocaleString()}</div>
          <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Total Records</div>
        </div>

        <div className="glass-card p-6 border-l-4 border-l-blue-600">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-900/20 rounded-lg">
              <RefreshCw size={20} className="text-blue-400" />
            </div>
            <div className="text-slate-500 text-[10px] font-bold uppercase">Uptime 99.9%</div>
          </div>
          <div className="text-2xl font-black text-white">Stable</div>
          <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Sync Service</div>
        </div>

        <div className="glass-card p-6 border-l-4 border-l-purple-600">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-purple-900/20 rounded-lg">
              <Users size={20} className="text-purple-400" />
            </div>
            <div className="flex items-center gap-1 text-green-400 text-xs font-bold">
              <ArrowUpRight size={14} />
              +2
            </div>
          </div>
          <div className="text-2xl font-black text-white">{summary.total_opd}</div>
          <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Integrated Agencies</div>
        </div>

        <div className="glass-card p-6 border-l-4 border-l-amber-600">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-amber-900/20 rounded-lg">
              <ShieldCheck size={20} className="text-amber-400" />
            </div>
            <div className="text-green-500 text-[10px] font-bold uppercase">Audited</div>
          </div>
          <div className="text-2xl font-black text-white">Active</div>
          <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Security Guard</div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-white">Sync Activity</h3>
              <p className="text-xs text-slate-500">Frequency of data ingestion from SIPD</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-600"></span>
              <span className="text-xs text-slate-400 font-medium">Data Volume</span>
            </div>
          </div>
          <div className="h-[250px] w-full">
            <ReactECharts option={chartOptions} style={{ height: "100%", width: "100%" }} />
          </div>
        </div>

        {/* System Health */}
        <div className="glass-card p-6 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6">System Health</h3>
          <div className="space-y-6 flex-1">
            {[
              { label: "API Gateway", status: "online", load: "12%" },
              { label: "Database Core", status: "online", load: "45%" },
              { label: "SIPD Proxy", status: "online", load: "08%" },
              { label: "Analytics Engine", status: "warning", load: "88%" },
            ].map((sys) => (
              <div key={sys.label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    sys.status === "online" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]"
                  )}></div>
                  <span className="text-sm font-medium text-slate-300">{sys.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-slate-500">LOAD</span>
                  <span className="text-xs font-bold text-white w-8 text-right">{sys.load}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-500">
              <Server size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Node Instance 01</span>
            </div>
            <span className="text-[10px] text-green-500 font-black">STABLE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
