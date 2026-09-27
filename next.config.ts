import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The services index was folded into the cards on the home page.
  async redirects() {
    return [{ source: "/services", destination: "/#services", permanent: true }];
  },
};

export default nextConfig;
