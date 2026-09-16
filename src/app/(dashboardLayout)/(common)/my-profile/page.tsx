"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getInitials } from "@/lib/utils";

export default function MyProfilePage() {
  const { user, isLoading } = useAuth();

  // RequireAuth in the parent (dashboardLayout) already renders a skeleton
  // while loading and redirects if there is no session - this is just a
  // defensive fallback for the render in between.
  if (isLoading || !user) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10">
      <Card>
        <CardHeader className="flex-row items-center gap-4">
          <Avatar size="lg">
            <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <p className="text-muted-foreground">Role</p>
            <p className="font-medium">{user.role}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Status</p>
            <p className="font-medium">{user.status}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Email verified</p>
            <p className="font-medium">{user.emailVerifiedAt ? "Yes" : "No"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Member since</p>
            <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
          {user.bio && (
            <div className="sm:col-span-2">
              <p className="text-muted-foreground">Bio</p>
              <p className="font-medium">{user.bio}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
