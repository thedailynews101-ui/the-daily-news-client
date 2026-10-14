import type { Metadata } from "next";
import Link from "next/link";
import { CircleCheckBig, SquarePen, ShieldCheck, Sparkles, Users, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Us | The Daily Newsfeed",
  description:
    "The Daily Newsfeed is a daily newsfeed built for youth — trusted, verified reporting plus a community publishing model where any user can write news for admin review.",
};

const DIFFERENTIATORS = [
  {
    icon: ShieldCheck,
    title: "Trusted, verified reporting",
    description:
      "Every story that carries our name is checked by an employee or admin before it ever goes live — no rumors, no unverified screenshots.",
  },
  {
    icon: Sparkles,
    title: "Built for youth",
    description:
      "Bite-sized reads, a feed that respects your time, and coverage of the stories that actually shape a young reader's world.",
  },
  {
    icon: Users,
    title: "Community-powered",
    description:
      "You're not just a reader. Any registered user can pitch and submit a story — our newsroom reviews it, and if it holds up, it gets published under your byline.",
  },
];

const PUBLISHING_STEPS = [
  {
    icon: SquarePen,
    title: "1. Submit",
    description: "Sign in and write your story from your personal dashboard, with sources attached.",
  },
  {
    icon: Eye,
    title: "2. Review",
    description: "An employee or admin checks it for accuracy before it can go anywhere near the feed.",
  },
  {
    icon: CircleCheckBig,
    title: "3. Publish",
    description: "Approved stories go live on The Daily Newsfeed, credited to you as the author.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-sm font-semibold tracking-widest text-brand uppercase">About Us</p>
        <h1 className="mt-3 font-heading text-4xl font-black tracking-tight sm:text-5xl">
          Daily news, built for people who grew up online.
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          The Daily Newsfeed is a daily newsfeed focused on youth — fast, honest reporting on the
          stories that matter to a generation that reads on their phone between classes, shifts,
          and everything else.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {DIFFERENTIATORS.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Icon className="size-5" />
              </span>
              <h3 className="font-heading text-lg font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">
              Our uniqueness: trusted news, written by anyone.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Most outlets talk at their readers. We let readers become reporters. Every user can
              publish a news story — it just has to pass review first. Here&apos;s exactly how
              that works.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {PUBLISHING_STEPS.map(({ icon: Icon, title, description }, index) => (
              <div key={title} className="relative flex flex-col items-center text-center">
                <span className="inline-flex size-14 items-center justify-center rounded-full border-2 border-brand bg-background text-brand">
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-4 font-heading text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{description}</p>
                {index < PUBLISHING_STEPS.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute top-7 left-[calc(50%+2.5rem)] hidden h-px w-[calc(100%-5rem)] bg-border sm:block"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl font-bold sm:text-4xl">
          Ready to read and write your own stories?
        </h2>
        <p className="mt-4 text-muted-foreground">
          Create a free account to unlock your dashboard, and start
          pitching stories of your own.
        </p>
        <Button size="lg" className="mt-6" render={<Link href="/register" />}>
          Join The Daily Newsfeed
        </Button>
      </section>
    </>
  );
}
