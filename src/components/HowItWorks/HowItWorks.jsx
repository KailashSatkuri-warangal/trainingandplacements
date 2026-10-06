import { useState } from "react";
import { HOW_IT_WORKS_STEPS, SITE_CONFIG } from "../../data/siteContent";
import { CheckCircle2, MessageSquare, ArrowRight } from "lucide-react";

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="py-20 md:py-28 bg-white border-b border-[#e6e6df]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Sticky Header */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <p className="eyebrow mb-2">THE RECRUITMENT PATHWAY</p>
            <h2 className="editorial-title text-3xl sm:text-4xl md:text-5xl text-[#111318]">
              HOW CANDIDATE PLACEMENT WORKS.
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#4b5563] leading-relaxed">
              We eliminate ambiguous job boards and resume black holes. Our structured 5-step placement pipeline ensures transparent screening, personalized mock mentoring, and confirmed client interview slots.
            </p>

            <div className="mt-8 p-5 bg-[#fbfbf9] rounded-2xl border border-[#e6e6df] space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-teal-800 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Founder-Supervised Placement</span>
              </div>
              <p className="text-xs text-[#6b7280]">
                Every screening schedule is directly monitored by {SITE_CONFIG.founder} to ensure candidates are fully prepared before meeting client hiring panels.
              </p>
              <a
                href={SITE_CONFIG.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-teal-800 hover:text-teal-900 pt-1"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Ask about next walk-in slot</span>
                <ArrowRight className="w-3 h-3 ml-0.5" />
              </a>
            </div>
          </div>

          {/* Right Vertical Timeline Steps */}
          <div className="lg:col-span-7 space-y-4">
            {HOW_IT_WORKS_STEPS.map((step, index) => {
              const isActive = activeStep === index;

              return (
                <div
                  key={step.step}
                  onClick={() => setActiveStep(index)}
                  className={`p-6 sm:p-8 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-[#fbfbf9] border-teal-700 shadow-md ring-1 ring-teal-700/20"
                      : "bg-white border-[#e6e6df] hover:border-neutral-400"
                  }`}
                  data-cursor
                  data-cursor-label="STEP"
                >
                  <div className="flex items-start justify-between">
                    <span
                      className={`text-2xl sm:text-3xl font-display font-extrabold tracking-tight transition-colors ${
                        isActive ? "text-teal-700" : "text-neutral-300"
                      }`}
                    >
                      {step.step}
                    </span>

                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-semibold">
                      PHASE 0{index + 1}
                    </span>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center space-x-2">
                      <h4
                        className={`text-xs font-extrabold tracking-widest uppercase ${
                          isActive ? "text-teal-800" : "text-neutral-600"
                        }`}
                      >
                        {step.title}
                      </h4>
                      <span className="text-neutral-300">•</span>
                      <h3 className="text-base sm:text-lg font-bold text-[#111318]">
                        {step.headline}
                      </h3>
                    </div>

                    <p className="mt-2 text-xs sm:text-sm text-[#4b5563] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
