"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Download, RefreshCw, Database, Grid, List } from "lucide-react";
import DatasetCard from "@/components/datasets/DatasetCard";
import { CardSkeleton } from "@/components/ui/Skeleton";
import type { Dataset, FilterParams } from "@/types";
import { KATEGORI_DATASET } from "@/lib/constants";
import { cn, exportToJson, exportToCsv } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

async function fetchDatasets(params: FilterParams) {
  const q = new URLSearchParams();
  if (params.search) q.set("search", params.search);
  if (params.kategori) q.set("kategori", params.kategori);
  if (params.opd_id) q.set("opd", params.opd_id);
  if (params.page) q.set("page", String(params.page));
  if (params.per_page) q.set("per_page", String(params.per_page));
  if (params.sort_by) q.set("sort_by", params.sort_by);
  if (params.sort_order) q.set("sort_order", params.sort_order);
  const res = await fetch(`/api/v1/datasets?${q.toString()}`);
  if (!res.ok) throw new Error("Gagal memuat dataset");
  return res.json();
}

export default function DatasetPortal() {
  const [filters, setFilters] = useState<FilterParams>({
    search: "",
    page: 1,
    per_page: 12,
    sort_by: "nama",
    sort_order: "asc",
  });
  const [searchInput, setSearchInput] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["datasets", filters],
    queryFn: () => fetchDatasets(filters),
    staleTime: 60000,
  });

  const datasets: Dataset[] = data?.data ?? [];
  const meta = data?.meta ?? {};
  const kategoriCounts: Record<string, number> = data?.kategori_counts ?? {};

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => {
      setFilters((f) => ({ ...f, search: searchInput, page: 1 }));
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full"
            style={{ background: "rgba(196,30,58,0.1)", color: "#fda4af", border: "1px solid rgba(196,30,58,0.2)" }}
          >
            <Database size={11} className="inline mr-1" />
            PORTAL DATASET
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-2">
          Data <span className="gradient-text">Terbuka</span> Minahasa Selatan
        </h1>
        <p className="text-slate-400 text-sm">
          Semua data bersumber dari API SIPD E-Walidata · Kodepemda 7105
        </p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Filter */}
        <aside className="w-56 shrink-0 hidden md:block space-y-2">
          <div className="glass-card p-4">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Filter size={14} className="text-red-400" />
              Kategori
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => setFilters((f) => ({ ...f, kategori: undefined, page: 1 }))}
                className={cn(
                  "w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-between",
                  !filters.kategori
                    ? "bg-red-900/20 text-red-400"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <span>Semua</span>
                <span className="text-[10px] text-slate-600">{meta.total ?? 0}</span>
              </button>
              {KATEGORI_DATASET.map((kat) => (
                <button
                  key={kat}
                  onClick={() =>
                    setFilters((f) => ({ ...f, kategori: kat as FilterParams["kategori"], page: 1 }))
                  }
                  className={cn(
                    "w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-between",
                    filters.kategori === kat
                      ? "bg-red-900/20 text-red-400"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <span>{kat}</span>
                  <span className="text-[10px] text-slate-600">{kategoriCounts[kat] ?? 0}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Search & Controls */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                className="input-field pl-9"
                placeholder="Cari dataset, kode DSSD, OPD..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="input-field w-40 text-xs"
                value={filters.sort_by}
                onChange={(e) => setFilters((f) => ({ ...f, sort_by: e.target.value, page: 1 }))}
              >
                <option value="nama">Nama A-Z</option>
                <option value="views">Terpopuler</option>
                <option value="downloads">Terbanyak Diunduh</option>
              </select>
              <button
                onClick={() => refetch()}
                className="btn-secondary p-2.5"
                title="Refresh data"
                disabled={isFetching}
              >
                <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
              </button>
              <div className="flex border border-white/10 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn("p-2.5 transition-colors", viewMode === "grid" ? "bg-red-900/30 text-red-400" : "text-slate-500 hover:text-white")}
                >
                  <Grid size={15} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn("p-2.5 transition-colors", viewMode === "list" ? "bg-red-900/30 text-red-400" : "text-slate-500 hover:text-white")}
                >
                  <List size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-slate-500">
              {isLoading ? "Memuat..." : `${meta.total ?? 0} dataset ditemukan`}
              {filters.search && ` untuk "${filters.search}"`}
            </p>
            <button
              onClick={() => exportToJson(datasets, "dataset-minsel")}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-400 transition-colors"
            >
              <Download size={12} />
              Export JSON
            </button>
          </div>

          {/* Dataset Grid */}
          {isLoading ? (
            <div className={cn("grid gap-4", viewMode === "grid" ? "sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1")}>
              {Array.from({ length: 9 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : datasets.length === 0 ? (
            <div className="glass-card p-16 text-center">
              <Database size={40} className="text-slate-700 mx-auto mb-4" />
              <p className="text-slate-400 font-medium">Tidak ada dataset ditemukan</p>
              <p className="text-slate-600 text-sm mt-1">Coba ubah filter atau kata kunci pencarian</p>
            </div>
          ) : (
            <div className={cn("grid gap-4", viewMode === "grid" ? "sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1")}>
              {datasets.map((d) => <DatasetCard key={d.id} dataset={d} />)}
            </div>
          )}

          {/* Pagination */}
          {meta.last_page > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                disabled={meta.page <= 1}
                onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}
                className="btn-secondary py-1.5 px-3 text-xs disabled:opacity-40"
              >
                ← Prev
              </button>
              <span className="text-xs text-slate-500">
                Halaman {meta.page} dari {meta.last_page}
              </span>
              <button
                disabled={meta.page >= meta.last_page}
                onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
                className="btn-secondary py-1.5 px-3 text-xs disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
