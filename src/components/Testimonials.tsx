import React, { useRef, useEffect } from "react";
import { Star, Quote, MapPin } from "lucide-react";

const testimonials = [
  {
    name: "Harish",
    role: "Homeowner",
    location: "Karur",
    rating: 5,
    text: "Bought Gamma Solar series inverter. They came came after few days and checked performance also. Great solar company in Karur",
    initials: "RK",
    color: "bg-solar",
  },
  {
    name: "Logesh",
    role: "Textile Mill Owner",
    location: "Karur",
    rating: 5,
    text: "Installed Solar Plant for my company in Karur. Fast installation. Good tips for maintenance too. Regular follow ups. Definitely recommend",
    initials: "LN",
    color: "bg-ocean",
  },
  {
    name: "Hari Kumar",
    role: "Farmer",
    location: "Karur District",
    rating: 5,
    text: "Installed solar panel for our bank. Happy about regular follow up. Reliable Solar power plant provider",
    initials: "SP",
    color: "bg-earth",
  },
  {
    name: "Dharshini",
    role: "Apartment Association Secretary",
    location: "Karur",
    rating: 5,
    text: "Best karur solar pump design got dc pump with panels working good",
    initials: "PV",
    color: "bg-accent",
  },
  {
    name: "Sanjay",
    role: "IT Professional",
    location: "Chennai",
    rating: 5,
    text: "Excellent solar irrigation system for our garden fields. Power is now infinite",
    initials: "KS",
    color: "bg-solar-dark",
  },
  {
    name: "Subikshan",
    role: "IT Professional",
    location: "Salem",
    rating: 5,
    text: "best solar contractor, they are one stop solution as they handled land preparation, used high efficiency panels, String Inverters and Optimizer, Balance of System (BOS), Monitoring, Civil works, mounting structures",
    initials: "AK",
    color: "bg-ocean",
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const el = sectionRef.current;
      if (!el) return;
 
      const ctx = gsap.context(() => {
        gsap.from(".test-header", {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: ".test-header", start: "top 80%" },
        });

        gsap.utils.toArray<HTMLElement>(".test-card").forEach((card, i) => {
          gsap.from(card, {
            y: 50,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
            delay: (i % 3) * 0.12,
            scrollTrigger: { trigger: card, start: "top 88%" },
          });
        });
      }, el);

      return () => ctx.revert();
    })();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-background overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="test-header text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-solar/10 text-solar rounded-full text-sm font-semibold mb-4">
            <Star className="w-4 h-4 fill-solar" />
            Customer Stories
          </div>
          <h2 className="text-display-lg text-foreground">
            Trusted in{" "}
            <span className="text-gradient-solar">Karur & Tamil Nadu</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            Real homes, real businesses, real savings. See what our customers
            say about going solar with Frontline.
          </p>

          <div
            className="mt-6 inline-flex items-center gap-3 px-5 py-3 rounded-full bg-solar/10 border border-solar/20"
            aria-label="Frontline Solar customer rating: 4.9 out of 5 from 1200 reviews"
          >
            <div className="flex items-center gap-0.5" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-solar text-solar" />
              ))}
            </div>
            <span className="text-sm font-bold text-foreground">4.9/5</span>
            <span className="text-sm text-muted-foreground">
              from 1,200+ customers
            </span>
          </div>
        </div>

        {/* Testimonial grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="test-card group bg-card border border-border rounded-2xl p-6 hover:shadow-xl hover:border-solar/20 transition-all duration-500 relative overflow-hidden"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-solar/10 group-hover:text-solar/20 transition-colors" />

              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-solar text-solar" />
                ))}
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-6 relative z-10">
                "{t.text}"
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div
                  className={`w-11 h-11 rounded-full ${t.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    {t.role} · <MapPin className="w-3 h-3" /> {t.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
