import type { Metadata } from "next";

import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot password - The Daily Newsfeed",
};

export default function ForgetPasswordPage() {
  return <ForgotPasswordForm />;
}
