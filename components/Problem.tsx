"use client";

import { motion, useReducedMotion } from "motion/react";
import { problem } from "@/lib/content";
import { Eyebrow } from "./ui/Eyebrow";
import { Reveal } from "./ui/Reveal";
import { Counter } from "./ui/Counter";

/** A day's worth of rung-out calls. Illustrative, and labelled as such. */
const LOG = [
  { number: "(303) 555-0118", time: "07:41" },
  { number: "(719) 555-0142", time: "09:12" },
  { number: "(970) 555-0177", time: "11:58" },
  { number: "(303) 555-0290", time: "14:26" },
];

export function Problem() {
  const reduced = useReducedMotion();

  return (
    <section id="problem" className="relative scroll-mt-24 border-t border-line py-24 lg:py-32">
      <div className="shell grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <div>
          <Eyebrow>{problem.eyebrow}</Eyebrow>

          <Reveal as="h2" delay={0.05}>
            <span className="display mt-6 block max-w-[16ch] text-[2rem] sm:text-[2.7rem] lg:text-[3rem]">
              {problem.headline}
            </span>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-muted">
              {problem.body}
            </p>
          </Reveal>

          {/* The log. Red means the job is gone. */}
          <div className="mt-10 max-w-md border-t border-line">
            {LOG.map((row, i) => (
              <motion.div
                key={row.number}
                className="flex items-center justify-between gap-4 border-b border-line py-2.5"
                initial={reduced ? false : { opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.5, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="font-mono text-[13px] tabular-nums text-muted">
                  {row.number}
                </span>
                <span className="font-mono text-[11px] tabular-nums text-dim">
                  {row.time}
                </span>
                <motion.span
                  className="font-mono text-[10px] uppercase tracking-[0.18em] text-alert"
                  initial={reduced ? false : { opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.35, delay: i * 0.12 + 0.3 }}
                >
                  Missed
                </motion.span>
              </motion.div>
            ))}
            <Reveal delay={0.6}>
              <p className="pt-3 font-mono text-[11px] tracking-[0.1em] text-dim">
                ...and that is before lunch.
              </p>
            </Reveal>
          </div>
        </div>

        {/* The arithmetic. No borrowed statistics - just numbers you can check. */}
        <Reveal direction="right" delay={0.1}>
          <div className="ticks console relative overflow-hidden lg:sticky lg:top-28">
            <div className="border-b border-line px-5 py-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
                {problem.mathLead}
              </span>
            </div>

            <dl className="px-5 py-2">
              {problem.math.map((row, i) => (
                <motion.div
                  key={row.label}
                  className="flex items-baseline justify-between gap-6 border-b border-line/70 py-3.5 last:border-0"
                  initial={reduced ? false : { opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.14 }}
                >
                  <dt className="text-sm text-muted">{row.label}</dt>
                  <dd className="shrink-0 font-mono text-[15px] tabular-nums text-text">
                    {row.value}
                  </dd>
                </motion.div>
              ))}
            </dl>

            <div className="border-t border-line bg-alert/[0.05] px-5 py-6">
              <Counter
                to={problem.mathTotal}
                prefix="$"
                className="block text-[2.6rem] font-semibold leading-none text-alert sm:text-[3rem]"
              />
              <p className="mt-2 text-sm text-muted">{problem.mathTotalLabel}</p>
            </div>
          </div>

          <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-dim">
            {problem.mathFootnote}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
