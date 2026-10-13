"use client";

import { motion } from "motion/react";
import { Plus } from "lucide-react";
import type { MenuItem } from "@/lib/menu";
import { allowsExtras, allowsSauces } from "@/lib/menu";
import { useCart, useUi } from "@/store/cart";
import { FoodImage } from "./FoodImage";

const tagFor = (item: MenuItem) => {
  if (allowsExtras(item)) return "Customise · extras & sauces";
  if (allowsSauces(item)) return "Free sauces & seasoning";
  if (item.category === "platters") return "Pre-order · events";
  return null;
};

export function MenuCard({ item, index }: { item: MenuItem; index: number }) {
  const inCart = useCart((s) => s.lines.reduce((n, l) => (l.itemId === item.id ? n + l.qty : n), 0));
  const add = useCart((s) => s.add);
  const openItem = useUi((s) => s.openItem);
  const notify = useUi((s) => s.notify);
  const customisable = allowsSauces(item);
  const tag = tagFor(item);

  const quickAdd = () => {
    if (customisable) return openItem(item.id);
    add(item.id, 1);
    notify(`Added 1 × ${item.name}`);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex overflow-hidden rounded-3xl border border-white/[0.07] bg-surface shadow-card transition duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-glow sm:flex-col"
    >
      <button
        type="button"
        onClick={() => openItem(item.id)}
        className="absolute inset-0 z-10"
        aria-label={`View ${item.name}, R${item.price}`}
      />
      <div className="relative order-2 m-3 aspect-square w-28 shrink-0 overflow-hidden rounded-2xl sm:order-none sm:m-0 sm:aspect-[4/3] sm:w-full sm:rounded-none">
        <FoodImage
          item={item}
          sizes="(min-width: 1280px) 360px, (min-width: 640px) 45vw, 112px"
          className="transition duration-700 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-t from-surface via-transparent to-transparent sm:block" />
        {inCart > 0 && (
          <span className="absolute left-2 top-2 z-[11] rounded-full bg-gold px-2.5 py-1 text-[11px] font-black text-ink shadow-lg sm:left-3 sm:top-3">
            {inCart} in order
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2 p-4 sm:p-5 sm:pt-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-base font-bold leading-snug text-white sm:text-lg">{item.name}</h3>
          <span className="hidden shrink-0 font-heading text-lg font-black text-gold-bright sm:block">R{item.price}</span>
        </div>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted">{item.desc}</p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <div className="min-w-0">
            <span className="block font-heading text-base font-black text-gold-bright sm:hidden">R{item.price}</span>
            {tag && <span className="block truncate text-[11px] font-semibold uppercase tracking-wider text-teal-bright">{tag}</span>}
          </div>
          <button
            type="button"
            onClick={quickAdd}
            aria-label={customisable ? `Customise and add ${item.name}` : `Add ${item.name} to order`}
            className="two-tone-bg relative z-[12] grid size-10 shrink-0 place-items-center rounded-full text-white shadow-glow transition hover:scale-110 active:scale-95"
          >
            <Plus className="size-5" strokeWidth={2.75} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
