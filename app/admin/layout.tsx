"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  RefreshCw, 
  Users, 
  Settings, 
  ShieldCheck, 
  Database,
  ChevronRight,
  Bell,
  Search,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/admin" },
  { icon: RefreshCw, label: "Sync E-Walidata", href: "/admin/sync" },
  { icon: Database, label: "Data Management", href: "/admin/datasets" },
  { icon: Users, label: "User Accounts", href: "/admin/users" },
  { icon: ShieldCheck, label: "Audit Logs", href: "/admin/logs" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-[#070e1c] text-slate-200 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#0f172a]/80 backdrop-blur-xl flex flex-col">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center shadow-lg shadow-red-900/40 group-hover:scale-110 transition-transform">
              <span className="text-white font-black text-xs">SDI</span>
            </div>
            <div>
              <div className="text-sm font-bold text-white tracking-tight">ADMIN PANEL</div>
              <div className="text-[10px] text-slate-500 font-medium">Kab. Minahasa Selatan</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "sidebar-item",
                  isActive && "active"
                )}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
                {isActive && <ChevronRight size={14} className="ml-auto opacity-50" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-white/5">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5">
            <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center border border-white/10">
              <User size={18} className="text-slate-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">Admin Minsel</div>
              <div className="text-[10px] text-slate-500 truncate">admin@minsel.go.id</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-white/5 bg-[#0f172a]/40 backdrop-blur-md flex items-center justify-between px-8 z-10">
          <div className="relative w-96">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search admin modules..." 
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-xs focus:border-red-500/50 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg hover:bg-white/5 text-slate-400 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0f172a]"></span>
            </button>
            <div className="h-8 w-[1px] bg-white/5 mx-2"></div>
            <Link href="/" className="btn-secondary text-xs py-1.5 px-3">
              View Portal
            </Link>
          </div>
        </header>

        {/* Page Area */}
        <div className="flex-1 overflow-y-auto p-8 scrollbar-custom">
          {children}
        </div>
      </main>
    </div>
  );
}
