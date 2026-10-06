import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, FolderTree } from "lucide-react";
import { categoryService } from "../services/categoryService";
import { slugify } from "../utils/slugify";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCat, setEditingCat] = useState(null);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    is_active: true
  });

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryService.getAllAdminCategories();
      setCategories(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCat(null);
    setForm({ name: "", slug: "", description: "", is_active: true });
    setShowModal(true);
  };

  const openEditModal = (cat) => {
    setEditingCat(cat);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      is_active: cat.is_active
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    try {
      if (editingCat) {
        await categoryService.updateCategory(editingCat.id, form);
      } else {
        await categoryService.createCategory(form);
      }
      setShowModal(false);
      await loadCategories();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category ${name}?`)) return;
    try {
      await categoryService.deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-teal-800 font-bold block mb-1">
            CAREER PATHWAYS & STREAMS
          </span>
          <h1 className="editorial-title text-2xl sm:text-3xl text-[#111318]">
            Career Categories.
          </h1>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 bg-[#111318] hover:bg-teal-800 text-white font-semibold text-xs px-5 py-3 rounded-xl transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#e6e6df] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#fbfbf9] border-b border-[#e6e6df] text-neutral-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Category Name</th>
                <th className="py-3.5 px-4">Slug</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">Active</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0ea]">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-[#fbfbf9] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#111318]">{c.name}</td>
                  <td className="py-3.5 px-4 font-mono text-neutral-500">{c.slug}</td>
                  <td className="py-3.5 px-4 max-w-xs truncate text-neutral-600">
                    {c.description}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.is_active
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      {c.is_active ? "Active" : "Disabled"}
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

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#e6e6df] max-w-md w-full p-6 sm:p-8 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-[#111318]">
              {editingCat ? "Edit Category" : "Add Category"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-800 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })
                  }
                  className="w-full p-2.5 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-1">Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
                  className="w-full p-2.5 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full p-2.5 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="activeCat"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="rounded text-teal-700 w-4 h-4"
                />
                <label htmlFor="activeCat" className="font-semibold text-neutral-800">
                  Active
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
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
