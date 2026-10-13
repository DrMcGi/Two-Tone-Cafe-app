"use client";

import { useState } from "react";
import { Check, Minus, Plus } from "lucide-react";
import { allowsExtras, allowsSauces, extrasList, getItem, PLATTERS_NOTE, saucesList, type MenuItem } from "@/lib/menu";
import { formatR, unitPrice } from "@/lib/order";
import { useCart, useUi } from "@/store/cart";
import { FoodImage } from "./FoodImage";
import { Sheet } from "./Sheet";

export function ItemSheet() {
  const activeItemId = useUi((s) => s.activeItemId);
  const openItem = useUi((s) => s.openItem);
  const item = activeItemId ? getItem(activeItemId) : undefined;

  return (
    <Sheet open={!!item} onClose={() => openItem(null)} label={item ? `Customise ${item.name}` : "Item"}>
      {item && <ItemBuilder key={item.id} item={item} />}
    </Sheet>
  );
}

function ItemBuilder({ item }: { item: MenuItem }) {
  const [qty, setQty] = useState(1);
  const [extras, setExtras] = useState<string[]>([]);
  const [sauces, setSauces] = useState<string[]>([]);
  const add = useCart((s) => s.add);
  const { openItem, notify } = useUi.getState();

  const toggle = (list: string[], value: string) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  const unit = unitPrice(item.id, extras);

  const submit = () => {
    const orderedExtras = extrasList.map((e) => e.id).filter((id) => extras.includes(id));
    const orderedSauces = saucesList.filter((s) => sauces.includes(s));
    add(item.id, qty, orderedExtras, orderedSauces);
    notify(`Added ${qty} × ${item.name}`);
    openItem(null);
  };

  return (
    <>
      <div className="thin-scrollbar flex-1 overflow-y-auto">
        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden">
          <FoodImage item={item} sizes="(min-width: 640px) 576px, 100vw" preload />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface via-surface/10 to-transparent" />
        </div>

        <div className="-mt-10 px-5 pb-6 sm:px-7">
          <div className="relative flex items-start justify-between gap-4">
            <h2 className="font-heading text-2xl font-black text-white sm:text-3xl">{item.name}</h2>
            <span className="shrink-0 rounded-full bg-gold px-3 py-1 font-heading text-lg font-black text-ink">R{item.price}</span>
          </div>
          <p className="mt-2 leading-relaxed text-muted">{item.desc}</p>
          {item.category === "platters" && (
            <p className="mt-4 rounded-2xl border border-gold/30 bg-gold/10 p-3 text-xs font-bold leading-relaxed text-gold-bright">{PLATTERS_NOTE}</p>
          )}

          {allowsExtras(item) && (
            <fieldset className="mt-6">
              <legend className="flex w-full items-center justify-between font-heading text-sm font-black uppercase tracking-wider text-white">
                Add extras (per item)
                <span className="text-[11px] font-semibold normal-case tracking-normal text-muted">Optional</span>
              </legend>
              <div className="mt-3 grid gap-2">
                {extrasList.map((ex) => {
                  const checked = extras.includes(ex.id);
                  return (
                    <label
                      key={ex.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                        checked ? "border-gold/70 bg-gold/10" : "border-white/10 bg-white/[0.03] hover:border-white/25"
                      }`}
                    >
                      <input type="checkbox" className="peer sr-only" checked={checked} onChange={() => setExtras((l) => toggle(l, ex.id))} />
                      <span className={`grid size-5 place-items-center rounded-md border-2 transition peer-focus-visible:ring-2 peer-focus-visible:ring-gold ${checked ? "border-gold bg-gold text-ink" : "border-gold/50"}`}>
                        {checked && <Check className="size-3.5" strokeWidth={3.5} />}
                      </span>
                      <span className="flex-1 text-sm font-semibold text-cream">{ex.name}</span>
                      <span className="text-sm font-bold text-gold-bright">+R{ex.price}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}

          {allowsSauces(item) && (
            <fieldset className="mt-6">
              <legend className="flex w-full items-center justify-between font-heading text-sm font-black uppercase tracking-wider text-white">
                Sauces & seasoning
                <span className="text-[11px] font-semibold normal-case tracking-normal text-muted">Free · select any</span>
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {saucesList.map((s) => {
                  const checked = sauces.includes(s);
                  return (
                    <label
                      key={s}
                      className={`cursor-pointer rounded-full border px-3.5 py-2 text-sm font-semibold transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold ${
                        checked ? "border-teal-bright bg-teal/30 text-white" : "border-white/10 bg-white/[0.03] text-cream/80 hover:border-white/25"
                      }`}
                    >
                      <input type="checkbox" className="sr-only" checked={checked} onChange={() => setSauces((l) => toggle(l, s))} />
                      {checked && <Check className="-ml-0.5 mr-1 inline size-3.5" strokeWidth={3} />}
                      {s}
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3 border-t border-white/10 bg-surface/95 p-4 backdrop-blur sm:px-7">
        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1" role="group" aria-label={`Quantity of ${item.name}`}>
          <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Decrease quantity" className="grid size-9 place-items-center rounded-full text-white transition hover:bg-white/10 disabled:opacity-30">
            <Minus className="size-4" />
          </button>
          <span className="w-8 text-center font-heading font-black tabular-nums" aria-live="polite">{qty}</span>
          <button type="button" onClick={() => setQty((q) => Math.min(99, q + 1))} aria-label="Increase quantity" className="grid size-9 place-items-center rounded-full text-white transition hover:bg-white/10">
            <Plus className="size-4" />
          </button>
        </div>
        <button
          type="button"
          onClick={submit}
          className="two-tone-bg-animated flex flex-1 items-center justify-between gap-3 rounded-full px-5 py-3.5 font-heading text-sm font-bold text-white shadow-glow transition hover:brightness-110 active:scale-[0.98]"
        >
          <span>Add {qty} to order</span>
          <span className="tabular-nums">{formatR(unit * qty)}</span>
        </button>
      </div>
    </>
  );
}
