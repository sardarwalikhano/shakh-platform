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
| M02 | Shared application shell | Desktop sidebar, mobile bottom navigation, role-aware menus, shared page headers, loading/error/empty states, accessible focus and RTL design tokens | Production build passes; role route guards remain enforced; active navigation, mobile safe-area, keyboard focus and page states are checked |
| M03 | Merchant onboarding and stores | Customer application intake, admin moderation, trusted category-to-role assignment, owner-scoped store profile, approval/rejection, store suspension/reactivation with audit history | RLS isolates applications and stores; only trusted admin approval grants merchant role; store owners cannot alter moderation fields |
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
- Workspace UI: shared RTL shell, role-aware desktop/mobile navigation and common page states are implemented. M03 adds live merchant application, admin review queue and store profile routes.
- PWA: v1 shell, manifest, install prompt and conservative offline fallback are implemented. Push notifications and offline transactions are intentionally deferred.

## Release rule

A milestone is complete only when its code is deployed, its acceptance gate has been exercised against the intended environment, and any remaining limitation is recorded. A Git commit or a successful build alone does not mark a workflow complete.


## M03 implementation status

- Additive database migrations are applied for merchant applications, store profile fields, owner uniqueness, moderation RPC, identity default and foreign-key indexes.
- Customer application and personal application history, admin review queue, trusted category-to-role assignment Edge Function, and merchant-owned store profile are implemented in source.
- Production release remains gated on the Edge Function and application deployment reporting READY, followed by signed-in role tests and cross-account RLS checks. Until those checks pass, M03 is implemented but not fully accepted.

- M03 moderation: admin/super-admin store suspension and reactivation are recorded in an append-only store moderation event table; SHAKH STORE is excluded.


## M04 implementation status

- Merchant product creation is restricted to the database-granted insert columns; status and availability use database defaults so newly created products remain drafts.
- Direct client-side publication/status updates are intentionally unavailable because the authenticated role has no UPDATE privilege on the product status column. Publication must be implemented as an audited server-side workflow before the UI exposes that control.
- M04 must not be marked complete until product creation is verified with a merchant account, store/category isolation is tested, and the publication workflow has its own server-side authorization and fee/ledger acceptance checks.


## M04 product publication workflow implementation status

- Merchant-created products start as drafts using database defaults. Merchants do not receive direct UPDATE privileges on the `status` column.
- Admin and Super Admin review is exposed at `/workspace/admin/catalog/products`; the page is protected by the admin route layout and server action.
- `admin_set_product_status_v1` checks the authenticated user ID and the current `auth.users.raw_app_meta_data.role`, locks the product and store rows, and requires the exact `updated_at` version shown during review.
- Publishing requires an active store, positive price, availability, and an active category. Only Super Admin can moderate the platform-owned SHAKH STORE. Archived products must first return to draft before republishing.
- Every status change is written atomically to an append-only `product_moderation_events` audit table. Authenticated clients can read the log only as Admin/Super Admin and cannot insert, update, or delete audit records.
- Rollback-only SQL probes exercised both the customer-denial path and the Super Admin publication path; temporary user-role, product and audit changes were fully rolled back.
- M04 remains incomplete until a real merchant creates a product, a real Admin/Super Admin reviews it in a deployed preview, and the full product/storage/inventory acceptance suite passes.
