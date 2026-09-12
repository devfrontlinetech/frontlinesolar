import React, { useRef, useEffect } from "react";
import {
  Sun,
  Layers,
  Battery,
  Cpu,
  Gauge,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const products = [
  {
    id: "topcon",
    name: "N-Type TOPCon Bifacial",
    category: "Solar Panels",
    efficiency: "22.8%",
    power: "580W — 720W",
    warranty: "25 Years",
    icon: Sun,
    tag: "Flagship",
    tagColor: "bg-solar text-white",
    features: [
      "N-Type monocrystalline cells with TOPCon technology",
      "Bifacial gain up to 15% — energy from both sides",
      "Lower temperature coefficient (−0.26%/°C)",
      "Anti-Reflective coated tempered glass",
      "ALMM & DCR compliant — Made in India",
      "IP68 junction box with MC4 connectors",
    ],
    badge: "Highest Efficiency",
  },
  {
    id: "mono",
    name: "Monocrystalline Bifacial",
    category: "Solar Panels",
    efficiency: "21.2%",
    power: "540W — 650W",
    warranty: "25 Years",
    icon: Layers,
    tag: "Popular",
    tagColor: "bg-earth text-white",
    features: [
      "Half-cut PERC monocrystalline cells",
      "Bifacial dual-glass design for rooftop & ground-mount",
      "Excellent low-light performance",
      "Salt mist & ammonia corrosion resistant",
      "Tier-1 bankable quality certification",
      "DCR compliant for domestic content",
    ],
    badge: "Best Value",
  },
  {
    id: "inverter",
    name: "Smart String Inverters",
    category: "Inverters & Storage",
    efficiency: "98.6%",
    power: "3kW — 50kW",
    warranty: "10 Years",
    icon: Cpu,
    tag: "Smart",
    tagColor: "bg-ocean text-white",
    features: [
      "Wi-Fi & IoT enabled remote monitoring",
      "MPPT tracking efficiency >99.5%",
      "TANGEDCO net-metering compatible",
      "Zero export limit configurable",
      "Over-voltage & surge protection",
      "Optional battery backup integration",
    ],
    badge: "IoT Connected",
  },
  {
    id: "battery",
    name: "Lithium Battery Storage",
    category: "Inverters & Storage",
    efficiency: "95%",
    power: "5kWh — 20kWh",
    warranty: "10 Years",
    icon: Battery,
    tag: "New",
    tagColor: "bg-accent text-night",
    features: [
      "LiFePO4 chemistry — 6000+ cycle life",
      "Modular stackable design",
      "Built-in BMS with cell-level monitoring",
      "Seamless integration with string inverters",
      "Load shifting for peak tariff savings",
      "IP65 rated for outdoor installation",
    ],
    badge: "Power Independence",
  },
];

export default function ProductShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const el = sectionRef.current;
      if (!el) return;

      const ctx = gsap.context(() => {
        // Animate section header
        gsap.from(".product-header", {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".product-header",
            start: "top 80%",
          },
        });

        // Animate each product card
        gsap.utils.toArray<HTMLElement>(".product-card").forEach((card, i) => {
          gsap.from(card, {
            y: 60,
            opacity: 0,
            duration: 0.7,
            ease: "power2.out",
            delay: (i % 2) * 0.15,
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
            },
          });
        });
      }, el);

      return () => ctx.revert();
    })();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="products"
      className="relative py-24 md:py-32 bg-background overflow-hidden"
    >
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-solar/5 blur-[100px] rounded-full" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="product-header text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-earth/10 text-earth-dark rounded-full text-sm font-semibold mb-4">
            <Sun className="w-4 h-4" />
            Make in India · DCR Compliant
          </div>
          <h2 className="text-display-lg text-foreground">
            Engineered{" "}
            <span className="text-gradient-solar">Product Range</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            Tier-1 ALMM listed solar modules and smart energy storage —
            available in Karur and across Tamil Nadu. Every component
            manufactured in India to the highest global standards.
          </p>
        </div>

        {/* Product grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {products.map((product) => {
            const Icon = product.icon;
            return (
              <div
                key={product.id}
                className="product-card group relative bg-card border border-border rounded-2xl p-6 md:p-8 hover:shadow-2xl hover:border-solar/30 transition-all duration-500 overflow-hidden"
              >
                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-solar/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative">
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-solar/10 to-solar/5 flex items-center justify-center group-hover:from-solar/20 transition-all">
                        <Icon className="w-7 h-7 text-solar" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                          {product.category}
                        </p>
                        <h3 className="text-xl font-bold text-foreground">
                          {product.name}
                        </h3>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${product.tagColor}`}
                    >
                      {product.tag}
                    </span>
                  </div>

                  {/* Spec grid */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-secondary/50 rounded-xl p-3 text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Gauge className="w-4 h-4 text-solar" />
                      </div>
                      <p className="text-lg font-bold text-foreground tabular-nums">
                        {product.efficiency}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Efficiency
                      </p>
                    </div>
                    <div className="bg-secondary/50 rounded-xl p-3 text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Sun className="w-4 h-4 text-solar" />
                      </div>
                      <p className="text-sm font-bold text-foreground">
                        {product.power}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Power Range
                      </p>
                    </div>
                    <div className="bg-secondary/50 rounded-xl p-3 text-center">
                      <div className="flex items-center justify-center mb-1">
                        <CheckCircle2 className="w-4 h-4 text-solar" />
                      </div>
                      <p className="text-lg font-bold text-foreground">
                        {product.warranty}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Warranty
                      </p>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2.5 mb-6">
                    {product.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-sm text-muted-foreground"
                      >
                        <CheckCircle2 className="w-4 h-4 text-solar shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-sm font-semibold text-solar">
                      {product.badge}
                    </span>
                    <button className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-solar transition-colors group/btn">
                      Request Quote
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
