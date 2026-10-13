"use client";

import Image from "next/image";
import { motion, useAnimationControls } from "motion/react";
import { useEffect } from "react";
import { ShoppingBag } from "lucide-react";
import { cafe } from "@/lib/brand";
import { cartCount, formatShort, subtotalOf } from "@/lib/order";
import { useCart, useUi } from "@/store/cart";

export function openOrder() {
  if (window.matchMedia("(min-width: 1024px)").matches) {
    document.getElementById("order")?.scrollIntoView({ behavior: "smooth", block: "start" });
    document.getElementById("order")?.focus({ preventScroll: true });
  } else {
    useUi.getState().setCartOpen(true);
  }
}

export function SiteHeader() {
  const lines = useCart((s) => s.lines);
  const bump = useCart((s) => s.bump);
  const controls = useAnimationControls();
  const count = cartCount(lines);

  useEffect(() => {
    if (bump) void controls.start({ scale: [1, 1.18, 1], transition: { duration: 0.4 } });
  }, [bump, controls]);

  return (
    <header className="glass fixed inset-x-0 top-0 z-50 border-b border-white/[0.06]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-[72px] sm:px-6">
        <a href="#top" className="flex min-w-0 items-center gap-3" aria-label={`${cafe.name} — home`}>
          <span className="relative size-10 shrink-0 overflow-hidden rounded-full ring-2 ring-gold/50 sm:size-11">
            <Image src={cafe.logo} alt="" fill sizes="44px" className="object-cover" preload />
          </span>
          <span className="min-w-0">
            <span className="block font-heading text-lg font-black leading-tight tracking-tight sm:text-xl">
              <span className="two-tone-text">Two Tone Café</span>
            </span>
            <span className="hidden truncate text-xs text-muted md:block">{cafe.tagline}</span>
          </span>
        </a>

        <motion.button
          type="button"
          animate={controls}
          onClick={openOrder}
          id="header-cart"
          className="two-tone-bg relative inline-flex shrink-0 items-center gap-2.5 rounded-full py-2 pl-3 pr-2 font-heading text-sm font-bold text-white shadow-glow transition hover:brightness-110"
          aria-label={`Open your order, ${count} item${count === 1 ? "" : "s"}`}
        >
          <ShoppingBag className="size-[18px]" aria-hidden />
          <span className="hidden sm:inline">{count > 0 ? formatShort(subtotalOf(lines)) : "Cart"}</span>
          <span className="grid min-w-7 place-items-center rounded-full bg-white px-1.5 py-0.5 text-xs font-black text-teal-deep">
            {count}
          </span>
        </motion.button>
      </div>
    </header>
  );
}
