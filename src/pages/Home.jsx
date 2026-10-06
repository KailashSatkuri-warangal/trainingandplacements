import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import Hero from "../components/Hero/Hero";
import Stats from "../components/Stats/Stats";
import Marquee from "../components/Marquee/Marquee";
import FeaturedDrives from "../components/FeaturedDrives/FeaturedDrives";
import HiringPartners from "../components/HiringPartners/HiringPartners";
import CareerCategories from "../components/CareerCategories/CareerCategories";
import HowItWorks from "../components/HowItWorks/HowItWorks";
import WhyChooseUs from "../components/WhyChooseUs/WhyChooseUs";
import Testimonials from "../components/Testimonials/Testimonials";
import RecruiterCTA from "../components/RecruiterCTA/RecruiterCTA";
import JobCard from "../components/JobCard/JobCard";
import CardSkeleton from "../components/Loading/CardSkeleton";
import { driveService } from "../services/driveService";
import { useScrollReveal } from "../hooks/useScrollReveal";

export default function Home() {
  const containerRef = useRef(null);
  useScrollReveal(containerRef);

  const [recentDrives, setRecentDrives] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadRecent() {
      try {
        const data = await driveService.getLatestDrives(4);
        if (isMounted) {
          setRecentDrives(data || []);
        }
      } catch (err) {
        console.error("Failed to load recent drives:", err);
      } finally {
        if (isMounted) setLoadingRecent(false);
      }
    }

    loadRecent();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col w-full">
      {/* 1. Hero */}
      <Hero />

      {/* 2. Stats */}
      <Stats />

      {/* 3. Career Marquee */}
      <Marquee />

      {/* 4. Featured Hiring Drives Carousel */}
      <FeaturedDrives />

      {/* 5. Hiring Partners */}
      <HiringPartners />

      {/* 6. Active Drives Section Preview */}
      <section className="py-20 md:py-28 bg-white border-b border-[#e6e6df]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="eyebrow flex items-center space-x-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                <span>ACTIVE OPPORTUNITIES</span>
              </div>
              <h2 className="editorial-title text-3xl sm:text-4xl md:text-5xl text-[#111318]">
                LATEST CLIENT INTERVIEW OPENINGS.
              </h2>
              <p className="mt-3 text-sm text-[#6b7280] max-w-xl">
                Real-time interview slots across IT, Operations, and Healthcare RCM. Direct profile endorsement with zero spam.
              </p>
            </div>

            <Link
              to="/jobs"
              className="mt-6 md:mt-0 inline-flex items-center space-x-2 bg-[#111318] hover:bg-teal-800 text-white text-xs font-semibold px-6 py-3.5 rounded-xl transition-all shadow-xs"
              data-cursor
              data-cursor-label="ALL JOBS"
            >
              <span>Explore All Verified Drives</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loadingRecent ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CardSkeleton count={4} />
            </div>
          ) : recentDrives.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recentDrives.map((drive) => (
                <JobCard key={drive.id} job={drive} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-sm text-neutral-500">
              No recent drives found. Check our jobs board for active opportunities.
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              to="/jobs"
              className="inline-flex items-center space-x-2 text-xs font-bold text-teal-800 hover:text-teal-900 border-b-2 border-teal-800/30 hover:border-teal-800 pb-1 transition-all"
            >
              <span>View full job board with custom filters & salary sorting</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Career Categories */}
      <CareerCategories />

      {/* 8. How It Works */}
      <HowItWorks />

      {/* 9. Why TrainingAndPlacements */}
      <WhyChooseUs />

      {/* 10. Candidate Testimonials */}
      <Testimonials />

      {/* 11. Recruiter Section */}
      <RecruiterCTA />

      {/* 12. Pre-Footer Compact Contact Banner */}
      <section className="py-20 bg-[#f4f4f0] border-b border-[#e6e6df]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="eyebrow mb-2">READY FOR YOUR NEXT MOVE?</p>
          <h2 className="editorial-title text-3xl sm:text-4xl md:text-5xl text-[#111318] mb-4">
            LET'S SHAPE YOUR PROFESSIONAL PATHWAY.
          </h2>
          <p className="text-sm sm:text-base text-[#4b5563] max-w-2xl mx-auto mb-8">
            Whether you are a 2024–2026 fresher seeking your first corporate opportunity or an experienced associate aiming for higher CTC brackets, our recruiter desk is here to assist.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/jobs"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#111318] hover:bg-teal-800 text-white font-semibold px-8 py-4 rounded-xl text-sm transition-all shadow-md"
              data-cursor
              data-cursor-label="DISCOVER"
            >
              <span>Explore Verified Jobs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white hover:bg-[#ebebe5] text-[#111318] border border-[#d1d5db] font-semibold px-8 py-4 rounded-xl text-sm transition-all shadow-xs"
            >
              <span>Talk to Recruiter Desk</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
