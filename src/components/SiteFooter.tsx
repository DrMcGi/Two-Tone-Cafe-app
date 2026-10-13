import Image from "next/image";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { cafe, creatorBrand } from "@/lib/brand";
import { categories } from "@/lib/menu";
import { CreatorCredit } from "./CreatorCredit";

export function SiteFooter() {
  return (
    <footer className="relative mt-20 border-t border-white/[0.06] bg-surface/60 pb-28 lg:pb-10">
      <div className="gold-hairline absolute inset-x-0 top-0" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="relative size-20 shrink-0 rounded-full bg-white shadow-[0_0_0_2px_rgba(197,165,114,0.55)]">
              <Image src={cafe.logo} alt={`${cafe.name} logo`} fill sizes="80px" unoptimized className="object-contain" />
            </span>
            <span className="font-heading text-2xl font-black">
              <span className="two-tone-text">{cafe.name}</span>
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">{cafe.tagline}</p>
        </div>

        <div>
          <h2 className="font-heading text-xs font-black uppercase tracking-[0.25em] text-gold">Menu</h2>
          <ul className="mt-4 grid gap-2 text-sm">
            {categories.map((c) => (
              <li key={c.anchor}>
                <a href={`#${c.anchor}`} className="text-cream/80 transition hover:text-gold-bright">
                  <span aria-hidden>{c.emoji}</span> {c.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-heading text-xs font-black uppercase tracking-[0.25em] text-gold">Order & enquiries</h2>
          <ul className="mt-4 grid gap-3 text-sm">
            <li>
              <a href={`https://wa.me/${cafe.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-cream/80 transition hover:text-gold-bright">
                <MessageCircle className="size-4 text-wa" /> WhatsApp {cafe.whatsappDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${cafe.plattersEmail}`} className="inline-flex items-center gap-2 break-all text-cream/80 transition hover:text-gold-bright">
                <Mail className="size-4 text-gold" /> {cafe.plattersEmail}
              </a>
              <span className="block pl-6 text-xs text-muted">Platters, events & special occasions</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/[0.06] px-4 pt-8 text-center text-xs text-muted sm:flex-row sm:px-6 sm:text-left">
        <div>
          <p>Created for Two Tone Cafe · {creatorBrand.credit}</p>
          <p className="mt-1 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 sm:justify-start">
            <a href={`tel:${creatorBrand.phone}`} className="inline-flex items-center gap-1 hover:text-gold-bright">
              <Phone className="size-3" /> {creatorBrand.phone}
            </a>
            <a href={`mailto:${creatorBrand.email}`} className="inline-flex items-center gap-1 hover:text-gold-bright">
              <Mail className="size-3" /> {creatorBrand.email}
            </a>
          </p>
        </div>
        <CreatorCredit />
      </div>
    </footer>
  );
}
