"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  NETLIFY_FORM_NAME,
  TRADES,
  submitLead,
  validateLead,
  type Lead,
} from "@/lib/leads";
import { getStarted } from "@/lib/content";

const EMPTY: Lead = {
  name: "",
  business: "",
  phone: "",
  trade: "",
  message: "",
  smsConsent: false,
};

type Status = "idle" | "pending" | "success" | "error";

/**
 * This component never knows where a lead goes. It validates, calls
 * submitLead(), and renders the result — see lib/leads.ts for the seam.
 */
export function LeadForm() {
  const reduced = useReducedMotion();
  const [lead, setLead] = useState<Lead>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Lead, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState("");

  const set = <K extends keyof Lead>(key: K, value: Lead[K]) => {
    setLead((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validateLead(lead);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus("pending");
    setFormError("");
    const result = await submitLead(lead);

    if (result.ok) {
      setStatus("success");
    } else {
      setStatus("error");
      setFormError(result.error);
    }
  }

  if (status === "success") {
    return (
      <motion.div
        className="ticks console relative px-7 py-14 text-center"
        initial={reduced ? false : { opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        role="status"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
          Received
        </span>
        <h3 className="display-tight mt-4 text-[1.5rem]">
          {getStarted.successTitle}
        </h3>
        <p className="mx-auto mt-3 max-w-sm leading-relaxed text-muted">
          {getStarted.successBody}
        </p>
      </motion.div>
    );
  }

  return (
    <form
      name={NETLIFY_FORM_NAME}
      onSubmit={onSubmit}
      noValidate
      className="ticks console relative p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          index={0}
          id="name"
          label="Your name"
          value={lead.name}
          error={errors.name}
          onChange={(v) => set("name", v)}
          autoComplete="name"
        />
        <Field
          index={1}
          id="business"
          label="Business name"
          value={lead.business}
          error={errors.business}
          onChange={(v) => set("business", v)}
          autoComplete="organization"
        />
        <Field
          index={2}
          id="phone"
          label="Phone"
          type="tel"
          value={lead.phone}
          error={errors.phone}
          onChange={(v) => set("phone", v)}
          autoComplete="tel"
          mono
        />

        <Row index={3}>
          <Label htmlFor="trade">Trade</Label>
          <div className="relative">
            <select
              id="trade"
              name="trade"
              value={lead.trade}
              onChange={(e) => set("trade", e.target.value as Lead["trade"])}
              aria-invalid={!!errors.trade}
              aria-describedby={errors.trade ? "trade-error" : undefined}
              className={`w-full appearance-none rounded-xl border bg-panel-2 py-3 pl-3.5 pr-10 text-[0.9375rem] transition-colors duration-200 focus:border-signal ${
                errors.trade ? "border-alert" : "border-line-bright"
              } ${lead.trade === "" ? "text-dim" : "text-text"}`}
            >
              <option value="">Choose one</option>
              {TRADES.map((trade) => (
                <option key={trade} value={trade}>
                  {trade}
                </option>
              ))}
            </select>
            <svg
              aria-hidden
              viewBox="0 0 12 8"
              className="pointer-events-none absolute right-3.5 top-1/2 h-2 w-3 -translate-y-1/2 text-dim"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path d="M1 1.5L6 6.5L11 1.5" strokeLinecap="square" />
            </svg>
          </div>
          <FieldError id="trade-error" message={errors.trade} />
        </Row>

        <Row index={4} full>
          <Label htmlFor="message">
            What&rsquo;s costing you the most missed calls?
          </Label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={lead.message}
            onChange={(e) => set("message", e.target.value)}
            placeholder="Tell us a bit about your shop..."
            className="w-full resize-y rounded-xl border border-line-bright bg-panel-2 px-3.5 py-3 text-[0.9375rem] text-text transition-colors duration-200 placeholder:text-dim focus:border-signal"
          />
        </Row>

        <Row index={5} full>
          {/* Consent language is compliance copy. Verbatim - do not reword. */}
          <label className="flex cursor-pointer items-start gap-3 text-[0.8125rem] leading-relaxed text-dim">
            <input
              type="checkbox"
              name="sms-consent"
              checked={lead.smsConsent}
              onChange={(e) => set("smsConsent", e.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 rounded accent-[var(--color-signal)]"
            />
            <span>
              (Optional) I agree to receive text messages from ApexAutoFlow (a
              service of SOPS Finance &amp; Accounting LLC) about my request —
              including scheduling, appointment confirmations, and follow-ups.
              Message frequency varies. Message and data rates may apply. Reply
              STOP to opt out or HELP for help. See our{" "}
              <Link href="/privacy" className="text-signal underline underline-offset-2">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link href="/sms-terms" className="text-signal underline underline-offset-2">
                SMS Terms
              </Link>
              .
            </span>
          </label>
        </Row>
      </div>

      <AnimatePresence>
        {status === "error" && formError && (
          <motion.p
            initial={reduced ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="alert"
            className="mt-5 rounded-xl border border-alert/40 bg-alert/[0.07] px-4 py-3 text-sm text-alert"
          >
            {formError}
          </motion.p>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={status === "pending"}
        className="group mt-7 flex w-full items-center justify-center gap-2.5 rounded-full bg-signal px-6 py-4 text-[0.9375rem] font-semibold text-void transition-all duration-300 hover:bg-signal-soft hover:shadow-[0_10px_40px_-10px_rgb(var(--signal-rgb)/0.6)] disabled:cursor-wait disabled:opacity-70"
      >
        {status === "pending" ? "Sending..." : getStarted.submit}
        {status !== "pending" && (
          <svg
            aria-hidden
            viewBox="0 0 16 16"
            className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M2 8h11M9 4l4 4-4 4" strokeLinecap="square" />
          </svg>
        )}
      </button>
    </form>
  );
}

function Row({
  children,
  index,
  full = false,
}: {
  children: React.ReactNode;
  index: number;
  full?: boolean;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={full ? "sm:col-span-2" : ""}
      initial={reduced ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5% 0px" }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Label({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block font-mono text-[10px] uppercase tracking-[0.18em] text-dim"
    >
      {children}
    </label>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-[0.8125rem] text-alert">
      {message}
    </p>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  index,
  type = "text",
  autoComplete,
  mono = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  index: number;
  type?: string;
  autoComplete?: string;
  mono?: boolean;
}) {
  return (
    <Row index={index}>
      <Label htmlFor={id}>{label}</Label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full rounded-xl border bg-panel-2 px-3.5 py-3 text-[0.9375rem] text-text transition-colors duration-200 focus:border-signal ${
          mono ? "font-mono tabular-nums" : ""
        } ${error ? "border-alert" : "border-line-bright"}`}
      />
      <FieldError id={`${id}-error`} message={error} />
    </Row>
  );
}
