"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { creatorBrand } from "@/lib/brand";
import { Sheet } from "./Sheet";

export function CreatorCredit({ variant = "footer" }: { variant?: "footer" | "compact" }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="by DrMcGi — about the creator"
        className={`group inline-flex items-center gap-2.5 rounded-full border border-atelier-gold/35 bg-atelier-night text-left text-atelier-gold transition hover:border-atelier-gold hover:shadow-[0_0_22px_rgba(247,216,123,0.18)] ${
          variant === "compact" ? "py-1 pl-1 pr-3" : "py-1.5 pl-1.5 pr-4"
        }`}
      >
        <Image
          src={creatorBrand.icon}
          alt=""
          width={variant === "compact" ? 24 : 32}
          height={variant === "compact" ? 24 : 32}
          className="rounded-full"
        />
        <span className={`font-semibold tracking-wide ${variant === "compact" ? "text-[11px]" : "text-xs"}`}>
          {creatorBrand.credit}
        </span>
        <ArrowUpRight className="size-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
      </button>

      <Sheet open={open} onClose={() => setOpen(false)} label="About DrMcGi" className="!bg-atelier-night">
        <div className="thin-scrollbar overflow-y-auto bg-[radial-gradient(ellipse_at_top,#263142,#0b1020_65%)] p-6 sm:p-8">
          <span className="text-[10px] font-semibold tracking-[0.25em] text-atelier-gold">THE ATELIER BEHIND THE ORDERING APP</span>
          <Image
            src={creatorBrand.logo}
            alt={creatorBrand.company}
            width={920}
            height={250}
            className="my-6 h-auto w-full"
          />
          <div className="border-t border-atelier-gold/20 pt-6">
            <span className="text-[10px] font-semibold tracking-[0.25em] text-atelier-gold">FLAGSHIP · INDEPENDENTLY CRAFTED</span>
            <h2 className="mt-3 font-heading text-2xl font-bold leading-snug text-[#fff9ec]">
              Two Tone Café Ordering
              <br />
              <span className="font-display italic text-atelier-gold">{creatorBrand.credit}</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#c9cdd3]">
              A flagship ordering experience designed and engineered by DrMcGi — every kota, chip and extra one tap away,
              with checkout straight to the café on WhatsApp.
            </p>
            <p className="mt-2 text-xs text-[#aeb7c4]">Crafted by {creatorBrand.company}</p>
            <div className="mt-5 grid gap-2 text-sm">
              <a href={`tel:${creatorBrand.phone}`} className="inline-flex items-center gap-2 text-[#e5e7eb] hover:text-atelier-gold">
                <Phone className="size-4 text-atelier-gold" /> {creatorBrand.phone}
              </a>
              <a href={`mailto:${creatorBrand.email}`} className="inline-flex items-center gap-2 text-[#e5e7eb] hover:text-atelier-gold">
                <Mail className="size-4 text-atelier-gold" /> {creatorBrand.email}
              </a>
            </div>
            <a
              href={creatorBrand.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center justify-between gap-3 rounded-xl border border-atelier-gold/35 bg-atelier-gold/5 p-4 text-sm font-semibold text-[#fff2c9] transition hover:bg-atelier-gold/10"
            >
              <span>
                Visit the atelier
                <small className="mt-1 block text-[11px] font-normal text-[#c9cdd3]">
                  {creatorBrand.websiteLabel} · opens in a new tab
                </small>
              </span>
              <ArrowUpRight className="size-5" aria-hidden />
            </a>
          </div>
        </div>
      </Sheet>
    </>
  );
}
