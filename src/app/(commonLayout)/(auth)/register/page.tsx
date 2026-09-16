import type { Metadata } from "next";

import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Sign up - The Daily Newsfeed",
};

export default function RegisterPage() {
  return <SignupForm />;
}
