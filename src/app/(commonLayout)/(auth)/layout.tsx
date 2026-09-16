import { RedirectIfAuthenticated } from "@/components/auth/RedirectIfAuthenticated";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <RedirectIfAuthenticated>
      <div className="flex flex-1 items-center justify-center px-4 py-12">{children}</div>
    </RedirectIfAuthenticated>
  );
}
