import { z } from "zod";

// Mirrors dailynews-server/src/module/Auth/auth.validation.ts exactly, so
// client-side errors always agree with what the API would reject.
const email = z
  .string({ error: "Email is required" })
  .trim()
  .toLowerCase()
  .email("Invalid email address");

const password = z
  .string({ error: "Password is required" })
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Za-z]/, "Password must contain at least one letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export const signupSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters long").max(100),
    email,
    password,
    confirmPassword: z.string({ error: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email,
  password: z.string({ error: "Password is required" }).min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email,
});

export const resetPasswordFormSchema = z
  .object({
    password,
    confirmPassword: z.string({ error: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string({ error: "Current password is required" }).min(1),
    newPassword: password,
    confirmNewPassword: z.string({ error: "Please confirm your new password" }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
