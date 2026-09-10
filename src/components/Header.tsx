import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Phone } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'Subsidy Calculator', href: '#subsidy' },
  { label: 'Products', href: '#products' },
  { label: 'Why Frontline', href: '#why-us' },
  { label: 'Contact', href: '#contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'liquid-glass py-3'
          : 'bg-night/45 border-b border-white/10 py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#hero" onClick={(e) => { e.preventDefault(); handleClick('#hero'); }} className="flex items-center gap-2.5 group">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-solar to-solar-dark flex items-center justify-center shadow-lg shadow-solar/30 transition-transform group-hover:scale-105">
            <Sun className="w-5 h-5 text-white" strokeWidth={2.5} />
            <div className="absolute inset-0 rounded-xl bg-solar/40 blur-md -z-10 animate-pulse-glow" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-white font-bold text-lg tracking-tight">Frontline Solar</span>
            <span className="text-solar text-[10px] font-medium tracking-widest uppercase">Karur · Tamil Nadu · India</span>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => { e.preventDefault(); handleClick(link.href); }}
              className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href="tel:+919000000000"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
          >
            <Phone className="w-4 h-4" />
            +91 86678 72774
          </a>
          <a
            href="https://wa.me/918667872774"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-gradient-to-r from-solar to-solar-dark text-white text-sm font-semibold rounded-lg shadow-lg shadow-solar/30 hover:shadow-solar/50 hover:scale-105 transition-all"
          >
            Get Free Quote
          </a>
        </div>

        <button
          className="lg:hidden text-white p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 liquid-glass border-t-0 rounded-none animate-fade-in">
          <nav className="flex flex-col p-6 gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleClick(link.href); }}
                className="px-4 py-3 text-base font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://wa.me/919000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 px-5 py-3 bg-gradient-to-r from-solar to-solar-dark text-white text-center font-semibold rounded-lg"
            >
              Get Free Quote
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
