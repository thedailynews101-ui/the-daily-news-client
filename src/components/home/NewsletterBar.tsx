"use client";

import * as React from "react";
import { Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterBar() {
  const [submitted, setSubmitted] = React.useState(false);

  return (
    <section className="border-t border-border bg-muted/40">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:px-8">
        <div className="flex items-center gap-3">
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Mail className="size-5" />
          </span>
          <div>
            <p className="font-heading text-lg font-bold">Get the daily brief in your inbox</p>
            <p className="text-sm text-muted-foreground">
              One email a day. Top stories, curated for you.
            </p>
          </div>
        </div>

        <form
          className="flex w-full max-w-md items-center gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(true);
          }}
        >
          <Input
            type="email"
            required
            placeholder="you@example.com"
            aria-label="Email address"
          />
          <Button type="submit">{submitted ? "Subscribed" : "Subscribe"}</Button>
        </form>
      </div>
    </section>
  );
}
