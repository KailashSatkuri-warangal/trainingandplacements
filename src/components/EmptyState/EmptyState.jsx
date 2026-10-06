import { Briefcase, RotateCcw } from "lucide-react";

export default function EmptyState({
  title = "No opportunities found",
  message = "Try adjusting your search criteria or resetting filters.",
  onReset
}) {
  return (
    <div className="bg-white rounded-3xl border border-[#e6e6df] p-12 text-center max-w-lg mx-auto my-12 space-y-4 shadow-xs">
      <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
        <Briefcase className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-bold text-[#111318]">{title}</h3>
      <p className="text-xs sm:text-sm text-[#6b7280]">{message}</p>
      {onReset && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center space-x-2 bg-[#111318] hover:bg-teal-800 text-white text-xs font-semibold px-5 py-3 rounded-xl transition-colors shadow-xs"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </div>
  );
}
