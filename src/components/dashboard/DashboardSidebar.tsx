"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

import { useAuth } from "@/components/auth/AuthProvider";
import { getDashboardNavItems, isNavActive } from "@/lib/dashboard-nav";
import { cn } from "@/lib/utils";

type DashboardSidebarProps = {
  mobileOpen: boolean;
  onMobileClose: () => void;
};

function NavLinks({
  onNavigate,
  className,
}: {
  onNavigate?: () => void;
  className?: string;
}) {
  const pathname = usePathname();
  const { user } = useAuth();
  const navItems = user ? getDashboardNavItems(user.role) : [];

  return (
    <nav className={cn("flex flex-col gap-1", className)}>
      {navItems.map((item) => {
        const active = isNavActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardSidebar({ mobileOpen, onMobileClose }: DashboardSidebarProps) {
  return (
    <>
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-border bg-background px-3 py-6 lg:flex">
        <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Menu
        </p>
        <NavLinks className="flex-1 overflow-y-auto" />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close navigation"
            onClick={onMobileClose}
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r border-border bg-background px-3 py-4 shadow-lg">
            <div className="mb-4 flex items-center justify-between px-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Menu
              </p>
              <button
                type="button"
                className="inline-flex size-8 items-center justify-center rounded-md border border-border"
                onClick={onMobileClose}
                aria-label="Close menu"
              >
                <X className="size-4" />
              </button>
            </div>
            <NavLinks onNavigate={onMobileClose} className="flex-1 overflow-y-auto" />
          </aside>
        </div>
      )}
    </>
  );
}
