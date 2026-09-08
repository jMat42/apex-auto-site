"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { nav, timeline } from "@/lib/site";
import { BookCall } from "./ui/Cta";
import { useActiveNode } from "./LiveLine";

/**
 * A floating capsule rather than a bar welded to the top edge. The section
 * links carry a pill that slides between them as you scroll, driven by the
 * same section tracking as the Live Line rail so the two never disagree.
 */
export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const reduced = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveNode();
  const node = timeline[active];

  // The rail's node ids and the nav hrefs share section ids, so the active
  // link falls straight out of the tracking that already exists. Sections
  // outside the nav (hero, problem, faq, get started) simply show no pill.
  const activeHref = isHome ? `#${timeline[active].id}` : "";

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile panel on any hash navigation.
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, [open]);

  const href = (h: string) => (isHome ? h : `/${h}`);

  return (
    <header className="fixed inset-x-0 top-0 z-50 xl:pl-[196px]">
      <div className="shell pt-3 sm:pt-4">
        {/* The bubble */}
        <div
          className={`mx-auto flex h-14 w-full max-w-[880px] items-center justify-between gap-4 rounded-full border py-2 pl-5 pr-2 backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-500 ${
            scrolled
              ? "border-line-bright bg-void/80 shadow-[0_10px_40px_-12px_rgb(0_0_0/0.85)]"
              : "border-line bg-void/45 shadow-none"
          }`}
        >
          <Link
            href="/"
            className="display-tight shrink-0 text-[1.0625rem] tracking-tight"
            aria-label="ApexAutoFlow, home"
          >
            Apex<span className="text-signal">AutoFlow</span>
          </Link>

          <nav
            className="hidden items-center gap-0.5 lg:flex"
            aria-label="Sections"
          >
            {nav.map((item) => {
              const isActive = activeHref === item.href;
              return (
                <a
                  key={item.href}
                  href={href(item.href)}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative rounded-full px-3.5 py-2 text-sm transition-colors duration-200 ${
                    isActive ? "text-signal" : "text-muted hover:text-text"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      aria-hidden
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-signal/[0.13] ring-1 ring-inset ring-signal/30"
                      transition={
                        reduced
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 380, damping: 32 }
                      }
                    />
                  )}
                  <span className="relative">{item.label}</span>
                </a>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            {/* Wrapper, not a `hidden` class on the button: BookCall's own
                `inline-flex` wins the display cascade and the button leaks
                onto narrow screens. */}
            <span className="hidden sm:block">
              <BookCall className="!px-5 !py-2.5 !text-sm">
                Book a free call
              </BookCall>
            </span>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line-bright text-muted transition-colors hover:border-signal/50 hover:text-text lg:hidden"
            >
              <span className="sr-only">Menu</span>
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
                {open ? (
                  <path
                    d="M4.5 5.5l10 10m0-10l-10 10"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    fill="none"
                  />
                ) : (
                  <>
                    <rect x="2" y="5" width="16" height="1.6" />
                    <rect x="2" y="12" width="16" height="1.6" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile / tablet stand-in for the Live Line rail — its own small
            capsule, filling with the signal colour as the page scrolls. */}
        {isHome && (
          <div className="mt-2 flex justify-center xl:hidden">
            <div className="relative flex items-center gap-2 overflow-hidden rounded-full border border-line bg-void/60 px-3.5 py-1 backdrop-blur-xl">
              <motion.span
                aria-hidden
                style={{ scaleX: progress }}
                className="absolute inset-0 origin-left bg-signal/[0.12]"
              />
              <span aria-hidden className="relative text-[10px] text-signal">
                ▸
              </span>
              <span className="relative font-mono text-[10px] tabular-nums text-muted">
                {node.time}
              </span>
              <span className="relative font-mono text-[10px] uppercase tracking-[0.18em] text-dim">
                {node.label}
              </span>
            </div>
          </div>
        )}

        {open && (
          <div className="mx-auto mt-2 w-full max-w-[880px] overflow-hidden rounded-3xl border border-line-bright bg-void/95 backdrop-blur-xl lg:hidden">
            <nav className="flex flex-col p-2" aria-label="Sections">
              {nav.map((item) => {
                const isActive = activeHref === item.href;
                return (
                  <a
                    key={item.href}
                    href={href(item.href)}
                    onClick={() => setOpen(false)}
                    aria-current={isActive ? "true" : undefined}
                    className={`rounded-full px-4 py-3 text-sm transition-colors ${
                      isActive
                        ? "bg-signal/[0.13] text-signal ring-1 ring-inset ring-signal/30"
                        : "text-muted hover:text-text"
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
              <div className="p-2 pt-3 sm:hidden">
                <BookCall className="w-full">Book a free call</BookCall>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
