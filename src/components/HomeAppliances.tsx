import React, { useEffect, useMemo, useState } from "react";

import {
  AirVent,
  Check,
  Droplets,
  Fan,
  Flame,
  Lightbulb,
  Monitor,
  Printer,
  Refrigerator,
  Settings,
  Snowflake,
  Tv,
  WashingMachine,
  Waves,
  X,
  Zap,
} from "lucide-react";

export interface Appliance {
  id: string;
  name: string;
  icon: React.ReactNode;
  power: number;
  quantity: number;
  hours: number;
  active: boolean;
  category: "home" | "commercial" | "agriculture";
}

interface HomeAppliancesProps {
  onLoadChange?: (loadKW: number, dailyUnits: number) => void;
}

const defaultAppliances: Appliance[] = [
  {
    id: "fan",
    name: "Ceiling Fan",
    icon: <Fan />,
    power: 75,
    quantity: 4,
    hours: 8,
    active: true,
    category: "home",
  },
  {
    id: "light",
    name: "LED Light",
    icon: <Lightbulb />,
    power: 10,
    quantity: 6,
    hours: 6,
    active: true,
    category: "home",
  },
  // {
  //   id: "fridge",
  //   name: "Refrigerator",
  //   icon: <Refrigerator />,
  //   power: 250,
  //   quantity: 1,
  //   hours: 10,
  //   active: true,
  //   category: "home",
  // },
  // {
  //   id: "tv",
  //   name: "Smart TV",
  //   icon: <Tv />,
  //   power: 110,
  //   quantity: 1,
  //   hours: 5,
  //   active: true,
  //   category: "home",
  // },
  // {
  //   id: "washing",
  //   name: "Washing Machine",
  //   icon: <WashingMachine />,
  //   power: 500,
  //   quantity: 1,
  //   hours: 1,
  //   active: false,
  //   category: "home",
  // },
];

const smartAppliances: Record<
  "home" | "commercial" | "agriculture",
  Appliance[]
> = {
  home: [
    {
      id: "home-ac",
      name: "Air Conditioner",
      icon: <Snowflake />,
      power: 1500,
      quantity: 1,
      hours: 6,
      active: false,
      category: "home",
    },
    {
      id: "home-geyser",
      name: "Water Heater",
      icon: <Flame />,
      power: 2000,
      quantity: 1,
      hours: 1,
      active: false,
      category: "home",
    },
    {
      id: "home-mixer",
      name: "Mixer Grinder",
      icon: <Settings />,
      power: 500,
      quantity: 1,
      hours: 0.5,
      active: false,
      category: "home",
    },
    {
      id: "home-computer",
      name: "Computer",
      icon: <Monitor />,
      power: 200,
      quantity: 1,
      hours: 6,
      active: false,
      category: "home",
    },
  ],

  commercial: [
    {
      id: "commercial-ac",
      name: "Commercial AC",
      icon: <AirVent />,
      power: 1800,
      quantity: 2,
      hours: 8,
      active: false,
      category: "commercial",
    },
    {
      id: "commercial-light",
      name: "Commercial LED",
      icon: <Lightbulb />,
      power: 40,
      quantity: 10,
      hours: 8,
      active: false,
      category: "commercial",
    },
    {
      id: "commercial-computer",
      name: "Desktop Computer",
      icon: <Monitor />,
      power: 250,
      quantity: 5,
      hours: 8,
      active: false,
      category: "commercial",
    },
    {
      id: "commercial-freezer",
      name: "Deep Freezer",
      icon: <Snowflake />,
      power: 500,
      quantity: 1,
      hours: 12,
      active: false,
      category: "commercial",
    },
    {
      id: "commercial-printer",
      name: "Printer",
      icon: <Printer />,
      power: 400,
      quantity: 1,
      hours: 2,
      active: false,
      category: "commercial",
    },
    {
      id: "commercial-machine",
      name: "Commercial Machine",
      icon: <Settings />,
      power: 2000,
      quantity: 1,
      hours: 6,
      active: false,
      category: "commercial",
    },
  ],

  agriculture: [
    {
      id: "agri-pump",
      name: "Water Pump",
      icon: <Droplets />,
      power: 1500,
      quantity: 1,
      hours: 5,
      active: false,
      category: "agriculture",
    },
    {
      id: "agri-borewell",
      name: "Borewell Pump",
      icon: <Waves />,
      power: 2200,
      quantity: 1,
      hours: 4,
      active: false,
      category: "agriculture",
    },
    {
      id: "agri-irrigation",
      name: "Irrigation Motor",
      icon: <Droplets />,
      power: 3000,
      quantity: 1,
      hours: 4,
      active: false,
      category: "agriculture",
    },
    {
      id: "agri-fan",
      name: "Farm Ventilation Fan",
      icon: <Fan />,
      power: 500,
      quantity: 3,
      hours: 8,
      active: false,
      category: "agriculture",
    },
    {
      id: "agri-light",
      name: "Farm Light",
      icon: <Lightbulb />,
      power: 20,
      quantity: 10,
      hours: 8,
      active: false,
      category: "agriculture",
    },
    {
      id: "agri-motor",
      name: "Agriculture Motor",
      icon: <Settings />,
      power: 5000,
      quantity: 1,
      hours: 4,
      active: false,
      category: "agriculture",
    },
  ],
};

