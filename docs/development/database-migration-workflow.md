# Supabase Database Migration Workflow — SHAKH

## Current baseline

The live project `vjfzdlmqrmzaufnqsdre` has nine applied migrations. Their filenames and versions are listed in [the integrated M00–M11 audit](../audit/m00-m11-integrated-audit.md).

**Do not edit, rename, delete, or replay an applied migration.** Every subsequent schema change must be a new timestamped migration.

At the time of this audit, the repository contains `supabase/migrations/` but does not contain `supabase/config.toml`. Therefore the migration history has been compared with the live Supabase history through the Supabase project tooling, but a reproducible local Supabase CLI stack has not yet been verified.

## One-time local setup

1. Install the Supabase CLI and Docker using the current official installation instructions.
2. Initialize the local Supabase project configuration with `supabase init`; review the generated `supabase/config.toml` before committing it.
3. Confirm the local database major version matches the remote PostgreSQL major version (currently 17).
4. Authenticate with the CLI and link only the intended project reference:
   ```bash
   supabase login
   supabase link --project-ref vjfzdlmqrmzaufnqsdre
   ```
5. Compare local and remote migration history before making schema changes:
   ```bash
   supabase migration list
   ```
6. If there is evidence of remote schema drift, inspect it and capture it with `supabase db pull`. Review all generated SQL manually. Do not run a linked reset to reconcile a production database.

## New migration workflow

For each new schema change:

1. Design the table/columns, constraints, indexes, functions, grants, RLS policies, and rollback/recovery strategy before writing SQL.
2. Generate the migration filename with the CLI:
   ```bash
   supabase migration new <descriptive_snake_case_name>
   ```
3. Write additive SQL. Prefer guarded, narrowly scoped changes where appropriate; validate assumptions against the actual schema.
4. Start a local Supabase stack and verify the complete migration chain locally:
   ```bash
   supabase start
   supabase db reset
   supabase migration list
   ```
   `supabase db reset` is destructive to the local development database only. Never add `--linked` to this command when the linked project is production.
5. Run RLS/privilege tests for anonymous, customer, merchant, captain, admin, and super-admin contexts as relevant. Include cross-account and cross-store negative tests.
6. Generate updated TypeScript types from the same verified local schema and commit them with the migration.
7. Review the final diff and the migration filename check:
   ```bash
   npm run check:migrations
   ```
8. Open a PR. Do not execute production DDL from a feature branch.

## Production migration gate

Only after a reviewed PR, verified backup/recovery plan, and explicit production approval:

1. Confirm the CLI is linked to the intended project and that `supabase migration list` matches the PR baseline.
2. Preview the changes:
   ```bash
   supabase db push --dry-run
   ```
3. Have a second reviewer inspect the SQL and dry-run output, including lock impact and data backfill behavior.
4. Apply only the approved pending migrations:
   ```bash
   supabase db push
   ```
5. Verify the new history entry, schema, constraints, policies, grants, and representative records after execution.
6. Capture the resulting state and update the audit report.

Never use `supabase db reset --linked` on production. It drops the linked remote schema/data and is reserved for disposable development or staging projects.

## Recovery principles

- Add a forward-fix migration instead of editing a migration that has already been applied.
- For data migrations, design a reversible or compensating strategy before execution and preserve a verified backup.
- Do not delete a migration-history row to force a replay.
- If remote and local histories disagree, stop and reconcile the exact versions and schema differences; do not guess at migration repair.
- Never include production user data, credentials, API keys, or real personal information in fixtures or seed files.
