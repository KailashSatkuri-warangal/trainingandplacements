import { supabase } from "../lib/supabase";
import { slugify } from "../utils/slugify";
import { DEMO_COMPANIES } from "../data/demoData";

export function resolveCompanyLogo(name = "", currentUrl = "") {
  if (currentUrl && !currentUrl.includes("unsplash.com")) return currentUrl;
  const n = (name || "").toLowerCase();
  if (n.includes("cognizant")) return "/images/companies/cognizant.svg";
  if (n.includes("teleperformance")) return "/images/companies/teleperformance.svg";
  if (n.includes("r1") || n.includes("rcm")) return "/images/companies/r1rcm.svg";
  if (n.includes("capgemini")) return "/images/companies/capgemini.svg";
  if (n.includes("tech mahindra") || n.includes("techm")) return "/images/companies/techmahindra.svg";
  if (n.includes("concentrix")) return "/images/companies/concentrix.svg";
  if (n.includes("deloitte")) return "/images/companies/deloitte.svg";
  if (n.includes("wipro")) return "/images/companies/wipro.svg";
  if (n.includes("tcs") || n.includes("tata")) return "/images/companies/tcs.svg";
  if (n.includes("infosys")) return "/images/companies/infosys.svg";
  return currentUrl || "/images/companies/legacy.svg";
}

function getLocalCompanies() {
  try {
    const raw = localStorage.getItem("tp_demo_companies");
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed.map((c) => ({
        ...c,
        logo_url: resolveCompanyLogo(c.name, c.logo_url)
      }));
    }
  } catch (e) {}
  return DEMO_COMPANIES.map((c) => ({
    ...c,
    logo_url: resolveCompanyLogo(c.name, c.logo_url)
  }));
}

function saveLocalCompanies(comps) {
  try {
    localStorage.setItem("tp_demo_companies", JSON.stringify(comps));
  } catch (e) {}
}

export const companyService = {
  /**
   * Fetch active companies for public partner grid & filter dropdowns
   */
  async getActiveCompanies() {
    try {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("is_active", true)
        .order("name", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((c) => ({
          ...c,
          logo_url: resolveCompanyLogo(c.name, c.logo_url)
        }));
      }
    } catch (e) {}

    return getLocalCompanies().filter((c) => c.is_active);
  },

  /**
   * ADMIN: Fetch all companies
   */
  async getAllAdminCompanies() {
    try {
      const { data, error } = await supabase
        .from("companies")
        .select(`
          *,
          drives:hiring_drives(id)
        `)
        .order("name", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((c) => ({
          ...c,
          logo_url: resolveCompanyLogo(c.name, c.logo_url)
        }));
      }
    } catch (e) {}

    return getLocalCompanies();
  },

  /**
   * ADMIN: Create company
   */
  async createCompany(companyData) {
    const slug = slugify(companyData.slug || companyData.name);
    const logo_url = resolveCompanyLogo(companyData.name, companyData.logo_url);
    const newComp = {
      ...companyData,
      id: `comp-${Date.now()}`,
      slug,
      logo_url,
      created_at: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase
        .from("companies")
        .insert([{ ...companyData, slug, logo_url }])
        .select()
        .single();

      if (!error && data) {
        const local = getLocalCompanies();
        saveLocalCompanies([data, ...local]);
        return data;
      }
    } catch (e) {}

    const local = getLocalCompanies();
    saveLocalCompanies([newComp, ...local]);
    return newComp;
  },

  /**
   * ADMIN: Update company
   */
  async updateCompany(id, companyData) {
    const logo_url = resolveCompanyLogo(companyData.name, companyData.logo_url);
    try {
      const { data, error } = await supabase
        .from("companies")
        .update({ ...companyData, logo_url, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (!error && data) {
        const local = getLocalCompanies();
        saveLocalCompanies(local.map((c) => (c.id === id ? { ...c, ...companyData, logo_url } : c)));
        return data;
      }
    } catch (e) {}

    const local = getLocalCompanies();
    const updated = local.map((c) => (c.id === id ? { ...c, ...companyData, logo_url } : c));
    saveLocalCompanies(updated);
    return updated.find((c) => c.id === id);
  },

  /**
   * ADMIN: Delete company
   */
  async deleteCompany(id) {
    try {
      await supabase.from("companies").delete().eq("id", id);
    } catch (e) {}

    const local = getLocalCompanies();
    saveLocalCompanies(local.filter((c) => c.id !== id));
    return true;
  }
};
