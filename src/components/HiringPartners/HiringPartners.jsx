import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { companyService } from "../../services/companyService";
import { HIRING_PARTNERS } from "../../data/companies";

export default function HiringPartners() {
  const [companies, setCompanies] = useState(HIRING_PARTNERS);

  useEffect(() => {
    let isMounted = true;
    companyService.getActiveCompanies().then((data) => {
      if (isMounted && data && data.length > 0) {
        setCompanies(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-20 md:py-28 bg-[#fbfbf9] border-b border-[#e6e6df] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 pb-6 border-b border-[#e6e6df]">
          <div className="max-w-2xl">
            <div className="eyebrow flex items-center space-x-2 mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
              <span>OFFICIAL HIRING PARTNERS</span>
            </div>
            <h2 className="editorial-title text-3xl sm:text-4xl md:text-5xl text-[#111318]">
              TRUSTED BY TIER-1 GLOBAL EMPLOYERS.
            </h2>
          </div>

          <p className="mt-4 md:mt-0 text-xs sm:text-sm text-[#6b7280] max-w-md">
            Direct client drives and exclusive screening schedules for Fortune 500 & global enterprise organizations across Hyderabad & Pan-India.
          </p>
        </div>

        {/* Company Logos Editorial Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {companies.map((partner) => (
            <div
              key={partner.id || partner.name}
              className="group bg-white rounded-xl border border-[#e6e6df] p-5 flex flex-col justify-between items-center text-center min-h-[130px] transition-all duration-300 hover:border-teal-700/60 hover:shadow-md hover:-translate-y-1"
              data-cursor
              data-cursor-label="PARTNER"
            >
              <div className="w-full flex justify-end">
                <span className="text-[10px] text-neutral-600 group-hover:text-teal-700 font-mono transition-colors">
                  {partner.openings || "Active"}
                </span>
              </div>

              <div className="my-auto">
                {partner.logo_url ? (
                  <img
                    src={partner.logo_url}
                    alt={partner.name}
                    className="h-8 max-w-[100px] object-contain mx-auto filter grayscale group-hover:grayscale-0 transition-all"
                  />
                ) : (
                  <span className="font-display font-black text-base sm:text-lg tracking-tight text-neutral-700 group-hover:text-[#111318] transition-colors filter grayscale group-hover:grayscale-0">
                    {partner.logoText || partner.name}
                  </span>
                )}
                <p className="text-[10px] text-[#6b7280] mt-1 font-medium line-clamp-1">
                  {partner.industry || partner.sector || "Enterprise Partner"}
                </p>
              </div>

              <div className="w-full pt-2 border-t border-[#f0f0ea] flex items-center justify-between text-[10px] text-[#6b7280] group-hover:text-teal-700">
                <span className="truncate">{partner.type || partner.location || "Hyderabad"}</span>
                <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner callout */}
        <div className="mt-12 bg-white rounded-2xl border border-[#e6e6df] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center font-bold text-lg font-mono">
              15+
            </div>
            <div>
              <h4 className="font-bold text-sm sm:text-base text-[#111318]">
                Are you looking for qualified candidates for your company?
              </h4>
              <p className="text-xs text-[#6b7280] mt-0.5">
                We provide pre-screened freshers and experienced professionals in IT, Healthcare RCM, and Operations.
              </p>
            </div>
          </div>

          <Link
            to="/contact?type=employer"
            className="whitespace-nowrap inline-flex items-center space-x-2 bg-[#111318] hover:bg-teal-800 text-white text-xs font-semibold px-5 py-3 rounded-xl transition-colors shadow-xs"
          >
            <span>Partner With Our Recruiter Desk</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
