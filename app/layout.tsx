import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import Providers from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Portal Satu Data Indonesia - Kabupaten Minahasa Selatan",
    template: "%s | SDI Minahasa Selatan",
  },
  description:
    "Platform Open Data, Dashboard Pemerintah Daerah, dan API Gateway berbasis standar Satu Data Indonesia (SDI) dan SPBE untuk Kabupaten Minahasa Selatan.",
  keywords: ["Satu Data Indonesia", "Open Data", "Minahasa Selatan", "SPBE", "Dashboard Pemerintah"],
  authors: [{ name: "Pemerintah Kabupaten Minahasa Selatan" }],
  creator: "Dinas Komunikasi dan Informatika Kabupaten Minahasa Selatan",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "id_ID",
    title: "Portal Satu Data Indonesia - Kabupaten Minahasa Selatan",
    description: "Platform Open Data Enterprise berbasis standar Satu Data Indonesia",
    siteName: "SDI Minsel",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#C41E3A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Providers>
          {children}
          <Toaster
            theme="dark"
            position="top-right"
            toastOptions={{
              style: {
                background: "rgba(30, 41, 41, 0.95)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#e2e8f0",
                backdropFilter: "blur(12px)",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
