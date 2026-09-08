import { Reveal } from "./Reveal";

/**
 * Section label, set as a call-log line. The leading rule reads as a channel
 * marker on a dispatch board.
 */
export function Eyebrow({ children }: { children: string }) {
  return (
    <Reveal direction="left">
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="h-px w-8 bg-signal/70"
        />
        <span className="eyebrow">{children}</span>
      </div>
    </Reveal>
  );
}
