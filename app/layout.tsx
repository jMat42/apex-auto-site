import type { Metadata } from "next";
import { Archivo, Public_Sans, IBM_Plex_Mono } from "next/font/google";
import { NETLIFY_FORM_NAME } from "@/lib/leads";
import { site } from "@/lib/site";
import { Nav } from "@/components/Nav";
import { LiveLine } from "@/components/LiveLine";
import { Footer } from "@/components/Footer";
import "./globals.css";

/* Display face carries the identity: Archivo pushed onto its width axis reads
   like equipment badging and fleet lettering rather than a default grotesque. */
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "ApexAutoFlow — the next call you miss won't cost you the job",
    template: "%s — ApexAutoFlow",
  },
  description:
    "ApexAutoFlow answers or texts back every call your shop misses, captures what the customer needs, and ranks who to call first. Built for HVAC, plumbing, electrical and drain pros across Colorado. From $79/month.",
  openGraph: {
    title: "ApexAutoFlow — the next call you miss won't cost you the job",
    description:
      "Live call answering and missed-call text-back for trades businesses across Colorado.",
    url: site.url,
    siteName: site.name,
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      /* Palette variant. "blue" runs the sky-blue signal; drop this attribute
         (or set anything else) to fall back to the amber defaults. Both live
         in app/globals.css. */
      data-theme="blue"
      className={`${archivo.variable} ${publicSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col xl:pl-[196px]">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-signal focus:px-4 focus:py-2 focus:font-semibold focus:text-void"
        >
          Skip to content
        </a>

        <LiveLine />
        <Nav />

        <main id="main" className="flex-1">
          {children}
        </main>

        <Footer />

        {/*
          Netlify detects forms by crawling the deployed HTML at build time, and
          the real form is submitted with fetch(), so it needs this static copy
          to find. Field names must match lib/leads.ts.
          Delete this once the site posts to a real endpoint.
        */}
        <form
          name={NETLIFY_FORM_NAME}
          data-netlify="true"
          netlify-honeypot="bot-field"
          hidden
        >
          <input type="hidden" name="form-name" value={NETLIFY_FORM_NAME} />
          <input name="bot-field" />
          <input name="name" />
          <input name="business" />
          <input name="phone" />
          <input name="trade" />
          <textarea name="message" />
          <input name="sms-consent" />
        </form>
      </body>
    </html>
  );
}
