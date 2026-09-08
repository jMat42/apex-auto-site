"use client";

import { motion, useReducedMotion } from "motion/react";
import { features } from "@/lib/content";
import { Eyebrow } from "./ui/Eyebrow";
import { Reveal } from "./ui/Reveal";

export function Features() {
  const reduced = useReducedMotion();

  return (
    <section
      id="what-you-get"
      className="relative scroll-mt-24 border-t border-line py-24 lg:py-32"
    >
      <div className="shell relative">
        <Eyebrow>{features.eyebrow}</Eyebrow>
        <Reveal as="h2" delay={0.05}>
          <span className="display mt-6 block max-w-[18ch] text-[2rem] sm:text-[2.7rem] lg:text-[3rem]">
            {features.headline}
          </span>
        </Reveal>

        <ul className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {features.items.map((item, i) => (
            <motion.li
              key={item.title}
              className="group relative bg-void p-7 transition-colors duration-500 hover:bg-panel"
              initial={reduced ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{
                duration: 0.6,
                delay: (i % 3) * 0.09,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {/* Trace charging across the top edge as the card lands. */}
              <motion.span
                aria-hidden
                className="absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-signal via-signal/50 to-transparent"
                initial={reduced ? false : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-8% 0px" }}
                transition={{
                  duration: 0.9,
                  delay: (i % 3) * 0.09 + 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
              <h3 className="display-tight text-[1.15rem]">{item.title}</h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
                {item.body}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
