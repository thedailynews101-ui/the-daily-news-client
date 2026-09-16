import type { UserRole } from "@/types/auth";

/**
 * Where a user lands after login, and what a role guard redirects to when it
 * blocks access to a route reserved for a different role.
 *
 * Only `/dashboard` is fully built today - the admin/employee dashboards are
 * still stubs, but they need a valid redirect target now so the guards in
 * `(dashboardLayout)/admin` and `(dashboardLayout)/employee` have somewhere
 * to send a mismatched role.
 */
export function getDashboardPathForRole(role: UserRole): string {
  switch (role) {
    case "SUPER_ADMIN":
    case "ADMIN":
      return "/admin/dashboard";
    case "EMPLOYEE":
      return "/employee/dashboard";
    case "USER":
    default:
      return "/dashboard";
  }
}
