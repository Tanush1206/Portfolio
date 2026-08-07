import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

// ─────────────────────────────────────────────
// EMAILJS CONFIG — fill these in from emailjs.com
// ─────────────────────────────────────────────
const EMAILJS_SERVICE_ID = "service_5rxokx8";   // e.g. "service_abc123"
const EMAILJS_TEMPLATE_ID = "template_3f867zk";  // e.g. "template_xyz789"
const EMAILJS_PUBLIC_KEY = "JfWCL7VqanzAZ6JiR";   // e.g. "xAbCdEfGhIjKlMn"

type FieldErrors = Partial<Record<'name' | 'email' | 'message', string>>;

const validate = (data: { name: string; email: string; message: string }): FieldErrors => {
  const errors: FieldErrors = {};
  if (!data.name.trim()) errors.name = 'Identifier required.';
  if (!data.email.trim()) errors.email = 'Address required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) errors.email = 'Malformed address.';
  if (!data.message.trim()) errors.message = 'Directive cannot be empty.';
  return errors;
};

const Contact: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nextErrors = validate(formData);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus('sending');

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_email: 'tanushthakran.work@gmail.com',
          reply_to: formData.email,
        },
        EMAILJS_PUBLIC_KEY
      );

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setErrors({});
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('EmailJS error:', error);
      // Report what actually went wrong instead of always blaming config —
      // a visitor hitting a network blip should be told to retry, not that
      // the site is unconfigured.
      const text = (error as { text?: string })?.text;
      const offline = typeof navigator !== 'undefined' && !navigator.onLine;
      setErrorMessage(
        offline
          ? 'No network connection detected. Reconnect and retry.'
          : text || 'The mail gateway rejected the transmission. Please retry, or email directly.'
      );
      setStatus('error');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear a field's error as soon as the visitor starts correcting it.
    setErrors(prev => (prev[name as keyof FieldErrors] ? { ...prev, [name]: undefined } : prev));
  };

  const fieldClass = (field: keyof FieldErrors) =>
    `w-full bg-surface-container-lowest border-0 border-b ${
      errors[field] ? 'border-red-500' : 'border-outline-variant focus:border-primary'
    } focus:ring-0 text-white font-code-snippet py-4 px-2 placeholder:text-on-surface-variant/40 transition-all outline-none uppercase`;

  return (
    <div className="relative z-10 pt-section-gap px-margin-safe max-w-container-max mx-auto min-h-screen flex flex-col overflow-hidden">
      {/* Background Layer (Grid) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(to right, #4f46e5 1px, transparent 1px), linear-gradient(to bottom, #4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background"></div>
      </div>

      {/* Hero Section */}
      <section className="mb-gutter relative z-10">
        <div className="flex items-center gap-2 mb-8">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span className="font-code-snippet text-on-surface-variant ml-4 opacity-80 uppercase">root@terminal_luxe: ~/contact</span>
        </div>
        <div className="space-y-4">
          <h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-primary uppercase">CONTACT_<wbr/>INIT</h1>
          <div className="flex items-center flex-wrap font-code-snippet text-base sm:text-xl md:text-headline-md text-tertiary">
            <span className="mr-2 md:mr-4 uppercase">&gt;</span>
            <span className="uppercase break-words min-w-0">initiate --contact --direct</span>
            <span className="inline-block w-2 md:w-2.5 h-5 md:h-6 bg-primary/80 animate-pulse ml-2 md:ml-4 align-middle flex-shrink-0"></span>
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <div className="grid grid-cols-12 gap-gutter mt-12 pb-section-gap relative z-10">
        {/* Left Column: Form */}
        <div className="col-span-12 lg:col-span-8">
          <div className="glass-card p-6 sm:p-8 md:p-10 space-y-8 md:space-y-12 transition-all duration-500 min-h-[450px] flex flex-col">
            {status === 'success' ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 rounded-full border-2 border-tertiary flex items-center justify-center text-tertiary mb-4">
                  <span className="material-symbols-outlined text-4xl">check</span>
                </div>
                <h2 className="font-headline-md text-headline-md text-white uppercase tracking-[0.2em]">Transmission_Successful</h2>
                <div className="font-code-snippet text-on-surface-variant space-y-2 uppercase">
                  <p className="text-tertiary">[DONE] Handshake_Complete</p>
                  <p className="text-tertiary">[DONE] Mail_Delivered_To_Inbox</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="mt-8 font-code-snippet text-primary hover:underline uppercase tracking-widest"
                >
                  Return_To_Terminal
                </button>
              </div>
            ) : status === 'error' ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 rounded-full border-2 border-red-500 flex items-center justify-center text-red-500 mb-4">
                  <span className="material-symbols-outlined text-4xl">warning</span>
                </div>
                <h2 className="font-headline-md text-headline-md text-white uppercase tracking-[0.2em]">Transmission_Failed</h2>
                <p className="font-code-snippet text-red-400 text-sm max-w-sm">{errorMessage}</p>
                <a
                  href="mailto:tanushthakran.work@gmail.com"
                  className="font-code-snippet text-tertiary hover:underline uppercase tracking-widest text-xs"
                >
                  tanushthakran.work@gmail.com
                </a>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="mt-8 font-code-snippet text-primary hover:underline uppercase tracking-widest"
                >
                  Retry_Handshake
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <h2 className="font-headline-md text-headline-md text-on-surface uppercase tracking-widest">Transmission_Data</h2>
                  <p className="font-body-sm text-on-surface-variant opacity-90 italic">Messages are dispatched directly through our secure gateway.</p>
                </div>
                <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label htmlFor="contact-name" className="font-label-caps text-label-caps text-primary block uppercase">Sender_Name</label>
                    <input
                      id="contact-name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={fieldClass('name')}
                      placeholder="ID_IDENTIFIER"
                      type="text"
                      autoComplete="name"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'contact-name-error' : undefined}
                    />
                    {errors.name && (
                      <p id="contact-name-error" role="alert" className="font-code-snippet text-[10px] text-red-400 uppercase tracking-widest">{errors.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="contact-email" className="font-label-caps text-label-caps text-primary block uppercase">Sender_Email</label>
                    <input
                      id="contact-email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={fieldClass('email')}
                      placeholder="ADDR_LOCATOR"
                      type="email"
                      autoComplete="email"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'contact-email-error' : undefined}
                    />
                    {errors.email && (
                      <p id="contact-email-error" role="alert" className="font-code-snippet text-[10px] text-red-400 uppercase tracking-widest">{errors.email}</p>
                    )}
                  </div>
                  <div className="col-span-full space-y-2">
                    <label htmlFor="contact-message" className="font-label-caps text-label-caps text-primary block uppercase">Directive</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className={`${fieldClass('message')} resize-none`}
                      placeholder="INPUT_COMMAND_OR_QUERY..."
                      rows={4}
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? 'contact-message-error' : undefined}
                    ></textarea>
                    {errors.message && (
                      <p id="contact-message-error" role="alert" className="font-code-snippet text-[10px] text-red-400 uppercase tracking-widest">{errors.message}</p>
                    )}
                  </div>
                  <div className="col-span-full pt-8">
                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className={`group relative inline-flex items-center justify-center px-4 md:px-12 py-4 border border-primary font-code-snippet text-primary overflow-hidden transition-all duration-300 ${status === 'sending' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary hover:text-surface-container-lowest'} uppercase text-xs md:text-base w-full md:w-auto`}
                    >
                      <span className="relative z-10 flex items-center gap-2 md:gap-4 break-all">
                        {status === 'sending' ? 'DISPATCHING...' : 'EXECUTE_DISPATCH.SH'}
                        <span className={`material-symbols-outlined text-[14px] md:text-[18px] ${status === 'sending' ? 'animate-bounce' : ''}`}>send</span>
                      </span>
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-4 space-y-gutter">
          <div className="glass-card p-8">
            <h3 className="font-label-caps text-label-caps text-tertiary mb-6 border-b border-tertiary/20 pb-2 uppercase">Binary_Files</h3>
            <ul className="space-y-4 font-code-snippet text-body-sm">
              <li className="group">
                <a className="flex items-center justify-between p-3 border border-white/5 hover:border-tertiary hover:bg-tertiary/5 transition-all" href="mailto:tanushthakran.work@gmail.com">
                  <span className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-tertiary">mail</span>
                    SEND_EMAIL.EXE
                  </span>
                  <span className="text-[10px] opacity-40">4.2 KB</span>
                </a>
              </li>
              <li className="group">
                <a className="flex items-center justify-between p-3 border border-white/5 hover:border-tertiary hover:bg-tertiary/5 transition-all" href="https://github.com/Tanush1206" target="_blank" rel="noopener noreferrer">
                  <span className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-tertiary">link</span>
                    GITHUB_REPO.SH
                  </span>
                  <span className="text-[10px] opacity-40">1.8 KB</span>
                </a>
              </li>
              <li className="group">
                <a className="flex items-center justify-between p-3 border border-white/5 hover:border-tertiary hover:bg-tertiary/5 transition-all" href="https://linkedin.com/in/tanush-thakran-1b54a8327" target="_blank" rel="noopener noreferrer">
                  <span className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-tertiary">terminal</span>
                    LINKEDIN_PROF.SYS
                  </span>
                  <span className="text-[10px] opacity-40">9.4 KB</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Status Card */}
          <div className="glass-card p-8 border-tertiary/20">
            <div className="flex items-center gap-3 mb-4">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-tertiary"></span>
              </span>
              <span className="font-label-caps text-label-caps text-tertiary uppercase">System_Online</span>
            </div>
            <p className="font-body-sm text-on-surface-variant opacity-80 mb-4">
              If there's any suitable role for me, don't hesitate. I'm open to communication on all channels. Let's discuss how I can contribute to your team or project.
            </p>
            <div className="pt-4 border-t border-white/5 text-[10px] font-code-snippet text-on-surface-variant/70 uppercase">
              LOC: NEW_DELHI // TIMEZONE: GMT+5:30
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;