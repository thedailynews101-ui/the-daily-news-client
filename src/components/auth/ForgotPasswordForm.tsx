"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { MailCheck } from "lucide-react";

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
import { useForgotPassword } from "@/hooks/auth/use-forgot-password";
import { forgotPasswordSchema } from "@/schemas/auth.schema";

export function ForgotPasswordForm() {
  const forgotPasswordMutation = useForgotPassword();

  const [submittedEmail, setSubmittedEmail] = React.useState<string | null>(null);

  const form = useForm({
    defaultValues: { email: "" },
    validators: { onChange: forgotPasswordSchema },
    onSubmit: async ({ value }) => {
      forgotPasswordMutation.mutate(value.email, {
        onSuccess: () => setSubmittedEmail(value.email),
      });
    },
  });

  if (submittedEmail) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <MailCheck className="mb-2 size-8 text-primary" />
          <CardTitle className="text-2xl">Check your inbox</CardTitle>
          <CardDescription>
            If an account exists for{" "}
            <span className="font-medium text-foreground">{submittedEmail}</span>, we&apos;ve sent
            a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button className="w-full" render={<Link href="/login" />}>
            Back to login
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Forgot your password?</CardTitle>
        <CardDescription>Enter your email and we&apos;ll send you a reset link.</CardDescription>
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
          <form.Field name="email">
            {(field) => (
              <TextField
                field={field}
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
              />
            )}
          </form.Field>

          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
            {([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                disabled={!canSubmit || isSubmitting || forgotPasswordMutation.isPending}
              >
                {isSubmitting || forgotPasswordMutation.isPending ? "Sending..." : "Send reset link"}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        Remembered your password?
        <Link href="/login" className="ml-1 font-medium text-foreground hover:underline">
          Log in
        </Link>
      </CardFooter>
    </Card>
  );
}
