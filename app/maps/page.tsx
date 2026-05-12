import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MapClient from "@/components/maps/MapClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Peta Wilayah",
  description: "Visualisasi peta interaktif Kabupaten Minahasa Selatan dengan data per kecamatan.",
};

export default function MapsPage() {
  return (
    <main className="min-h-screen" style={{ background: "#0f172a" }}>
      <Navbar />
      <div style={{ paddingTop: "64px" }}>
        <MapClient />
      </div>
      <Footer />
    </main>
  );
}
