import { type FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { SectionHeading } from "../components/SectionHeading";

export const ContactPage = () => {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      event.currentTarget.reset();
      toast.success("Thanks. Our host team will follow up shortly.");
    }, 500);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Contact"
        title="Speak with the host team"
        description="For private dining, accessibility requests, or reservation questions, send a note or call the restaurant."
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="card p-6">
          <div className="space-y-5 text-neutral-700">
            <p className="flex gap-3"><FiMapPin className="mt-1" /> 88 Madison Avenue, New York, NY</p>
            <p className="flex gap-3"><FiPhone className="mt-1" /> (212) 555-0198</p>
            <p className="flex gap-3"><FiMail className="mt-1" /> reservations@auroratable.com</p>
          </div>
          <div className="mt-8 overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-100 p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-500">Hours</p>
            <div className="mt-4 space-y-2 text-sm text-neutral-700">
              <p>Tue-Thu: 5:00 PM - 9:30 PM</p>
              <p>Fri-Sat: 5:00 PM - 10:30 PM</p>
              <p>Sun: 5:00 PM - 9:00 PM</p>
              <p>Mon: Closed</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="label">Name</label>
              <input className="field" required placeholder="Your name" />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="field" required type="email" placeholder="you@example.com" />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Message</label>
              <textarea className="field min-h-40" required placeholder="How can we help?" />
            </div>
          </div>
          <button className="btn-primary mt-6 px-6 py-3" disabled={submitting}>
            {submitting ? "Sending..." : "Send message"}
          </button>
        </form>
      </div>
    </section>
  );
};
