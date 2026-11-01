# M03 — Merchant Onboarding and Stores

## Scope

M03 adds the first production merchant-intake and moderation workflow to SHAKH. It is additive: the five previously applied foundation migrations remain untouched, the existing SHAKH STORE record is retained, and no mock/demo/test records are created.

## Applicant flow

1. An authenticated customer opens **بەشداربوون وەک فرۆشیار** from workspace navigation.
2. The form captures business name, merchant category, contact person, phone, city, district, address, optional Latin slug and description.
3. Applicants can read their own application history and status. A partial unique index prevents multiple open applications for one account. Rejected applicants can submit a corrected application.
4. Admins and super admins review submitted requests in **داواکارییەکانی فرۆشیاران**.
5. Approval creates the active merchant store and sets the category-mapped trusted `app_metadata.role` through the protected Edge Function. The SQL approval RPC locks the application row and writes the store/application state in one database transaction.
6. Rejection records a reason and leaves the user as a customer.

## Category mapping

| Application category | Trusted role after approval |
|---|---|
| `restaurant` | `restaurant` |
| `supermarket` | `supermarket` |
| `fruits_vegetables` | `produce_vendor` |
| `meat_seafood` | `meat_seafood_vendor` |

The store table keeps its existing category values to preserve the catalog/RLS contract. SHAKH STORE remains platform-owned and separate.

## Security boundaries

- `merchant_applications` has RLS enabled. Customers can submit and read only their own requests; admins can read the review queue. Only the service role writes moderation fields.
- Applicant identity defaults to `auth.uid()` from the verified request JWT. Clients cannot choose applicant ID, status, reviewer, reviewed timestamp or store ID.
- The Edge Function validates the bearer JWT using Supabase Auth and checks only trusted `user.app_metadata.role` for `admin` or `super_admin`.
- Category-to-role assignment is a server-side fixed mapping. No browser-supplied role is accepted.
- Approval RPC runs with invoker rights and EXECUTE is granted only to `service_role`. It locks the request and creates the store plus approved application row atomically.
- If database approval fails after the Auth role update, the Edge Function attempts to restore the applicant's previous app metadata. Rollback failures are logged for manual intervention.
- Store owners may edit public profile fields only. They cannot change owner, category, platform-store flag or moderation status through the Data API.
- A partial unique index limits each user to one non-platform store.
- Admin/super-admin can suspend and reactivate active merchant stores. Every transition runs through a service-role-only row-locking RPC and writes an immutable moderation event with actor, old/new status, note and timestamp. The platform-owned SHAKH STORE is explicitly excluded.
- The service-role credential stays in Supabase Edge Function environment variables and is never added to browser code or Vercel.
- After approval, the applicant must refresh their session (sign out and sign in) to receive the new role claim.

## Routes

- `/workspace/merchant-application` — customer application and personal application history.
- `/workspace/admin/merchant-applications` — admin/super-admin moderation queue.
- `/workspace/merchant` — authenticated, owner-scoped store summary.
- `/workspace/merchant/store` — merchant-owned store profile editor.

## Applied migrations

- `20261101132254_m03_merchant_onboarding_stores.sql`
- `20261101132343_m03_merchant_application_fk_indexes.sql`
- `20261101132641_m03_applicant_identity_default.sql`
- `20261101133728_m03_store_moderation_audit.sql`

Never modify or reapply an already-applied migration.

## Acceptance checks

- [ ] Customer can submit one open application; a second is rejected by the unique partial index.
- [ ] Customer cannot read another applicant's rows or write moderation fields.
- [ ] Anonymous users cannot read or submit applications.
- [ ] Admin/super admin can read moderation queue; customer and merchant cannot.
- [ ] Edge Function rejects invalid JWTs and non-admin roles.
- [ ] Approving each merchant category sets the mapped role and creates exactly one active store.
- [ ] Rejection leaves the user's role as customer and records a reason.
- [ ] Store owner can edit own public profile but cannot change status, category, owner or platform-store flag.
- [ ] Admin/super admin can suspend and reactivate merchant-owned stores only; each status transition writes an audit event. SHAKH STORE cannot be moderated from this flow.
- [ ] Cross-store access remains blocked by existing store/product RLS.
- [ ] Existing Auth, PWA, profile/security and role route guards still pass.
- [ ] Production and signed-in mobile flows are exercised before marking M03 released.

## Operational notes

M01 Supabase Auth provider, URL allowlist, templates, SMTP and end-to-end email checks remain separate release checks. Leaked-password protection is also still disabled in the Auth project settings and should be enabled before broad production onboarding.
