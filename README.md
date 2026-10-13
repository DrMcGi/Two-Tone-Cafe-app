# Two Tone Café — Online Ordering · by DrMcGi

Flagship ordering experience for Two Tone Café, crafted by **DrMcGi** (DrMcGi's SaaS Atelier).

## Stack
Next.js 16 (App Router, Turbopack, React Compiler) · React 19 · TypeScript · Tailwind CSS v4 · Zustand · Motion · lucide-react

## Scripts
- `npm run dev` — local dev server
- `npm run build` / `npm start` — production build & serve
- `npm run lint` · `npm run typecheck`
- `npm test` — menu integrity, pricing and WhatsApp message tests

## Where things live
- `src/lib/menu.ts` — the menu (items, prices, extras, sauces, platter gallery). Single source of truth.
- `src/lib/order.ts` — pricing, delivery fee and WhatsApp order message.
- `src/lib/brand.ts` — café contacts and DrMcGi creator branding.
- `public/images`, `public/videos` — food photos, gallery and promo video.

## Deploy
Set `NEXT_PUBLIC_SITE_URL` (e.g. `https://twotonecafe.co.za`) for correct social/OG links, then deploy (e.g. Vercel).