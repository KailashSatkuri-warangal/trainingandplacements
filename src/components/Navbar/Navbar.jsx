import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowRight, Menu, X, PhoneCall, Sparkles } from "lucide-react";
import { SITE_CONFIG } from "../../data/siteContent";
import MobileMenu from "../MobileMenu/MobileMenu";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 25) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Jobs", path: "/jobs" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Admin", path: "/admin" }
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#fbfbf9]/90 backdrop-blur-md border-b border-[#e6e6df] py-3.5 shadow-sm"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <Link
              to="/"
              className="group flex items-center space-x-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 rounded-sm"
              data-cursor
              data-cursor-label="HOME"
            >
              <div className="w-9 h-9 rounded-md bg-[#111318] text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-sm group-hover:bg-teal-700 transition-colors">
                <span className="font-mono text-emerald-400">TP</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold tracking-tight text-base sm:text-lg text-[#111318] uppercase leading-none">
                  Training<span className="text-teal-700 font-extrabold">And</span>Placements
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#6b7280] font-medium mt-0.5">
                  Recruitment & Placement Desk
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-white/70 backdrop-blur-sm border border-[#e6e6df] px-3 py-1.5 rounded-full shadow-xs">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                      isActive
                        ? "bg-[#111318] text-white shadow-xs"
                        : "text-[#4b5563] hover:text-[#111318] hover:bg-black/5"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            {/* Desktop Right CTA */}
            <div className="hidden md:flex items-center space-x-3">
              <a
                href={SITE_CONFIG.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:inline-flex items-center space-x-1.5 text-xs font-semibold text-[#374151] hover:text-teal-700 transition-colors px-3 py-2"
                title="Connect directly with Recruiter Desk on WhatsApp"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Direct Desk: {SITE_CONFIG.directLine}</span>
              </a>

              <Link
                to="/jobs"
                className="group inline-flex items-center space-x-2 bg-[#111318] hover:bg-teal-700 text-white text-xs font-semibold px-5 py-2.5 rounded-full shadow-sm hover:shadow transition-all duration-200 transform hover:-translate-y-0.5"
                data-cursor
                data-cursor-label="JOBS"
              >
                <span>Explore Jobs</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex md:hidden items-center space-x-2">
              <Link
                to="/jobs"
                className="bg-[#111318] text-white text-[11px] font-semibold px-3 py-1.5 rounded-full"
              >
                Jobs
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 rounded-md text-[#111318] hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-teal-700"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Menu Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navLinks={navLinks}
      />
    </>
  );
}
