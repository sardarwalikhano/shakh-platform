# SHAKH Platform — Integrated M00–M11 Audit

**Snapshot date:** 2026-11-03  
**Repository:** `sardarwalikhano/shakh-platform`  
**Update branch:** `feat/m00-m11-integrated-modernization`  
**Base:** `main` at `d114c5b66c236f592ee1e5d3d0285aa10288e120`

## Executive status

This update consolidates safe changes for the modules that have an existing implementation and adds a live, RLS-governed storefront surface. It does not claim that M00–M11 are all complete: the live schema contains identity, profiles, stores, catalog products, merchant intake, and store moderation, but it does not contain order, delivery, financial-ledger, or notification domain tables.

No production data, remote schema, migration history, production environment variable, or production deployment was changed as part of this branch. No previously applied migration was edited.

## Module-by-module status

| Module | Repository roadmap scope | Existing baseline | Changes in this branch | Status |
| --- | --- | --- | --- | --- |
| M00 | Platform foundation and PWA | Next.js foundation, Sorani RTL shell, manifest, icons, conservative offline worker | Make the public home page request-dynamic and use the non-throwing authenticated-context helper so a build without Supabase public environment variables does not fail while prerendering `/`; link category cards to the real marketplace | Hardened in branch; PWA device verification still pending |
| M01 | Identity and account profile | Supabase SSR Auth flows, profile/security routes, email recovery | Password-reset errors now log safe structured metadata (name/status/code) without logging email or credentials; generic user response remains to prevent account enumeration | Source hardened; Auth dashboard and end-to-end mail tests pending |
| M02 | Shared application shell | Role-specific RTL workspace shell, desktop/mobile navigation | Share role-specific nav item definitions between desktop and mobile, add product management to desktop merchant navigation, and make nested navigation paths active | Updated in branch; role/device QA pending |
| M03 | Merchant onboarding and stores | Application intake, moderation Edge Function, store profile, moderation audit RPC | Add a single server-side merchant guard requiring a trusted merchant role and exactly one owned non-platform store; deny suspended stores to a dedicated page and keep pending/rejected states in access-pending; use the guard in all merchant pages and mutations | Updated in branch; manual account/RLS matrix still pending |
| M04 | Catalog and inventory | Merchant product draft creation, store/category/product tables and RLS | Restrict merchant actions to the guarded store; replace a status update that conflicts with the live column grants with availability-only updates for already-published products; check the affected row before returning success | Updated in branch; publication/moderation workflow remains incomplete |
| M05 | Customer storefront | Public home shell; no working store discovery page | Add `/marketplace` using active non-platform store rows and `/stores/[slug]` using only published, available product rows. Public results are constrained by the existing RLS policies | Initial live-data storefront implemented; search/favorites/addresses and populated catalog remain pending |
| M06 | Cart, checkout and order management | No order/cart schema or server workflow found | No fake order flow or speculative schema added | Not implemented; requires approved business rules and additive schema design |
| M07 | Captain and delivery operations | Captain role shell only; no delivery/assignment/location schema found | No mock jobs or fake tracking added | Not implemented; requires dispatch, assignment, transition, location, and proof-of-delivery design |
| M08 | Wallet and financial ledger | Financial invariants are documented; no wallet/ledger tables or settlement RPCs found | No editable balance fields or simulated money movement added | Not implemented; requires accounting model, idempotency, and atomic settlement design |
| M09 | Notifications and realtime | Resend helper/templates exist; no notification tables or realtime subscription implementation found | No artificial realtime events added | Partial foundation only; event outbox, preference, retry, and multi-session tests pending |
| M10 | Super Admin and reporting | Admin role shell and merchant moderation exist; no general reports/audit analytics data model found | Existing merchant moderation remains available; no fake reports or financial KPIs added | Partial; user governance, reporting, and operations center pending |
| M11 | Production hardening | Lint/typecheck/build scripts exist; no test runner, lockfile, or GitHub Actions workflow found | Add a GitHub Actions quality workflow, a migration filename/duplicate-version check, add the script to package.json, and pin direct dependency versions | CI added in branch; test suite, lockfile, backups, monitoring, and release verification remain pending |

## Verified Supabase baseline

**Project:** `shakh_platform`  
**Project ref:** `vjfzdlmqrmzaufnqsdre`  
**Region:** `eu-west-3`  
**PostgreSQL:** `17.11`

Live public tables found:

- `profiles`
- `catalog_categories`
- `stores`
- `products`
- `merchant_applications`
- `store_moderation_events`

RLS was enabled on all six tables at inspection time. The live row counts observed were: 7 profiles, 0 catalog categories, 5 stores (1 platform store and 4 active merchant stores), 0 products, 4 merchant applications, and 8 moderation events. These observed counts imply the new marketplace can show active store records but currently has no category rows or product cards to display. These are a time-specific inspection snapshot, not a guaranteed ongoing count.

There are no live public tables for carts, orders, deliveries, captain assignments, wallets, ledgers, notification inboxes, or event outboxes. A direct inspection of the `supabase_realtime` publication returned no included tables, and no custom Storage buckets were present. This is why M06–M10 have not been represented with fake UI data or guessed SQL; Realtime and upload workflows are not accepted as operational yet.

### Applied migration history

The live Supabase migration history contained these nine entries, matching the nine SQL files currently in `supabase/migrations`:

