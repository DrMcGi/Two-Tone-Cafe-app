"use client";

import { AnimatePresence, motion } from "motion/react";
import { Bike, Minus, Plus, Store, Trash2 } from "lucide-react";
import { CONFIRM_NOTE, DELIVERY_FEE_BASE, getExtra, getItem } from "@/lib/menu";
import { cartCount, formatR, lineTotal, missingFields, totalsOf, type OrderMethod } from "@/lib/order";
import { useCart, useUi } from "@/store/cart";
import { AnimatedPrice } from "./AnimatedPrice";
import { FoodImage } from "./FoodImage";

const methods: { value: Exclude<OrderMethod, "">; title: string; desc: string; icon: typeof Bike }[] = [
  { value: "Collection", title: "Collection", desc: "Pick up in-store", icon: Store },
  { value: "Delivery", title: "Delivery", desc: "Fast delivery to your door", icon: Bike },
];

const tipPresets = [0, 5, 10, 20];

const inputCls =
  "mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-muted/70 transition focus:border-gold/60 focus:bg-white/[0.06] focus:outline-none";

export function OrderPanel({ idPrefix }: { idPrefix: string }) {
  const lines = useCart((s) => s.lines);
  const customer = useCart((s) => s.customer);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const reset = useCart((s) => s.reset);
  const setCustomer = useCart((s) => s.setCustomer);
  const setReviewOpen = useUi((s) => s.setReviewOpen);

  const count = cartCount(lines);
  const totals = totalsOf(lines, customer);
  const missing = missingFields(lines, customer);
  const id = (name: string) => `${idPrefix}-${name}`;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-black">
            <span className="two-tone-text">Order summary</span>
          </h2>
          <p className="text-xs text-muted">{count} item{count === 1 ? "" : "s"}</p>
        </div>
        {(lines.length > 0 || customer.name || customer.phone) && (
          <button type="button" onClick={reset} className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold text-muted transition hover:border-red-400/60 hover:text-red-300">
            Clear
          </button>
        )}
      </div>

      {lines.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center">
          <p className="text-3xl" aria-hidden>🛍️</p>
          <p className="mt-2 font-heading text-sm font-bold">Your order is empty</p>
          <p className="mt-1 text-xs text-muted">Tap any kota, chips or extra to get started.</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2.5">
          <AnimatePresence initial={false}>
            {lines.map((line) => {
              const item = getItem(line.itemId);
              if (!item) return null;
              const meta = [
                line.extras.length ? `Extras: ${line.extras.map((e) => getExtra(e)?.name ?? e).join(", ")}` : "",
                line.sauces.length ? `Sauces: ${line.sauces.join(", ")}` : "",
              ].filter(Boolean);
              return (
                <motion.li
                  key={line.key}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0, marginTop: -10 }}
                  className="flex gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-2.5"
                >
                  <span className="relative size-14 shrink-0 overflow-hidden rounded-xl">
                    <FoodImage item={item} sizes="56px" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-heading text-sm font-bold leading-tight text-white">{item.name}</p>
                      <p className="shrink-0 text-sm font-black tabular-nums text-gold-bright">{formatR(lineTotal(line))}</p>
                    </div>
                    {meta.map((m) => (
                      <p key={m} className="mt-0.5 text-[11px] leading-snug text-muted">{m}</p>
                    ))}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-0.5 rounded-full border border-white/10 bg-black/20" role="group" aria-label={`Quantity of ${item.name}`}>
                        <button type="button" onClick={() => setQty(line.key, line.qty - 1)} aria-label={`Remove one ${item.name}`} className="grid size-7 place-items-center rounded-full hover:bg-white/10">
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-black tabular-nums">{line.qty}</span>
                        <button type="button" onClick={() => setQty(line.key, line.qty + 1)} aria-label={`Add one more ${item.name}`} className="grid size-7 place-items-center rounded-full hover:bg-white/10">
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <button type="button" onClick={() => remove(line.key)} aria-label={`Remove ${item.name} from order`} className="grid size-7 place-items-center rounded-full text-muted transition hover:bg-red-500/10 hover:text-red-300">
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}

      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (missing.length === 0) setReviewOpen(true);
        }}
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <label htmlFor={id("name")} className="text-xs font-semibold text-cream/80">
            Your name
            <input id={id("name")} autoComplete="name" value={customer.name} onChange={(e) => setCustomer({ name: e.target.value })} placeholder="John Doe" className={inputCls} />
          </label>
          <label htmlFor={id("phone")} className="text-xs font-semibold text-cream/80">
            Phone number
            <input id={id("phone")} type="tel" inputMode="tel" autoComplete="tel" value={customer.phone} onChange={(e) => setCustomer({ phone: e.target.value })} placeholder="0811234567" className={inputCls} />
          </label>
        </div>

        <fieldset>
          <legend className="text-xs font-semibold text-cream/80">Order method</legend>
          <div className="mt-1.5 grid grid-cols-2 gap-2.5">
            {methods.map(({ value, title, desc, icon: Icon }) => {
              const selected = customer.method === value;
              return (
                <label
                  key={value}
                  className={`relative cursor-pointer overflow-hidden rounded-2xl border p-3.5 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold ${
                    selected ? "border-transparent text-white shadow-glow" : "border-white/10 bg-white/[0.03] hover:border-gold/40"
                  }`}
                >
                  {selected && <motion.span layoutId={`${idPrefix}-method`} className="two-tone-bg absolute inset-0 -z-0" />}
                  <input type="radio" name={id("method")} value={value} checked={selected} onChange={() => setCustomer({ method: value })} className="sr-only" />
                  <span className="relative flex flex-col gap-1">
                    <Icon className={`size-5 ${selected ? "text-white" : "text-gold"}`} aria-hidden />
                    <span className="font-heading text-sm font-bold">{title}</span>
                    <span className={`text-[11px] leading-tight ${selected ? "text-white/85" : "text-muted"}`}>
                      {desc}
                      {value === "Delivery" && ` · R${DELIVERY_FEE_BASE}`}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <AnimatePresence initial={false}>
          {customer.method === "Delivery" && (
            <motion.label
              htmlFor={id("address")}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="block overflow-hidden text-xs font-semibold text-cream/80"
            >
              Address (if delivery)
              <input id={id("address")} autoComplete="street-address" value={customer.address} onChange={(e) => setCustomer({ address: e.target.value })} placeholder="Street, Area, Building" className={inputCls} />
            </motion.label>
          )}
        </AnimatePresence>

        <fieldset>
          <legend className="text-xs font-semibold text-cream/80">Tip (optional)</legend>
          <div className="mt-1.5 flex gap-2">
            {tipPresets.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setCustomer({ tip: t })}
                aria-pressed={customer.tip === t}
                className={`flex-1 rounded-xl border py-2 text-xs font-bold transition ${
                  customer.tip === t ? "border-gold bg-gold/15 text-gold-bright" : "border-white/10 bg-white/[0.03] text-cream/80 hover:border-white/25"
                }`}
              >
                {t === 0 ? "None" : `R${t}`}
              </button>
            ))}
            <label className="relative w-20">
              <span className="sr-only">Custom tip amount in rand</span>
              <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted">R</span>
              <input
                type="number"
                min={0}
                step={1}
                inputMode="numeric"
                value={tipPresets.includes(customer.tip) ? "" : customer.tip}
                onChange={(e) => setCustomer({ tip: Math.max(0, Number(e.target.value) || 0) })}
                placeholder="Other"
                className="h-full w-full rounded-xl border border-white/10 bg-white/[0.03] pl-6 pr-2 text-xs text-white placeholder:text-muted focus:border-gold/60 focus:outline-none"
              />
            </label>
          </div>
        </fieldset>

        <dl className="rounded-2xl border border-white/[0.07] bg-black/20 p-4 text-sm">
          <Row label="Subtotal"><AnimatedPrice value={totals.subtotal} /></Row>
          {totals.discount > 0 && <Row label="Discount"><span className="text-emerald-400">-{formatR(totals.discount)}</span></Row>}
          <Row label="Delivery fee"><AnimatedPrice value={totals.deliveryFee} /></Row>
          <Row label="Tip"><AnimatedPrice value={totals.tip} /></Row>
          <div className="gold-hairline my-3" />
          <div className="flex items-center justify-between">
            <dt className="font-heading font-black">Total</dt>
            <dd className="font-heading text-xl font-black text-gold-bright"><AnimatedPrice value={totals.total} /></dd>
          </div>
        </dl>

        <button
          type="submit"
          disabled={missing.length > 0}
          className="flex items-center justify-center gap-2.5 rounded-full bg-wa px-5 py-4 font-heading text-sm font-black text-[#062b16] shadow-[0_10px_30px_-10px_rgba(37,211,102,0.7)] transition hover:brightness-110 active:scale-[0.98] disabled:bg-white/10 disabled:text-muted disabled:shadow-none"
        >
          <WhatsAppIcon className="size-5" />
          Place via WhatsApp
        </button>
        {missing.length > 0 && lines.length > 0 && (
          <p className="-mt-2 text-center text-[11px] text-muted">Still needed: {missing.join(" · ")}</p>
        )}
        <p className="-mt-1 text-center text-[11px] leading-relaxed text-muted">{CONFIRM_NOTE}</p>
      </form>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-1">
      <dt className="text-muted">{label}</dt>
      <dd className="font-semibold text-cream">{children}</dd>
    </div>
  );
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.04 21.5h-.01a9.45 9.45 0 0 1-4.82-1.32l-.35-.21-3.58.94.96-3.49-.23-.36a9.43 9.43 0 0 1-1.45-5.03c0-5.22 4.25-9.47 9.48-9.47 2.53 0 4.91.99 6.7 2.78a9.4 9.4 0 0 1 2.77 6.7c0 5.22-4.25 9.46-9.47 9.46zm8.06-17.53A11.32 11.32 0 0 0 12.04.63C5.76.63.65 5.74.65 12.02c0 2 .52 3.96 1.52 5.69L.55 23.62l6.04-1.58a11.38 11.38 0 0 0 5.44 1.39h.01c6.28 0 11.39-5.11 11.39-11.39 0-3.04-1.18-5.9-3.33-8.07z" />
    </svg>
  );
}
