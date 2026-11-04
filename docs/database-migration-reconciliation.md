# Database migration reconciliation

## Target project

- Supabase project reference: `vtxntrcsjmnmbnfxhfgz`
- Project URL: `https://vtxntrcsjmnmbnfxhfgz.supabase.co`
- Region: `eu-central-1`
- Database engine: PostgreSQL 17

## Live database verification

On 2026-11-04, the connected Supabase project reported 25 recorded migrations. All 23 tables in the `public` schema had Row Level Security enabled.

The repository did not contain the existing historical migration files when inspected. Do not run `supabase db reset` or treat this repository as a complete fresh-project bootstrap until the full applied migration history has been recovered and reconciled with the live project.

Recover the baseline through the Supabase CLI against the confirmed project reference, review the resulting schema diff, and commit the complete migration history before using automated migration pushes in a new environment.

## Migration recorded on 2026-11-04

The live database received migration version `20261104103925` named `grant_merchant_application_insert_authenticated`.

It grants `INSERT` on `public.merchant_applications` to the `authenticated` role. This is required by the existing server action in `src/app/workspace/merchant-application/actions.ts`, which inserts a signed-in user's application through the publishable-key SSR client.

The existing RLS INSERT policy remains enabled and restricts submitted rows to the caller's own `auth.uid()`, with review and store-assignment fields unset. Post-change verification confirmed `authenticated` has INSERT privilege and RLS remains enabled. A rollback-only SQL probe executed as `authenticated` with a customer JWT claim successfully inserted a temporary row under the existing policy; the transaction was rolled back and a follow-up count confirmed zero probe rows remained.

SQL source is recorded in `supabase/migrations/20261104103925_grant_merchant_application_insert_authenticated.sql`.

## Product catalogue privilege boundary

The merchant product form now inserts only columns granted to `authenticated`; database defaults assign `status = 'draft'` and `is_available = true`. Direct status changes are deliberately not granted to `authenticated`, so the UI no longer offers a nonfunctional publish/archive action. A future audited server-side publication workflow must be implemented before those controls return.



## M04 product publication workflow

The live project received migration version `20261104105234` named `admin_product_publication_workflow`.

- `public.product_moderation_events` is an RLS-enabled, append-only audit table. Authenticated administrators can read it; clients have no INSERT, UPDATE or DELETE privileges.
- `public.admin_set_product_status_v1` is an invoker RPC wrapper over a private SECURITY DEFINER function. The private function checks `auth.uid()` and the current `auth.users.raw_app_meta_data.role`, not user-editable metadata or a potentially stale role claim.
- The RPC locks the product and store rows, requires the product version shown in the admin review screen, checks store/category/price/availability before publication, blocks admins from publishing the platform-owned store, and writes an audit event in the same transaction.
- Archived products must return to draft before they can be published again.
- A rollback-only negative authorization probe as a customer account confirmed that a normal customer cannot execute the moderation RPC and sees no audit events.

SQL source is recorded in `supabase/migrations/20261104105234_admin_product_publication_workflow.sql`.

## M04 publication workflow verification

The live database received migration version `20261104105234` named `admin_product_publication_workflow`.

- The audit table has RLS enabled; authenticated users have SELECT only, no INSERT/UPDATE/DELETE, and anonymous users have no SELECT.
- The public RPC is SECURITY INVOKER, the implementation is in the private schema as SECURITY DEFINER with an empty search_path, and only authenticated users may execute the wrapper/private function. Anonymous execution is revoked.
- A rollback-only customer probe was denied by the database role check and returned no audit rows.
- A rollback-only positive probe temporarily assigned Super Admin metadata to an existing customer inside the transaction, created a temporary product, published it through the RPC, and confirmed one audit event. The transaction was rolled back; a follow-up query confirmed zero temporary products, zero temporary audit events, and the account role restored to customer.
- Post-migration verification confirms the private SECURITY DEFINER function has `search_path=""`, authenticated EXECUTE is enabled, and anon EXECUTE is disabled.

## Outstanding checks

- Recover and commit the full historical migration baseline.
- Verify merchant application submission end-to-end with a normal customer account.
- Verify admin review, role assignment and store creation end-to-end.
- Review the API exposed-schema configuration in Supabase Dashboard; the database query interface does not expose this project setting.
- Enable leaked-password protection in Supabase Auth and re-run Security Advisor.
- Run lint, typecheck and build; then exercise the publication UI with a real provisioned Admin/Super Admin account and active merchant product on a deployed preview.

## Runtime log review (2026-11-04)

The connected project's recent logs were reviewed by service and status:

- Four Auth log events were recorded as HTTP 400 `invalid_credentials` for password grant requests. These are failed credential attempts; no account identifiers are included in this report.
- No PostgREST 4xx events were returned by the recent-log query.
- No Edge/API gateway 4xx/5xx events were returned by the recent-log query.
- PostgreSQL log history contains several undefined-relation/undefined-column events. Inspection shows the `captain_user_id` column error came from an earlier M06 schema attempt; the current `public.delivery_assignments.captain_user_id` column exists and the M06–M16 migration versions are recorded. Other undefined-relation events came from internal Realtime/migration-history instrumentation lookups and a diagnostic query, not from a recent PostgREST application request.

This is a recent-log snapshot, not a guarantee that no future runtime errors will occur. Continue monitoring after a preview deployment and real authenticated workflows.

