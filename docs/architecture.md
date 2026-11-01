# SHAKH Platform Architecture

## Architectural style

Start with a modular monolith. Keep one deployable Next.js application and separate business capabilities by domain. Avoid premature microservices; extract a service only when operational evidence justifies it.

## Domain boundaries

1. **Identity and access** — authentication, verified sessions, role assignments, account status, and protected route policies.
2. **Merchant operations** — merchant onboarding, assigned store, store profile, catalog ownership, opening status, and category restrictions.
3. **Catalog** — categories, products, availability, pricing, media, and platform-owned listings.
4. **Discovery** — customer browsing, search, category navigation, and store discovery.
5. **Orders** — cart, checkout, order lifecycle, line-item price snapshots, cancellation, and refund state.
6. **Delivery** — captain availability, assignment, location updates, delivery milestones, and navigation links.
7. **Wallet and ledger** — customer and merchant wallets, captain earnings, prepaid top-ups, posting charges, platform revenue, and settlement.
8. **Notifications** — in-app events and delivery/order status communication.
9. **Rewards and sharing** — referral/share attribution, reward eligibility, and fraud controls.
10. **Administration** — platform settings, role governance, moderation, audit trails, and operational reporting.

## Access model

| Role | Scope |
|---|---|
| Super Admin | Global platform operations and cross-category publishing |
| Admin | Explicitly granted operational scope |
| Restaurant | Own restaurant/store and restaurant category |
| Supermarket | Own supermarket/store and supermarket category |
| Fruits & Vegetables | Own store and produce category |
| Meat & Seafood | Own store and meat/seafood category |
| Captain | Own profile, assigned deliveries, location, and earnings |
| Customer | Own profile, addresses, orders, wallet, and rewards |

Role assignment must be controlled by trusted server-side administration. Never authorize a request from a role value supplied by a browser or user-editable metadata.

## Commercial and financial rules

- Currency: IQD, represented as integer minor units according to the platform's IQD convention.
- Ledger: append-only records with debit/credit accounting, explicit transaction references, and idempotency keys.
- Delivery commission: 80% captain / 20% platform.
- Posting charges and prepaid wallet movements must use ledger transactions.
- Order totals and pricing snapshots are captured at order placement.
- Settlement, refund, and balance mutations must run atomically in the database.

The exact fee schedule, rounding convention, tax treatment, and refund policy must be defined before financial transactions are enabled.

## Frontend delivery sequence

1. Establish the visual system and responsive Sorani RTL public shell.
2. Build authenticated route groups and role-specific application shells.
3. Build customer discovery and checkout interfaces.
4. Build merchant catalog and order-management interfaces.
5. Build captain delivery and earnings interfaces.
6. Build administration, wallet, ledger, and reporting interfaces.
7. Connect each domain to Supabase with validated server actions, RLS, and audit logging.

The current repository intentionally stops before authentication and database integration because the connected Supabase account cannot yet access the supplied project reference.

## Migration discipline

Use the Supabase CLI to create each migration with a generated timestamp. Review SQL, test it against the intended project, run security and performance advisors, then commit the migration. Once a migration is applied, treat it as immutable; future changes must be additive migrations.
