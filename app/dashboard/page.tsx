"use client";

import { useState, useEffect } from "react";
import { StatCard } from "@/components/ui/StatCard";
import { DashboardSkeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import { Activity, Users, MapPin, Target, AlertTriangle, Database, Zap, TrendingUp } from "lucide-react";
import ReactECharts from "echarts-for-react";
import { useQuery } from "@tanstack/react-query";

async function fetchDashboardData() {
  const res = await fetch("/api/v1/statistik");
  if (!res.ok) throw new Error("Gagal memuat data");
  return res.json();
}

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: fetchDashboardData,
    staleTime: 60000,
    refetchInterval: 300000, // refresh every 5 min
  });

  if (isLoading) return <DashboardSkeleton />;
  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-slate-400">
        <Zap size={40} className="text-red-700 opacity-50" />
        <p className="font-medium">Gagal memuat data dashboard</p>
        <p className="text-xs text-slate-600">Pastikan koneksi ke SIPD E-Walidata tersedia</p>
      </div>
    );
  }

  const { summary, kpis, insights } = data;

  const byKategori: Record<string, number> = data.data?.by_kategori ?? {};
  const kategoriNames = Object.keys(byKategori).filter(Boolean).slice(0, 8);
  const kategoriValues = kategoriNames.map((k) => byKategori[k] ?? 0);

  const barOptions = {
    backgroundColor: "transparent",
    tooltip: { trigger: "axis", backgroundColor: "rgba(15,23,42,0.9)", borderColor: "rgba(255,255,255,0.1)", textStyle: { color: "#e2e8f0" } },
    grid: { left: "3%", right: "4%", bottom: "10%", top: "5%", containLabel: true },
    xAxis: {
      type: "category",
      data: kategoriNames.length ? kategoriNames : ["Kependudukan","Pendidikan","Kesehatan","Infrastruktur","Ekonomi","Sosial"],
      axisLabel: { color: "#64748b", fontSize: 11, rotate: 30 },
      axisLine: { lineStyle: { color: "rgba(255,255,255,0.06)" } },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: "#64748b", fontSize: 11 },
      splitLine: { lineStyle: { color: "rgba(255,255,255,0.04)" } },
    },
    series: [{
      name: "Indikator",
      type: "bar",
      barWidth: "55%",
      itemStyle: {
        color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [{ offset: 0, color: "#f43f5e" }, { offset: 1, color: "#C41E3A" }] },
        borderRadius: [5, 5, 0, 0],
      },
      data: kategoriValues.length ? kategoriValues : [120, 85, 90, 60, 110, 75],
    }],
  };

  const insightTypeStyles: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    warning: { bg: "rgba(245,158,11,0.1)", text: "#fde68a", icon: <AlertTriangle size={14} /> },
    success: { bg: "rgba(16,185,129,0.1)", text: "#6ee7b7", icon: <TrendingUp size={14} /> },
    info:    { bg: "rgba(59,130,246,0.1)",  text: "#93c5fd", icon: <Activity size={14} /> },
    anomaly: { bg: "rgba(196,30,58,0.1)",   text: "#fda4af", icon: <Zap size={14} /> },
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Ringkasan Daerah</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Monitoring indikator strategis Kabupaten Minahasa Selatan
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Sumber:</span>
          <span className="text-xs px-2 py-1 rounded bg-green-500/10 text-green-400 border border-green-500/20 font-medium">
            SIPD E-Walidata · Kodepemda 7105
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Indikator DSSD" value={summary?.total_indikator ?? 0} icon={<Target size={20} />} color="red" delay={0} />
        <StatCard label="Perangkat Daerah Aktif" value={summary?.total_opd ?? 0} icon={<Users size={20} />} color="blue" delay={100} />
        <StatCard label="Kecamatan Tercakup" value={summary?.total_kecamatan ?? 17} icon={<MapPin size={20} />} color="green" delay={200} />
        <StatCard label="Total Records Data" value={summary?.total_records ?? 0} icon={<Database size={20} />} color="gold" delay={300} />
      </div>

      {/* Charts + Insights */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white">Distribusi Data per Kategori</h3>
            <span className="text-xs text-slate-500">Dari API SIPD</span>
          </div>
          <div className="h-[280px] w-full">
            <ReactECharts option={barOptions} style={{ height: "100%", width: "100%" }} />
          </div>
        </div>

        {/* AI Insights */}
        <div className="glass-card p-5 flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/6">
            <div className="w-7 h-7 rounded-lg bg-red-900/30 flex items-center justify-center">
              <Activity size={14} className="text-red-400" />
            </div>
            <h3 className="text-base font-bold text-white">AI Insights</h3>
            <span className="ml-auto text-xs bg-red-900/20 text-red-400 px-2 py-0.5 rounded-full border border-red-800/30">
              Live
            </span>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            {insights && insights.length > 0 ? (
              insights.map((insight: { id: string; type: string; judul: string; deskripsi: string }) => {
                const style = insightTypeStyles[insight.type] ?? insightTypeStyles.info;
                return (
                  <div
                    key={insight.id}
                    className="p-3 rounded-xl border transition-colors hover:border-white/10"
                    style={{ background: style.bg, border: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 shrink-0" style={{ color: style.text }}>
                        {style.icon}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-200 leading-tight">{insight.judul}</h4>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{insight.deskripsi}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-slate-500 text-center py-8">Belum ada insight tersedia.</p>
            )}
          </div>
        </div>
      </div>

      {/* Extra KPI from SIPD */}
      {kpis && kpis.length > 0 && (
        <div className="glass-card p-5">
          <h3 className="text-base font-bold text-white mb-4">Indikator Kunci Daerah (dari SIPD)</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {kpis.slice(0, 6).map((kpi: { label: string; nilai: number; satuan: string; kode_dssd?: string }) => (
              <div key={kpi.kode_dssd ?? kpi.label} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-red-800/30 transition-colors">
                <div className="text-xl font-bold text-white tabular-nums">
                  {Number(kpi.nilai).toLocaleString("id-ID")} <span className="text-sm font-normal text-slate-500">{kpi.satuan}</span>
                </div>
                <div className="text-xs text-slate-400 mt-1">{kpi.label}</div>
                {kpi.kode_dssd && <div className="text-[10px] text-slate-600 mt-1 font-mono">{kpi.kode_dssd}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
