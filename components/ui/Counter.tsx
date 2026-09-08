"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

/**
 * Odometer-style count-up, fired once when the number scrolls into view.
 * Money on this site is evidence, so it is always mono and tabular.
 */
export function Counter({
  to,
  prefix = "",
  suffix = "",
  suffixClassName = "",
  duration = 1600,
  className = "",
}: {
  to: number;
  prefix?: string;
  /** Rendered after the number and never animated — e.g. the cents on $199.99. */
  suffix?: string;
  suffixClassName?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduced = useReducedMotion();
  // Seeded with the real number, not 0, so the prerendered HTML carries the
  // true figure for crawlers, social previews and no-JS readers. The first
  // animation frame rewinds it to ~0, and every counter on this site sits well
  // below the fold, so nobody sees the rewind.
  const [value, setValue] = useState(to);

  useEffect(() => {
    if (!inView || reduced) return;

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // Expo-out: fast off the line, settles precisely.
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setValue(Math.round(to * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduced, to, duration]);

  return (
    <span ref={ref} className={`font-mono tabular-nums ${className}`}>
      {prefix}
      {value.toLocaleString("en-US")}
      {suffix && <span className={suffixClassName}>{suffix}</span>}
    </span>
  );
}
