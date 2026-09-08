"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion, useSpring, useTransform } from "motion/react";
import { timeline } from "@/lib/site";

/**
 * THE SIGNATURE.
 *
 * A permanent instrument rail down the left edge carrying the arc of one
 * recovered job: ring -> no answer -> text sent -> reply -> ranked -> booked
 * -> on site -> paid. It is not a scroll progress bar; the nodes are labelled
 * with elapsed job time, so the rail tells you where in the story you are.
 *
 * The signal charges down the track as you scroll and each node ignites as its
 * section arrives. Below xl the rail is replaced by a hairline top bar
 * (see components/Nav.tsx).
 */

const TOP_PAD = 116; // px reserved above the track for the rail heading
const BOTTOM_PAD = 88;

/** Index of the timeline node whose section currently owns the viewport. */
export function useActiveNode() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const line = window.innerHeight * 0.42;
      let next = 0;

      timeline.forEach((node, i) => {
        if (node.id === "top") return;
        const el = document.getElementById(node.id);
        if (el && el.getBoundingClientRect().top <= line) next = i;
      });

      // The last node only lights once the page bottom is genuinely in view.
      const atEnd =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 140;
      if (atEnd) next = timeline.length - 1;

      setActive(next);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return active;
}

export function LiveLine() {
  const pathname = usePathname();
  const active = useActiveNode();
  const reduced = useReducedMotion();
  const last = timeline.length - 1;
  const target = (active / last) * 100;

  const charge = useSpring(0, { stiffness: 90, damping: 24, mass: 0.6 });
  const height = useTransform(charge, (v) => `${v}%`);

  useEffect(() => {
    if (reduced) charge.jump(target);
    else charge.set(target);
  }, [target, charge, reduced]);

  // The rail tells the story of the marketing page. It has nothing to say on
  // the legal routes, so it stays off there.
  if (pathname !== "/") return null;

  return (
    <aside
      aria-hidden
      /* Anchored to the content column, not the window edge, so the rail stays
         next to the page on ultrawide displays instead of drifting away. */
      style={{ left: "max(0px, calc((100vw - 1376px) / 2))" }}
      className="pointer-events-none fixed inset-y-0 z-40 hidden w-[196px] border-r border-line bg-void/70 backdrop-blur-sm xl:block"
    >
      <div className="absolute left-8 top-11 font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
        Job timeline
      </div>
      <div className="absolute left-8 top-[68px] h-px w-24 bg-line-bright" />

      {/* Unlit track */}
      <div
        className="absolute left-[38px] w-px bg-line-bright"
        style={{ top: TOP_PAD, bottom: BOTTOM_PAD }}
      />

      {/* Charge */}
      <div
        className="absolute left-[38px] w-px"
        style={{ top: TOP_PAD, bottom: BOTTOM_PAD }}
      >
        <motion.div
          style={{ height }}
          className="w-px bg-gradient-to-b from-signal-dim via-signal to-signal-soft shadow-[0_0_12px_rgb(var(--signal-rgb)/0.55)]"
        />
      </div>

      {/* Nodes */}
      <div
        className="absolute inset-x-0"
        style={{ top: TOP_PAD, bottom: BOTTOM_PAD }}
      >
        {timeline.map((node, i) => {
          const passed = i <= active;
          const isActive = i === active;
          return (
            <div
              key={node.id}
              className="absolute left-[34px] flex -translate-y-1/2 items-center gap-3"
              style={{ top: `${(i / last) * 100}%` }}
            >
              <span
                className="block h-[9px] w-[9px] shrink-0 border transition-all duration-500"
                style={{
                  borderColor: passed
                    ? "var(--color-signal)"
                    : "var(--color-line-bright)",
                  background: passed ? "var(--color-signal)" : "var(--color-void)",
                  boxShadow: isActive
                    ? "0 0 0 3px rgb(var(--signal-rgb) / 0.14), 0 0 14px rgb(var(--signal-rgb) / 0.5)"
                    : "none",
                }}
              />
              <span className="flex flex-col leading-[1.35]">
                <span
                  className="font-mono text-[10px] tabular-nums transition-colors duration-500"
                  style={{
                    color: isActive
                      ? "var(--color-signal)"
                      : passed
                        ? "var(--color-muted)"
                        : "var(--color-dim)",
                  }}
                >
                  {node.time}
                </span>
                <span
                  className="font-mono text-[10px] uppercase tracking-[0.14em] transition-colors duration-500"
                  style={{
                    color: isActive
                      ? "var(--color-text)"
                      : passed
                        ? "var(--color-muted)"
                        : "var(--color-dim)",
                  }}
                >
                  {node.label}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
