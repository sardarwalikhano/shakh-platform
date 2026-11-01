export const USER_ROLES = [
  "super_admin",
  "admin",
  "restaurant",
  "supermarket",
  "produce_vendor",
  "meat_seafood_vendor",
  "captain",
  "customer",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const ROLE_HOME: Record<UserRole, string> = {
  super_admin: "/workspace/super-admin",
  admin: "/workspace/admin",
  restaurant: "/workspace/merchant",
  supermarket: "/workspace/merchant",
  produce_vendor: "/workspace/merchant",
  meat_seafood_vendor: "/workspace/merchant",
  captain: "/workspace/captain",
  customer: "/workspace/customer",
};

export const MERCHANT_ROLES: readonly UserRole[] = [
  "restaurant", "supermarket", "produce_vendor", "meat_seafood_vendor",
];

const ROLE_ALIASES: Record<string, UserRole> = {
  fruits_vegetables: "produce_vendor",
  meat_seafood: "meat_seafood_vendor",
};

export function getRoleFromClaims(claims: unknown): UserRole | null {
  if (!claims || typeof claims !== "object") return null;
  const appMetadata = (claims as Record<string, unknown>).app_metadata;
  if (!appMetadata || typeof appMetadata !== "object") return null;

  // Authorization reads trusted app_metadata only, never user_metadata.
  const role = (appMetadata as Record<string, unknown>).role;
  if (typeof role !== "string") return null;
  if (USER_ROLES.includes(role as UserRole)) return role as UserRole;
  return ROLE_ALIASES[role] ?? null;
}
