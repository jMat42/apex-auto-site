"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { faq } from "@/lib/content";
import { Eyebrow } from "./ui/Eyebrow";
import { Reveal } from "./ui/Reveal";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const reduced = useReducedMotion();

  return (
    <section id="faq" className="relative scroll-mt-24 border-t border-line py-24 lg:py-32">
      <div className="shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <Eyebrow>{faq.eyebrow}</Eyebrow>
          <Reveal as="h2" delay={0.05}>
            <span className="display mt-6 block text-[2rem] sm:text-[2.7rem] lg:text-[3rem]">
              {faq.headline}
            </span>
          </Reveal>
        </div>

        <div className="border-t border-line">
          {faq.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} delay={i * 0.06}>
                <div className="border-b border-line">
                  <h3>
                    <button
                      type="button"
                      id={`faq-q-${i}`}
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      className="flex w-full items-start gap-4 py-5 text-left transition-colors duration-300 hover:text-signal"
                    >
                      <span
                        aria-hidden
                        className="mt-[9px] h-[7px] w-[7px] shrink-0 border transition-all duration-400"
                        style={{
                          borderColor: isOpen
                            ? "var(--color-signal)"
                            : "var(--color-line-bright)",
                          background: isOpen
                            ? "var(--color-signal)"
                            : "transparent",
                        }}
                      />
                      <span className="flex-1 text-[1.0625rem] font-medium">
                        {item.q}
                      </span>
                      <span
                        aria-hidden
                        className="mt-1 shrink-0 font-mono text-lg leading-none text-dim transition-transform duration-400"
                        style={{
                          transform: isOpen ? "rotate(45deg)" : "none",
                          color: isOpen ? "var(--color-signal)" : undefined,
                        }}
                      >
                        +
                      </span>
                    </button>
                  </h3>

                  {/* Panels stay mounted rather than unmounting when closed:
                      an unmounted answer never reaches the prerendered HTML,
                      which cost us four of five answers in search results and
                      for no-JS readers. `inert` keeps a closed panel out of the
                      accessibility tree and out of the tab order. */}
                  <motion.div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-q-${i}`}
                    inert={!isOpen}
                    initial={false}
                    animate={{
                      height: isOpen ? "auto" : 0,
                      opacity: isOpen ? 1 : 0,
                    }}
                    transition={
                      reduced
                        ? { duration: 0 }
                        : { duration: 0.42, ease: [0.16, 1, 0.3, 1] }
                    }
                    className="overflow-hidden"
                  >
                    <p className="pb-6 pl-[27px] pr-8 leading-relaxed text-muted">
                      {item.a}
                    </p>
                  </motion.div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
