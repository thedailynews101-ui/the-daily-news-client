import type { Metadata } from "next";

import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot password - inQtin",
};

export default function ForgetPasswordPage() {
  return <ForgotPasswordForm />;
}
