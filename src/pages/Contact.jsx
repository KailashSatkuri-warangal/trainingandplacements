import { useSearchParams } from "react-router-dom";
import { MapPin, Phone, Mail, MessageSquare, Clock, ShieldCheck, Sparkles } from "lucide-react";
import ContactForm from "../components/ContactForm/ContactForm";
import { SITE_CONFIG } from "../data/siteContent";

export default function Contact() {
  const [searchParams] = useSearchParams();
  const defaultTypeParam = searchParams.get("type");
  const defaultType = defaultTypeParam === "employer" ? "Employer" : defaultTypeParam === "recruiter" ? "Recruiter" : "Candidate";

  return (
    <div className="pt-28 pb-24 bg-[#fbfbf9] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Hero */}
        <div className="max-w-3xl mb-16">
          <div className="eyebrow flex items-center space-x-2 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-teal-700" />
            <span>DIRECT RECRUITMENT DESK</span>
          </div>
          <h1 className="editorial-title text-4xl sm:text-6xl md:text-7xl text-[#111318]">
            LET'S CONNECT.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#4b5563] leading-relaxed">
            Whether you are looking for your next career move or seeking pre-screened talent for your corporate operations, our recruiter desk is directly reachable.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Details & Office Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-[#e6e6df] p-8 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-[#111318]">
                Contact Information
              </h3>

              <div className="space-y-4 text-sm text-[#4b5563]">
                {/* Location */}
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-800 flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-xs uppercase tracking-wider text-neutral-600 font-bold">Office Location</strong>
                    <span className="text-[#111318] font-medium">{SITE_CONFIG.officeLocation}</span>
                  </div>
                </div>

                {/* Direct Recruiter Line */}
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-800 flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-xs uppercase tracking-wider text-neutral-600 font-bold">Direct Recruiter Line</strong>
                    <a href={`tel:${SITE_CONFIG.directLineRaw}`} className="text-[#111318] font-bold font-mono hover:text-teal-800">
                      {SITE_CONFIG.directLine}
                    </a>
                    <span className="block text-[11px] text-[#6b7280]">{SITE_CONFIG.founder} ({SITE_CONFIG.founderTitle})</span>
                  </div>
                </div>

                {/* Email Desk */}
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-800 flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-xs uppercase tracking-wider text-neutral-600 font-bold">Official Email</strong>
                    <a href={`mailto:${SITE_CONFIG.email}`} className="text-[#111318] font-medium hover:text-teal-800">
                      {SITE_CONFIG.email}
                    </a>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-800 flex-shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-xs uppercase tracking-wider text-neutral-600 font-bold">Desk Hours</strong>
                    <span className="text-[#111318]">{SITE_CONFIG.hours}</span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Action Box */}
              <div className="pt-4 border-t border-[#f0f0ea]">
                <a
                  href={SITE_CONFIG.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3.5 px-4 rounded-xl text-xs transition-colors shadow-xs"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Direct WhatsApp to {SITE_CONFIG.founder}</span>
                </a>
              </div>
            </div>

            {/* Recruiter Guarantee Card */}
            <div className="bg-[#f4f4f0] rounded-2xl border border-[#e6e6df] p-6 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-teal-800 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero Candidate Charge Policy</span>
              </div>
              <p className="text-xs text-[#6b7280] leading-relaxed">
                We never charge candidates for recruitment interviews or screening. All placement assistance for candidate hiring drives is 100% free of charge.
              </p>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-7">
            <ContactForm defaultType={defaultType} />
          </div>
        </div>
      </div>
    </div>
  );
}
