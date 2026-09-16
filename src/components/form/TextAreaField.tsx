"use client";

import * as React from "react";
import type { AnyFieldApi } from "@tanstack/react-form";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

function getFieldErrorMessage(errors: unknown[]): string | undefined {
  const first = errors[0];
  if (first == null) return undefined;
  if (typeof first === "string") return first;
  if (typeof first === "object" && "message" in first) {
    return String((first as { message: unknown }).message);
  }
  return String(first);
}

export function TextAreaField({
  field,
  label,
  placeholder,
  rows = 6,
}: {
  field: AnyFieldApi;
  label: string;
  placeholder?: string;
  rows?: number;
}) {
  const errorMessage = field.state.meta.isTouched
    ? getFieldErrorMessage(field.state.meta.errors)
    : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={field.name}>{label}</Label>
      <textarea
        id={field.name}
        name={field.name}
        rows={rows}
        placeholder={placeholder}
        value={field.state.value ?? ""}
        aria-invalid={Boolean(errorMessage)}
        onChange={(event) => field.handleChange(event.target.value)}
        onBlur={field.handleBlur}
        className={cn(
          "flex w-full min-w-0 rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground disabled:pointer-events-none disabled:opacity-50",
          "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"
        )}
      />
      {errorMessage && <p className="text-xs text-destructive">{errorMessage}</p>}
    </div>
  );
}
