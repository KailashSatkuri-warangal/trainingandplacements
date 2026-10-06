import { supabase } from "./supabaseClient";
import { JOBS_DATA } from "../data/jobs";

/**
 * Format DB snake_case record to camelCase frontend schema
 */
function mapFromDb(item) {
  if (!item) return null;
  return {
    id: item.id,
    company: item.company,
    companyCategory: item.company_category || item.companyCategory || "",
    title: item.title,
    category: item.category,
    location: item.location,
    workMode: item.work_mode || item.workMode || "Work From Office",
    experience: item.experience,
    salary: item.salary,
    salaryMin: Number(item.salary_min || item.salaryMin || 0),
    salaryMax: Number(item.salary_max || item.salaryMax || 0),
    featured: Boolean(item.featured),
    hiringStatus: item.hiring_status || item.hiringStatus || "Active",
    shifts: item.shifts || "",
    processType: item.process_type || item.processType || "",
    description: item.description || "",
    skills: Array.isArray(item.skills) ? item.skills : [],
    eligibility: Array.isArray(item.eligibility) ? item.eligibility : [],
    responsibilities: Array.isArray(item.responsibilities) ? item.responsibilities : [],
    applyUrl: item.apply_url || item.applyUrl || "",
    postedDate: item.posted_date || item.postedDate || new Date().toISOString().split("T")[0]
  };
}

/**
 * Format camelCase frontend schema to DB snake_case record
 */
function mapToDb(item) {
  return {
    id: item.id,
    company: item.company,
    company_category: item.companyCategory,
    title: item.title,
    category: item.category,
    location: item.location,
    work_mode: item.workMode,
    experience: item.experience,
    salary: item.salary,
    salary_min: item.salaryMin ? Number(item.salaryMin) : null,
    salary_max: item.salaryMax ? Number(item.salaryMax) : null,
    featured: Boolean(item.featured),
    hiring_status: item.hiringStatus,
    shifts: item.shifts,
    process_type: item.processType,
    description: item.description,
    skills: item.skills || [],
    eligibility: item.eligibility || [],
    responsibilities: item.responsibilities || [],
    apply_url: item.applyUrl,
    posted_date: item.postedDate || new Date().toISOString().split("T")[0]
  };
}

export const jobsService = {
  /**
   * Test database connectivity
   */
  async testConnection() {
    try {
      const { data, error } = await supabase.from("jobs").select("id").limit(1);
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true, count: data ? data.length : 0 };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  /**
   * Fetch all active jobs from Supabase PostgreSQL (with fallback to reference data)
   */
  async getAllJobs() {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .order("posted_date", { ascending: false });

      if (error || !data || data.length === 0) {
        console.warn("Using baseline verified drives (Supabase query notice):", error?.message || "No rows returned");
        return JOBS_DATA;
      }

      return data.map(mapFromDb);
    } catch (err) {
      console.warn("Falling back to local reference drives:", err.message);
      return JOBS_DATA;
    }
  },

  /**
   * Fetch single job by ID
   */
  async getJobById(id) {
    if (!id) return null;
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        return mapFromDb(data);
      }
    } catch (e) {
      // ignore & fallback
    }

    return JOBS_DATA.find((j) => j.id.toLowerCase() === id.toLowerCase()) || null;
  },

  /**
   * Create a new job in Supabase
   */
  async createJob(newJob) {
    const payload = mapToDb(newJob);
    const { data, error } = await supabase
      .from("jobs")
      .insert([payload])
      .select();

    if (error) {
      throw new Error(`Failed to create job in Supabase: ${error.message}`);
    }
    return data && data[0] ? mapFromDb(data[0]) : mapFromDb(payload);
  },

  /**
   * Update an existing job in Supabase
   */
  async updateJob(id, updatedJob) {
    const payload = mapToDb({ ...updatedJob, id });
    const { data, error } = await supabase
      .from("jobs")
      .update(payload)
      .eq("id", id)
      .select();

    if (error) {
      throw new Error(`Failed to update job: ${error.message}`);
    }
    return data && data[0] ? mapFromDb(data[0]) : mapFromDb(payload);
  },

  /**
   * Delete a job from Supabase
   */
  async deleteJob(id) {
    const { error } = await supabase
      .from("jobs")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to delete job: ${error.message}`);
    }
    return true;
  },

  /**
   * Seed/Sync the 23+ verified reference drives into Supabase PostgreSQL
   */
  async seedInitialJobs() {
    const payloads = JOBS_DATA.map(mapToDb);
    const { data, error } = await supabase
      .from("jobs")
      .upsert(payloads, { onConflict: "id" })
      .select();

    if (error) {
      throw new Error(`Database seeding failed: ${error.message}`);
    }
    return data.length;
  }
};
