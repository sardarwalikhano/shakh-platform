# M01 — Identity & Account

## Application scope

The application code now includes:

- Email/password sign-up and sign-in.
- Email confirmation callback and resend confirmation.
- PKCE code exchange and token-hash verification.
- Password recovery request and recovery session callback.
- Password reset after a valid recovery session, restricted to JWT `amr` entries containing `method: "recovery"`.
- Authenticated password change with current-password reauthentication.
- Current-session, other-session and global sign-out scopes.
- Owner-scoped profile display and editing; trusted role and email are not editable in the general profile form.

The app requires 12–128 Unicode characters for new passwords. Supabase Auth stores and verifies password credentials; application code does not store plaintext passwords or log them.

The recovery reset page and its server action both require a verified recovery authentication method. A normal password-authenticated session is not sufficient to enter or submit the recovery reset flow.

## Required Supabase dashboard configuration

The connected Supabase tools can inspect the project and database, but they do not expose Auth URL/provider/template/SMTP mutations. Complete these settings manually in the Supabase Dashboard before treating M01 as released.

### 1. Authentication → URL Configuration

Set:

- Site URL: https://www.daim-post.online
- Production redirect URL: https://www.daim-post.online/auth/confirm
- Local development redirect URL: http://localhost:3000/auth/confirm
- Vercel Preview redirect URL: add a narrow wildcard for the project's preview host, such as https://*-sardars-projects-d8734553.vercel.app/auth/confirm

Do not add a universal wildcard for all domains. Verify the current preview host suffix in Vercel before saving the rule.

### 2. Authentication → Providers → Email

- Keep email/password sign-in enabled.
- Keep email confirmation enabled.
- Set the minimum password length to 12 or higher.
- Select the strongest practical password complexity requirement.
- Enable leaked-password protection if available on the project's plan.

The latest Supabase Security Advisor reported leaked-password protection as disabled. Re-check the advisor after changing this dashboard setting.

### 3. Authentication → Email Templates

Set the Confirm Signup template link to:

    {{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=email

Set the Reset Password template link to:

    {{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=recovery

The recovery redirect supplied by the app already contains flow=recovery, so the reset template must append parameters with an ampersand, not another question mark.

The callback accepts PKCE code exchange as well as token_hash links. The flow=recovery marker lets a PKCE recovery callback route to the password reset form.

Disable click-tracking or URL rewriting for authentication links. Confirmation/recovery URLs carry single-use credentials and must not be modified by tracking redirects.

### 4. Authentication → SMTP Settings

Configure custom SMTP for production email deliverability. Supabase's default mail service is restricted and is not appropriate for a public production rollout.

Use the existing verified Resend sender domain:

- SMTP host: smtp.resend.com
- Port: 465 (SSL)
- Username: resend
- Password: enter the existing domain-scoped SHAKH Resend sending API key directly in the Supabase dashboard. Do not paste it into source code, browser code, or a public issue.
- Sender name/address: SHAKH <notifications@mail.daim-post.online>

The domain mail.daim-post.online is verified in Resend. Auth SMTP is a separate configuration from the Resend Node SDK used for transactional order and delivery emails.

### 5. Account security

- Set JWT expiry deliberately; shorter access-token lifetimes reduce the time a revoked access token remains valid.
- Consider MFA as a later M01.2 enhancement after the core flows have been verified.
- Provision the first Super Admin only through trusted Supabase Auth administration.

## Release acceptance checklist

1. New user can sign up; no role, store, category or permissions are accepted from the browser.
2. With email confirmation enabled, an unconfirmed account cannot sign in.
3. Confirmation establishes a cookie-backed SSR session and routes the account to its trusted role workspace or access-pending page.
4. Resend confirmation works without exposing whether an address is registered.
5. Password recovery returns the same generic response for registered and unregistered addresses.
6. Valid recovery token opens the password reset page; expired or invalid tokens are rejected.
7. A normal password-authenticated session cannot open or submit the recovery password reset action.
8. A valid recovery session is accepted only when the verified JWT `amr` claim contains `method: "recovery"`.
9. Password reset updates the password and requests global refresh-token revocation.
10. Authenticated password change requires the current password and revokes other sessions.
11. Local sign-out removes only the current session; other-device and global sign-out use explicit scopes.
12. Trusted roles continue to be read from app_metadata.role only.
13. Test the flow on production and preview separately with a non-privileged account.

## Current state

Application code is implemented and build verification is required on the latest commit. Supabase dashboard URL/provider/template/SMTP settings and real-browser/device Auth tests remain release gates. No applied database migration was edited; M01 required no schema migration.
