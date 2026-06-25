import { afterEach, describe, expect, it, vi } from "vitest";
import { buildContactEmail, emailConfigured } from "./email";

describe("buildContactEmail", () => {
  const base = {
    name: "Jane Doe",
    email: "jane@example.com",
    phone: "919-555-0100",
    message: "Hi! Do you have any females available this spring?",
  };

  it("includes name, email, phone, and message in the text body", () => {
    const { text } = buildContactEmail(base);
    expect(text).toContain("Jane Doe");
    expect(text).toContain("jane@example.com");
    expect(text).toContain("919-555-0100");
    expect(text).toContain("females available");
  });

  it("puts the sender name in the subject", () => {
    expect(buildContactEmail(base).subject).toContain("Jane Doe");
  });

  it("falls back to an em dash when phone is missing", () => {
    const { text } = buildContactEmail({ ...base, phone: undefined });
    expect(text).toContain("Phone: —");
  });

  it("escapes HTML in user input to prevent injection", () => {
    const { html } = buildContactEmail({
      ...base,
      name: "<script>alert('x')</script>",
      message: "a & b < c > d",
    });
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("a &amp; b &lt; c &gt; d");
  });
});

describe("emailConfigured", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("is false when env vars are missing", () => {
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("CONTACT_FROM_EMAIL", "");
    expect(emailConfigured()).toBe(false);
  });

  it("is true only when both required vars are set", () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("CONTACT_FROM_EMAIL", "");
    expect(emailConfigured()).toBe(false);

    vi.stubEnv("CONTACT_FROM_EMAIL", "hello@example.com");
    expect(emailConfigured()).toBe(true);
  });
});
