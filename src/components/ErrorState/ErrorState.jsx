import { AlertCircle, RefreshCw } from "lucide-react";

export default function ErrorState({
  title = "Something went wrong",
  message = "We encountered an issue loading data. Please try again.",
  onRetry
}) {
  return (
    <div className="bg-white rounded-3xl border border-rose-200 p-12 text-center max-w-lg mx-auto my-12 space-y-4 shadow-xs">
      <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
        <AlertCircle className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-bold text-[#111318]">{title}</h3>
      <p className="text-xs sm:text-sm text-[#6b7280]">{message}</p>
      {onRetry && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center space-x-2 bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold px-5 py-3 rounded-xl transition-colors shadow-xs"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      )}
    </div>
  );
}
