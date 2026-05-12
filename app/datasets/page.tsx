import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DatasetPortal from "@/components/datasets/DatasetPortal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portal Dataset",
  description: "Jelajahi ribuan dataset publik Kabupaten Minahasa Selatan dari SIPD E-Walidata.",
};

export default function DatasetsPage() {
  return (
    <main className="min-h-screen" style={{ background: "#0f172a" }}>
      <Navbar />
      <div style={{ paddingTop: "64px" }}>
        <DatasetPortal />
      </div>
      <Footer />
    </main>
  );
}
