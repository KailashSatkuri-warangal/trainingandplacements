import { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { contactService } from "../../services/contactService";
import { useNotifications } from "../../context/NotificationContext";

export default function ContactForm({ defaultType = "Candidate" }) {
  const { triggerNotification } = useNotifications();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    roleType: defaultType,
    message: "",
    hpCompany: "" // Honeypot field for bot protection
  });

  const [status, setStatus] = useState("idle"); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState("");
  const [referenceId, setReferenceId] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (status === "error") {
      setStatus("idle");
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Honeypot spam check
    if (formData.hpCompany) {
      setStatus("success");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await contactService.submitContactEnquiry({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        type: formData.roleType,
        message: formData.message
      });

      // Dispatch real-time phone push alert
      try {
        triggerNotification({
          type: "enquiry",
          title: "New Recruiter Enquiry",
          subtitle: `${formData.fullName} • ${formData.roleType}`,
          message: `${formData.subject || "General Inquiry"}: "${formData.message.slice(0, 80)}..."`,
          company: formData.roleType,
          tag: "Contact Desk",
          link: "/admin/enquiries"
        });
      } catch (notifErr) {
        console.debug("Phone notification note:", notifErr);
      }

      setStatus("success");
      setReferenceId(response.data?.id ? `TP-${String(response.data.id).slice(0, 6).toUpperCase()}` : `TP-${Math.floor(100000 + Math.random() * 900000)}`);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        roleType: defaultType,
        message: "",
        hpCompany: ""
      });
    } catch (err) {
      setStatus("error");
      setErrorMessage(err.message || "Failed to submit request. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#e6e6df] p-6 sm:p-10 shadow-sm">
      {status === "success" ? (
        <div className="py-10 text-center space-y-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-[#111318]">Message Sent Successfully</h3>
          <p className="text-sm text-[#4b5563] max-w-md mx-auto">
            Thank you! Your inquiry has been forwarded directly to Sandru Anudeep and our Hyderabad recruiter desk. We typically respond within 24 hours.
          </p>
          {referenceId && (
            <p className="text-xs font-mono bg-[#f4f4f0] px-3 py-1.5 rounded-lg inline-block text-neutral-600">
              Reference ID: {referenceId}
            </p>
          )}
          <div className="pt-4">
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="px-6 py-2.5 bg-[#111318] text-white text-xs font-semibold rounded-xl hover:bg-teal-800 transition-colors"
            >
              Send Another Inquiry
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Honeypot hidden input */}
          <input
            type="text"
            name="hpCompany"
            value={formData.hpCompany}
            onChange={handleChange}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          {/* Role Type Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4b5563] mb-2">
              I am reaching out as:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["Candidate", "Recruiter", "Employer"].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, roleType: role }))}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    formData.roleType === role
                      ? "bg-[#111318] text-white shadow-xs"
                      : "bg-[#fbfbf9] border border-[#e6e6df] text-[#4b5563] hover:text-[#111318]"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Full Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#111318] mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Rahul Sharma"
                className="w-full bg-[#fbfbf9] border border-[#e6e6df] rounded-xl px-4 py-3 text-sm text-[#111318] placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-teal-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111318] mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. rahul@example.com"
                className="w-full bg-[#fbfbf9] border border-[#e6e6df] rounded-xl px-4 py-3 text-sm text-[#111318] placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-teal-700"
              />
            </div>
          </div>

          {/* Phone & Subject */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#111318] mb-1.5">
                Mobile Number / WhatsApp
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full bg-[#fbfbf9] border border-[#e6e6df] rounded-xl px-4 py-3 text-sm text-[#111318] placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-teal-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111318] mb-1.5">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g. Capgemini Freshers Drive or Corporate Mandate"
                className="w-full bg-[#fbfbf9] border border-[#e6e6df] rounded-xl px-4 py-3 text-sm text-[#111318] placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-teal-700"
              />
            </div>
          </div>

          {/* Message Area */}
          <div>
            <label className="block text-xs font-semibold text-[#111318] mb-1.5">
              Message / Inquiry Details <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="message"
              required
              rows={4}
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us about your educational background, current experience, target roles, or corporate hiring requirement..."
              className="w-full bg-[#fbfbf9] border border-[#e6e6df] rounded-xl px-4 py-3 text-sm text-[#111318] placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-teal-700"
            />
          </div>

          {/* Error Notice */}
          {status === "error" && (
            <div className="flex items-center space-x-2 text-rose-600 bg-rose-50 border border-rose-200 p-3 rounded-xl text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full inline-flex items-center justify-center space-x-2 bg-[#111318] hover:bg-teal-800 text-white font-semibold py-4 rounded-xl text-sm transition-all duration-200 disabled:opacity-50 shadow-md"
            data-cursor
            data-cursor-label="SEND"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Forwarding to Recruiter Desk...</span>
              </>
            ) : (
              <>
                <span>Send Message</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
