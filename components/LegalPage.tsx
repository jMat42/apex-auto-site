import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Shell for /privacy, /sms-terms and /sms-disclosure. Presentation only — the
 * body text of those pages is compliance copy and is transcribed verbatim from
 * the published site.
 */
export function LegalPage({
  title,
  effective,
  children,
  seeAlso,
}: {
  title: string;
  effective: string;
  children: ReactNode;
  seeAlso: { label: string; href: string }[];
}) {
  return (
    <article className="relative pt-28 pb-24">
      <div className="shell relative max-w-[760px]">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-dim transition-colors hover:text-signal"
        >
          <span aria-hidden>←</span> Back to site
        </Link>

        <h1 className="display mt-8 text-[2.1rem] sm:text-[2.7rem]">{title}</h1>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-signal">
          {effective}
        </p>
        <div className="rule mt-8" />

        <div className="legal mt-2">{children}</div>

        <div className="mt-16 border-t border-line pt-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
            See also
          </span>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            {seeAlso.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-muted underline underline-offset-4 transition-colors hover:text-signal"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
