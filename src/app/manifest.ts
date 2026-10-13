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
    icons: [{ src: "/images/TwoToneLogo.jpg", sizes: "536x715", type: "image/jpeg", purpose: "any" }],
  };
}
