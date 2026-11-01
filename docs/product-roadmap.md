# SHAKH Product Roadmap

## Delivery principles

- Ship one milestone at a time. Each milestone must pass its acceptance checks before dependent work begins.
- Preserve all prior working updates. Use additive migrations and never rewrite an applied Supabase migration.
- Build real business workflows; do not add mock, demo, or fake financial data to production.
- Treat PostgreSQL RLS and trusted server-side authorization as enforcement boundaries, not UI visibility.
- Keep money in integer IQD and make financial records auditable and immutable.
- Test production and preview environments separately.

## Milestones

| ID | Milestone | Main deliverables | Acceptance gate |
|---|---|---|---|
| M00 | Platform foundation and PWA | Verified custom domain, production/preview URL handling, installable manifest, icons, service worker, offline shell | Production build ready; domain resolves; manifest and icons valid; SW registered; no sensitive data cached |
| M01 | Identity and account profile | Sign-up, sign-in, email confirmation/resend, password recovery/reset/change, session revocation, profile completion, account security | Auth URL/provider/templates/SMTP configured; end-to-end Auth tests pass on production and preview; owner-only profile RLS verified; role claims cannot be changed by browser |
| M02 | Shared application shell | Responsive RTL navigation, role-aware menu, loading/error/empty states, common design tokens | Keyboard, mobile, RTL and role-navigation checks pass |
| M03 | Merchant onboarding and stores | Merchant applications, category assignment, store profile, approval/suspension lifecycle | Merchant can access only its own store and allowed category |
| M04 | Catalog and inventory | Categories, product CRUD, media upload, variants, stock, availability and pricing | RLS and storage policies prevent cross-store access; stock updates are consistent |
| M05 | Customer storefront | Store discovery, search, category filters, product details, favorites and addresses | Public catalog shows only active stores and published/available products |
| M06 | Cart, checkout and order management | Cart, delivery address, pricing snapshot, order state machine, cancellation/refund rules | Orders are created atomically and idempotently; no client can alter authoritative totals or status |
| M07 | Captain and delivery operations | Captain onboarding, availability, dispatch/assignment, pickup/drop-off, GPS and proof of delivery | Assignment, transitions and location access are permission-controlled and auditable |
| M08 | Wallet and financial ledger | Customer/merchant/captain wallets, top-up, fees, commissions, settlement, refunds and reconciliation | Append-only ledger; integer IQD; atomic idempotent movements; captain/platform split rule verified |
| M09 | Notifications and realtime | In-app notifications, email event integration, Web Push subscriptions, preferences and retries | Events are emitted after committed transactions; retry/idempotency and opt-in are tested |
| M10 | Super Admin and reporting | User/role administration, stores moderation, catalog governance, finance reports, audit log and platform settings | Privileged actions are server-authorized, logged and reviewed |
| M11 | Production hardening | Security review, accessibility, performance, monitoring, backup/restore, load and release tests | Release checklist and operational runbooks pass |

## Dependency order

`M00 → M01 → M02 → M03 → M04 → M05 → M06 → M07 → M08`

`M09` starts after the relevant domain events and transaction boundaries exist in M06–M08. `M10` is developed alongside the workflows it governs, but privileged controls are released only after the corresponding RLS and audit behavior is verified. `M11` is continuous and is the final release gate.

## Current implementation baseline

- Domain: Vercel reports `daim-post.online` and `www.daim-post.online` verified on `shakh-platform`; apex redirects to `www` with status 308.
- Auth: M01 application code includes SSR cookie sessions, email/password sign-in/sign-up, confirmation/resend, recovery/reset, reauthenticated password change and explicit session revocation. Supabase dashboard provider, URL, templates, SMTP and end-to-end verification remain release checks.
- Profile: own-profile display and update flow exists for full name, phone and preferred locale. Email and trusted role are read-only in the profile screen.
- Business email: Resend server helpers and Sorani templates exist; they still need to be connected to committed order/delivery events.
- PWA: v1 shell, manifest, install prompt and conservative offline fallback are implemented. Push notifications and offline transactions are intentionally deferred.

## Release rule

A milestone is complete only when its code is deployed, its acceptance gate has been exercised against the intended environment, and any remaining limitation is recorded. A Git commit or a successful build alone does not mark a workflow complete.
