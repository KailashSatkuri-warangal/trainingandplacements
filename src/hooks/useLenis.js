import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useLenis() {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Synchronize Lenis with GSAP ScrollTrigger
    function onScroll(time) {
      lenis.raf(time * 1000);
    }

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add(onScroll);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onScroll);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return lenisRef;
}
