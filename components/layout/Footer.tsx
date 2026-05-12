import Link from "next/link";
import { Zap } from "lucide-react";
import { APP_CONFIG } from "@/lib/constants";

export default function Footer() {
  return (
    <footer
      className="border-t"
      style={{ background: "#07111e", borderColor: "rgba(255,255,255,0.06)" }}
    >
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#C41E3A,#9F1239)" }}
              >
                <Zap size={16} className="text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">SDI Minsel</div>
                <div className="text-xs text-slate-500">Portal Satu Data Indonesia</div>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Platform Open Data dan Analitik Enterprise untuk Kabupaten Minahasa Selatan.
              Berbasis standar Satu Data Indonesia (SDI) dan SPBE.
            </p>
            <div className="flex items-center gap-1 mt-4">
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: "#22c55e" }}
              />
              <span className="text-xs text-slate-500">Terhubung ke SIPD E-Walidata</span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Platform</h4>
            <ul className="space-y-2.5">
              {[
                { href: "/dashboard", label: "Dashboard" },
                { href: "/datasets", label: "Dataset" },
                { href: "/maps", label: "Peta Wilayah" },
                { href: "/api-docs", label: "API Gateway" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-slate-400 hover:text-red-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Informasi</h4>
            <ul className="space-y-2.5">
              {[
                { href: "/tentang", label: "Tentang SDI" },
                { href: "/kebijakan", label: "Kebijakan Data" },
                { href: "/kontak", label: "Kontak" },
                { href: "/admin", label: "Admin Login" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-slate-400 hover:text-red-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <p className="text-xs text-slate-600">
            © 2026 Pemerintah Kabupaten Minahasa Selatan. Hak Cipta Dilindungi.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-600">v1.0.0</span>
            <span
              className="text-xs px-2 py-0.5 rounded"
              style={{ background: "rgba(196,30,58,0.1)", color: "#fda4af" }}
            >
              Kodepemda: {APP_CONFIG.kodepemda}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
