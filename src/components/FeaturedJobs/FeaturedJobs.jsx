import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, ChevronRight, ChevronLeft } from "lucide-react";
import { JOBS_DATA } from "../../data/jobs";
import { jobsService } from "../../services/jobsService";
import JobCard from "../JobCard/JobCard";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FeaturedJobs() {
  const containerRef = useRef(null);
  const scrollTrackRef = useRef(null);
  const [drives, setDrives] = useState(JOBS_DATA);

  useEffect(() => {
    let isMounted = true;
    jobsService.getAllJobs().then((data) => {
      if (isMounted && data && data.length > 0) {
        setDrives(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Take the featured jobs or top 6 drives
  const featuredDrives = drives.filter((j) => j.featured).slice(0, 6);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Reveal header
      gsap.fromTo(
        ".featured-header",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const scrollLeft = () => {
    if (scrollTrackRef.current) {
      scrollTrackRef.current.scrollBy({ left: -360, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollTrackRef.current) {
      scrollTrackRef.current.scrollBy({ left: 360, behavior: "smooth" });
    }
  };

  return (
    <section
      ref={containerRef}
      className="py-20 md:py-28 bg-[#f4f4f0] border-b border-[#e6e6df] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="featured-header flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="eyebrow flex items-center space-x-2 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-teal-700" />
              <span>DIRECT CLIENT SCHEDULES</span>
            </div>
            <h2 className="editorial-title text-3xl sm:text-4xl md:text-5xl text-[#111318]">
              FEATURED HIRING DRIVES.
            </h2>
            <p className="mt-3 text-sm text-[#6b7280] max-w-xl">
              Curated direct client drives in Hyderabad and Pan-India. Fast-track profile forwarding and 1-on-1 interview mentoring directly with hiring managers.
            </p>
          </div>

          <div className="mt-6 md:mt-0 flex items-center space-x-3">
            <button
              onClick={scrollLeft}
              className="p-3 rounded-full bg-white border border-[#e6e6df] hover:border-teal-700 text-[#111318] transition-all shadow-xs"
              aria-label="Scroll drives left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={scrollRight}
              className="p-3 rounded-full bg-white border border-[#e6e6df] hover:border-teal-700 text-[#111318] transition-all shadow-xs"
              aria-label="Scroll drives right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <Link
              to="/jobs"
              className="inline-flex items-center space-x-2 bg-[#111318] hover:bg-teal-800 text-white text-xs font-semibold px-5 py-3 rounded-xl transition-all shadow-xs"
            >
              <span>All 23+ Drives</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Horizontal Track for Cards */}
        <div
          ref={scrollTrackRef}
          className="flex space-x-6 overflow-x-auto pb-6 pt-2 scrollbar-none snap-x snap-mandatory focus:outline-none"
          tabIndex={0}
          aria-label="Featured hiring drives carousel"
        >
          {featuredDrives.map((job) => (
            <div
              key={job.id}
              className="w-[320px] sm:w-[380px] flex-shrink-0 snap-start"
            >
              <JobCard job={job} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
