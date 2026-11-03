"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROLE_HOME, type UserRole } from "@/lib/auth/roles";

type Props = { role: UserRole };
type Item = { href: string; label: string; shortLabel: string; icon: string };

const HOME_LABELS: Record<UserRole, string> = {
  super_admin: "پێشخان", admin: "پێشخان",
  restaurant: "فرۆشگا", supermarket: "فرۆشگا",
  produce_vendor: "فرۆشگا", meat_seafood_vendor: "فرۆشگا",
  captain: "ئەرکەکان", customer: "پێشخان",
};
const HOME_ICONS: Record<UserRole, string> = {
  super_admin: "▦", admin: "▦",
  restaurant: "▤", supermarket: "▤",
  produce_vendor: "▤", meat_seafood_vendor: "▤",
  captain: "↗", customer: "⌂",
};

function isActive(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
}

function NavLink({ item, pathname, compact = false }: { item: Item; pathname: string; compact?: boolean }) {
  const active = isActive(pathname, item.href);
  return (
    <Link
      className={[compact ? "workspace-mobile-link" : "workspace-nav-link", active ? "is-active" : ""].filter(Boolean).join(" ")}
      href={item.href}
      aria-current={active ? "page" : undefined}
      title={item.label}
    >
      <span className="workspace-nav-icon" aria-hidden="true">{item.icon}</span>
      <span className="workspace-nav-label">{compact ? item.shortLabel : item.label}</span>
    </Link>
  );
}

function roleWorkspaceItems(role: UserRole): Item[] {
  if (role === "customer") {
    return [{ href: "/workspace/merchant-application", label: "بەشداربوون وەک فرۆشیار", shortLabel: "فرۆشیار", icon: "＋" }];
  }
  if (role === "restaurant" || role === "supermarket" || role === "produce_vendor" || role === "meat_seafood_vendor") {
    return [
      { href: "/workspace/merchant/store", label: "زانیاری فرۆشگا", shortLabel: "فرۆشگا", icon: "▤" },
      { href: "/workspace/merchant/products", label: "بەرهەم و کۆگا", shortLabel: "بەرهەم", icon: "▦" },
    ];
  }
  if (role === "admin" || role === "super_admin") {
    return [{ href: "/workspace/admin/merchant-applications", label: "داواکاری فرۆشیاران", shortLabel: "داواکاری", icon: "✓" }];
  }
  return [];
}

const ACCOUNT_ITEMS: Item[] = [
  { href: "/workspace/profile", label: "پرۆفایلی من", shortLabel: "پرۆفایل", icon: "◎" },
  { href: "/workspace/security", label: "ئاسایشی هەژمار", shortLabel: "ئاسایش", icon: "⌑" },
];

export function WorkspaceMobileNavigation({ role }: Props) {
  const pathname = usePathname() || ROLE_HOME[role];
  const primary: Item = { href: ROLE_HOME[role], label: HOME_LABELS[role], shortLabel: HOME_LABELS[role], icon: HOME_ICONS[role] };
  const items = [primary, ...roleWorkspaceItems(role), ACCOUNT_ITEMS[0], { href: "/", label: "پەڕەی سەرەکی", shortLabel: "سەرەکی", icon: "⌂" }];

  return (
    <nav className="workspace-mobile-navigation" aria-label="ناوبەری مۆبایل">
      {items.map((item) => <NavLink key={item.href} item={item} pathname={pathname} compact />)}
    </nav>
  );
}

export function WorkspaceNavigation({ role }: Props) {
  const pathname = usePathname() || ROLE_HOME[role];
  const primary: Item = { href: ROLE_HOME[role], label: HOME_LABELS[role], shortLabel: HOME_LABELS[role], icon: HOME_ICONS[role] };

  return (
    <nav className="workspace-navigation" aria-label="ناوبەری ناوەندی کار">
      <span className="workspace-nav-caption">کار و بەڕێوەبردن</span>
      {[primary, ...roleWorkspaceItems(role)].map((item) => <NavLink key={item.href} item={item} pathname={pathname} />)}
      <span className="workspace-nav-caption workspace-nav-caption--account">هەژمار</span>
      {ACCOUNT_ITEMS.map((item) => <NavLink key={item.href} item={item} pathname={pathname} />)}
    </nav>
  );
}
