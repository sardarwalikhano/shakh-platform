# M02 — Shared Workspace Shell and Navigation

## Delivered interface foundation

- Unified RTL workspace shell with a persistent desktop sidebar and compact mobile bottom navigation.
- Role-aware workspace entry for super-admin, admin, merchant categories, captain and customer.
- Shared account destinations for profile and account security.
- Active navigation is visually marked and exposed through aria-current.
- Shared top bar presents the signed-in identity and role-specific workspace label.
- Shared page heading and empty-state components.
- Workspace loading skeleton and runtime error recovery boundary.
- Keyboard-visible focus states, semantic navigation labels and reduced-motion support.
- Responsive content widths and safe-area spacing for mobile/PWA browsers.

## Navigation scope

Only routes that already exist are linked. The navigation does not advertise unimplemented order, wallet, catalog or reporting features. Role route layouts and trusted app_metadata authorization remain the enforcement boundary; navigation visibility is not access control.

| Role | Main workspace route |
|---|---|
| super_admin | /workspace/super-admin |
| admin | /workspace/admin |
| restaurant / supermarket / produce_vendor / meat_seafood_vendor | /workspace/merchant |
| captain | /workspace/captain |
| customer | /workspace/customer |

Shared destinations:
- /workspace/profile
- /workspace/security

## Acceptance checks

- Each supported role sees its own workspace entry and shared account links.
- Active page indication follows client-side navigation.
- Desktop shell keeps navigation visible while workspace content scrolls.
- Mobile bottom navigation remains reachable above device safe-area insets.
- Profile and security routes retain their existing server-side authentication checks.
- Every role-specific route retains its server-side requireRoles layout.
- Workspace loading and runtime error states have accessible labels and actions.
- No mock menu entries or test/demo data are introduced.

## Current implementation state

The shared shell and reusable UI states are implemented in source. The production build and deployed route checks remain the milestone release gate.
