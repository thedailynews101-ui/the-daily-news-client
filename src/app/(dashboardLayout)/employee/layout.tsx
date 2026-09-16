import { RequireAuth } from "@/components/auth/RequireAuth";

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  return <RequireAuth roles={["EMPLOYEE", "ADMIN", "SUPER_ADMIN"]}>{children}</RequireAuth>;
}
