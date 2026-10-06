import { useState, useEffect } from "react";
import { FileText, Download, CheckCircle, Clock, Search, ExternalLink, RefreshCw } from "lucide-react";
import { applicationService } from "../services/applicationService";
import { storageService } from "../services/storageService";
import { formatDate } from "../utils/formatters";

export default function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedApp, setSelectedApp] = useState(null);
  const [notes, setNotes] = useState("");
  const [actionNotice, setActionNotice] = useState("");

  const loadApplications = async () => {
    setLoading(true);
    try {
      const data = await applicationService.getAllApplications({
        status: statusFilter !== "ALL" ? statusFilter : ""
      });
      setApplications(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [statusFilter]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await applicationService.updateApplicationStatus(id, newStatus);
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );
      setActionNotice(`Status updated to ${newStatus}`);
      setTimeout(() => setActionNotice(""), 3000);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedApp) return;
    try {
      await applicationService.updateApplicationStatus(selectedApp.id, selectedApp.status, notes);
      setApplications((prev) =>
        prev.map((a) => (a.id === selectedApp.id ? { ...a, notes } : a))
      );
      setSelectedApp((prev) => ({ ...prev, notes }));
      setActionNotice("Candidate review notes saved.");
      setTimeout(() => setActionNotice(""), 3000);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleResumeDownload = async (resumePath) => {
    try {
      const signedUrl = await storageService.getResumeSignedUrl(resumePath);
      if (signedUrl) {
        window.open(signedUrl, "_blank");
      } else {
        alert("Resume file unavailable or expired.");
      }
    } catch (err) {
      alert("Error generating secure resume link.");
    }
  };

  const STATUSES = ["APPLIED", "SCREENING", "SHORTLISTED", "INTERVIEW", "SELECTED", "REJECTED"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-teal-800 font-bold block mb-1">
            CANDIDATE APPLICATIONS DESK
          </span>
          <h1 className="editorial-title text-2xl sm:text-3xl text-[#111318]">
            Candidate Submissions.
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-[#e6e6df] rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
          >
            <option value="ALL">All Applications</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={loadApplications}
            className="p-2 bg-white border border-[#e6e6df] rounded-xl hover:bg-neutral-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl">
          {actionNotice}
        </div>
      )}

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-[#e6e6df] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#fbfbf9] border-b border-[#e6e6df] text-neutral-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Candidate</th>
                <th className="py-3.5 px-4">Contact Details</th>
                <th className="py-3.5 px-4">Target Hiring Drive</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Applied Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0ea]">
              {applications.length > 0 ? (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-[#fbfbf9] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#111318]">
                      {app.candidate_name}
                    </td>

                    <td className="py-3.5 px-4">
                      <div>{app.email}</div>
                      <div className="text-[11px] text-neutral-500 font-mono">{app.phone}</div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs font-medium text-teal-800">
                      <div className="truncate">{app.drive?.title || "Hiring Drive"}</div>
                      <div className="text-[10px] text-neutral-400">
                        {app.drive?.company?.name || "Client Partner"}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className="p-1 rounded-lg border border-[#e6e6df] bg-[#fbfbf9] text-[11px] font-bold text-teal-800 focus:outline-none"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-neutral-500">
                      {formatDate(app.created_at)}
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2">
                      {app.resume_url && (
                        <button
                          type="button"
                          onClick={() => handleResumeDownload(app.resume_url)}
                          className="px-2 py-1 bg-teal-50 text-teal-800 hover:bg-teal-100 rounded-lg text-[11px] font-semibold inline-flex items-center space-x-1"
                        >
                          <Download className="w-3 h-3" />
                          <span>Resume</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedApp(app);
                          setNotes(app.notes || "");
                        }}
                        className="px-2.5 py-1 bg-[#111318] text-white rounded-lg text-[11px] font-semibold hover:bg-teal-800"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-400">
                    No candidate applications matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review & Notes Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#e6e6df] max-w-xl w-full p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#e6e6df]">
              <div>
                <h3 className="text-base font-bold text-[#111318]">
                  Candidate Review: {selectedApp.candidate_name}
                </h3>
                <p className="text-xs text-neutral-500">
                  {selectedApp.email} • {selectedApp.phone}
                </p>
              </div>
              <button onClick={() => setSelectedApp(null)} className="text-neutral-400 hover:text-black">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#fbfbf9] rounded-xl border border-[#e6e6df]">
                <strong className="block text-[10px] uppercase font-bold text-neutral-500 mb-0.5">Applied Drive</strong>
                <p className="font-semibold text-[#111318]">{selectedApp.drive?.title}</p>
              </div>

              {selectedApp.cover_letter && (
                <div className="p-3 bg-[#fbfbf9] rounded-xl border border-[#e6e6df]">
                  <strong className="block text-[10px] uppercase font-bold text-neutral-500 mb-0.5">Candidate Note / Cover Letter</strong>
                  <p className="text-neutral-700 leading-relaxed">{selectedApp.cover_letter}</p>
                </div>
              )}

              <div>
                <label className="block font-bold text-neutral-800 mb-1">
                  Recruiter Screening Notes (Contact Team / Panel):
                </label>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record interview date, mock feedback, or client panel communication..."
                  className="w-full p-3 bg-[#fbfbf9] border border-[#e6e6df] rounded-xl"
                />
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between border-t border-[#e6e6df]">
              {selectedApp.resume_url ? (
                <button
                  type="button"
                  onClick={() => handleResumeDownload(selectedApp.resume_url)}
                  className="text-xs font-bold text-teal-800 hover:underline flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Private Resume</span>
                </button>
              ) : <div />}

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="px-5 py-2 bg-[#111318] hover:bg-teal-800 text-white rounded-xl text-xs font-bold"
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
