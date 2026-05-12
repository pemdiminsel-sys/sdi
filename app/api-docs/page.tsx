import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ApiDocsClient from "@/components/api/ApiDocsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Gateway & Dokumentasi",
  description: "Dokumentasi REST API Portal Satu Data Indonesia Kabupaten Minahasa Selatan.",
};

export default function ApiDocsPage() {
  return (
    <main className="min-h-screen" style={{ background: "#0f172a" }}>
      <Navbar />
      <div style={{ paddingTop: "64px" }}>
        <ApiDocsClient />
      </div>
      <Footer />
    </main>
  );
}
