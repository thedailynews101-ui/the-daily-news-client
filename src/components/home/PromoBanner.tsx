import Link from "next/link";

import { Button } from "@/components/ui/button";

export function PromoBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
      <div className="relative isolate overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950 via-purple-900 to-indigo-950 px-6 py-10 text-white sm:px-12 sm:py-14">
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 -left-8 size-28 -translate-y-1/2 rounded-full bg-pink-500/70 blur-2xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-[-2rem] left-24 size-20 rounded-full bg-amber-400/70 blur-2xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-[-1.5rem] right-32 size-16 rounded-full bg-emerald-400/70 blur-2xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-6 bottom-[-1rem] size-28 rounded-full bg-sky-400/70 blur-2xl"
        />

        <div className="relative z-10 max-w-xl">
          <p className="text-sm font-semibold tracking-widest text-white/70 uppercase">
            inQtin
          </p>
          <h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">
            Unlock Something <span className="text-amber-300">Extraordinary</span>.
          </h2>
          <p className="mt-3 text-white/80">
            Create a free account to 
            publish your own news once our editors approve it.
          </p>
          <Button size="lg" className="mt-6" render={<Link href="/register" />}>
            Create Free Account
          </Button>
        </div>
      </div>
    </section>
  );
}
