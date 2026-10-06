import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, PlusCircle, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { driveService } from "../services/driveService";
import { companyService } from "../services/companyService";
import { categoryService } from "../services/categoryService";
import { slugify } from "../utils/slugify";

export default function AdminDriveCreate() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    title: "",
    slug: "",
    company_id: "",
    category_id: "",
    short_description: "",
    description: "",
    location: "Hyderabad",
    experience: "Freshers (2025 / 2026 Batch)",
    salary_text: "₹5.50 LPA",
    salary_min: 550000,
    salary_max: 550000,
    employment_type: "Full-time",
    work_mode: "Work From Office",
    skills: "Problem Solving, Communication, Core Technical Skills",
    eligibility: "Any Graduate (2024 - 2026 Batch); Minimum 60% aggregate",
    responsibilities: "Deliver high quality engineering tasks; collaborate with client leads; maintain SLA benchmarks",
    requirements: "Clear logical thinking; good communication; immediate joiner",
    application_process: "1. Profile screening; 2. 1-on-1 Mock Interview Prep; 3. Client Panel Round",
    application_url: "https://wa.me/918328246487?text=Hi%20Sandru%20Anudeep,%20I%20am%20interested%20in%20this%20drive",
    application_deadline: "",
    featured: false,
    status: "PUBLISHED"
  });

  useEffect(() => {
    Promise.all([
      companyService.getActiveCompanies(),
      categoryService.getActiveCategories()
    ]).then(([comps, cats]) => {
      setCompanies(comps || []);
      setCategories(cats || []);
      if (comps?.length > 0) setForm((p) => ({ ...p, company_id: comps[0].id }));
      if (cats?.length > 0) setForm((p) => ({ ...p, category_id: cats[0].id }));
    });
  }, []);

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setForm((p) => ({
      ...p,
      title: val,
      slug: slugify(val)
    }));
  };

  const handleSubmit = async (submitStatus) => {
    if (!form.title.trim() || !form.salary_text.trim() || !form.location.trim()) {
      setErrorMsg("Please fill in the required fields (Title, Salary, Location).");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const skillsArr = form.skills.split(",").map((s) => s.trim()).filter(Boolean);
      const eligArr = form.eligibility.split(/[;\n]/).map((s) => s.trim()).filter(Boolean);
      const respArr = form.responsibilities.split(/[;\n]/).map((s) => s.trim()).filter(Boolean);
      const reqArr = form.requirements.split(/[;\n]/).map((s) => s.trim()).filter(Boolean);

      const payload = {
        ...form,
        status: submitStatus || form.status,
        skills: skillsArr,
        eligibility: eligArr,
        responsibilities: respArr,
        requirements: reqArr
      };

      await driveService.createDrive(payload);
      navigate("/admin/drives");
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Failed to create hiring drive in Supabase.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Link */}
      <div>
        <Link
          to="/admin/drives"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-neutral-600 hover:text-black"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Hiring Drives</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-[#e6e6df] p-6 sm:p-10 shadow-sm space-y-8">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-teal-800 font-bold block mb-1">
            NEW OPPORTUNITY FORM
          </span>
          <h1 className="editorial-title text-2xl sm:text-3xl text-[#111318]">
            Create Hiring Drive.
          </h1>
          <p className="text-xs text-[#6b7280] mt-1">
            Fill in the details below. Publishing will immediately make this drive live on the public job board.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit("PUBLISHED"); }} className="space-y-6 text-xs">
          {/* Title & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-neutral-800 mb-1.5">
                Role Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={handleTitleChange}
                placeholder="e.g. Capgemini Engineering Hiring Drive (Mechanical & Aero)"
                className="w-full p-3 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl text-xs text-[#111318] focus:outline-none focus:ring-1 focus:ring-teal-700"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-800 mb-1.5">
                URL Slug <span className="text-neutral-400 font-normal">(Auto-generated)</span>
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
                className="w-full p-3 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl text-xs font-mono text-neutral-600 focus:outline-none focus:ring-1 focus:ring-teal-700"
              />
            </div>
          </div>

          {/* Company & Category Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-neutral-800 mb-1.5">
                Hiring Partner Company
              </label>
              <select
                value={form.company_id}
                onChange={(e) => setForm({ ...form, company_id: e.target.value })}
                className="w-full p-3 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl text-xs text-[#111318] focus:outline-none focus:ring-1 focus:ring-teal-700"
              >
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.industry || "General"})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-neutral-800 mb-1.5">
                Career Category
              </label>
              <select
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                className="w-full p-3 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl text-xs text-[#111318] focus:outline-none focus:ring-1 focus:ring-teal-700"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location, Work Mode, Employment Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-neutral-800 mb-1.5">
                Job Location
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Hyderabad / Pan India"
                className="w-full p-3 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl text-xs text-[#111318]"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-800 mb-1.5">
                Work Mode
              </label>
              <select
                value={form.work_mode}
                onChange={(e) => setForm({ ...form, work_mode: e.target.value })}
                className="w-full p-3 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl text-xs text-[#111318]"
              >
                <option value="Work From Office">Work From Office</option>
                <option value="Work From Home">Work From Home</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-neutral-800 mb-1.5">
                Employment Type
              </label>
              <select
                value={form.employment_type}
                onChange={(e) => setForm({ ...form, employment_type: e.target.value })}
                className="w-full p-3 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl text-xs text-[#111318]"
              >
                <option value="Full-time">Full-time</option>
                <option value="Contract">Contract</option>
                <option value="Apprenticeship">Apprenticeship</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>

          {/* Experience & Salary Text */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-neutral-800 mb-1.5">
                Experience Requirement
              </label>
              <input
                type="text"
                value={form.experience}
                onChange={(e) => setForm({ ...form, experience: e.target.value })}
                placeholder="e.g. Freshers (2025 / 2026 Batch Passouts)"
                className="w-full p-3 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl text-xs text-[#111318]"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-800 mb-1.5">
                Salary Display Text
              </label>
              <input
                type="text"
                value={form.salary_text}
                onChange={(e) => setForm({ ...form, salary_text: e.target.value })}
                placeholder="e.g. ₹5.50 LPA or ₹2.40 – ₹2.80 LPA"
                className="w-full p-3 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl text-xs text-[#111318]"
              />
            </div>
          </div>

          {/* Descriptions */}
          <div>
            <label className="block font-bold text-neutral-800 mb-1.5">
              Short Summary
            </label>
            <input
              type="text"
              value={form.short_description}
              onChange={(e) => setForm({ ...form, short_description: e.target.value })}
              placeholder="One line highlight shown on cards"
              className="w-full p-3 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-800 mb-1.5">
              Full Role Description
            </label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Detailed explanation of the opportunity and company background..."
              className="w-full p-3 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl text-xs leading-relaxed"
            />
          </div>

          {/* Skills, Eligibility, Responsibilities */}
          <div className="space-y-4 pt-2">
            <div>
              <label className="block font-bold text-neutral-800 mb-1.5">
                Key Skills (Comma-separated)
              </label>
              <input
                type="text"
                value={form.skills}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                placeholder="CATIA V5, 3D Modeling, GD&T"
                className="w-full p-3 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-800 mb-1.5">
                Eligibility Criteria (Semicolon-separated)
              </label>
              <input
                type="text"
                value={form.eligibility}
                onChange={(e) => setForm({ ...form, eligibility: e.target.value })}
                placeholder="BE / B.Tech mechanical; 60% aggregate; no active backlogs"
                className="w-full p-3 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-800 mb-1.5">
                Responsibilities (Semicolon-separated)
              </label>
              <input
                type="text"
                value={form.responsibilities}
                onChange={(e) => setForm({ ...form, responsibilities: e.target.value })}
                placeholder="Parametric modeling; assembly blueprints; quality validation"
                className="w-full p-3 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl text-xs"
              />
            </div>
          </div>

          {/* Application URL & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-neutral-800 mb-1.5">
                Application URL (WhatsApp or Direct Link)
              </label>
              <input
                type="url"
                value={form.application_url}
                onChange={(e) => setForm({ ...form, application_url: e.target.value })}
                className="w-full p-3 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-800 mb-1.5">
                Application Deadline
              </label>
              <input
                type="date"
                value={form.application_deadline}
                onChange={(e) => setForm({ ...form, application_deadline: e.target.value })}
                className="w-full p-3 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl text-xs"
              />
            </div>
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center space-x-2.5 pt-2">
            <input
              type="checkbox"
              id="featured"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="rounded text-teal-700 focus:ring-teal-700 w-4 h-4"
            />
            <label htmlFor="featured" className="font-semibold text-neutral-800">
              Pin to Featured Hiring Drives on Homepage
            </label>
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-[#e6e6df] flex items-center justify-end space-x-3">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleSubmit("DRAFT")}
              className="px-5 py-3 border border-neutral-300 rounded-xl font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              Save as Draft
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#111318] hover:bg-teal-800 text-white rounded-xl font-bold transition-all shadow-sm"
            >
              {loading ? "Publishing to Supabase..." : "Publish Live Drive"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
