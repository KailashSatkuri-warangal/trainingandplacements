import { supabase } from "../lib/supabase";
import { slugify } from "../utils/slugify";
import { DEMO_DRIVES } from "../data/demoData";

function getLocalDrives() {
  try {
    const raw = localStorage.getItem("tp_demo_drives");
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return DEMO_DRIVES;
}

function saveLocalDrives(drives) {
  try {
    localStorage.setItem("tp_demo_drives", JSON.stringify(drives));
  } catch (e) {}
}

export const driveService = {
  /**
   * Fetch published hiring drives for public candidates with server-side filters & pagination
   */
  async getPublishedDrives({
    page = 1,
    limit = 12,
    search = "",
    categoryId = "",
    categoryName = "",
    location = "",
    experience = "",
    workMode = "",
    companyId = "",
    sortBy = "newest"
  } = {}) {
    try {
      let query = supabase
        .from("hiring_drives")
        .select(`
          *,
          company:companies(id, name, slug, logo_url, industry, location),
          category:categories(id, name, slug)
        `, { count: "exact" })
        .eq("status", "PUBLISHED");

      if (search && search.trim()) {
        const term = `%${search.trim()}%`;
        query = query.or(`title.ilike.${term},description.ilike.${term},location.ilike.${term}`);
      }

      if (categoryId && categoryId !== "All Drives") {
        query = query.eq("category_id", categoryId);
      } else if (categoryName && categoryName !== "All Drives") {
        query = query.eq("category.name", categoryName);
      }

      if (companyId) {
        query = query.eq("company_id", companyId);
      }

      if (location) {
        query = query.ilike("location", `%${location}%`);
      }

      if (workMode && workMode !== "All Work Modes") {
        query = query.ilike("work_mode", `%${workMode}%`);
      }

      if (experience === "Freshers") {
        query = query.ilike("experience", "%fresher%");
      } else if (experience && experience !== "All Experience") {
        query = query.ilike("experience", `%${experience}%`);
      }

      if (sortBy === "salary-high") {
        query = query.order("salary_max", { ascending: false, nullsFirst: false });
      } else if (sortBy === "salary-low") {
        query = query.order("salary_min", { ascending: true, nullsFirst: false });
      } else if (sortBy === "featured") {
        query = query.order("featured", { ascending: false }).order("posted_at", { ascending: false });
      } else if (sortBy === "oldest") {
        query = query.order("posted_at", { ascending: true });
      } else {
        query = query.order("posted_at", { ascending: false }).order("created_at", { ascending: false });
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;
      if (!error && data && data.length > 0) {
        return {
          drives: data,
          total: count || data.length,
          page,
          totalPages: Math.ceil((count || data.length) / limit)
        };
      }
    } catch (e) {}

    // Fallback: Query comprehensive demo dataset
    let list = getLocalDrives().filter((d) => d.status === "PUBLISHED");

    if (search && search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          (d.company?.name || "").toLowerCase().includes(q) ||
          (d.location || "").toLowerCase().includes(q) ||
          (d.skills || []).some((s) => s.toLowerCase().includes(q))
      );
    }

    if (categoryName && categoryName !== "All Drives") {
      list = list.filter(
        (d) =>
          d.category?.name === categoryName ||
          d.category_id === categoryName ||
          d.category === categoryName
      );
    }

    if (workMode && workMode !== "All Work Modes") {
      list = list.filter((d) => (d.work_mode || "").toLowerCase().includes(workMode.toLowerCase()));
    }

    if (experience && experience !== "All Experience") {
      if (experience === "Freshers") {
        list = list.filter((d) => (d.experience || "").toLowerCase().includes("fresher"));
      } else {
        list = list.filter((d) => (d.experience || "").toLowerCase().includes(experience.toLowerCase()));
      }
    }

    if (sortBy === "salary-high") {
      list.sort((a, b) => (b.salary_max || 0) - (a.salary_max || 0));
    } else if (sortBy === "salary-low") {
      list.sort((a, b) => (a.salary_min || 0) - (b.salary_min || 0));
    } else if (sortBy === "featured") {
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    } else {
      list.sort((a, b) => new Date(b.posted_at || b.created_at) - new Date(a.posted_at || a.created_at));
    }

    const total = list.length;
    const startIndex = (page - 1) * limit;
    const paged = list.slice(startIndex, startIndex + limit);

    return {
      drives: paged,
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit))
    };
  },

  /**
   * Fetch featured published drives
   */
  async getFeaturedDrives(limit = 6) {
    try {
      const { data, error } = await supabase
        .from("hiring_drives")
        .select(`
          *,
          company:companies(id, name, slug, logo_url, industry, location),
          category:categories(id, name, slug)
        `)
        .eq("status", "PUBLISHED")
        .eq("featured", true)
        .order("posted_at", { ascending: false })
        .limit(limit);

      if (!error && data && data.length > 0) return data;
    } catch (e) {}

    return getLocalDrives()
      .filter((d) => d.status === "PUBLISHED" && d.featured)
      .slice(0, limit);
  },

  /**
   * Fetch latest published drives for homepage
   */
  async getLatestDrives(limit = 4) {
    try {
      const { data, error } = await supabase
        .from("hiring_drives")
        .select(`
          *,
          company:companies(id, name, slug, logo_url, industry, location),
          category:categories(id, name, slug)
        `)
        .eq("status", "PUBLISHED")
        .order("posted_at", { ascending: false })
        .limit(limit);

      if (!error && data && data.length > 0) return data;
    } catch (e) {}

    return getLocalDrives()
      .filter((d) => d.status === "PUBLISHED")
      .slice(0, limit);
  },

  /**
   * Get single drive by slug or ID
   */
  async getDriveBySlug(slug) {
    if (!slug) return null;
    try {
      const { data, error } = await supabase
        .from("hiring_drives")
        .select(`
          *,
          company:companies(id, name, slug, logo_url, description, website, industry, location),
          category:categories(id, name, slug)
        `)
        .eq("slug", slug)
        .maybeSingle();

      if (data) return data;

      const { data: byId } = await supabase
        .from("hiring_drives")
        .select(`
          *,
          company:companies(id, name, slug, logo_url, description, website, industry, location),
          category:categories(id, name, slug)
        `)
        .eq("id", slug)
        .maybeSingle();

      if (byId) return byId;
    } catch (e) {}

    return (
      getLocalDrives().find((d) => d.slug === slug || d.id === slug) || null
    );
  },

  /**
   * Safe view increment
   */
  async incrementViews(slug) {
    if (!slug) return;
    try {
      await supabase.rpc("increment_drive_views", { drive_slug: slug });
    } catch (e) {}

    const drives = getLocalDrives();
    const drive = drives.find((d) => d.slug === slug || d.id === slug);
    if (drive) {
      drive.views = (drive.views || 0) + 1;
      saveLocalDrives(drives);
    }
  },

  /**
   * ADMIN: Get all hiring drives (including DRAFT, CLOSED, ARCHIVED)
   */
  async getAllAdminDrives({ search = "", status = "", categoryId = "" } = {}) {
    try {
      let query = supabase
        .from("hiring_drives")
        .select(`
          *,
          company:companies(id, name, slug, logo_url),
          category:categories(id, name, slug)
        `)
        .order("created_at", { ascending: false });

      if (search && search.trim()) {
        const term = `%${search.trim()}%`;
        query = query.or(`title.ilike.${term},location.ilike.${term}`);
      }

      if (status && status !== "ALL") {
        query = query.eq("status", status);
      }

      if (categoryId && categoryId !== "ALL") {
        query = query.eq("category_id", categoryId);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) return data;
    } catch (e) {}

    // Fallback: Return all demo drives with all statuses
    let list = getLocalDrives();

    if (search && search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          (d.company?.name || "").toLowerCase().includes(q) ||
          (d.location || "").toLowerCase().includes(q)
      );
    }

    if (status && status !== "ALL") {
      list = list.filter((d) => d.status === status);
    }

    if (categoryId && categoryId !== "ALL") {
      list = list.filter((d) => d.category_id === categoryId || d.category?.name === categoryId);
    }

    return list;
  },

  /**
   * ADMIN: Create new hiring drive
   */
  async createDrive(driveData) {
    const slug = slugify(driveData.title);
    const newDrive = {
      ...driveData,
      id: `drive-${Date.now()}`,
      slug,
      views: 0,
      created_at: new Date().toISOString(),
      posted_at: driveData.status === "PUBLISHED" ? new Date().toISOString() : null
    };

    try {
      const { data, error } = await supabase
        .from("hiring_drives")
        .insert([{ ...driveData, slug }])
        .select()
        .single();
      if (!error && data) {
        const local = getLocalDrives();
        saveLocalDrives([data, ...local]);
        return data;
      }
    } catch (e) {}

    const local = getLocalDrives();
    saveLocalDrives([newDrive, ...local]);
    return newDrive;
  },

  /**
   * ADMIN: Update existing hiring drive
   */
  async updateDrive(id, driveData) {
    try {
      const { data, error } = await supabase
        .from("hiring_drives")
        .update({ ...driveData, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (!error && data) {
        const local = getLocalDrives();
        saveLocalDrives(local.map((d) => (d.id === id ? { ...d, ...data } : d)));
        return data;
      }
    } catch (e) {}

    const local = getLocalDrives();
    const updated = local.map((d) => (d.id === id ? { ...d, ...driveData } : d));
    saveLocalDrives(updated);
    return updated.find((d) => d.id === id);
  },

  /**
   * ADMIN: Toggle drive status
   */
  async toggleStatus(id, currentStatus) {
    const nextStatus = currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    try {
      const { data, error } = await supabase
        .from("hiring_drives")
        .update({
          status: nextStatus,
          posted_at: nextStatus === "PUBLISHED" ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq("id", id)
        .select()
        .single();
      if (!error && data) {
        const local = getLocalDrives();
        saveLocalDrives(local.map((d) => (d.id === id ? { ...d, status: nextStatus } : d)));
        return data;
      }
    } catch (e) {}

    const local = getLocalDrives();
    const updated = local.map((d) => (d.id === id ? { ...d, status: nextStatus } : d));
    saveLocalDrives(updated);
    return updated.find((d) => d.id === id);
  },

  /**
   * ADMIN: Toggle featured flag
   */
  async toggleFeatured(id, currentFeatured) {
    try {
      const { data, error } = await supabase
        .from("hiring_drives")
        .update({ featured: !currentFeatured, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (!error && data) {
        const local = getLocalDrives();
        saveLocalDrives(local.map((d) => (d.id === id ? { ...d, featured: !currentFeatured } : d)));
        return data;
      }
    } catch (e) {}

    const local = getLocalDrives();
    const updated = local.map((d) => (d.id === id ? { ...d, featured: !currentFeatured } : d));
    saveLocalDrives(updated);
    return updated.find((d) => d.id === id);
  },

  /**
   * ADMIN: Delete drive
   */
  async deleteDrive(id) {
    try {
      await supabase.from("hiring_drives").delete().eq("id", id);
    } catch (e) {}

    const local = getLocalDrives();
    saveLocalDrives(local.filter((d) => d.id !== id));
    return true;
  }
};
