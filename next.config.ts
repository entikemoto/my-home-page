import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  outputFileTracingIncludes: {
    "/dev-diary": ["./content/dev-diary/**/*"],
    "/dev-diary/[slug]": ["./content/dev-diary/**/*"],
  },
};

export default nextConfig;
