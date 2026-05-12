"use client";

import { useState } from "react";
import { Code, Copy, CheckCircle, ExternalLink, Key, Zap, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const endpoints = [
  {
    method: "GET",
    path: "/api/v1/datasets",
    description: "Mendapatkan daftar dataset dengan filter dan pagination",
    params: [
      { name: "search", type: "string", desc: "Kata kunci pencarian" },
      { name: "kategori", type: "string", desc: "Filter kategori dataset" },
      { name: "opd", type: "string", desc: "Filter nama OPD" },
      { name: "page", type: "number", desc: "Nomor halaman (default: 1)" },
      { name: "per_page", type: "number", desc: "Jumlah per halaman (default: 12)" },
    ],
    example: `{
  "success": true,
  "data": [
    {
      "id": "dssd-001",
      "kode_dssd": "DS001",
      "nama": "Jumlah Penduduk",
      "kategori": "Kependudukan",
      "opd_nama": "Dinas Kependudukan",
      "satuan": "Jiwa",
      "status": "Aktif"
    }
  ],
  "meta": {
    "total": 1248,
    "page": 1,
    "per_page": 12,
    "source": "SIPD E-Walidata"
  }
}`,
  },
  {
    method: "GET",
    path: "/api/v1/statistik",
    description: "Mendapatkan statistik ringkasan dan KPI daerah",
    params: [],
    example: `{
  "success": true,
  "data": {
    "total_dataset": 1248,
    "total_opd": 18,
    "total_api": 5,
    "total_records": 3500,
    "last_sync": "2026-05-12T20:00:00.000Z"
  },
  "kpis": [ ... ],
  "insights": [ ... ]
}`,
  },
  {
    method: "GET",
    path: "/api/v1/opd",
    description: "Mendapatkan daftar Perangkat Daerah (OPD) dan statistik dataset mereka",
    params: [],
    example: `{
  "success": true,
  "data": [
    {
      "id": "OPD001",
      "kode": "5.01.01",
      "nama": "Dinas Kesehatan",
      "total_dataset": 87,
      "dataset_aktif": 87,
      "status": "Aktif"
    }
  ],
  "meta": { "total": 18, "source": "SIPD E-Walidata" }
}`,
  },
  {
    method: "GET",
    path: "/api/v1/datasets?kategori=Kesehatan",
    description: "Filter dataset berdasarkan kategori Kesehatan",
    params: [],
    example: `{
  "success": true,
  "data": [ /* dataset kategori Kesehatan */ ],
  "meta": { "total": 90 }
}`,
  },
  {
    method: "GET",
    path: "/api/v1/datasets?search=penduduk",
    description: "Pencarian dataset berdasarkan kata kunci",
    params: [],
    example: `{
  "success": true,
  "data": [ /* dataset mengandung 'penduduk' */ ],
  "meta": { "total": 45 }
}`,
  },
];

const methodColors: Record<string, { bg: string; text: string; border: string }> = {
  GET:    { bg: "rgba(16,185,129,0.12)",  text: "#6ee7b7", border: "rgba(16,185,129,0.25)" },
  POST:   { bg: "rgba(59,130,246,0.12)",  text: "#93c5fd", border: "rgba(59,130,246,0.25)" },
  PUT:    { bg: "rgba(245,158,11,0.12)",  text: "#fde68a", border: "rgba(245,158,11,0.25)" },
  DELETE: { bg: "rgba(239,68,68,0.12)",   text: "#fca5a5", border: "rgba(239,68,68,0.25)" },
};

export default function ApiDocsClient() {
  const [activeEndpoint, setActiveEndpoint] = useState(0);
  const [copied, setCopied] = useState(false);

  const copyExample = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Contoh response disalin!");
    setTimeout(() => setCopied(false), 2000);
  };

  const copyUrl = (path: string) => {
    navigator.clipboard.writeText(`${window.location.origin}${path}`);
    toast.success("URL endpoint disalin!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold px-3 py-1 rounded-full"
            style={{ background: "rgba(212,160,23,0.1)", color: "#fde68a", border: "1px solid rgba(212,160,23,0.2)" }}>
            <Code size={11} className="inline mr-1" />
            REST API v1
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-2">
          API <span className="gradient-text-gold">Gateway</span> & Dokumentasi
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl">
          API publik Portal Satu Data Indonesia Kabupaten Minahasa Selatan. Semua endpoint bersumber dari SIPD E-Walidata.
        </p>
      </div>

      {/* Info Cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {[
          { icon: Zap, title: "Base URL", value: `${typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"}/api/v1`, color: "gold" },
          { icon: Key, title: "Autentikasi", value: "Publik – Tidak perlu API key", color: "green" },
          { icon: Shield, title: "Rate Limit", value: "100 req/menit", color: "blue" },
        ].map(({ icon: Icon, title, value, color }) => (
          <div key={title} className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon size={14} className={color === "gold" ? "text-yellow-400" : color === "green" ? "text-green-400" : "text-blue-400"} />
              <span className="text-xs font-semibold text-slate-400">{title}</span>
            </div>
            <p className="text-sm font-mono text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Endpoints */}
      <div className="flex gap-6">
        {/* Endpoint List */}
        <div className="w-72 shrink-0 space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Endpoints</h3>
          {endpoints.map((ep, i) => {
            const mc = methodColors[ep.method] ?? methodColors.GET;
            return (
              <button
                key={i}
                onClick={() => setActiveEndpoint(i)}
                className={cn(
                  "w-full text-left p-3 rounded-xl transition-all border",
                  activeEndpoint === i
                    ? "bg-slate-800/80 border-white/10"
                    : "border-transparent hover:bg-white/5"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                    style={{ background: mc.bg, color: mc.text, border: `1px solid ${mc.border}` }}>
                    {ep.method}
                  </span>
                </div>
                <div className="text-xs font-mono text-slate-300 break-all leading-tight">{ep.path}</div>
              </button>
            );
          })}
        </div>

        {/* Endpoint Detail */}
        <div className="flex-1 min-w-0">
          {(() => {
            const ep = endpoints[activeEndpoint];
            const mc = methodColors[ep.method] ?? methodColors.GET;
            return (
              <div className="glass-card p-6 space-y-6">
                {/* Title */}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-bold px-2 py-1 rounded-lg"
                      style={{ background: mc.bg, color: mc.text, border: `1px solid ${mc.border}` }}>
                      {ep.method}
                    </span>
                    <code className="text-sm font-mono text-white">{ep.path}</code>
                    <button onClick={() => copyUrl(ep.path)} className="ml-auto text-slate-500 hover:text-white transition-colors" title="Salin URL">
                      <ExternalLink size={14} />
                    </button>
                  </div>
                  <p className="text-sm text-slate-400">{ep.description}</p>
                </div>

                {/* Parameters */}
                {ep.params.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Query Parameters</h4>
                    <div className="overflow-x-auto rounded-xl border border-white/6">
                      <table className="data-table w-full text-xs">
                        <thead>
                          <tr>
                            <th>Parameter</th>
                            <th>Tipe</th>
                            <th>Deskripsi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ep.params.map((p) => (
                            <tr key={p.name}>
                              <td><code className="text-green-400 text-[11px]">{p.name}</code></td>
                              <td><span className="text-yellow-500 text-[11px]">{p.type}</span></td>
                              <td className="text-slate-400">{p.desc}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Response Example */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Contoh Response</h4>
                    <button
                      onClick={() => copyExample(ep.example)}
                      className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-green-400 transition-colors"
                    >
                      {copied ? <CheckCircle size={12} /> : <Copy size={12} />}
                      {copied ? "Disalin!" : "Salin"}
                    </button>
                  </div>
                  <pre className="p-4 rounded-xl overflow-x-auto text-[11px] leading-relaxed"
                    style={{ background: "rgba(7,17,30,0.8)", border: "1px solid rgba(255,255,255,0.06)", color: "#a5f3fc" }}>
                    {ep.example}
                  </pre>
                </div>

                {/* Try It */}
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Coba Endpoint</h4>
                  <div className="flex gap-2">
                    <input
                      readOnly
                      value={`${typeof window !== "undefined" ? window.location.origin : ""}${ep.path}`}
                      className="input-field flex-1 font-mono text-xs"
                    />
                    <a
                      href={ep.path}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-primary text-xs py-2 px-4 whitespace-nowrap"
                    >
                      <ExternalLink size={13} />
                      Buka
                    </a>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
