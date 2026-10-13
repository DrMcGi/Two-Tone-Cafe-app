"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { ArrowUp, ChevronRight, ShoppingBag } from "lucide-react";
import { cartCount, formatR, subtotalOf } from "@/lib/order";
import { useCart, useUi } from "@/store/cart";
import { OrderPanel } from "./OrderPanel";
import { Sheet } from "./Sheet";

export function CartDrawer() {
  const open = useUi((s) => s.cartOpen);
  const setOpen = useUi((s) => s.setCartOpen);
  return (
    <Sheet open={open} onClose={() => setOpen(false)} label="Your order" variant="right">
      <div className="thin-scrollbar flex-1 overflow-y-auto p-5 pt-6">
        <OrderPanel idPrefix="drawer" />
      </div>
    </Sheet>
  );
}

export function FloatingCartBar() {
  const lines = useCart((s) => s.lines);
  const bump = useCart((s) => s.bump);
  const setOpen = useUi((s) => s.setCartOpen);
  const count = cartCount(lines);

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ y: 120 }}
          animate={{ y: 0 }}
          exit={{ y: 120 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="fixed inset-x-0 bottom-0 z-40 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden"
        >
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="two-tone-bg-animated flex w-full items-center gap-3 rounded-full px-3 py-3 font-heading text-white shadow-glow"
          >
            <motion.span key={bump} initial={{ scale: 1.35 }} animate={{ scale: 1 }} className="grid size-9 place-items-center rounded-full bg-white text-sm font-black text-teal-deep">
              {count}
            </motion.span>
            <span className="flex-1 text-left text-sm font-bold">
              <ShoppingBag className="mr-1.5 inline size-4 align-[-3px]" aria-hidden />
              Checkout
            </span>
            <span className="text-sm font-black tabular-nums">{formatR(subtotalOf(lines))}</span>
            <ChevronRight className="size-5" aria-hidden />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Toast() {
  const visible = useUi((s) => s.toast);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[90] flex justify-center px-4 lg:bottom-8" aria-live="polite">
      <AnimatePresence>
        {visible && (
          <motion.div
            key={visible.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            className="glass flex items-center gap-2 rounded-full border border-gold/40 px-5 py-3 text-sm font-semibold text-white shadow-glow"
          >
            <span className="size-2 rounded-full bg-wa" aria-hidden /> {visible.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="glass fixed bottom-6 left-6 z-40 hidden size-11 place-items-center rounded-full border border-gold/40 text-gold-bright shadow-glow transition hover:bg-gold hover:text-ink lg:grid"
        >
          <ArrowUp className="size-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
