"use client";

import { useEffect, useRef } from "react";
import { APP_CONFIG } from "@/lib/constants";

interface LeafletMapProps {
  layer?: "default" | "heatmap";
  onKecamatanSelect?: (nama: string) => void;
}

export default function LeafletMap({ layer = "default", onKecamatanSelect }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<unknown>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    let map: any = null;

    // Dynamic Leaflet import
    import("leaflet").then((L) => {
      // Check if component is still mounted and container exists
      if (!mapRef.current) return;
      
      // If map already exists on this container, don't re-initialize
      // Leaflet attaches a property to the container when initialized
      if ((mapRef.current as any)._leaflet_id) return;

      // Fix Leaflet default icon
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      map = L.map(mapRef.current, {
        center: [APP_CONFIG.region.koordinat.lat, APP_CONFIG.region.koordinat.lng],
        zoom: APP_CONFIG.region.zoom,
        zoomControl: true,
        attributionControl: true,
      });

      // Dark tile layer
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      // Add marker for Kabupaten center (Amurang)
      const marker = L.marker([APP_CONFIG.region.koordinat.lat, APP_CONFIG.region.koordinat.lng], {
        title: "Ibu Kota: " + APP_CONFIG.region.ibu_kota,
      }).addTo(map);

      marker.bindPopup(
        `<div style="font-family:sans-serif; min-width:160px;">
          <div style="font-weight:700; color:#f43f5e; font-size:13px;">📍 ${APP_CONFIG.region.ibu_kota}</div>
          <div style="color:#94a3b8; font-size:11px; margin-top:4px;">Ibu Kota ${APP_CONFIG.region.name}</div>
          <div style="color:#64748b; font-size:11px;">Kodepemda: ${APP_CONFIG.kodepemda}</div>
        </div>`,
        { className: "custom-popup" }
      );

      // Sample kecamatan circles
      const kecamatanData = [
        { nama: "Amurang", lat: 1.1994, lng: 124.5758, count: 145 },
        { nama: "Tenga", lat: 1.1200, lng: 124.5200, count: 98 },
        { nama: "Motoling", lat: 1.0800, lng: 124.4800, count: 82 },
        { nama: "Sinonsayang", lat: 1.2500, lng: 124.4500, count: 76 },
        { nama: "Tompaso Baru", lat: 1.0500, lng: 124.5500, count: 91 },
        { nama: "Modoinding", lat: 1.0200, lng: 124.4200, count: 67 },
        { nama: "Maesaan", lat: 1.0900, lng: 124.5100, count: 88 },
      ];

      kecamatanData.forEach(({ nama, lat, lng, count }) => {
        const radius = layer === "heatmap" ? Math.max(count * 20, 1000) : 800;
        const circle = L.circle([lat, lng], {
          color: "#C41E3A",
          fillColor: "#C41E3A",
          fillOpacity: layer === "heatmap" ? 0.25 : 0.1,
          weight: 1.5,
          radius,
        }).addTo(map);

        circle.bindPopup(
          `<div style="font-family:sans-serif; min-width:140px;">
            <div style="font-weight:700; color:#f43f5e; font-size:13px;">${nama}</div>
            <div style="color:#94a3b8; font-size:11px; margin-top:4px;">Kecamatan</div>
            <div style="color:#e2e8f0; font-size:12px; margin-top:6px; font-weight:600;">${count} Indikator</div>
          </div>`
        );

        circle.on("click", () => {
          onKecamatanSelect?.(nama);
        });
      });

      mapInstance.current = map;

      // Load Leaflet CSS only if not already loaded
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }
    });

    return () => {
      if (map) {
        map.remove();
      }
      if (mapInstance.current) {
        (mapInstance.current as any).remove();
        mapInstance.current = null;
      }
    };
  }, [layer, onKecamatanSelect]);

  return (
    <div
      ref={mapRef}
      style={{ height: "520px", width: "100%", borderRadius: "1rem" }}
    />
  );
}
