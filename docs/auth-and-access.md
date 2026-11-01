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

## Email confirmation

The handler is `/auth/confirm`. Configure Supabase Auth email confirmation template to send users to:

```
{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email
```

In Supabase Dashboard → Authentication → URL Configuration:
- Set Site URL to the production site origin.
- Add `http://localhost:3000/auth/confirm` for local development.
- Add the production callback `https://shakh-platform-sardars-projects-d8734553.vercel.app/auth/confirm`.
- Add any future custom production domain callback.

## First Super Admin

The sign-up flow intentionally does not grant elevated privileges. Create the first account, then assign `app_metadata.role = super_admin` through the trusted Supabase Auth user administration interface. After role assignment, sign out and sign back in to receive a fresh JWT. Never set this value in user metadata.

## Pending configuration

- Supabase project access and the publishable client key are now configured.
- Email confirmation provider settings and redirect allow-list must be reviewed in the Auth dashboard.
- The first Super Admin must be provisioned by trusted administration.
- Orders, wallet ledger, delivery payouts, notification and reward schemas are next migrations; they are not enabled yet.
