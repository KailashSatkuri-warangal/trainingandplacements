import { Link } from "react-router-dom";
import { ArrowRight, Phone, MessageSquare, Building2, CheckCircle2 } from "lucide-react";
import { SITE_CONFIG } from "../../data/siteContent";

export default function RecruiterCTA() {
  return (
    <section className="py-20 md:py-28 bg-[#111318] text-white relative overflow-hidden">
      {/* Background glow & subtle grid */}
      <div className="absolute inset-0 bg-grid-subtle opacity-10 pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-emerald-400 text-xs font-semibold tracking-wider uppercase mb-4">
              <Building2 className="w-3.5 h-3.5" />
              <span>B2B Staffing & Corporate Hiring</span>
            </div>

            <h2 className="editorial-title text-3xl sm:text-5xl md:text-6xl text-white">
              HIRING TOP TALENT FOR YOUR TEAMS?
            </h2>

            <p className="mt-6 text-base sm:text-lg text-neutral-300 max-w-2xl leading-relaxed">
              We partner with Tier-1 IT companies, US Healthcare operations, and BPO conglomerates to supply job-ready, thoroughly vetted candidates with verified skills.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
              <div className="flex items-center space-x-2 text-xs text-neutral-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Pre-Screened Candidates</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-neutral-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Zero Initial Retainer</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-neutral-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>24–48h Slot Turnaround</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col space-y-3.5 sm:space-y-4">
            <Link
              to="/contact?type=employer"
              className="inline-flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-[#0d0f14] font-bold px-7 py-4 rounded-xl text-sm transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg"
              data-cursor
              data-cursor-label="HIRE"
            >
              <span>Hire Talent With Us</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={SITE_CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold px-6 py-4 rounded-xl text-sm transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Chat on WhatsApp Recruiter Desk</span>
            </a>

            <div className="text-center pt-2">
              <span className="text-xs text-neutral-400 font-mono">
                Direct Recruiter Line: {SITE_CONFIG.directLine}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
