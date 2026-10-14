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
              <span>thedailynews101@gmail.com</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0" />
              <span>+880 1743568912</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="size-4 shrink-0 translate-y-0.5" />
              <span>Chittagong, Bangladesh</span>
            </li>
          </ul>

          
        </div>
      </div>

      <div className="bg-neutral-950 text-neutral-400">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-4 text-xs sm:flex-row sm:px-6 lg:px-8">
          <p>© {year} The Daily Newsfeed. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {/* <Link href="#" className="transition-colors hover:text-neutral-200">
              Privacy Policy
            </Link>
            <Link href="#" className="transition-colors hover:text-neutral-200">
              Terms
            </Link> */}
            <Link href="/about" className="transition-colors hover:text-neutral-200">
              What We Do
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
