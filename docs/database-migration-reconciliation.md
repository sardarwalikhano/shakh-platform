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

The existing RLS INSERT policy remains enabled and restricts submitted rows to the caller's own `auth.uid()`, with review and store-assignment fields unset. Post-change verification confirmed `authenticated` has INSERT privilege and RLS remains enabled.

SQL source is recorded in `supabase/migrations/20261104103925_grant_merchant_application_insert_authenticated.sql`.

## Outstanding checks

- Recover and commit the full historical migration baseline.
- Verify merchant application submission end-to-end with a normal customer account.
- Verify admin review, role assignment and store creation end-to-end.
- Review the API exposed-schema configuration in Supabase Dashboard; the database query interface does not expose this project setting.
- Enable leaked-password protection in Supabase Auth and re-run Security Advisor.
