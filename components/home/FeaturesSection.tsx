"use client";

import Link from "next/link";
import {
  LayoutDashboard, Database, Map, FileText,
  Shield, BarChart2, Users, Bell, ArrowRight
} from "lucide-react";

const features = [
  {
    icon: LayoutDashboard,
    title: "Dashboard Bupati",
    desc: "Command center eksklusif dengan indikator strategis daerah, AI insight, dan monitoring realtime seluruh OPD.",
    href: "/dashboard",
    color: "red",
    badge: "Command Center",
  },
  {
    icon: Database,
    title: "Portal Dataset",
    desc: "Jelajahi ribuan dataset publik dengan search cerdas, preview data, metadata SDI lengkap, dan multi-format download.",
    href: "/datasets",
    color: "blue",
    badge: "Open Data",
  },
  {
    icon: Map,
    title: "Peta & Geo Analytics",
    desc: "Visualisasi spasial interaktif per kecamatan dengan heatmap, clustering, dan indikator wilayah dinamis.",
    href: "/maps",
    color: "green",
    badge: "Geo Analytics",
  },
  {
    icon: FileText,
    title: "API Gateway",
    desc: "API terstandar dengan dokumentasi Swagger interaktif, sistem API key, rate limiting, dan monitoring endpoint.",
    href: "/api-docs",
    color: "gold",
    badge: "REST API v1",
  },
  {
    icon: BarChart2,
    title: "Analytics Engine",
    desc: "Analitik mendalam dengan trend comparison, anomaly detection, dan AI insight otomatis dari data SIPD.",
    href: "/dashboard/analytics",
    color: "purple",
    badge: "AI Powered",
  },
  {
    icon: Users,
    title: "Manajemen OPD",
    desc: "Kelola data, user, dan approval workflow antar OPD dengan sistem RBAC 4 level role lengkap audit trail.",
    href: "/admin",
    color: "teal",
    badge: "RBAC System",
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string; badgeBg: string }> = {
  red:    { bg: "rgba(196,30,58,0.1)",   border: "rgba(196,30,58,0.25)",   text: "#fda4af", badgeBg: "rgba(196,30,58,0.15)" },
  blue:   { bg: "rgba(59,130,246,0.1)",  border: "rgba(59,130,246,0.25)",  text: "#93c5fd", badgeBg: "rgba(59,130,246,0.15)" },
  green:  { bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.25)",  text: "#6ee7b7", badgeBg: "rgba(16,185,129,0.15)" },
  gold:   { bg: "rgba(212,160,23,0.1)",  border: "rgba(212,160,23,0.25)",  text: "#fde68a", badgeBg: "rgba(212,160,23,0.15)" },
  purple: { bg: "rgba(139,92,246,0.1)",  border: "rgba(139,92,246,0.25)",  text: "#c4b5fd", badgeBg: "rgba(139,92,246,0.15)" },
  teal:   { bg: "rgba(20,184,166,0.1)",  border: "rgba(20,184,166,0.25)",  text: "#5eead4", badgeBg: "rgba(20,184,166,0.15)" },
};

export default function FeaturesSection() {
  return (
    <section className="py-20" style={{ background: "linear-gradient(180deg,#0f172a 0%, #07111e 100%)" }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
            style={{ background: "rgba(212,160,23,0.1)", color: "#fde68a", border: "1px solid rgba(212,160,23,0.2)" }}
          >
            <Shield size={12} />
            ENTERPRISE-GRADE FEATURES
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">
            Ekosistem Data <span className="gradient-text-gold">Pemerintahan Digital</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm">
            Platform terintegrasi untuk transformasi digital pemerintahan Kabupaten Minahasa Selatan
            berbasis standar nasional SDI dan SPBE.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, desc, href, color, badge }, i) => {
            const c = colorMap[color];
            return (
              <Link
                key={title}
                href={href}
                className="glass-card p-6 group block animate-fade-up"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                    style={{ background: c.bg, border: `1px solid ${c.border}` }}
                  >
                    <Icon size={20} style={{ color: c.text }} />
                  </div>
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: c.badgeBg, color: c.text }}
                  >
                    {badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-red-300 transition-colors">
                  {title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">{desc}</p>
                <div className="flex items-center gap-1 text-xs font-semibold transition-all duration-200 group-hover:gap-2"
                  style={{ color: c.text }}>
                  Jelajahi
                  <ArrowRight size={12} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
