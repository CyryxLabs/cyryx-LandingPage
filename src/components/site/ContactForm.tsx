import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { FIT_REVIEW_PROJECT_TYPES } from "@/lib/contact.schema";
import { getLeadAttribution } from "@/lib/lead-attribution";
import { getActiveCopyVariant } from "@/lib/copy-variant";
import { trackCta } from "@/lib/track-cta";

/**
 * Short contact form. Posts the same shape as /start to /api/public/contact,
 * so every inquiry reaches the CRM with consent and attribution recorded.
 */
export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    setStatus("sending");
    setError(null);
    try {
      const response = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: String(fd.get("name") ?? ""),
          email: String(fd.get("email") ?? ""),
          company: String(fd.get("company") ?? ""),
          projectType: String(fd.get("projectType") ?? "Other"),
          problem: String(fd.get("problem") ?? ""),
          consent: fd.get("consent") === "on",
          website: String(fd.get("website") ?? ""),
          source: "contact",
          attribution: getLeadAttribution(getActiveCopyVariant()),
        }),
      });
      const result = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok)
        throw new Error(result.error || "We couldn't send that. Please try again.");
      setStatus("sent");
      trackCta({ cta: "generate_lead", section: "contact", href: "/contact" });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "We couldn't send that. Please try again.");
      trackCta({ cta: "qualification_form_error", section: "contact", href: "/contact" });
    }
  }

  if (status === "sent") {
    return (
      <div className="cy-note" role="status" tabIndex={-1}>
        <strong>Message received.</strong> A person from Cyryx Labs will reply by email. If it is a
        project, the next step is a free 20-minute fit check.
      </div>
    );
  }

  return (
    <form
      className="cy-form"
      onSubmit={onSubmit}
      onFocus={() => {
        if (started) return;
        setStarted(true);
        trackCta({ cta: "form_start", section: "contact", href: "/contact" });
      }}
      aria-label="Contact form"
    >
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        hidden
      />
      <div className="cy-form__row">
        <label className="cy-field">
          <span>Name</span>
          <input className="cy-input" name="name" required maxLength={100} autoComplete="name" />
        </label>
        <label className="cy-field">
          <span>Work email</span>
          <input
            className="cy-input"
            type="email"
            name="email"
            required
            maxLength={255}
            autoComplete="email"
          />
        </label>
      </div>
      <div className="cy-form__row">
        <label className="cy-field">
          <span>Company</span>
          <input
            className="cy-input"
            name="company"
            required
            minLength={2}
            maxLength={160}
            autoComplete="organization"
          />
        </label>
        <label className="cy-field">
          <span>What is it about?</span>
          <select className="cy-input" name="projectType" defaultValue="Other">
            {FIT_REVIEW_PROJECT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="cy-field">
        <span>How can we help?</span>
        <textarea
          className="cy-input"
          name="problem"
          required
          minLength={10}
          maxLength={2000}
          placeholder="A sentence or two is enough. Please leave out passwords and confidential details."
        />
      </label>
      <label className="cy-consent">
        <input type="checkbox" name="consent" required />
        <span>
          I agree that Cyryx Labs may use these details to reply, as described in the{" "}
          <Link to="/privacy">privacy policy</Link>.
        </span>
      </label>
      {error ? (
        <p className="cy-error" role="alert">
          {error}
        </p>
      ) : null}
      <div className="cy-actions">
        <button type="submit" className="cy-btn cy-btn--primary" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send message"}
          <ArrowRight aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
