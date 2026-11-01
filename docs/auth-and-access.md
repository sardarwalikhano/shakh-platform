# Authentication and Route Access

## Supabase project

- Project reference: `vjfzdlmqrmzaufnqsdre`
- Project URL: `https://vjfzdlmqrmzaufnqsdre.supabase.co`
- Required browser key: publishable key (`sb_publishable_...`).
- Never use a secret/service-role key in browser code or a `NEXT_PUBLIC_*` variable.

## Session model

- Use `@supabase/ssr` for browser and server clients.
- Store Auth sessions in secure cookies.
- In Next.js 16, `src/proxy.ts` refreshes the session using `supabase.auth.getClaims()`.
- Protected server layouts independently verify the claims and enforce role access.
- Do not use `getSession()` as the server-side authorization check.

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

The sign-up form accepts a display name only. It does not accept a role, store ID, category, or permissions. The user-editable `user_metadata` object must never be used for authorization. Newly registered accounts without an approved role are sent to `/access-pending`.

## Route boundaries

| Route | Allowed role |
|---|---|
| `/workspace/super-admin` | `super_admin` |
| `/workspace/admin` | `super_admin`, `admin` |
| `/workspace/merchant` | Restaurant, supermarket, produce, meat/seafood |
| `/workspace/captain` | `captain` |
| `/workspace/customer` | `customer` |

Proxy is only an early session gate. Each workspace route layout also performs a server-side role check. Database access must additionally be protected by PostgreSQL RLS; UI hiding or redirects do not replace RLS.

## Email confirmation

The handler is `/auth/confirm`. Configure the Supabase Auth email confirmation template to send users to:

```
{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email
```

Add local and production callback URLs to the Supabase Auth redirect allow list.

## Pending configuration

The connected Supabase integration could not read project `vjfzdlmqrmzaufnqsdre`. Client code is prepared, but Auth provider settings, redirect allow lists, publishable key retrieval, role provisioning, database schema, RLS, and live sign-in verification remain pending until the correct Supabase account grants access.