const HomeAppliances: React.FC<HomeAppliancesProps> = ({ onLoadChange }) => {
  const [appliances, setAppliances] = useState<Appliance[]>(defaultAppliances);

  const [category, setCategory] = useState<
    "home" | "commercial" | "agriculture"
  >("home");

  const [showCustom, setShowCustom] = useState(false);

  const [customName, setCustomName] = useState("");
  const [customPower, setCustomPower] = useState("500");
  const [customHours, setCustomHours] = useState("2");

  const [editingId, setEditingId] = useState<string | null>(null);

  const categoryAppliances = appliances.filter(
    (item) => item.category === category,
  );

  const categoryTitle =
    category === "home"
      ? "Home Appliances"
      : category === "commercial"
        ? "Commercial Appliances"
        : "Agriculture Appliances";

  const categoryEnergyTitle =
    category === "home"
      ? "Home Energy"
      : category === "commercial"
        ? "Commercial Energy"
        : "Agriculture Energy";

  const categoryDescription =
    category === "home"
      ? "Add your home appliances to calculate your household load."
      : category === "commercial"
        ? "Add your commercial appliances to calculate your business load."
        : "Add your agriculture equipment to calculate your farm load.";

  const totals = useMemo(() => {
    const activeAppliances = appliances.filter(
      (item) => item.category === category && item.active && item.quantity > 0,
    );

    const totalWatts = activeAppliances.reduce(
      (total, item) => total + item.power * item.quantity,
      0,
    );

    const dailyUnits = activeAppliances.reduce(
      (total, item) => total + (item.power * item.quantity * item.hours) / 1000,
      0,
    );

    return {
      totalWatts,
      totalKW: totalWatts / 1000,
      dailyUnits,
      annualUnits: dailyUnits * 365,
    };
  }, [appliances, category]);

  useEffect(() => {
    onLoadChange?.(totals.totalKW, totals.dailyUnits);
  }, [totals.totalKW, totals.dailyUnits, onLoadChange]);

  const changeCategory = (
    newCategory: "home" | "commercial" | "agriculture",
  ) => {
    setCategory(newCategory);
    setShowCustom(false);
    setEditingId(null);
  };

  const toggleAppliance = (id: string) => {
    setAppliances((previous) =>
      previous.map((item) => {
        if (item.id !== id) {
          return item;
        }

        const active = !item.active;

        return {
          ...item,
          active,
          quantity: active ? Math.max(1, item.quantity) : 0,
        };
      }),
    );
  };

  const updateQuantity = (id: string, quantity: number) => {
    setAppliances((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(0, quantity),
              active: quantity > 0,
            }
          : item,
      ),
    );
  };

  const updateHours = (id: string, hours: number) => {
    setAppliances((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              hours: Math.min(24, Math.max(0, hours)),
            }
          : item,
      ),
    );
  };

  const updateAppliance = (
    id: string,
    field: "name" | "power",
    value: string,
  ) => {
    setAppliances((previous) =>
      previous.map((item) => {
        if (item.id !== id) {
          return item;
        }

        if (field === "name") {
          return {
            ...item,
            name: value,
          };
        }

        return {
          ...item,
          power: Math.max(1, Number(value) || 1),
        };
      }),
    );
  };

  const deleteAppliance = (id: string) => {
    setAppliances((previous) => previous.filter((item) => item.id !== id));

    if (editingId === id) {
      setEditingId(null);
    }
  };

  const addSmartAppliance = (item: Appliance) => {
    const alreadyExists = appliances.some(
      (appliance) =>
        appliance.id === item.id ||
        (appliance.name === item.name && appliance.category === item.category),
    );

    if (alreadyExists) {
      setAppliances((previous) =>
        previous.map((appliance) =>
          appliance.id === item.id
            ? {
                ...appliance,
                active: true,
                quantity: Math.max(1, appliance.quantity),
              }
            : appliance,
        ),
      );

      return;
    }

    setAppliances((previous) => [
      ...previous,
      {
        ...item,
        id: `${item.id}-${Date.now()}`,
        active: true,
      },
    ]);
  };

  const addCustomAppliance = () => {
    if (!customName.trim()) {
      return;
    }

    const appliance: Appliance = {
      id: `custom-${Date.now()}`,
      name: customName.trim(),
      icon: <Zap />,
      power: Math.max(1, Number(customPower) || 500),
      quantity: 1,
      hours: Math.min(24, Math.max(0, Number(customHours) || 2)),
      active: true,
      category,
    };

    setAppliances((previous) => [...previous, appliance]);

    setCustomName("");
    setCustomPower("500");
    setCustomHours("2");
    setShowCustom(false);
  };

  return (
    <div className="w-full">
      {/* Header */}

      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
            {categoryEnergyTitle}
          </span>

          <h3 className="mt-1 mb-1 text-base font-bold text-foreground">
            {categoryTitle}
          </h3>

          <p className="text-xs text-muted-foreground">{categoryDescription}</p>
        </div>

        <div className="shrink-0 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-right">
          <span className="block text-[10px] text-muted-foreground">
            Total Load
          </span>

          <span className="text-sm font-bold text-amber-600">
            {totals.totalKW.toFixed(2)} kW
          </span>
        </div>
      </div>

      {/* Category */}

      <div className="mb-3 flex gap-2">
        <button
          type="button"
          onClick={() => changeCategory("home")}
          className={`flex-1 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
            category === "home"
              ? "border-amber-500 bg-amber-500 text-white"
              : "border-border bg-background text-muted-foreground hover:bg-secondary"
          }`}
        >
          Home
        </button>

        <button
          type="button"
          onClick={() => changeCategory("commercial")}
          className={`flex-1 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
            category === "commercial"
              ? "border-amber-500 bg-amber-500 text-white"
              : "border-border bg-background text-muted-foreground hover:bg-secondary"
          }`}
        >
          Commercial
        </button>

        <button
          type="button"
          onClick={() => changeCategory("agriculture")}
          className={`flex-1 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
            category === "agriculture"
              ? "border-amber-500 bg-amber-500 text-white"
              : "border-border bg-background text-muted-foreground hover:bg-secondary"
          }`}
        >
          Agriculture
        </button>
      </div>

      {/* Smart Appliances */}

      <div className="mb-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Smart Add
          </span>

          <span className="text-[9px] text-muted-foreground">
            Common{" "}
            {category === "home"
              ? "home"
              : category === "commercial"
                ? "commercial"
                : "agriculture"}{" "}
            loads
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {smartAppliances[category].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => addSmartAppliance(item)}
              className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-[10px] font-semibold text-foreground transition hover:border-amber-400 hover:bg-amber-50"
            >
              <span className="flex h-3.5 w-3.5 items-center justify-center">
                {React.cloneElement(item.icon as React.ReactElement, {
                  size: 13,
                  strokeWidth: 2,
                })}
              </span>

              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Appliance List */}

      <div className="space-y-2">
        {categoryAppliances.map((item) => {
          const dailyUsage = (item.power * item.quantity * item.hours) / 1000;

          return (
            <div
              key={item.id}
              className={`rounded-xl border p-2.5 transition-all ${
                item.active
                  ? "border-amber-200 bg-amber-50/70"
                  : "border-border bg-secondary/20"
              }`}
            >
              <div className="flex items-center gap-2">
                {/* Active */}

                <button
                  type="button"
                  onClick={() => toggleAppliance(item.id)}
                  title={item.active ? "Disable appliance" : "Enable appliance"}
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-xs font-bold transition ${
                    item.active
                      ? "border-amber-500 bg-amber-500 text-white"
                      : "border-border bg-background text-muted-foreground"
                  }`}
                >
                  {item.active && <Check size={14} strokeWidth={3} />}
                </button>

                {/* Icon */}

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-base text-amber-600">
                  {React.cloneElement(item.icon as React.ReactElement, {
                    size: 17,
                    strokeWidth: 2,
                  })}
                </div>

                {/* Name */}

                <div className="min-w-0 flex-1">
                  {editingId === item.id ? (
                    <input
                      type="text"
                      value={item.name}
                      onChange={(event) =>
                        updateAppliance(item.id, "name", event.target.value)
                      }
                      onBlur={() => setEditingId(null)}
                      autoFocus
                      className="h-6 w-full rounded-md border border-amber-400 bg-background px-1 text-xs font-semibold outline-none"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setEditingId(item.id)}
                      title="Click to edit appliance name"
                      className="block max-w-full truncate text-left text-xs font-semibold text-foreground hover:text-amber-600"
                    >
                      {item.name}
                    </button>
                  )}

                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <input
                      type="number"
                      min="1"
                      value={item.power}
                      onChange={(event) =>
                        updateAppliance(item.id, "power", event.target.value)
                      }
                      className="w-12 border-b border-transparent bg-transparent text-[10px] text-muted-foreground outline-none focus:border-amber-500"
                    />
                    W each
                  </div>
                </div>

                {/* Quantity */}

                <div className="shrink-0">
                  <span className="mb-1 block text-[9px] text-muted-foreground">
                    Qty
                  </span>

                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="flex h-6 w-6 items-center justify-center rounded-l-md border border-border bg-background text-xs hover:bg-secondary"
                    >
                      −
                    </button>

                    <span className="flex h-6 min-w-6 items-center justify-center border-y border-border bg-background px-1 text-[10px]">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="flex h-6 w-6 items-center justify-center rounded-r-md border border-border bg-background text-xs hover:bg-secondary"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Hours */}

                <div className="hidden shrink-0 sm:block">
                  <span className="mb-1 block text-[9px] text-muted-foreground">
                    Hours/day
                  </span>

                  <div className="flex items-center">
                    <input
                      type="number"
                      min="0"
                      max="24"
                      step="0.5"
                      value={item.hours}
                      onChange={(event) =>
                        updateHours(item.id, Number(event.target.value))
                      }
                      className="h-6 w-12 rounded-l-md border border-border bg-background px-1 text-center text-[10px] outline-none focus:border-amber-500"
                    />

                    <span className="flex h-6 items-center rounded-r-md border-y border-r border-border bg-secondary px-1.5 text-[9px] text-muted-foreground">
                      h
                    </span>
                  </div>
                </div>

                {/* Daily */}

                <div className="w-12 shrink-0 text-right">
                  <span className="block text-[9px] text-muted-foreground">
                    Daily
                  </span>

                  <span className="text-[10px] font-semibold text-foreground">
                    {dailyUsage.toFixed(1)}
                  </span>

                  <span className="ml-0.5 text-[9px] text-muted-foreground">
                    kWh
                  </span>
                </div>

                {/* Delete */}

                <button
                  type="button"
                  onClick={() => deleteAppliance(item.id)}
                  title={`Delete ${item.name}`}
                  aria-label={`Delete ${item.name}`}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-500 transition hover:border-red-400 hover:bg-red-500 hover:text-white"
                >
                  <X size={14} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty Category */}

      {categoryAppliances.length === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-secondary/20 p-4 text-center">
          <Zap size={20} className="mx-auto mb-2 text-muted-foreground" />

          <p className="text-xs font-semibold text-foreground">
            No appliances added
          </p>

          <p className="mt-1 text-[10px] text-muted-foreground">
            Use Smart Add or add a custom appliance below.
          </p>
        </div>
      )}

      {/* Add Appliance */}

      <button
        type="button"
        onClick={() => setShowCustom(!showCustom)}
        className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl border border-dashed border-amber-300 bg-amber-50/50 py-2 text-xs font-semibold text-amber-600 transition hover:bg-amber-50"
      >
        <span className="text-base leading-none">+</span>
        Add Appliance
      </button>

      {/* Custom Appliance */}

      {showCustom && (
        <div className="mt-3 rounded-xl border border-border bg-secondary/20 p-3">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <h4 className="text-xs font-bold text-foreground">
                Add Custom Appliance
              </h4>

              <p className="mt-0.5 text-[10px] text-muted-foreground">
                Add an appliance not listed above.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowCustom(false)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              <X size={15} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-12">
            <div className="sm:col-span-5">
              <label className="mb-1 block text-[10px] font-semibold text-muted-foreground">
                Appliance Name
              </label>

              <input
                type="text"
                value={customName}
                onChange={(event) => setCustomName(event.target.value)}
                placeholder={
                  category === "home"
                    ? "Mixer Grinder"
                    : category === "commercial"
                      ? "Air Compressor"
                      : "Water Pump"
                }
                className="h-8 w-full rounded-lg border border-border bg-background px-2 text-xs outline-none focus:border-amber-500"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="mb-1 block text-[10px] font-semibold text-muted-foreground">
                Power
              </label>

              <div className="flex">
                <input
                  type="number"
                  min="1"
                  value={customPower}
                  onChange={(event) => setCustomPower(event.target.value)}
                  className="h-8 w-full rounded-l-lg border border-border bg-background px-2 text-xs outline-none focus:border-amber-500"
                />

                <span className="flex h-8 items-center rounded-r-lg border-y border-r border-border bg-secondary px-2 text-[9px] text-muted-foreground">
                  W
                </span>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-[10px] font-semibold text-muted-foreground">
                Hours
              </label>

              <input
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={customHours}
                onChange={(event) => setCustomHours(event.target.value)}
                className="h-8 w-full rounded-lg border border-border bg-background px-2 text-xs outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-end sm:col-span-2">
              <button
                type="button"
                onClick={addCustomAppliance}
                className="h-8 w-full rounded-lg bg-amber-500 px-2 text-xs font-bold text-white transition hover:bg-amber-600"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}

      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-border bg-secondary/20 p-2">
          <span className="block text-[9px] text-muted-foreground">
            Connected Load
          </span>

          <strong className="text-xs text-foreground">
            {totals.totalWatts.toLocaleString()} W
          </strong>
        </div>

        <div className="rounded-xl border border-border bg-secondary/20 p-2">
          <span className="block text-[9px] text-muted-foreground">
            Daily Consumption
          </span>

          <strong className="text-xs text-foreground">
            {totals.dailyUnits.toFixed(1)} kWh
          </strong>
        </div>

        <div className="rounded-xl border border-border bg-secondary/20 p-2">
          <span className="block text-[9px] text-muted-foreground">
            Annual Consumption
          </span>

          <strong className="text-xs text-foreground">
            {Math.round(totals.annualUnits).toLocaleString()} units
          </strong>
        </div>
      </div>
    </div>
  );
};

export default HomeAppliances;
