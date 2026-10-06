import { supabase } from "../lib/supabase";
import { DEMO_APPLICATIONS } from "../data/demoData";

function getLocalApplications() {
  try {
    const raw = localStorage.getItem("tp_demo_applications");
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return DEMO_APPLICATIONS;
}

function saveLocalApplications(apps) {
  try {
    localStorage.setItem("tp_demo_applications", JSON.stringify(apps));
  } catch (e) {}
}

export const applicationService = {
  /**
   * Candidate submits application for a hiring drive
   */
  async submitApplication({
    driveId,
    candidateName,
    email,
    phone,
    resumeUrl = null,
    coverLetter = ""
  }) {
    const newApp = {
      id: `app-${Date.now()}`,
      drive_id: driveId,
      candidate_name: candidateName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      resume_url: resumeUrl,
      cover_letter: coverLetter.trim(),
      status: "APPLIED",
      created_at: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase
        .from("applications")
        .insert([{
          drive_id: driveId,
          candidate_name: candidateName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          resume_url: resumeUrl,
          cover_letter: coverLetter.trim(),
          status: "APPLIED"
        }])
        .select()
        .single();

      if (!error && data) {
        const local = getLocalApplications();
        saveLocalApplications([data, ...local]);
        return data;
      }
    } catch (e) {}

    const local = getLocalApplications();
    saveLocalApplications([newApp, ...local]);
    return newApp;
  },

  /**
   * ADMIN: Fetch all applications with associated drive & company info
   */
  async getAllApplications({ driveId = "", status = "" } = {}) {
    try {
      let query = supabase
        .from("applications")
        .select(`
          *,
          drive:hiring_drives(id, title, slug, location, company:companies(name))
        `)
        .order("created_at", { ascending: false });

      if (driveId && driveId !== "ALL") {
        query = query.eq("drive_id", driveId);
      }
      if (status && status !== "ALL") {
        query = query.eq("status", status);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) return data;
    } catch (e) {}

    // Fallback: Return all demo applications with all status stages
    let list = getLocalApplications();

    if (driveId && driveId !== "ALL") {
      list = list.filter((a) => a.drive_id === driveId);
    }
    if (status && status !== "ALL") {
      list = list.filter((a) => a.status === status);
    }

    return list;
  },

  /**
   * ADMIN: Update status & review notes
   */
  async updateApplicationStatus(id, newStatus, notes = null) {
    try {
      const payload = {
        status: newStatus,
        updated_at: new Date().toISOString()
      };
      if (notes !== null) payload.notes = notes;

      const { data, error } = await supabase
        .from("applications")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

      if (!error && data) {
        const local = getLocalApplications();
        saveLocalApplications(local.map((a) => (a.id === id ? { ...a, ...payload } : a)));
        return data;
      }
    } catch (e) {}

    const local = getLocalApplications();
    const updated = local.map((a) =>
      a.id === id ? { ...a, status: newStatus, notes: notes !== null ? notes : a.notes } : a
    );
    saveLocalApplications(updated);
    return updated.find((a) => a.id === id);
  }
};
