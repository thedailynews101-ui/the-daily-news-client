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
import { useResendVerification } from "@/hooks/auth/use-resend-verification";
import { useSignup } from "@/hooks/auth/use-signup";
import { signupSchema } from "@/schemas/auth.schema";

export function SignupForm() {
  const signupMutation = useSignup();
  const resendMutation = useResendVerification();

  const [submittedEmail, setSubmittedEmail] = React.useState<string | null>(null);

  const form = useForm({
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    validators: { onChange: signupSchema },
    onSubmit: async ({ value }) => {
      signupMutation.mutate(
        { name: value.name, email: value.email, password: value.password },
        { onSuccess: () => setSubmittedEmail(value.email) }
      );
    },
  });

  if (submittedEmail) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <MailCheck className="mb-2 size-8 text-primary" />
          <CardTitle className="text-2xl">Check your inbox</CardTitle>
          <CardDescription>
            We sent a verification link to{" "}
            <span className="font-medium text-foreground">{submittedEmail}</span>. Click it to
            activate your account.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col gap-2">
          <Button
            variant="outline"
            className="w-full"
            disabled={resendMutation.isPending}
            onClick={() => resendMutation.mutate(submittedEmail)}
          >
            {resendMutation.isPending ? "Sending..." : "Resend verification email"}
          </Button>
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
        <CardTitle className="text-2xl">Create your account</CardTitle>
        <CardDescription>
          Join The Daily Newsfeed to save articles, comment, and pitch stories.
        </CardDescription>
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
          <form.Field name="name">
            {(field) => (
              <TextField field={field} label="Full name" autoComplete="name" placeholder="Jane Doe" />
            )}
          </form.Field>
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
              <TextField field={field} label="Password" type="password" autoComplete="new-password" />
            )}
          </form.Field>
          <form.Field name="confirmPassword">
            {(field) => (
              <TextField
                field={field}
                label="Confirm password"
                type="password"
                autoComplete="new-password"
              />
            )}
          </form.Field>

          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
            {([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                disabled={!canSubmit || isSubmitting || signupMutation.isPending}
              >
                {isSubmitting || signupMutation.isPending ? "Creating account..." : "Sign up"}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        Already have an account?
        <Link href="/login" className="ml-1 font-medium text-foreground hover:underline">
          Log in
        </Link>
      </CardFooter>
    </Card>
  );
}
