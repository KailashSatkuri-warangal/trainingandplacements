import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, CheckCircle, XCircle, Star, RefreshCw, Upload, Quote } from "lucide-react";
import { testimonialService } from "../services/testimonialService";
import { storageService } from "../services/storageService";

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [form, setForm] = useState({
    name: "",
    role: "Candidate",
    company: "",
    content: "",
    avatar_url: "",
    rating: 5,
    is_published: true
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await testimonialService.getAllAdminTestimonials();
      setTestimonials(data || []);
    } catch (err) {
      console.error("Error loading testimonials:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setForm({
      name: "",
      role: "Candidate",
      company: "",
      content: "",
      avatar_url: "",
      rating: 5,
      is_published: true
    });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      role: item.role || "Candidate",
      company: item.company || "",
      content: item.content || "",
      avatar_url: item.avatar_url || "",
      rating: item.rating || 5,
      is_published: item.is_published
    });
    setShowModal(true);
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const publicUrl = await storageService.uploadTestimonialAvatar(file);
      setForm((p) => ({ ...p, avatar_url: publicUrl }));
    } catch (err) {
      alert(err.message || "Failed to upload avatar image.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.content.trim()) {
      alert("Name and Content are required.");
      return;
    }

    try {
      if (editingItem) {
        await testimonialService.updateTestimonial(editingItem.id, form);
      } else {
        await testimonialService.createTestimonial(form);
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      alert(err.message || "Failed to save testimonial.");
    }
  };

  const handleTogglePublished = async (item) => {
    try {
      await testimonialService.togglePublished(item.id, item.is_published);
      loadData();
    } catch (err) {
      alert(err.message || "Failed to update publication status.");
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete review from "${name}"? This cannot be undone.`)) return;
    try {
      await testimonialService.deleteTestimonial(id);
      loadData();
    } catch (err) {
      alert(err.message || "Failed to delete testimonial.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111318] tracking-tight">
            Candidate & Partner Reviews
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Manage genuine feedback displayed across the recruitment portal.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2.5 rounded-xl border border-neutral-300 text-neutral-600 hover:bg-neutral-100 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center space-x-2 px-5 py-2.5 bg-teal-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-teal-900 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Review</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-teal-700 border-t-transparent animate-spin" />
        </div>
      ) : testimonials.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
          <Quote className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
          <h3 className="font-bold text-neutral-900">No Testimonials Yet</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            Add real candidate feedback from recent placements and recruitment drives.
          </p>
          <button
            onClick={openCreateModal}
            className="mt-4 px-4 py-2 bg-teal-800 text-white text-xs font-bold rounded-lg"
          >
            Add First Review
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col justify-between shadow-xs hover:border-neutral-300 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center space-x-3">
                    {item.avatar_url ? (
                      <img
                        src={item.avatar_url}
                        alt={item.name}
                        className="w-11 h-11 rounded-full object-cover border border-neutral-200"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-teal-50 text-teal-800 font-bold flex items-center justify-center text-sm border border-teal-200">
                        {item.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-sm text-neutral-900">{item.name}</h3>
                      <p className="text-xs text-neutral-500">
                        {item.role} {item.company ? `• ${item.company}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-neutral-700 leading-relaxed italic bg-neutral-50 p-4 rounded-xl border border-neutral-100 mb-4">
                  "{item.content}"
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                <button
                  onClick={() => handleTogglePublished(item)}
                  className={`flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
                    item.is_published
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {item.is_published ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Published</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Draft</span>
                    </>
                  )}
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.name)}
                    className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4" data-lenis-prevent="true">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl" data-lenis-prevent="true">
            <h2 className="text-lg font-bold text-neutral-900 mb-4">
              {editingItem ? "Edit Review" : "Add New Testimonial"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Candidate / Partner Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Srikanth Reddy"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-hidden focus:border-teal-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Role / Degree
                  </label>
                  <input
                    type="text"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    placeholder="e.g. Associate Engineer"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-hidden focus:border-teal-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Company Placed At
                  </label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder="e.g. Cognizant / TCS"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-hidden focus:border-teal-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Rating
                </label>
                <select
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-hidden focus:border-teal-700"
                >
                  <option value={5}>5 Stars - Excellent Placement Experience</option>
                  <option value={4}>4 Stars - Very Good</option>
                  <option value={3}>3 Stars - Good</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Avatar Photo (Optional)
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={uploadingAvatar}
                    className="text-xs file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-800 hover:file:bg-teal-100"
                  />
                  {uploadingAvatar && <span className="text-xs text-neutral-500 animate-pulse">Uploading...</span>}
                </div>
                {form.avatar_url && (
                  <div className="mt-2 flex items-center space-x-2">
                    <img
                      src={form.avatar_url}
                      alt="Preview"
                      className="w-8 h-8 rounded-full object-cover border"
                    />
                    <span className="text-[10px] text-neutral-500 truncate max-w-xs">{form.avatar_url}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Review Content *
                </label>
                <textarea
                  rows={4}
                  required
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Describe the placement support, training received, and drive outcome..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-hidden focus:border-teal-700"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="publishedToggle"
                  checked={form.is_published}
                  onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                  className="rounded text-teal-800 focus:ring-teal-700 h-4 w-4"
                />
                <label htmlFor="publishedToggle" className="text-xs font-semibold text-neutral-700">
                  Publish immediately on website
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-800 text-white text-xs font-bold hover:bg-teal-900"
                >
                  {editingItem ? "Update Review" : "Create Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
