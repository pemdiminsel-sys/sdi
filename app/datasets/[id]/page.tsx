import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DatasetDetailClient from "@/components/datasets/DatasetDetailClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Dataset ${id} – SDI Minsel`,
    description: `Detail dataset ${id} dari Portal Satu Data Indonesia Kabupaten Minahasa Selatan`,
  };
}

export default async function DatasetDetailPage({ params }: Props) {
  const { id } = await params;
  return (
    <main className="min-h-screen" style={{ background: "#0f172a" }}>
      <Navbar />
      <div style={{ paddingTop: "64px" }}>
        <DatasetDetailClient id={id} />
      </div>
      <Footer />
    </main>
  );
}
