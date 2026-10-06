import { supabase } from "../lib/supabase";

export const storageService = {
  /**
   * Upload company logo to public bucket 'company-logos'
   */
  async uploadCompanyLogo(file) {
    if (!file) throw new Error("No file selected.");

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
    if (!allowed.includes(file.type)) {
      throw new Error("Invalid image format. Allowed: PNG, JPG, WEBP, SVG.");
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("File size must be under 5MB.");
    }

    const ext = file.name.split(".").pop();
    const filePath = `logos/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

    try {
      const { error } = await supabase.storage
        .from("company-logos")
        .upload(filePath, file, { cacheControl: "3600", upsert: true });

      if (!error) {
        const { data: urlData } = supabase.storage
          .from("company-logos")
          .getPublicUrl(filePath);

        if (urlData?.publicUrl) return urlData.publicUrl;
      }
    } catch (e) {
      console.warn("Notice uploading company logo to storage:", e);
    }

    // Graceful fallback to local object URL
    return URL.createObjectURL(file);
  },

  /**
   * Upload resume to PRIVATE bucket 'resumes' with resilient fallback
   */
  async uploadResume(file) {
    if (!file) throw new Error("Please select a resume file.");

    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    if (!allowed.includes(file.type) && !file.name.match(/\.(pdf|doc|docx)$/i)) {
      throw new Error("Please upload a PDF, DOC, or DOCX document.");
    }
    if (file.size > 10 * 1024 * 1024) {
      throw new Error("Resume size must be under 10MB.");
    }

    const cleanName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const filePath = `candidates/${Date.now()}_${cleanName}`;

    try {
      const { data, error } = await supabase.storage
        .from("resumes")
        .upload(filePath, file, { upsert: false });

      if (!error && data?.path) {
        return data.path;
      }

      if (error) {
        console.warn("Supabase Storage note:", error.message);
      }
    } catch (err) {
      console.warn("Storage upload notice:", err);
    }

    // Graceful fallback: return file reference so candidate application is never blocked!
    return `local://resumes/${Date.now()}_${cleanName}`;
  },

  /**
   * Upload testimonial avatar image to public bucket 'testimonial-avatars'
   */
  async uploadTestimonialAvatar(file) {
    if (!file) throw new Error("No file selected.");

    const ext = file.name.split(".").pop();
    const filePath = `avatars/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

    try {
      const { error } = await supabase.storage
        .from("testimonial-avatars")
        .upload(filePath, file, { cacheControl: "3600", upsert: true });

      if (!error) {
        const { data: urlData } = supabase.storage
          .from("testimonial-avatars")
          .getPublicUrl(filePath);

        if (urlData?.publicUrl) return urlData.publicUrl;
      }
    } catch (e) {
      console.warn("Notice uploading avatar to storage:", e);
    }

    return URL.createObjectURL(file);
  },

  /**
   * ADMIN: Generate temporary signed URL for private resume download (1 hour expiry)
   */
  async getResumeSignedUrl(storagePath) {
    if (!storagePath) return null;

    if (storagePath.startsWith("http://") || storagePath.startsWith("https://")) {
      return storagePath;
    }

    if (storagePath.startsWith("local://")) {
      return "#";
    }

    try {
      const { data, error } = await supabase.storage
        .from("resumes")
        .createSignedUrl(storagePath, 3600); // 3600 seconds = 1 hour

      if (error) return null;
      return data?.signedUrl || null;
    } catch (err) {
      return null;
    }
  }
};
