"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  ArrowLeft, Download, Calendar, Building2, Tag, FileText,
  ExternalLink, Info, Share2, Eye
} from "lucide-react";
import { formatDate, exportToJson, exportToCsv } from "@/lib/utils";
import { CardSkeleton } from "@/components/ui/Skeleton";
import type { Dataset } from "@/types";

async function fetchDataset(id: string): Promise<Dataset | null> {
  // Fetch from our API with filter by kode_dssd or id
  const res = await fetch(`/api/v1/datasets?search=${encodeURIComponent(id)}&per_page=1`);
  if (!res.ok) return null;
  const json = await res.json();
  return json.data?.[0] ?? null;
}

export default function DatasetDetailClient({ id }: { id: string }) {
  const { data: dataset, isLoading, error } = useQuery({
    queryKey: ["dataset-detail", id],
    queryFn: () => fetchDataset(id),
  });

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-4">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (error || !dataset) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 text-center">
        <div className="glass-card p-16">
          <FileText size={48} className="text-slate-700 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Dataset Tidak Ditemukan</h2>
          <p className="text-slate-400 text-sm mb-6">Dataset dengan ID &quot;{id}&quot; tidak ditemukan di sistem.</p>
          <Link href="/datasets" className="btn-primary">
            <ArrowLeft size={15} />
            Kembali ke Portal Dataset
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
        <span>/</span>
        <Link href="/datasets" className="hover:text-white transition-colors">Dataset</Link>
        <span>/</span>
        <span className="text-slate-300 truncate max-w-xs">{dataset.nama}</span>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-5">
          {/* Header Card */}
          <div className="glass-card p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 rounded-xl bg-red-900/20 border border-red-800/30">
                <FileText size={24} className="text-red-400" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="badge badge-red">{dataset.kategori}</span>
                  {dataset.format_data?.map((f) => (
                    <span key={f} className="badge badge-gray">{f}</span>
                  ))}
                </div>
                <h1 className="text-xl font-bold text-white leading-tight">{dataset.nama}</h1>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              {dataset.deskripsi || `Dataset ${dataset.nama} adalah data indikator resmi dari ${dataset.opd_nama} yang dipublikasikan melalui Portal Satu Data Indonesia Kabupaten Minahasa Selatan. Data ini bersumber dari SIPD E-Walidata Kemendagri.`}
            </p>

            {/* Download Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => exportToJson([dataset], `dataset-${id}`)}
                className="btn-primary text-sm py-2 px-5"
              >
                <Download size={14} />
                Download JSON
              </button>
              <button
                onClick={() => exportToCsv([dataset], `dataset-${id}`)}
                className="btn-secondary text-sm py-2 px-5"
              >
                <Download size={14} />
                Download CSV
              </button>
              <button
                onClick={() => navigator.clipboard.writeText(window.location.href)}
                className="btn-secondary text-sm py-2 px-5"
              >
                <Share2 size={14} />
                Bagikan
              </button>
            </div>
          </div>

          {/* Metadata */}
          <div className="glass-card p-6">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Info size={16} className="text-blue-400" />
              Metadata SDI
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: "Kode DSSD", value: dataset.kode_dssd || id },
                { label: "Nama Indikator", value: dataset.nama },
                { label: "Satuan", value: dataset.satuan || "-" },
                { label: "Penanggung Jawab", value: dataset.opd_nama || "-" },
                { label: "Kategori", value: dataset.kategori },
                { label: "Terakhir Diperbarui", value: formatDate(dataset.last_updated) },
                { label: "Format Data", value: dataset.format_data?.join(", ") || "JSON, CSV" },
                { label: "Lisensi", value: "Creative Commons BY 4.0" },
              ].map(({ label, value }) => (
                <div key={label} className="p-3 rounded-lg bg-white/5 border border-white/5">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</div>
                  <div className="text-sm text-slate-200">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Stats */}
          <div className="glass-card p-4">
            <h3 className="text-sm font-bold text-white mb-4">Statistik Penggunaan</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Eye size={14} />
                  <span>Dilihat</span>
                </div>
                <span className="font-semibold text-white">{dataset.views?.toLocaleString() || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Download size={14} />
                  <span>Diunduh</span>
                </div>
                <span className="font-semibold text-white">{dataset.downloads?.toLocaleString() || 0}</span>
              </div>
            </div>
          </div>

          {/* OPD Info */}
          <div className="glass-card p-4">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Building2 size={14} className="text-blue-400" />
              Perangkat Daerah
            </h3>
            <p className="text-sm text-slate-300">{dataset.opd_nama || "Tidak tersedia"}</p>
            <p className="text-xs text-slate-500 mt-1">Kabupaten Minahasa Selatan</p>
          </div>

          {/* Source */}
          <div className="glass-card p-4">
            <h3 className="text-sm font-bold text-white mb-3">Sumber Data</h3>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                SIPD E-Walidata Kemendagri
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Kodepemda: 7105
              </div>
            </div>
            <a
              href="https://sipd.go.id/ewalidata"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors mt-3"
            >
              <ExternalLink size={11} />
              Lihat di SIPD E-Walidata
            </a>
          </div>

          {/* Back */}
          <Link href="/datasets" className="btn-secondary w-full text-sm justify-center py-2">
            <ArrowLeft size={14} />
            Kembali ke Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
