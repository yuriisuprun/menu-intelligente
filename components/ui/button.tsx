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
        "inline-flex h-10 items-center justify-center rounded-md border border-gold/30 bg-gold px-4 text-sm font-medium text-white shadow-sm transition hover:bg-[#255dc0] focus:outline-none focus:ring-2 focus:ring-gold/35 focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
