"use client";

import confetti from "canvas-confetti";
import { useMemo, useState } from "react";
import { CheckCircle2, ExternalLink } from "lucide-react";
import { cafe } from "@/lib/brand";
import { buildWhatsAppMessage, whatsappUrl } from "@/lib/order";
import { useCart, useUi } from "@/store/cart";
import { WhatsAppIcon } from "./OrderPanel";
import { Sheet } from "./Sheet";

export function ReviewModal() {
  const open = useUi((s) => s.reviewOpen);
  const setOpen = useUi((s) => s.setReviewOpen);
  const [sentUrl, setSentUrl] = useState<string | null>(null);

  const close = () => {
    setOpen(false);
    setSentUrl(null);
  };

  return (
    <Sheet open={open} onClose={close} label="Preview your WhatsApp message">
      {open && (sentUrl ? <Sent url={sentUrl} onDone={close} /> : <Preview onSent={setSentUrl} onCancel={close} />)}
    </Sheet>
  );
}

function Preview({ onSent, onCancel }: { onSent: (url: string) => void; onCancel: () => void }) {
  const lines = useCart((s) => s.lines);
  const customer = useCart((s) => s.customer);
  const orderNo = useCart((s) => s.orderNo);
  const message = useMemo(() => buildWhatsAppMessage(lines, customer, orderNo), [lines, customer, orderNo]);

  const send = () => {
    const url = whatsappUrl(cafe.whatsappNumber, message);
    window.open(url, "_blank", "noopener,noreferrer");
    void confetti({ particleCount: 140, spread: 80, origin: { y: 0.7 }, colors: ["#2c7a7b", "#c5a572", "#e6c891", "#46a9aa", "#ffffff"] });
    onSent(url);
  };

  return (
    <>
      <div className="px-6 pb-2 pt-6 sm:px-8">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-teal-bright">Final step</span>
          {orderNo && <OrderBadge orderNo={orderNo} />}
        </div>
        <h2 className="mt-1 font-heading text-2xl font-black">Preview your WhatsApp message</h2>
        <p className="mt-1 text-sm text-muted">This goes straight to {cafe.name} on {cafe.whatsappDisplay}.</p>
      </div>
      <div className="thin-scrollbar flex-1 overflow-y-auto px-4 py-4 sm:px-8">
        <div className="rounded-2xl bg-[#0b141a] bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:14px_14px] p-4">
          <div className="ml-auto max-w-[92%] rounded-2xl rounded-tr-sm bg-[#005c4b] px-4 py-3 shadow-lg">
            <pre className="whitespace-pre-wrap break-words font-sans text-[13px] leading-relaxed text-[#e9edef]">{message}</pre>
            <span className="mt-1 block text-right text-[10px] text-[#8fb5ab]">✓✓</span>
          </div>
        </div>
      </div>
      <div className="flex shrink-0 gap-3 border-t border-white/10 p-4 sm:px-8">
        <button type="button" onClick={onCancel} className="flex-1 rounded-full border border-white/15 py-3.5 font-heading text-sm font-bold transition hover:border-white/40">
          Cancel
        </button>
        <button type="button" onClick={send} className="flex flex-[2] items-center justify-center gap-2 rounded-full bg-wa py-3.5 font-heading text-sm font-black text-[#062b16] transition hover:brightness-110 active:scale-[0.98]">
          <WhatsAppIcon className="size-5" /> Send
        </button>
      </div>
    </>
  );
}

function OrderBadge({ orderNo }: { orderNo: string }) {
  return (
    <span className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 font-heading text-xs font-black tracking-wider text-gold-bright">
      Order #{orderNo}
    </span>
  );
}

function Sent({ url, onDone }: { url: string; onDone: () => void }) {
  const clear = useCart((s) => s.clear);
  const orderNo = useCart((s) => s.orderNo);
  return (
    <div className="flex flex-col items-center px-6 py-10 text-center sm:px-10">
      <CheckCircle2 className="size-16 text-wa" strokeWidth={1.5} />
      <h2 className="mt-4 font-heading text-2xl font-black">Order sent to WhatsApp</h2>
      {orderNo && (
        <div className="mt-3">
          <OrderBadge orderNo={orderNo} />
          <p className="mt-2 text-xs text-muted">Keep this number handy when you speak to {cafe.name}.</p>
        </div>
      )}
      <p className="mt-2 max-w-sm text-sm text-muted">
        Hit send in WhatsApp if you haven&apos;t yet. {cafe.name} will message you to confirm time & payment — cash on delivery accepted.
      </p>
      <a href={url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-bright underline-offset-4 hover:underline">
        WhatsApp didn&apos;t open? Try again <ExternalLink className="size-3.5" />
      </a>
      <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
        <button type="button" onClick={onDone} className="flex-1 rounded-full border border-white/15 py-3.5 font-heading text-sm font-bold transition hover:border-white/40">
          Keep this order
        </button>
        <button
          type="button"
          onClick={() => {
            clear();
            useUi.getState().setCartOpen(false);
            onDone();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="two-tone-bg flex-1 rounded-full py-3.5 font-heading text-sm font-bold text-white shadow-glow"
        >
          Start a new order
        </button>
      </div>
    </div>
  );
}
