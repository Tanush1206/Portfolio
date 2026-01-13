import React, { useState } from 'react';
import { Mail, MessageCircle, Send, Github, Linkedin } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    // Encode subject & body for Gmail URL
    const subject = encodeURIComponent(`Portfolio Contact from ${formData.name}`);
    const body = encodeURIComponent(`Name: ${formData.name}\n\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);
    
    // Gmail compose link
    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=tanushthakran@gmail.com&su=${subject}&body=${body}`;
    
    // Open Gmail in new tab
    window.open(gmailLink, '_blank');
  
    // Reset form after opening Gmail
    setFormData({ name: '', email: '', message: '' });
  };
  
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contact" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-wider">
            GET IN TOUCH
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Let's work together to bring your ideas to life
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                <Mail className="text-blue-400" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Email</h3>
                <p className="text-white/70">tanushthakran@gmail.com</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center">
                <MessageCircle className="text-purple-400" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Let's Chat</h3>
                <p className="text-white/70">Available for opportunities</p>
              </div>
            </div>

            <div className="flex gap-6 pt-8">
              <a
                href="https://github.com/Tanush1206"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300"
              >
                <Github size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/tanush-thakran-1b54a8327/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-white/40 focus:bg-white/20 transition-all duration-300"
              />
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-white/40 focus:bg-white/20 transition-all duration-300"
              />
            </div>

            <div>
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-6 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-white/40 focus:bg-white/20 transition-all duration-300 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              Send Message
              <Send size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;