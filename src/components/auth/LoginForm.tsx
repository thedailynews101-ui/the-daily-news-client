"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "@tanstack/react-form";

import { TextField } from "@/components/form/TextField";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLogin } from "@/hooks/auth/use-login";
import { useResendVerification } from "@/hooks/auth/use-resend-verification";
import { getApiErrorCode } from "@/lib/api-error";
import { getDashboardPathForRole } from "@/lib/auth-routes";
import { loginSchema } from "@/schemas/auth.schema";
import { AuthErrorCode } from "@/types/auth";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");

  const loginMutation = useLogin();
  const resendMutation = useResendVerification();

  const [unverifiedEmail, setUnverifiedEmail] = React.useState<string | null>(null);

  const form = useForm({
    defaultValues: { email: "", password: "" },
    validators: { onChange: loginSchema },
    onSubmit: async ({ value }) => {
      setUnverifiedEmail(null);

      loginMutation.mutate(value, {
        onSuccess: (response) => {
          router.replace(redirectTo || getDashboardPathForRole(response.data.user.role));
        },
        onError: (error) => {
          if (getApiErrorCode(error) === AuthErrorCode.EMAIL_NOT_VERIFIED) {
            setUnverifiedEmail(value.email);
          }
        },
      });
    },
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Log in</CardTitle>
        <CardDescription>Welcome back to inQtin.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {unverifiedEmail && (
          <Alert variant="destructive">
            <AlertTitle>Email not verified</AlertTitle>
            <AlertDescription>
              Please verify {unverifiedEmail} before logging in.{" "}
              <button
                type="button"
                className="font-medium underline underline-offset-2 disabled:opacity-50"
                onClick={() => resendMutation.mutate(unverifiedEmail)}
                disabled={resendMutation.isPending}
              >
                {resendMutation.isPending ? "Sending..." : "Resend verification email"}
              </button>
            </AlertDescription>
          </Alert>
        )}

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
          <form.Field name="password">
            {(field) => (
              <TextField
                field={field}
                label="Password"
                type="password"
                autoComplete="current-password"
              />
            )}
          </form.Field>

          <div className="text-right text-sm">
            <Link href="/forget-password" className="text-muted-foreground hover:text-foreground">
              Forgot password?
            </Link>
          </div>

          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
            {([canSubmit, isSubmitting]) => (
              <Button type="submit" disabled={!canSubmit || isSubmitting || loginMutation.isPending}>
                {isSubmitting || loginMutation.isPending ? "Logging in..." : "Log in"}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        Don&apos;t have an account?
        <Link href="/register" className="ml-1 font-medium text-foreground hover:underline">
          Sign up
        </Link>
      </CardFooter>
    </Card>
  );
}
