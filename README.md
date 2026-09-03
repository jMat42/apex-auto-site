# ApexAutoFlow

Marketing site for ApexAutoFlow — missed-call text-back for HVAC, plumbing,
electrical and drain shops across Colorado. A service of SOPS Finance &
Accounting LLC.

Next.js 16 (App Router) · Tailwind v4 · `motion` · static export to `out/`.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # emits out/ — this is what Netlify serves
npm run lint
```

## Where things live

| Path | What |
| --- | --- |
| `lib/content.ts` | Every word of marketing copy. Hand this file to the client for review. |
| `lib/site.ts` | Contact details, nav, and the Live Line timeline. |
| `lib/leads.ts` | **The only backend touchpoint on the site.** |
| `components/LiveLine.tsx` | The left rail — the site's signature element. |
| `app/privacy`, `app/sms-terms`, `app/sms-disclosure` | Compliance pages. |

## Wiring up a backend

Everything server-side funnels through one function:

```ts
submitLead(lead: Lead): Promise<SubmitResult>
```

`LeadForm.tsx` calls it and renders the result. It has no idea what is on the
other side, so switching backends never touches a component.

**Today** it posts to Netlify Forms. Submissions appear under *Netlify dashboard
→ Forms → "contact"*; add an email notification there to forward each lead to
`partner.apexautoflow@gmail.com`. The hidden `<form name="contact">` in
`app/layout.tsx` is what Netlify's build-time crawler detects — the visible form
submits with `fetch()`, so that static copy has to stay.

**To point at Make.com (or anything else):** set `NEXT_PUBLIC_LEAD_ENDPOINT` in
the Netlify environment and redeploy. `submitLead` switches to a JSON POST at
that URL with the `Lead` shape plus `submittedAt`. Nothing else changes.

**To bring it in-house:** drop `output: "export"` from `next.config.ts`, add
`app/api/leads/route.ts` accepting `Lead`, and set
`NEXT_PUBLIC_LEAD_ENDPOINT="/api/leads"`.

### Scheduling

`BOOKING_URL` in `lib/site.ts` is empty, so every "Book a free call" scrolls to
the on-page form. Set it to a Calendly/Cal.com link and the same buttons open
the scheduler instead — one constant, no component edits.

## Rules for editing

- **Legal text is verbatim.** The SMS consent paragraph in `LeadForm.tsx` and
  the bodies of the three legal pages are transcribed from the published site
  and must not be reworded without compliance sign-off.
- **Colour carries meaning.** Amber = ApexAutoFlow acting, steel blue = the
  customer, red = the lost job. Do not use them decoratively.
- **Every animation needs a resting state.** Anything animated is gated on
  `useReducedMotion()` and must render its final state when motion is reduced.
- **No invented statistics.** The Problem section uses arithmetic a shop owner
  can check, not a cited figure.
