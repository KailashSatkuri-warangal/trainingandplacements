import { Search, X, Filter, RotateCcw } from "lucide-react";
import { CATEGORIES_LIST, WORK_MODES, EXPERIENCE_LEVELS } from "../../data/jobs";

export default function JobFilters({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedWorkMode,
  setSelectedWorkMode,
  selectedExperience,
  setSelectedExperience,
  sortBy,
  setSortBy,
  filteredCount,
  totalCount,
  clearFilters,
  isFiltered
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#e6e6df] p-6 shadow-sm mb-10">
      {/* Search Input Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by role, company (e.g. Capgemini, Teleperformance, R1 RCM), skill, or location..."
          className="w-full pl-12 pr-10 py-3.5 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl text-sm text-[#111318] placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-[#111318]"
            aria-label="Clear search query"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="mb-6">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6b7280] mb-2.5">
          Filter by Hiring Stream
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES_LIST.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  isSelected
                    ? "bg-[#111318] text-white shadow-xs"
                    : "bg-[#fbfbf9] border border-[#e6e6df] text-[#4b5563] hover:text-[#111318] hover:border-neutral-400"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary Filter Row: Work Mode, Experience, Sort & Clear */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-[#f0f0ea]">
        {/* Work Mode */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6b7280] mb-1.5">
            Work Mode
          </label>
          <select
            value={selectedWorkMode}
            onChange={(e) => setSelectedWorkMode(e.target.value)}
            className="w-full bg-[#fbfbf9] border border-[#e6e6df] rounded-xl px-3 py-2 text-xs text-[#111318] focus:outline-none focus:ring-1 focus:ring-teal-700"
          >
            {WORK_MODES.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
        </div>

        {/* Experience Level */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6b7280] mb-1.5">
            Experience Level
          </label>
          <select
            value={selectedExperience}
            onChange={(e) => setSelectedExperience(e.target.value)}
            className="w-full bg-[#fbfbf9] border border-[#e6e6df] rounded-xl px-3 py-2 text-xs text-[#111318] focus:outline-none focus:ring-1 focus:ring-teal-700"
          >
            {EXPERIENCE_LEVELS.map((exp) => (
              <option key={exp} value={exp}>
                {exp}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6b7280] mb-1.5">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-[#fbfbf9] border border-[#e6e6df] rounded-xl px-3 py-2 text-xs text-[#111318] focus:outline-none focus:ring-1 focus:ring-teal-700"
          >
            <option value="newest">Recently Posted</option>
            <option value="salary-high">Salary: High to Low</option>
            <option value="salary-low">Salary: Low to High</option>
            <option value="company">Company (A to Z)</option>
          </select>
        </div>

        {/* Clear Filters / Counter summary */}
        <div className="flex items-end justify-between sm:justify-end gap-2">
          {isFiltered && (
            <button
              onClick={clearFilters}
              type="button"
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          <div className="text-right">
            <span className="text-[11px] text-[#6b7280]">
              Showing <strong className="text-[#111318]">{filteredCount}</strong> of {totalCount} drives
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
