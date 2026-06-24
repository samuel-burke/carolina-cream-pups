import type { Metadata } from "next";
import { LegalDoc } from "@/components/sections/LegalDoc";
import { termsOfUse } from "@/lib/legal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `The terms that govern your use of the ${site.name} website.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return <LegalDoc doc={termsOfUse} />;
}
