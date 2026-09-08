"use client";

import { motion, useReducedMotion } from "motion/react";
import { pricing } from "@/lib/content";
import { Eyebrow } from "./ui/Eyebrow";
import { Reveal } from "./ui/Reveal";
import { Counter } from "./ui/Counter";
import { BookCall } from "./ui/Cta";

type Plan = (typeof pricing.plans)[number];

export function Pricing() {
  return (
    // overflow-hidden: the bloom below is wider than a phone viewport and
    // would otherwise scroll the page sideways.
    <section
      id="pricing"
      className="relative scroll-mt-24 overflow-hidden border-t border-line py-24 lg:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal/[0.06] blur-[140px]"
      />

      <div className="shell relative">
        <Eyebrow>{pricing.eyebrow}</Eyebrow>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <Reveal as="h2" delay={0.05}>
            <span className="display mt-6 block max-w-[14ch] text-[2rem] sm:text-[2.7rem] lg:text-[3rem]">
              {pricing.headline}
            </span>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="max-w-md text-[1.0625rem] leading-relaxed text-muted lg:mt-6 lg:pt-3">
              {pricing.sub}
            </p>
          </Reveal>
        </div>

        {/* Stretch, not items-start: the cards hold different numbers of lines
            and the two "Book a free call" buttons should sit on one line. */}
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {pricing.plans.map((plan, i) => (
            <PlanCard key={plan.id} plan={plan} index={i} />
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-signal/30 bg-signal/[0.06] px-4 py-2.5">
            <span aria-hidden className="text-signal">
              ★
            </span>
            <span className="text-[0.8125rem] text-signal-soft">
              {pricing.badge}
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function PlanCard({ plan, index }: { plan: Plan; index: number }) {
  const reduced = useReducedMotion();
  const featured = plan.featured;

  return (
    <Reveal direction={index === 0 ? "left" : "right"} delay={0.1 + index * 0.08}>
      <motion.div
        className={`ticks console relative flex h-full flex-col ${
          featured ? "border-signal/35 bg-signal/[0.035]" : ""
        }`}
        whileHover={reduced ? {} : { y: -4 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Head */}
        <div className="border-b border-line px-6 pb-7 pt-6">
          <div className="flex items-start justify-between gap-3">
            <span
              className={`font-mono text-[10px] uppercase tracking-[0.2em] ${
                featured ? "text-signal" : "text-dim"
              }`}
            >
              {plan.name}
            </span>
            {plan.flag && (
              <span className="rounded-full border border-signal/40 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-signal">
                {plan.flag}
              </span>
            )}
          </div>

          <div className="mt-4 flex items-end gap-2">
            <Counter
              to={plan.amount}
              prefix="$"
              suffix={plan.cents}
              suffixClassName="text-[1.75rem]"
              duration={1100}
              className="text-[3.4rem] font-semibold leading-none text-text"
            />
            <span className="pb-1.5 text-sm text-muted">{plan.period}</span>
          </div>

          <p className="mt-4 text-[0.9375rem] font-medium text-text">
            {plan.tagline}
          </p>
          <p className="mt-1.5 text-sm text-muted">{plan.note}</p>
        </div>

        {/* Allowances — spec readout, so mono and tabular. */}
        {plan.meters.length > 0 && (
          <div className="border-b border-line px-6 py-4">
            <dl>
              {plan.meters.map((meter) => (
                <div
                  key={meter.label}
                  className="flex items-baseline justify-between gap-4 py-1.5"
                >
                  <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-dim">
                    {meter.label}
                  </dt>
                  <dd className="font-mono text-[15px] tabular-nums text-text">
                    {meter.value}{" "}
                    <span className="text-[11px] text-dim">{meter.unit}</span>
                  </dd>
                </div>
              ))}
            </dl>
            {plan.meterNote && (
              <p className="mt-2 text-[13px] text-dim">{plan.meterNote}</p>
            )}
          </div>
        )}

        {/* What's in it */}
        <ul className="flex-1 space-y-3.5 px-6 py-6">
          {plan.includes.map((item, i) => (
            <motion.li
              key={item}
              className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-muted"
              initial={reduced ? false : { opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.07 }}
            >
              <span
                aria-hidden
                className={`mt-[8px] h-[6px] w-[6px] shrink-0 ${
                  featured ? "bg-signal" : "bg-signal/70"
                }`}
              />
              {item}
            </motion.li>
          ))}
        </ul>

        <div className="border-t border-line p-6">
          <BookCall variant={featured ? "primary" : "ghost"} className="w-full">
            {pricing.cta}
          </BookCall>
        </div>
      </motion.div>
    </Reveal>
  );
}
