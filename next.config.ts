import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: `next build` emits `out/`, which is what Netlify serves.
  // Remove this (and `images.unoptimized`) when a server is needed — e.g. to
  // move the lead form onto an `app/api/leads` route. See lib/leads.ts.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
