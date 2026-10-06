import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, AlertCircle, Loader2 } from "lucide-react";
import { driveService } from "../services/driveService";
import { companyService } from "../services/companyService";
import { categoryService } from "../services/categoryService";
import { slugify } from "../utils/slugify";

export default function AdminDriveEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [form, setForm] = useState(null);

  useEffect(() => {
    Promise.all([
      driveService.getAdminDriveById(id),
      companyService.getActiveCompanies(),
      categoryService.getActiveCategories()
    ])
      .then(([driveData, comps, cats]) => {
        setCompanies(comps || []);
        setCategories(cats || []);
        if (driveData) {
          setForm({
            ...driveData,
            company_id: driveData.company_id || "",
            category_id: driveData.category_id || "",
            skills: Array.isArray(driveData.skills) ? driveData.skills.join(", ") : "",
            eligibility: Array.isArray(driveData.eligibility) ? driveData.eligibility.join("; ") : "",
            responsibilities: Array.isArray(driveData.responsibilities) ? driveData.responsibilities.join("; ") : "",
            requirements: Array.isArray(driveData.requirements) ? driveData.requirements.join("; ") : ""
          });
        } else {
          setErrorMsg("Hiring drive not found.");
        }
      })
      .catch((err) => {
        setErrorMsg(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.salary_text.trim() || !form.location.trim()) {
      setErrorMsg("Please fill in the required fields.");
      return;
    }

    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const skillsArr = form.skills.split(",").map((s) => s.trim()).filter(Boolean);
      const eligArr = form.eligibility.split(/[;\n]/).map((s) => s.trim()).filter(Boolean);
      const respArr = form.responsibilities.split(/[;\n]/).map((s) => s.trim()).filter(Boolean);
      const reqArr = form.requirements.split(/[;\n]/).map((s) => s.trim()).filter(Boolean);

      const payload = {
        ...form,
        skills: skillsArr,
        eligibility: eligArr,
        responsibilities: respArr,
        requirements: reqArr
      };

      await driveService.updateDrive(id, payload);
      setSuccessMsg("Drive updated successfully! Website is automatically updated.");
      setTimeout(() => navigate("/admin/drives"), 1200);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Failed to update hiring drive.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-teal-700" />
        <p className="text-xs text-neutral-500">Loading drive from database...</p>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-sm font-bold text-rose-600">{errorMsg || "Drive not found"}</p>
        <Link to="/admin/drives" className="text-xs text-teal-800 underline">
          Return to All Drives
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
            EDIT OPPORTUNITY
          </span>
          <h1 className="editorial-title text-2xl sm:text-3xl text-[#111318]">
            Edit Drive: {form.title}
          </h1>
          <p className="text-xs text-[#6b7280] mt-1 font-mono">
            ID: {id} • Current Status: <strong>{form.status}</strong>
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-bold text-neutral-800 mb-1.5">Role Title</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full p-3 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-800 mb-1.5">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full p-3 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl text-xs font-semibold text-teal-800"
              >
                <option value="PUBLISHED">PUBLISHED (Live on website)</option>
                <option value="DRAFT">DRAFT (Hidden)</option>
                <option value="CLOSED">CLOSED</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-neutral-800 mb-1.5">Company</label>
              <select
                value={form.company_id}
                onChange={(e) => setForm({ ...form, company_id: e.target.value })}
                className="w-full p-3 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl text-xs"
              >
                <option value="">Select Company</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-neutral-800 mb-1.5">Category</label>
              <select
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                className="w-full p-3 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl text-xs"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-neutral-800 mb-1.5">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full p-3 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-800 mb-1.5">Work Mode</label>
              <select
                value={form.work_mode}
                onChange={(e) => setForm({ ...form, work_mode: e.target.value })}
                className="w-full p-3 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl text-xs"
              >
                <option value="Work From Office">Work From Office</option>
                <option value="Work From Home">Work From Home</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-neutral-800 mb-1.5">Package Text</label>
              <input
                type="text"
                value={form.salary_text}
                onChange={(e) => setForm({ ...form, salary_text: e.target.value })}
                className="w-full p-3 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-neutral-800 mb-1.5">Experience</label>
            <input
              type="text"
              value={form.experience}
              onChange={(e) => setForm({ ...form, experience: e.target.value })}
              className="w-full p-3 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-800 mb-1.5">Full Description</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full p-3 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl text-xs leading-relaxed"
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-800 mb-1.5">Skills (Comma-separated)</label>
            <input
              type="text"
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
              className="w-full p-3 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl text-xs font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-800 mb-1.5">Eligibility (Semicolon-separated)</label>
            <input
              type="text"
              value={form.eligibility}
              onChange={(e) => setForm({ ...form, eligibility: e.target.value })}
              className="w-full p-3 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-800 mb-1.5">Responsibilities (Semicolon-separated)</label>
            <input
              type="text"
              value={form.responsibilities}
              onChange={(e) => setForm({ ...form, responsibilities: e.target.value })}
              className="w-full p-3 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-800 mb-1.5">Application URL</label>
            <input
              type="url"
              value={form.application_url}
              onChange={(e) => setForm({ ...form, application_url: e.target.value })}
              className="w-full p-3 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl text-xs font-mono"
            />
          </div>

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

          <div className="pt-6 border-t border-[#e6e6df] flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate("/admin/drives")}
              className="px-5 py-3 border border-neutral-300 rounded-xl font-semibold text-neutral-700 hover:bg-neutral-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-[#111318] hover:bg-teal-800 text-white rounded-xl font-bold transition-all shadow-sm"
            >
              {saving ? "Saving Changes..." : "Save Drive Updates"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
