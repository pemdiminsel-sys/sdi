import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import Footer from "@/components/layout/Footer";

export const dynamic = "force-dynamic";

// Short timeout for SSR — don't block page render waiting for slow API
async function fetchSummaryWithTimeout() {
  try {
    const { sipdService } = await import("@/services/sipd.service");
    const timeout = new Promise<null>((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), 5000)
    );
    const records = await Promise.race([sipdService.getDssd(3600), timeout]);
    if (!records) return null;
    return sipdService.getSummaryStats(records as Awaited<ReturnType<typeof sipdService.getDssd>>);
  } catch {
    return null; // graceful fallback — UI still renders
  }
}

export default async function HomePage() {
  const summary = await fetchSummaryWithTimeout();

  const safeSummary = {
    total_records: summary?.total_records ?? 0,
    total_opd: summary?.total_opd ?? 0,
    total_indikator: summary?.total_indikator ?? 0,
    total_kecamatan: summary?.total_kecamatan ?? 17,
  };

  return (
    <main className="min-h-screen" style={{ background: "linear-gradient(180deg,#07111e 0%,#0f172a 100%)" }}>
      <Navbar />
      <HeroSection summary={safeSummary} />
      <StatsSection summary={safeSummary} />
      <FeaturesSection />
      <Footer />
    </main>
  );
}

