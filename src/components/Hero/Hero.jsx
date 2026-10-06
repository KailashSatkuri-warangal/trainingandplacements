import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MessageSquare, ShieldCheck, CheckCircle2, ChevronDown, Sparkles } from "lucide-react";
import { SITE_CONFIG } from "../../data/siteContent";
import { gsap } from "gsap";

export default function Hero() {
  const heroRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        ".hero-eyebrow",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6 }
      )
      .fromTo(
        ".hero-title-line",
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 },
        "-=0.3"
      )
      .fromTo(
        ".hero-subtext",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7 },
        "-=0.4"
      )
      .fromTo(
        ".hero-ctas",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.3"
      )
      .fromTo(
        ".hero-badges",
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.7, stagger: 0.1 },
        "-=0.4"
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[92vh] flex flex-col justify-between pt-28 pb-12 overflow-hidden border-b border-[#e6e6df] bg-[#fbfbf9]"
    >
      {/* Subtle background grid pattern */}
      <div className="absolute inset-0 bg-grid-subtle pointer-events-none opacity-60" />

      {/* Subtle organic gradient glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 my-auto">
        {/* Top Tagline Pill */}
        <div className="hero-eyebrow flex flex-wrap items-center gap-2 mb-6">
          <div className="inline-flex items-center space-x-2 bg-white border border-[#e6e6df] rounded-full px-3.5 py-1 text-xs font-semibold text-[#1f2937] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Founded in {SITE_CONFIG.establishedYear} • Hyderabad</span>
            <span className="text-neutral-300">•</span>
            <span className="text-teal-800 font-mono">Recruiter: {SITE_CONFIG.directLine}</span>
          </div>

          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/60 text-[11px] font-bold text-teal-800 uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-teal-600" />
            <span>Verified Client Drives</span>
          </div>
        </div>

        {/* Main Editorial Headline */}
        <div className="max-w-5xl">
          <h1 className="editorial-title text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[#111318]">
            <span className="hero-title-line block">ACCELERATE YOUR</span>
            <span className="hero-title-line block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-600">
                NEXT CAREER
              </span>{" "}
              MOVE.
            </span>
          </h1>

          <p className="hero-subtext mt-6 text-base sm:text-lg md:text-xl text-[#4b5563] max-w-3xl leading-relaxed">
            Direct client drives, screening support, and 1-on-1 interview mentoring connecting ambitious candidates directly with Tier-1 MNC hiring panels across Hyderabad and Pan-India.
          </p>
        </div>

        {/* Primary CTAs */}
        <div className="hero-ctas mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
          <Link
            to="/jobs"
            className="inline-flex items-center justify-center space-x-2.5 bg-[#111318] hover:bg-teal-800 text-white font-semibold px-7 py-4 rounded-xl text-sm transition-all duration-200 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
            data-cursor
            data-cursor-label="EXPLORE"
          >
            <span>Explore Active Hiring Drives</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href={SITE_CONFIG.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center space-x-2.5 bg-white hover:bg-[#f4f4f0] text-[#111318] border border-[#d1d5db] font-semibold px-6 py-4 rounded-xl text-sm transition-all duration-200 hover:border-teal-700 shadow-xs"
            data-cursor
            data-cursor-label="WHATSAPP"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>Direct WhatsApp to Sandru Anudeep</span>
          </a>
        </div>

        {/* Floating/Curated Client Badges preview */}
        <div className="hero-badges mt-14 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white/80 backdrop-blur-sm border border-[#e6e6df] rounded-xl p-3.5 transition-all hover:border-teal-600/50 hover:shadow-sm">
            <div className="flex items-center justify-between text-[11px] font-bold text-teal-800 uppercase tracking-wider mb-1">
              <span>Capgemini</span>
              <span className="text-[10px] text-neutral-500 font-normal">Tier-1 IT</span>
            </div>
            <p className="text-xs font-semibold text-[#111318]">Engineering Drives</p>
            <p className="text-[11px] text-[#6b7280]">BE / B.Tech Freshers (₹5.5 LPA)</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-[#e6e6df] rounded-xl p-3.5 transition-all hover:border-teal-600/50 hover:shadow-sm">
            <div className="flex items-center justify-between text-[11px] font-bold text-teal-800 uppercase tracking-wider mb-1">
              <span>Teleperformance</span>
              <span className="text-[10px] text-neutral-500 font-normal">Google Process</span>
            </div>
            <p className="text-xs font-semibold text-[#111318]">Customer Care & Ops</p>
            <p className="text-[11px] text-[#6b7280]">Immediate Fast-Track Slots</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-[#e6e6df] rounded-xl p-3.5 transition-all hover:border-teal-600/50 hover:shadow-sm">
            <div className="flex items-center justify-between text-[11px] font-bold text-teal-800 uppercase tracking-wider mb-1">
              <span>Cognizant</span>
              <span className="text-[10px] text-neutral-500 font-normal">WFH Domain</span>
            </div>
            <p className="text-xs font-semibold text-[#111318]">Google Mapping Project</p>
            <p className="text-[11px] text-[#6b7280]">Non-Voice Associate (₹2.7 LPA)</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-[#e6e6df] rounded-xl p-3.5 transition-all hover:border-teal-600/50 hover:shadow-sm">
            <div className="flex items-center justify-between text-[11px] font-bold text-teal-800 uppercase tracking-wider mb-1">
              <span>R1 RCM & IKS</span>
              <span className="text-[10px] text-neutral-500 font-normal">Healthcare</span>
            </div>
            <p className="text-xs font-semibold text-[#111318]">US Healthcare RCM</p>
            <p className="text-[11px] text-[#6b7280]">Medical Billing & AR Caller</p>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Prompt */}
      <div className="relative z-10 mt-8 pt-4 border-t border-[#e6e6df]/60 flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-xs text-[#6b7280]">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>100% Free Placement Assistance for Candidates</span>
        </div>

        <a
          href="#stats-section"
          className="hidden sm:inline-flex items-center space-x-1 hover:text-[#111318] transition-colors"
        >
          <span>SCROLL TO EXPLORE</span>
          <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
        </a>
      </div>
    </section>
  );
}
