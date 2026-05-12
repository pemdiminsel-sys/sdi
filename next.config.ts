import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "sipd.go.id" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization, X-API-Key" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
  // Transpile ECharts
  transpilePackages: ["echarts", "zrender"],
  async redirects() {
    return [
      { source: "/dashboard/datasets", destination: "/admin/datasets", permanent: true },
      { source: "/dashboard/users", destination: "/admin/users", permanent: true },
      { source: "/dashboard/settings", destination: "/admin/settings", permanent: true },
      { source: "/dashboard/sync", destination: "/admin/sync", permanent: true },
      { source: "/dashboard/logs", destination: "/admin/logs", permanent: true },
      { source: "/dashboard/opd", destination: "/dashboard", permanent: false }, // Map to main dashboard
    ];
  },
};

export default nextConfig;
