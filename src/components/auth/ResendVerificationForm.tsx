"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useResendVerification } from "@/hooks/auth/use-resend-verification";

/** Shown when a verification link is expired or already used. */
export function ResendVerificationForm() {
  const resendMutation = useResendVerification();
  const [email, setEmail] = React.useState("");

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="resend-email">Email</Label>
        <Input
          id="resend-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <Button
        className="w-full"
        disabled={!email || resendMutation.isPending}
        onClick={() => resendMutation.mutate(email)}
      >
        {resendMutation.isPending ? "Sending..." : "Resend verification email"}
      </Button>
    </div>
  );
}
