"use client";

import Link from "next/link";
import { LayoutDashboard, Database, ChevronRight, Shield, Zap, Globe2 } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/StatCard";
import { APP_CONFIG } from "@/lib/constants";

interface HeroProps {
  summary: {
    total_records: number;
    total_opd: number;
    total_indikator: number;
    total_kecamatan: number;
  };
}

export default function HeroSection({ summary }: HeroProps) {
  return (
    <section
      className="hero-gradient relative overflow-hidden"
      style={{ minHeight: "100vh", paddingTop: "64px" }}
    >
      {/* Animated BG Grid */}
      <div className="absolute inset-0 bg-grid opacity-40" />

      {/* Glow Orbs */}
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(196,30,58,0.18) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(212,160,23,0.1) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 flex flex-col items-center justify-center text-center py-24">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 animate-fade-up"
          style={{
            background: "rgba(196,30,58,0.12)",
            border: "1px solid rgba(196,30,58,0.3)",
          }}
        >
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-sm font-medium text-red-300">Berbasis Standar Satu Data Indonesia & SPBE</span>
        </div>

        {/* Title */}
        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 animate-fade-up delay-100"
          style={{ animationFillMode: "both" }}
        >
          <span className="gradient-text">Portal Satu Data</span>
          <br />
          <span className="text-white">Indonesia</span>
        </h1>

        <p
          className="text-lg sm:text-xl text-slate-300 max-w-2xl mb-4 animate-fade-up delay-200"
          style={{ animationFillMode: "both" }}
        >
          Platform Open Data & Analitik Enterprise
        </p>
        <p
          className="text-base text-slate-400 max-w-xl mb-10 animate-fade-up delay-300"
          style={{ animationFillMode: "both" }}
        >
          Kabupaten Minahasa Selatan · Provinsi Sulawesi Utara
        </p>

        {/* Live Stats Bar */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-px mb-12 animate-fade-up delay-300 w-full max-w-2xl overflow-hidden rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
            animationFillMode: "both",
          }}
        >
          {[
            { label: "Indikator", value: summary.total_indikator || 0 },
            { label: "Perangkat Daerah", value: summary.total_opd || 0 },
            { label: "Kecamatan", value: summary.total_kecamatan || 17 },
            { label: "Total Records", value: summary.total_records || 0 },
          ].map(({ label, value }, i) => (
            <div
              key={i}
              className="p-4 flex flex-col items-center"
              style={{ background: "rgba(15,23,42,0.6)" }}
            >
              <div className="text-2xl font-bold text-white tabular-nums">
                <AnimatedCounter value={value} />
              </div>
              <div className="text-xs text-slate-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row gap-4 animate-fade-up delay-400"
          style={{ animationFillMode: "both" }}
        >
          {document.cookie.includes("sdi-admin-session=true") && (
            <Link href="/dashboard" className="btn-primary text-base py-3 px-8">
              <LayoutDashboard size={18} />
              Buka Dashboard
              <ChevronRight size={16} />
            </Link>
          )}
          <Link href="/datasets" className="btn-secondary text-base py-3 px-8">
            <Database size={18} />
            Jelajahi Dataset
          </Link>
        </div>

        {/* Trust Badges */}
        <div
          className="flex flex-wrap justify-center gap-6 mt-16 animate-fade-up delay-500"
          style={{ animationFillMode: "both" }}
        >
          {[
            { icon: Shield, label: "Standar SDI" },
            { icon: Zap, label: "Realtime Sync" },
            { icon: Globe2, label: "Open Government" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-slate-500 text-sm">
              <Icon size={14} className="text-red-500" />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #0f172a)" }}
      />
    </section>
  );
}
