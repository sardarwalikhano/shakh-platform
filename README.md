# SHAKH Platform

A Kurdish-first, RTL multi-vendor commerce and delivery platform for restaurants, supermarkets, produce sellers, meat and seafood sellers, couriers, and customers.

## Current implementation

This repository starts clean and contains only the SHAKH platform foundation. It does not import code, assets, configuration, or database objects from the previous `shakh_delivery` project.

- Next.js App Router and React
- TypeScript with strict checking
- Tailwind CSS v4
- Kurdish Sorani-first RTL interface
- SHAKH visual palette: forest green, emerald, amber, white, slate, and red
- Frontend-first delivery: no database client or authentication flow is activated until access to the designated Supabase project is verified

## Local development

Requirements: Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

Before connecting deployment, run:

```bash
npm run lint
npm run typecheck
npm run build
```

## Product roles

- Super Admin
- Admin
- Restaurant
- Supermarket
- Fruits & Vegetables
- Meat & Seafood
- Captain
- Customer

A merchant account is restricted to its assigned store and category. Super Admin has cross-category publishing rights. Platform-owned listings are attributed to **SHAKH STORE**.

## Financial invariants

- All monetary values are stored as integer IQD units, never floating-point currency.
- Wallet movements use an auditable ledger.
- Completed ledger entries are immutable; corrections are represented by compensating entries.
- Wallet and order settlement operations must be atomic and idempotent.
- Delivery commission allocation is 80% to the captain and 20% to the platform unless an explicitly versioned business rule changes it.
- Prepaid wallet funding, posting commissions, refunds, and settlement movements must be represented as ledger transactions rather than editable balance fields.

## Security and data integration

Supabase Auth, PostgreSQL, Storage, Realtime, and Row Level Security will be integrated only after the supplied project is accessible to the connected account. No secrets belong in source control. Browser configuration may contain only the project URL and publishable key; secret/service-role credentials remain server-side.

Every exposed table must have RLS enabled and policies must enforce role, ownership, store, and category boundaries. User-editable profile metadata must not be used for authorization.

## Database change policy

- Keep schema changes in versioned Supabase migrations.
- Generate migration files using the Supabase CLI workflow once project access is available.
- Never edit an already-applied migration. Add a new migration for every subsequent schema change.
- Do not add mock, demo, seed, or test data/files to production application structure.

## Deployment

The intended deployment target is Vercel, connected to this GitHub repository. The Vercel GitHub integration must be authorized before the project can be linked and deployed.

See [docs/architecture.md](docs/architecture.md) for the initial domain boundaries and delivery sequence.
