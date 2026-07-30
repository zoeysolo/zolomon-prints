"use client";

import { useState } from "react";

// Posts to the existing FormSubmit endpoint used by the standalone page, so
// inquiries keep landing in the same inbox. Submits via fetch to their AJAX
// endpoint and reports status inline rather than navigating away.

const ENDPOINT = "https://formsubmit.co/ajax/zoey@zolomonprints.com";

const PACKAGES = [
  "Garden Cards, $95",
  "Keepsake, $295",
  "Portrait, $895",
  "Heirloom, $1,350",
  "Estate Collection, $2,600",
  "Gallery wall or large format",
  "Not sure yet"
];

type Status = "idle" | "sending" | "sent" | "error";

export default function InquiryForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form)
      });
      if (!res.ok) throw new Error("Send failed");
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="inquiry-form" onSubmit={onSubmit}>
      <input
        type="hidden"
        name="_subject"
        value="New Commission Inquiry, Wedding Flower Preservation Page"
      />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_captcha" value="false" />

      <div className="form-row">
        <input type="text" name="Name" placeholder="Your name" required />
        <input type="email" name="Email" placeholder="Your email" required />
      </div>
      <div className="form-row">
        <input
          type="text"
          name="Event date"
          placeholder="Event date, if known"
        />
        <select name="Package interest" defaultValue="">
          <option value="">Which tier interests you?</option>
          {PACKAGES.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </div>
      <textarea
        name="Message"
        placeholder="Tell us about your flowers and what you have in mind."
        rows={4}
      />
      <button type="submit" className="sw-btn" disabled={status === "sending"}>
        {status === "sending" ? "sending…" : "Send inquiry"}
      </button>

      {status === "sent" && (
        <p className="note">
          Thank you — your inquiry is in. Zoey replies within two business days.
        </p>
      )}
      {status === "error" && (
        <p className="note" style={{ color: "var(--red)" }}>
          That didn&rsquo;t send. Please email zoey@zolomonprints.com directly.
        </p>
      )}
      <p className="note">
        Prefer email? Reach out directly at{" "}
        <a href="mailto:zoey@zolomonprints.com" className="sw-inline-link">
          zoey@zolomonprints.com
        </a>
      </p>
    </form>
  );
}
