"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import { useAuth } from "@/components/auth/AuthProvider";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useLogout } from "@/hooks/auth/use-logout";
import { getInitials } from "@/lib/utils";

type DashboardTopBarProps = {
  onOpenMobileNav: () => void;
};

export function DashboardTopBar({ onOpenMobileNav }: DashboardTopBarProps) {
  const { user, isLoading } = useAuth();
  const logoutMutation = useLogout();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-lg border border-border lg:hidden"
            onClick={onOpenMobileNav}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>
          <Link
            href="/"
            className="shrink-0 font-heading text-xl font-bold tracking-tight sm:text-2xl"
          >
            The Daily Newsfeed
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {isLoading || !user ? (
            <Skeleton className="size-8 rounded-full" />
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
                <Avatar>
                  <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name} />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="px-2 py-1.5 text-sm font-medium text-foreground">
                    {user.name}
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                >
                  {logoutMutation.isPending ? "Logging out..." : "Log out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
