import { Link, NavLink } from "react-router-dom";
import { X, ArrowRight, Phone, MessageSquare, ShieldCheck, MapPin } from "lucide-react";
import { SITE_CONFIG } from "../../data/siteContent";

export default function MobileMenu({ isOpen, onClose, navLinks }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-[#0d0f14] text-white flex flex-col justify-between px-6 py-8 overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-5">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-md bg-white text-[#111318] flex items-center justify-center font-bold text-xs">
            TP
          </div>
          <span className="font-bold tracking-tight text-sm uppercase">
            TrainingAndPlacements
          </span>
        </div>

        <button
          onClick={onClose}
          type="button"
          className="p-2 rounded-full text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close menu"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Vertical Navigation Links */}
      <nav className="my-auto py-10 space-y-6">
        <p className="eyebrow text-emerald-400">Navigation</p>
        <div className="flex flex-col space-y-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={onClose}
              className={({ isActive }) =>
                `text-3xl font-bold tracking-tight transition-colors flex items-center justify-between ${
                  isActive ? "text-emerald-400" : "text-neutral-200 hover:text-white"
                }`
              }
            >
              <span>{link.name}</span>
              <ArrowRight className="w-5 h-5 opacity-40" />
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Recruiter & WhatsApp Direct Link */}
      <div className="space-y-4 border-t border-white/10 pt-6">
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-2">
          <div className="flex items-center space-x-2 text-xs text-emerald-400 font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Direct Recruiter Desk</span>
          </div>
          <p className="text-sm font-medium text-white">{SITE_CONFIG.founder} ({SITE_CONFIG.founderTitle})</p>
          <p className="text-xs text-neutral-400 flex items-center space-x-1.5">
            <MapPin className="w-3.5 h-3.5 text-neutral-500" />
            <span>Hyderabad, Telangana • Direct Line: {SITE_CONFIG.directLine}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2 pt-2">
          <a
            href={SITE_CONFIG.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat on WhatsApp Directly</span>
          </a>

          <Link
            to="/jobs"
            onClick={onClose}
            className="w-full flex items-center justify-center space-x-2 bg-white text-[#111318] hover:bg-neutral-100 font-semibold py-3 px-4 rounded-xl text-sm transition-colors"
          >
            <span>Explore All Hiring Drives</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
