"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Database, 
  Search, 
  Filter, 
  Eye, 
  EyeOff, 
  Edit3, 
  MoreVertical,
  Download,
  FileSpreadsheet,
  CheckCircle2
} from "lucide-react";
import { cn, exportToCsv } from "@/lib/utils";
import type { Dataset } from "@/types";
import { KATEGORI_DATASET } from "@/lib/constants";
import { toast } from "sonner";

async function fetchAllDatasets() {
  const res = await fetch("/api/v1/datasets?per_page=100");
  if (!res.ok) throw new Error("Gagal memuat dataset");
  return res.json();
}

export default function AdminDatasetsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-datasets"],
    queryFn: fetchAllDatasets,
  });

  const datasets: Dataset[] = data?.data ?? [];

  const filteredDatasets = datasets.filter(d => {
    const matchesSearch = d.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         d.kode_dssd?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || d.kategori === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBulkExport = () => {
    if (filteredDatasets.length === 0) {
      toast.error("Tidak ada data untuk diekspor");
      return;
    }
    exportToCsv(filteredDatasets, `sdi-minsel-export-${new Date().toISOString().split('T')[0]}`);
    toast.success(`${filteredDatasets.length} dataset berhasil diekspor ke CSV`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Data Management</h1>
          <p className="text-sm text-slate-400 mt-1">Manage visibility and metadata of all integrated datasets</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleBulkExport}
            className="btn-secondary text-xs"
          >
            <FileSpreadsheet size={14} className="mr-2" />
            Bulk Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search by name or code..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select 
          className="input-field w-full md:w-48 text-xs"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          {KATEGORI_DATASET.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button className="btn-secondary p-2.5">
          <Filter size={16} />
        </button>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table w-full">
            <thead>
              <tr>
                <th className="pl-6">Dataset Name</th>
                <th>Category</th>
                <th>Agency (OPD)</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th className="pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="pl-6"><div className="h-4 w-48 skeleton"></div></td>
                    <td><div className="h-4 w-24 skeleton"></div></td>
                    <td><div className="h-4 w-32 skeleton"></div></td>
                    <td><div className="h-4 w-16 skeleton"></div></td>
                    <td><div className="h-4 w-24 skeleton"></div></td>
                    <td className="pr-6"><div className="h-8 w-8 skeleton ml-auto"></div></td>
                  </tr>
                ))
              ) : filteredDatasets.length > 0 ? (
                filteredDatasets.map((d) => (
                  <tr key={d.id} className="hover:bg-white/[0.02] group transition-colors">
                    <td className="pl-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white leading-tight">{d.nama}</span>
                        <span className="text-[10px] text-slate-500 font-mono mt-0.5">{d.kode_dssd || `ID: ${d.id}`}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-gray text-[10px]">{d.kategori}</span>
                    </td>
                    <td className="text-xs text-slate-400 max-w-[200px] truncate">{d.opd_nama}</td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 size={12} className="text-green-500" />
                        <span className="text-[10px] font-bold text-green-400 uppercase">Synced</span>
                      </div>
                    </td>
                    <td className="text-xs text-slate-500 font-mono">
                      {d.last_updated ? new Date(d.last_updated).toLocaleDateString() : "2026-05-12"}
                    </td>
                    <td className="pr-6">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all" title="Edit Metadata">
                          <Edit3 size={14} />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all" title="Toggle Visibility">
                          <Eye size={14} />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all">
                          <MoreVertical size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center">
                      <Database size={40} className="text-slate-800 mb-4" />
                      <p className="text-slate-500 font-medium">No datasets found matching your criteria</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
