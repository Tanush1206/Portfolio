import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

// ─────────────────────────────────────────────
// EMAILJS CONFIG — fill these in from emailjs.com
// ─────────────────────────────────────────────
const EMAILJS_SERVICE_ID = "service_5rxokx8";   // e.g. "service_abc123"
const EMAILJS_TEMPLATE_ID = "template_3f867zk";  // e.g. "template_xyz789"
const EMAILJS_PUBLIC_KEY = "JfWCL7VqanzAZ6JiR";   // e.g. "xAbCdEfGhIjKlMn"

const Contact: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleManualSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill in all fields.");
      return;
    }

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
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('EmailJS error:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="relative z-10 pt-section-gap px-margin-safe max-w-container-max mx-auto min-h-screen flex flex-col overflow-hidden">
      {/* Background Layer (Grid) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(to right, #4f46e5 1px, transparent 1px), linear-gradient(to bottom, #4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background"></div>
      </div>

      {/* Hero Section */}
      <section className="mb-gutter relative z-10">
        <div className="flex items-center gap-2 mb-8">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span className="font-code-snippet text-on-surface-variant ml-4 opacity-50 uppercase">root@terminal_luxe: ~/contact</span>
        </div>
        <div className="space-y-4">
          <h1 className="font-display-lg text-display-lg text-primary uppercase">Contact_Init</h1>
          <div className="flex items-center font-code-snippet text-headline-md text-tertiary">
            <span className="mr-4 uppercase">&gt;</span>
            <span className="uppercase">initiate --contact --direct</span>
            <span className="inline-block w-2.5 h-6 bg-primary/80 animate-pulse ml-4 vertical-middle"></span>
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <div className="grid grid-cols-12 gap-gutter mt-12 pb-section-gap relative z-10">
        {/* Left Column: Form */}
        <div className="col-span-12 lg:col-span-8">
          <div className="glass-card p-10 space-y-12 transition-all duration-500 min-h-[450px] flex flex-col">
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
                <p className="font-code-snippet text-red-400 uppercase text-sm">EmailJS credentials not configured yet.</p>
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
                  <p className="font-body-sm text-on-surface-variant opacity-70 italic">Messages are dispatched directly through our secure gateway.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="font-label-caps text-label-caps text-primary block uppercase">Sender_Name</label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-surface-container-lowest border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-white font-code-snippet py-4 px-2 placeholder:text-surface-variant transition-all outline-none uppercase"
                      placeholder="ID_IDENTIFIER"
                      type="text"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-caps text-label-caps text-primary block uppercase">Sender_Email</label>
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-surface-container-lowest border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-white font-code-snippet py-4 px-2 placeholder:text-surface-variant transition-all outline-none uppercase"
                      placeholder="ADDR_LOCATOR"
                      type="email"
                    />
                  </div>
                  <div className="col-span-full space-y-2">
                    <label className="font-label-caps text-label-caps text-primary block uppercase">Directive</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full bg-surface-container-lowest border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-white font-code-snippet py-4 px-2 placeholder:text-surface-variant transition-all resize-none outline-none uppercase"
                      placeholder="INPUT_COMMAND_OR_QUERY..."
                      rows={4}
                    ></textarea>
                  </div>
                  <div className="col-span-full pt-8">
                    <button
                      type="button"
                      onClick={handleManualSubmit}
                      disabled={status === 'sending'}
                      className={`group relative inline-flex items-center justify-center px-12 py-4 border border-primary font-code-snippet text-primary overflow-hidden transition-all duration-300 ${status === 'sending' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary hover:text-surface-container-lowest'} uppercase`}
                    >
                      <span className="relative z-10 flex items-center gap-4">
                        {status === 'sending' ? 'DISPATCHING_DATA...' : 'Execute_Dispatch.sh'}
                        <span className={`material-symbols-outlined text-[18px] ${status === 'sending' ? 'animate-bounce' : ''}`}>send</span>
                      </span>
                    </button>
                  </div>
                </div>
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
            <div className="pt-4 border-t border-white/5 text-[10px] font-code-snippet text-on-surface-variant/40 uppercase">
              LOC: NEW_DELHI // TIMEZONE: GMT+5:30
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;