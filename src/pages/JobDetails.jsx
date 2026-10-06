import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Share2,
  Bookmark,
  CheckCircle2,
  Clock,
  MapPin,
  IndianRupee,
  Briefcase,
  ShieldCheck,
  Building2,
  MessageSquare,
  Sparkles,
  Check,
  Eye,
  Send,
  Upload,
  FileText,
  AlertCircle
} from "lucide-react";
import { driveService } from "../services/driveService";
import { applicationService } from "../services/applicationService";
import { storageService } from "../services/storageService";
import { useNotifications } from "../context/NotificationContext";
import { formatDate } from "../utils/formatters";

export default function JobDetails() {
  const { slug } = useParams();
  const { triggerNotification } = useNotifications();
  const [drive, setDrive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  // Application Modal state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [submittingApp, setSubmittingApp] = useState(false);
  const [appSuccess, setAppSuccess] = useState(false);
  const [appError, setAppError] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);

  const [candidateForm, setCandidateForm] = useState({
    candidateName: "",
    email: "",
    phone: "",
    coverLetter: ""
  });

  // Fetch Drive by Slug / ID
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function loadDrive() {
      try {
        const data = await driveService.getDriveBySlug(slug);
        if (isMounted) {
          setDrive(data);
          if (data?.slug) {
            driveService.incrementViews(data.slug);
          }
        }
      } catch (err) {
        console.error("Error loading drive:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (slug) {
      loadDrive();
    }

    // Check saved state in localStorage
    try {
      const savedList = JSON.parse(localStorage.getItem("tp_saved_drives") || "[]");
      setSaved(savedList.includes(slug));
    } catch (e) {}

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // SEO Schema Injection
  useEffect(() => {
    if (!drive) return;

    const companyName = drive.company?.name || drive.company || "Enterprise Partner";
    document.title = `${drive.title} at ${companyName} — TrainingAndPlacements`;

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify({
      "@context": "https://schema.org/",
      "@type": "JobPosting",
      title: drive.title,
      description: drive.description,
      identifier: {
        "@type": "PropertyValue",
        name: "TrainingAndPlacements",
        value: drive.id || drive.slug
      },
      datePosted: drive.posted_at || new Date().toISOString(),
      hiringOrganization: {
        "@type": "Organization",
        name: companyName,
        sameAs: "https://trainingandplacements.com"
      },
      jobLocation: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressLocality: drive.location || "Hyderabad",
          addressCountry: "IN"
        }
      },
      employmentType: "FULL_TIME",
      baseSalary: {
        "@type": "MonetaryAmount",
        currency: "INR",
        value: {
          "@type": "QuantitativeValue",
          value: drive.salary_min || 250000,
          unitText: "YEAR"
        }
      }
    });

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      document.title = "TrainingAndPlacements — Placement Drives & Training";
    };
  }, [drive]);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${drive.title} — TrainingAndPlacements`,
          url: window.location.href
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleToggleSave = () => {
    try {
      const savedList = JSON.parse(localStorage.getItem("tp_saved_drives") || "[]");
      let nextList;
      if (saved) {
        nextList = savedList.filter((s) => s !== slug);
        setSaved(false);
      } else {
        nextList = [...savedList, slug];
        setSaved(true);
      }
      localStorage.setItem("tp_saved_drives", JSON.stringify(nextList));
    } catch (e) {}
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    setAppError(null);

    if (!candidateForm.candidateName.trim() || !candidateForm.email.trim() || !candidateForm.phone.trim()) {
      setAppError("Please fill in your name, email, and mobile number.");
      return;
    }

    setSubmittingApp(true);
    try {
      let resumeUrl = null;
      if (resumeFile) {
        try {
          resumeUrl = await storageService.uploadResume(resumeFile);
        } catch (storageErr) {
          console.warn("Storage upload fallback note:", storageErr);
          resumeUrl = `local://resumes/${resumeFile.name}`;
        }
      }

      await applicationService.submitApplication({
        driveId: drive.id,
        candidateName: candidateForm.candidateName,
        email: candidateForm.email,
        phone: candidateForm.phone,
        resumeUrl: resumeUrl,
        coverLetter: candidateForm.coverLetter
      });

      // Dispatch real-time phone push notification
      try {
        triggerNotification({
          type: "application",
          title: "New Candidate Application",
          subtitle: `${candidateForm.candidateName} • ${companyName}`,
          message: `Applied for ${drive.title} (${drive.salary_text || "Competitive Package"}). Mobile: ${candidateForm.phone}`,
          company: companyName,
          tag: "New Applicant",
          link: "/admin/applications"
        });
      } catch (notifErr) {
        console.debug("Phone notification note:", notifErr);
      }

      setAppSuccess(true);
    } catch (err) {
      setAppError(err.message || "Failed to submit application. Please try again.");
    } finally {
      setSubmittingApp(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-36 pb-24 min-h-[70vh] flex flex-col items-center justify-center bg-[#fbfbf9]">
        <div className="w-10 h-10 rounded-full border-3 border-teal-800 border-t-transparent animate-spin mb-4" />
        <p className="text-xs font-mono uppercase tracking-widest text-neutral-500">
          Loading Opportunity Details...
        </p>
      </div>
    );
  }

  if (!drive) {
    return (
      <div className="pt-36 pb-24 text-center max-w-lg mx-auto px-4 min-h-[60vh] flex flex-col justify-center bg-[#fbfbf9]">
        <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold text-[#111318]">Opportunity Not Found</h2>
        <p className="mt-2 text-xs sm:text-sm text-[#6b7280]">
          The drive reference <span className="font-mono text-neutral-900 font-bold">{slug}</span> may have completed its allocation or moved.
        </p>
        <div className="mt-6">
          <Link
            to="/jobs"
            className="inline-flex items-center space-x-2 bg-[#111318] text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-teal-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to All Drives</span>
          </Link>
        </div>
      </div>
    );
  }

  const companyName = drive.company?.name || drive.company || "Enterprise Partner";
  const categoryName = drive.category?.name || drive.category || "Hiring Drive";
  const skillsArray = Array.isArray(drive.skills) ? drive.skills : [];
  const responsibilitiesArray = Array.isArray(drive.responsibilities)
    ? drive.responsibilities
    : typeof drive.responsibilities === "string"
    ? drive.responsibilities.split("\n").filter(Boolean)
    : [
        "Participate in full screening assessments and client interview rounds.",
        "Demonstrate foundational clarity in core technical/domain competencies.",
        "Collaborate effectively in client project assignments upon successful onboarding."
      ];
  const eligibilityArray = Array.isArray(drive.eligibility)
    ? drive.eligibility
    : typeof drive.eligibility === "string"
    ? drive.eligibility.split("\n").filter(Boolean)
    : [
        "B.Tech / B.E / Degree in relevant disciplines or equivalent knowledge.",
        "2022, 2023, 2024, or 2025 graduates eligible.",
        "Strong verbal and written English communication skills.",
        "Ready to join immediate batch deployment in Hyderabad or designated client work mode."
      ];

  const whatsappMessage = encodeURIComponent(
    `Hi Sandru Anudeep, I want to apply for the "${drive.title}" hiring drive at ${companyName}. Please guide me on next steps.`
  );
  const whatsappUrl = `https://wa.me/918309740722?text=${whatsappMessage}`;

  return (
    <div className="pt-28 pb-32 bg-[#fbfbf9] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/jobs"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-[#6b7280] hover:text-[#111318] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Hiring Drives</span>
          </Link>
        </div>

        {/* Header Hero Card */}
        <div className="bg-white rounded-3xl border border-[#e6e6df] p-6 sm:p-10 mb-10 shadow-xs relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs mb-4">
            <div className="flex items-center space-x-2">
              <span className="font-mono font-bold text-xs bg-[#f4f4f0] px-3 py-1 rounded text-[#111318]">
                {drive.slug ? drive.slug.toUpperCase() : "DRIVE"}
              </span>
              <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-800 font-semibold border border-teal-200/50">
                {categoryName}
              </span>
              {drive.featured && (
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Featured Drive</span>
                </span>
              )}
            </div>

            <div className="flex items-center space-x-4 text-[#6b7280] text-xs">
              {drive.views !== undefined && (
                <span className="flex items-center space-x-1 font-mono text-[11px]">
                  <Eye className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{drive.views} views</span>
                </span>
              )}
              <span>Posted on {formatDate(drive.posted_at || drive.created_at)}</span>
            </div>
          </div>

          <div className="max-w-4xl">
            <div className="flex items-center space-x-2">
              {drive.company?.logo_url && (
                <img
                  src={drive.company.logo_url}
                  alt={companyName}
                  className="w-8 h-8 rounded-lg object-contain border border-neutral-200"
                />
              )}
              <span className="text-sm font-bold uppercase tracking-wider text-teal-800">
                {companyName} {drive.company?.industry ? `• ${drive.company.industry}` : ""}
              </span>
            </div>
            <h1 className="mt-2 editorial-title text-2xl sm:text-4xl md:text-5xl text-[#111318]">
              {drive.title}
            </h1>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-[#f0f0ea]">
            <div className="p-3 bg-[#fbfbf9] rounded-xl border border-[#f0f0ea]">
              <span className="text-[10px] uppercase font-bold text-neutral-600 block">Package / CTC</span>
              <div className="mt-1 flex items-center text-sm sm:text-base font-bold text-[#111318]">
                <IndianRupee className="w-4 h-4 text-teal-700 mr-0.5" />
                <span>{drive.salary_text || "Competitive"}</span>
              </div>
            </div>

            <div className="p-3 bg-[#fbfbf9] rounded-xl border border-[#f0f0ea]">
              <span className="text-[10px] uppercase font-bold text-neutral-600 block">Experience</span>
              <div className="mt-1 flex items-center text-sm sm:text-base font-bold text-[#111318] truncate">
                <Briefcase className="w-4 h-4 text-neutral-600 mr-1 flex-shrink-0" />
                <span className="truncate">{drive.experience || "Freshers & Exp"}</span>
              </div>
            </div>

            <div className="p-3 bg-[#fbfbf9] rounded-xl border border-[#f0f0ea]">
              <span className="text-[10px] uppercase font-bold text-neutral-600 block">Location</span>
              <div className="mt-1 flex items-center text-sm sm:text-base font-bold text-[#111318] truncate">
                <MapPin className="w-4 h-4 text-neutral-600 mr-1 flex-shrink-0" />
                <span className="truncate">{drive.location || "Hyderabad"}</span>
              </div>
            </div>

            <div className="p-3 bg-[#fbfbf9] rounded-xl border border-[#f0f0ea]">
              <span className="text-[10px] uppercase font-bold text-neutral-600 block">Work Mode</span>
              <div className="mt-1 flex items-center text-sm sm:text-base font-bold text-[#111318] truncate">
                <Clock className="w-4 h-4 text-neutral-600 mr-1 flex-shrink-0" />
                <span className="truncate">{drive.work_mode || "Work From Office"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Details Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* About The Role */}
            <div className="bg-white rounded-3xl border border-[#e6e6df] p-6 sm:p-8">
              <h2 className="text-xl font-bold text-[#111318] mb-4">
                About The Opportunity
              </h2>
              <div className="text-sm sm:text-base text-[#4b5563] leading-relaxed whitespace-pre-wrap">
                {drive.description}
              </div>

              {drive.shifts && (
                <div className="mt-6 p-4 rounded-xl bg-[#fbfbf9] border border-[#e6e6df] text-xs sm:text-sm text-[#374151] flex items-center space-x-2.5">
                  <Clock className="w-4 h-4 text-teal-700 flex-shrink-0" />
                  <span><strong>Shift & Schedule:</strong> {drive.shifts}</span>
                </div>
              )}

              {drive.process_type && (
                <div className="mt-3 p-4 rounded-xl bg-teal-50/50 border border-teal-200/60 text-xs sm:text-sm text-teal-900 flex items-center space-x-2.5">
                  <ShieldCheck className="w-4 h-4 text-teal-700 flex-shrink-0" />
                  <span><strong>Screening Mode:</strong> {drive.process_type}</span>
                </div>
              )}
            </div>

            {/* Key Responsibilities */}
            <div className="bg-white rounded-3xl border border-[#e6e6df] p-6 sm:p-8">
              <h2 className="text-xl font-bold text-[#111318] mb-4">
                Key Responsibilities & Deliverables
              </h2>
              <ul className="space-y-3">
                {responsibilitiesArray.map((resp, i) => (
                  <li key={i} className="flex items-start space-x-3 text-sm text-[#4b5563] leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Eligibility & Qualifications */}
            <div className="bg-white rounded-3xl border border-[#e6e6df] p-6 sm:p-8">
              <h2 className="text-xl font-bold text-[#111318] mb-4">
                Eligibility & Candidate Profile
              </h2>
              <ul className="space-y-3">
                {eligibilityArray.map((el, i) => (
                  <li key={i} className="flex items-start space-x-3 text-sm text-[#4b5563] leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-teal-700 flex-shrink-0 mt-0.5" />
                    <span>{el}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Required Skills */}
            {skillsArray.length > 0 && (
              <div className="bg-white rounded-3xl border border-[#e6e6df] p-6 sm:p-8">
                <h2 className="text-xl font-bold text-[#111318] mb-4">
                  Required Skills & Tools
                </h2>
                <div className="flex flex-wrap gap-2">
                  {skillsArray.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-[#fbfbf9] border border-[#e6e6df] rounded-lg text-xs font-semibold text-[#1f2937]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Mentoring & Selection Pipeline */}
            <div className="bg-white rounded-3xl border border-[#e6e6df] p-6 sm:p-8">
              <h2 className="text-xl font-bold text-[#111318] mb-3">
                How Selection & Interview Allocation Works
              </h2>
              <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed mb-4">
                TrainingAndPlacements operates as an official hiring pipeline coordinator. Upon submitting your profile:
              </p>
              <div className="space-y-3 text-xs sm:text-sm text-[#374151]">
                <div className="flex items-start space-x-2.5">
                  <span className="font-mono font-bold text-teal-800">1.</span>
                  <span>Our recruiter desk screens your profile alignment within 24-48 hours.</span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <span className="font-mono font-bold text-teal-800">2.</span>
                  <span>You receive 1-on-1 interview preparation personally mentored by Sandru Anudeep.</span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <span className="font-mono font-bold text-teal-800">3.</span>
                  <span>Your candidate slot is presented directly to {companyName}'s hiring panel.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Desktop Action Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-4">
            <div className="bg-white rounded-3xl border border-[#e6e6df] p-6 sm:p-7 shadow-xs space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800 block">
                  Application Desk
                </span>
                <p className="text-xs text-[#6b7280] mt-0.5">
                  Direct slot forwarding with zero intermediary fees.
                </p>
              </div>

              {/* Primary Direct Apply Button */}
              <button
                type="button"
                onClick={() => setShowApplyModal(true)}
                className="w-full inline-flex items-center justify-center space-x-2 bg-teal-800 hover:bg-teal-900 text-white font-bold py-3.5 rounded-xl text-xs sm:text-sm transition-all shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span>Apply for this Drive</span>
              </button>

              {/* WhatsApp Quick Apply */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3.5 rounded-xl text-xs sm:text-sm transition-all shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Quick WhatsApp Screening</span>
              </a>

              {/* Share & Bookmark Actions */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#f0f0ea]">
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl border border-[#e6e6df] hover:border-neutral-400 text-xs font-semibold text-[#374151] transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied Link" : "Share"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleToggleSave}
                  className={`inline-flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-colors ${
                    saved
                      ? "border-teal-700 bg-teal-50 text-teal-800"
                      : "border-[#e6e6df] hover:border-neutral-400 text-[#374151]"
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-current" : ""}`} />
                  <span>{saved ? "Saved" : "Save Drive"}</span>
                </button>
              </div>

              {/* Direct Recruiter Contact Callout */}
              <div className="pt-4 border-t border-[#f0f0ea] space-y-2">
                <div className="flex items-center space-x-2 text-xs font-semibold text-neutral-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified Hyderabad Placement Desk</span>
                </div>
                <p className="text-xs text-[#6b7280]">
                  Contact Sandru Anudeep (+91 8309740722) directly for fast-track manual matching and schedule confirmation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#e6e6df] p-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setShowApplyModal(true)}
          className="flex-1 inline-flex items-center justify-center space-x-2 bg-teal-800 text-white font-bold py-3.5 px-4 rounded-xl text-xs transition-colors"
        >
          <Send className="w-4 h-4" />
          <span>Apply Now</span>
        </button>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3.5 rounded-xl bg-emerald-600 text-white"
          aria-label="WhatsApp Quick Apply"
        >
          <MessageSquare className="w-4 h-4" />
        </a>

        <button
          onClick={handleShare}
          className="p-3.5 rounded-xl border border-[#e6e6df] text-[#111318]"
          aria-label="Share this job opportunity"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Application Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
            {appSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-extrabold text-[#111318]">
                  Application Submitted!
                </h3>
                <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed max-w-md mx-auto">
                  Your profile for <strong>{drive.title}</strong> at <strong>{companyName}</strong> has been registered with our recruiter desk. Sandru Anudeep and our placement coordinators will review your submission within 24-48 hours.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center space-x-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Fast-Track on WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setShowApplyModal(false);
                      setAppSuccess(false);
                    }}
                    className="px-5 py-3 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-700 hover:bg-neutral-100"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-start justify-between pb-4 border-b border-neutral-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 block">
                      Direct Application
                    </span>
                    <h3 className="text-lg font-bold text-[#111318] mt-0.5">
                      {drive.title}
                    </h3>
                    <p className="text-xs text-neutral-500">{companyName}</p>
                  </div>
                  <button
                    onClick={() => setShowApplyModal(false)}
                    className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700"
                  >
                    ✕
                  </button>
                </div>

                {appError && (
                  <div className="my-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                    {appError}
                  </div>
                )}

                <form onSubmit={handleApplicationSubmit} className="space-y-4 mt-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={candidateForm.candidateName}
                      onChange={(e) =>
                        setCandidateForm({ ...candidateForm, candidateName: e.target.value })
                      }
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-hidden focus:border-teal-700"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={candidateForm.email}
                        onChange={(e) =>
                          setCandidateForm({ ...candidateForm, email: e.target.value })
                        }
                        placeholder="candidate@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-hidden focus:border-teal-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                        Mobile / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={candidateForm.phone}
                        onChange={(e) =>
                          setCandidateForm({ ...candidateForm, phone: e.target.value })
                        }
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-hidden focus:border-teal-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                      Resume Document (PDF or DOCX)
                    </label>
                    <div className="border border-dashed border-neutral-300 rounded-xl p-4 text-center hover:border-teal-700 transition-colors">
                      <input
                        type="file"
                        id="resumeUpload"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      <label
                        htmlFor="resumeUpload"
                        className="cursor-pointer flex flex-col items-center space-y-1"
                      >
                        <Upload className="w-5 h-5 text-neutral-400" />
                        <span className="text-xs font-bold text-teal-800">
                          {resumeFile ? resumeFile.name : "Click to select resume file"}
                        </span>
                        <span className="text-[10px] text-neutral-400">
                          PDF, DOC, DOCX up to 10MB
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                      Brief Note / Candidate Highlights
                    </label>
                    <textarea
                      rows={3}
                      value={candidateForm.coverLetter}
                      onChange={(e) =>
                        setCandidateForm({ ...candidateForm, coverLetter: e.target.value })
                      }
                      placeholder="Mention your year of passing, highest degree, key skills, or notice period..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-hidden focus:border-teal-700"
                    />
                  </div>

                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowApplyModal(false)}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingApp}
                      className="px-6 py-2.5 rounded-xl bg-teal-800 text-white text-xs font-bold hover:bg-teal-900 disabled:opacity-50 flex items-center space-x-2"
                    >
                      {submittingApp ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <span>Submit Application</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
