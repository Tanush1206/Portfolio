import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { personalInfo } from '../data/personal';
import { PageHeader, Panel } from './pageChrome';
import { INK, MUTED } from './pageText';

// ─────────────────────────────────────────────
// EMAILJS CONFIG — the same account the deployed site sends through.
// The public key is a browser-side credential and is safe to ship.
// ─────────────────────────────────────────────
const EMAILJS_SERVICE_ID = 'service_5rxokx8';
const EMAILJS_TEMPLATE_ID = 'template_3f867zk';
const EMAILJS_PUBLIC_KEY = 'JfWCL7VqanzAZ6JiR';

// Bots fill every field they find; a human never sees this one.
const HONEYPOT = 'company_website';
const MIN_FILL_MS = 3000;

type Fields = { name: string; email: string; message: string };
type FieldErrors = Partial<Record<keyof Fields, string>>;

const EMPTY: Fields = { name: '', email: '', message: '' };

const validate = (data: Fields): FieldErrors => {
  const errors: FieldErrors = {};
  if (!data.name.trim()) errors.name = 'Please tell me your name.';
  if (!data.email.trim()) errors.email = 'An address is required so I can reply.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = 'That address looks malformed.';
  }
  if (!data.message.trim()) errors.message = 'The message cannot be empty.';
  return errors;
};

const CHANNELS = [
  { label: 'Email', value: personalInfo.email, href: `mailto:${personalInfo.email}` },
  { label: 'GitHub', value: 'Tanush1206', href: personalInfo.github },
  { label: 'LinkedIn', value: 'tanush-thakran', href: personalInfo.linkedin },
  { label: 'X', value: '@tanush65556130', href: personalInfo.twitter },
];

const ContactPage = () => {
  const [form, setForm] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const openedAt = useRef(Date.now());

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear a field's error as soon as the visitor starts correcting it.
    setErrors((prev) => (prev[name as keyof Fields] ? { ...prev, [name]: undefined } : prev));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Silently drop obvious bots: a filled honeypot, or a form completed
    // faster than any human could read it.
    const trap = new FormData(event.target as HTMLFormElement).get(HONEYPOT);
    if (trap || Date.now() - openedAt.current < MIN_FILL_MS) {
      setStatus('success');
      setForm(EMPTY);
      return;
    }

    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus('sending');

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
          to_email: personalInfo.email,
          reply_to: form.email,
        },
        EMAILJS_PUBLIC_KEY,
      );

      setStatus('success');
      setForm(EMPTY);
      setErrors({});
      window.setTimeout(() => setStatus('idle'), 6000);
    } catch (error) {
      // Say what actually went wrong rather than always blaming config — a
      // visitor hitting a network blip should be told to retry.
      const text = (error as { text?: string })?.text;
      const offline = typeof navigator !== 'undefined' && !navigator.onLine;
      setErrorMessage(
        offline
          ? 'No network connection. Reconnect and try again.'
          : text || 'The mail gateway rejected the message. Please retry, or email me directly.',
      );
      setStatus('error');
    }
  };

  const fieldClass = (field: keyof Fields) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition-colors duration-200 ${
      errors[field] ? 'border-red-500' : 'border-black/15 focus:border-black'
    }`;

  return (
    <main className="w-full pt-16 md:pt-24 pb-24 md:pb-32">
      <PageHeader
        eyebrow={`${personalInfo.location} — ${personalInfo.timezone}`}
        title="Let us talk."
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 mt-12 md:mt-16 grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
        <Panel className="lg:col-span-2">
          <h2
            className="font-instrument text-2xl sm:text-3xl leading-[0.95]"
            style={{ color: INK, letterSpacing: '-0.0256em' }}
          >
            Send a message
          </h2>
          <p className="mt-2 text-sm" style={{ color: MUTED }}>
            It arrives straight in my inbox, and replies go back to the address you give.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-8">
            <div aria-hidden="true" className="absolute left-[-9999px] w-px h-px overflow-hidden">
              <label htmlFor={HONEYPOT}>Company website</label>
              <input id={HONEYPOT} name={HONEYPOT} type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name" className="block text-xs mb-2" style={{ color: MUTED }}>
                  Your name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  className={fieldClass('name')}
                  style={{ color: INK }}
                />
                {errors.name && (
                  <p id="name-error" className="mt-2 text-xs text-red-600">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-xs mb-2" style={{ color: MUTED }}>
                  Your email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="jane@company.com"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className={fieldClass('email')}
                  style={{ color: INK }}
                />
                {errors.email && (
                  <p id="email-error" className="mt-2 text-xs text-red-600">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="message" className="block text-xs mb-2" style={{ color: MUTED }}>
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                value={form.message}
                onChange={handleChange}
                placeholder="What would you like to talk about?"
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? 'message-error' : undefined}
                className={`${fieldClass('message')} resize-y`}
                style={{ color: INK }}
              />
              {errors.message && (
                <p id="message-error" className="mt-2 text-xs text-red-600">
                  {errors.message}
                </p>
              )}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={status === 'sending'}
                className="rounded-full px-8 py-3.5 text-sm text-white transition-transform duration-300 hover:scale-[1.03] disabled:opacity-60 disabled:hover:scale-100"
                style={{ backgroundColor: INK }}
              >
                {status === 'sending' ? 'Sending...' : 'Send message'}
              </button>

              <p aria-live="polite" className="text-sm">
                {status === 'success' && (
                  <span className="text-green-700">Sent. I will get back to you shortly.</span>
                )}
                {status === 'error' && <span className="text-red-600">{errorMessage}</span>}
              </p>
            </div>
          </form>
        </Panel>

        <Panel>
          <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
            {personalInfo.statusText}
          </p>

          <ul className="mt-8 space-y-5">
            {CHANNELS.map((channel) => (
              <li key={channel.label}>
                <p className="text-xs" style={{ color: MUTED }}>
                  {channel.label}
                </p>
                <a
                  href={channel.href}
                  target={channel.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="text-sm underline decoration-black/20 underline-offset-4 transition-colors duration-300 hover:decoration-black"
                  style={{ color: INK }}
                >
                  {channel.value}
                </a>
              </li>
            ))}
          </ul>

          <a
            href={personalInfo.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded-full border border-black/15 px-6 py-2.5 text-sm transition-colors duration-300 hover:border-black/40"
            style={{ color: INK }}
          >
            Download résumé
          </a>
        </Panel>
      </div>
    </main>
  );
};

export default ContactPage;
