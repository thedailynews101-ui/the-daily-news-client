"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { XCircle } from "lucide-react";

import { TextField } from "@/components/form/TextField";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useResetPassword } from "@/hooks/auth/use-reset-password";
import { resetPasswordFormSchema } from "@/schemas/auth.schema";

export function ResetPasswordForm({ token }: { token: string | undefined }) {
  const resetPasswordMutation = useResetPassword();

  const form = useForm({
    defaultValues: { password: "", confirmPassword: "" },
    validators: { onChange: resetPasswordFormSchema },
    onSubmit: async ({ value }) => {
      if (!token) {
        return;
      }
      resetPasswordMutation.mutate({ token, password: value.password });
    },
  });

  if (!token) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <XCircle className="mb-2 size-8 text-destructive" />
          <CardTitle className="text-2xl">Missing reset link</CardTitle>
          <CardDescription>
            This link is missing its reset token. Please request a new one.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button className="w-full" render={<Link href="/forget-password" />}>
            Request a new link
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Choose a new password</CardTitle>
        <CardDescription>Make it at least 8 characters, with a letter and a number.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Field name="password">
            {(field) => (
              <TextField field={field} label="New password" type="password" autoComplete="new-password" />
            )}
          </form.Field>
          <form.Field name="confirmPassword">
            {(field) => (
              <TextField
                field={field}
                label="Confirm new password"
                type="password"
                autoComplete="new-password"
              />
            )}
          </form.Field>

          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
            {([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                disabled={!canSubmit || isSubmitting || resetPasswordMutation.isPending}
              >
                {isSubmitting || resetPasswordMutation.isPending ? "Resetting..." : "Reset password"}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </CardContent>
    </Card>
  );
}
