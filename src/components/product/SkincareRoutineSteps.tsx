import React from "react";

interface Step {
  step: string;
  title: string;
  category: string;
  desc: string;
  isActive?: boolean;
}

const STEPS: Step[] = [
  {
    step: "01",
    title: "Cleanse",
    category: "Face Wash",
    desc: "Gentle herbal foam removes pollution without stripping natural barrier lipids.",
  },
  {
    step: "02",
    title: "Tone & Mist",
    category: "Rose Water / Toner",
    desc: "Restores optimal pH 5.5 and floods the stratum corneum with hydration.",
  },
  {
    step: "03",
    title: "Treat",
    category: "Botanical Serum",
    desc: "Delivers concentrated peptides and bio-actives directly to cellular layers.",
  },
  {
    step: "04",
    title: "Seal & Shield",
    category: "Ceramide / SPF",
    desc: "Locks in vital moisture with skin-identical lipids and physical sun protection.",
  },
];

export default function SkincareRoutineSteps({
  activeCategory,
  className = "",
}: {
  activeCategory?: string;
  className?: string;
}) {
  return (
    <div className={`border border-[#E8E3DA] bg-[#FBF9F5] p-6 md:p-8 rounded-sm ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#4E5942] block mb-1">
            Routine Placement
          </span>
          <h4 className="text-base md:text-lg font-medium text-[#1A1A1A]">
            The Maysha 4-Step Daily Ritual
          </h4>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STEPS.map((s) => {
          const isCurrent =
            activeCategory &&
            (s.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
              s.title.toLowerCase().includes(activeCategory.toLowerCase()));

          return (
            <div
              key={s.step}
              className={`p-4 rounded-sm border transition-all ${
                isCurrent
                  ? "bg-white border-[#4E5942] shadow-sm ring-1 ring-[#4E5942]"
                  : "bg-white/70 border-[#E8E3DA]"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-xs font-bold ${
                    isCurrent ? "text-[#4E5942]" : "text-[#736E67]"
                  }`}
                >
                  Step {s.step}
                </span>
                {isCurrent && (
                  <span className="text-[10px] uppercase font-semibold bg-[#EFF7F2] text-[#386641] px-1.5 py-0.5 rounded">
                    This Step
                  </span>
                )}
              </div>
              <h5 className="text-sm font-semibold text-[#1A1A1A] mb-1">{s.title}</h5>
              <p className="text-xs text-[#5A5650] leading-relaxed">{s.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
