import { ArrowRight, ShieldCheck } from "lucide-react";
import { WHY_CHOOSE_US_ITEMS } from "../../data/siteContent";

export default function WhyChooseUs() {
  return (
    <section className="py-20 md:py-28 bg-[#fbfbf9] border-b border-[#e6e6df]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div className="max-w-2xl">
            <p className="eyebrow mb-2">OUR COMMITMENT</p>
            <h2 className="editorial-title text-3xl sm:text-4xl md:text-5xl text-[#111318]">
              WHY TRAININGANDPLACEMENTS?
            </h2>
          </div>
          <p className="mt-4 md:mt-0 text-sm text-[#6b7280] max-w-md">
            Built on integrity, zero candidate fees, direct corporate client authorizations, and accountable mentorship in Hyderabad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_CHOOSE_US_ITEMS.map((item) => (
            <div
              key={item.number}
              className="group bg-white rounded-2xl border border-[#e6e6df] p-8 flex flex-col justify-between transition-all duration-300 hover:border-teal-700 hover:shadow-lg hover:-translate-y-1"
              data-cursor
              data-cursor-label="ADVANTAGE"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-display font-extrabold text-neutral-300 group-hover:text-teal-700 transition-colors">
                    {item.number}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#fbfbf9] border border-[#e6e6df] flex items-center justify-center group-hover:bg-teal-700 group-hover:text-white transition-colors">
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-[#111318] group-hover:text-teal-800 transition-colors">
                  {item.title}
                </h3>

                <p className="mt-3 text-xs sm:text-sm text-[#4b5563] leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#f0f0ea] flex items-center space-x-1.5 text-[11px] font-semibold text-teal-800">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>Verified Placement Standard</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
