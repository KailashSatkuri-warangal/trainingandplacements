import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Target, Award, Users, CheckCircle2, Phone, MessageSquare } from "lucide-react";
import { SITE_CONFIG, STATS_DATA } from "../data/siteContent";
import Stats from "../components/Stats/Stats";

export default function About() {
  return (
    <div className="pt-28 pb-24 bg-[#fbfbf9] min-h-screen">
      {/* Editorial Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-3xl">
          <div className="eyebrow mb-2">ABOUT TRAININGANDPLACEMENTS</div>
          <h1 className="editorial-title text-4xl sm:text-6xl md:text-7xl text-[#111318]">
            MORE THAN A JOB SEARCH.
          </h1>
          <p className="mt-6 text-base sm:text-xl text-[#4b5563] leading-relaxed">
            We are Hyderabad's dedicated recruitment and placement consultancy bridging the critical divide between ambitious candidates, comprehensive career mentoring, and confirmed Tier-1 corporate hiring pipelines.
          </p>
        </div>
      </section>

      {/* Placement Support Team Feature */}
      <section className="py-16 bg-white border-y border-[#e6e6df] mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 bg-[#fbfbf9] rounded-3xl border border-[#e6e6df] p-8 sm:p-10 text-center relative overflow-hidden">
              <div className="w-24 h-24 rounded-full bg-teal-800 text-white font-bold text-xl flex items-center justify-center mx-auto mb-6 shadow-md">
                <Users className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-[#111318]">{SITE_CONFIG.founder}</h3>
              <p className="text-xs font-bold uppercase tracking-widest text-teal-800 mt-1">
                {SITE_CONFIG.founderTitle}
              </p>
              <p className="text-xs text-[#6b7280] mt-3 leading-relaxed">
                Spearheading candidate talent pipelines and direct recruiter alignments across Hyderabad and Pan-India since {SITE_CONFIG.establishedYear}.
              </p>

              <div className="mt-6 pt-6 border-t border-[#e6e6df] space-y-2 text-xs">
                <div className="flex items-center justify-center space-x-2 text-neutral-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>300+ Verified Candidate Closures</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-neutral-700">
                  <Phone className="w-4 h-4 text-teal-700" />
                  <span>Direct Hotline: {SITE_CONFIG.directLine}</span>
                </div>
              </div>

              <div className="mt-6">
                <a
                  href={SITE_CONFIG.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-4 rounded-xl text-xs transition-colors shadow-xs"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat on WhatsApp Directly</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="eyebrow">WHO WE ARE</div>
              <h2 className="editorial-title text-3xl sm:text-4xl text-[#111318]">
                A PERSONALIZED APPROACH TO CORPORATE PLACEMENT.
              </h2>
              <p className="text-sm sm:text-base text-[#4b5563] leading-relaxed">
                Founded with a straightforward mission: eliminate the confusion and anxiety job-seekers face when navigating automated job boards. Instead of sending resumes into a void, TrainingAndPlacements operates direct screening partnerships with 15+ Fortune 500 & Tier-1 global employers.
              </p>
              <p className="text-sm sm:text-base text-[#4b5563] leading-relaxed">
                Under the direct guidance of our dedicated Contact Team, candidates receive honest assessment, targeted mock interview simulations, and verified interview slots—allowing freshers and experienced professionals alike to secure genuine career offers in record time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Bento */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl border border-[#e6e6df] p-8 sm:p-10 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-[#111318] mb-3">Our Mission</h3>
            <p className="text-sm text-[#4b5563] leading-relaxed">
              To democratize direct access to Tier-1 multinational employment for candidates from all educational backgrounds by providing transparent screening, comprehensive interview coaching, and zero-fee placement assistance.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#e6e6df] p-8 sm:p-10 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center mb-6">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-[#111318] mb-3">Our Vision</h3>
            <p className="text-sm text-[#4b5563] leading-relaxed">
              To be the most trustworthy recruitment and corporate staffing partner in South India, celebrated for ethical practices, verified candidate placements, and seamless corporate hiring fulfillment.
            </p>
          </div>
        </div>
      </section>

      {/* Candidate vs Employer Support */}
      <section className="py-20 bg-white border-y border-[#e6e6df] mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="eyebrow mb-2">THE DUAL ECOSYSTEM</p>
            <h2 className="editorial-title text-3xl sm:text-4xl text-[#111318]">
              EMPOWERING BOTH SIDES OF HIRING.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For Candidates */}
            <div className="bg-[#fbfbf9] rounded-3xl border border-[#e6e6df] p-8 sm:p-10 space-y-6">
              <div className="flex items-center space-x-3">
                <span className="p-2.5 rounded-xl bg-[#111318] text-white">
                  <Users className="w-5 h-5" />
                </span>
                <h3 className="text-xl font-bold text-[#111318]">For Candidates</h3>
              </div>
              <ul className="space-y-3.5 text-sm text-[#4b5563]">
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>100% Free placement assistance with zero candidate charges</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>1-on-1 mock question practice and communication polishing</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Direct client interview slot allocation with client HR managers</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Daily walk-in drives and virtual hiring updates</span>
                </li>
              </ul>
            </div>

            {/* For Employers */}
            <div className="bg-[#fbfbf9] rounded-3xl border border-[#e6e6df] p-8 sm:p-10 space-y-6">
              <div className="flex items-center space-x-3">
                <span className="p-2.5 rounded-xl bg-teal-800 text-white">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <h3 className="text-xl font-bold text-[#111318]">For Employers & Recruiters</h3>
              </div>
              <ul className="space-y-3.5 text-sm text-[#4b5563]">
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-teal-700 flex-shrink-0 mt-0.5" />
                  <span>Pre-screened candidates assessed on communication & technical fit</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-teal-700 flex-shrink-0 mt-0.5" />
                  <span>24–48h fast-track turnaround for bulk campus & lateral requirements</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-teal-700 flex-shrink-0 mt-0.5" />
                  <span>Specialized talent pipelines in US Healthcare RCM, IT, and Non-Voice</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-teal-700 flex-shrink-0 mt-0.5" />
                  <span>Transparent B2B staffing agreements with dedicated account leads</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Stats Section */}
      <Stats />

      {/* Final Action Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 text-center">
        <h2 className="editorial-title text-3xl sm:text-5xl text-[#111318] mb-4">
          CONNECT WITH OUR DESK TODAY.
        </h2>
        <p className="text-sm sm:text-base text-[#4b5563] max-w-xl mx-auto mb-8">
          Reach out to explore current hiring drive schedules or discuss recruitment partnerships.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/jobs"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#111318] hover:bg-teal-800 text-white font-semibold px-8 py-4 rounded-xl text-sm transition-all shadow-md"
          >
            <span>Explore Open Drives</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white hover:bg-[#f4f4f0] text-[#111318] border border-[#d1d5db] font-semibold px-8 py-4 rounded-xl text-sm transition-all shadow-xs"
          >
            <span>Contact Desk</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
