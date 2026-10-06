import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="pt-32 pb-24 bg-[#fbfbf9] min-h-[80vh] flex items-center justify-center">
      <div className="max-w-xl mx-auto px-4 text-center">
        <span className="text-7xl sm:text-9xl font-display font-extrabold text-neutral-300 tracking-tighter">
          404
        </span>
        <h1 className="editorial-title text-3xl sm:text-4xl text-[#111318] mt-2 mb-3">
          PAGE NOT FOUND.
        </h1>
        <p className="text-sm sm:text-base text-[#4b5563] max-w-md mx-auto mb-8">
          The opportunity or page you are looking for doesn't exist, has been removed, or has completed its screening allocation.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#111318] hover:bg-teal-800 text-white text-xs font-semibold px-6 py-3.5 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>

          <Link
            to="/jobs"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white hover:bg-[#f4f4f0] text-[#111318] border border-[#d1d5db] text-xs font-semibold px-6 py-3.5 rounded-xl transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Explore Jobs</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
