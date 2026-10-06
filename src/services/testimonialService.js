import { supabase } from "../lib/supabase";
import { DEMO_TESTIMONIALS } from "../data/demoData";

function getLocalTestimonials() {
  try {
    const raw = localStorage.getItem("tp_demo_testimonials");
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return DEMO_TESTIMONIALS;
}

function saveLocalTestimonials(tests) {
  try {
    localStorage.setItem("tp_demo_testimonials", JSON.stringify(tests));
  } catch (e) {}
}

export const testimonialService = {
  /**
   * Public: Fetch published testimonials
   */
  async getPublishedTestimonials() {
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) return data;
    } catch (e) {}

    return getLocalTestimonials().filter((t) => t.is_published);
  },

  /**
   * ADMIN: Fetch all testimonials
   */
  async getAllAdminTestimonials() {
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) return data;
    } catch (e) {}

    return getLocalTestimonials();
  },

  /**
   * ADMIN: Create testimonial
   */
  async createTestimonial(testData) {
    const newTest = {
      ...testData,
      id: `test-${Date.now()}`,
      created_at: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase
        .from("testimonials")
        .insert([testData])
        .select()
        .single();

      if (!error && data) {
        const local = getLocalTestimonials();
        saveLocalTestimonials([data, ...local]);
        return data;
      }
    } catch (e) {}

    const local = getLocalTestimonials();
    saveLocalTestimonials([newTest, ...local]);
    return newTest;
  },

  /**
   * ADMIN: Update testimonial
   */
  async updateTestimonial(id, testData) {
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .update({ ...testData, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (!error && data) {
        const local = getLocalTestimonials();
        saveLocalTestimonials(local.map((t) => (t.id === id ? { ...t, ...testData } : t)));
        return data;
      }
    } catch (e) {}

    const local = getLocalTestimonials();
    const updated = local.map((t) => (t.id === id ? { ...t, ...testData } : t));
    saveLocalTestimonials(updated);
    return updated.find((t) => t.id === id);
  },

  /**
   * ADMIN: Toggle published
   */
  async togglePublished(id, currentPublished) {
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .update({ is_published: !currentPublished, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (!error && data) {
        const local = getLocalTestimonials();
        saveLocalTestimonials(
          local.map((t) => (t.id === id ? { ...t, is_published: !currentPublished } : t))
        );
        return data;
      }
    } catch (e) {}

    const local = getLocalTestimonials();
    const updated = local.map((t) =>
      t.id === id ? { ...t, is_published: !currentPublished } : t
    );
    saveLocalTestimonials(updated);
    return updated.find((t) => t.id === id);
  },

  /**
   * ADMIN: Delete testimonial
   */
  async deleteTestimonial(id) {
    try {
      await supabase.from("testimonials").delete().eq("id", id);
    } catch (e) {}

    const local = getLocalTestimonials();
    saveLocalTestimonials(local.filter((t) => t.id !== id));
    return true;
  }
};
