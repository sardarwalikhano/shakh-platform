# Authentication and Route Access

## Supabase project

- Project reference: `vjfzdlmqrmzaufnqsdre`
- Project URL: `https://vjfzdlmqrmzaufnqsdre.supabase.co`
- Region: `eu-west-3`
- Browser API key: publishable key (`sb_publishable_...`), configured as a Vercel environment variable.
- Never use a secret/service-role key in browser code or a `NEXT_PUBLIC_*` variable.

## Session model

- Use `@supabase/ssr` for browser and server clients.
- Store Auth sessions in secure cookies.
- In Next.js 16, `src/proxy.ts` refreshes session cookies using `supabase.auth.getClaims()`.
- Protected server layouts independently verify the claims and enforce role access.
- Do not use `getSession()` as a server-side authorization check.

## Role model

The trusted role claim is `app_metadata.role`:

- `super_admin`
- `admin`
- `restaurant`
- `supermarket`
- `produce_vendor`
- `meat_seafood_vendor`
- `captain`
- `customer`

The database trigger assigns `customer` to newly registered users when no trusted role is already present. It reads only the display name from user metadata. The sign-up form does not accept a role, store ID, category, or permissions. The user-editable `user_metadata` object is never used for authorization.

Merchant, admin, captain, and super-admin roles must be assigned through a trusted Auth Admin process. Do not change role claims from browser code.

## Route boundaries

| Route | Allowed role |
|---|---|
| `/workspace/super-admin` | `super_admin` |
| `/workspace/admin` | `super_admin`, `admin` |
| `/workspace/merchant` | Restaurant, supermarket, produce, meat/seafood |
| `/workspace/captain` | `captain` |
| `/workspace/customer` | `customer` |

Proxy is only an early session gate. Each workspace route layout also performs a server-side role check. Database access must additionally be protected by PostgreSQL RLS; UI hiding or redirects do not replace RLS.

## Store and catalog policy

- Every merchant store is associated with exactly one merchant category and owner.
- A merchant can insert products only into their own store and only for their assigned role/category.
- The platform-owned `SHAKH STORE` system store is created by the initial migration.
- Only `super_admin` can insert products into `SHAKH STORE`; this supports cross-category platform-owned listings.
- Store approval/status and product publication/status are not directly writable through the browser's table grants. Those workflows will be exposed through audited server-side operations after fee and wallet logic is implemented.
- Prices use `bigint` IQD units.

## Identity and recovery routes

- `/login`: email/password sign-in, registration and resend confirmation.
- `/auth/confirm`: supports PKCE code exchange and token-hash verification.
- `/forgot-password`: generic password recovery request.
- `/reset-password`: password update after a valid recovery session.
- `/workspace/security`: password update after current-password reauthentication, plus session revocation.
- Sign-out from the workspace revokes only the current session; a separate POST action revokes all sessions.

See [M01 Identity & Account](m01-identity-account.md) for required dashboard URL/provider/template/SMTP configuration and release checks.

## First Super Admin

The sign-up flow intentionally does not grant elevated privileges. Create the first account, then assign `app_metadata.role = super_admin` through the trusted Supabase Auth user administration interface. After role assignment, sign out and sign back in to receive a fresh JWT. Never set this value in user metadata.

## Pending configuration

- Configure Auth email confirmation, redirect allow-list, recovery/confirmation templates, password policy and custom SMTP in the Supabase Dashboard.
- Enable leaked-password protection when it is available on the project plan; it was reported disabled by Security Advisor.
- The first Super Admin must be provisioned by trusted administration.
- Orders, wallet ledger, delivery payouts, notification and reward schemas are next migrations; they are not enabled yet.
