import Link from "next/link";
import { Mail, Phone, MapPin, Apple, Smartphone } from "lucide-react";

const EXPLORE_LINKS = [
  { href: "/", label: "Newsfeed" },
  { href: "/about", label: "About Us" },
];

const ACCOUNT_LINKS = [
  { href: "/login", label: "Login" },
  { href: "/register", label: "Sign Up" },
  { href: "/dashboard", label: "My Dashboard" },
];

// lucide-react no longer ships trademarked brand logos, so social links use
// simple letter badges instead of platform icons.
const SOCIAL_LINKS = [
  { href: "#", label: "Facebook", initials: "F" },
  { href: "#", label: "X (Twitter)", initials: "X" },
  { href: "#", label: "Instagram", initials: "IG" },
  { href: "#", label: "YouTube", initials: "YT" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="sm:col-span-2 lg:col-span-1">
          <Link href="/" className="font-heading text-xl font-bold tracking-tight">
            The Daily Newsfeed
          </Link>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Trusted daily news, built for a generation that reads on the go.
          </p>
          <div className="mt-4 flex items-center gap-3">
            {SOCIAL_LINKS.map(({ href, label, initials }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                title={label}
                className="inline-flex size-8 items-center justify-center rounded-full border border-border text-[11px] font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {initials}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Explore</h3>
          <ul className="mt-4 space-y-2">
            {EXPLORE_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Account</h3>
          <ul className="mt-4 space-y-2">
            {ACCOUNT_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Contact</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Mail className="size-4 shrink-0" />
              <span>hello@dailynewsfeed.com</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0" />
              <span>+880 1234 567890</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="size-4 shrink-0 translate-y-0.5" />
              <span>Dhaka, Bangladesh</span>
            </li>
          </ul>

          <div className="mt-4 flex flex-col gap-2">
            <Link
              href="#"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium transition-colors hover:bg-muted"
            >
              <Apple className="size-4" />
              Get it on App Store
            </Link>
            <Link
              href="#"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium transition-colors hover:bg-muted"
            >
              <Smartphone className="size-4" />
              Get it on Google Play
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-neutral-950 text-neutral-400">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-4 text-xs sm:flex-row sm:px-6 lg:px-8">
          <p>© {year} The Daily Newsfeed. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="transition-colors hover:text-neutral-200">
              Privacy Policy
            </Link>
            <Link href="#" className="transition-colors hover:text-neutral-200">
              Terms
            </Link>
            <Link href="/about" className="transition-colors hover:text-neutral-200">
              What We Do
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
