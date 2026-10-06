import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useScrollReveal(containerRef, options = {}) {
  useEffect(() => {
    if (!containerRef?.current) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Reveal all elements with .gsap-reveal
      const revealElements = containerRef.current.querySelectorAll(".gsap-reveal");
      revealElements.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none"
            }
          }
        );
      });

      // Reveal staggered elements with .gsap-stagger-parent and children .gsap-stagger-child
      const staggerParents = containerRef.current.querySelectorAll(".gsap-stagger-parent");
      staggerParents.forEach((parent) => {
        const children = parent.querySelectorAll(".gsap-stagger-child");
        if (children.length > 0) {
          gsap.fromTo(
            children,
            { opacity: 0, y: 25 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.08,
              ease: "power3.out",
              scrollTrigger: {
                trigger: parent,
                start: "top 85%",
                toggleActions: "play none none none"
              }
            }
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [containerRef]);
}
