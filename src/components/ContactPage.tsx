import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { personalInfo } from '../data/personal';
import { ButtonAnchor, Kicker, PageHead, Reveal, Section, Shell } from './ui';

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
    `w-full border-b bg-transparent py-3 text-[15px] outline-none transition-colors duration-300 placeholder:text-muted/60 ${
      errors[field] ? 'border-red-400' : 'border-line focus:border-fg'
    }`;

  return (
    <main className="w-full">
      <Section theme="dark" className="pb-24 md:pb-32">
        <PageHead
          index="06"
          label={`${personalInfo.location} — ${personalInfo.timezone}`}
          title="Get in touch"
          lede={personalInfo.statusText}
        />

        <Shell className="mt-20">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-8">
            <Reveal className="lg:col-span-7">
              <form onSubmit={handleSubmit} noValidate className="relative">
                <div
                  aria-hidden="true"
                  className="absolute left-[-9999px] h-px w-px overflow-hidden"
                >
                  <label htmlFor={HONEYPOT}>Company website</label>
                  <input
                    id={HONEYPOT}
                    name={HONEYPOT}
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="kicker mb-2 block">
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
                    />
                    {errors.name && (
                      <p id="name-error" className="mt-2 text-xs text-red-400">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="kicker mb-2 block">
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
                    />
                    {errors.email && (
                      <p id="email-error" className="mt-2 text-xs text-red-400">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-8">
                  <label htmlFor="message" className="kicker mb-2 block">
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
                  />
                  {errors.message && (
                    <p id="message-error" className="mt-2 text-xs text-red-400">
                      {errors.message}
                    </p>
                  )}
                </div>

                <div className="mt-10 flex flex-wrap items-center gap-6">
                  <button type="submit" disabled={status === 'sending'} className="group btn">
                    {status === 'sending' ? 'Sending…' : 'Send message'}
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </button>

                  <p aria-live="polite" className="text-sm">
                    {status === 'success' && <span>Sent. I will get back to you shortly.</span>}
                    {status === 'error' && (
                      <span className="text-red-400">{errorMessage}</span>
                    )}
                  </p>
                </div>
              </form>
            </Reveal>

            <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9">
              <Kicker>Channels</Kicker>

              <ul className="mt-8 border-t border-line">
                {CHANNELS.map((channel) => (
                  <li key={channel.label}>
                    <a
                      href={channel.href}
                      target={channel.href.startsWith('mailto:') ? undefined : '_blank'}
                      rel="noopener noreferrer"
                      className="group flex items-baseline justify-between gap-4 border-b border-line py-4"
                    >
                      <span className="kicker">{channel.label}</span>
                      <span className="truncate text-sm text-muted transition-colors duration-300 group-hover:text-fg">
                        {channel.value}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-10">
                <ButtonAnchor href={personalInfo.resume}>Download résumé</ButtonAnchor>
              </div>
            </Reveal>
          </div>
        </Shell>
      </Section>
    </main>
  );
};

export default ContactPage;
