import { getStarted } from "@/lib/content";
import { site } from "@/lib/site";
import { Eyebrow } from "./ui/Eyebrow";
import { Reveal } from "./ui/Reveal";
import { LeadForm } from "./LeadForm";

export function GetStarted() {
  return (
    <section
      id="get-started"
      className="relative scroll-mt-24 overflow-hidden border-t border-line py-24 lg:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-30%] left-[-5%] h-[520px] w-[520px] rounded-full bg-signal/[0.07] blur-[140px]"
      />

      <div className="shell relative grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Eyebrow>{getStarted.eyebrow}</Eyebrow>
          <Reveal as="h2" delay={0.05}>
            <span className="display mt-6 block max-w-[13ch] text-[2.1rem] sm:text-[2.8rem] lg:text-[3.2rem]">
              {getStarted.headline}
            </span>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-md text-[1.0625rem] leading-relaxed text-muted">
              {getStarted.body}
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-8 border-l border-line-bright pl-4 text-sm text-dim">
              {getStarted.emailPrompt}{" "}
              <a
                href={`mailto:${site.contactEmail}`}
                className="font-mono text-[13px] text-signal underline underline-offset-4 transition-colors hover:text-signal-soft"
              >
                {site.contactEmail}
              </a>
            </p>
          </Reveal>
        </div>

        <Reveal direction="right" delay={0.1}>
          <LeadForm />
        </Reveal>
      </div>
    </section>
  );
}
