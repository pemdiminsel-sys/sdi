// ============================================================
// API Route: /api/v1/dashboard - Aggregated dashboard data
// ============================================================

import { type NextRequest } from "next/server";
import { sipdService } from "@/services/sipd.service";
import { generateInsights, extractKpiStats } from "@/services/analytics.service";

export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest) {
  try {
    const records = await sipdService.getDssd();
    const summary = await sipdService.getSummaryStats(records);
    const insights = generateInsights(records);
    const kpis = extractKpiStats(records);
    const byOpd = sipdService.groupByOpd(records);

    const opdStats = Object.entries(byOpd)
      .map(([nama, recs]) => ({ nama, count: recs.length }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return Response.json({
      success: true,
      data: { summary, insights, kpis, opdStats },
      meta: { source: "SIPD E-Walidata", synced_at: new Date().toISOString() },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal memuat dashboard";
    return Response.json({ success: false, error: message }, { status: 500 });
  }
}
