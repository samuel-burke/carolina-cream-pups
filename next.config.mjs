// Allow next/image to optimize photos served from the image CDN (Cloudflare R2
// or any host), derived from NEXT_PUBLIC_IMAGE_BASE_URL so nothing is hardcoded.
// Unset = images load locally from /public/images (placeholders / dev).
const imageBase = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
const remotePatterns = imageBase
  ? [{ protocol: new URL(imageBase).protocol.replace(":", ""), hostname: new URL(imageBase).hostname }]
  : [];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // Tell browsers to always use HTTPS for two years, including
          // subdomains; eligible for the HSTS preload list.
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
    ];
  },
};

export default nextConfig;
