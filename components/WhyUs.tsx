"use client";

import { motion, useReducedMotion } from "motion/react";
import { whyUs } from "@/lib/content";
import { Eyebrow } from "./ui/Eyebrow";
import { Reveal } from "./ui/Reveal";

export function WhyUs() {
  const reduced = useReducedMotion();

  return (
    <section id="why-us" className="relative scroll-mt-24 border-t border-line py-24 lg:py-32">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <Eyebrow>{whyUs.eyebrow}</Eyebrow>
            <Reveal as="h2" delay={0.05}>
              <span className="display mt-6 block max-w-[14ch] text-[2rem] sm:text-[2.7rem] lg:text-[3rem]">
                {whyUs.headline}
              </span>
            </Reveal>
          </div>
          <Reveal delay={0.12}>
            <p className="text-[1.0625rem] leading-relaxed text-muted lg:pt-12">
              {whyUs.body}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          {/* overflow-y-hidden is deliberate: `overflow-x: auto` alone coerces
              the y axis to `auto` too, and the rows' entry offset is enough to
              summon a vertical scrollbar that then eats 15px of table width. */}
          <div className="mt-14 overflow-x-auto overflow-y-hidden pb-1">
            <table className="w-full min-w-[660px] border-collapse text-left">
              <caption className="sr-only">
                ApexAutoFlow compared with hiring office staff and a generic CRM
              </caption>
              <thead>
                <tr>
                  <th scope="col" className="w-[26%] pb-4" />
                  {whyUs.columns.map((col, i) => (
                    <th
                      key={col}
                      scope="col"
                      className={`w-[24.6%] pb-4 pl-5 align-bottom ${
                        i === 0 ? "" : ""
                      }`}
                    >
                      <span
                        className={`block font-mono text-[10px] uppercase tracking-[0.18em] ${
                          i === 0 ? "text-signal" : "text-dim"
                        }`}
                      >
                        {i === 0 ? "Us" : "Them"}
                      </span>
                      <span
                        className={`mt-1.5 block text-[0.9375rem] font-semibold ${
                          i === 0 ? "text-text" : "text-muted"
                        }`}
                      >
                        {col}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {whyUs.rows.map((row, r) => (
                  <motion.tr
                    key={row.label}
                    className="border-t border-line"
                    initial={reduced ? false : { opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-8% 0px" }}
                    transition={{
                      duration: 0.55,
                      delay: r * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <th
                      scope="row"
                      className="py-5 pr-4 align-top text-sm font-normal text-dim"
                    >
                      {row.label}
                    </th>
                    {row.values.map((value, c) => (
                      <td
                        key={`${row.label}-${c}`}
                        className={`relative py-5 pl-5 pr-4 align-top text-[0.9375rem] ${
                          c === 0
                            ? "bg-signal/[0.04] font-medium text-text"
                            : "text-muted"
                        }`}
                      >
                        {c === 0 && (
                          <motion.span
                            aria-hidden
                            className="absolute inset-y-0 left-0 w-px origin-top bg-signal/60"
                            initial={reduced ? false : { scaleY: 0 }}
                            whileInView={{ scaleY: 1 }}
                            viewport={{ once: true, margin: "-8% 0px" }}
                            transition={{ duration: 0.6, delay: r * 0.08 + 0.1 }}
                          />
                        )}
                        {value}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
