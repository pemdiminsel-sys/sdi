// ============================================================
// Analytics Engine - AI Insight & Trend Analysis
// ============================================================

import type { DssdRecord, AiInsight, TrendData, StatistikDaerah } from "@/types";
import { KATEGORI_KEYWORDS } from "@/lib/constants";

// Kategorisasi otomatis berdasarkan nama indikator
export function kategorisasiRecord(nama: string): string {
  const lower = nama.toLowerCase();
  for (const [kategori, keywords] of Object.entries(KATEGORI_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return kategori;
    }
  }
  return "Lainnya";
}

// Generate AI Insights dari data DSSD
export function generateInsights(records: DssdRecord[]): AiInsight[] {
  const insights: AiInsight[] = [];
  const now = new Date().toISOString();

  // Group by kecamatan
  const byKecamatan = records.reduce(
    (acc, r) => {
      const k = r.kecamatan_nama ?? "Kabupaten";
      if (!acc[k]) acc[k] = [];
      acc[k].push(r);
      return acc;
    },
    {} as Record<string, DssdRecord[]>
  );

  // OPD dengan data terbanyak
  const byOpd = records.reduce(
    (acc, r) => {
      const o = r.nama_opd ?? "Tidak Diketahui";
      acc[o] = (acc[o] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const topOpd = Object.entries(byOpd).sort((a, b) => b[1] - a[1])[0];
  if (topOpd) {
    insights.push({
      id: "insight-top-opd",
      type: "info",
      kategori: "Pemerintahan",
      judul: "OPD dengan Data Terbanyak",
      deskripsi: `${topOpd[0]} memiliki ${topOpd[1]} indikator data aktif - tertinggi di antara semua OPD.`,
      nilai: topOpd[1],
      generated_at: now,
      priority: "low",
    });
  }

  // Kecamatan dengan data terlengkap
  const kecSizes = Object.entries(byKecamatan).map(([k, v]) => ({ nama: k, count: v.length }));
  const topKec = kecSizes.sort((a, b) => b.count - a.count)[0];
  if (topKec && topKec.nama !== "Kabupaten") {
    insights.push({
      id: "insight-top-kecamatan",
      type: "success",
      kategori: "Kependudukan",
      judul: `${topKec.nama} Paling Banyak Data`,
      deskripsi: `Kecamatan ${topKec.nama} memiliki ${topKec.count} indikator data - capaian tertinggi integrasi data wilayah.`,
      nilai: topKec.count,
      generated_at: now,
      priority: "medium",
    });
  }

  // Deteksi nilai kosong / anomali
  const kosong = records.filter(
    (r) => r.nilai === null || r.nilai === "" || r.nilai === undefined
  );
  const pctKosong = Math.round((kosong.length / Math.max(records.length, 1)) * 100);
  if (pctKosong > 20) {
    insights.push({
      id: "insight-data-kosong",
      type: "warning",
      kategori: "Kualitas Data",
      judul: "Data Belum Terisi",
      deskripsi: `${pctKosong}% indikator (${kosong.length} dari ${records.length}) belum memiliki nilai. Segera lakukan sinkronisasi data.`,
      nilai: pctKosong,
      generated_at: now,
      priority: "high",
    });
  }

  // Total indikator health check
  if (records.length > 0) {
    insights.push({
      id: "insight-total",
      type: "info",
      kategori: "Ringkasan",
      judul: `${records.length.toLocaleString("id-ID")} Indikator Tersinkronisasi`,
      deskripsi: `Portal Satu Data Minahasa Selatan berhasil mengintegrasikan ${records.length} indikator dari API E-Walidata SIPD.`,
      nilai: records.length,
      generated_at: now,
      priority: "low",
    });
  }

  return insights.slice(0, 6);
}

// Transformasi data DSSD menjadi StatistikDaerah untuk dashboard
export function extractKpiStats(records: DssdRecord[]): StatistikDaerah[] {
  const kpiMap: Record<string, { label: string; keywords: string[]; satuan: string; icon: string }> = {
    penduduk: {
      label: "Jumlah Penduduk",
      keywords: ["jumlah penduduk", "total penduduk", "penduduk jiwa"],
      satuan: "Jiwa",
      icon: "Users",
    },
    kemiskinan: {
      label: "Tingkat Kemiskinan",
      keywords: ["kemiskinan", "miskin", "persentase miskin"],
      satuan: "%",
      icon: "TrendingDown",
    },
    stunting: {
      label: "Prevalensi Stunting",
      keywords: ["stunting", "gizi buruk", "balita pendek"],
      satuan: "%",
      icon: "Activity",
    },
    pendidikan: {
      label: "APK Sekolah",
      keywords: ["angka partisipasi", "apk", "aps sekolah"],
      satuan: "%",
      icon: "GraduationCap",
    },
    desa: {
      label: "Jumlah Desa",
      keywords: ["jumlah desa", "total desa", "desa kelurahan"],
      satuan: "Desa",
      icon: "MapPin",
    },
    asn: {
      label: "Jumlah ASN",
      keywords: ["asn", "pns", "aparatur", "pegawai"],
      satuan: "Orang",
      icon: "Briefcase",
    },
  };

  const stats: StatistikDaerah[] = [];

  for (const [, kpi] of Object.entries(kpiMap)) {
    const matching = records.find((r) => {
      const nama = r.nama_dssd?.toLowerCase() ?? "";
      return kpi.keywords.some((kw) => nama.includes(kw));
    });

    if (matching) {
      const rawNilai = parseFloat(String(matching.nilai ?? "0").replace(/[^0-9.-]/g, "")) || 0;
      stats.push({
        label: kpi.label,
        nilai: rawNilai,
        satuan: matching.satuan || kpi.satuan,
        trend: "stabil",
        icon: kpi.icon,
        kode_dssd: matching.kode_dssd,
        tahun: matching.tahun,
      });
    }
  }

  return stats;
}

// Buat trend data dari multiple records (by tahun)
export function buildTrendData(records: DssdRecord[], kode: string): TrendData[] {
  return records
    .filter((r) => r.kode_dssd === kode && r.tahun && r.nilai !== null)
    .map((r) => ({
      periode: String(r.tahun),
      nilai: parseFloat(String(r.nilai ?? "0").replace(/[^0-9.-]/g, "")) || 0,
      label: r.kecamatan_nama ?? "Kabupaten",
    }))
    .sort((a, b) => String(a.periode).localeCompare(String(b.periode)));
}

// Heatmap data untuk peta
export function buildHeatmapData(
  records: DssdRecord[],
  kecamatanCoords: Record<string, [number, number]>
) {
  const grouped = records.reduce(
    (acc, r) => {
      const k = r.kecamatan_nama;
      if (!k) return acc;
      if (!acc[k]) acc[k] = { count: 0, values: [] };
      acc[k].count++;
      if (r.nilai !== null && r.nilai !== undefined) {
        acc[k].values.push(parseFloat(String(r.nilai)) || 0);
      }
      return acc;
    },
    {} as Record<string, { count: number; values: number[] }>
  );

  return Object.entries(grouped).map(([nama, { count, values }]) => {
    const avg = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    const coords = kecamatanCoords[nama] ?? [1.1994, 124.5758];
    return { nama, count, avg, lat: coords[0], lng: coords[1] };
  });
}
