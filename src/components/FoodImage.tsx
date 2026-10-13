import Image from "next/image";
import type { MenuItem } from "@/lib/menu";

const fallbackEmoji: Record<MenuItem["category"], string> = {
  kota: "🥪",
  chips: "🍟",
  platters: "🎉",
  other: "🔥",
};

type Props = {
  item: MenuItem;
  sizes: string;
  className?: string;
  preload?: boolean;
};

/** Menu photo, or a branded two-tone tile for items that have no photo yet. */
export function FoodImage({ item, sizes, className = "", preload }: Props) {
  if (item.img) {
    return (
      <Image
        src={item.img}
        alt={item.name}
        fill
        sizes={sizes}
        quality={70}
        preload={preload}
        className={`object-cover ${className}`}
      />
    );
  }
  return (
    <div
      className={`absolute inset-0 grid place-items-center overflow-hidden bg-[radial-gradient(circle_at_30%_20%,rgba(70,169,170,0.35),transparent_55%),radial-gradient(circle_at_80%_90%,rgba(197,165,114,0.35),transparent_55%)] bg-surface-2 ${className}`}
      role="img"
      aria-label={item.name}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="text-5xl drop-shadow-[0_6px_18px_rgba(0,0,0,0.6)]" aria-hidden>
          {fallbackEmoji[item.category]}
        </span>
        <span className="font-display text-lg italic text-gold-bright/90">{item.name}</span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-cream/40">Two Tone Café</span>
      </div>
    </div>
  );
}
