"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, Pause, Play } from "lucide-react";
import { platterGallery } from "@/lib/menu";
import { Sheet } from "./Sheet";

const SLIDE_MS = 4000;

export function PlatterGallery() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const total = platterGallery.length;

  const go = useCallback((delta: number) => setIndex((i) => (i + delta + total) % total), [total]);

  useEffect(() => {
    if (!playing || hovered || lightbox) return;
    const t = setTimeout(() => go(1), SLIDE_MS);
    return () => clearTimeout(t);
  }, [index, playing, hovered, lightbox, go]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, go]);

  const current = platterGallery[index];

  return (
    <div
      className="mb-8"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Platter gallery"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-gold/25 bg-black shadow-glow sm:aspect-[16/10]">
        <AnimatePresence initial={false}>
          <motion.div
            key={current.src}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          >
            <Image src={current.src} alt="" fill sizes="(min-width: 1024px) 800px, 100vw" quality={70} className="scale-110 object-cover opacity-40 blur-2xl" aria-hidden />
            <Image src={current.src} alt={current.alt} fill sizes="(min-width: 1024px) 800px, 100vw" quality={85} className="object-contain" />
          </motion.div>
        </AnimatePresence>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-4">
          <span className="rounded-full bg-black/50 px-3 py-1 text-xs font-semibold tabular-nums text-white backdrop-blur" aria-live="polite">
            {index + 1} / {total}
          </span>
          <div className="flex gap-2">
            {[
              { label: "Previous platter photo", icon: ChevronLeft, onClick: () => go(-1) },
              { label: playing ? "Pause slideshow" : "Play slideshow", icon: playing ? Pause : Play, onClick: () => setPlaying((p) => !p) },
              { label: "Next platter photo", icon: ChevronRight, onClick: () => go(1) },
              { label: "View full screen", icon: Expand, onClick: () => setLightbox(true) },
            ].map(({ label, icon: Icon, onClick }) => (
              <button
                key={label}
                type="button"
                onClick={onClick}
                aria-label={label}
                className="grid size-10 place-items-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur transition hover:border-gold hover:text-gold-bright"
              >
                <Icon className="size-4" />
              </button>
            ))}
          </div>
        </div>

        {playing && !hovered && !lightbox && (
          <motion.div
            key={`progress-${index}`}
            className="absolute inset-x-0 top-0 h-0.5 origin-left bg-gold"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: SLIDE_MS / 1000, ease: "linear" }}
          />
        )}
      </div>

      <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
        {platterGallery.map((p, i) => (
          <button
            key={p.src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show platter photo ${i + 1}`}
            aria-current={i === index}
            className={`relative size-16 shrink-0 overflow-hidden rounded-xl border-2 transition sm:size-20 ${
              i === index ? "border-gold opacity-100" : "border-transparent opacity-50 hover:opacity-90"
            }`}
          >
            <Image src={p.src} alt="" fill sizes="80px" quality={70} className="object-cover" />
          </button>
        ))}
      </div>

      <Sheet open={lightbox} onClose={() => setLightbox(false)} label="Platter photo" className="!max-w-5xl !bg-black">
        <div className="relative h-[85dvh] w-full">
          <Image src={current.src} alt={current.alt} fill sizes="100vw" quality={85} className="object-contain" />
          <button type="button" onClick={() => go(-1)} aria-label="Previous platter photo" className="absolute left-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-white hover:text-gold-bright">
            <ChevronLeft />
          </button>
          <button type="button" onClick={() => go(1)} aria-label="Next platter photo" className="absolute right-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-white hover:text-gold-bright">
            <ChevronRight />
          </button>
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
            {index + 1} / {total}
          </span>
        </div>
      </Sheet>
    </div>
  );
}
