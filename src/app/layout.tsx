import type { Metadata, Viewport } from "next";
import { Inter, Montserrat, Playfair_Display } from "next/font/google";
import { cafe, creatorBrand } from "@/lib/brand";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin"], weight: ["600", "700", "800", "900"], display: "swap" });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], weight: ["700"], style: ["italic"], display: "swap" });

const description = `${cafe.tagline} Order kotas, chips, platters & braai essentials online and check out on WhatsApp.`;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: `${cafe.name} — Order Online | by DrMcGi`, template: `%s | ${cafe.name}` },
  description,
  applicationName: cafe.name,
  authors: [{ name: "DrMcGi", url: creatorBrand.website }],
  creator: "DrMcGi",
  publisher: creatorBrand.company,
  keywords: ["Two Tone Café", "kota", "chips", "platters", "order online", "WhatsApp ordering", "DrMcGi"],
  openGraph: {
    type: "website",
    title: `${cafe.name} — Order Online`,
    description,
    siteName: cafe.name,
    images: [{ url: "/images/platter1.jpg", width: 720, height: 960, alt: `${cafe.name} food platter` }],
  },
  twitter: { card: "summary_large_image", title: `${cafe.name} — Order Online`, description, images: ["/images/platter1.jpg"] },
  appleWebApp: { capable: true, title: cafe.shortName, statusBarStyle: "black-translucent" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#070b0a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable} ${playfair.variable} antialiased`}>
      <body className="grain min-h-dvh overflow-x-hidden">{children}</body>
    </html>
  );
}
