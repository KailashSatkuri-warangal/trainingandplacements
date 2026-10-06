import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Sparkles,
  Search,
  X,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Filter,
  AlertCircle
} from "lucide-react";
import JobCard from "../components/JobCard/JobCard";
import CardSkeleton from "../components/Loading/CardSkeleton";
import EmptyState from "../components/EmptyState/EmptyState";
import { useDrives } from "../hooks/useDrives";
import { useCategories } from "../hooks/useCategories";

const WORK_MODES = [
  "All Work Modes",
  "Work From Office",
  "Hybrid",
  "Work From Home"
];

const EXPERIENCE_LEVELS = [
  "All Experience",
  "Freshers",
  "0 - 1 Years",
  "1 - 3 Years",
  "3+ Years"
];

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All Drives";

  const { categories } = useCategories();
  const [searchInput, setSearchInput] = useState("");

  const {
    drives,
    total,
    page,
    setPage,
    totalPages,
    isLoading,
    error,
    filters,
    updateFilters,
    clearFilters
  } = useDrives({
    category: initialCategory,
    limit: 12
  });

  // Keep search input in sync if filters cleared
  useEffect(() => {
    if (!filters.search) {
      setSearchInput("");
    }
  }, [filters.search]);

  // Sync category with URL parameters
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat && cat !== filters.category) {
      updateFilters({ category: cat });
    }
  }, [searchParams]);

  // Debounced search handling
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== filters.search) {
        updateFilters({ search: searchInput });
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [searchInput]);

  const handleCategorySelect = (categoryName) => {
    updateFilters({ category: categoryName });
    if (categoryName === "All Drives") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", categoryName);
    }
    setSearchParams(searchParams);
  };

  const handleResetAll = () => {
    setSearchInput("");
    searchParams.delete("category");
    setSearchParams(searchParams);
    clearFilters();
  };

  const isFiltered =
    Boolean(searchInput.trim()) ||
    (filters.category && filters.category !== "All Drives") ||
    (filters.workMode && filters.workMode !== "All Work Modes") ||
    (filters.experience && filters.experience !== "All Experience") ||
    filters.sortBy !== "newest";

  // Build category list: "All Drives" followed by active categories from DB
  const categoryNames = [
    "All Drives",
    ...categories.map((c) => c.name)
  ];

  return (
    <div className="pt-28 pb-24 bg-[#fbfbf9] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Editorial Header */}
        <div className="max-w-3xl mb-10">
          <div className="eyebrow flex items-center space-x-2 mb-2 text-teal-800">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ACTIVE CLIENT HIRING DRIVES</span>
          </div>
          <h1 className="editorial-title text-3xl sm:text-4xl md:text-5xl text-[#111318]">
            FIND YOUR NEXT OPPORTUNITY.
          </h1>
          <p className="mt-4 text-xs sm:text-sm text-[#4b5563] leading-relaxed">
            Direct client interview schedules, virtual drives, and walk-in allocations across Hyderabad and Pan-India. Every drive is 100% verified with direct mentor support.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl border border-[#e6e6df] p-5 sm:p-6 shadow-xs mb-10">
          {/* Search Input Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by role, company (e.g. Capgemini, Teleperformance, R1 RCM), skill, or location..."
              className="w-full pl-12 pr-10 py-3 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl text-xs sm:text-sm text-[#111318] placeholder-neutral-400 focus:outline-hidden focus:border-teal-700 transition-all"
            />
            {searchInput && (
              <button
                onClick={() => {
                  setSearchInput("");
                  updateFilters({ search: "" });
                }}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-[#111318]"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Hiring Stream Filter Pills */}
          <div className="mb-6">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6b7280] mb-2.5">
              Filter by Hiring Stream
            </label>
            <div className="flex flex-wrap gap-2">
              {categoryNames.map((catName) => {
                const isSelected =
                  (filters.category === catName) ||
                  (!filters.category && catName === "All Drives");
                return (
                  <button
                    key={catName}
                    type="button"
                    onClick={() => handleCategorySelect(catName)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                      isSelected
                        ? "bg-[#111318] text-white shadow-xs"
                        : "bg-[#fbfbf9] border border-[#e6e6df] text-[#4b5563] hover:text-[#111318] hover:border-neutral-400"
                    }`}
                  >
                    {catName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Secondary Controls: Work Mode, Experience, Sort & Reset */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-[#f0f0ea]">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6b7280] mb-1.5">
                Work Mode
              </label>
              <select
                value={filters.workMode || "All Work Modes"}
                onChange={(e) => updateFilters({ workMode: e.target.value })}
                className="w-full bg-[#fbfbf9] border border-[#e6e6df] rounded-xl px-3 py-2 text-xs text-[#111318] focus:outline-hidden focus:border-teal-700"
              >
                {WORK_MODES.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6b7280] mb-1.5">
                Experience Level
              </label>
              <select
                value={filters.experience || "All Experience"}
                onChange={(e) => updateFilters({ experience: e.target.value })}
                className="w-full bg-[#fbfbf9] border border-[#e6e6df] rounded-xl px-3 py-2 text-xs text-[#111318] focus:outline-hidden focus:border-teal-700"
              >
                {EXPERIENCE_LEVELS.map((exp) => (
                  <option key={exp} value={exp}>
                    {exp}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6b7280] mb-1.5">
                Sort By
              </label>
              <select
                value={filters.sortBy || "newest"}
                onChange={(e) => updateFilters({ sortBy: e.target.value })}
                className="w-full bg-[#fbfbf9] border border-[#e6e6df] rounded-xl px-3 py-2 text-xs text-[#111318] focus:outline-hidden focus:border-teal-700"
              >
                <option value="newest">Recently Posted</option>
                <option value="salary-high">Salary: High to Low</option>
                <option value="salary-low">Salary: Low to High</option>
                <option value="company">Company (A to Z)</option>
              </select>
            </div>

            <div className="flex items-end justify-between sm:justify-end gap-2">
              {isFiltered && (
                <button
                  onClick={handleResetAll}
                  type="button"
                  className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}

              <div className="text-right">
                <span className="text-[11px] text-[#6b7280]">
                  Found <strong className="text-[#111318]">{total}</strong> active drives
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Drives Grid or Skeleton or Empty */}
        {error ? (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center text-rose-800 text-xs">
            <AlertCircle className="w-6 h-6 mx-auto mb-2 text-rose-600" />
            <p className="font-semibold">Unable to load hiring drives</p>
            <p className="mt-1 text-rose-600">{error}</p>
            <button
              onClick={handleResetAll}
              className="mt-3 px-4 py-1.5 bg-rose-800 text-white rounded-lg text-xs font-bold"
            >
              Reset Filters & Try Again
            </button>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardSkeleton count={6} />
          </div>
        ) : drives.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drives.map((drive) => (
                <JobCard key={drive.id} job={drive} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-between border-t border-[#e6e6df] pt-6">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => {
                    setPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 350, behavior: "smooth" });
                  }}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-700 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center space-x-1 text-xs text-neutral-500 font-mono">
                  <span>Page</span>
                  <span className="font-bold text-neutral-900 bg-white px-2.5 py-1 rounded-lg border border-neutral-200">
                    {page}
                  </span>
                  <span>of {totalPages}</span>
                </div>

                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => {
                    setPage((p) => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 350, behavior: "smooth" });
                  }}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-700 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            title="No matching opportunities found"
            message="We couldn't find any drives matching your selected search query or filters. Try adjusting your parameters or resetting filters."
            onReset={handleResetAll}
          />
        )}
      </div>
    </div>
  );
}
