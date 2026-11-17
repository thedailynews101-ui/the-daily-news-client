import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";

import { ResendVerificationForm } from "@/components/auth/ResendVerificationForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Verify email - inQtin",
};

const readParam = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value;

/**
 * Consumes the single-use token server-side. Doing this on the server (rather
 * than from a mutation in a client component) means there is no client state
 * that can be left mid-flight, and the token never reaches the browser.
 */
async function consumeVerificationToken(token: string): Promise<"success" | "invalid"> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  try {
    const response = await fetch(`${baseUrl}/api/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
      cache: "no-store",
    });

    return response.ok ? "success" : "invalid";
  } catch {
    return "invalid";
  }
}

export default async function VerifyEmailPage(props: PageProps<"/verify-email">) {
  const searchParams = await props.searchParams;
  const token = readParam(searchParams.token);

  // The link in the email carries the token. Swap it for a ?status= result and
  // redirect, so refreshing this page can never replay an already-used token.
  if (token) {
    const result = await consumeVerificationToken(token);
    redirect(`/verify-email?status=${result}`);
  }

  const verified = readParam(searchParams.status) === "success";

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      {verified ? (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CheckCircle2 className="mb-2 size-8 text-primary" />
            <CardTitle className="text-2xl">Email verified</CardTitle>
            <CardDescription>
              Your account is now active. You can close this tab and log in.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full" render={<Link href="/login" />}>
              Continue to login
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="w-full max-w-md">
          <CardHeader>
            <XCircle className="mb-2 size-8 text-destructive" />
            <CardTitle className="text-2xl">Link invalid or expired</CardTitle>
            <CardDescription>
              This verification link is no longer valid. Enter your email to get a new one.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResendVerificationForm />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
