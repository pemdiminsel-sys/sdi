"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { Map, Layers, Info, BarChart2 } from "lucide-react";
import { KECAMATAN_MINSEL } from "@/lib/constants";

// Leaflet harus di-import dynamically (tidak kompatibel dengan SSR)
const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full rounded-2xl skeleton"
      style={{ height: "520px" }}
    />
  ),
});

export default function MapClient() {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [activeLayer, setActiveLayer] = useState<"default" | "heatmap">("default");
  const [selectedKec, setSelectedKec] = useState<string | null>(null);

  useEffect(() => {
    // Fetch data untuk setiap kecamatan
    fetch("/api/v1/statistik")
      .then((r) => r.json())
      .then((d) => {
        if (d.summary?.kecamatan_list) {
          const map: Record<string, number> = {};
          d.summary.kecamatan_list.forEach((k: string, i: number) => {
            map[k] = Math.floor(Math.random() * 100) + 20; // placeholder count
          });
          setStats(map);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full"
            style={{ background: "rgba(16,185,129,0.1)", color: "#6ee7b7", border: "1px solid rgba(16,185,129,0.2)" }}
          >
            <Map size={11} className="inline mr-1" />
            GEO ANALYTICS
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-2">
          Peta <span className="gradient-text">Wilayah</span> Minahasa Selatan
        </h1>
        <p className="text-slate-400 text-sm">Visualisasi spasial interaktif per kecamatan berbasis data SIPD</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Map */}
        <div className="lg:col-span-3">
          <div className="glass-card p-1 overflow-hidden" style={{ borderRadius: "1.25rem" }}>
            {/* Map Controls */}
            <div className="flex items-center gap-2 p-3 pb-0">
              <button
                onClick={() => setActiveLayer("default")}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeLayer === "default" ? "bg-red-900/30 text-red-400" : "text-slate-500 hover:text-white"
                }`}
              >
                <Layers size={12} className="inline mr-1" />
                Default
              </button>
              <button
                onClick={() => setActiveLayer("heatmap")}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeLayer === "heatmap" ? "bg-red-900/30 text-red-400" : "text-slate-500 hover:text-white"
                }`}
              >
                <BarChart2 size={12} className="inline mr-1" />
                Heatmap
              </button>
            </div>
            <LeafletMap layer={activeLayer} onKecamatanSelect={setSelectedKec} />
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4">
          {/* Selected Info */}
          <div className="glass-card p-4">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Info size={14} className="text-blue-400" />
              Info Wilayah
            </h3>
            {selectedKec ? (
              <div>
                <p className="text-base font-bold text-white">{selectedKec}</p>
                <p className="text-xs text-slate-400 mt-1">Kabupaten Minahasa Selatan</p>
                <div className="mt-3 p-3 rounded-lg bg-white/5 border border-white/5">
                  <div className="text-2xl font-bold text-white">{stats[selectedKec] ?? "-"}</div>
                  <div className="text-xs text-slate-500">Indikator Data</div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Klik kecamatan pada peta untuk melihat detail</p>
            )}
          </div>

          {/* Kecamatan List */}
          <div className="glass-card p-4">
            <h3 className="text-sm font-bold text-white mb-3">Kecamatan ({KECAMATAN_MINSEL.length})</h3>
            <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
              {KECAMATAN_MINSEL.map((k) => (
                <button
                  key={k.id}
                  onClick={() => setSelectedKec(k.nama)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between ${
                    selectedKec === k.nama
                      ? "bg-red-900/20 text-red-400"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span>{k.nama}</span>
                  <span className="text-[10px] text-slate-600">{stats[k.nama] ?? 0}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
