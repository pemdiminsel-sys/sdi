import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Info, Shield, Mail } from "lucide-react";

export default async function StaticPages({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const content: Record<string, any> = {
    tentang: {
      title: "Tentang Portal",
      icon: <Info size={32} className="text-red-500" />,
      text: "Portal Satu Data Indonesia Kabupaten Minahasa Selatan adalah wadah resmi pemanfaatan data indikator pembangunan yang dikelola secara terintegrasi antara Pemerintah Kabupaten Minahasa Selatan dengan SIPD E-Walidata Kemendagri."
    },
    kebijakan: {
      title: "Kebijakan Privasi",
      icon: <Shield size={32} className="text-red-500" />,
      text: "Data yang dipublikasikan melalui portal ini bersifat terbuka untuk publik (Open Data) sesuai dengan standar Satu Data Indonesia. Kami berkomitmen untuk menjaga integritas dan akurasi data sesuai peraturan yang berlaku."
    },
    kontak: {
      title: "Hubungi Kami",
      icon: <Mail size={32} className="text-red-500" />,
      text: "Diskominfo Kabupaten Minahasa Selatan\nAlamat: Kompleks Perkantoran Pemerintah Kabupaten Minahasa Selatan\nEmail: kominfo@minsel.go.id"
    }
  };

  const page = content[slug] || { title: "Halaman Tidak Ditemukan", text: "Maaf, halaman yang Anda cari tidak tersedia." };

  return (
    <main className="min-h-screen flex flex-col bg-[#070e1c]">
      <Navbar />
      <div className="flex-1 flex items-center justify-center pt-20 px-4">
        <div className="max-w-3xl w-full glass-card p-12 text-center animate-fade-in-up">
          <div className="flex justify-center mb-6">{page.icon}</div>
          <h1 className="text-3xl font-black text-white mb-6 uppercase tracking-tighter">{page.title}</h1>
          <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{page.text}</p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
