"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EmployeeDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Employee Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage articles and review user submissions.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Manage Articles</CardTitle>
            <CardDescription>Create, edit, archive, or delete any article.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button render={<Link href="/employee/dashboard/manage-articles" />}>
              Open manage articles
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Requested Articles</CardTitle>
            <CardDescription>Approve or reject pending user submissions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button render={<Link href="/employee/dashboard/requested-articles" />}>
              Open review queue
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
