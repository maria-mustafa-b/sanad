import type { NextConfig } from "next";

const config: NextConfig = {
  poweredByHeader: false,

  // Next 16 no longer runs ESLint during builds (the `eslint` key was removed),
  // so linting is enforced via `npm run lint` as a separate gate.
  typescript: {
    ignoreBuildErrors: true,
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};

export default config;
