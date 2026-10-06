import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  ExternalLink,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Star,
  RefreshCw,
  Archive,
  Filter
} from "lucide-react";
import { driveService } from "../services/driveService";
import { formatDate } from "../utils/formatters";

export default function AdminDrives() {
  const [drives, setDrives] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [actionNotice, setActionNotice] = useState("");

  const loadDrives = async () => {
    setIsLoading(true);
    try {
      const data = await driveService.getAllAdminDrives({
        search,
        status: statusFilter !== "ALL" ? statusFilter : ""
      });
      setDrives(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDrives();
  }, [statusFilter]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await driveService.setStatus(id, newStatus);
      setDrives((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
      );
      setActionNotice(`Drive status updated to ${newStatus}. Website automatically synced!`);
      setTimeout(() => setActionNotice(""), 3500);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleFeatured = async (id, currentFeatured) => {
    try {
      await driveService.toggleFeatured(id, currentFeatured);
      setDrives((prev) =>
        prev.map((d) => (d.id === id ? { ...d, featured: !currentFeatured } : d))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to permanently remove "${title}"?`)) return;
    try {
      await driveService.deleteDrive(id);
      setDrives((prev) => prev.filter((d) => d.id !== id));
      setActionNotice("Drive deleted successfully.");
      setTimeout(() => setActionNotice(""), 3000);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-teal-800 font-bold block mb-1">
            DATABASE SOURCE OF TRUTH
          </span>
          <h1 className="editorial-title text-2xl sm:text-3xl text-[#111318]">
            Hiring Drives & Job Opportunities.
          </h1>
        </div>

        <Link
          to="/admin/drives/create"
          className="inline-flex items-center space-x-2 bg-[#111318] hover:bg-teal-800 text-white font-semibold text-xs px-5 py-3 rounded-xl transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Hiring Drive</span>
        </Link>
      </div>

      {actionNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-between">
          <span>{actionNotice}</span>
          <button onClick={() => setActionNotice("")} className="text-emerald-700 hover:text-black">
            ✕
          </button>
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="bg-white rounded-2xl border border-[#e6e6df] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && loadDrives()}
            placeholder="Search drives by title..."
            className="w-full pl-9 pr-4 py-2 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-teal-700"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#fbfbf9] border border-[#e6e6df] rounded-xl px-3 py-2 text-xs text-[#111318] focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published (Live)</option>
            <option value="DRAFT">Draft</option>
            <option value="CLOSED">Closed</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          <button
            type="button"
            onClick={loadDrives}
            className="p-2 border border-[#e6e6df] rounded-xl hover:bg-neutral-50 text-neutral-600"
            title="Refresh drives"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Drives Data Table */}
      <div className="bg-white rounded-2xl border border-[#e6e6df] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#fbfbf9] border-b border-[#e6e6df] text-neutral-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Role Title</th>
                <th className="py-3.5 px-4">Company</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Package</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Featured</th>
                <th className="py-3.5 px-4">Views</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0ea]">
              {drives.length > 0 ? (
                drives.map((d) => (
                  <tr key={d.id} className="hover:bg-[#fbfbf9] transition-colors">
                    <td className="py-3.5 px-4 max-w-xs font-semibold text-[#111318]">
                      <div className="truncate">{d.title}</div>
                      <div className="text-[10px] text-neutral-400 font-mono">
                        slug: /{d.slug}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-teal-800 font-bold">
                      {d.company?.name || "Tier-1 Partner"}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200/50 text-[10px] font-semibold">
                        {d.category?.name || "General"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-[#111318]">
                      {d.salary_text}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          d.status === "PUBLISHED"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : d.status === "DRAFT"
                            ? "bg-amber-50 text-amber-800 border border-amber-200"
                            : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(d.id, d.featured)}
                        className="p-1 text-neutral-300 hover:text-amber-500 transition-colors"
                        title={d.featured ? "Unmark featured" : "Mark as featured"}
                      >
                        <Star
                          className={`w-4 h-4 ${
                            d.featured ? "text-amber-500 fill-current" : ""
                          }`}
                        />
                      </button>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-neutral-500">
                      {d.views || 0}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center space-x-1.5">
                        {/* Quick Publish / Unpublish */}
                        {d.status === "PUBLISHED" ? (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(d.id, "DRAFT")}
                            className="px-2 py-1 bg-amber-50 text-amber-800 rounded-lg hover:bg-amber-100 text-[10px] font-bold"
                            title="Unpublish to DRAFT"
                          >
                            Unpublish
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(d.id, "PUBLISHED")}
                            className="px-2 py-1 bg-emerald-50 text-emerald-800 rounded-lg hover:bg-emerald-100 text-[10px] font-bold"
                            title="Publish Live"
                          >
                            Publish
                          </button>
                        )}

                        <Link
                          to={`/jobs/${d.slug}`}
                          target="_blank"
                          className="p-1.5 text-neutral-500 hover:text-teal-700 hover:bg-neutral-100 rounded-lg"
                          title="View on website"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <Link
                          to={`/admin/drives/${d.id}/edit`}
                          className="p-1.5 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded-lg"
                          title="Edit details"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDelete(d.id, d.title)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-neutral-400">
                    No hiring drives found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
