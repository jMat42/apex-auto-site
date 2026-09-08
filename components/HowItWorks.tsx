"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { howItWorks } from "@/lib/content";
import { Eyebrow } from "./ui/Eyebrow";
import { Reveal } from "./ui/Reveal";

/**
 * The one place on this site where numbering is earned: this is a real
 * four-step sequence and the order carries information the reader needs.
 *
 * Desktop pins a console screen that advances as each step scrolls past.
 * Below lg the screens live inline with their step, which reads better on a
 * phone than a pinned panel would.
 */
export function HowItWorks() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const line = window.innerHeight * 0.5;
      let next = 0;
      stepRefs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= line) next = i;
      });
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

  return (
    <section
      id="how-it-works"
      className="relative scroll-mt-24 border-t border-line py-24 lg:py-32"
    >
      <div className="shell">
        <Eyebrow>{howItWorks.eyebrow}</Eyebrow>
        <Reveal as="h2" delay={0.05}>
          <span className="display mt-6 block max-w-[22ch] text-[2rem] sm:text-[2.7rem] lg:text-[3rem]">
            {howItWorks.headline}
          </span>
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-20">
          {/* Pinned screen (desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-[max(7rem,calc(50vh-13rem))]">
              <div className="ticks console relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
                    {howItWorks.steps[active].chip}
                  </span>
                  <span className="font-mono text-[10px] tabular-nums text-signal">
                    {String(active + 1).padStart(2, "0")} / 04
                  </span>
                </div>
                <div className="relative min-h-[288px]">
                  {/* Keyed remount, deliberately not AnimatePresence: a pending
                      exit used to strand a stale screen when the active step
                      changed again mid-transition. */}
                  <motion.div
                    key={active}
                    initial={reduced ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="p-4"
                  >
                    <Screen step={active} />
                  </motion.div>
                </div>
              </div>

              {/* Step ticks under the screen */}
              <div className="mt-4 flex gap-1.5">
                {howItWorks.steps.map((s, i) => (
                  <span
                    key={s.title}
                    className="h-0.5 flex-1 transition-colors duration-500"
                    style={{
                      background:
                        i <= active
                          ? "var(--color-signal)"
                          : "var(--color-line-bright)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Steps */}
          <ol className="relative">
            {howItWorks.steps.map((step, i) => (
              <div
                key={step.title}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
              >
                <li className="border-t border-line py-10 first:border-t-0 first:pt-0 lg:min-h-[62vh] lg:py-16">
                  <Reveal>
                    <div className="flex items-baseline gap-5">
                      <span
                        className="font-mono text-[13px] tabular-nums transition-colors duration-500"
                        style={{
                          color:
                            i <= active
                              ? "var(--color-signal)"
                              : "var(--color-dim)",
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <h3 className="display-tight text-[1.5rem] sm:text-[1.85rem]">
                          {step.title}
                        </h3>
                        <p className="mt-3 max-w-lg leading-relaxed text-muted">
                          {step.body}
                        </p>
                        <div className="mt-5 lg:hidden">
                          <div className="console overflow-hidden">
                            <div className="border-b border-line px-4 py-2.5">
                              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
                                {step.chip}
                              </span>
                            </div>
                            <div className="p-4">
                              <Screen step={i} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                </li>
              </div>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Screen({ step }: { step: number }) {
  if (step === 0) return <ScreenIvr />;
  if (step === 1) return <ScreenText />;
  if (step === 2) return <ScreenAlert />;
  return <ScreenBooked />;
}

function ScreenIvr() {
  const reduced = useReducedMotion();
  return (
    <div className="space-y-3">
      <div className="rounded-xl bg-panel-2 px-4 py-3.5">
        <div className="font-mono text-[15px] tabular-nums text-text">
          (719) 555-0142
        </div>
        <div className="mt-0.5 text-xs text-dim">Rang out after 18 seconds</div>
      </div>
      <div className="rounded-xl border border-line px-4 py-3.5 text-[13px] leading-snug text-muted">
        &ldquo;Sorry we missed you. Press 1 and we&rsquo;ll text you so you can
        tell us what&rsquo;s wrong.&rdquo;
      </div>
      <div className="flex items-center gap-3">
        <motion.span
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-signal font-mono text-lg text-signal"
          animate={reduced ? {} : { boxShadow: [
            "0 0 0 0 rgb(var(--signal-rgb) / 0.4)",
            "0 0 0 10px rgb(var(--signal-rgb) / 0)",
          ] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          1
        </motion.span>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
          Customer opts in
        </span>
      </div>
    </div>
  );
}

function ScreenText() {
  return (
    <div className="space-y-2">
      <div className="flex justify-end">
        <div className="max-w-[86%] rounded-2xl rounded-br-md border border-signal/25 bg-signal/10 px-3.5 py-2.5 text-[13px] leading-snug text-signal-soft">
          Sorry we missed you! Tell us what&rsquo;s going on and we&rsquo;ll get
          someone out. Reply STOP to opt out.
        </div>
      </div>
      <div className="flex justify-start">
        <div className="max-w-[86%] rounded-2xl rounded-bl-md border border-cool/25 bg-cool/10 px-3.5 py-2.5 text-[13px] leading-snug text-text">
          Furnace is out. No heat at all, and we&rsquo;ve got two kids at home.
        </div>
      </div>
      <div className="pt-2 text-right font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
        Delivered · 4s after the miss
      </div>
    </div>
  );
}

const QUEUE = [
  { tag: "No heat · Emergency", score: 92, value: "$480 – $1,100", hot: true },
  { tag: "Water heater leak", score: 74, value: "$300 – $900", hot: false },
  { tag: "Quote: new thermostat", score: 31, value: "$120 – $260", hot: false },
];

function ScreenAlert() {
  return (
    <div className="space-y-2">
      {QUEUE.map((row) => (
        <div
          key={row.tag}
          className={`flex items-center justify-between gap-3 rounded-xl px-3.5 py-3 ${
            row.hot
              ? "border border-signal/35 bg-signal/[0.06]"
              : "border border-line bg-panel-2"
          }`}
        >
          <div className="min-w-0">
            <div
              className={`truncate text-[13px] font-medium ${
                row.hot ? "text-text" : "text-muted"
              }`}
            >
              {row.tag}
            </div>
            <div className="font-mono text-[11px] tabular-nums text-dim">
              {row.value}
            </div>
          </div>
          <div
            className={`shrink-0 font-mono text-lg tabular-nums ${
              row.hot ? "text-signal" : "text-dim"
            }`}
          >
            {row.score}
          </div>
        </div>
      ))}
      <div className="pt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
        Sorted for you · text + email
      </div>
    </div>
  );
}

function ScreenBooked() {
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-signal/35 bg-signal/[0.06] px-4 py-3.5">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
          Booked
        </div>
        <div className="mt-1.5 text-sm font-medium text-text">
          No heat · Colorado Springs
        </div>
        <div className="mt-0.5 font-mono text-[12px] tabular-nums text-muted">
          Today, 4:30 – 6:00 PM
        </div>
      </div>
      <div className="flex justify-end">
        <div className="max-w-[86%] rounded-2xl rounded-br-md border border-signal/25 bg-signal/10 px-3.5 py-2.5 text-[13px] leading-snug text-signal-soft">
          You&rsquo;re booked for today 4:30–6:00 PM. We&rsquo;ll text when the
          tech is on the way.
        </div>
      </div>
      <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
        Confirmation sent automatically
      </div>
    </div>
  );
}
