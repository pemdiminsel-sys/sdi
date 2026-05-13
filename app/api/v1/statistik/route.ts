// ============================================================
// API Route: /api/v1/statistik - KPI & statistik daerah
// ============================================================

import { type NextRequest } from "next/server";
import { sipdService } from "@/services/sipd.service";
import { extractKpiStats, generateInsights } from "@/services/analytics.service";
import type { ApiResponse, DashboardStats } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 1800;

export async function GET(_request: NextRequest) {
  try {
    // Ambil data dari database (hasil sinkronisasi)
    const records = await sipdService.getDatasetsFromDb();
    const summary = await sipdService.getSummaryStats(records);
    const kpis = extractKpiStats(records);
    const insights = generateInsights(records);

    // Kategori distribution
    const { kategorisasiRecord } = await import("@/services/analytics.service");
    const byKategori: Record<string, number> = {};
    for (const r of records) {
      const kat = kategorisasiRecord(r.nama_dssd ?? "");
      byKategori[kat] = (byKategori[kat] ?? 0) + 1;
    }

    const dashboardStats: DashboardStats = {
      total_dataset: summary.total_indikator,
      total_opd: summary.total_opd,
      total_api: 5, // internal API endpoints
      total_records: summary.total_records,
      last_sync: new Date().toISOString(),
      by_kategori: byKategori as DashboardStats["by_kategori"],
    };

    const response: ApiResponse<typeof dashboardStats> = {
      success: true,
      data: dashboardStats,
      meta: {
        source: "SIPD E-Walidata",
        synced_at: new Date().toISOString(),
      },
    };

    return Response.json({ ...response, kpis, insights, summary });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal mengambil statistik";
    return Response.json({ success: false, error: message }, { status: 500 });
  }
}
