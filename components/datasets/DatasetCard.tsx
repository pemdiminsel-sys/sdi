"use client";

import Link from "next/link";
import { 
  FileText, 
  Download, 
  Eye, 
  Calendar, 
  Building2, 
  Tag, 
  ChevronRight 
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import type { Dataset } from "@/types";

interface DatasetCardProps {
  dataset: Dataset;
  className?: string;
}

export default function DatasetCard({ dataset, className }: DatasetCardProps) {
  return (
    <div className={cn("glass-card group flex flex-col h-full", className)}>
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2 rounded-lg bg-red-900/20 border border-red-800/30 text-red-400 group-hover:bg-red-900/30 transition-colors">
            <FileText size={20} />
          </div>
          <div className="flex gap-2">
            {dataset.format_data.map((format) => (
              <span 
                key={format}
                className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700"
              >
                {format}
              </span>
            ))}
          </div>
        </div>

        <Link href={`/datasets/${dataset.id}`}>
          <h3 className="text-base font-bold text-white mb-2 line-clamp-2 group-hover:text-red-400 transition-colors leading-tight">
            {dataset.nama}
          </h3>
        </Link>

        <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {dataset.deskripsi || `Data indikator ${dataset.nama} untuk wilayah Kabupaten Minahasa Selatan.`}
        </p>

        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <Building2 size={12} className="shrink-0" />
            <span className="truncate">{dataset.opd_nama || "Perangkat Daerah"}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <Calendar size={12} className="shrink-0" />
            <span>Update: {formatDate(dataset.last_updated)}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <Tag size={12} className="shrink-0" />
            <span className="truncate">{dataset.kategori}</span>
          </div>
        </div>
      </div>

      <div className="px-5 py-4 border-t border-white/5 bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Eye size={12} />
            {dataset.views.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Download size={12} />
            {dataset.downloads.toLocaleString()}
          </div>
        </div>
        <Link 
          href={`/datasets/${dataset.id}`}
          className="flex items-center gap-1 text-[11px] font-bold text-red-400 hover:text-red-300 transition-colors"
        >
          Lihat Data
          <ChevronRight size={12} />
        </Link>
      </div>
    </div>
  );
}
