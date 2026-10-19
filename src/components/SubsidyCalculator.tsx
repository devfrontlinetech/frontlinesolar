import React, { useMemo, useState } from "react";
import HomeAppliances from "./HomeAppliances";

import {
  IndianRupee,
  Home,
  Building2,
  Wheat,
  Sun,
  TrendingDown,
  PiggyBank,
  Zap,
  Info,
  Leaf,
  ClipboardCheck,
} from "lucide-react";

type ConnectionType = "domestic" | "commercial" | "agri";

interface SubsidyResult {
  recommendedKW: number;
  annualGeneration: number;
  grossCost: number;
  centralSubsidy: number;
  stateBenefit: number;
  netInvestment: number;
  payback: number;
  savings25: number;
  co2: number;
}

const SYSTEM_PRICES: Record<number, number> = {
  1: 30000,
  1.5: 45000,
  2: 60000,
  2.5: 72000,
  3: 165000,
  3.5: 192500,
  4: 220000,
  4.5: 247500,
  5: 275000,
  5.5: 302500,
  6: 330000,
  6.5: 357500,
  7: 385000,
  7.5: 412500,
  8: 440000,
  8.5: 467500,
  9: 495000,
  9.5: 522500,
  10: 550000,
};

const getSystemPrice = (systemKW: number) => {
  if (SYSTEM_PRICES[systemKW] !== undefined) {
    return SYSTEM_PRICES[systemKW];
  }

  return systemKW * 55000;
};

const getCentralSubsidy = (
  systemKW: number,
  connectionType: ConnectionType,
) => {
  if (connectionType !== "domestic" || systemKW <= 0) {
    return 0;
  }

  if (systemKW <= 2) {
    return systemKW * 30000;
  }

  return Math.min(78000, 60000 + (systemKW - 2) * 18000);
};

const getStateBenefit = (systemKW: number, connectionType: ConnectionType) => {
  if (connectionType !== "domestic" || systemKW <= 0) {
    return 0;
  }

  if (systemKW <= 2) {
    return systemKW * 5000;
  }

  return Math.min(22000, 10000 + (systemKW - 2) * 12000);
};

