"use client";

import { useEffect, useRef, useState } from "react";
import { compactNumber } from "@/lib/utils";

interface CounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  decimals?: number;
}

export function AnimatedCounter({ value, suffix = "", prefix = "", duration = 1800, decimals = 0 }: CounterProps) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startRef.current = null;

    const step = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Easing: easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = eased * value;
      setDisplay(parseFloat(current.toFixed(decimals)));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [value, duration, decimals]);

  const formatted = decimals > 0
    ? display.toFixed(decimals)
    : new Intl.NumberFormat("id-ID").format(Math.round(display));

  return (
    <span>
      {prefix}{formatted}{suffix}
    </span>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  icon?: React.ReactNode;
  trend?: "naik" | "turun" | "stabil";
  trendPct?: number;
  color?: "red" | "gold" | "blue" | "green";
  delay?: number;
}

export function StatCard({ label, value, suffix = "", icon, trend, trendPct, color = "red", delay = 0 }: StatCardProps) {
  const colorMap = {
    red:   { bg: "rgba(196,30,58,0.15)",  border: "rgba(196,30,58,0.3)",  glow: "rgba(196,30,58,0.2)",  text: "#fda4af" },
    gold:  { bg: "rgba(212,160,23,0.15)", border: "rgba(212,160,23,0.3)", glow: "rgba(212,160,23,0.2)", text: "#fde68a" },
    blue:  { bg: "rgba(30,58,95,0.2)",    border: "rgba(59,130,246,0.2)", glow: "rgba(59,130,246,0.15)", text: "#93c5fd" },
    green: { bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.3)", glow: "rgba(16,185,129,0.2)", text: "#6ee7b7" },
  };
  const c = colorMap[color];

  return (
    <div
      className="glass-card p-5 animate-fade-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}
    >
      <div className="flex items-start justify-between mb-3">
        {icon && (
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: c.bg, border: `1px solid ${c.border}` }}
          >
            <span style={{ color: c.text }}>{icon}</span>
          </div>
        )}
        {trend && (
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: trend === "naik" ? "rgba(16,185,129,0.15)" : trend === "turun" ? "rgba(239,68,68,0.15)" : "rgba(100,116,139,0.15)",
              color: trend === "naik" ? "#6ee7b7" : trend === "turun" ? "#fca5a5" : "#94a3b8",
            }}
          >
            {trend === "naik" ? "▲" : trend === "turun" ? "▼" : "→"} {trendPct}%
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-1" style={{ fontVariantNumeric: "tabular-nums" }}>
        <AnimatedCounter value={value} suffix={suffix} />
      </div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  );
}
