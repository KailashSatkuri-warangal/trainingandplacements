import { useEffect, useRef } from "react";
import { STATS_DATA } from "../../data/siteContent";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Stats() {
  const statsSectionRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const counters = statsSectionRef.current.querySelectorAll(".counter-value");

      counters.forEach((counter) => {
        const targetValue = parseInt(counter.getAttribute("data-target"), 10);
        if (isNaN(targetValue)) return;

        gsap.fromTo(
          counter,
          { innerText: 0 },
          {
            innerText: targetValue,
            duration: 1.8,
            ease: "power2.out",
            snap: { innerText: 1 },
            scrollTrigger: {
              trigger: counter,
              start: "top 90%",
              toggleActions: "play none none none"
            }
          }
        );
      });
    }, statsSectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="stats-section"
      ref={statsSectionRef}
      className="py-16 md:py-24 border-b border-[#e6e6df] bg-white relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 divide-y sm:divide-y-0 sm:divide-x divide-[#e6e6df]">
          {STATS_DATA.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col justify-between ${
                index === 0 ? "sm:pl-0 sm:pr-8" : "sm:px-8 pt-6 sm:pt-0"
              }`}
            >
              <div>
                <div className="flex items-baseline text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#111318]">
                  <span
                    className="counter-value font-display"
                    data-target={item.numeric}
                  >
                    {item.numeric}
                  </span>
                  <span className="text-teal-700 ml-0.5">{item.suffix}</span>
                </div>
                <h3 className="mt-3 text-sm font-bold tracking-tight uppercase text-[#111318]">
                  {item.label}
                </h3>
              </div>

              <p className="mt-2 text-xs text-[#6b7280] leading-relaxed">
                {item.subtext}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Stats;
