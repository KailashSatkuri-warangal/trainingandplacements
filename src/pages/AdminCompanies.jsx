import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, CheckCircle, XCircle, Upload, ExternalLink, RefreshCw } from "lucide-react";
import { companyService } from "../services/companyService";
import { storageService } from "../services/storageService";

export default function AdminCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    logo_url: "",
    description: "",
    website: "",
    industry: "Information Technology",
    location: "Hyderabad",
    is_active: true
  });

  const loadCompanies = async () => {
    setLoading(true);
    try {
      const data = await companyService.getAllAdminCompanies();
      setCompanies(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const openCreateModal = () => {
    setEditingCompany(null);
    setForm({
      name: "",
      slug: "",
      logo_url: "",
      description: "",
      website: "",
      industry: "Information Technology",
      location: "Hyderabad",
      is_active: true
    });
    setShowModal(true);
  };

  const openEditModal = (comp) => {
    setEditingCompany(comp);
    setForm({
      name: comp.name,
      slug: comp.slug,
      logo_url: comp.logo_url || "",
      description: comp.description || "",
      website: comp.website || "",
      industry: comp.industry || "Information Technology",
      location: comp.location || "Hyderabad",
      is_active: comp.is_active
    });
    setShowModal(true);
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const publicUrl = await storageService.uploadCompanyLogo(file);
      setForm((p) => ({ ...p, logo_url: publicUrl }));
    } catch (err) {
      alert(err.message || "Error uploading company logo.");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    try {
      if (editingCompany) {
        await companyService.updateCompany(editingCompany.id, form);
      } else {
        await companyService.createCompany(form);
      }
      setShowModal(false);
      await loadCompanies();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete company ${name}?`)) return;
    try {
      await companyService.deleteCompany(id);
      setCompanies((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-teal-800 font-bold block mb-1">
            MNC PARTNERS & CLIENTS
          </span>
          <h1 className="editorial-title text-2xl sm:text-3xl text-[#111318]">
            Hiring Companies.
          </h1>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 bg-[#111318] hover:bg-teal-800 text-white font-semibold text-xs px-5 py-3 rounded-xl transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Company</span>
        </button>
      </div>

      {/* Companies Table */}
      <div className="bg-white rounded-2xl border border-[#e6e6df] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#fbfbf9] border-b border-[#e6e6df] text-neutral-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Company Name</th>
                <th className="py-3.5 px-4">Industry</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Drives</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0ea]">
              {companies.map((c) => (
                <tr key={c.id} className="hover:bg-[#fbfbf9] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#111318] flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#e6e6df] p-1.5 flex items-center justify-center flex-shrink-0 shadow-2xs">
                      {c.logo_url ? (
                        <img
                          src={c.logo_url}
                          alt={c.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/images/companies/legacy.svg";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full rounded-lg bg-neutral-100 text-neutral-700 flex items-center justify-center font-bold text-xs">
                          {c.name.slice(0, 2)}
                        </div>
                      )}
                    </div>
                    <div>
                      <span className="block font-bold text-[#111318] text-xs">{c.name}</span>
                      {c.website && (
                        <a
                          href={c.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-neutral-400 hover:text-teal-800 font-mono inline-flex items-center gap-0.5 mt-0.5"
                        >
                          <span>{c.website.replace("https://", "").replace("www.", "")}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-neutral-600">{c.industry}</td>
                  <td className="py-3.5 px-4 text-neutral-600">{c.location}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-teal-800">
                    {c.drives?.length || 0}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.is_active
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      {c.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1.5">
                    <button
                      onClick={() => openEditModal(c)}
                      className="p-1.5 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded-lg"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id, c.name)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#e6e6df] max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-[#111318]">
              {editingCompany ? "Edit Company" : "Add Company"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-800 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full p-2.5 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-1">Industry</label>
                <input
                  type="text"
                  value={form.industry}
                  onChange={(e) => setForm({ ...form, industry: e.target.value })}
                  className="w-full p-2.5 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-1">Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full p-2.5 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-1">Logo URL or Upload to Supabase Storage</label>
                <input
                  type="url"
                  value={form.logo_url}
                  onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2.5 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl font-mono text-[11px] mb-2"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={uploadingLogo}
                  className="text-xs text-neutral-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-800 hover:file:bg-teal-100"
                />
                {uploadingLogo && <span className="text-[11px] text-teal-800 ml-2">Uploading...</span>}
                {form.logo_url && (
                  <div className="flex items-center space-x-2.5 mt-2.5 p-2 bg-[#f4f4f0] rounded-xl border border-[#e6e6df]">
                    <div className="w-8 h-8 rounded-lg bg-white p-1 border border-[#e6e6df] flex items-center justify-center flex-shrink-0">
                      <img src={form.logo_url} alt="Preview" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-[10px] font-mono text-neutral-600 truncate">{form.logo_url}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="rounded text-teal-700 w-4 h-4"
                />
                <label htmlFor="active" className="font-semibold text-neutral-800">
                  Active (Visible on public partner listings)
                </label>
              </div>

              <div className="pt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#111318] hover:bg-teal-800 text-white rounded-xl font-bold"
                >
                  Save Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
