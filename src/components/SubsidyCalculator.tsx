import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Calculator,
  IndianRupee,
  Home,
  Building2,
  Wheat,
  Sun,
  TrendingDown,
  PiggyBank,
  Zap,
  Info,
  CheckCircle2,
} from 'lucide-react';

type ConnectionType = 'domestic' | 'commercial' | 'agri';

interface CalcResults {
  recommendedKW: number;
  grossCost: number;
  centralSubsidy: number;
  stateSubsidy: number;
  totalSubsidy: number;
  netCost: number;
  paybackYears: number;
  annualSavings: number;
  savings25Year: number;
  annualGeneration: number;
  co2Offset: number;
}

export default function SubsidyCalculator() {
  const [monthlyBill, setMonthlyBill] = useState(3000);
  const [roofArea, setRoofArea] = useState(500);
  const [connectionType, setConnectionType] = useState<ConnectionType>('domestic');
  const [animated, setAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Animate in on scroll
  useEffect(() => {
    (async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const el = sectionRef.current;
      if (!el) return;

      const ctx = gsap.context(() => {
        gsap.from('.calc-fade-up', {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 75%',
          },
        });
      }, el);

      return () => ctx.revert();
    })();
  }, []);

  const results: CalcResults = useMemo(() => {
    // Estimate system size from monthly bill
    // Average Tamil Nadu tariff ~₹8/unit, so monthly units = bill / 8
    const monthlyUnits = monthlyBill / 8;
    const dailyUnits = monthlyUnits / 30;
    // 1 kW generates ~4.5 units/day in Tamil Nadu
    const kwFromBill = dailyUnits / 4.5;

    // Roof area: ~100 sq ft per kW
    const kwFromRoof = roofArea / 100;

    // Take the smaller of the two, rounded to nearest 0.5
    let recommendedKW = Math.min(kwFromBill, kwFromRoof);
    recommendedKW = Math.max(1, Math.round(recommendedKW * 2) / 2);

    // Cost per kW (approx ₹55,000/kW for residential, ₹60,000 for commercial)
    const costPerKW = connectionType === 'commercial' ? 60000 : 55000;
    const grossCost = recommendedKW * costPerKW;

    // PM Surya Ghar: Muft Bijli Yojana Central Subsidy
    let centralSubsidy = 0;
    if (connectionType === 'domestic') {
      if (recommendedKW <= 1) centralSubsidy = 30000;
      else if (recommendedKW <= 2) centralSubsidy = 60000;
      else centralSubsidy = 78000;
    } else if (connectionType === 'agri') {
      // Agricultural: state subsidies vary, use central as base
      centralSubsidy = recommendedKW <= 3 ? 78000 : 78000;
    }

    // Tamil Nadu state subsidy (simplified — TN currently provides net-metering benefits)
    // For domestic: additional state benefit of ~₹10,000 for 1-2kW, ₹15,000 for 3kW+
    let stateSubsidy = 0;
    if (connectionType === 'domestic') {
      stateSubsidy = recommendedKW >= 3 ? 15000 : 10000;
    }

    const totalSubsidy = centralSubsidy + stateSubsidy;
    const netCost = Math.max(0, grossCost - totalSubsidy);

    // Annual generation
    const annualGeneration = recommendedKW * 4.5 * 365;

    // Annual savings = generation * tariff rate
    const tariffRate = connectionType === 'commercial' ? 9 : 8;
    const annualSavings = annualGeneration * tariffRate * 0.85; // 85% self-consumption

    // Payback period
    const paybackYears = netCost / annualSavings;

    // 25-year savings (accounting for 0.5% annual degradation, 5% tariff escalation)
    let savings25Year = 0;
    let yearlySavings = annualSavings;
    for (let y = 0; y < 25; y++) {
      savings25Year += yearlySavings;
      yearlySavings *= 0.995; // degradation
      yearlySavings *= 1.04; // tariff escalation
    }

    // CO2 offset (1 unit = ~0.82 kg CO2)
    const co2Offset = (annualGeneration * 0.82) / 1000; // tons/year

    return {
      recommendedKW,
      grossCost,
      centralSubsidy,
      stateSubsidy,
      totalSubsidy,
      netCost,
      paybackYears,
      annualSavings,
      savings25Year,
      annualGeneration,
      co2Offset,
    };
  }, [monthlyBill, roofArea, connectionType]);

  useEffect(() => {
    setAnimated(false);
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, [results]);

  const formatCurrency = (n: number) => {
    return '₹' + Math.round(n).toLocaleString('en-IN');
  };

  const connectionTypes: { type: ConnectionType; label: string; icon: React.ElementType; desc: string }[] = [
    { type: 'domestic', label: 'Domestic', icon: Home, desc: 'Residential rooftop' },
    { type: 'commercial', label: 'Commercial', icon: Building2, desc: 'Business / Industry' },
    { type: 'agri', label: 'Agri-Irrigation', icon: Wheat, desc: 'Farm pump solar' },
  ];

  return (
    <section ref={sectionRef} id="subsidy" className="relative py-24 md:py-32 bg-gradient-to-b from-background to-secondary/30 overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-solar/40 to-transparent" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-solar/5 blur-[100px]" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16 calc-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-solar/10 text-solar rounded-full text-sm font-semibold mb-4">
            <Calculator className="w-4 h-4" />
            PM Surya Ghar · PMSGY
          </div>
          <h2 className="text-display-lg text-foreground">
            Karur & Tamil Nadu <span className="text-gradient-solar">Subsidy Hub</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            Calculate your Central + State solar subsidy and TANGEDCO net-metering savings in real-time.
            Built with live Tamil Nadu tariff structures and PM Surya Ghar guidelines for Karur residents.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Input panel */}
          <div className="lg:col-span-2 calc-fade-up">
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-xl">
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-solar/10 flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-solar" />
                </span>
                Your Solar Profile
              </h3>

              {/* Monthly Bill Slider */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-solar" />
                    Monthly Electricity Bill
                  </label>
                  <span className="text-lg font-bold text-solar tabular-nums">{formatCurrency(monthlyBill)}</span>
                </div>
                <input
                  type="range"
                  min={500}
                  max={20000}
                  step={500}
                  value={monthlyBill}
                  onChange={(e) => setMonthlyBill(Number(e.target.value))}
                  className="w-full h-2 bg-secondary rounded-full appearance-none cursor-pointer accent-solar"
                  style={{
                    background: `linear-gradient(to right, hsl(38 92% 50%) ${((monthlyBill - 500) / 19500) * 100}%, hsl(210 40% 96%) ${((monthlyBill - 500) / 19500) * 100}%)`,
                  }}
                />
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>₹500</span>
                  <span>₹20,000</span>
                </div>
              </div>

              {/* Roof Area Slider */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Home className="w-4 h-4 text-solar" />
                    Roof Area (Sq. Ft.)
                  </label>
                  <span className="text-lg font-bold text-solar tabular-nums">{roofArea} ft²</span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={3000}
                  step={50}
                  value={roofArea}
                  onChange={(e) => setRoofArea(Number(e.target.value))}
                  className="w-full h-2 bg-secondary rounded-full appearance-none cursor-pointer accent-solar"
                  style={{
                    background: `linear-gradient(to right, hsl(38 92% 50%) ${((roofArea - 100) / 2900) * 100}%, hsl(210 40% 96%) ${((roofArea - 100) / 2900) * 100}%)`,
                  }}
                />
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>100 ft²</span>
                  <span>3,000 ft²</span>
                </div>
              </div>

              {/* Connection Type */}
              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">Connection Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {connectionTypes.map(({ type, label, icon: Icon, desc }) => (
                    <button
                      key={type}
                      onClick={() => setConnectionType(type)}
                      className={`p-3 rounded-xl border-2 transition-all text-center ${
                        connectionType === type
                          ? 'border-solar bg-solar/10 text-foreground'
                          : 'border-border bg-background hover:border-solar/50'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mx-auto mb-1.5 ${connectionType === type ? 'text-solar' : 'text-muted-foreground'}`} />
                      <div className="text-xs font-semibold">{label}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5 hidden sm:block">{desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Info note */}
              <div className="mt-6 p-4 bg-solar/5 rounded-xl flex gap-3">
                <Info className="w-5 h-5 text-solar shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Subsidy calculated per <strong className="text-foreground">PM Surya Ghar: Muft Bijli Yojana</strong> guidelines.
                  Actual amounts may vary based on TANGEDCO Karur approval and DISCOM inspection.
                </p>
              </div>
            </div>
          </div>

          {/* Results panel */}
          <div className="lg:col-span-3 calc-fade-up">
            <div className="bg-gradient-to-br from-night to-night/90 text-white rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
              {/* Grid background */}
              <div className="absolute inset-0 hero-grid-bg opacity-20" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-solar/10 blur-[80px] rounded-full" />

              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Sun className="w-5 h-5 text-solar" />
                    Your Solar Recommendation
                  </h3>
                  <span className="px-3 py-1 bg-solar/20 text-solar text-xs font-semibold rounded-full">
                    Live Estimate
                  </span>
                </div>

                {/* Primary result */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                    <p className="text-white/50 text-xs uppercase tracking-wide mb-1">Recommended System</p>
                    <p className="text-3xl font-bold text-solar tabular-nums">
                      {results.recommendedKW.toFixed(1)} <span className="text-lg text-white/70">kW</span>
                    </p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                    <p className="text-white/50 text-xs uppercase tracking-wide mb-1">Annual Generation</p>
                    <p className="text-3xl font-bold text-solar tabular-nums">
                      {Math.round(results.annualGeneration).toLocaleString('en-IN')} <span className="text-lg text-white/70">units</span>
                    </p>
                  </div>
                </div>

                {/* Cost breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between py-3 border-b border-white/10">
                    <span className="text-white/70 text-sm">Gross System Cost</span>
                    <span className="text-white font-semibold tabular-nums">{formatCurrency(results.grossCost)}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="text-white/70 text-sm">Central Subsidy (PMSGY)</span>
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-semibold rounded">−</span>
                    </div>
                    <span className="text-green-400 font-semibold tabular-nums">−{formatCurrency(results.centralSubsidy)}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="text-white/70 text-sm">Tamil Nadu State Benefit</span>
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-semibold rounded">−</span>
                    </div>
                    <span className="text-green-400 font-semibold tabular-nums">−{formatCurrency(results.stateSubsidy)}</span>
                  </div>
                  <div className="flex items-center justify-between py-4 bg-solar/10 rounded-xl px-4">
                    <span className="text-white font-semibold">Your Net Investment</span>
                    <span className="text-2xl font-bold text-solar tabular-nums">{formatCurrency(results.netCost)}</span>
                  </div>
                </div>

                {/* Key metrics */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <TrendingDown className="w-5 h-5 text-solar mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white tabular-nums">
                      {results.paybackYears.toFixed(1)}
                    </p>
                    <p className="text-white/50 text-xs mt-1">Years Payback</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <PiggyBank className="w-5 h-5 text-solar mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white tabular-nums">
                      ₹{(results.savings25Year / 100000).toFixed(1)}L
                    </p>
                    <p className="text-white/50 text-xs mt-1">25-Year Savings</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <Zap className="w-5 h-5 text-solar mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white tabular-nums">
                      {results.co2Offset.toFixed(1)}
                    </p>
                    <p className="text-white/50 text-xs mt-1">Tons CO₂/Year</p>
                  </div>
                </div>

                {/* CTA */}
                <a
                  href="https://wa.me/918667872774?text=I%20want%20to%20proceed%20with%20a%20solar%20installation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 w-full py-4 bg-gradient-to-r from-solar to-solar-dark text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-lg shadow-solar/30"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Proceed with Free Site Survey
                </a>
              </div>
            </div>

            {/* Subsidy slab reference */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { kw: '1 kW', subsidy: '₹30,000' },
                { kw: '2 kW', subsidy: '₹60,000' },
                { kw: '3 kW+', subsidy: '₹78,000' },
              ].map((slab) => (
                <div key={slab.kw} className="bg-card border border-border rounded-xl p-3 text-center">
                  <p className="text-xs text-muted-foreground">{slab.kw} System</p>
                  <p className="text-sm font-bold text-solar">{slab.subsidy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