1. `20261101093530_initial_auth_profiles_catalog_rls`
2. `20261101093549_optimize_catalog_rls_and_indexes`
3. `20261101093658_tighten_catalog_column_privileges`
4. `20261101094051_revoke_broad_default_public_grants`
5. `20261101094118_restrict_anonymous_table_privileges`
6. `20261101132254_m03_merchant_onboarding_stores`
7. `20261101132343_m03_merchant_application_fk_indexes`
8. `20261101132641_m03_applicant_identity_default`
9. `20261101133728_m03_store_moderation_audit`

No migration was added by this branch because the safe M00–M05 source changes use existing tables and columns. M06–M10 require an approved schema and business rules before new DDL can be designed. The applied files above must remain immutable.

## RLS, grants, and application authorization notes

- Role authorization uses trusted `app_metadata.role`, not browser-editable `user_metadata`.
- Merchant access is now checked server-side for role, ownership, uniqueness, platform-store exclusion, and active status.
- Product merchant update grants deliberately do not include `products.status`; the previous UI attempted to update that protected column. The revised merchant action changes only `is_available` on a product whose status is already `published`.
- Product publication status still has no complete trusted moderation action in the current app. Do not solve this by granting merchants broad status-update rights.
- Public marketplace queries request active stores and published/available products; PostgreSQL RLS remains the actual data-access boundary.
- The deployed `review-merchant-application` Edge Function is active with JWT verification enabled. Multi-account approval/rejection/suspension tests have not been run in this audit.

## Security and performance findings

- Supabase Security Advisor reported `auth_leaked_password_protection` as a warning because leaked-password protection is disabled. This requires a project Auth setting change in the Supabase Dashboard; it was not changed from this branch.
- Performance Advisor reported seven unused indexes. They were not removed because an unused-index signal alone is not proof that an index is unnecessary.
- No service-role key was added to source code or browser-visible environment variables.
- A Vercel runtime-error cluster showed nine password-recovery error events on `/forgot-password`. The retained log window did not provide the original error detail, so the root cause is not confirmed. This branch improves safe diagnostics but does not claim the recovery failure has been fixed.

## Vercel deployment observations

Two Vercel projects are connected to the repository:

1. `shakh-platform` — Next.js project; its preview deployment for the earlier M03 branch reached `READY`.
2. `shakh-platform-au64` — separate project; a recent build failed during prerender of `/` because `NEXT_PUBLIC_SUPABASE_URL` and the publishable key were not configured for that project. The Next.js compile and TypeScript stages had completed before the prerender failure.

The public home page in this branch no longer throws merely because Supabase public configuration is absent at build time. Vercel project settings and environment variables were not modified. The correct production project/domain ownership should be confirmed before changing or removing the secondary project.

## Realtime, Storage, and seed-data status

- The `supabase_realtime` publication contained no tables when inspected. No multi-session event propagation test was performed.
- The Storage bucket list contained no custom buckets. Product/store image uploads and bucket policies are therefore not implemented or verified.
- No seed data or mock records were added. Existing live table counts were not changed by this branch.

## Verification status

| Check | Status |
| --- | --- |
| GitHub source inspection | Completed |
| Supabase live schema and migration history inspection | Completed |
| Supabase Security/Performance Advisor inspection | Completed |
| Merchant access manual matrix | Documented; not executed |
| Cross-account RLS verification | Not executed |
| Auth signup/confirmation/recovery end-to-end | Not executed |
| Two-session Realtime test | Not executed |
| Local ESLint/typecheck/build | Not run in this environment |
| GitHub Actions quality workflow | Added in branch; result pending |
| New branch Vercel preview build | Pending |
| Production deployment | Not performed |
| Production migration execution | Not performed |

## Files changed in this branch

- `src/lib/auth/guards.ts`
- `src/app/page.tsx`
- `src/app/forgot-password/page.tsx`
- `src/app/merchant-suspended/page.tsx` (new)
- `src/app/workspace/merchant/layout.tsx`
- `src/app/workspace/merchant/page.tsx`
- `src/app/workspace/merchant/store/actions.ts`
- `src/app/workspace/merchant/store/page.tsx`
- `src/app/workspace/merchant/products/actions.ts`
- `src/app/workspace/merchant/products/page.tsx`
- `src/components/workspace/navigation.tsx`
- `src/app/marketplace/page.tsx` (new)
- `src/app/stores/[slug]/page.tsx` (new)
- `src/app/workspace-preview/page.tsx` (removed demo route)
- `package.json`
- `.github/workflows/quality.yml` (new)
- `scripts/check-migrations.mjs` (new)
- `docs/audit/m00-m11-integrated-audit.md` (new)
- `docs/development/database-migration-workflow.md` (new)

## Outstanding release blockers

1. Configure and verify Supabase Auth URL allowlist, templates, SMTP, and leaked-password protection.
2. Confirm the correct Vercel project and add missing public Supabase environment variables only to the intended project.
3. Add and review a package lockfile before relying on lockfile-based reproducible installation.
4. Build a real product moderation/publication path without broadening merchant database privileges.
5. Approve domain-specific data models and accounting invariants before M06–M10 migrations.
6. Run browser-based role, RLS, multi-session Realtime, accessibility, and responsive checks.
7. Establish and verify backup/restore and monitoring runbooks before production release.
