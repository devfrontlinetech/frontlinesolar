import React, { useRef, useEffect, useState } from 'react';
import { Sun, Phone, Mail, MapPin, MessageCircle, Send, Factory, Shield, Zap, Clock } from 'lucide-react';

export default function Footer() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    (async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const el = sectionRef.current;
      if (!el) return;

      const ctx = gsap.context(() => {
        gsap.from('.contact-fade', {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 80%' },
        });
      }, el);

      return () => ctx.revert();
    })();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // In production, this would send to an API
    setTimeout(() => setSubmitted(false), 4000);
    setFormData({ name: '', phone: '', message: '' });
  };

  const contactInfo = [
    { icon: Phone, label: 'Call Us', value: '+91 8667872774', href: 'tel:+918667872774' },
    { icon: Mail, label: 'Email', value: 'info@frontlinesolar.in', href: 'mailto:info@frontlinesolar.in' },
    { icon: MapPin, label: 'Head Office', value: 'Karur, Tamil Nadu, India', href: '#' },
    { icon: Clock, label: 'Working Hours', value: 'Mon – Sat: 9 AM – 7 PM', href: '#' },
  ];

  const certifications = [
    { icon: Factory, label: 'Make in India' },
    { icon: Shield, label: 'Aatmanirbhar Bharat' },
    { icon: Zap, label: 'ALMM Certified' },
    { icon: Shield, label: 'DCR Compliant' },
  ];

  return (
    <section ref={sectionRef} id="contact" className="relative bg-night text-white overflow-hidden">
      <div className="absolute inset-0 hero-grid-bg opacity-20" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-solar/10 blur-[120px] rounded-full" />

      {/* Contact section */}
      <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: Info */}
          <div>
            <div className="contact-fade inline-flex items-center gap-2 px-4 py-1.5 bg-solar/20 text-solar rounded-full text-sm font-semibold mb-6">
              <MessageCircle className="w-4 h-4" />
              Get in Touch
            </div>
            <h2 className="contact-fade text-display-lg text-white mb-4">
              Ready to Go <span className="text-gradient-solar">Solar?</span>
            </h2>
            <p className="contact-fade text-white/60 text-lg mb-10 max-w-md">
              Get a free site survey and customized solar proposal in Karur. Our experts will
              guide you through PM Surya Ghar subsidy claims, TANGEDCO net-metering approvals, and installation.
            </p>

            {/* Contact info grid */}
            <div className="contact-fade grid sm:grid-cols-2 gap-4 mb-10">
              {contactInfo.map((info, i) => {
                const Icon = info.icon;
                return (
                  <a
                    key={i}
                    href={info.href}
                    className="group flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 hover:border-solar/30 transition-all"
                  >
                    <div className="w-10 h-10 rounded-lg bg-solar/10 flex items-center justify-center shrink-0 group-hover:bg-solar/20 transition-colors">
                      <Icon className="w-5 h-5 text-solar" />
                    </div>
                    <div>
                      <p className="text-xs text-white/50 uppercase tracking-wide">{info.label}</p>
                      <p className="text-sm font-medium text-white">{info.value}</p>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/918667872774?text=I%20want%20a%20free%20solar%20consultation"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-fade inline-flex items-center gap-3 px-6 py-4 bg-green-500/10 border border-green-500/30 text-green-400 font-semibold rounded-xl hover:bg-green-500/20 transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
            </a>

            {/* Certifications */}
            <div className="contact-fade flex flex-wrap gap-3 mt-10">
              {certifications.map((cert, i) => {
                const Icon = cert.icon;
                return (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/10">
                    <Icon className="w-4 h-4 text-solar" />
                    <span className="text-xs font-medium text-white/80">{cert.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Contact form */}
          <div className="contact-fade">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8">
              <h3 className="text-xl font-bold text-white mb-6">Request a Free Quote</h3>

              {submitted && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Thank you! We'll contact you within 24 hours.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-solar/50 focus:ring-1 focus:ring-solar/30 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 ..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-solar/50 focus:ring-1 focus:ring-solar/30 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Message (Optional)</label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your roof, monthly bill, or any questions..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-solar/50 focus:ring-1 focus:ring-solar/30 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-solar to-solar-dark text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-lg shadow-solar/30"
                >
                  <Send className="w-5 h-5" />
                  Send Request
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="relative border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-solar to-solar-dark flex items-center justify-center">
                <Sun className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <span className="text-white font-bold">Frontline Solar</span>
                <span className="text-white/40 text-sm ml-2">· Karur, Tamil Nadu, India</span>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-white/50">
              <a href="#hero" className="hover:text-white transition-colors">Home</a>
              <a href="#subsidy" className="hover:text-white transition-colors">Subsidy</a>
              <a href="#products" className="hover:text-white transition-colors">Products</a>
              <a href="#why-us" className="hover:text-white transition-colors">About</a>
              <a href="#contact" className="hover:text-white transition-colors">Contact</a>
            </div>

            <p className="text-xs text-white/40">
              © {new Date().getFullYear()} Frontline Tech. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
