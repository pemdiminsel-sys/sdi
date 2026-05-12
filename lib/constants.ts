// ============================================================
// Application Constants
// ============================================================

export const APP_CONFIG = {
  name: "Portal Satu Data Indonesia",
  subtitle: "Kabupaten Minahasa Selatan",
  version: "1.0.0",
  kodepemda: "7105",
  region: {
    name: "Kabupaten Minahasa Selatan",
    provinsi: "Sulawesi Utara",
    ibu_kota: "Amurang",
    koordinat: { lat: 1.1994, lng: 124.5758 },
    zoom: 11,
  },
} as const;

export const SIPD_API = {
  baseUrl: process.env.SIPD_API_BASE_URL ?? "https://sipd.go.id/ewalidata/serv",
  apiKey: process.env.SIPD_API_KEY ?? "305fa0301f57152fb2fe1ee9b970a354",
  kodepemda: process.env.SIPD_KODEPEMDA ?? "7105",
  endpoints: {
    dssd: "/get_dssd",
  },
  timeout: 8000,   // 8 detik - cukup untuk network normal
  retryCount: 2,
  retryDelay: 1000,
} as const;

export const CACHE_TTL = {
  short: parseInt(process.env.CACHE_TTL_SHORT ?? "300"),    // 5 menit
  medium: parseInt(process.env.CACHE_TTL_MEDIUM ?? "3600"), // 1 jam
  long: parseInt(process.env.CACHE_TTL_LONG ?? "86400"),    // 24 jam
} as const;

export const KATEGORI_DATASET = [
  "Kependudukan",
  "Pendidikan",
  "Kesehatan",
  "Kemiskinan",
  "Infrastruktur",
  "Ekonomi",
  "Pertanian",
  "Pemerintahan",
  "Lingkungan",
  "Sosial",
  "Lainnya",
] as const;

export const KECAMATAN_MINSEL = [
  { id: "710501", kode: "710501", nama: "Amurang" },
  { id: "710502", kode: "710502", nama: "Amurang Barat" },
  { id: "710503", kode: "710503", nama: "Amurang Timur" },
  { id: "710504", kode: "710504", nama: "Tareran" },
  { id: "710505", kode: "710505", nama: "Sulta" },
  { id: "710506", kode: "710506", nama: "Tenga" },
  { id: "710507", kode: "710507", nama: "Kumelembuai" },
  { id: "710508", kode: "710508", nama: "Motoling" },
  { id: "710509", kode: "710509", nama: "Motoling Barat" },
  { id: "710510", kode: "710510", nama: "Motoling Timur" },
  { id: "710511", kode: "710511", nama: "Sinonsayang" },
  { id: "710512", kode: "710512", nama: "Tompaso Baru" },
  { id: "710513", kode: "710513", nama: "Tompaso Baru Barat" },
  { id: "710514", kode: "710514", nama: "Maesaan" },
  { id: "710515", kode: "710515", nama: "Ranoyapo" },
  { id: "710516", kode: "710516", nama: "Modoinding" },
  { id: "710517", kode: "710517", nama: "Tompasobaru" },
] as const;

export const OPD_LIST = [
  "Dinas Pendidikan",
  "Dinas Kesehatan",
  "Dinas PUPR",
  "Dinas Sosial",
  "Dinas Pertanian",
  "Dinas Kependudukan dan Catatan Sipil",
  "Badan Perencanaan Pembangunan Daerah",
  "Dinas Pemberdayaan Masyarakat dan Desa",
  "Dinas Komunikasi dan Informatika",
  "Badan Keuangan Daerah",
  "Dinas Tenaga Kerja",
  "Dinas Pariwisata",
  "Dinas Lingkungan Hidup",
  "Dinas Perhubungan",
  "Dinas Perikanan",
  "Dinas Peternakan",
  "Badan Kepegawaian Daerah",
  "Sekretariat Daerah",
] as const;

// Keyword mapping untuk kategorisasi dataset dari SIPD
export const KATEGORI_KEYWORDS: Record<string, string[]> = {
  Kependudukan: ["penduduk", "jiwa", "kk", "rumah tangga", "demografi", "kelahiran", "kematian", "migrasi", "usia", "gender", "laki", "perempuan"],
  Pendidikan: ["sekolah", "siswa", "guru", "pendidikan", "belajar", "sd", "smp", "sma", "universitas", "paud", "tk", "akreditasi", "ipq", "melek"],
  Kesehatan: ["kesehatan", "puskesmas", "rumah sakit", "dokter", "pasien", "gizi", "stunting", "imunisasi", "balita", "lansia", "nakes", "obat"],
  Kemiskinan: ["miskin", "kemiskinan", "dtks", "bansos", "pkh", "blt", "bpnt", "raskin", "pgb", "rentan", "dhuafa"],
  Infrastruktur: ["jalan", "jembatan", "air bersih", "sanitasi", "listrik", "infrastruktur", "irigasi", "drainase", "bangunan", "gedung", "perumahan"],
  Ekonomi: ["apbd", "pajak", "retribusi", "investasi", "umkm", "usaha", "ekonomi", "pendapatan", "belanja", "inflasi", "pdrb"],
  Pertanian: ["pertanian", "padi", "sawah", "kebun", "panen", "produksi", "petani", "tanaman", "lahan", "komoditi"],
  Pemerintahan: ["asn", "pns", "aparatur", "opd", "kecamatan", "desa", "kelurahan", "layanan", "pelayanan", "perizinan"],
  Lingkungan: ["lingkungan", "sampah", "limbah", "polusi", "hutan", "lahan", "iklim", "bencana", "banjir", "longsor"],
  Sosial: ["sosial", "disabilitas", "lansia", "anak", "perempuan", "agama", "budaya", "adat", "komunitas", "narkoba"],
};

export const USER_ROLES = {
  super_admin: { label: "Super Admin", color: "red" },
  walidata: { label: "Walidata", color: "blue" },
  admin_opd: { label: "Admin OPD", color: "green" },
  viewer: { label: "Viewer Publik", color: "gray" },
} as const;

export const CHART_COLORS = {
  primary: ["#C41E3A", "#8B1A2E", "#6B1425"],
  secondary: ["#1E3A5F", "#2E4A7F", "#3E5A9F"],
  accent: ["#D4A017", "#E8B520", "#F5C842"],
  success: ["#2ECC71", "#27AE60", "#1E8449"],
  warning: ["#F39C12", "#D68910", "#B7770D"],
  danger: ["#E74C3C", "#C0392B", "#A93226"],
  neutral: ["#95A5A6", "#7F8C8D", "#626567"],
} as const;
