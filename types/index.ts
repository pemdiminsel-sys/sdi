// ============================================================
// Core Types - Portal Satu Data Indonesia Kabupaten Minahasa Selatan
// ============================================================

// ---- SIPD E-Walidata API Types ----
export interface DssdRecord {
  kode_dssd: string;
  nama_dssd: string;
  satuan: string;
  nilai: string | number | null;
  tahun: string | number;
  kecamatan_id?: string | null;
  kecamatan_nama?: string | null;
  kode_opd?: string | null;
  nama_opd?: string | null;
  jenis_data?: string | null;
  frekuensi?: string | null;
  sumber?: string | null;
  referensi?: string | null;
  [key: string]: unknown;
}

export interface SipdApiResponse {
  status: string | number;
  message?: string;
  data: DssdRecord[] | null;
  total?: number;
  meta?: {
    kodepemda: string;
    total_records: number;
    synced_at: string;
  };
}

// ---- Dataset Types ----
export interface Dataset {
  id: string;
  kode_dssd: string;
  nama: string;
  deskripsi?: string;
  kategori: DatasetKategori;
  opd_id?: string;
  opd_nama?: string;
  satuan?: string;
  frekuensi_update?: string;
  format_data: string[];
  klasifikasi_keamanan: "Publik" | "Terbatas" | "Rahasia";
  status: "Aktif" | "Draft" | "Nonaktif";
  total_records: number;
  last_updated: string;
  tags: string[];
  views: number;
  downloads: number;
  walidata?: string;
  produsen?: string;
  referensi?: string;
  standar_data?: string;
  definisi?: string;
  metadata?: DatasetMetadata;
}

export type DatasetKategori =
  | "Kependudukan"
  | "Pendidikan"
  | "Kesehatan"
  | "Kemiskinan"
  | "Infrastruktur"
  | "Ekonomi"
  | "Pertanian"
  | "Pemerintahan"
  | "Lingkungan"
  | "Sosial"
  | "Lainnya";

export interface DatasetMetadata {
  nama_data: string;
  produsen_data: string;
  walidata: string;
  frekuensi_update: string;
  referensi: string;
  format_data: string;
  standar_data: string;
  klasifikasi_keamanan: string;
  satuan: string;
  definisi: string;
  tahun_tersedia: string;
  metodologi?: string;
  catatan?: string;
}

// ---- OPD Types ----
export interface OPD {
  id: string;
  kode: string;
  nama: string;
  singkatan?: string;
  kepala?: string;
  alamat?: string;
  telepon?: string;
  email?: string;
  website?: string;
  total_dataset: number;
  dataset_aktif: number;
  last_sync?: string;
  status: "Aktif" | "Nonaktif";
}

// ---- Dashboard / Statistik Types ----
export interface StatistikDaerah {
  label: string;
  nilai: number;
  satuan: string;
  perubahan?: number; // percentage change
  trend?: "naik" | "turun" | "stabil";
  icon?: string;
  kode_dssd?: string;
  tahun?: string | number;
}

export interface DashboardStats {
  total_dataset: number;
  total_opd: number;
  total_api: number;
  total_records: number;
  last_sync: string;
  by_kategori: Record<DatasetKategori, number>;
}

// ---- Kecamatan / Wilayah Types ----
export interface Kecamatan {
  id: string;
  kode: string;
  nama: string;
  jumlah_desa: number;
  luas_km2?: number;
  penduduk?: number;
  koordinat?: [number, number];
  bounds?: [[number, number], [number, number]];
  indikator?: Record<string, number | string>;
}

// ---- User & Auth Types ----
export type UserRole = "super_admin" | "walidata" | "admin_opd" | "viewer";

export interface AppUser {
  id: string;
  email: string;
  nama: string;
  role: UserRole;
  opd_id?: string;
  opd_nama?: string;
  avatar_url?: string;
  last_login?: string;
  is_active: boolean;
}

// ---- API Response Wrapper ----
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  meta?: {
    total?: number;
    page?: number;
    per_page?: number;
    last_page?: number;
    source?: string;
    cached?: boolean;
    synced_at?: string;
  };
}

// ---- Analytics Types ----
export interface TrendData {
  periode: string;
  nilai: number;
  label?: string;
}

export interface AiInsight {
  id: string;
  type: "warning" | "info" | "success" | "anomaly";
  kategori: string;
  judul: string;
  deskripsi: string;
  nilai?: number;
  perubahan?: number;
  generated_at: string;
  priority: "high" | "medium" | "low";
}

// ---- Audit Log Types ----
export interface AuditLog {
  id: string;
  user_id?: string;
  user_email?: string;
  action: string;
  resource: string;
  resource_id?: string;
  detail?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// ---- Notification Types ----
export interface Notification {
  id: string;
  user_id: string;
  judul: string;
  pesan: string;
  type: "info" | "warning" | "success" | "error";
  is_read: boolean;
  link?: string;
  created_at: string;
}

// ---- Filter & Pagination ----
export interface FilterParams {
  search?: string;
  kategori?: DatasetKategori;
  opd_id?: string;
  kecamatan_id?: string;
  tahun?: string;
  status?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface PaginationMeta {
  total: number;
  page: number;
  per_page: number;
  last_page: number;
}
