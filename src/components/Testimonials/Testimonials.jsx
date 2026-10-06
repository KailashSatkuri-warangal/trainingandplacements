import { useState, useEffect } from "react";
import { Quote, Star, CheckCircle } from "lucide-react";
import { testimonialService } from "../../services/testimonialService";
import { TESTIMONIALS_DATA } from "../../data/testimonials";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState(TESTIMONIALS_DATA);

  useEffect(() => {
    let isMounted = true;
    testimonialService.getPublishedTestimonials().then((data) => {
      if (isMounted && data && data.length > 0) {
        setTestimonials(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-20 md:py-28 bg-white border-b border-[#e6e6df]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="eyebrow flex items-center justify-center space-x-2 mb-2">
            <CheckCircle className="w-3.5 h-3.5 text-teal-700" />
            <span>VERIFIED CANDIDATE PLACEMENT REVIEWS</span>
          </div>
          <h2 className="editorial-title text-3xl sm:text-4xl md:text-5xl text-[#111318]">
            REAL PEOPLE. REAL CAREER MOVES.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#6b7280]">
            Genuine testimonials from candidates successfully placed in Non-IT and corporate client drives through direct mentorship and client mapping.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-[#fbfbf9] rounded-2xl border border-[#e6e6df] p-6 flex flex-col justify-between transition-all duration-300 hover:border-teal-700 hover:shadow-md hover:-translate-y-1 relative"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {t.category || t.company || "PLACEMENT"}
                  </span>
                  <div className="flex text-amber-500">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                <Quote className="w-6 h-6 text-teal-700/30 mb-2" />

                <p className="text-xs sm:text-sm text-[#374151] leading-relaxed italic">
                  "{t.content || t.quote}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#e6e6df] flex items-center space-x-3">
                {t.avatar_url ? (
                  <img
                    src={t.avatar_url}
                    alt={t.name}
                    className="w-9 h-9 rounded-full object-cover border border-[#e6e6df]"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-teal-800 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                    {t.name ? t.name.split(" ").map((n) => n[0]).join("").slice(0, 2) : "CP"}
                  </div>
                )}
                <div className="overflow-hidden">
                  <h4 className="text-xs font-bold text-[#111318] truncate">
                    {t.name}
                  </h4>
                  <p className="text-[11px] text-[#6b7280] truncate">
                    {t.role}
                  </p>
                  <p className="text-[10px] text-[#9ca3af] font-mono truncate">
                    {t.company ? `Placed at ${t.company}` : (t.email || "Verified Placement")}
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
