# M03 merchant access verification

Run these checks against a non-production environment with separate test accounts. Do not use a real merchant account or production data.

| Account / store state | Expected result |
| --- | --- |
| Unauthenticated visitor | Redirect to `/login` |
| Authenticated account with no trusted role | Redirect to `/access-pending` |
| Customer, captain, admin, or super-admin visits merchant workspace | Redirect to that role's configured home |
| Merchant role with no owned non-platform store | Redirect to `/access-pending` |
| Merchant role with exactly one active owned non-platform store | Workspace and profile actions are available |
| Merchant role with a suspended owned store | Redirect to `/merchant-suspended`; profile server action must also be blocked |
| Merchant role with a pending, rejected, or otherwise non-active store | Access denied via `/merchant-suspended` |
| Merchant role with multiple owned non-platform stores | Fail closed to `/access-pending`; investigate owner uniqueness invariant |
| Merchant role whose only owned store is the platform store | Redirect to `/access-pending` |

For each case, also verify that another user's store is never returned or updated. The guard is a UI/server-action defense in depth; database RLS remains the authorization boundary.

The repository currently defines `lint`, `typecheck`, and `build` scripts but no automated test runner. This matrix is a manual verification checklist, not a claim that these cases have already been executed.
