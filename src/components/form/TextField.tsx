"use client";

import * as React from "react";
import type { AnyFieldApi } from "@tanstack/react-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * TanStack Form's Standard Schema adapter reports issues as `{ message }`
 * objects (not plain strings). Handle both shapes defensively so this
 * doesn't silently break across minor library versions.
 */
function getFieldErrorMessage(errors: unknown[]): string | undefined {
  const first = errors[0];

  if (first == null) {
    return undefined;
  }

  if (typeof first === "string") {
    return first;
  }

  if (typeof first === "object" && "message" in first) {
    return String((first as { message: unknown }).message);
  }

  return String(first);
}

export function TextField({
  field,
  label,
  type = "text",
  placeholder,
  autoComplete,
}: {
  field: AnyFieldApi;
  label: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  autoComplete?: string;
}) {
  const errorMessage = field.state.meta.isTouched
    ? getFieldErrorMessage(field.state.meta.errors)
    : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={field.name}>{label}</Label>
      <Input
        id={field.name}
        name={field.name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={field.state.value ?? ""}
        aria-invalid={Boolean(errorMessage)}
        onChange={(event) => field.handleChange(event.target.value)}
        onBlur={field.handleBlur}
      />
      {errorMessage && <p className="text-xs text-destructive">{errorMessage}</p>}
    </div>
  );
}
