"use client";

import { motion } from "motion/react";
import { useRef, useState } from "react";
import { ArrowDown, Bike, MessageCircle, Store, Volume2, VolumeX, Wallet } from "lucide-react";
import { cafe } from "@/lib/brand";
import { DELIVERY_FEE_BASE, getItem } from "@/lib/menu";
import { FoodImage } from "./FoodImage";
import { useUi } from "@/store/cart";

const perks = [
  { icon: Bike, label: `Delivery R${DELIVERY_FEE_BASE}` },
  { icon: Store, label: "Collection" },
  { icon: Wallet, label: "Cash on delivery" },
  { icon: MessageCircle, label: "Checkout on WhatsApp" },
];

const signatures = ["dagwood", "galxboy"].map((id) => getItem(id)!);

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const openItem = useUi((s) => s.openItem);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    if (!v.muted) void v.play().catch(() => {});
    setMuted(v.muted);
  };

  return (
    <section id="top" aria-label="Two Tone Café promo" className="relative mx-auto max-w-7xl px-3 pt-[76px] sm:px-6 sm:pt-[88px]">
      <div className="relative isolate min-h-[560px] overflow-hidden rounded-[28px] border border-white/10 shadow-glow sm:min-h-[620px] lg:h-[78vh] lg:max-h-[760px]">
        <video
          ref={videoRef}
          className="absolute inset-0 -z-20 size-full scale-105 object-cover"
          src={cafe.promoVideo}
          poster="/images/platter6.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Two Tone Café promo video"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(7,11,10,0.15)_0%,rgba(7,11,10,0.35)_45%,rgba(7,11,10,0.95)_100%)]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_10%_100%,rgba(44,122,123,0.55),transparent_55%),radial-gradient(ellipse_at_100%_0%,rgba(197,165,114,0.35),transparent_50%)]" />

        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Unmute promo video" : "Mute promo video"}
          aria-pressed={!muted}
          className="absolute right-4 top-4 grid size-11 place-items-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur transition hover:border-gold hover:text-gold-bright"
        >
          {muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
        </button>

        <div className="flex h-full min-h-[inherit] flex-col justify-end gap-8 p-6 sm:p-10 lg:flex-row lg:items-end lg:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-black/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-bright backdrop-blur">
              <span className="size-1.5 animate-pulse rounded-full bg-wa" /> Now taking orders
            </span>
            <h1 className="mt-4 font-display text-5xl font-bold italic leading-[0.95] text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)] sm:text-7xl lg:text-8xl">
              Two Tone <span className="two-tone-text">Café</span>
            </h1>
            <p className="mt-4 max-w-lg text-base text-cream/85 sm:text-lg">{cafe.heroLine}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#kotas"
                className="two-tone-bg-animated inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-heading text-sm font-bold text-white shadow-glow transition hover:brightness-110"
              >
                Start your order <ArrowDown className="size-4" />
              </a>
              <a
                href="#platters"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 py-3.5 font-heading text-sm font-bold text-white backdrop-blur transition hover:border-gold hover:text-gold-bright"
              >
                Explore platters
              </a>
            </div>
            <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-cream/80">
              {perks.map(({ icon: Icon, label }) => (
                <li key={label} className="inline-flex items-center gap-2">
                  <Icon className="size-4 text-gold" aria-hidden /> {label}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="hidden w-72 shrink-0 flex-col gap-3 lg:flex"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-bright">Signature kotas</span>
            {signatures.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={() => openItem(item.id)}
                style={{ animationDelay: `${i * 1.2}s` }}
                className="glass group flex animate-float items-center gap-3 rounded-2xl border border-white/10 p-2.5 text-left transition hover:border-gold/60"
              >
                <span className="relative size-16 shrink-0 overflow-hidden rounded-xl">
                  <FoodImage item={item} sizes="64px" className="transition duration-500 group-hover:scale-110" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-heading font-bold text-white">{item.name}</span>
                  <span className="line-clamp-1 text-xs text-muted">{item.desc}</span>
                </span>
                <span className="font-heading text-lg font-black text-gold-bright">R{item.price}</span>
              </button>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
