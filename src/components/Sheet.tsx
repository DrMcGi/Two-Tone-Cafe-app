"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
  /** "center" = dialog on desktop + bottom sheet on mobile; "right" = side drawer */
  variant?: "center" | "right";
  className?: string;
  hideClose?: boolean;
};

export function Sheet({ open, onClose, label, children, variant = "center", className = "", hideClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),input:not([disabled]),textarea,select,[tabindex]:not([tabindex="-1"])',
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => panelRef.current?.focus(), 30);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  const isRight = variant === "right";

  return (
    <AnimatePresence>
      {open && (
        <div className={`fixed inset-0 z-[80] flex ${isRight ? "justify-end" : "items-end justify-center sm:items-center"}`}>
          <motion.button
            type="button"
            aria-label="Close"
            tabIndex={-1}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            tabIndex={-1}
            className={`relative z-10 flex max-h-[100dvh] flex-col overflow-hidden border border-white/10 bg-surface shadow-2xl outline-none ${
              isRight
                ? "h-[100dvh] w-full max-w-md border-y-0 border-r-0"
                : "max-h-[92dvh] w-full rounded-t-[28px] sm:max-w-xl sm:rounded-[28px]"
            } ${className}`}
            initial={isRight ? { x: "100%" } : { y: "100%", opacity: 0.6 }}
            animate={isRight ? { x: 0 } : { y: 0, opacity: 1 }}
            exit={isRight ? { x: "100%" } : { y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
          >
            {!isRight && <div className="mx-auto mt-2.5 h-1.5 w-12 shrink-0 rounded-full bg-white/15 sm:hidden" aria-hidden />}
            {!hideClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label={`Close ${label}`}
                className="absolute right-4 top-4 z-20 grid size-10 place-items-center rounded-full border border-white/10 bg-black/50 text-cream backdrop-blur transition hover:border-gold/60 hover:text-gold-bright"
              >
                <X className="size-5" />
              </button>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
