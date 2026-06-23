import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { Analytics as PlausibleAnalytics } from "@/components/seo/Analytics";
import { Analytics } from "@vercel/analytics/next";
import { cssVariables } from "@/lib/theme";
import { site } from "@/lib/site";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display-src",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body-src",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — AKC English Cream Golden Retrievers in ${site.location.city}, ${site.location.regionCode}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  keywords: [
    "English Cream Golden Retriever",
    "Golden Retriever puppies",
    "AKC Golden Retriever breeder",
    "Wake Forest NC puppies",
    "North Carolina golden retriever breeder",
    "Puppy Culture breeder",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: site.name,
    description: site.description,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF7F2",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <head>
        {/* Tokens -> CSS custom properties. Single source of truth: lib/theme.ts.
            Maps the variable-font families onto the semantic --font-* tokens. */}
        <style
          dangerouslySetInnerHTML={{
            __html:
              cssVariables() +
              `:root{--font-display:var(--font-display-src),Georgia,serif;--font-body:var(--font-body-src),system-ui,sans-serif;}`,
          }}
        />
        <JsonLd />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <PlausibleAnalytics />
        <Analytics />
      </body>
    </html>
  );
}
