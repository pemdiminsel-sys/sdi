// ============================================================
// API Route: /api/v1/opd - Daftar OPD dan statistik mereka
// ============================================================

import { type NextRequest } from "next/server";
import { sipdService } from "@/services/sipd.service";
import type { OPD, ApiResponse } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET(_request: NextRequest) {
  try {
    const records = await sipdService.getDssd();
    const byOpd = sipdService.groupByOpd(records);

    const opdList: OPD[] = Object.entries(byOpd)
      .filter(([nama]) => nama !== "Tidak Diketahui")
      .map(([nama, recs], idx) => {
        const kode = recs[0]?.kode_opd ?? `OPD${String(idx + 1).padStart(3, "0")}`;
        return {
          id: kode,
          kode,
          nama,
          singkatan: nama
            .split(" ")
            .filter((w) => w.length > 3)
            .map((w) => w[0].toUpperCase())
            .join(""),
          total_dataset: recs.length,
          dataset_aktif: recs.length,
          last_sync: new Date().toISOString(),
          status: "Aktif" as const,
        };
      })
      .sort((a, b) => b.total_dataset - a.total_dataset);

    const response: ApiResponse<OPD[]> = {
      success: true,
      data: opdList,
      meta: {
        total: opdList.length,
        source: "SIPD E-Walidata",
        synced_at: new Date().toISOString(),
      },
    };

    return Response.json(response);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal mengambil data OPD";
    return Response.json({ success: false, error: message }, { status: 500 });
  }
}
