import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, ChevronRight, ChevronLeft, MoveHorizontal } from "lucide-react";
import { driveService } from "../../services/driveService";
import JobCard from "../JobCard/JobCard";
import CardSkeleton from "../Loading/CardSkeleton";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FeaturedDrives() {
  const containerRef = useRef(null);
  const scrollTrackRef = useRef(null);
  const [featuredDrives, setFeaturedDrives] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Scroll & drag interaction states
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollLeftState, setCanScrollLeftState] = useState(false);
  const [canScrollRightState, setCanScrollRightState] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartScrollLeft = useRef(0);
  const hasMovedSignificantly = useRef(false);

  useEffect(() => {
    let isMounted = true;
    driveService.getFeaturedDrives(6).then((data) => {
      if (isMounted) {
        setFeaturedDrives(data || []);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Update scroll bounds & progress bar
  const updateScrollBounds = useCallback(() => {
    const track = scrollTrackRef.current;
    if (!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (maxScroll <= 0) {
      setScrollProgress(100);
      setCanScrollLeftState(false);
      setCanScrollRightState(false);
      return;
    }
    const current = track.scrollLeft;
    const progress = Math.min(100, Math.max(0, (current / maxScroll) * 100));
    setScrollProgress(progress);
    setCanScrollLeftState(current > 8);
    setCanScrollRightState(current < maxScroll - 8);
  }, []);

  // 1. Mouse wheel: translates vertical wheel scroll to horizontal card movement
  useEffect(() => {
    const track = scrollTrackRef.current;
    if (!track) return;

    const handleWheel = (e) => {
      // If user scrolls vertically with mouse wheel or trackpad
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        const maxScroll = track.scrollWidth - track.clientWidth;
        if (maxScroll <= 0) return;

        const scrollingRight = e.deltaY > 0;
        const scrollingLeft = e.deltaY < 0;

        // If track can still scroll horizontally in this direction
        const canMoveRight = scrollingRight && track.scrollLeft < maxScroll - 4;
        const canMoveLeft = scrollingLeft && track.scrollLeft > 4;

        if (canMoveRight || canMoveLeft) {
          e.preventDefault();
          track.scrollBy({
            left: e.deltaY * 1.35,
            behavior: "auto"
          });
          updateScrollBounds();
        }
      }
    };

    track.addEventListener("wheel", handleWheel, { passive: false });
    track.addEventListener("scroll", updateScrollBounds);
    window.addEventListener("resize", updateScrollBounds);

    return () => {
      track.removeEventListener("wheel", handleWheel);
      track.removeEventListener("scroll", updateScrollBounds);
      window.removeEventListener("resize", updateScrollBounds);
    };
  }, [featuredDrives, updateScrollBounds]);

  // 2. Mouse Drag (Grab & Slide) interaction
  const handleMouseDown = (e) => {
    if (!scrollTrackRef.current) return;
    setIsDragging(true);
    hasMovedSignificantly.current = false;
    dragStartX.current = e.pageX - scrollTrackRef.current.offsetLeft;
    dragStartScrollLeft.current = scrollTrackRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !scrollTrackRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollTrackRef.current.offsetLeft;
    const walk = (x - dragStartX.current) * 1.5;
    if (Math.abs(walk) > 5) {
      hasMovedSignificantly.current = true;
    }
    scrollTrackRef.current.scrollLeft = dragStartScrollLeft.current - walk;
    updateScrollBounds();
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // 3. Arrow button smooth scrolls (move right side box)
  const scrollLeft = () => {
    if (scrollTrackRef.current) {
      scrollTrackRef.current.scrollBy({ left: -390, behavior: "smooth" });
      setTimeout(updateScrollBounds, 350);
    }
  };

  const scrollRight = () => {
    if (scrollTrackRef.current) {
      scrollTrackRef.current.scrollBy({ left: 390, behavior: "smooth" });
      setTimeout(updateScrollBounds, 350);
    }
  };

  // 4. Click progress bar to jump to percentage
  const handleProgressBarClick = (e) => {
    const track = scrollTrackRef.current;
    if (!track) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const maxScroll = track.scrollWidth - track.clientWidth;
    track.scrollTo({
      left: maxScroll * clickRatio,
      behavior: "smooth"
    });
    setTimeout(updateScrollBounds, 350);
  };

  return (
    <section
      ref={containerRef}
      className="py-20 md:py-28 bg-[#f4f4f0] border-b border-[#e6e6df] overflow-hidden select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
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
            {/* Scroll Left Button */}
            <button
              type="button"
              onClick={scrollLeft}
              disabled={!canScrollLeftState}
              className={`p-3 rounded-full border transition-all shadow-xs ${
                canScrollLeftState
                  ? "bg-white border-[#e6e6df] hover:border-teal-700 hover:bg-neutral-50 text-[#111318] cursor-pointer"
                  : "bg-white/50 border-[#e6e6df]/50 text-neutral-300 cursor-not-allowed"
              }`}
              title="Scroll to previous opportunities"
              aria-label="Scroll drives left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Scroll Right Button */}
            <button
              type="button"
              onClick={scrollRight}
              disabled={!canScrollRightState}
              className={`p-3 rounded-full border transition-all shadow-xs ${
                canScrollRightState
                  ? "bg-white border-[#e6e6df] hover:border-teal-700 hover:bg-neutral-50 text-[#111318] cursor-pointer"
                  : "bg-white/50 border-[#e6e6df]/50 text-neutral-300 cursor-not-allowed"
              }`}
              title="Scroll to right-side opportunities"
              aria-label="Scroll drives right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <Link
              to="/jobs"
              className="inline-flex items-center space-x-2 bg-[#111318] hover:bg-teal-800 text-white text-xs font-semibold px-5 py-3 rounded-xl transition-all shadow-xs ml-2"
            >
              <span>Explore All Drives</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Dynamic Data Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CardSkeleton count={3} />
          </div>
        ) : featuredDrives.length > 0 ? (
          <div className="relative">
            {/* Horizontal Scroll Track */}
            <div
              ref={scrollTrackRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              className={`flex space-x-6 overflow-x-auto pb-4 pt-2 scrollbar-none snap-x snap-mandatory focus:outline-none transition-colors ${
                isDragging ? "cursor-grabbing" : "cursor-grab"
              }`}
              tabIndex={0}
              aria-label="Featured hiring drives horizontal slider"
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

            {/* Interactive Scroll Indicator Bar (Visual cue for moving right side box) */}
            <div className="mt-6 pt-4 border-t border-[#e6e6df]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#6b7280]">
              <div className="flex items-center space-x-2">
                <MoveHorizontal className="w-4 h-4 text-teal-700 animate-pulse" />
                <span className="font-medium text-[#111318]">
                  Scroll with mouse wheel or drag horizontally to view right-side drives
                </span>
              </div>

              {/* Interactive Progress Bar */}
              <div className="flex items-center space-x-3 w-full sm:w-64">
                <div
                  onClick={handleProgressBarClick}
                  className="relative flex-grow h-2 bg-[#e6e6df] rounded-full overflow-hidden cursor-pointer hover:h-2.5 transition-all"
                  title="Click to jump across drives"
                >
                  <div
                    className="h-full bg-teal-800 rounded-full transition-all duration-150"
                    style={{ width: `${Math.max(15, scrollProgress)}%` }}
                  />
                </div>
                <span className="font-mono text-[11px] font-semibold text-neutral-500 min-w-[32px] text-right">
                  {Math.round(scrollProgress)}%
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#e6e6df] p-12 text-center max-w-md mx-auto">
            <p className="text-sm font-semibold text-[#111318]">
              No featured opportunities currently.
            </p>
            <p className="text-xs text-[#6b7280] mt-1">
              Check all available active hiring drives on our job board.
            </p>
            <div className="pt-4">
              <Link
                to="/jobs"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-teal-800 hover:underline"
              >
                <span>Browse All Opportunities</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
