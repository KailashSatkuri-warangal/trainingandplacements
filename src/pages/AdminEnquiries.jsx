import { useState, useEffect } from "react";
import { Mail, Phone, Calendar, RefreshCw, CheckCircle2, AlertCircle, Clock, Archive, ExternalLink, Filter } from "lucide-react";
import { contactService } from "../services/contactService";
import { formatDate } from "../utils/formatters";

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  const loadEnquiries = async () => {
    setLoading(true);
    try {
      const data = await contactService.getAllEnquiries({
        status: statusFilter,
        type: typeFilter
      });
      setEnquiries(data || []);
    } catch (err) {
      console.error("Error loading enquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, [statusFilter, typeFilter]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await contactService.updateEnquiryStatus(id, newStatus);
      // Update local state directly
      setEnquiries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert(err.message || "Failed to update enquiry status.");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "NEW":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "CONTACTED":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "RESOLVED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "ARCHIVED":
        return "bg-neutral-100 text-neutral-600 border-neutral-200";
      default:
        return "bg-neutral-100 text-neutral-600 border-neutral-200";
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case "RECRUITER":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "EMPLOYER":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "CANDIDATE":
        return "bg-teal-50 text-teal-700 border-teal-200";
      default:
        return "bg-neutral-50 text-neutral-700 border-neutral-200";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111318] tracking-tight">
            Contact & Recruiter Enquiries
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Incoming queries from candidates, HR recruiters, and hiring managers.
          </p>
        </div>

        <button
          onClick={loadEnquiries}
          disabled={loading}
          className="self-start sm:self-auto p-2.5 rounded-xl border border-neutral-300 text-neutral-600 hover:bg-neutral-100 transition-colors flex items-center space-x-2 text-xs font-bold"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-xl border border-neutral-200 text-xs shadow-xs">
          <Filter className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-neutral-500 font-semibold">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent font-bold text-neutral-800 focus:outline-hidden"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="RESOLVED">Resolved</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-xl border border-neutral-200 text-xs shadow-xs">
          <span className="text-neutral-500 font-semibold">Sender Type:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-transparent font-bold text-neutral-800 focus:outline-hidden"
          >
            <option value="ALL">All Types</option>
            <option value="CANDIDATE">Candidate</option>
            <option value="RECRUITER">Recruiter</option>
            <option value="EMPLOYER">Employer / Company</option>
            <option value="GENERAL">General</option>
          </select>
        </div>

        <span className="text-xs text-neutral-500 ml-auto font-mono">
          Showing {enquiries.length} {enquiries.length === 1 ? "entry" : "entries"}
        </span>
      </div>

      {/* Table or Cards */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-teal-700 border-t-transparent animate-spin" />
        </div>
      ) : enquiries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
          <Mail className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
          <h3 className="font-bold text-neutral-900">No Enquiries Found</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            Queries submitted via the public contact desk will appear here in real-time.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Sender</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Subject & Excerpt</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {enquiries.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-neutral-900">
                      <div>{item.name}</div>
                      <div className="text-[11px] text-neutral-500 font-mono flex items-center gap-2 mt-0.5">
                        <span>{item.email}</span>
                        {item.phone && <span>• {item.phone}</span>}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getTypeBadge(item.type)}`}>
                        {item.type || "GENERAL"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-semibold text-neutral-800 truncate">
                        {item.subject || "No Subject"}
                      </div>
                      <div className="text-neutral-500 truncate text-[11px]">
                        {item.message}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-neutral-500 whitespace-nowrap text-[11px]">
                      {formatDate(item.created_at)}
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={item.status || "NEW"}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        className={`text-[10px] font-bold rounded-lg px-2 py-1 border focus:outline-hidden ${getStatusBadge(
                          item.status
                        )}`}
                      >
                        <option value="NEW">NEW</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="RESOLVED">RESOLVED</option>
                        <option value="ARCHIVED">ARCHIVED</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedEnquiry(item)}
                        className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-[11px] transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Enquiry Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between pb-4 border-b border-neutral-100">
              <div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getTypeBadge(selectedEnquiry.type)}`}>
                  {selectedEnquiry.type} INQUIRY
                </span>
                <h2 className="text-lg font-bold text-neutral-900 mt-2">
                  {selectedEnquiry.subject || "General Inquiry"}
                </h2>
                <p className="text-xs text-neutral-400">
                  Received on {formatDate(selectedEnquiry.created_at)}
                </p>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(selectedEnquiry.status)}`}>
                {selectedEnquiry.status}
              </span>
            </div>

            <div className="space-y-3 bg-neutral-50 p-4 rounded-xl border border-neutral-200 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-neutral-500 font-semibold">Sender:</span>
                <span className="col-span-2 font-bold text-neutral-800">{selectedEnquiry.name}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-neutral-500 font-semibold">Email:</span>
                <a
                  href={`mailto:${selectedEnquiry.email}`}
                  className="col-span-2 text-teal-800 hover:underline flex items-center gap-1 font-mono"
                >
                  <Mail className="w-3 h-3" />
                  <span>{selectedEnquiry.email}</span>
                </a>
              </div>
              {selectedEnquiry.phone && (
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-neutral-500 font-semibold">Phone:</span>
                  <a
                    href={`tel:${selectedEnquiry.phone}`}
                    className="col-span-2 text-teal-800 hover:underline flex items-center gap-1 font-mono"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{selectedEnquiry.phone}</span>
                  </a>
                </div>
              )}
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                Message Content
              </h4>
              <p className="text-xs text-neutral-800 whitespace-pre-wrap leading-relaxed bg-white border border-neutral-200 p-4 rounded-xl">
                {selectedEnquiry.message}
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <label className="text-xs font-bold text-neutral-600">Status:</label>
                <select
                  value={selectedEnquiry.status}
                  onChange={(e) => handleStatusChange(selectedEnquiry.id, e.target.value)}
                  className="text-xs font-bold px-2.5 py-1.5 rounded-lg border border-neutral-300 focus:outline-hidden"
                >
                  <option value="NEW">NEW</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>

              <div className="flex items-center space-x-3">
                <a
                  href={`mailto:${selectedEnquiry.email}?subject=RE: ${encodeURIComponent(
                    selectedEnquiry.subject || "TrainingAndPlacements Query"
                  )}`}
                  className="px-4 py-2 bg-teal-800 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 hover:bg-teal-900"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedEnquiry(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-100"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
