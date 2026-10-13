import { Hero } from "@/components/Hero";
import { MenuExplorer } from "@/components/MenuExplorer";
import { OrderPanel } from "@/components/OrderPanel";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ItemSheet } from "@/components/ItemSheet";
import { ReviewModal } from "@/components/ReviewModal";
import { BackToTop, CartDrawer, FloatingCartBar, Toast } from "@/components/CartChrome";
import { CartHydrator } from "@/components/CartHydrator";
import { CreatorCredit } from "@/components/CreatorCredit";
import { cafe, creatorBrand } from "@/lib/brand";
import { categories, extrasList, menuItems } from "@/lib/menu";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: cafe.name,
  servesCuisine: ["South African", "Kota", "Street food"],
  telephone: `+${cafe.whatsappNumber}`,
  email: cafe.plattersEmail.toLowerCase(),
  priceRange: "R25 – R1400",
  paymentAccepted: "Cash",
  hasMenu: {
    "@type": "Menu",
    hasMenuSection: categories.map((c) => ({
      "@type": "MenuSection",
      name: c.label,
      hasMenuItem: menuItems
        .filter((i) => i.category === c.id)
        .map((i) => ({
          "@type": "MenuItem",
          name: i.name,
          description: i.desc,
          offers: { "@type": "Offer", price: i.price, priceCurrency: "ZAR" },
          ...(c.id === "kota" && {
            menuAddOn: {
              "@type": "MenuSection",
              name: "Extras",
              hasMenuItem: extrasList.map((e) => ({
                "@type": "MenuItem",
                name: e.name,
                offers: { "@type": "Offer", price: e.price, priceCurrency: "ZAR" },
              })),
            },
          }),
        })),
    })),
  },
  creator: { "@type": "Organization", name: creatorBrand.company, url: creatorBrand.website },
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <SiteHeader />
      <main className="relative z-[2]">
        <Hero />
        <div className="mx-auto mt-8 grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-8 px-3 sm:px-6 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_380px]">
          <MenuExplorer />
          <aside id="order" tabIndex={-1} aria-label="Your order" className="hidden scroll-mt-24 outline-none lg:block">
            <div className="thin-scrollbar sticky top-[88px] max-h-[calc(100dvh-104px)] overflow-y-auto rounded-3xl border border-white/[0.08] bg-surface/90 p-5 shadow-card">
              <OrderPanel idPrefix="sidebar" />
              <div className="mt-5 flex justify-center border-t border-white/[0.06] pt-4">
                <CreatorCredit variant="compact" />
              </div>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />

      <ItemSheet />
      <CartDrawer />
      <ReviewModal />
      <FloatingCartBar />
      <Toast />
      <BackToTop />
      <CartHydrator />
    </>
  );
}
