# SHAKH Platform

A Kurdish-first, RTL multi-vendor commerce and delivery platform for restaurants, supermarkets, produce sellers, meat and seafood sellers, couriers, and customers.

## Current implementation

This repository starts clean and contains only the SHAKH platform foundation. It does not import code, assets, configuration, or database objects from the previous `shakh_delivery` project.

- Next.js App Router and React with strict TypeScript
- Tailwind CSS v4
- Kurdish Sorani-first RTL storefront
- SHAKH visual palette: forest green, emerald, amber, white, slate, and red
- Supabase SSR client utilities, email/password sign-in, sign-up, email confirmation, and sign-out
- Role-protected workspace routes for all platform roles
- Database and Auth dashboard configuration remain pending until access to the designated Supabase project is authorized

## Local development

Requirements: Node.js 22.x.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `.env.local` from the Supabase project's Connect dialog before testing authentication. Do not put secret keys in browser-visible variables.

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

## Financial invariants

- All money values are integer IQD, never floating-point currency.
- Wallet movements use an auditable ledger.
- Completed ledger entries are immutable; corrections are represented by compensating entries.
- Wallet and order settlement operations must be atomic and idempotent.
- Delivery commission allocation is 80% to the captain and 20% to the platform unless a versioned business rule changes it.
- Posting charges, prepaid wallet funding, refunds, and settlements must be ledger transactions, not editable balance fields.

## Security and integration

Supabase Auth uses cookie-based SSR sessions. Next.js 16 `src/proxy.ts` refreshes tokens using `supabase.auth.getClaims()`; protected workspace layouts independently verify the user role. Proxy redirects are not the sole authorization boundary.

Role authorization reads trusted `app_metadata.role`, never browser-editable `user_metadata`. PostgreSQL RLS must additionally enforce owner, store, role, and category boundaries. Public clients use only the project URL and publishable key. Secret API keys remain server-side.

## Database change policy

- Keep schema changes in versioned Supabase migrations.
- Generate migration files with the Supabase CLI once project access is available.
- Never edit an already-applied migration; add a new migration for each later schema change.
- Enable RLS on every exposed table and explicitly grant Data API access as required.
- No mock, demo, seed, or test files/data are added to the production app structure.

## Deployment

The Vercel project is linked to this repository and configured for Next.js with Node.js 22.x. Check the current build status in Vercel before treating the site as live.

See [docs/architecture.md](docs/architecture.md) and [docs/auth-and-access.md](docs/auth-and-access.md).
