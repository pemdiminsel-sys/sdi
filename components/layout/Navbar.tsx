"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Database, LayoutDashboard, Map, FileText, Settings,
  Menu, X, Bell, Search, ChevronDown, Zap, Globe, BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_CONFIG } from "@/lib/constants";

const navItems = [
  { href: "/", label: "Beranda", icon: Globe },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/datasets", label: "Dataset", icon: Database },
  { href: "/maps", label: "Peta", icon: Map },
  { href: "/infografis", label: "Infografis", icon: BarChart3 },
  { href: "/api-docs", label: "API", icon: FileText },
  { href: "/ranking-fb-minsel.html", label: "Ranking FB", icon: Globe },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    
    // Check if user is admin (client-side)
    setIsAdmin(document.cookie.includes("sdi-admin-session=true"));
    
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const filteredNavItems = isAdmin 
    ? navItems 
    : navItems.filter(item => item.href !== "/dashboard");

  return (
    <>
      <nav
        className={cn(
          "navbar transition-all duration-300",
          scrolled ? "shadow-lg shadow-black/30" : ""
        )}
        style={{ height: "64px" }}
      >
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center animate-pulse-glow"
              style={{ background: "linear-gradient(135deg, #C41E3A, #9F1239)" }}
            >
              <Zap size={18} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-bold text-white leading-tight">SDI Minsel</div>
              <div className="text-xs text-slate-400 leading-tight">Minahasa Selatan</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {filteredNavItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                  pathname === href
                    ? "bg-red-900/30 text-red-400 border border-red-800/40"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon size={14} />
                {label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Cari"
            >
              <Search size={16} />
            </button>
            <button
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors relative"
              aria-label="Notifikasi"
            >
              <Bell size={16} />
              <span
                className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                style={{ background: "#C41E3A" }}
              />
            </button>
            {isAdmin && (
              <Link
                href="/dashboard"
                className="btn-primary hidden sm:inline-flex text-xs py-1.5 px-3"
              >
                <LayoutDashboard size={13} />
                Dashboard
              </Link>
            )}
            {/* Mobile toggle */}
            <button
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        {searchOpen && (
          <div className="absolute top-16 left-0 right-0 px-4 py-3 border-t border-white/5"
            style={{ background: "rgba(15,23,42,0.97)", backdropFilter: "blur(20px)" }}
          >
            <div className="max-w-2xl mx-auto relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                autoFocus
                placeholder="Cari dataset, indikator, OPD..."
                className="input-field pl-9"
                onKeyDown={(e) => {
                  if (e.key === "Escape") setSearchOpen(false);
                  if (e.key === "Enter") {
                    window.location.href = `/datasets?search=${encodeURIComponent((e.target as HTMLInputElement).value)}`;
                  }
                }}
              />
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ top: "64px" }}
        >
          <div
            className="absolute inset-0"
            style={{ background: "rgba(7,14,28,0.95)", backdropFilter: "blur(20px)" }}
          >
            <div className="p-4 flex flex-col gap-2">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all",
                    pathname === href
                      ? "bg-red-900/30 text-red-400"
                      : "text-slate-300 hover:bg-white/5"
                  )}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              ))}
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="btn-primary mt-4 justify-center"
              >
                <LayoutDashboard size={16} />
                Buka Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
