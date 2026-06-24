/**
 * LEGAL CONTENT — Privacy Policy & Terms of Use.
 *
 * Plain, editable copy for the two legal pages. These are intentionally kept in
 * code (not the Airtable content layer) because they change rarely and should be
 * version-controlled. Edit the text below to update the live pages.
 *
 * NOTE FOR SAMUEL: This is a sensible, plain-English starting point — not legal
 * advice. Have an attorney review both documents before launch, and update the
 * `effectiveDate` whenever you make a substantive change.
 */
import { site } from "./site";

export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type LegalDocument = {
  title: string;
  effectiveDate: string;
  intro: string;
  sections: LegalSection[];
};

const effectiveDate = "June 24, 2026";
const contactEmail = site.contact.email;

export const privacyPolicy: LegalDocument = {
  title: "Privacy Policy",
  effectiveDate,
  intro: `${site.name} ("we," "us," or "our") respects your privacy. This policy explains what information we collect when you visit ${site.url} or contact us about a puppy, how we use it, and the choices you have.`,
  sections: [
    {
      heading: "Information we collect",
      paragraphs: [
        "We only collect information you choose to give us and a small amount of standard technical data.",
      ],
      bullets: [
        "Information you provide: when you fill out our contact or waitlist form, we collect your name, email address, phone number (if provided), and the contents of your message.",
        "Usage data: like most websites, we collect anonymous, aggregated analytics (such as pages visited and general location) to understand how the site is used. This does not identify you personally.",
      ],
    },
    {
      heading: "How we use your information",
      bullets: [
        "To respond to your inquiry and communicate with you about available and upcoming litters.",
        "To manage our waitlists and let you know when a puppy may be a match.",
        "To improve our website and the information we provide.",
      ],
    },
    {
      heading: "How we share your information",
      paragraphs: [
        "We do not sell, rent, or trade your personal information. We share it only with the service providers that help us run the site and communicate with you — for example, our website host, form/email delivery provider, and analytics provider — and only to the extent needed to perform those services. We may also disclose information if required by law.",
      ],
    },
    {
      heading: "Cookies and analytics",
      paragraphs: [
        "We use privacy-friendly, aggregated analytics to measure site traffic. You can set your browser to refuse cookies or alert you when cookies are being sent; some parts of the site may not function as intended if you do.",
      ],
    },
    {
      heading: "Data retention",
      paragraphs: [
        "We keep inquiry and waitlist information for as long as needed to assist you and for our ordinary record-keeping. You can ask us to delete your information at any time (see below).",
      ],
    },
    {
      heading: "Your choices and rights",
      paragraphs: [
        `You may ask us to access, correct, or delete the personal information we hold about you, or to stop contacting you. To make a request, email us at ${contactEmail}.`,
      ],
    },
    {
      heading: "Children's privacy",
      paragraphs: [
        "Our website is intended for adults. We do not knowingly collect personal information from children under 13.",
      ],
    },
    {
      heading: "Changes to this policy",
      paragraphs: [
        "We may update this policy from time to time. When we do, we will revise the effective date at the top of this page.",
      ],
    },
    {
      heading: "Contact us",
      paragraphs: [
        `If you have any questions about this Privacy Policy, email us at ${contactEmail}.`,
      ],
    },
  ],
};

export const termsOfUse: LegalDocument = {
  title: "Terms of Use",
  effectiveDate,
  intro: `These Terms of Use govern your use of ${site.url} (the "Site"), operated by ${site.name}. By using the Site, you agree to these terms. Please also review our Privacy Policy.`,
  sections: [
    {
      heading: "About the information on this site",
      paragraphs: [
        "The Site provides information about our English Cream Golden Retrievers, our program, and how to join a waitlist. We work to keep details such as litter timing, availability, and pricing accurate and current, but information may change without notice and may contain errors. Nothing on the Site is a binding offer to sell a specific puppy.",
      ],
    },
    {
      heading: "Inquiries, waitlists, and reservations",
      bullets: [
        "Submitting a form or joining a waitlist is a request to be considered; it does not by itself reserve a puppy or create a sale.",
        "Reservations, deposits, pick order, health guarantees, and the terms of any purchase are governed by the separate written agreement we provide before a sale is finalized. If anything in that agreement conflicts with the Site, the written agreement controls.",
      ],
    },
    {
      heading: "Health guarantee",
      paragraphs: [
        "We offer a one-year genetic health guarantee. The specific terms, conditions, and what it covers are set out in our written sales agreement, which takes precedence over any summary on the Site.",
      ],
    },
    {
      heading: "Acceptable use",
      paragraphs: [
        "You agree to use the Site lawfully and not to interfere with its operation, attempt to gain unauthorized access, or use it to send spam or harmful content.",
      ],
    },
    {
      heading: "Intellectual property",
      paragraphs: [
        `All content on the Site — including text, photographs, and graphics — is owned by ${site.name} or used with permission and is protected by copyright. You may not reproduce or distribute it without our written permission.`,
      ],
    },
    {
      heading: "Third-party links",
      paragraphs: [
        "The Site may link to third-party websites (such as health-testing databases) for your convenience. We are not responsible for the content or practices of those sites.",
      ],
    },
    {
      heading: "Disclaimer and limitation of liability",
      paragraphs: [
        'The Site is provided "as is" without warranties of any kind. To the fullest extent permitted by law, we are not liable for any damages arising from your use of, or inability to use, the Site.',
      ],
    },
    {
      heading: "Changes to these terms",
      paragraphs: [
        "We may update these Terms of Use from time to time. Continued use of the Site after changes are posted means you accept the updated terms.",
      ],
    },
    {
      heading: "Contact us",
      paragraphs: [
        `Questions about these terms? Email us at ${contactEmail}.`,
      ],
    },
  ],
};
