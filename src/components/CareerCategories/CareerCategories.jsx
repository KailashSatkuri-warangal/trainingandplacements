import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Code, PhoneForwarded, HeartPulse, GraduationCap } from "lucide-react";
import { categoryService } from "../../services/categoryService";
import { CATEGORIES_DATA } from "../../data/categories";

const ICONS = {
  "it-engineering": Code,
  "non-it-operations": PhoneForwarded,
  "medical-healthcare-rcm": HeartPulse,
  "mock-interview-prep": GraduationCap
};

export default function CareerCategories() {
  const [categories, setCategories] = useState(CATEGORIES_DATA);

  useEffect(() => {
    let isMounted = true;
    categoryService.getActiveCategories().then((data) => {
      if (isMounted && data && data.length > 0) {
        setCategories(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-20 md:py-28 bg-[#fbfbf9] border-b border-[#e6e6df]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
          <div className="max-w-2xl">
            <p className="eyebrow mb-2">HIRING STREAMS</p>
            <h2 className="editorial-title text-3xl sm:text-4xl md:text-5xl text-[#111318]">
              OPPORTUNITIES FOR EVERY CAREER PATH.
            </h2>
          </div>
          <p className="mt-4 md:mt-0 text-sm text-[#6b7280] max-w-md">
            Directly mapped recruitment pipelines matching fresh graduates and seasoned experts to vetted corporate mandates.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat, index) => {
            const Icon = ICONS[cat.slug || cat.id] || Code;
            const isLarge = index === 0 || index === 1;
            const driveCount = cat.publishedCount !== undefined ? `${cat.publishedCount} Active Drives` : (cat.count ? `${cat.count} Drives` : "Direct");

            return (
              <Link
                key={cat.id || cat.slug}
                to={`/jobs?category=${encodeURIComponent(cat.id || cat.name)}`}
                className={`group relative bg-white rounded-2xl border border-[#e6e6df] p-7 flex flex-col justify-between transition-all duration-300 hover:border-teal-700 hover:shadow-lg hover:-translate-y-1 ${
                  isLarge ? "md:col-span-2" : "md:col-span-1 lg:col-span-2"
                }`}
                data-cursor
                data-cursor-label="EXPLORE"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-800 group-hover:bg-teal-700 group-hover:text-white transition-colors duration-200">
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-semibold px-2.5 py-1 bg-[#f4f4f0] rounded-full text-[#4b5563]">
                        {driveCount}
                      </span>
                      <div className="w-8 h-8 rounded-full border border-[#e6e6df] flex items-center justify-center group-hover:border-teal-700 group-hover:bg-teal-700 group-hover:text-white transition-colors">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-[#111318] group-hover:text-teal-800 transition-colors">
                    {cat.name}
                  </h3>

                  <p className="mt-2.5 text-xs sm:text-sm text-[#6b7280] leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                {cat.roles && (
                  <div className="mt-8 pt-4 border-t border-[#f0f0ea]">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                      Key Roles & Disciplines
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.roles.map((role, rIndex) => (
                        <span
                          key={rIndex}
                          className="text-[11px] bg-[#fbfbf9] text-[#374151] border border-[#e6e6df] px-2.5 py-1 rounded-md"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
