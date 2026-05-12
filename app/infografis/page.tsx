import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
  BarChart3, 
  TrendingDown, 
  TrendingUp, 
  Heart, 
  GraduationCap, 
  Home, 
  Zap, 
  Users,
  Calendar,
  Download
} from "lucide-react";

export default function InfografisPage() {
  const stats = [
    { 
      title: "Kesehatan Masyarakat", 
      value: "92%", 
      desc: "Cakupan Jaminan Kesehatan Daerah", 
      icon: <Heart className="text-red-500" size={32} />,
      trend: "Naik 4% dari tahun lalu",
      trendIcon: <TrendingUp size={14} className="text-green-500" />,
      color: "from-red-500/20 to-transparent"
    },
    { 
      title: "Pendidikan Dasar", 
      value: "98.5%", 
      desc: "Angka Partisipasi Sekolah Dasar", 
      icon: <GraduationCap className="text-blue-500" size={32} />,
      trend: "Stabil",
      trendIcon: <TrendingUp size={14} className="text-blue-500" />,
      color: "from-blue-500/20 to-transparent"
    },
    { 
      title: "Infrastruktur Desa", 
      value: "84km", 
      desc: "Pembangunan Jalan Desa Baru", 
      icon: <Home className="text-amber-500" size={32} />,
      trend: "Target: 100km",
      trendIcon: <TrendingUp size={14} className="text-amber-500" />,
      color: "from-amber-500/20 to-transparent"
    },
    { 
      title: "Energi & Listrik", 
      value: "99.1%", 
      desc: "Rasio Elektrifikasi Rumah Tangga", 
      icon: <Zap className="text-yellow-500" size={32} />,
      trend: "Mendekati 100%",
      trendIcon: <TrendingUp size={14} className="text-yellow-500" />,
      color: "from-yellow-500/20 to-transparent"
    }
  ];

  return (
    <main className="min-h-screen bg-[#070e1c]">
      <Navbar />
      
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest">
              <BarChart3 size={14} />
              Wawasan Publik
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">
              Infografis <span className="text-red-600">Minsel</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Memahami kemajuan Kabupaten Minahasa Selatan melalui data visual yang sederhana dan transparan untuk seluruh masyarakat.
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {stats.map((item, i) => (
              <div 
                key={i}
                className={`relative group overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] p-8 transition-all hover:bg-white/[0.04] hover:border-red-500/30`}
              >
                {/* Accent Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-30`}></div>
                
                <div className="relative z-10 flex items-start justify-between">
                  <div className="space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#0f172a] border border-white/10 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                      <p className="text-sm text-slate-500 font-medium">{item.desc}</p>
                    </div>
                    <div className="flex items-center gap-6 pt-2">
                      <div className="text-4xl font-black text-white tracking-tighter">{item.value}</div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Tren
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          {item.trendIcon}
                          <span className="text-xs font-bold text-slate-300">{item.trend}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button className="p-3 rounded-full bg-white/5 text-slate-500 hover:text-white hover:bg-red-600 transition-all shadow-xl border border-white/5">
                    <Download size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Banner */}
          <div className="mt-12 glass-card p-8 bg-gradient-to-r from-red-900/20 to-blue-900/10 border-red-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg shadow-red-900/40">
                <Users size={24} className="text-white" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white italic">"Data yang Akurat, Masyarakat yang Sejahtera"</h4>
                <p className="text-xs text-slate-400">Pemerintah Kabupaten Minahasa Selatan terus berkomitmen dalam keterbukaan informasi.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-slate-500 text-xs font-mono">
              <Calendar size={14} />
              Pembaruan Terakhir: 12 Mei 2026
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
