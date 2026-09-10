/**
 * THE ONLY BACKEND TOUCHPOINT ON THIS SITE.
 *
 * Components never talk to a network. They call `submitLead()` and read the
 * result. Swapping what happens on the other side is a change to this file
 * alone.
 *
 * ---------------------------------------------------------------------------
 * Today (no backend):
 *   Netlify Forms. The hidden static <form name="contact"> in app/layout.tsx is
 *   what Netlify's build-time crawler detects; this module posts to it. Leads
 *   land in Netlify dashboard > Forms > "contact". Add an email notification
 *   there to forward each one to site.contactEmail.
 *
 * To point at a real backend — e.g. the Make.com "Form Submit" webhook:
 *   1. Set NEXT_PUBLIC_LEAD_ENDPOINT in the Netlify environment.
 *   2. Redeploy. Nothing else changes; `postJson` takes over automatically.
 *
 * To move it in-house later:
 *   1. Drop `output: "export"` from next.config.ts.
 *   2. Add app/api/leads/route.ts accepting the `Lead` shape below.
 *   3. Set NEXT_PUBLIC_LEAD_ENDPOINT="/api/leads".
 * ---------------------------------------------------------------------------
 */

export const TRADES = [
  "HVAC",
  "Plumbing",
  "Electrical",
  "Drain",
  "Other",
] as const;

export type Trade = (typeof TRADES)[number];

export type Lead = {
  name: string;
  business: string;
  phone: string;
  trade: Trade | "";
  message?: string;
  smsConsent: boolean;
};

export type SubmitResult = { ok: true } | { ok: false; error: string };

/** Field names are the contract with Netlify Forms. Keep in sync with the
 *  hidden form in app/layout.tsx. */
export const NETLIFY_FORM_NAME = "contact";

const ENDPOINT = process.env.NEXT_PUBLIC_LEAD_ENDPOINT ?? "";

const GENERIC_ERROR =
  "That didn't go through. Try again, or email us and we'll pick it up from there.";

export function validateLead(lead: Lead): Partial<Record<keyof Lead, string>> {
  const errors: Partial<Record<keyof Lead, string>> = {};

  if (!lead.name.trim()) errors.name = "Tell us who you are.";
  if (!lead.business.trim()) errors.business = "What's the shop called?";

  const digits = lead.phone.replace(/\D/g, "");
  if (!digits) errors.phone = "We need a number to call you back on.";
  else if (digits.length < 10) errors.phone = "That's not a full phone number.";

  if (!lead.trade) errors.trade = "Pick the closest one.";

  return errors;
}

function toFormBody(lead: Lead): string {
  const fields: Record<string, string> = {
    "form-name": NETLIFY_FORM_NAME,
    name: lead.name.trim(),
    business: lead.business.trim(),
    phone: lead.phone.trim(),
    trade: lead.trade,
    message: lead.message?.trim() ?? "",
    "sms-consent": lead.smsConsent ? "yes" : "no",
  };
  return new URLSearchParams(fields).toString();
}

async function postNetlifyForm(lead: Lead): Promise<SubmitResult> {
  const res = await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: toFormBody(lead),
  });
  return res.ok ? { ok: true } : { ok: false, error: GENERIC_ERROR };
}

async function postJson(endpoint: string, lead: Lead): Promise<SubmitResult> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...lead, submittedAt: new Date().toISOString() }),
  });
  return res.ok ? { ok: true } : { ok: false, error: GENERIC_ERROR };
}

export async function submitLead(lead: Lead): Promise<SubmitResult> {
  try {
    return ENDPOINT ? await postJson(ENDPOINT, lead) : await postNetlifyForm(lead);
  } catch {
    return { ok: false, error: GENERIC_ERROR };
  }
}
