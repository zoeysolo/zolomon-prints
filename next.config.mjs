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
  }
};

export default nextConfig;
