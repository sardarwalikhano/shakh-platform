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
  return pathname === href;
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
export function WorkspaceNavigation({ role }: Props) {
  const pathname = usePathname() || ROLE_HOME[role];
  const primary: Item[] = [{
    href: ROLE_HOME[role], label: HOME_LABELS[role],
    shortLabel: HOME_LABELS[role], icon: HOME_ICONS[role],
  }];
  const workspaceItems: Item[] =
    role === "customer"
      ? [{ href: "/workspace/merchant-application", label: "بەشداربوون وەک فرۆشیار", shortLabel: "فرۆشیار", icon: "＋" }]
      : role === "restaurant" || role === "supermarket" || role === "produce_vendor" || role === "meat_seafood_vendor"
        ? [{ href: "/workspace/merchant/store", label: "زانیاری فرۆشگا", shortLabel: "فرۆشگا", icon: "▤" }]
        : role === "admin" || role === "super_admin"
          ? [{ href: "/workspace/admin/merchant-applications", label: "داواکاری فرۆشیاران", shortLabel: "داواکاری", icon: "✓" }]
          : [];
  const account: Item[] = [
    { href: "/workspace/profile", label: "پرۆفایلی من", shortLabel: "پرۆفایل", icon: "◎" },
    { href: "/workspace/security", label: "ئاسایشی هەژمار", shortLabel: "ئاسایش", icon: "⌑" },
  ];
  const workItems = [...primary, ...workspaceItems];
  return (
    <>
      <nav className="workspace-navigation" aria-label="ناوبەری ناوەندی کار">
        <span className="workspace-nav-caption">کار و بەڕێوەبردن</span>
        {workItems.map((item) => <NavLink key={item.href} item={item} pathname={pathname} />)}
        <span className="workspace-nav-caption workspace-nav-caption--account">هەژمار</span>
        {account.map((item) => <NavLink key={item.href} item={item} pathname={pathname} />)}
      </nav>
      <nav className="workspace-mobile-navigation" aria-label="ناوبەری مۆبایل">
        {[...workItems, ...account, { href: "/", label: "پەڕەی سەرەکی", shortLabel: "سەرەکی", icon: "⌂" }].map((item) => <NavLink key={item.href} item={item} pathname={pathname} compact />)}
      </nav>
    </>
  );
}
