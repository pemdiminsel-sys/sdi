// ============================================================
// API Route: /api/v1/datasets - Dataset listing dari SIPD
// ============================================================

import { type NextRequest } from "next/server";
import { sipdService } from "@/services/sipd.service";
import { kategorisasiRecord } from "@/services/analytics.service";
import { KATEGORI_KEYWORDS } from "@/lib/constants";
import type { Dataset, FilterParams, ApiResponse } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || undefined;
  const kategori = searchParams.get("kategori") || undefined;
  const page = parseInt(searchParams.get("page") ?? "1");
  const per_page = parseInt(searchParams.get("per_page") ?? "12");

  try {
    // Fetch from Database (previously synced)
    const records = await sipdService.getDatasetsFromDb({ search, kategori });
    
    // Transform to Dataset type
    const datasets: Dataset[] = records.map((r: any) => ({
      id: r.kode_dssd,
      kode_dssd: r.kode_dssd,
      nama: r.nama_dssd,
      deskripsi: `Data ${r.nama_dssd} dari ${r.nama_opd} Kabupaten Minahasa Selatan`,
      kategori: r.kategori,
      opd_nama: r.nama_opd,
      satuan: r.satuan,
      frekuensi_update: "Tahunan",
      format_data: ["JSON", "CSV"],
      klasifikasi_keamanan: "Publik",
      status: "Aktif",
      total_records: 1,
      last_updated: r.last_synced,
      tags: [r.kategori, r.satuan, r.nama_opd].filter(Boolean),
      views: 0,
      downloads: 0,
      walidata: r.nama_opd,
      produsen: r.nama_opd,
    }));

    // Paginate
    const total = datasets.length;
    const offset = (page - 1) * per_page;
    const paginated = datasets.slice(offset, offset + per_page);

    // Kategori counts for filter
    const kategoriCounts: Record<string, number> = {};
    datasets.forEach(d => {
      kategoriCounts[d.kategori] = (kategoriCounts[d.kategori] || 0) + 1;
    });

    return Response.json({
      success: true,
      data: paginated,
      meta: {
        total,
        page,
        per_page,
        last_page: Math.ceil(total / per_page),
        source: "Supabase Local Storage",
        synced_at: datasets[0]?.last_updated
      },
      kategori_counts: kategoriCounts
    });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
