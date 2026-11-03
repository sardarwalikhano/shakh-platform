# Shakh Store

A Kurdish Sorani-first, RTL multi-vendor marketplace and delivery platform for restaurants, supermarkets, meat and seafood sellers, fruit and vegetable vendors, couriers, and customers.

## Current implementation

This repository contains the SHAKH platform foundation and the final orange-and-white storefront/workspace UI refresh.

- Next.js App Router 16, React 19, strict TypeScript, and Tailwind CSS v4
- Kurdish Sorani-first RTL storefront, responsive across mobile, tablet, and desktop
- Final Shakh Store brand system: orange, white, warm cream surfaces, and accessible neutral text
- Storefront category discovery for restaurants, supermarkets, meat and seafood, and fruit and vegetables
- Storefront search and active-store listing backed by the Supabase stores catalog; no invented store records or fake sales metrics
- Role-aware workspace shell for super admin, admin, merchants, captain, and customer
- Existing Supabase SSR cookie sessions, email/password authentication, confirmation/resend, password recovery/reset/change, and explicit session revocation
- Existing role-protected workspace routes and merchant store/product foundations
- Customer, merchant, captain, and super-admin dashboard UI foundations; features that need orders, wallet, ledger, or live GPS backends are visibly identified as not yet connected
- Supabase project and Auth dashboard configuration remain pending until the two designated project references are authorized and verified

The current refresh is on branch `uiux/shakhstore-orange-final`. It does not merge into `main` or deploy production automatically.

## Local development

Requirements: Node.js 22.x.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `.env.local` from the authorized Supabase project's Connect dialog before testing authentication. The current `.env.example` still references the previously connected `shakh_platform` project; do not replace it with another project URL until the user's designated primary and test projects are authorized and confirmed. Never put secret or service-role keys in browser-visible variables.

## Product roles

- `super_admin` — Super Admin
- `admin` — Admin
- `restaurant` — Restaurant
- `supermarket` — Supermarket
- `produce_vendor` — Fruits & Vegetables
- `meat_seafood_vendor` — Meat & Seafood
- `captain` — Captain
- `customer` — Customer

Merchant accounts are limited to their own store and assigned category. Super Admin can publish across categories as **SHAKH STORE**. Sign-up never accepts a role from the browser; role assignment must be made through trusted server-side administration.

## Confirmed customer payment and commission rules

- Customers may pay either by Cash on Delivery or by the Shakh Wallet.
- Merchant commission is charged per actual kilogram sold. The current agreed example is 350 IQD per kg; the final rate must be configurable by the Super Admin and versioned per merchant/agreement.
- The platform's captain/delivery commission is 20% of the delivery fee, not 20% of the goods subtotal. The captain's remaining 80% is the captain's delivery share under the current example agreement.
- Example: 1 kg meat = 18,000 IQD; delivery = 1,000 IQD; customer total = 19,000 IQD. Merchant commission = 350 IQD; platform share of delivery = 200 IQD; total platform commission = 550 IQD; merchant net = 17,650 IQD; captain delivery share = 800 IQD.
- Merchant and captain prepaid wallets are funded before work. Commission obligations are reserved and settled from the relevant wallet only under a successful, completed and verified order settlement.
- Commission rules must support fixed-per-kg, percentage, and fixed-per-order agreements where configured; no client can alter an agreed commission.
- All money values are integer IQD, never floating-point currency.
- Wallet movements use an auditable ledger. Completed ledger entries are immutable; corrections are represented by compensating entries.
- Wallet funding, order settlement, commission collection, refunds, and reversals must be atomic and idempotent.
- COD collection and wallet checkout are payment methods, not commission revenue. Wallet top-ups are liabilities/balance funding, not platform revenue.
- The UI does not claim the ledger, order settlement, or refund automation is complete until the corresponding backend and verification are implemented.

## Security and integration

Supabase Auth uses cookie-based SSR sessions. Next.js 16 `src/proxy.ts` refreshes tokens using `supabase.auth.getClaims()`; protected workspace layouts independently verify the user role. Proxy redirects are not the sole authorization boundary.

Role authorization reads trusted `app_metadata.role`, never browser-editable `user_metadata`. PostgreSQL RLS must additionally enforce owner, store, role, and category boundaries. Public clients use only the project URL and publishable key. Secret API keys remain server-side.

## Database change policy

- Keep schema changes in versioned Supabase migrations.
- Generate migration files with the Supabase CLI once access to the designated primary project is verified.
- Never edit an already-applied migration; add a new migration for each later schema change.
- Enable RLS on every exposed table and explicitly grant Data API access as required.
- No mock, demo, seed, or test data/files are added to the production app structure.

## Transactional business email

Resend is configured as the outbound email provider for order confirmations, merchant notifications, captain delivery assignments, and platform operations.

- Use only the dedicated sending-only API key scoped to the verified `mail.daim-post.online` domain.
- Keep `RESEND_API_KEY` server-side and encrypted in Vercel; never expose it through `NEXT_PUBLIC_*` or source control.
- Sender identity is configured by `RESEND_FROM_EMAIL`; optionally set `RESEND_REPLY_TO`.
- Email templates are Kurdish Sorani-first and RTL.
- Sending helpers are server-side modules and must only be called after the application's order/role authorization has succeeded.
- Use one stable idempotency key per logical notification, e.g. `order-confirmation/<order-id>`, to prevent duplicates during retries.
- This integration handles application business notifications. Supabase Auth SMTP/email templates remain a separate configuration step.

See [docs/resend-email.md](docs/resend-email.md).

## Progressive Web App

Shakh Store includes an installable PWA foundation with a Sorani RTL manifest, static 192/512 px PNG icons, production service-worker registration, and a generic offline fallback. The service worker intentionally does not cache authenticated pages, personal data, API responses, or financial/order information. Transactions remain online-only until a separately designed secure sync workflow exists.

See [docs/pwa.md](docs/pwa.md) and [docs/product-roadmap.md](docs/product-roadmap.md).

## Deployment

The Vercel project is linked to this repository and configured for Next.js with Node.js 22.x. Confirm the preview build on the feature branch before treating the UI refresh as released. No production deployment is claimed by this change.

See [docs/architecture.md](docs/architecture.md) and [docs/auth-and-access.md](docs/auth-and-access.md).
