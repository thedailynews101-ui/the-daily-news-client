import type { UserRole } from "@/types/auth";

const ROLE_RANK: Record<UserRole, number> = {
  SUPER_ADMIN: 4,
  ADMIN: 3,
  EMPLOYEE: 2,
  USER: 1,
};

export const ALL_USER_ROLES: UserRole[] = ["SUPER_ADMIN", "ADMIN", "EMPLOYEE", "USER"];

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  EMPLOYEE: "Employee",
  USER: "User",
};

export function isStrictlyHigherRank(actorRole: UserRole, targetRole: UserRole): boolean {
  return ROLE_RANK[actorRole] > ROLE_RANK[targetRole];
}

/** Roles the actor is allowed to assign (strictly lower than their own). */
export function assignableRolesFor(actorRole: UserRole): UserRole[] {
  return ALL_USER_ROLES.filter((role) => isStrictlyHigherRank(actorRole, role));
}
