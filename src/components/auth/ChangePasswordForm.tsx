"use client";

import { useForm } from "@tanstack/react-form";

import { TextField } from "@/components/form/TextField";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useChangePassword } from "@/hooks/auth/use-change-password";
import { changePasswordSchema } from "@/schemas/auth.schema";

export function ChangePasswordForm() {
  const changePasswordMutation = useChangePassword();

  const form = useForm({
    defaultValues: { currentPassword: "", newPassword: "", confirmNewPassword: "" },
    validators: { onChange: changePasswordSchema },
    onSubmit: async ({ value }) => {
      changePasswordMutation.mutate(
        { currentPassword: value.currentPassword, newPassword: value.newPassword },
        { onSuccess: () => form.reset() }
      );
    },
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Change password</CardTitle>
        <CardDescription>You&apos;ll stay logged in on this device.</CardDescription>
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
          <form.Field name="currentPassword">
            {(field) => (
              <TextField
                field={field}
                label="Current password"
                type="password"
                autoComplete="current-password"
              />
            )}
          </form.Field>
          <form.Field name="newPassword">
            {(field) => (
              <TextField field={field} label="New password" type="password" autoComplete="new-password" />
            )}
          </form.Field>
          <form.Field name="confirmNewPassword">
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
                disabled={!canSubmit || isSubmitting || changePasswordMutation.isPending}
              >
                {isSubmitting || changePasswordMutation.isPending ? "Updating..." : "Update password"}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </CardContent>
    </Card>
  );
}
