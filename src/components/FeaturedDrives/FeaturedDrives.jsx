import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, ChevronRight, ChevronLeft } from "lucide-react";
import { driveService } from "../../services/driveService";
import JobCard from "../JobCard/JobCard";
import CardSkeleton from "../Loading/CardSkeleton";

const CATEGORY_FILTERS = [
  { id: "all", label: "All Drives" },
  { id: "it", label: "IT & Software" },
  { id: "healthcare", label: "US Healthcare (RCM)" },
  { id: "operations", label: "Non-IT & Operations" },
  { id: "freshers", label: "Freshers (2025/2026)" }
];

export default function FeaturedDrives() {
  const containerRef = useRef(null);
  const scrollTrackRef = useRef(null);
  const [allDrives, setAllDrives] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Scroll & drag interaction states
  const [canScrollLeftState, setCanScrollLeftState] = useState(false);
  const [canScrollRightState, setCanScrollRightState] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  const dragStartX = useRef(0);
  const dragStartScrollLeft = useRef(0);
  const hasMovedSignificantly = useRef(false);

  // Fetch drives
  useEffect(() => {
    let isMounted = true;
    driveService.getFeaturedDrives(12).then((data) => {
      if (isMounted) {
        setAllDrives(data || []);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter drives based on selected category tab
  const filteredDrives = allDrives.filter((drive) => {
    if (activeCategory === "all") return true;
    const catName = (typeof drive.category === "object" ? drive.category?.name : drive.category || "").toLowerCase();
    const title = (drive.title || "").toLowerCase();
    const exp = (drive.experience || "").toLowerCase();

    if (activeCategory === "it") {
      return catName.includes("it") || catName.includes("software") || catName.includes("engineering") || title.includes("developer") || title.includes("engineer");
    }
    if (activeCategory === "healthcare") {
      return catName.includes("health") || catName.includes("rcm") || title.includes("healthcare") || title.includes("billing") || title.includes("ar caller");
    }
    if (activeCategory === "operations") {
      return catName.includes("operation") || catName.includes("bpo") || catName.includes("customer") || title.includes("voice") || title.includes("specialist");
    }
    if (activeCategory === "freshers") {
      return exp.includes("fresher") || title.includes("2025") || title.includes("2026") || title.includes("graduate");
    }
    return true;
  });

  // Calculate current card step width + gap
  const getCardStep = useCallback(() => {
    const track = scrollTrackRef.current;
    if (!track) return 390;
    const firstCard = track.querySelector(".featured-drive-card");
    if (firstCard) {
      return firstCard.offsetWidth + 24; // Card width plus space-x-6 (24px)
    }
    return 390;
  }, []);

  // Update scroll bounds & 0-100% progress bar
  const updateScrollBounds = useCallback(() => {
    const track = scrollTrackRef.current;
    if (!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth;

    if (maxScroll <= 0) {
      setCanScrollLeftState(false);
      setCanScrollRightState(false);
      return;
    }

    const current = Math.max(0, track.scrollLeft);
    setCanScrollLeftState(current > 8);
    setCanScrollRightState(current < maxScroll - 8);
  }, []);

  // When changing category, reset scroll to start
  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    if (scrollTrackRef.current) {
      scrollTrackRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
    setTimeout(updateScrollBounds, 150);
  };

  // Scroll functions
  const scrollLeft = () => {
    const track = scrollTrackRef.current;
    if (!track) return;
    const step = getCardStep();
    track.scrollBy({ left: -step, behavior: "smooth" });
    setTimeout(updateScrollBounds, 120);
    setTimeout(updateScrollBounds, 350);
  };

  const scrollRight = () => {
    const track = scrollTrackRef.current;
    if (!track) return;
    const step = getCardStep();
    track.scrollBy({ left: step, behavior: "smooth" });
    setTimeout(updateScrollBounds, 120);
    setTimeout(updateScrollBounds, 350);
  };

  // Mouse wheel translation: translates vertical wheel scroll into horizontal card movement
  useEffect(() => {
    const track = scrollTrackRef.current;
    if (!track) return;

    const handleWheel = (e) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 2) return;

      const maxScroll = track.scrollWidth - track.clientWidth;
      if (maxScroll <= 0) return;

      const atStart = track.scrollLeft <= 4 && delta < 0;
      const atEnd = track.scrollLeft >= maxScroll - 4 && delta > 0;

      // If within horizontal scroll range, scroll horizontally
      if (!atStart && !atEnd) {
        e.preventDefault();
        e.stopPropagation();
        track.scrollLeft += delta * 1.25;
        updateScrollBounds();
      }
    };

    track.addEventListener("wheel", handleWheel, { passive: false });
    track.addEventListener("scroll", updateScrollBounds, { passive: true });
    window.addEventListener("resize", updateScrollBounds);

    const timer = setTimeout(updateScrollBounds, 150);

    return () => {
      track.removeEventListener("wheel", handleWheel);
      track.removeEventListener("scroll", updateScrollBounds);
      window.removeEventListener("resize", updateScrollBounds);
      clearTimeout(timer);
    };
  }, [filteredDrives, updateScrollBounds]);

  // Mouse Drag (Grab & Slide) interaction
  const handleMouseDown = (e) => {
    if (!scrollTrackRef.current || e.button !== 0) return;
    setIsDragging(true);
    hasMovedSignificantly.current = false;
    dragStartX.current = e.pageX;
    dragStartScrollLeft.current = scrollTrackRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !scrollTrackRef.current) return;
    const diff = e.pageX - dragStartX.current;
    if (Math.abs(diff) > 6) {
      hasMovedSignificantly.current = true;
    }
    scrollTrackRef.current.scrollLeft = dragStartScrollLeft.current - diff * 1.4;
    updateScrollBounds();
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleCardClickCapture = (e) => {
    if (hasMovedSignificantly.current) {
      e.stopPropagation();
      e.preventDefault();
      hasMovedSignificantly.current = false;
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollLeft();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollRight();
    }
  };

  return (
    <section
      ref={containerRef}
      className="py-16 md:py-24 bg-[#f4f4f0] border-b border-[#e6e6df] overflow-hidden select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8">
          <div>
            <div className="eyebrow flex items-center space-x-2 mb-2 text-teal-800">
              <Sparkles className="w-3.5 h-3.5 text-teal-700 animate-pulse" />
              <span>DIRECT CLIENT SCHEDULES</span>
            </div>
            <h2 className="editorial-title text-3xl sm:text-4xl md:text-5xl text-[#111318]">
              FEATURED HIRING DRIVES.
            </h2>
            <p className="mt-2 text-sm text-[#6b7280] max-w-xl">
              Curated direct client drives in Hyderabad and Pan-India. Fast-track profile forwarding and 1-on-1 interview mentoring directly with hiring managers.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="mt-6 lg:mt-0 flex items-center space-x-3">
            {/* Scroll Left Button */}
            <button
              type="button"
              onClick={scrollLeft}
              disabled={!canScrollLeftState}
              className={`p-3 rounded-full border transition-all ${
                canScrollLeftState
                  ? "bg-white border-[#e6e6df] hover:border-teal-700 hover:bg-neutral-50 text-[#111318] cursor-pointer hover:scale-105 active:scale-95 shadow-xs"
                  : "bg-white/50 border-[#e6e6df]/50 text-neutral-300 cursor-not-allowed opacity-40"
              }`}
              title="Scroll left to view previous drives"
              aria-label="Scroll drives left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Scroll Right Button */}
            <button
              type="button"
              onClick={scrollRight}
              disabled={!canScrollRightState}
              className={`p-3 rounded-full border transition-all ${
                canScrollRightState
                  ? "bg-teal-800 border-teal-800 hover:bg-teal-700 text-white cursor-pointer hover:scale-105 active:scale-95 shadow-md ring-2 ring-teal-700/20"
                  : "bg-white/50 border-[#e6e6df]/50 text-neutral-300 cursor-not-allowed opacity-40"
              }`}
              title="Scroll right to view next drives"
              aria-label="Scroll drives right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Explore All Drives Link */}
            <Link
              to="/jobs"
              className="inline-flex items-center space-x-2 bg-[#111318] hover:bg-teal-800 text-white text-xs font-semibold px-5 py-3 rounded-xl transition-all shadow-xs ml-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Explore All Drives</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          <div className="flex items-center space-x-1.5 bg-white p-1 rounded-2xl border border-[#e6e6df] shadow-2xs">
            {CATEGORY_FILTERS.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-teal-800 text-white shadow-xs"
                      : "text-neutral-600 hover:text-neutral-900 hover:bg-[#f4f4f0]"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
          <span className="text-[11px] font-mono text-neutral-500 pl-2">
            {filteredDrives.length} Drives Available
          </span>
        </div>

        {/* Dynamic Data Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CardSkeleton count={3} />
          </div>
        ) : filteredDrives.length > 0 ? (
          <div className="relative group/carousel">
            {/* Floating Left Arrow Overlay (Visible when scrollable left) */}
            {canScrollLeftState && (
              <button
                type="button"
                onClick={scrollLeft}
                className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-30 w-12 h-12 items-center justify-center rounded-full bg-white border border-[#e6e6df] text-[#111318] shadow-xl hover:bg-neutral-50 hover:border-teal-700 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                title="Scroll left"
                aria-label="Previous drives"
              >
                <ChevronLeft className="w-5 h-5 text-teal-900" />
              </button>
            )}

            {/* Floating Right Arrow Overlay (Visible when scrollable right) */}
            {canScrollRightState && (
              <button
                type="button"
                onClick={scrollRight}
                className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-30 w-12 h-12 items-center justify-center rounded-full bg-teal-800 text-white shadow-xl hover:bg-teal-700 hover:scale-110 active:scale-95 transition-all cursor-pointer ring-4 ring-teal-800/10"
                title="Scroll right"
                aria-label="Next drives"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            )}

            {/* Horizontal Scroll Track */}
            <div
              ref={scrollTrackRef}
              data-lenis-prevent="true"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              onClickCapture={handleCardClickCapture}
              onKeyDown={handleKeyDown}
              className={`flex space-x-6 overflow-x-auto pb-4 pt-2 scroll-smooth scrollbar-none focus:outline-none transition-colors ${
                isDragging ? "cursor-grabbing" : "cursor-grab"
              }`}
              style={{ scrollBehavior: "smooth", WebkitOverflowScrolling: "touch" }}
              tabIndex={0}
              aria-label="Featured hiring drives horizontal slider. Use left and right arrow keys to navigate."
            >
              {filteredDrives.map((job) => (
                <div
                  key={job.id}
                  className="featured-drive-card w-[320px] sm:w-[380px] flex-shrink-0"
                >
                  <JobCard job={job} />
                </div>
              ))}
            </div>

          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#e6e6df] p-12 text-center max-w-md mx-auto">
            <p className="text-sm font-semibold text-[#111318]">
              No drives match the selected filter.
            </p>
            <p className="text-xs text-[#6b7280] mt-1">
              Select "All Drives" or check all active drives on our job board.
            </p>
            <div className="pt-4 flex items-center justify-center space-x-3">
              <button
                type="button"
                onClick={() => handleCategoryChange("all")}
                className="px-4 py-2 bg-teal-800 text-white rounded-xl text-xs font-bold hover:bg-teal-700"
              >
                Reset Filter
              </button>
              <Link
                to="/jobs"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-teal-800 hover:underline"
              >
                <span>Browse All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
