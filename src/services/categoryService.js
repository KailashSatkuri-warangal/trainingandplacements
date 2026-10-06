import { supabase } from "../lib/supabase";
import { slugify } from "../utils/slugify";
import { DEMO_CATEGORIES, DEMO_DRIVES } from "../data/demoData";

function getLocalCategories() {
  try {
    const raw = localStorage.getItem("tp_demo_categories");
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return DEMO_CATEGORIES;
}

function saveLocalCategories(cats) {
  try {
    localStorage.setItem("tp_demo_categories", JSON.stringify(cats));
  } catch (e) {}
}

export const categoryService = {
  /**
   * Fetch active categories with count of published drives
   */
  async getActiveCategories() {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select(`
          *,
          drives:hiring_drives(id, status)
        `)
        .eq("is_active", true)
        .order("name", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((cat) => ({
          ...cat,
          publishedCount: (cat.drives || []).filter((d) => d.status === "PUBLISHED").length
        }));
      }
    } catch (e) {}

    // Fallback: Return active demo categories
    const localDrives = JSON.parse(localStorage.getItem("tp_demo_drives") || "null") || DEMO_DRIVES;
    return getLocalCategories()
      .filter((c) => c.is_active)
      .map((c) => ({
        ...c,
        publishedCount: localDrives.filter(
          (d) =>
            d.status === "PUBLISHED" &&
            (d.category_id === c.id || d.category?.name === c.name || d.category === c.name)
        ).length
      }));
  },

  /**
   * ADMIN: Fetch all categories
   */
  async getAllAdminCategories() {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select(`
          *,
          drives:hiring_drives(id)
        `)
        .order("name", { ascending: true });

      if (!error && data && data.length > 0) return data;
    } catch (e) {}

    const localDrives = JSON.parse(localStorage.getItem("tp_demo_drives") || "null") || DEMO_DRIVES;
    return getLocalCategories().map((c) => ({
      ...c,
      drives: localDrives.filter(
        (d) => d.category_id === c.id || d.category?.name === c.name || d.category === c.name
      )
    }));
  },

  /**
   * ADMIN: Create category
   */
  async createCategory(catData) {
    const slug = slugify(catData.slug || catData.name);
    const newCat = {
      ...catData,
      id: `cat-${Date.now()}`,
      slug,
      created_at: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase
        .from("categories")
        .insert([{ ...catData, slug }])
        .select()
        .single();

      if (!error && data) {
        const local = getLocalCategories();
        saveLocalCategories([data, ...local]);
        return data;
      }
    } catch (e) {}

    const local = getLocalCategories();
    saveLocalCategories([newCat, ...local]);
    return newCat;
  },

  /**
   * ADMIN: Update category
   */
  async updateCategory(id, catData) {
    try {
      const { data, error } = await supabase
        .from("categories")
        .update({ ...catData, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (!error && data) {
        const local = getLocalCategories();
        saveLocalCategories(local.map((c) => (c.id === id ? { ...c, ...catData } : c)));
        return data;
      }
    } catch (e) {}

    const local = getLocalCategories();
    const updated = local.map((c) => (c.id === id ? { ...c, ...catData } : c));
    saveLocalCategories(updated);
    return updated.find((c) => c.id === id);
  },

  /**
   * ADMIN: Delete category
   */
  async deleteCategory(id) {
    try {
      await supabase.from("categories").delete().eq("id", id);
    } catch (e) {}

    const local = getLocalCategories();
    saveLocalCategories(local.filter((c) => c.id !== id));
    return true;
  }
};
