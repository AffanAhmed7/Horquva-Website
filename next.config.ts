import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Don't advertise the framework in every response.
  poweredByHeader: false,
  // The services index was folded into the cards on the home page.
  async redirects() {
    return [
      { source: "/services", destination: "/#services", permanent: true },
      // Common page addresses from the old WordPress site, sent to their new equivalents.
      // Anything else WordPress-shaped gets a 410 Gone from proxy.ts.
      { source: "/home", destination: "/", permanent: true },
      { source: "/index.php", destination: "/", permanent: true },
      { source: "/about", destination: "/approach", permanent: true },
      { source: "/about-us", destination: "/approach", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/get-in-touch", destination: "/contact", permanent: true },
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/our-team", destination: "/team", permanent: true },
      { source: "/oba", destination: "/oba-core", permanent: true },
      { source: "/product", destination: "/oba-core", permanent: true },
      { source: "/platform", destination: "/oba-core", permanent: true },
      { source: "/features", destination: "/oba-core", permanent: true },
      { source: "/how-it-works", destination: "/oba-core", permanent: true },
    ];
  },
  // Baseline hardening. No CSP yet: the inline motion and JSON-LD scripts in the
  // root layout would need nonces first.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
