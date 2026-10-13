"use client";

import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Mail, Search, Sparkles, X } from "lucide-react";
import { cafe } from "@/lib/brand";
import { categories, menuItems, PLATTERS_NOTE, PREMIUM_NOTE, type Category } from "@/lib/menu";
import { MenuCard } from "./MenuCard";
import { PlatterGallery } from "./PlatterGallery";

const normalise = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export function MenuExplorer() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(categories[0].anchor);
  const navRef = useRef<HTMLDivElement>(null);

  const q = normalise(query.trim());
  const grouped = useMemo(
    () =>
      categories.map((c) => ({
        category: c,
        items: menuItems.filter(
          (i) => i.category === c.id && (!q || normalise(`${i.name} ${i.desc} ${c.title}`).includes(q)),
        ),
      })),
    [q],
  );
  const resultCount = grouped.reduce((n, g) => n + g.items.length, 0);

  useEffect(() => {
    const sections = categories
      .map((c) => document.getElementById(c.anchor))
      .filter((el): el is HTMLElement => !!el);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [q]);

  useEffect(() => {
    navRef.current
      ?.querySelector<HTMLElement>(`[data-anchor="${active}"]`)
      ?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [active]);

  return (
    <div>
      <div className="glass sticky top-16 z-40 -mx-3 mb-6 border-b border-white/[0.06] px-3 py-3 sm:top-[72px] sm:-mx-6 sm:px-6 lg:mx-0 lg:rounded-2xl lg:border lg:px-3">
        <div className="flex items-center gap-3">
          <nav ref={navRef} aria-label="Menu categories" className="no-scrollbar flex flex-1 gap-1.5 overflow-x-auto">
            {categories.map((c) => (
              <a
                key={c.anchor}
                href={`#${c.anchor}`}
                data-anchor={c.anchor}
                aria-current={active === c.anchor ? "true" : undefined}
                className="relative shrink-0 rounded-full px-4 py-2 font-heading text-sm font-bold text-cream/70 transition hover:text-white"
              >
                {active === c.anchor && (
                  <motion.span layoutId="nav-pill" className="two-tone-bg absolute inset-0 -z-10 rounded-full shadow-glow" transition={{ type: "spring", stiffness: 400, damping: 34 }} />
                )}
                <span className={active === c.anchor ? "text-white" : ""}>
                  <span aria-hidden className="mr-1.5">{c.emoji}</span>
                  {c.label}
                </span>
              </a>
            ))}
          </nav>
          <label className="relative hidden w-56 shrink-0 md:block">
            <span className="sr-only">Search the menu</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="search"
              placeholder="Search kotas, chips…"
              className="w-full rounded-full border border-white/10 bg-white/5 py-2 pl-9 pr-8 text-sm text-white placeholder:text-muted focus:border-gold/60 focus:outline-none"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-white">
                <X className="size-4" />
              </button>
            )}
          </label>
        </div>
        <label className="relative mt-3 block md:hidden">
          <span className="sr-only">Search the menu</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="search"
            placeholder="Search kotas, chips, platters…"
            className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-9 pr-4 text-sm text-white placeholder:text-muted focus:border-gold/60 focus:outline-none"
          />
        </label>
      </div>

      {q && (
        <p className="mb-6 text-sm text-muted" aria-live="polite">
          {resultCount} result{resultCount === 1 ? "" : "s"} for “{query.trim()}”
        </p>
      )}

      {resultCount === 0 && (
        <div className="rounded-3xl border border-dashed border-white/10 p-10 text-center">
          <p className="text-4xl" aria-hidden>🔍</p>
          <p className="mt-3 font-heading font-bold">Nothing on the menu matches that.</p>
          <button type="button" onClick={() => setQuery("")} className="mt-4 text-sm font-semibold text-gold-bright underline-offset-4 hover:underline">
            Show the full menu
          </button>
        </div>
      )}

      {grouped.map(({ category, items }) =>
        items.length === 0 ? null : (
          <MenuSection key={category.id} category={category} count={items.length} showGallery={!q}>
            {items.map((item, i) => (
              <MenuCard key={item.id} item={item} index={i} />
            ))}
          </MenuSection>
        ),
      )}

      <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-gold/30 bg-gold/[0.07] p-4 text-center text-sm font-semibold text-gold-bright">
        {PREMIUM_NOTE}
      </div>
    </div>
  );
}

function MenuSection({
  category,
  count,
  showGallery,
  children,
}: {
  category: Category;
  count: number;
  showGallery: boolean;
  children: React.ReactNode;
}) {
  return (
    <section id={category.anchor} aria-labelledby={`${category.anchor}-title`} className="mb-14 scroll-mt-40">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-teal-bright">
            <span aria-hidden>{category.emoji}</span> {count} item{count === 1 ? "" : "s"}
          </p>
          <h2 id={`${category.anchor}-title`} className="mt-1 font-heading text-3xl font-black tracking-tight sm:text-4xl">
            <span className="two-tone-text">{category.title}</span>
          </h2>
          <p className="mt-1 text-sm text-muted">{category.blurb}</p>
        </div>
      </div>
      <div className="gold-hairline mb-6" />

      {category.id === "platters" && (
        <>
          <div className="mb-6 rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/10 to-teal/10 p-5">
            <p className="flex gap-2 text-sm font-bold leading-relaxed text-gold-bright">
              <Sparkles className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>{PLATTERS_NOTE}</span>
            </p>
            <a
              href={`mailto:${cafe.plattersEmail}?subject=${encodeURIComponent("Platter order — Two Tone Café")}`}
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-white underline-offset-4 hover:underline"
            >
              <Mail className="size-4 text-gold" aria-hidden /> Alternatively email us @ {cafe.plattersEmail}
            </a>
          </div>
          {showGallery && <PlatterGallery />}
        </>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{children}</div>
    </section>
  );
}
