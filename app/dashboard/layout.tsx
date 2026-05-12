import DashboardSidebar from "@/components/layout/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#07111e]">
      <DashboardSidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header for Dashboard */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-slate-900/50 backdrop-blur-md sticky top-0 z-20">
          <h1 className="text-lg font-semibold text-white">Command Center</h1>
          <div className="flex items-center gap-3">
             <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400 border border-green-500/30">
               SIPD Connected
             </span>
          </div>
        </header>
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
