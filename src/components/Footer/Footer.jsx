import { Link } from "react-router-dom";
import { ArrowUpRight, MessageSquare, Phone, MapPin, Mail, ShieldCheck } from "lucide-react";
import { SITE_CONFIG } from "../../data/siteContent";

export default function Footer() {
  return (
    <footer className="bg-[#090b0e] text-neutral-400 border-t border-neutral-800 relative overflow-hidden pt-20 pb-12 select-none">
      {/* Huge subtle faded watermark typography in background */}
      <div
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[11vw] font-display font-extrabold text-white/[0.02] tracking-tighter whitespace-nowrap pointer-events-none select-none"
        aria-hidden="true"
      >
        TRAININGANDPLACEMENTS
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-neutral-800/80">
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-5">
            <Link to="/" className="flex items-center space-x-3 text-white">
              <div className="w-8 h-8 rounded bg-emerald-500 text-black flex items-center justify-center font-bold text-xs">
                TP
              </div>
              <span className="font-bold tracking-tight text-lg text-white uppercase">
                TrainingAndPlacements
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-sm">
              Hyderabad's dedicated training and placement consultancy connecting freshers and experienced candidates directly to Tier-1 MNC hiring drives and US Healthcare ITES pipelines.
            </p>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Executive Leadership</span>
              </div>
              <p className="text-sm font-bold text-white">{SITE_CONFIG.founder}</p>
              <p className="text-xs text-neutral-400">
                {SITE_CONFIG.founderTitle} • 300+ Verified Closures Since {SITE_CONFIG.establishedYear}
              </p>
              <div className="pt-2">
                <a
                  href={`tel:${SITE_CONFIG.directLineRaw}`}
                  className="text-xs font-mono text-emerald-400 hover:underline flex items-center space-x-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Direct Recruiter Line: {SITE_CONFIG.directLine}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold tracking-widest uppercase text-white">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="hover:text-white transition-colors">
                  All Hiring Drives
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Our Desk
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact & Location
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-emerald-400 text-neutral-300 font-semibold transition-colors inline-flex items-center space-x-1.5">
                  <span>Recruiter Admin Portal</span>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono">Postgres</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Hiring Streams */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold tracking-widest uppercase text-white">
              Hiring Streams
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/jobs?category=IT %26 Engineering" className="hover:text-white transition-colors">
                  IT & Software Engineering
                </Link>
              </li>
              <li>
                <Link to="/jobs?category=Medical %26 Healthcare RCM" className="hover:text-white transition-colors">
                  Medical & US Healthcare RCM
                </Link>
              </li>
              <li>
                <Link to="/jobs?category=Medical %26 Healthcare RCM" className="hover:text-white transition-colors">
                  Medical Billing & AR Caller
                </Link>
              </li>
              <li>
                <Link to="/jobs?category=Non-IT / Operations" className="hover:text-white transition-colors">
                  Non-IT / BPO Operations
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Mock Interview Mentoring
                </Link>
              </li>
              <li>
                <Link to="/contact?type=employer" className="hover:text-white transition-colors">
                  B2B Corporate Staffing
                </Link>
              </li>
            </ul>
          </div>

          {/* Recruiter & Contact Desk */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold tracking-widest uppercase text-white">
              Contact & Recruiter Desk
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{SITE_CONFIG.officeLocation}</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <a href={`tel:${SITE_CONFIG.directLineRaw}`} className="hover:text-white font-mono">
                  {SITE_CONFIG.directLine}
                </a>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-white">
                  {SITE_CONFIG.email}
                </a>
              </div>

              <div className="pt-2">
                <a
                  href={SITE_CONFIG.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat with {SITE_CONFIG.founder}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-300 gap-4">
          <p>© 2026 TrainingAndPlacements. All rights reserved.</p>

          <div className="flex items-center space-x-6">
            <span>B2B Corporate Staffing</span>
            <span>•</span>
            <span>Verified Placements</span>
            <span>•</span>
            <span>Hyderabad, India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
