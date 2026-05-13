"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Button({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md border border-gold/50 bg-gold/10 px-4 text-sm font-medium text-gold transition hover:bg-gold/20 focus:outline-none focus:ring-2 focus:ring-gold/30 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
