import type { MetadataRoute } from "next";
import { cafe } from "@/lib/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${cafe.name} — Order Online`,
    short_name: cafe.shortName,
    description: cafe.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#070b0a",
    theme_color: "#070b0a",
    icons: [
      { src: "/brand/two-tone-logo.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
