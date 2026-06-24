import type { Metadata } from "next";
import { LegalDoc } from "@/components/sections/LegalDoc";
import { privacyPolicy } from "@/lib/legal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} collects, uses, and protects your information.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return <LegalDoc doc={privacyPolicy} />;
}
