"use client";

import type { ReactNode } from "react";
import { BOOKING_URL } from "@/lib/site";

/**
 * Every "Book a free call" on the site routes through here, so wiring up a
 * scheduler later is a one-constant change in lib/site.ts — no component edits.
 */
export function BookCall({
  children,
  variant = "primary",
  className = "",
}: {
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
}) {
  const base =
    "group relative inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-[0.9375rem] font-semibold transition-all duration-300 focus-visible:outline-2";

  const styles =
    variant === "primary"
      ? "bg-signal text-void hover:bg-signal-soft hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-10px_rgb(var(--signal-rgb)/0.6)]"
      : "border border-line-bright text-text hover:border-signal/60 hover:text-signal hover:-translate-y-0.5";

  const external = BOOKING_URL !== "";

  return (
    <a
      href={external ? BOOKING_URL : "#get-started"}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`${base} ${styles} ${className}`}
    >
      {children}
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M2 8h11M9 4l4 4-4 4" strokeLinecap="square" />
      </svg>
    </a>
  );
}
