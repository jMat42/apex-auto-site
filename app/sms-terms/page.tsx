import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "SMS Terms & Consent",
  description:
    "The text-messaging program operated by SOPS Finance & Accounting LLC, operating as ApexAutoFlow.",
};

/* Body text transcribed verbatim from the published /sms-terms page.
   Do not reword without compliance sign-off. */
export default function SmsTerms() {
  return (
    <LegalPage
      title="SMS Terms & Consent"
      effective="Effective date: July 1, 2026"
      seeAlso={[
        { label: "Privacy Policy", href: "/privacy" },
        { label: "SMS Text-Back Program", href: "/sms-disclosure" },
      ]}
    >
      <p>
        These SMS Terms &amp; Consent (&ldquo;SMS Terms&rdquo;) describe the
        text-messaging program operated by SOPS Finance &amp; Accounting LLC,
        operating as ApexAutoFlow (&ldquo;we,&rdquo; &ldquo;us,&rdquo;
        &ldquo;our&rdquo;).
      </p>

      <h2>Program description</h2>
      <p>
        SOPS Finance &amp; Accounting LLC, operating as ApexAutoFlow, sends
        automated customer-care text messages to consumers in the trades industry
        (HVAC, plumbing, electrical, drain service). When you call a business and
        the call goes unanswered, an automated voice system (IVR) answers and asks
        whether you would like to receive a text message so you can describe your
        issue or schedule service. If you choose to opt in, we send a single text
        message to the phone number you called from. If you respond and schedule
        service, we send appointment reminders, technician arrival notifications,
        and post-service follow-ups related to that request. This is a
        customer-care messaging program — no marketing messages are sent.
      </p>

      <h2>How you opt in (consent)</h2>
      <p>
        You provide <strong>explicit consent</strong> by pressing 1 on your
        phone&rsquo;s keypad during the automated voice prompt that plays when
        your call is not answered. This keypress confirms that you agree to
        receive a follow-up text message. If you press 2, stay on the line, or
        hang up, no text message is sent. Consent to receive text messages is not
        a condition of receiving service or making any purchase. You may opt out
        at any time by replying STOP to any message.
      </p>

      <h2>Message frequency</h2>
      <p>
        Message frequency varies and depends on how you interact with us (for
        example, when you contact us or have an upcoming appointment).
      </p>

      <h2>Cost</h2>
      <p>
        Message and data rates may apply, depending on your mobile carrier and
        plan.
      </p>

      <h2>How to opt out</h2>
      <p>
        You can cancel at any time by replying <span className="kw">STOP</span>{" "}
        to any message. After you reply STOP, we will send one confirmation
        message and then stop sending texts. To restart, reply{" "}
        <span className="kw">START</span>.
      </p>

      <h2>How to get help</h2>
      <p>
        Reply <span className="kw">HELP</span> to any message for assistance, or
        contact us at{" "}
        <a href="mailto:admin.apexautoflow@gmail.com">
          admin.apexautoflow@gmail.com
        </a>
        .
      </p>

      <h2>Carriers</h2>
      <p>Mobile carriers are not liable for delayed or undelivered messages.</p>

      <h2>Privacy</h2>
      <p>
        We respect your privacy. See our <Link href="/privacy">Privacy Policy</Link>.
      </p>
      <div className="callout">
        <p>
          <strong>We do not sell your information,</strong> and we do not share
          your mobile information or SMS consent with third parties or affiliates
          for marketing or promotional purposes.
        </p>
      </div>

      <h2>Changes</h2>
      <p>
        We may update these SMS Terms from time to time. The effective date above
        shows when they were last revised.
      </p>

      <h2>Contact</h2>
      <p>
        SOPS Finance &amp; Accounting LLC (operating as ApexAutoFlow)
        <br />
        Email:{" "}
        <a href="mailto:admin.apexautoflow@gmail.com">
          admin.apexautoflow@gmail.com
        </a>
      </p>
    </LegalPage>
  );
}
