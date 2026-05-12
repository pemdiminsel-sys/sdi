"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Database, Map, Search,
  Users, Activity, Building, Settings, LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/datasets", label: "Manajemen Dataset", icon: Database },
  { href: "/dashboard/analytics", label: "Analytics & AI", icon: Activity },
  { href: "/dashboard/opd", label: "Data OPD", icon: Building },
  { href: "/dashboard/users", label: "Pengguna", icon: Users },
  { href: "/dashboard/settings", label: "Pengaturan", icon: Settings },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "sidebar h-screen sticky top-0 flex flex-col transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
      <div className="h-16 flex items-center px-4 border-b border-white/5">
        <Link href="/" className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-red-600 to-red-900 shrink-0">
            <LayoutDashboard size={16} className="text-white" />
          </div>
          {!collapsed && (
            <div className="flex-1 whitespace-nowrap">
              <div className="text-sm font-bold text-white leading-tight">Command Center</div>
              <div className="text-xs text-slate-400">SDI Minsel</div>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {!collapsed && <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Menu Utama</div>}
        {sidebarLinks.map((link) => {
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                active
                  ? "bg-red-900/20 text-red-400"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
              title={collapsed ? link.label : undefined}
            >
              <link.icon size={18} className={cn("shrink-0", active ? "text-red-400" : "text-slate-500 group-hover:text-slate-300")} />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 mb-4 overflow-hidden">
          <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
            <span className="text-sm font-bold text-white">SA</span>
          </div>
          {!collapsed && (
            <div className="flex-1">
              <div className="text-sm font-semibold text-white">Super Admin</div>
              <div className="text-xs text-slate-400">Bappeda Minsel</div>
            </div>
          )}
        </div>
        {!collapsed ? (
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-sm font-medium transition-colors">
            <LogOut size={16} />
            Keluar
          </button>
        ) : (
          <button className="w-full flex items-center justify-center p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors" title="Keluar">
            <LogOut size={16} />
          </button>
        )}
      </div>
      
      {/* Collapse Toggle */}
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 z-10 hidden md:flex"
      >
        <span className={cn("text-xs transition-transform", collapsed ? "rotate-180" : "")}>◀</span>
      </button>
    </aside>
  );
}
