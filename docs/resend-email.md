# Resend Business Email Integration

## Provider and domain

- Provider: Resend
- Verified sending domain: `mail.daim-post.online`
- Default sender identity: `SHAKH <notifications@mail.daim-post.online>`
- API key access: sending-only, restricted to this domain.
- The restricted key is stored as the encrypted Vercel project environment variable `RESEND_API_KEY`.
- `RESEND_FROM_EMAIL` and optional `RESEND_REPLY_TO` are environment variables. No API secret belongs in GitHub.

## Installed packages

- `resend` — official Node.js API client
- `react-email` — accessible, reusable email templates

## Current email helpers

Import these only from trusted server-side business logic:

- `sendOrderConfirmationEmail` — customer order acknowledgement.
- `sendMerchantNewOrderEmail` — merchant/store new-order alert.
- `sendCaptainAssignmentEmail` — courier delivery assignment alert.
- `sendPlatformAdminAlertEmail` — operational alert for platform administrators.

All templates are Kurdish Sorani-first and right-to-left. They provide text alternatives through React Email/Resend rendering, use a fixed SHAKH brand identity, and link users back to the application.

## Reliability and security

- Never expose `RESEND_API_KEY` in a `NEXT_PUBLIC_*` variable.
- Never create a public endpoint that accepts arbitrary `to`, `from`, subject, and HTML content for sending.
- Call email helpers only after server-side authentication and authorization checks.
- Generate one stable idempotency key per business event, e.g. `order-confirmation/<order-id>`. Resend deduplicates matching requests for 24 hours; re-use the same key and identical payload for retries.
- Do not include full home addresses, payment credentials, wallet secrets, or other unnecessary sensitive data in notifications.
- Provider errors are logged server-side with category and provider diagnostic, but are returned to callers as a generic message.
- Keep transactional notifications separate from marketing campaigns; promotional mail requires consent and unsubscribe handling.

## Example call site

```ts
import { sendOrderConfirmationEmail } from "@/lib/email/notifications";

await sendOrderConfirmationEmail({
  recipient: customer.email,
  orderId: order.id,
  orderNumber: order.order_number,
  customerName: customer.full_name,
  totalIqd: order.total_iqd,
});
```

Call this after the order transaction commits. Do not send from client-side components.

## Integration boundary

The Resend client, sender identity, email templates, and typed notification helpers are implemented. They are not yet wired to live order, merchant, captain, or admin event handlers because those order/delivery services and database migrations have not been added. Add each send call in the corresponding server-side event flow and use an outbox/retry worker for guaranteed delivery once those domains are implemented.

This integration covers SHAKH business notifications. Supabase Auth email/SMTP delivery remains a separate configuration and should not be assumed to use Resend until the Supabase Auth SMTP settings and templates are configured.
