"use client";

import { Database, Users, Server, Map, TrendingUp, CheckCircle } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";

interface StatsSectionProps {
  summary: {
    total_records: number;
    total_opd: number;
    total_indikator: number;
    total_kecamatan: number;
  };
}

export default function StatsSection({ summary }: StatsSectionProps) {
  const stats = [
    {
      label: "Total Indikator Data",
      value: summary.total_indikator || 0,
      icon: <Database size={18} />,
      color: "red" as const,
      delay: 0,
    },
    {
      label: "Perangkat Daerah (OPD)",
      value: summary.total_opd || 0,
      icon: <Users size={18} />,
      color: "blue" as const,
      delay: 100,
    },
    {
      label: "API Endpoint Aktif",
      value: 5,
      icon: <Server size={18} />,
      color: "gold" as const,
      delay: 200,
    },
    {
      label: "Kecamatan Tercakup",
      value: summary.total_kecamatan || 17,
      icon: <Map size={18} />,
      color: "green" as const,
      delay: 300,
    },
  ];

  return (
    <section className="relative py-20" style={{ background: "#0f172a" }}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
            style={{ background: "rgba(196,30,58,0.1)", color: "#fda4af", border: "1px solid rgba(196,30,58,0.2)" }}
          >
            <TrendingUp size={12} />
            DATA REALTIME DARI SIPD E-WALIDATA
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">
            Statistik <span className="gradient-text">Portal</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">
            Semua data bersumber langsung dari API resmi SIPD E-Walidata Pemerintah Indonesia
          </p>
        </div>

        {/* Stat Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        {/* Feature Highlights */}
        <div
          className="glass-card p-8"
          style={{ background: "rgba(15,23,42,0.6)" }}
        >
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Open Data Platform",
                desc: "Dataset publik tersedia dalam format JSON, CSV, dan XLSX. Terintegrasi standar SDI nasional.",
                items: ["Download gratis", "Metadata lengkap SDI", "API endpoint publik"],
              },
              {
                title: "Dashboard Analytics",
                desc: "Visualisasi data interaktif dengan chart ECharts dan peta Leaflet berbasis data nyata.",
                items: ["Chart interaktif", "Filter OPD & Kecamatan", "Export PDF & Excel"],
              },
              {
                title: "API Gateway",
                desc: "API terstandar dengan dokumentasi Swagger, rate limiting, dan monitoring real-time.",
                items: ["REST API v1", "Swagger docs", "API key management"],
              },
            ].map(({ title, desc, items }) => (
              <div key={title}>
                <h3 className="text-base font-bold text-white mb-2">{title}</h3>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">{desc}</p>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle size={14} className="text-red-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
