import type { Metadata } from "next";

import { ChangePasswordForm } from "@/components/auth/ChangePasswordForm";

export const metadata: Metadata = {
  title: "Change password - inQtin",
};

export default function ChangePasswordPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <ChangePasswordForm />
    </div>
  );
}
