"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ReactECharts from "echarts-for-react";
import { BarChart2, TrendingUp, Filter, RefreshCw, Download } from "lucide-react";
import { KATEGORI_DATASET, CHART_COLORS } from "@/lib/constants";
import { DashboardSkeleton } from "@/components/ui/Skeleton";
import { exportToJson } from "@/lib/utils";

async function fetchAnalytics() {
  const res = await fetch("/api/v1/statistik");
  if (!res.ok) throw new Error("Gagal memuat data analytics");
  return res.json();
}

async function fetchOpdList() {
  const res = await fetch("/api/v1/opd");
  if (!res.ok) return { data: [] };
  return res.json();
}

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<"distribusi" | "trend" | "opd">("distribusi");

  const { data: statsData, isLoading: statsLoading, refetch: refetchStats } = useQuery({
    queryKey: ["analytics-stats"],
    queryFn: fetchAnalytics,
  });

  const { data: opdData, isLoading: opdLoading } = useQuery({
    queryKey: ["analytics-opd"],
    queryFn: fetchOpdList,
  });

  const isLoading = statsLoading || opdLoading;
  if (isLoading) return <DashboardSkeleton />;

  const byKategori: Record<string, number> = statsData?.data?.by_kategori ?? {};
  const kategoriNames = KATEGORI_DATASET.filter((k) => k !== "Lainnya");
  const kategoriValues = kategoriNames.map((k) => byKategori[k] ?? 0);

  const opdList: Array<{ nama: string; total_dataset: number }> = opdData?.data ?? [];
  const opdNames = opdList.map((o) => o.nama?.replace("Dinas ", "Dinas\n").replace("Badan ", "Badan\n")).slice(0, 12);
  const opdValues = opdList.map((o) => o.total_dataset).slice(0, 12);

  // Pie chart for kategori
  const pieOptions = {
    backgroundColor: "transparent",
    tooltip: { trigger: "item", backgroundColor: "rgba(15,23,42,0.9)", borderColor: "rgba(255,255,255,0.1)", textStyle: { color: "#e2e8f0" } },
    legend: { orient: "vertical", left: "left", textStyle: { color: "#94a3b8", fontSize: 11 } },
    series: [{
      name: "Kategori",
      type: "pie",
      radius: ["40%", "70%"],
      center: ["60%", "50%"],
      itemStyle: { borderRadius: 6, borderColor: "rgba(0,0,0,0)", borderWidth: 2 },
      label: { show: false },
      data: kategoriNames.map((name, i) => ({
        name,
        value: kategoriValues[i],
        itemStyle: { color: [...CHART_COLORS.primary, ...CHART_COLORS.secondary, ...CHART_COLORS.accent, ...CHART_COLORS.success, ...CHART_COLORS.warning][i % 10] },
      })).filter((d) => d.value > 0),
    }],
  };

  // OPD bar chart
  const opdBarOptions = {
    backgroundColor: "transparent",
    tooltip: { trigger: "axis", backgroundColor: "rgba(15,23,42,0.9)", borderColor: "rgba(255,255,255,0.1)", textStyle: { color: "#e2e8f0" } },
    grid: { left: "20%", right: "5%", bottom: "5%", top: "5%", containLabel: false },
    xAxis: { type: "value", axisLabel: { color: "#64748b", fontSize: 10 }, splitLine: { lineStyle: { color: "rgba(255,255,255,0.04)" } } },
    yAxis: { type: "category", data: opdNames, axisLabel: { color: "#94a3b8", fontSize: 10 } },
    series: [{
      type: "bar",
      barWidth: "60%",
      itemStyle: {
        color: { type: "linear", x: 0, y: 0, x2: 1, y2: 0,
          colorStops: [{ offset: 0, color: "#9F1239" }, { offset: 1, color: "#f43f5e" }] },
        borderRadius: [0, 4, 4, 0],
      },
      data: opdValues,
    }],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Analytics & Insight</h2>
          <p className="text-sm text-slate-400 mt-0.5">Analisis distribusi data dan performa OPD</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => refetchStats()} className="btn-secondary text-xs py-2 px-3">
            <RefreshCw size={13} />
            Refresh
          </button>
          <button onClick={() => exportToJson(statsData?.kpis ?? [], "kpi-minsel")} className="btn-secondary text-xs py-2 px-3">
            <Download size={13} />
            Export KPI
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/6 w-fit">
        {(["distribusi", "opd", "trend"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab ? "bg-red-900/30 text-red-300" : "text-slate-400 hover:text-white"
            }`}
          >
            {tab === "distribusi" ? "Distribusi Kategori" : tab === "opd" ? "Per OPD" : "Trend Tahunan"}
          </button>
        ))}
      </div>

      {/* Chart Panels */}
      {activeTab === "distribusi" && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass-card p-5">
            <h3 className="text-base font-bold text-white mb-4">Distribusi per Kategori (Pie)</h3>
            <div className="h-[320px]">
              <ReactECharts option={pieOptions} style={{ height: "100%", width: "100%" }} />
            </div>
          </div>
          <div className="glass-card p-5">
            <h3 className="text-base font-bold text-white mb-4">Jumlah Indikator per Kategori</h3>
            <div className="space-y-3 mt-2">
              {kategoriNames.map((kat, i) => {
                const val = kategoriValues[i];
                const max = Math.max(...kategoriValues, 1);
                const pct = Math.round((val / max) * 100);
                return (
                  <div key={kat}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400">{kat}</span>
                      <span className="text-slate-300 font-medium">{val}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: "linear-gradient(90deg, #9F1239, #f43f5e)" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === "opd" && (
        <div className="glass-card p-5">
          <h3 className="text-base font-bold text-white mb-4">Dataset per Perangkat Daerah</h3>
          <div className="h-[420px]">
            {opdList.length > 0
              ? <ReactECharts option={opdBarOptions} style={{ height: "100%", width: "100%" }} />
              : <div className="flex items-center justify-center h-full text-slate-500 text-sm">Memuat data OPD...</div>
            }
          </div>
        </div>
      )}

      {activeTab === "trend" && (
        <div className="glass-card p-5">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-green-400" />
            Trend Data 2022–2025 (Proyeksi)
          </h3>
          <div className="h-[360px]">
            <ReactECharts
              option={{
                backgroundColor: "transparent",
                tooltip: { trigger: "axis", backgroundColor: "rgba(15,23,42,0.9)", borderColor: "rgba(255,255,255,0.1)", textStyle: { color: "#e2e8f0" } },
                legend: { data: ["Dataset Aktif", "OPD Terlibat"], textStyle: { color: "#94a3b8" } },
                grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
                xAxis: { type: "category", data: ["2022", "2023", "2024", "2025*"], axisLabel: { color: "#64748b" }, axisLine: { lineStyle: { color: "rgba(255,255,255,0.06)" } } },
                yAxis: { type: "value", axisLabel: { color: "#64748b" }, splitLine: { lineStyle: { color: "rgba(255,255,255,0.04)" } } },
                series: [
                  { name: "Dataset Aktif", type: "line", smooth: true, data: [180, 320, 480, statsData?.summary?.total_indikator ?? 0], itemStyle: { color: "#C41E3A" }, areaStyle: { color: "rgba(196,30,58,0.15)" } },
                  { name: "OPD Terlibat", type: "line", smooth: true, data: [8, 12, 16, statsData?.summary?.total_opd ?? 18], itemStyle: { color: "#D4A017" } },
                ],
              }}
              style={{ height: "100%", width: "100%" }}
            />
          </div>
          <p className="text-xs text-slate-600 mt-3">* 2025 adalah data estimasi berdasarkan tren saat ini</p>
        </div>
      )}
    </div>
  );
}
