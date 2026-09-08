"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { heroCall } from "@/lib/content";

/**
 * The hero does not describe the product, it runs it: a call comes in, rings
 * out, gets texted back, gets a reply, and lands as a ranked alert. One
 * orchestrated sequence, played once when it scrolls into view.
 *
 * Reduced motion renders the finished state immediately - the last frame is
 * the informative one, so nothing is lost.
 */

const STEPS = {
  RINGING: 0,
  NO_ANSWER: 1,
  TEXT_SENT: 2,
  REPLY: 3,
  RANKED: 4,
} as const;

const SCHEDULE = [1900, 800, 1700, 1500]; // ms between steps
const FINAL = STEPS.RANKED;

export function CallConsole() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = useReducedMotion();
  const [step, setStep] = useState<number>(reduced ? FINAL : STEPS.RINGING);

  useEffect(() => {
    if (!inView || reduced) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let elapsed = 0;
    SCHEDULE.forEach((gap, i) => {
      elapsed += gap;
      timers.push(setTimeout(() => setStep(i + 1), elapsed));
    });
    return () => timers.forEach(clearTimeout);
  }, [inView, reduced]);

  const ringing = step === STEPS.RINGING;

  return (
    <div
      ref={ref}
      className="ticks console relative w-full max-w-[420px] shadow-[0_30px_80px_-30px_rgb(0_0_0/0.9)]"
    >
      {/* Console header */}
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span
            className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${
              step >= STEPS.NO_ANSWER ? "bg-signal" : "bg-cool"
            }`}
          />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
            Line 1
          </span>
        </div>
        <Clock step={step} reduced={!!reduced} inView={inView} />
      </div>

      <div className="space-y-2 p-3">
        {/* The call */}
        <div className="relative overflow-hidden rounded-xl bg-panel-2 px-4 py-3.5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-mono text-[15px] tabular-nums text-text">
                {heroCall.number}
              </div>
              <div className="mt-0.5 text-xs text-dim">{heroCall.location}</div>
            </div>
            <Status step={step} />
          </div>

          {ringing && !reduced && (
            <div className="mt-3 flex items-end gap-1" aria-hidden>
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.span
                  key={i}
                  className="w-[3px] bg-cool/70"
                  animate={{ height: [4, 13, 4] }}
                  transition={{
                    duration: 0.9,
                    repeat: Infinity,
                    delay: i * 0.11,
                    ease: "easeInOut",
                  }}
                />
              ))}
              <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.18em] text-dim">
                Ringing
              </span>
            </div>
          )}
        </div>

        {/* The thread. Signal is us, cool is the customer - always. */}
        <div className="min-h-[168px] space-y-2">
          <AnimatePresence>
            {step >= STEPS.TEXT_SENT && (
              <Bubble key="out" side="out" reduced={!!reduced}>
                {heroCall.outbound}
              </Bubble>
            )}
            {step >= STEPS.REPLY && (
              <Bubble key="in" side="in" reduced={!!reduced}>
                {heroCall.inbound}
              </Bubble>
            )}
          </AnimatePresence>
        </div>

        {/* The payoff */}
        <AnimatePresence>
          {step >= STEPS.RANKED && (
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-xl border border-signal/35 bg-signal/[0.06] px-4 py-3.5"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
                  Call this one first
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  Priority{" "}
                  <span className="text-base font-medium tabular-nums text-signal">
                    {heroCall.score}
                  </span>
                </span>
              </div>
              <div className="mt-2 text-sm font-medium text-text">
                {heroCall.tag}
              </div>
              <div className="mt-1 font-mono text-xs tabular-nums text-muted">
                Est. {heroCall.estimate}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="border-t border-line px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
        Example alert
      </p>
    </div>
  );
}

function Status({ step }: { step: number }) {
  const label =
    step >= STEPS.TEXT_SENT
      ? "Texted back"
      : step >= STEPS.NO_ANSWER
        ? "No answer"
        : "Incoming";

  const tone =
    step >= STEPS.TEXT_SENT
      ? "border-signal/40 text-signal"
      : step >= STEPS.NO_ANSWER
        ? "border-alert/40 text-alert"
        : "border-cool/40 text-cool";

  return (
    <span
      className={`shrink-0 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors duration-500 ${tone}`}
    >
      {label}
    </span>
  );
}

function Bubble({
  side,
  children,
  reduced,
}: {
  side: "in" | "out";
  children: string;
  reduced: boolean;
}) {
  const out = side === "out";
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`flex ${out ? "justify-end" : "justify-start"}`}
    >
      <div className="max-w-[85%]">
        <div
          className={`rounded-2xl px-3.5 py-2.5 text-[13px] leading-snug ${
            out
              ? "rounded-br-md border border-signal/25 bg-signal/10 text-signal-soft"
              : "rounded-bl-md border border-cool/25 bg-cool/10 text-text"
          }`}
        >
          {children}
        </div>
        <div
          className={`mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-dim ${
            out ? "text-right" : "text-left"
          }`}
        >
          {out ? "Sent by ApexAutoFlow" : "Customer"}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Elapsed job time, matching the Live Line rail: rings out at 00:18, the text
 * goes at 00:22. The four seconds in the headline are the ones on this clock.
 */
function Clock({
  step,
  reduced,
  inView,
}: {
  step: number;
  reduced: boolean;
  inView: boolean;
}) {
  // Only the ringing phase needs state; every later reading is a pure function
  // of `step`, so it is derived rather than stored.
  const [ticks, setTicks] = useState(0);

  useEffect(() => {
    if (reduced || !inView || step >= STEPS.NO_ANSWER) return;
    const id = setInterval(() => setTicks((t) => (t < 18 ? t + 1 : t)), 100);
    return () => clearInterval(id);
  }, [step, reduced, inView]);

  const secs =
    reduced || step >= STEPS.TEXT_SENT ? 22 : step >= STEPS.NO_ANSWER ? 18 : ticks;

  return (
    <span className="font-mono text-[11px] tabular-nums text-muted">
      00:{String(secs).padStart(2, "0")}
    </span>
  );
}
