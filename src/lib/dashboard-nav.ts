import type { UserRole } from "@/types/auth";

export type DashboardNavItem = {
  href: string;
  label: string;
};

/** Role-specific primary links shown in the dashboard sidebar. */
export function getDashboardNavItems(role: UserRole): DashboardNavItem[] {
  switch (role) {
    case "SUPER_ADMIN":
    case "ADMIN":
      return [
        { href: "/admin/dashboard", label: "Dashboard" },
        { href: "/admin/dashboard/manage-articles", label: "Manage Articles" },
        { href: "/admin/dashboard/requested-articles", label: "Requested Articles" },
        { href: "/admin/dashboard/homepage", label: "Homepage" },
        { href: "/admin/dashboard/manage-events", label: "Manage Events" },
        { href: "/admin/dashboard/manage-roles", label: "Manage Roles" },
        { href: "/admin/dashboard/manage-categories", label: "Manage Categories" },
        { href: "/my-profile", label: "My Profile" },
        { href: "/change-password", label: "Change Password" },
      ];
    case "EMPLOYEE":
      return [
        { href: "/employee/dashboard", label: "Dashboard" },
        { href: "/employee/dashboard/manage-articles", label: "Manage Articles" },
        { href: "/employee/dashboard/requested-articles", label: "Requested Articles" },
        { href: "/employee/dashboard/homepage", label: "Homepage" },
        { href: "/employee/dashboard/manage-events", label: "Manage Events" },
        { href: "/my-profile", label: "My Profile" },
        { href: "/change-password", label: "Change Password" },
      ];
    case "USER":
    default:
      return [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/dashboard/my-articles", label: "My Articles" },
        { href: "/my-profile", label: "My Profile" },
        { href: "/change-password", label: "Change Password" },
      ];
  }
}

export function isNavActive(pathname: string, href: string): boolean {
  if (href === "/dashboard" || href === "/admin/dashboard" || href === "/employee/dashboard") {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function isStaffRole(role: UserRole): boolean {
  return role === "EMPLOYEE" || role === "ADMIN" || role === "SUPER_ADMIN";
}

/** Base path for staff manage-articles routes (admin vs employee prefix). */
export function getStaffManageBasePath(role: UserRole): string {
  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    return "/admin/dashboard/manage-articles";
  }
  return "/employee/dashboard/manage-articles";
}
