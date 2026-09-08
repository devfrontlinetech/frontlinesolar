import React, { useRef, useEffect } from 'react';
import { Shield, Award, Zap, Wrench, Leaf, Clock, TrendingUp, Users, Building, Sun } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'ALMM & DCR Certified',
    desc: 'Every module is Tier-1 ALMM listed and DCR-compliant, ensuring Made in India quality that qualifies for all government subsidies.',
    color: 'from-solar to-solar-dark',
  },
  {
    icon: Wrench,
    title: 'End-to-End Installation',
    desc: 'From site survey to TANGEDCO net-metering approval, we handle the entire lifecycle — structural design, electrical, and commissioning.',
    color: 'from-ocean to-sky',
  },
  {
    icon: Award,
    title: '25-Year Performance Guarantee',
    desc: 'Industry-leading warranties backed by domestic manufacturing. Your investment is protected for decades.',
    color: 'from-earth to-earth-dark',
  },
  {
    icon: Zap,
    title: 'Net-Metering Experts',
    desc: 'Deep expertise in TANGEDCO bi-monthly tariff offset and TEDA guidelines. Maximize your bill savings from day one.',
    color: 'from-solar to-accent',
  },
  {
    icon: Leaf,
    title: 'Sustainable by Design',
    desc: 'Bifacial modules capture ambient light, reducing land footprint. Carbon-negative operations across our supply chain.',
    color: 'from-earth to-ocean',
  },
  {
    icon: Clock,
    title: '7-Day Installation',
    desc: 'Streamlined project execution with in-house engineering teams. Most residential systems are commissioned within a week.',
    color: 'from-accent to-solar-dark',
  },
];

const stats = [
  { value: '50+', label: 'MW Installed', icon: Zap },
  { value: '1,200+', label: 'Happy Customers', icon: Users },
  { value: '8', label: 'Districts Served in TN', icon: Building },
  { value: '12M+', label: 'kg CO₂ Offset/Year', icon: Leaf },
];

export default function WhyFrontline() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const el = sectionRef.current;
      if (!el) return;

      const ctx = gsap.context(() => {
        gsap.from('.why-header', {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.why-header', start: 'top 80%' },
        });

        gsap.utils.toArray<HTMLElement>('.why-card').forEach((card, i) => {
          gsap.from(card, {
            y: 50,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out',
            delay: (i % 3) * 0.1,
            scrollTrigger: { trigger: card, start: 'top 88%' },
          });
        });

        // Count-up animation for stats
        gsap.utils.toArray<HTMLElement>('.stat-item').forEach((stat) => {
          const valueEl = stat.querySelector('.stat-value');
          if (!valueEl) return;
          const finalText = valueEl.textContent || '';
          const numericPart = parseFloat(finalText.replace(/[^0-9.]/g, ''));
          const suffix = finalText.replace(/[0-9.]/g, '');

          gsap.fromTo(valueEl,
            { textContent: 0 },
            {
              textContent: numericPart,
              duration: 2,
              ease: 'power1.out',
              snap: { textContent: 1 },
              scrollTrigger: { trigger: stat, start: 'top 85%' },
              onUpdate: function() {
                const val = Math.round(this.targets()[0].textContent);
                valueEl.textContent = val.toLocaleString('en-IN') + suffix;
              },
            }
          );
        });
      }, el);

      return () => ctx.revert();
    })();
  }, []);

  return (
    <section ref={sectionRef} id="why-us" className="relative py-24 md:py-32 bg-secondary/20 overflow-hidden">
      <div className="absolute inset-0 hero-grid-bg opacity-30" />
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-solar/5 blur-[120px] rounded-full" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="why-header text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-solar/10 text-solar rounded-full text-sm font-semibold mb-4">
            <Award className="w-4 h-4" />
            Why Choose Frontline
          </div>
          <h2 className="text-display-lg text-foreground">
            The <span className="text-gradient-solar">Frontline</span> Advantage
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            We don't just sell solar. We engineer energy independence for Karur and Tamil Nadu homes,
            businesses, and farms — backed by Indian manufacturing and local expertise.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="why-card group bg-card border border-border rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Stats banner */}
        <div className="relative bg-gradient-to-br from-night to-night/90 rounded-3xl p-8 md:p-12 overflow-hidden">
          <div className="absolute inset-0 hero-grid-bg opacity-20" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-solar/10 blur-[80px] rounded-full" />

          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="stat-item text-center">
                  <div className="w-12 h-12 rounded-xl bg-solar/10 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-solar" />
                  </div>
                  <p className="stat-value text-3xl md:text-4xl font-bold text-white tabular-nums">{stat.value}</p>
                  <p className="text-white/50 text-sm mt-1">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
