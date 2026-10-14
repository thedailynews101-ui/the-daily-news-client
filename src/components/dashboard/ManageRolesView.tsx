"use client";

import * as React from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpdateUserRole } from "@/hooks/users/use-user-mutations";
import { useUsers } from "@/hooks/users/use-users";
import {
  ALL_USER_ROLES,
  USER_ROLE_LABELS,
  assignableRolesFor,
  isStrictlyHigherRank,
} from "@/lib/user-roles";
import type { UserRole } from "@/types/auth";
import type { ManagedUser } from "@/types/user";

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function UserRoleRow({
  user,
  actorRole,
  actorId,
}: {
  user: ManagedUser;
  actorRole: UserRole;
  actorId: string;
}) {
  const updateMutation = useUpdateUserRole();
  const [selectedRole, setSelectedRole] = React.useState<UserRole>(user.role);

  React.useEffect(() => {
    setSelectedRole(user.role);
  }, [user.role]);

  const isSelf = user.id === actorId;
  const canEdit = !isSelf && isStrictlyHigherRank(actorRole, user.role);
  const options = canEdit
    ? assignableRolesFor(actorRole)
    : ALL_USER_ROLES.filter((role) => role === user.role);
  const dirty = selectedRole !== user.role;

  return (
    <Card>
      <CardHeader className="gap-2">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg">{user.name}</CardTitle>
            <CardDescription className="mt-1">
              {user.email} · Joined {formatDate(user.createdAt)} · {user.status}
            </CardDescription>
          </div>
          <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
            {USER_ROLE_LABELS[user.role]}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <Label htmlFor={`role-${user.id}`}>Role</Label>
          <select
            id={`role-${user.id}`}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={selectedRole}
            disabled={!canEdit || updateMutation.isPending}
            onChange={(event) => setSelectedRole(event.target.value as UserRole)}
          >
            {options.map((role) => (
              <option key={role} value={role}>
                {USER_ROLE_LABELS[role]}
              </option>
            ))}
          </select>
          {isSelf && (
            <p className="text-xs text-muted-foreground">You cannot change your own role.</p>
          )}
          {!isSelf && !canEdit && (
            <p className="text-xs text-muted-foreground">
              You can only change roles for users of a lower rank.
            </p>
          )}
        </div>
        <Button
          disabled={!canEdit || !dirty || updateMutation.isPending}
          onClick={() => {
            if (
              window.confirm(
                `Change ${user.name}'s role to ${USER_ROLE_LABELS[selectedRole]}?`
              )
            ) {
              updateMutation.mutate({ id: user.id, payload: { role: selectedRole } });
            }
          }}
        >
          {updateMutation.isPending ? "Saving..." : "Save role"}
        </Button>
      </CardContent>
    </Card>
  );
}

export function ManageRolesView() {
  const { user: actor } = useAuth();
  const [search, setSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState<UserRole | "ALL">("ALL");
  const [submittedQ, setSubmittedQ] = React.useState<string | undefined>(undefined);

  const { data, isLoading, isError } = useUsers({
    q: submittedQ,
    role: roleFilter === "ALL" ? undefined : roleFilter,
    limit: 50,
  });

  if (!actor) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Manage Roles</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View users and update roles for accounts below your rank.
        </p>
      </div>

      <form
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
        onSubmit={(event) => {
          event.preventDefault();
          const trimmed = search.trim();
          setSubmittedQ(trimmed || undefined);
        }}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <Label htmlFor="user-search">Search</Label>
          <Input
            id="user-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Name or email"
          />
        </div>
        <div className="flex w-full flex-col gap-1.5 sm:w-48">
          <Label htmlFor="role-filter">Filter by role</Label>
          <select
            id="role-filter"
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value as UserRole | "ALL")}
          >
            <option value="ALL">All roles</option>
            {ALL_USER_ROLES.map((role) => (
              <option key={role} value={role}>
                {USER_ROLE_LABELS[role]}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit">Search</Button>
      </form>

      {isLoading && (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      )}

      {isError && (
        <Card>
          <CardContent className="py-6 text-sm text-destructive">
            Could not load users. Please try again.
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && data?.items.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>No users found</CardTitle>
            <CardDescription>Try a different search or role filter.</CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {data?.items.map((managedUser) => (
          <UserRoleRow
            key={managedUser.id}
            user={managedUser}
            actorRole={actor.role}
            actorId={actor.id}
          />
        ))}
      </div>
    </div>
  );
}
