// ============================================================
// SIPD E-Walidata API Service
// Real data fetching from sipd.go.id with retry, caching,
// and offline fallback demo data
// ============================================================

import type { DssdRecord, SipdApiResponse } from "@/types";
import { SIPD_API, OPD_LIST, KATEGORI_DATASET, KECAMATAN_MINSEL } from "@/lib/constants";
import { supabaseAdmin } from "@/lib/supabase";

// In-memory cache (server-side)
const memCache = new Map<string, { data: unknown; expires: number }>();

function getCached<T>(key: string): T | null {
  const entry = memCache.get(key);
  if (entry && entry.expires > Date.now()) {
    return entry.data as T;
  }
  memCache.delete(key);
  return null;
}

function setCache<T>(key: string, data: T, ttlSeconds: number): void {
  memCache.set(key, { data, expires: Date.now() + ttlSeconds * 1000 });
}

// Fetch with retry and exponential backoff
async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries: number = SIPD_API.retryCount,
  delay: number = SIPD_API.retryDelay
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SIPD_API.timeout);

  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeout);
    return res;
  } catch (err: unknown) {
    clearTimeout(timeout);
    if (retries <= 0) throw err;
    await new Promise((r) => setTimeout(r, delay));
    return fetchWithRetry(url, options, retries - 1, delay * 2);
  }
}

// ---- Main API Service ----
export const sipdService = {
  /**
   * Fetch semua data DSSD dari API SIPD.
   * Jika API gagal, gunakan fallback demo data agar aplikasi tetap berjalan.
   */
  async getDssd(ttlSeconds = 3600): Promise<DssdRecord[]> {
    const cacheKey = `sipd:dssd:${SIPD_API.kodepemda}`;

    const cached = getCached<DssdRecord[]>(cacheKey);
    if (cached) return cached;

    const url = `${SIPD_API.baseUrl}${SIPD_API.endpoints.dssd}?kodepemda=${SIPD_API.kodepemda}`;

    try {
      const res = await fetchWithRetry(url, {
        headers: {
          Authorization: `Bearer ${SIPD_API.apiKey}`,
          "X-Api-Key": SIPD_API.apiKey,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        next: { revalidate: ttlSeconds },
      });

      if (res.ok) {
        const json: SipdApiResponse = await res.json();
        const records: DssdRecord[] = json.data ?? [];
        if (records.length > 0) {
          setCache(cacheKey, records, ttlSeconds);
          return records;
        }
      }
    } catch (err) {
      console.error("[API FETCH ERROR]", err);
      // API tidak tersedia — return array kosong tanpa demo data
      return [];
    }

    return [];
  },

  /**
   * Invalidate cache DSSD
   */
  invalidateCache(): void {
    const key = `sipd:dssd:${SIPD_API.kodepemda}`;
    memCache.delete(key);
  },

  /**
   * Get statistik ringkasan dari data DSSD
   */
  async getSummaryStats(records: DssdRecord[]) {
    const opdSet = new Set<string>();
    const kecSet = new Set<string>();
    const kodeSet = new Set<string>();

    for (const r of records) {
      if (r.nama_opd) opdSet.add(r.nama_opd);
      if (r.kecamatan_nama) kecSet.add(r.kecamatan_nama);
      if (r.kode_dssd) kodeSet.add(r.kode_dssd);
    }

    return {
      total_records: records.length,
      total_opd: opdSet.size,
      total_kecamatan: kecSet.size,
      total_indikator: kodeSet.size,
      opd_list: Array.from(opdSet),
      kecamatan_list: Array.from(kecSet),
    };
  },

  /**
   * Filter records berdasarkan kata kunci
   */
  filterByKeywords(records: DssdRecord[], keywords: string[]): DssdRecord[] {
    const lower = keywords.map((k) => k.toLowerCase());
    return records.filter((r) => {
      const searchText = `${r.nama_dssd} ${r.kode_dssd} ${r.nama_opd ?? ""}`.toLowerCase();
      return lower.some((kw) => searchText.includes(kw));
    });
  },

  /**
   * Group records berdasarkan OPD
   */
  groupByOpd(records: DssdRecord[]): Record<string, DssdRecord[]> {
    return records.reduce(
      (acc, record) => {
        const opd = record.nama_opd ?? "Tidak Diketahui";
        if (!acc[opd]) acc[opd] = [];
        acc[opd].push(record);
        return acc;
      },
      {} as Record<string, DssdRecord[]>
    );
  },

  /**
   * Group records berdasarkan Kecamatan
   */
  groupByKecamatan(records: DssdRecord[]): Record<string, DssdRecord[]> {
    return records.reduce(
      (acc, record) => {
        const kec = record.kecamatan_nama ?? "Kabupaten";
        if (!acc[kec]) acc[kec] = [];
        acc[kec].push(record);
        return acc;
      },
      {} as Record<string, DssdRecord[]>
    );
  },

  /**
   * Sync data DSSD ke database Supabase secara otomatis.
   * Melakukan upsert berdasarkan kode_dssd dan kecamatan_kode.
   */
  async syncToDatabase(): Promise<{ success: boolean; count: number; error?: string }> {
    try {
      const records = await this.getDssd(0); // Ambil data segar
      
      if (!records || records.length === 0) {
        return { success: false, count: 0, error: "Tidak ada data untuk disinkronkan" };
      }

      // Map data ke format tabel 'datasets'
      const dataToUpsert = records.map(r => ({
        kode_dssd: r.kode_dssd,
        nama_dssd: r.nama_dssd,
        satuan: r.satuan,
        tahun: r.tahun,
        nilai: r.nilai,
        nama_opd: r.nama_opd,
        kecamatan_kode: r.kecamatan_kode,
        kecamatan_nama: r.kecamatan_nama,
        status_data: r.status_data,
        kategori: r.kategori,
        last_synced: new Date().toISOString()
      }));

      // Eksekusi upsert massal (batching untuk performa)
      const { error } = await supabaseAdmin
        .from("datasets")
        .upsert(dataToUpsert, { 
          onConflict: "kode_dssd,kecamatan_kode",
          ignoreDuplicates: false 
        });

      if (error) throw error;

      return { success: true, count: records.length };
    } catch (err: any) {
      console.error("[SYNC ERROR]", err);
      return { success: false, count: 0, error: err.message };
    }
  },

  /**
   * Ambil data datasets dari database Supabase (hasil sinkronisasi).
   */
  async getDatasetsFromDb(options?: { kategori?: string; search?: string }) {
    try {
      let query = supabaseAdmin
        .from("datasets")
        .select("*")
        .order("last_synced", { ascending: false });

      if (options?.kategori && options.kategori !== "Semua") {
        query = query.eq("kategori", options.kategori);
      }

      if (options?.search) {
        query = query.ilike("nama_dssd", `%${options.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (err) {
      // DB gagal atau kosong, kembalikan array kosong (dummy sudah dihapus)
      return [];
    }
  },

  /**
   * Ambil detail satu dataset dari DB.
   */
  async getDatasetDetail(kode: string) {
    const { data, error } = await supabaseAdmin
      .from("datasets")
      .select("*")
      .eq("kode_dssd", kode)
      .single();
    
    if (error) return null;
    return data;
  },
};
