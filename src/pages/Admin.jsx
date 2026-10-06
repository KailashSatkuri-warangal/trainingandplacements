import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Database,
  Plus,
  Trash2,
  Edit3,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Search,
  Sparkles,
  Copy,
  Check,
  Code2,
  X,
  ArrowLeft
} from "lucide-react";
import { jobsService } from "../services/jobsService";
import { JOBS_DATA, CATEGORIES_LIST, WORK_MODES } from "../data/jobs";
import { SITE_CONFIG } from "../data/siteContent";

export default function Admin() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState({ checking: true, connected: false, message: "" });
  const [searchFilter, setSearchFilter] = useState("");
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  // Modal / Form state for Add or Edit
  const [editingJob, setEditingJob] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    company: "",
    companyCategory: "Tier-1 Enterprise",
    title: "",
    category: "IT & Engineering",
    location: "Hyderabad",
    workMode: "Work From Office",
    experience: "Freshers (2025 / 2026 Batch)",
    salary: "₹4.50 LPA",
    salaryMin: 450000,
    salaryMax: 450000,
    featured: false,
    hiringStatus: "Active Hiring Drive",
    shifts: "Standard Day Shifts (5 Days Working)",
    processType: "Direct Client Interview Slot",
    description: "",
    skills: "",
    eligibility: "",
    responsibilities: "",
    applyUrl: `https://wa.me/918328246487?text=Hi%20Sandru%20Anudeep,%20I%20am%20interested%20in%20this%20role`
  });

  // Load jobs from Supabase
  const loadJobs = async () => {
    setIsLoading(true);
    try {
      const data = await jobsService.getAllJobs();
      setJobs(data || []);
    } catch (err) {
      setFeedback({ type: "error", message: `Error loading drives: ${err.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  // Test Supabase connection
  useEffect(() => {
    async function checkDb() {
      setDbStatus({ checking: true, connected: false, message: "Testing PostgreSQL connection..." });
      const res = await jobsService.testConnection();
      if (res.success) {
        setDbStatus({
          checking: false,
          connected: true,
          message: "Connected to Supabase PostgreSQL (sbwantnhvsiylfnmayfb.supabase.co)"
        });
      } else {
        setDbStatus({
          checking: false,
          connected: false,
          message: `Database notice: ${res.error}. Table 'jobs' may need schema initialization.`
        });
      }
    }
    checkDb();
    loadJobs();
  }, []);

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    setFeedback({ type: "", message: "" });
    try {
      const count = await jobsService.seedInitialJobs();
      setFeedback({
        type: "success",
        message: `Successfully synchronized ${count} verified drives to Supabase PostgreSQL!`
      });
      await loadJobs();
    } catch (err) {
      setFeedback({
        type: "error",
        message: `Database sync failed: ${err.message}. If the 'jobs' table does not exist yet, click 'View SQL Schema' above and run the SQL query once in your Supabase dashboard.`
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete drive ${id}?`)) return;
    try {
      await jobsService.deleteJob(id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
      setFeedback({ type: "success", message: `Drive ${id} deleted successfully.` });
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
    }
  };

  const openCreateModal = () => {
    const newId = `TR${Math.floor(1025 + Math.random() * 900)}`;
    setFormData({
      id: newId,
      company: "",
      companyCategory: "Tier-1 Enterprise",
      title: "",
      category: "IT & Engineering",
      location: "Hyderabad",
      workMode: "Work From Office",
      experience: "Freshers (2025 / 2026 Batch)",
      salary: "₹4.50 LPA",
      salaryMin: 450000,
      salaryMax: 450000,
      featured: false,
      hiringStatus: "Active Hiring Drive",
      shifts: "Standard Day Shifts (5 Days Working)",
      processType: "Direct Client Interview Slot",
      description: "Direct client hiring drive with screening and 1-on-1 interview mentoring.",
      skills: "Communication, Technical Basics, Problem Solving",
      eligibility: "Any Graduate (2024 - 2026), 60% throughout academics",
      responsibilities: "Handle client deliverables, collaborate with engineering leads, maintain quality compliance",
      applyUrl: `https://wa.me/918328246487?text=Hi%20Sandru%20Anudeep,%20I%20am%20interested%20in%20${newId}`
    });
    setEditingJob(null);
    setShowFormModal(true);
  };

  const openEditModal = (job) => {
    setEditingJob(job);
    setFormData({
      id: job.id,
      company: job.company || "",
      companyCategory: job.companyCategory || "",
      title: job.title || "",
      category: job.category || "IT & Engineering",
      location: job.location || "Hyderabad",
      workMode: job.workMode || "Work From Office",
      experience: job.experience || "",
      salary: job.salary || "",
      salaryMin: job.salaryMin || 0,
      salaryMax: job.salaryMax || 0,
      featured: Boolean(job.featured),
      hiringStatus: job.hiringStatus || "Active",
      shifts: job.shifts || "",
      processType: job.processType || "",
      description: job.description || "",
      skills: Array.isArray(job.skills) ? job.skills.join(", ") : "",
      eligibility: Array.isArray(job.eligibility) ? job.eligibility.join("; ") : "",
      responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities.join("; ") : "",
      applyUrl: job.applyUrl || ""
    });
    setShowFormModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const skillsArray = formData.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const eligibilityArray = formData.eligibility
      .split(/[;\n]/)
      .map((s) => s.trim())
      .filter(Boolean);
    const responsibilitiesArray = formData.responsibilities
      .split(/[;\n]/)
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      skills: skillsArray,
      eligibility: eligibilityArray,
      responsibilities: responsibilitiesArray
    };

    try {
      if (editingJob) {
        await jobsService.updateJob(editingJob.id, payload);
        setFeedback({ type: "success", message: `Drive ${editingJob.id} updated successfully!` });
      } else {
        await jobsService.createJob(payload);
        setFeedback({ type: "success", message: `New drive ${payload.id} published successfully!` });
      }
      setShowFormModal(false);
      await loadJobs();
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
    }
  };

  const copySqlToClipboard = () => {
    const sqlText = `-- Create jobs table in Supabase PostgreSQL
create table if not exists public.jobs (
  id text primary key,
  company text not null,
  company_category text,
  title text not null,
  category text not null,
  location text not null,
  work_mode text not null,
  experience text not null,
  salary text not null,
  salary_min numeric,
  salary_max numeric,
  featured boolean default false,
  hiring_status text,
  shifts text,
  process_type text,
  description text,
  skills text[] default '{}',
  eligibility text[] default '{}',
  responsibilities text[] default '{}',
  apply_url text,
  posted_date date default current_date,
  created_at timestamptz default now()
);

alter table public.jobs enable row level security;

create policy "Allow public read" on public.jobs for select to anon, authenticated using (true);
create policy "Allow admin write" on public.jobs for all to anon, authenticated using (true);`;

    navigator.clipboard.writeText(sqlText);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  // Filter table by search
  const displayedJobs = jobs.filter((j) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      j.title?.toLowerCase().includes(q) ||
      j.company?.toLowerCase().includes(q) ||
      j.id?.toLowerCase().includes(q) ||
      j.category?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="pt-28 pb-28 bg-[#fbfbf9] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/jobs"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#6b7280] hover:text-[#111318]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Job Board</span>
          </Link>

          <span className="text-xs font-mono text-neutral-500">
            Recruiter Desk Portal • {SITE_CONFIG.founder}
          </span>
        </div>

        {/* Header Hero */}
        <div className="bg-white rounded-3xl border border-[#e6e6df] p-6 sm:p-10 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="eyebrow flex items-center space-x-2 mb-2">
                <Database className="w-3.5 h-3.5 text-teal-700" />
                <span>POSTGRESQL & SUPABASE CLOUD SYNC</span>
              </div>
              <h1 className="editorial-title text-3xl sm:text-4xl md:text-5xl text-[#111318]">
                RECRUITMENT DESK ADMIN.
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-[#4b5563] max-w-xl">
                Create, update, and manage verified candidate hiring drives with instant synchronization across PostgreSQL and the client-facing job board.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setShowSqlModal(true)}
                className="inline-flex items-center space-x-2 bg-white hover:bg-[#f4f4f0] text-[#111318] border border-[#d1d5db] text-xs font-semibold px-4 py-3 rounded-xl transition-all shadow-xs"
              >
                <Code2 className="w-4 h-4 text-neutral-600" />
                <span>View SQL Schema</span>
              </button>

              <button
                type="button"
                onClick={handleSeedDatabase}
                disabled={isSeeding}
                className="inline-flex items-center space-x-2 bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold px-4 py-3 rounded-xl transition-all shadow-xs disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isSeeding ? "animate-spin" : ""}`} />
                <span>{isSeeding ? "Syncing..." : "Sync 23+ Drives to DB"}</span>
              </button>

              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex items-center space-x-2 bg-[#111318] hover:bg-teal-800 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Post New Drive</span>
              </button>
            </div>
          </div>

          {/* Database Connection Status Bar */}
          <div className="mt-8 pt-6 border-t border-[#f0f0ea] flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center space-x-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  dbStatus.connected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                }`}
              />
              <span className="font-semibold text-[#111318]">
                {dbStatus.connected ? "Database Connected" : "Local Sync Mode"}
              </span>
              <span className="text-neutral-300">•</span>
              <span className="text-neutral-500 font-mono">{dbStatus.message}</span>
            </div>

            <div className="flex items-center space-x-4 font-mono text-[11px] text-neutral-600">
              <span>Total Drives: <strong>{jobs.length}</strong></span>
              <span>Featured: <strong>{jobs.filter((j) => j.featured).length}</strong></span>
            </div>
          </div>
        </div>

        {/* Notification Alert */}
        {feedback.message && (
          <div
            className={`p-4 rounded-2xl mb-8 flex items-center justify-between text-xs border ${
              feedback.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-rose-50 text-rose-800 border-rose-200"
            }`}
          >
            <div className="flex items-center space-x-2">
              {feedback.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
            <button
              onClick={() => setFeedback({ type: "", message: "" })}
              className="text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Job Management Table */}
        <div className="bg-white rounded-3xl border border-[#e6e6df] overflow-hidden shadow-sm">
          {/* Table Header Controls */}
          <div className="p-6 border-b border-[#e6e6df] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <h2 className="text-lg font-bold text-[#111318]">
                Active Hiring Drives List
              </h2>
              <span className="text-xs bg-[#f4f4f0] text-neutral-700 px-2.5 py-0.5 rounded-full font-mono">
                {displayedJobs.length} records
              </span>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search drives by title, company, or ID..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl text-xs text-[#111318] focus:outline-none focus:ring-1 focus:ring-teal-700"
              />
            </div>
          </div>

          {/* Responsive Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fbfbf9] border-b border-[#e6e6df] text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Drive ID</th>
                  <th className="py-3.5 px-4">Company</th>
                  <th className="py-3.5 px-4">Role Title</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Package</th>
                  <th className="py-3.5 px-4">Mode</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f0ea]">
                {displayedJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-[#fbfbf9] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#111318]">
                      {job.id}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-teal-800">
                      {job.company}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate font-medium text-[#111318]">
                      <Link
                        to={`/jobs/${job.id}`}
                        target="_blank"
                        className="hover:underline flex items-center space-x-1"
                        title={job.title}
                      >
                        <span>{job.title}</span>
                        <ExternalLink className="w-3 h-3 text-neutral-400 inline" />
                      </Link>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200/50 text-[10px] font-semibold">
                        {job.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#111318]">
                      {job.salary}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-500">
                      {job.workMode}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center space-x-1">
                        <button
                          type="button"
                          onClick={() => openEditModal(job)}
                          className="p-1.5 rounded-lg text-neutral-600 hover:text-teal-700 hover:bg-neutral-100 transition-colors"
                          title="Edit Drive"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(job.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                          title="Delete Drive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SQL Schema Modal */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#e6e6df] max-w-2xl w-full p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#e6e6df]">
              <div className="flex items-center space-x-2">
                <Code2 className="w-5 h-5 text-teal-700" />
                <h3 className="text-base font-bold text-[#111318]">
                  PostgreSQL Table & RLS Schema
                </h3>
              </div>
              <button
                onClick={() => setShowSqlModal(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#4b5563]">
              To prepare your Supabase PostgreSQL database, open your Supabase Dashboard SQL Editor for project <span className="font-mono text-teal-800">sbwantnhvsiylfnmayfb</span> and execute this query:
            </p>

            <pre className="p-4 bg-[#0e1117] text-neutral-200 rounded-xl text-xs font-mono overflow-x-auto max-h-72">
{`create table if not exists public.jobs (
  id text primary key,
  company text not null,
  company_category text,
  title text not null,
  category text not null,
  location text not null,
  work_mode text not null,
  experience text not null,
  salary text not null,
  salary_min numeric,
  salary_max numeric,
  featured boolean default false,
  hiring_status text,
  shifts text,
  process_type text,
  description text,
  skills text[] default '{}',
  eligibility text[] default '{}',
  responsibilities text[] default '{}',
  apply_url text,
  posted_date date default current_date,
  created_at timestamptz default now()
);

alter table public.jobs enable row level security;
create policy "Allow public read" on public.jobs for select to anon, authenticated using (true);
create policy "Allow admin write" on public.jobs for all to anon, authenticated using (true);`}
            </pre>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={copySqlToClipboard}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-semibold"
              >
                {copiedSql ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSql ? "SQL Copied!" : "Copy SQL Query"}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSqlModal(false)}
                className="px-4 py-2 border border-[#d1d5db] text-[#111318] rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Drive Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#e6e6df] max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#e6e6df]">
              <h3 className="text-lg font-bold text-[#111318]">
                {editingJob ? `Edit Hiring Drive (${editingJob.id})` : "Publish New Hiring Drive"}
              </h3>
              <button
                onClick={() => setShowFormModal(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Drive ID</label>
                  <input
                    type="text"
                    required
                    value={formData.id}
                    disabled={Boolean(editingJob)}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    className="w-full p-2.5 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    placeholder="e.g. Capgemini"
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full p-2.5 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Company Category</label>
                  <input
                    type="text"
                    value={formData.companyCategory}
                    placeholder="e.g. Tier-1 IT Giant"
                    onChange={(e) => setFormData({ ...formData, companyCategory: e.target.value })}
                    className="w-full p-2.5 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Role Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  placeholder="e.g. Software Engineer Hiring Drive (2026 Batch)"
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Stream / Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl"
                  >
                    {CATEGORIES_LIST.filter((c) => c !== "All Drives").map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Work Mode</label>
                  <select
                    value={formData.workMode}
                    onChange={(e) => setFormData({ ...formData, workMode: e.target.value })}
                    className="w-full p-2.5 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl"
                  >
                    {WORK_MODES.filter((m) => m !== "All Work Modes").map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    placeholder="Hyderabad / Pan India"
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full p-2.5 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Package / CTC</label>
                  <input
                    type="text"
                    required
                    value={formData.salary}
                    placeholder="e.g. ₹5.50 LPA"
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    className="w-full p-2.5 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Experience</label>
                  <input
                    type="text"
                    required
                    value={formData.experience}
                    placeholder="e.g. Freshers (2025 / 2026 Batch Passouts)"
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full p-2.5 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Role Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Skills (Comma-separated)</label>
                <input
                  type="text"
                  value={formData.skills}
                  placeholder="Java, React, SQL, Problem Solving"
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="w-full p-2.5 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Eligibility Criteria (Semicolon-separated)</label>
                <input
                  type="text"
                  value={formData.eligibility}
                  placeholder="BE / B.Tech in CSE / ECE; 60% throughout 10th, 12th & Degree"
                  onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                  className="w-full p-2.5 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Apply URL (Direct WhatsApp or Portal Link)</label>
                <input
                  type="url"
                  value={formData.applyUrl}
                  onChange={(e) => setFormData({ ...formData, applyUrl: e.target.value })}
                  className="w-full p-2.5 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded text-teal-700 focus:ring-teal-700 w-4 h-4"
                />
                <label htmlFor="featured" className="font-semibold text-neutral-800">
                  Feature this drive on the homepage carousel
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-[#e6e6df]">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-5 py-2.5 border border-[#d1d5db] rounded-xl font-semibold text-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#111318] hover:bg-teal-800 text-white rounded-xl font-bold transition-colors"
                >
                  {editingJob ? "Update Drive" : "Publish Drive"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
