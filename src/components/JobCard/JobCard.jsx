import { Link } from "react-router-dom";
import { ArrowUpRight, MapPin, Briefcase, IndianRupee, Clock, MessageSquare, Sparkles } from "lucide-react";
import { formatDate } from "../../utils/formatters";

export default function JobCard({ job }) {
  if (!job) return null;

  const targetIdentifier = job.slug || job.id;
  const companyName = typeof job.company === "object" ? job.company?.name : (job.company || "Enterprise Partner");
  const categoryName = typeof job.category === "object" ? job.category?.name : (job.category || "General");
  const salaryDisplay = job.salary_text || job.salary || "Competitive";
  const experienceDisplay = job.experience || "Freshers & Experienced";
  const locationDisplay = job.location || "Hyderabad";
  const workModeDisplay = job.work_mode || job.workMode || "Work From Office";
  const skillsArray = Array.isArray(job.skills) ? job.skills : [];
  const applyUrl = job.application_url || job.applyUrl || `https://wa.me/917780636263?text=Hi%20Contact%20Team,%20I%20am%20interested%20in%20${encodeURIComponent(job.title)}`;

  return (
    <div
      className="group bg-white rounded-2xl border border-[#e6e6df] p-6 flex flex-col justify-between transition-all duration-300 hover:border-teal-700 hover:shadow-lg hover:-translate-y-1 relative"
      data-cursor
      data-cursor-label="VIEW"
    >
      <div>
        {/* Top Header: ID / Badge, Category & Posted date */}
        <div className="flex items-center justify-between text-xs mb-3 text-[#6b7280]">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-[10px] font-semibold text-[#111318] bg-[#f4f4f0] px-2 py-0.5 rounded uppercase">
              {job.id ? String(job.id).slice(0, 8) : "DRIVE"}
            </span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200/50">
              {categoryName}
            </span>
          </div>

          <span className="text-[11px]">{formatDate(job.posted_at || job.postedDate)}</span>
        </div>

        {/* Company and Title */}
        <div className="mt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
              {companyName}
            </span>
            {job.featured && (
              <span className="inline-flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <Sparkles className="w-2.5 h-2.5" />
                <span>Featured Drive</span>
              </span>
            )}
          </div>

          <Link to={`/jobs/${targetIdentifier}`}>
            <h3 className="mt-1.5 text-base sm:text-lg font-bold text-[#111318] group-hover:text-teal-800 transition-colors leading-snug">
              {job.title}
            </h3>
          </Link>
        </div>

        {/* Key Attributes Pills */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-[#4b5563]">
          <div className="flex items-center space-x-1.5 bg-[#fbfbf9] p-2 rounded-lg border border-[#f0f0ea]">
            <IndianRupee className="w-3.5 h-3.5 text-teal-700 flex-shrink-0" />
            <span className="font-semibold text-[#111318] truncate">{salaryDisplay}</span>
          </div>

          <div className="flex items-center space-x-1.5 bg-[#fbfbf9] p-2 rounded-lg border border-[#f0f0ea]">
            <Briefcase className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" />
            <span className="truncate">{experienceDisplay}</span>
          </div>

          <div className="flex items-center space-x-1.5 bg-[#fbfbf9] p-2 rounded-lg border border-[#f0f0ea]">
            <MapPin className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" />
            <span className="truncate">{locationDisplay}</span>
          </div>

          <div className="flex items-center space-x-1.5 bg-[#fbfbf9] p-2 rounded-lg border border-[#f0f0ea]">
            <Clock className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" />
            <span className="truncate">{workModeDisplay}</span>
          </div>
        </div>

        {/* Shift or Process badge */}
        {(job.shifts || job.process_type) && (
          <p className="mt-3 text-[11px] text-[#6b7280] line-clamp-1 italic">
            • {job.shifts || job.process_type}
          </p>
        )}

        {/* Skills Tag cloud */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {skillsArray.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="text-[11px] bg-white border border-[#e6e6df] text-[#4b5563] px-2 py-0.5 rounded-md"
            >
              {skill}
            </span>
          ))}
          {skillsArray.length > 3 && (
            <span className="text-[10px] text-[#9ca3af] self-center">
              +{skillsArray.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Card Action Buttons */}
      <div className="mt-6 pt-4 border-t border-[#f0f0ea] flex items-center justify-between gap-2">
        <a
          href={applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 px-3 py-2 rounded-lg transition-colors"
          title="Direct WhatsApp application"
        >
          <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
          <span>Quick Apply</span>
        </a>

        <Link
          to={`/jobs/${targetIdentifier}`}
          className="inline-flex items-center space-x-1 text-xs font-bold text-[#111318] group-hover:text-teal-800 px-3 py-2 rounded-lg transition-colors"
        >
          <span>View Opportunity</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