const SubsidyCalculator: React.FC = () => {
  const [monthlyBill, setMonthlyBill] = useState(3000);
  const [roofArea, setRoofArea] = useState(500);

  const [connectionType, setConnectionType] =
    useState<ConnectionType>("domestic");

  const [applianceLoad, setApplianceLoad] = useState(0);
  const [applianceDailyUnits, setApplianceDailyUnits] = useState(0);

  const results = useMemo<SubsidyResult>(() => {
    const tariffPerUnit = 8;
    const generationPerKWPerDay = 4.5;
    const roofAreaPerKW = 100;

    const monthlyUnits = monthlyBill / tariffPerUnit;
    const billDailyUnits = monthlyUnits / 30;
    const billBasedKW = billDailyUnits / generationPerKWPerDay;

    const applianceBasedKW = applianceDailyUnits / generationPerKWPerDay;

    const demandBasedKW = Math.max(billBasedKW, applianceBasedKW);

    const roofBasedKW = roofArea / roofAreaPerKW;

    let requiredKW = Math.min(demandBasedKW, roofBasedKW);
    requiredKW = Math.max(1, requiredKW);

    let recommendedKW = Math.ceil(requiredKW * 2) / 2;
    recommendedKW = Math.min(10, recommendedKW);

    const annualGeneration = Math.round(
      recommendedKW * generationPerKWPerDay * 365,
    );

    const grossCost = getSystemPrice(recommendedKW);

    // Residential subsidy only.
    // Commercial and Agriculture receive no residential subsidy.
    const centralSubsidy = getCentralSubsidy(recommendedKW, connectionType);

    const stateBenefit = getStateBenefit(recommendedKW, connectionType);

    const netInvestment = Math.max(
      0,
      grossCost - centralSubsidy - stateBenefit,
    );

    const annualBillSavings = monthlyBill * 12;

    const payback =
      annualBillSavings > 0 ? netInvestment / annualBillSavings : 0;

    const savings25 = Math.max(0, annualBillSavings * 25 - netInvestment);

    const co2 = Math.round(annualGeneration * 0.82);

    return {
      recommendedKW,
      annualGeneration,
      grossCost,
      centralSubsidy,
      stateBenefit,
      netInvestment,
      payback,
      savings25,
      co2,
    };
  }, [monthlyBill, roofArea, connectionType, applianceDailyUnits]);

  const appliancePercentage =
    results.recommendedKW > 0
      ? Math.min(100, (applianceLoad / results.recommendedKW) * 100)
      : 0;

  const formatCurrency = (value: number) =>
    Math.round(value).toLocaleString("en-IN");

  const isDomestic = connectionType === "domestic";

  return (
    <section
      id="subsidy"
      className="relative overflow-hidden bg-secondary/20 py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HEADER */}

        <div className="mx-auto mb-10 max-w-3xl text-center">
          <span className="mb-3 inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-bold uppercase tracking-wide text-amber-600">
            <Sun size={14} className="mr-1.5" strokeWidth={2.5} />
            PM Surya Ghar
          </span>

          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Karur &amp; Tamil Nadu{" "}
            <span className="text-amber-500">Subsidy Hub</span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
            Calculate your solar benefits and TANGEDCO net-metering savings
            based on electricity usage, roof area and appliances.
          </p>
        </div>

        {/* MAIN */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* LEFT */}

          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-border bg-card p-5 shadow-sm md:p-6">
              {/* PROFILE HEADER */}

              <div className="mb-6 flex items-start justify-between gap-3">
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
                    <Sun
                      size={19}
                      className="text-amber-500"
                      strokeWidth={2.2}
                    />
                    Your Solar Profile
                  </h3>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Tell us about your electricity usage.
                  </p>
                </div>

                <span className="rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-bold text-green-600">
                  LIVE
                </span>
              </div>

              {/* MONTHLY BILL */}

              <div className="mb-6">
                <div className="mb-2 flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                    <IndianRupee
                      size={16}
                      className="text-amber-500"
                      strokeWidth={2.2}
                    />
                    Monthly Electricity Bill
                  </label>

                  <span className="text-sm font-bold text-amber-500">
                    ₹{formatCurrency(monthlyBill)}
                  </span>
                </div>
  
                <input
                  type="range"
                  min="500"
                  max="20000"
                  step="500"
                  value={monthlyBill}
                  onChange={(event) =>
                    setMonthlyBill(Number(event.target.value))
                  }
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-amber-500"
                />

                <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                  <span>₹500</span>
                  <span>₹20,000</span>
                </div>
              </div>

              {/* ROOF AREA */}

              <div className="mb-6">
                <div className="mb-2 flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                    <Home
                      size={16}
                      className="text-amber-500"
                      strokeWidth={2.2}
                    />
                    Roof Area (Sq. Ft.)
                  </label>

                  <span className="text-sm font-bold text-amber-500">
                    {roofArea.toLocaleString("en-IN")} ft²
                  </span>
                </div>

                <input
                  type="range"
                  min="100"
                  max="3000"
                  step="50"
                  value={roofArea}
                  onChange={(event) => setRoofArea(Number(event.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-amber-500"
                />

                <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                  <span>100 ft²</span>
                  <span>3,000 ft²</span>
                </div>
              </div>

              {/* CONNECTION TYPE */}

              {/* <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-foreground">
                  Connection Type
                </label>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setConnectionType("domestic")}
                    className={`rounded-xl border p-3 text-center transition ${
                      connectionType === "domestic"
                        ? "border-amber-500 bg-amber-50 text-amber-600"
                        : "border-border bg-background text-muted-foreground hover:border-amber-300"
                    }`}
                  >
                    <Home size={22} className="mx-auto mb-1" strokeWidth={2} />

                    <span className="block text-xs font-bold">Domestic</span>

                    <span className="mt-0.5 block text-[9px]">Residential</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConnectionType("commercial")}
                    className={`rounded-xl border p-3 text-center transition ${
                      connectionType === "commercial"
                        ? "border-amber-500 bg-amber-50 text-amber-600"
                        : "border-border bg-background text-muted-foreground hover:border-amber-300"
                    }`}
                  >
                    <Building2
                      size={22}
                      className="mx-auto mb-1"
                      strokeWidth={2}
                    />

                    <span className="block text-xs font-bold">Commercial</span>

                    <span className="mt-0.5 block text-[9px]">Business</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConnectionType("agri")}
                    className={`rounded-xl border p-3 text-center transition ${
                      connectionType === "agri"
                        ? "border-amber-500 bg-amber-50 text-amber-600"
                        : "border-border bg-background text-muted-foreground hover:border-amber-300"
                    }`}
                  >
                    <Wheat size={22} className="mx-auto mb-1" strokeWidth={2} />

                    <span className="block text-xs font-bold">Agriculture</span>

                    <span className="mt-0.5 block text-[9px]">Farm</span>
                  </button>
                </div>
              </div> */}

              {/* HOME APPLIANCES */}

              <div className="border-t border-border pt-5">
                <HomeAppliances
                  onLoadChange={(loadKW, dailyUnits) => {
                    setApplianceLoad(loadKW);
                    setApplianceDailyUnits(dailyUnits);
                  }}
                />
              </div>

              {/* INFORMATION */}

              <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3">
                <div className="flex gap-2">
                  <span className="shrink-0 text-amber-500">
                    <Info size={16} strokeWidth={2.2} />
                  </span>

                  <p className="text-[10px] leading-5 text-amber-800">
                    {isDomestic
                      ? "Residential subsidy estimates are based on the selected system capacity. Final eligibility depends on the applicable scheme and DISCOM approval."
                      : connectionType === "commercial"
                        ? "Commercial rooftop solar is calculated without residential subsidy. Installation price and applicable export tariffs must be confirmed with the DISCOM and installer."
                        : "Agricultural rooftop solar is calculated without residential rooftop subsidy. Solar pump assistance under PM-KUSUM is a separate scheme and is not included in this rooftop estimate."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}

          <div className="lg:col-span-3">
            <div className="overflow-hidden rounded-3xl bg-slate-950 p-5 text-white shadow-xl md:p-6">
              {/* RECOMMENDATION HEADER */}

              <div className="mb-6 flex items-start justify-between gap-3">
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-bold">
                    <Sun
                      size={19}
                      className="text-amber-400"
                      strokeWidth={2.2}
                    />
                    Your Solar Recommendation
                  </h3>

                  <p className="mt-1 text-xs text-white/50">
                    Calculated from your bill, roof area and appliance load.
                  </p>
                </div>

                <span className="rounded-full bg-amber-500 px-3 py-1 text-[10px] font-bold text-white">
                  LIVE ESTIMATE
                </span>
              </div>

              {/* PRIMARY RESULTS */}

              <div className="mb-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <span className="text-[10px] uppercase tracking-wide text-white/40">
                    Recommended System
                  </span>

                  <div className="mt-1">
                    <span className="text-3xl font-bold text-amber-400">
                      {results.recommendedKW.toFixed(1)}
                    </span>

                    <span className="ml-1 text-sm text-white/40">kW</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <span className="text-[10px] uppercase tracking-wide text-white/40">
                    Annual Generation
                  </span>

                  <div className="mt-1">
                    <span className="text-3xl font-bold text-amber-400">
                      {results.annualGeneration.toLocaleString("en-IN")}
                    </span>

                    <span className="ml-1 text-sm text-white/40">units</span>
                  </div>
                </div>
              </div>

              {/* APPLIANCE LOAD */}

              <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-white/50">
                    <Zap
                      size={14}
                      className="text-amber-400"
                      strokeWidth={2.3}
                    />
                    Active Appliance Load
                  </span>

                  <span className="text-xs font-bold text-amber-400">
                    {applianceLoad.toFixed(2)} kW /{" "}
                    {results.recommendedKW.toFixed(1)} kW
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      applianceLoad > results.recommendedKW
                        ? "bg-red-500"
                        : "bg-amber-500"
                    }`}
                    style={{ width: `${appliancePercentage}%` }}
                  />
                </div>

                <div className="mt-2 flex justify-between">
                  <span className="text-[10px] text-white/30">
                    Connected appliance load
                  </span>

                  <span
                    className={`text-[10px] font-semibold ${
                      applianceLoad > results.recommendedKW
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    {applianceLoad > results.recommendedKW
                      ? "Load exceeds system size"
                      : "Load within system size"}
                  </span>
                </div>

                <div className="mt-2 flex justify-between">
                  <span className="text-[10px] text-white/30">
                    Estimated appliance usage
                  </span>

                  <span className="text-[10px] text-white/70">
                    {applianceDailyUnits.toFixed(1)} kWh/day
                  </span>
                </div>
              </div>

              {/* COST BREAKDOWN */}

              <div className="mb-5">
                <div className="flex items-center justify-between border-b border-white/10 py-3">
                  <span className="text-xs text-white/50">
                    Gross System Cost
                  </span>

                  <span className="text-sm font-semibold">
                    ₹{formatCurrency(results.grossCost)}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 py-3">
                  <span className="text-xs text-white/50">Central Subsidy</span>

                  <span className="text-sm font-semibold text-green-400">
                    −₹{formatCurrency(results.centralSubsidy)}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 py-3">
                  <span className="text-xs text-white/50">
                    Tamil Nadu State Benefit
                  </span>

                  <span className="text-sm font-semibold text-green-400">
                    −₹{formatCurrency(results.stateBenefit)}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between rounded-2xl bg-white/[0.07] p-4">
                  <span className="text-sm font-bold">Your Net Investment</span>

                  <span className="text-xl font-bold text-amber-400">
                    ₹{formatCurrency(results.netInvestment)}
                  </span>
                </div>
              </div>

              {/* STATS */}

              <div className="mb-5 grid grid-cols-3 gap-2">
                <div className="rounded-2xl bg-white/[0.05] p-3 text-center">
                  <span className="mb-1 flex justify-center text-amber-400">
                    <TrendingDown size={20} strokeWidth={2.2} />
                  </span>

                  <strong className="block text-lg">
                    {results.payback.toFixed(1)}
                  </strong>

                  <span className="text-[9px] text-white/40">
                    Years Payback
                  </span>
                </div>

                <div className="rounded-2xl bg-white/[0.05] p-3 text-center">
                  <span className="mb-1 flex justify-center text-amber-400">
                    <PiggyBank size={20} strokeWidth={2.2} />
                  </span>

                  <strong className="block text-lg">
                    ₹{(results.savings25 / 100000).toFixed(1)}L
                  </strong>

                  <span className="text-[9px] text-white/40">
                    25-Year Savings
                  </span>
                </div>

                <div className="rounded-2xl bg-white/[0.05] p-3 text-center">
                  <span className="mb-1 flex justify-center text-amber-400">
                    <Leaf size={20} strokeWidth={2.2} />
                  </span>

                  <strong className="block text-lg">
                    {(results.co2 / 1000).toFixed(1)}t
                  </strong>

                  <span className="text-[9px] text-white/40">CO₂ Offset</span>
                </div>
              </div>

              {/* CTA */}

              <button
                type="button"
                onClick={() =>
                  document.getElementById("contact")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
                className="w-full rounded-2xl bg-amber-500 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-amber-600 hover:shadow-lg hover:shadow-amber-500/20"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <ClipboardCheck size={17} strokeWidth={2.2} />
                  Proceed with Free Site Survey
                </span>
              </button>

              <p className="mt-3 text-center text-[9px] text-white/30">
                Final system size, subsidy and pricing will be confirmed after
                site inspection.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubsidyCalculator;

// Old Subsidy Calculator code (commented out for reference)

// import React, { useState, useMemo, useEffect, useRef } from "react";
// import {
//   Calculator,
//   IndianRupee,
//   Home,
//   Building2,
//   Wheat,
//   Sun,
//   TrendingDown,
//   PiggyBank,
//   Zap,
//   Info,
//   CheckCircle2,
// } from "lucide-react";

// type ConnectionType = "domestic" | "commercial" | "agri";

// interface CalcResults {
//   recommendedKW: number;
//   grossCost: number;
//   centralSubsidy: number;
//   stateSubsidy: number;
//   totalSubsidy: number;
//   netCost: number;
//   paybackYears: number;
//   annualSavings: number;
//   savings25Year: number;
//   annualGeneration: number;
//   co2Offset: number;
// }

// export default function SubsidyCalculator() {
//   const [monthlyBill, setMonthlyBill] = useState(3000);
//   const [roofArea, setRoofArea] = useState(500);
//   const [connectionType, setConnectionType] =
//     useState<ConnectionType>("domestic");
//   const [animated, setAnimated] = useState(false);
//   const sectionRef = useRef<HTMLDivElement>(null);

//   // Animate in on scroll
//   useEffect(() => {
//     (async () => {
//       const { gsap } = await import("gsap");
//       const { ScrollTrigger } = await import("gsap/ScrollTrigger");
//       gsap.registerPlugin(ScrollTrigger);

//       const el = sectionRef.current;
//       if (!el) return;

//       const ctx = gsap.context(() => {
//         gsap.from(".calc-fade-up", {
//           y: 40,
//           opacity: 0,
//           duration: 0.8,
//           stagger: 0.1,
//           ease: "power2.out",
//           scrollTrigger: {
//             trigger: el,
//             start: "top 75%",
//           },
//         });
//       }, el);

//       return () => ctx.revert();
//     })();
//   }, []);

//   const results: CalcResults = useMemo(() => {
//     // Estimate system size from monthly bill
//     // Average Tamil Nadu tariff ~₹8/unit, so monthly units = bill / 8
//     const monthlyUnits = monthlyBill / 8;
//     const dailyUnits = monthlyUnits / 30;
//     // 1 kW generates ~4.5 units/day in Tamil Nadu
//     const kwFromBill = dailyUnits / 4.5;

//     // Roof area: ~100 sq ft per kW
//     const kwFromRoof = roofArea / 100;

//     // Take the smaller of the two, rounded to nearest 0.5
//     let recommendedKW = Math.min(kwFromBill, kwFromRoof);
//     recommendedKW = Math.max(1, Math.round(recommendedKW * 2) / 2);

//     // Cost per kW (approx ₹55,000/kW for residential, ₹60,000 for commercial)
//     const costPerKW = connectionType === "commercial" ? 60000 : 55000;
//     const grossCost = recommendedKW * costPerKW;

//     // PM Surya Ghar: Muft Bijli Yojana Central Subsidy
//     let centralSubsidy = 0;
//     if (connectionType === "domestic") {
//       if (recommendedKW <= 1) centralSubsidy = 30000;
//       else if (recommendedKW <= 2) centralSubsidy = 60000;
//       else centralSubsidy = 78000;
//     } else if (connectionType === "agri") {
//       // Agricultural: state subsidies vary, use central as base
//       centralSubsidy = recommendedKW <= 3 ? 78000 : 78000;
//     }

//     // Tamil Nadu state subsidy (simplified — TN currently provides net-metering benefits)
//     // For domestic: additional state benefit of ~₹10,000 for 1-2kW, ₹15,000 for 3kW+
//     let stateSubsidy = 0;
//     if (connectionType === "domestic") {
//       stateSubsidy = recommendedKW >= 3 ? 15000 : 10000;
//     }

//     const totalSubsidy = centralSubsidy + stateSubsidy;
//     const netCost = Math.max(0, grossCost - totalSubsidy);

//     // Annual generation
//     const annualGeneration = recommendedKW * 4.5 * 365;

//     // Annual savings = generation * tariff rate
//     const tariffRate = connectionType === "commercial" ? 9 : 8;
//     const annualSavings = annualGeneration * tariffRate * 0.85; // 85% self-consumption

//     // Payback period
//     const paybackYears = netCost / annualSavings;

//     // 25-year savings (accounting for 0.5% annual degradation, 5% tariff escalation)
//     let savings25Year = 0;
//     let yearlySavings = annualSavings;
//     for (let y = 0; y < 25; y++) {
//       savings25Year += yearlySavings;
//       yearlySavings *= 0.995; // degradation
//       yearlySavings *= 1.04; // tariff escalation
//     }

//     // CO2 offset (1 unit = ~0.82 kg CO2)
//     const co2Offset = (annualGeneration * 0.82) / 1000; // tons/year

//     return {
//       recommendedKW,
//       grossCost,
//       centralSubsidy,
//       stateSubsidy,
//       totalSubsidy,
//       netCost,
//       paybackYears,
//       annualSavings,
//       savings25Year,
//       annualGeneration,
//       co2Offset,
//     };
//   }, [monthlyBill, roofArea, connectionType]);

//   useEffect(() => {
//     setAnimated(false);
//     const t = setTimeout(() => setAnimated(true), 100);
//     return () => clearTimeout(t);
//   }, [results]);

//   const formatCurrency = (n: number) => {
//     return "₹" + Math.round(n).toLocaleString("en-IN");
//   };

//   const connectionTypes: {
//     type: ConnectionType;
//     label: string;
//     icon: React.ElementType;
//     desc: string;
//   }[] = [
//     {
//       type: "domestic",
//       label: "Domestic",
//       icon: Home,
//       desc: "Residential rooftop",
//     },
//     {
//       type: "commercial",
//       label: "Commercial",
//       icon: Building2,
//       desc: "Business / Industry",
//     },
//     {
//       type: "agri",
//       label: "Agri-Irrigation",
//       icon: Wheat,
//       desc: "Farm pump solar",
//     },
//   ];

//   return (
//     <section
//       ref={sectionRef}
//       id="subsidy"
//       className="relative py-24 md:py-32 bg-gradient-to-b from-background to-secondary/30 overflow-hidden"
//     >
//       {/* Decorative gradient */}
//       <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-solar/40 to-transparent" />
//       <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-solar/5 blur-[100px]" />

//       <div className="max-w-7xl mx-auto px-6">
//         {/* Section header */}
//         <div className="text-center mb-16 calc-fade-up">
//           <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-solar/10 text-solar rounded-full text-sm font-semibold mb-4">
//             <Calculator className="w-4 h-4" />
//             PM Surya Ghar · PMSGY
//           </div>
//           <h2 className="text-display-lg text-foreground">
//             Karur & Tamil Nadu{" "}
//             <span className="text-gradient-solar">Subsidy Hub</span>
//           </h2>
//           <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
//             Calculate your Central + State solar subsidy and TANGEDCO
//             net-metering savings in real-time. Built with live Tamil Nadu tariff
//             structures and PM Surya Ghar guidelines for Karur residents.
//           </p>
//         </div>

//         <div className="grid lg:grid-cols-5 gap-8">
//           {/* Input panel */}
//           <div className="lg:col-span-2 calc-fade-up">
//             <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-xl">
//               <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
//                 <span className="w-8 h-8 rounded-lg bg-solar/10 flex items-center justify-center">
//                   <Calculator className="w-5 h-5 text-solar" />
//                 </span>
//                 Your Solar Profile
//               </h3>

//               {/* Monthly Bill Slider */}
//               <div className="mb-8">
//                 <div className="flex items-center justify-between mb-3">
//                   <label className="text-sm font-medium text-foreground flex items-center gap-2">
//                     <IndianRupee className="w-4 h-4 text-solar" />
//                     Monthly Electricity Bill
//                   </label>
//                   <span className="text-lg font-bold text-solar tabular-nums">
//                     {formatCurrency(monthlyBill)}
//                   </span>
//                 </div>
//                 <input
//                   type="range"
//                   min={500}
//                   max={20000}
//                   step={500}
//                   value={monthlyBill}
//                   onChange={(e) => setMonthlyBill(Number(e.target.value))}
//                   className="w-full h-2 bg-secondary rounded-full appearance-none cursor-pointer accent-solar"
//                   style={{
//                     background: `linear-gradient(to right, hsl(38 92% 50%) ${((monthlyBill - 500) / 19500) * 100}%, hsl(210 40% 96%) ${((monthlyBill - 500) / 19500) * 100}%)`,
//                   }}
//                 />
//                 <div className="flex justify-between mt-2 text-xs text-muted-foreground">
//                   <span>₹500</span>
//                   <span>₹20,000</span>
//                 </div>
//               </div>

//               {/* Roof Area Slider */}
//               <div className="mb-8">
//                 <div className="flex items-center justify-between mb-3">
//                   <label className="text-sm font-medium text-foreground flex items-center gap-2">
//                     <Home className="w-4 h-4 text-solar" />
//                     Roof Area (Sq. Ft.)
//                   </label>
//                   <span className="text-lg font-bold text-solar tabular-nums">
//                     {roofArea} ft²
//                   </span>
//                 </div>
//                 <input
//                   type="range"
//                   min={100}
//                   max={3000}
//                   step={50}
//                   value={roofArea}
//                   onChange={(e) => setRoofArea(Number(e.target.value))}
//                   className="w-full h-2 bg-secondary rounded-full appearance-none cursor-pointer accent-solar"
//                   style={{
//                     background: `linear-gradient(to right, hsl(38 92% 50%) ${((roofArea - 100) / 2900) * 100}%, hsl(210 40% 96%) ${((roofArea - 100) / 2900) * 100}%)`,
//                   }}
//                 />
//                 <div className="flex justify-between mt-2 text-xs text-muted-foreground">
//                   <span>100 ft²</span>
//                   <span>3,000 ft²</span>
//                 </div>
//               </div>

//               {/* Connection Type */}
//               <div>
//                 <label className="text-sm font-medium text-foreground mb-3 block">
//                   Connection Type
//                 </label>
//                 <div className="grid grid-cols-3 gap-2">
//                   {connectionTypes.map(({ type, label, icon: Icon, desc }) => (
//                     <button
//                       key={type}
//                       onClick={() => setConnectionType(type)}
//                       className={`p-3 rounded-xl border-2 transition-all text-center ${
//                         connectionType === type
//                           ? "border-solar bg-solar/10 text-foreground"
//                           : "border-border bg-background hover:border-solar/50"
//                       }`}
//                     >
//                       <Icon
//                         className={`w-5 h-5 mx-auto mb-1.5 ${connectionType === type ? "text-solar" : "text-muted-foreground"}`}
//                       />
//                       <div className="text-xs font-semibold">{label}</div>
//                       <div className="text-[10px] text-muted-foreground mt-0.5 hidden sm:block">
//                         {desc}
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Info note */}
//               <div className="mt-6 p-4 bg-solar/5 rounded-xl flex gap-3">
//                 <Info className="w-5 h-5 text-solar shrink-0 mt-0.5" />
//                 <p className="text-xs text-muted-foreground leading-relaxed">
//                   Subsidy calculated per{" "}
//                   <strong className="text-foreground">
//                     PM Surya Ghar: Muft Bijli Yojana
//                   </strong>{" "}
//                   guidelines. Actual amounts may vary based on TANGEDCO Karur
//                   approval and DISCOM inspection.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Results panel */}
//           <div className="lg:col-span-3 calc-fade-up">
//             <div className="bg-gradient-to-br from-night to-night/90 text-white rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
//               {/* Grid background */}
//               <div className="absolute inset-0 hero-grid-bg opacity-20" />
//               <div className="absolute top-0 right-0 w-64 h-64 bg-solar/10 blur-[80px] rounded-full" />

//               <div className="relative">
//                 <div className="flex items-center justify-between mb-6">
//                   <h3 className="text-xl font-bold flex items-center gap-2">
//                     <Sun className="w-5 h-5 text-solar" />
//                     Your Solar Recommendation
//                   </h3>
//                   <span className="px-3 py-1 bg-solar/20 text-solar text-xs font-semibold rounded-full">
//                     Live Estimate
//                   </span>
//                 </div>

//                 {/* Primary result */}
//                 <div className="grid grid-cols-2 gap-4 mb-6">
//                   <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
//                     <p className="text-white/50 text-xs uppercase tracking-wide mb-1">
//                       Recommended System
//                     </p>
//                     <p className="text-3xl font-bold text-solar tabular-nums">
//                       {results.recommendedKW.toFixed(1)}{" "}
//                       <span className="text-lg text-white/70">kW</span>
//                     </p>
//                   </div>
//                   <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
//                     <p className="text-white/50 text-xs uppercase tracking-wide mb-1">
//                       Annual Generation
//                     </p>
//                     <p className="text-3xl font-bold text-solar tabular-nums">
//                       {Math.round(results.annualGeneration).toLocaleString(
//                         "en-IN",
//                       )}{" "}
//                       <span className="text-lg text-white/70">units</span>
//                     </p>
//                   </div>
//                 </div>

//                 {/* Cost breakdown */}
//                 <div className="space-y-3 mb-6">
//                   <div className="flex items-center justify-between py-3 border-b border-white/10">
//                     <span className="text-white/70 text-sm">
//                       Gross System Cost
//                     </span>
//                     <span className="text-white font-semibold tabular-nums">
//                       {formatCurrency(results.grossCost)}
//                     </span>
//                   </div>
//                   <div className="flex items-center justify-between py-3 border-b border-white/10">
//                     <div className="flex items-center gap-2">
//                       <span className="text-white/70 text-sm">
//                         Central Subsidy (PMSGY)
//                       </span>
//                       <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-semibold rounded">
//                         −
//                       </span>
//                     </div>
//                     <span className="text-green-400 font-semibold tabular-nums">
//                       −{formatCurrency(results.centralSubsidy)}
//                     </span>
//                   </div>
//                   <div className="flex items-center justify-between py-3 border-b border-white/10">
//                     <div className="flex items-center gap-2">
//                       <span className="text-white/70 text-sm">
//                         Tamil Nadu State Benefit
//                       </span>
//                       <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-semibold rounded">
//                         −
//                       </span>
//                     </div>
//                     <span className="text-green-400 font-semibold tabular-nums">
//                       −{formatCurrency(results.stateSubsidy)}
//                     </span>
//                   </div>
//                   <div className="flex items-center justify-between py-4 bg-solar/10 rounded-xl px-4">
//                     <span className="text-white font-semibold">
//                       Your Net Investment
//                     </span>
//                     <span className="text-2xl font-bold text-solar tabular-nums">
//                       {formatCurrency(results.netCost)}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Key metrics */}
//                 <div className="grid grid-cols-3 gap-3">
//                   <div className="bg-white/5 rounded-xl p-4 text-center">
//                     <TrendingDown className="w-5 h-5 text-solar mx-auto mb-2" />
//                     <p className="text-2xl font-bold text-white tabular-nums">
//                       {results.paybackYears.toFixed(1)}
//                     </p>
//                     <p className="text-white/50 text-xs mt-1">Years Payback</p>
//                   </div>
//                   <div className="bg-white/5 rounded-xl p-4 text-center">
//                     <PiggyBank className="w-5 h-5 text-solar mx-auto mb-2" />
//                     <p className="text-2xl font-bold text-white tabular-nums">
//                       ₹{(results.savings25Year / 100000).toFixed(1)}L
//                     </p>
//                     <p className="text-white/50 text-xs mt-1">
//                       25-Year Savings
//                     </p>
//                   </div>
//                   <div className="bg-white/5 rounded-xl p-4 text-center">
//                     <Zap className="w-5 h-5 text-solar mx-auto mb-2" />
//                     <p className="text-2xl font-bold text-white tabular-nums">
//                       {results.co2Offset.toFixed(1)}
//                     </p>
//                     <p className="text-white/50 text-xs mt-1">Tons CO₂/Year</p>
//                   </div>
//                 </div>

//                 {/* CTA */}
//                 <a
//                   href="https://wa.me/918667559595?text=I%20want%20to%20proceed%20with%20a%20solar%20installation"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="mt-6 w-full py-4 bg-gradient-to-r from-solar to-solar-dark text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-lg shadow-solar/30"
//                 >
//                   <CheckCircle2 className="w-5 h-5" />
//                   Proceed with Free Site Survey
//                 </a>
//               </div>
//             </div>

//             {/* Subsidy slab reference */}
//             <div className="mt-4 grid grid-cols-3 gap-3">
//               {[
//                 { kw: "1 kW", subsidy: "₹30,000" },
//                 { kw: "2 kW", subsidy: "₹60,000" },
//                 { kw: "3 kW+", subsidy: "₹78,000" },
//               ].map((slab) => (
//                 <div
//                   key={slab.kw}
//                   className="bg-card border border-border rounded-xl p-3 text-center"
//                 >
//                   <p className="text-xs text-muted-foreground">
//                     {slab.kw} System
//                   </p>
//                   <p className="text-sm font-bold text-solar">{slab.subsidy}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
