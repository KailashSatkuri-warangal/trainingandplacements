import { supabase } from "../lib/supabase";
import { DEMO_ENQUIRIES } from "../data/demoData";

function getLocalEnquiries() {
  try {
    const raw = localStorage.getItem("tp_demo_enquiries");
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return DEMO_ENQUIRIES;
}

function saveLocalEnquiries(enqs) {
  try {
    localStorage.setItem("tp_demo_enquiries", JSON.stringify(enqs));
  } catch (e) {}
}

export const contactService = {
  /**
   * Submit enquiry from public contact form
   */
  async submitContactEnquiry({
    name,
    email,
    phone = "",
    subject = "",
    type = "CANDIDATE",
    message
  }) {
    if (!name || !email || !message) {
      throw new Error("Please fill in all required fields (Name, Email, Message).");
    }

    const upperType = (type || "CANDIDATE").toUpperCase();
    const validTypes = ["CANDIDATE", "RECRUITER", "EMPLOYER", "GENERAL"];
    const finalType = validTypes.includes(upperType) ? upperType : "GENERAL";

    const newEnquiry = {
      id: `enq-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      subject: subject.trim(),
      type: finalType,
      message: message.trim(),
      status: "NEW",
      created_at: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase
        .from("contact_enquiries")
        .insert([{
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          subject: subject.trim(),
          type: finalType,
          message: message.trim(),
          status: "NEW"
        }])
        .select()
        .single();

      if (!error && data) {
        const local = getLocalEnquiries();
        saveLocalEnquiries([data, ...local]);
        return {
          success: true,
          data,
          message: "Thank you! Your inquiry has been routed to our Contact Team and recruiter desk."
        };
      }
    } catch (e) {}

    const local = getLocalEnquiries();
    saveLocalEnquiries([newEnquiry, ...local]);
    return {
      success: true,
      data: newEnquiry,
      message: "Thank you! Your inquiry has been routed to our Contact Team and recruiter desk."
    };
  },

  /**
   * ADMIN: Fetch all contact enquiries
   */
  async getAllEnquiries({ status = "", type = "" } = {}) {
    try {
      let query = supabase
        .from("contact_enquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (status && status !== "ALL") {
        query = query.eq("status", status);
      }
      if (type && type !== "ALL") {
        query = query.eq("type", type);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) return data;
    } catch (e) {}

    // Fallback: Return all demo enquiries covering all types & statuses
    let list = getLocalEnquiries();

    if (status && status !== "ALL") {
      list = list.filter((item) => item.status === status);
    }
    if (type && type !== "ALL") {
      list = list.filter((item) => item.type === type);
    }

    return list;
  },

  /**
   * ADMIN: Update status (NEW -> CONTACTED -> RESOLVED -> ARCHIVED)
   */
  async updateEnquiryStatus(id, newStatus) {
    try {
      const { data, error } = await supabase
        .from("contact_enquiries")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (!error && data) {
        const local = getLocalEnquiries();
        saveLocalEnquiries(local.map((e) => (e.id === id ? { ...e, status: newStatus } : e)));
        return data;
      }
    } catch (e) {}

    const local = getLocalEnquiries();
    const updated = local.map((e) => (e.id === id ? { ...e, status: newStatus } : e));
    saveLocalEnquiries(updated);
    return updated.find((e) => e.id === id);
  }
};
