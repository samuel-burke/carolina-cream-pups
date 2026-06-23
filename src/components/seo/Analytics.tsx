import Script from "next/script";

/**
 * Privacy-friendly, cookieless analytics (Plausible-compatible). Renders nothing
 * unless NEXT_PUBLIC_ANALYTICS_DOMAIN is set, so local/dev stays clean and there
 * are no third-party requests until you opt in. Point NEXT_PUBLIC_ANALYTICS_SRC
 * at a self-hosted instance if you don't use plausible.io.
 */
export function Analytics() {
  const domain = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN;
  if (!domain) return null;

  const src = process.env.NEXT_PUBLIC_ANALYTICS_SRC ?? "https://plausible.io/js/script.js";

  return <Script defer data-domain={domain} src={src} strategy="afterInteractive" />;
}
