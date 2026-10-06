import { supabase } from "../lib/supabase";
import {
  DEMO_DRIVES,
  DEMO_COMPANIES,
  DEMO_APPLICATIONS,
  DEMO_ENQUIRIES,
  DEMO_CATEGORIES,
  DEMO_TESTIMONIALS
} from "../data/demoData";

export const dashboardService = {
  /**
   * ADMIN: Comprehensive dashboard metrics with fallback to demo data
   */
  async getAdminMetrics() {
    try {
      // Execute parallel count queries
      const [
        drivesRes,
        publishedRes,
        draftRes,
        closedRes,
        companiesRes,
        applicationsRes,
        newApplicationsRes,
        enquiriesRes,
        newEnquiriesRes,
        categoriesRes,
        testimonialsRes
      ] = await Promise.all([
        supabase.from("hiring_drives").select("id", { count: "exact", head: true }),
        supabase.from("hiring_drives").select("id", { count: "exact", head: true }).eq("status", "PUBLISHED"),
        supabase.from("hiring_drives").select("id", { count: "exact", head: true }).eq("status", "DRAFT"),
        supabase.from("hiring_drives").select("id", { count: "exact", head: true }).eq("status", "CLOSED"),
        supabase.from("companies").select("id", { count: "exact", head: true }),
        supabase.from("applications").select("id", { count: "exact", head: true }),
        supabase.from("applications").select("id", { count: "exact", head: true }).eq("status", "APPLIED"),
        supabase.from("contact_enquiries").select("id", { count: "exact", head: true }),
        supabase.from("contact_enquiries").select("id", { count: "exact", head: true }).eq("status", "NEW"),
        supabase.from("categories").select("id", { count: "exact", head: true }),
        supabase.from("testimonials").select("id", { count: "exact", head: true })
      ]);

      // If Supabase has data, load recent items
      if (drivesRes.count && drivesRes.count > 0) {
        const { data: recentDrives } = await supabase
          .from("hiring_drives")
          .select("id, title, slug, status, location, salary_text, created_at, company:companies(name)")
          .order("created_at", { ascending: false })
          .limit(5);

        const { data: recentApplications } = await supabase
          .from("applications")
          .select("id, candidate_name, email, phone, status, created_at, drive:hiring_drives(title)")
          .order("created_at", { ascending: false })
          .limit(5);

        const { data: recentEnquiries } = await supabase
          .from("contact_enquiries")
          .select("id, name, email, type, subject, status, created_at")
          .order("created_at", { ascending: false })
          .limit(5);

        return {
          counts: {
            totalDrives: drivesRes.count || 0,
            publishedDrives: publishedRes.count || 0,
            draftDrives: draftRes.count || 0,
            closedDrives: closedRes.count || 0,
            totalCompanies: companiesRes.count || 0,
            totalApplications: applicationsRes.count || 0,
            newApplications: newApplicationsRes.count || 0,
            totalEnquiries: enquiriesRes.count || 0,
            newEnquiries: newEnquiriesRes.count || 0,
            totalCategories: categoriesRes.count || 0,
            totalTestimonials: testimonialsRes.count || 0
          },
          recentDrives: recentDrives || [],
          recentApplications: recentApplications || [],
          recentEnquiries: recentEnquiries || []
        };
      }

      // Fallback: Compute counts from comprehensive demo dataset
      return this.getDemoMetrics();
    } catch (error) {
      return this.getDemoMetrics();
    }
  },

  getDemoMetrics() {
    const drives = JSON.parse(localStorage.getItem("tp_demo_drives") || "null") || DEMO_DRIVES;
    const applications = JSON.parse(localStorage.getItem("tp_demo_applications") || "null") || DEMO_APPLICATIONS;
    const enquiries = JSON.parse(localStorage.getItem("tp_demo_enquiries") || "null") || DEMO_ENQUIRIES;
    const companies = JSON.parse(localStorage.getItem("tp_demo_companies") || "null") || DEMO_COMPANIES;
    const categories = JSON.parse(localStorage.getItem("tp_demo_categories") || "null") || DEMO_CATEGORIES;
    const testimonials = JSON.parse(localStorage.getItem("tp_demo_testimonials") || "null") || DEMO_TESTIMONIALS;

    return {
      counts: {
        totalDrives: drives.length,
        publishedDrives: drives.filter((d) => d.status === "PUBLISHED").length,
        draftDrives: drives.filter((d) => d.status === "DRAFT").length,
        closedDrives: drives.filter((d) => d.status === "CLOSED").length,
        totalCompanies: companies.length,
        totalApplications: applications.length,
        newApplications: applications.filter((a) => a.status === "APPLIED").length,
        totalEnquiries: enquiries.length,
        newEnquiries: enquiries.filter((e) => e.status === "NEW").length,
        totalCategories: categories.length,
        totalTestimonials: testimonials.length
      },
      recentDrives: drives.slice(0, 5),
      recentApplications: applications.slice(0, 5),
      recentEnquiries: enquiries.slice(0, 5)
    };
  },

  /**
   * Public Safe Stats
   */
  async getPublicStats() {
    try {
      const [drivesCount, companiesCount] = await Promise.all([
        supabase.from("hiring_drives").select("id", { count: "exact", head: true }).eq("status", "PUBLISHED"),
        supabase.from("companies").select("id", { count: "exact", head: true }).eq("is_active", true)
      ]);

      if (drivesCount.count) {
        return {
          publishedDrives: drivesCount.count,
          activeCompanies: companiesCount.count || 15
        };
      }
      return { publishedDrives: 23, activeCompanies: 15 };
    } catch {
      return { publishedDrives: 23, activeCompanies: 15 };
    }
  }
};
