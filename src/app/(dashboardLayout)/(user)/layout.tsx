import { RequireAuth } from "@/components/auth/RequireAuth";

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  return <RequireAuth roles={["USER"]}>{children}</RequireAuth>;
}
