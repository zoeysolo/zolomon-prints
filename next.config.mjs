/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Custom loader (lib/image-loader.ts) sends the srcset to Google's CDN
    // instead of Vercel's optimizer — responsive, modern-format images at no
    // added Vercel image-optimization cost. remotePatterns are kept for
    // reference but are not used while a custom loader is active.
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "drive.google.com" }
    ]
  },
  // Oct 2026: this shop is retired. Every page now sends visitors to the
  // Squarespace store at zolomonprints.com, so the collector images are no
  // longer sold here as unlimited prints. /api stays reachable so the Stripe
  // webhook can still finish fulfillment for any order already in flight.
  async redirects() {
    return [
      { source: "/", destination: "https://www.zolomonprints.com/", permanent: true },
      { source: "/:path((?!api(?:/|$)).*)", destination: "https://www.zolomonprints.com/", permanent: true }
    ];
  }
};

export default nextConfig;
