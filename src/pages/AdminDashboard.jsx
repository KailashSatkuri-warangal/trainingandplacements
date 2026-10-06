import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Building2,
  FileCheck2,
  Mail,
  PlusCircle,
  FolderTree,
  Quote,
  ArrowRight,
  Clock,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Smartphone,
  BellRing,
  Volume2,
  VolumeX,
  CheckCheck
} from "lucide-react";
import { dashboardService } from "../services/dashboardService";
import { useNotifications } from "../context/NotificationContext";
import { formatDate } from "../utils/formatters";

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const {
    notifications,
    unreadCount,
    toggleCenter,
    simulatePhoneNotification,
    soundEnabled,
    setSoundEnabled,
    markAsRead
  } = useNotifications();

  const loadData = async () => {
    setIsLoading(true);
    const data = await dashboardService.getAdminMetrics();
    setMetrics(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const counts = metrics?.counts || {};

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-teal-800 font-bold block mb-1">
            EXECUTIVE RECRUITER METRICS
          </span>
          <h1 className="editorial-title text-2xl sm:text-3xl lg:text-4xl text-[#111318]">
            Overview & Operations.
          </h1>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={loadData}
            disabled={isLoading}
            className="p-2.5 bg-white border border-[#e6e6df] rounded-xl hover:border-neutral-400 text-neutral-700 transition-colors"
            title="Refresh dashboard metrics"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>

          <Link
            to="/admin/drives/create"
            className="inline-flex items-center space-x-2 bg-[#111318] hover:bg-teal-800 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Drive</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#e6e6df] p-5 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">Total Drives</span>
            <Briefcase className="w-4 h-4 text-teal-700" />
          </div>
          <div className="text-3xl font-bold font-display text-[#111318]">
            {counts.totalDrives ?? 0}
          </div>
          <div className="flex items-center space-x-2 text-[11px] text-[#6b7280]">
            <span className="text-emerald-700 font-bold">{counts.publishedDrives ?? 0} Live</span>
            <span>•</span>
            <span>{counts.draftDrives ?? 0} Draft</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#e6e6df] p-5 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">Companies</span>
            <Building2 className="w-4 h-4 text-teal-700" />
          </div>
          <div className="text-3xl font-bold font-display text-[#111318]">
            {counts.totalCompanies ?? 0}
          </div>
          <div className="text-[11px] text-[#6b7280]">
            Active MNC hiring partners
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#e6e6df] p-5 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">Applications</span>
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-bold font-display text-[#111318]">
            {counts.totalApplications ?? 0}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold">
            {counts.newApplications ?? 0} awaiting screening
          </div>
        </div>

        {/* Notifications Card */}
        <div
          onClick={toggleCenter}
          className="bg-white rounded-2xl border border-[#e6e6df] p-5 space-y-2 cursor-pointer hover:border-teal-700 hover:shadow-sm transition-all group relative overflow-hidden"
          title="Click to open Notifications"
        >
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 group-hover:text-teal-800 transition-colors">
              Notifications
            </span>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <Bell className="w-4 h-4 text-teal-700" />
            </div>
          </div>
          <div className="text-3xl font-display font-bold text-[#111318] flex items-baseline space-x-2">
            <span>{unreadCount}</span>
            <span className="text-xs font-sans font-semibold text-neutral-400">Unread</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-teal-800 font-semibold pt-0.5">
            <span className="flex items-center space-x-1">
              <BellRing className="w-3.5 h-3.5 text-emerald-600" />
              <span>{notifications.length} total updates</span>
            </span>
            <span className="text-neutral-400 group-hover:text-teal-800 group-hover:translate-x-0.5 transition-all text-[11px]">
              Open Drawer →
            </span>
          </div>
        </div>
      </div>

      {/* Two-Column Operation Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Drives */}
        <div className="bg-white rounded-2xl border border-[#e6e6df] p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#f0f0ea]">
            <h3 className="text-sm font-bold text-[#111318] flex items-center space-x-2">
              <Briefcase className="w-4 h-4 text-teal-700" />
              <span>Recent Hiring Drives</span>
            </h3>
            <Link to="/admin/drives" className="text-xs font-semibold text-teal-800 hover:underline">
              View All Drives →
            </Link>
          </div>

          <div className="space-y-3">
            {metrics?.recentDrives && metrics.recentDrives.length > 0 ? (
              metrics.recentDrives.map((d) => (
                <div
                  key={d.id}
                  className="p-3 bg-[#fbfbf9] rounded-xl border border-[#e6e6df] flex items-center justify-between gap-3 text-xs"
                >
                  <div className="overflow-hidden">
                    <p className="font-bold text-[#111318] truncate">{d.title}</p>
                    <p className="text-[11px] text-[#6b7280]">
                      {d.company?.name || "Tier-1 Partner"} • {d.location}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        d.status === "PUBLISHED"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {d.status}
                    </span>
                    <Link
                      to={`/admin/drives/${d.id}/edit`}
                      className="text-neutral-500 hover:text-black font-semibold"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#6b7280] py-4 text-center">No hiring drives posted yet.</p>
            )}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-2xl border border-[#e6e6df] p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#f0f0ea]">
            <h3 className="text-sm font-bold text-[#111318] flex items-center space-x-2">
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
              <span>Recent Candidate Applications</span>
            </h3>
            <Link to="/admin/applications" className="text-xs font-semibold text-teal-800 hover:underline">
              View All Applications →
            </Link>
          </div>

          <div className="space-y-3">
            {metrics?.recentApplications && metrics.recentApplications.length > 0 ? (
              metrics.recentApplications.map((app) => (
                <div
                  key={app.id}
                  className="p-3 bg-[#fbfbf9] rounded-xl border border-[#e6e6df] flex items-center justify-between gap-3 text-xs"
                >
                  <div className="overflow-hidden">
                    <p className="font-bold text-[#111318] truncate">{app.candidate_name}</p>
                    <p className="text-[11px] text-[#6b7280] truncate">
                      {app.drive?.title || "General Drive"}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-50 text-teal-800 border border-teal-200/50">
                      {app.status}
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      {formatDate(app.created_at)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#6b7280] py-4 text-center">No candidate applications received yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Notifications & Activity Stream */}
      <div className="bg-white rounded-2xl border border-[#e6e6df] p-6 space-y-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#f0f0ea]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-teal-800 text-white flex items-center justify-center shadow-xs">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#111318] flex items-center space-x-2">
                <span>Recent Notifications & Activity</span>
              </h3>
              <p className="text-xs text-[#6b7280] mt-0.5">
                Real-time stream of candidate applications, fast-track routing, and hiring inquiries.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Sound Toggle */}
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl border border-[#e6e6df] hover:border-neutral-400 text-neutral-700 text-xs transition-colors"
              title={soundEnabled ? "Audio chime active (click to mute)" : "Audio muted (click to enable)"}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-teal-800" />
              ) : (
                <VolumeX className="w-4 h-4 text-rose-500" />
              )}
            </button>

            {/* Open Drawer */}
            <button
              type="button"
              onClick={toggleCenter}
              className="px-3.5 py-2 bg-neutral-900 hover:bg-teal-800 text-white font-semibold text-xs rounded-xl transition-all shadow-xs"
            >
              View All ({unreadCount})
            </button>
          </div>
        </div>

        {/* Stack of Phone Notification Cards (iOS / Mobile lock screen style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notifications.slice(0, 3).map((notif) => (
            <div
              key={notif.id}
              onClick={() => markAsRead(notif.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                notif.isRead
                  ? "bg-[#fafaf7] border-[#e6e6df] text-neutral-600 hover:border-neutral-400"
                  : "bg-white border-teal-500/40 shadow-sm hover:border-teal-600 ring-1 ring-teal-500/10"
              }`}
            >
              {/* Phone push banner top bar */}
              <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-2 font-mono">
                <div className="flex items-center space-x-1.5">
                  <div className="w-4 h-4 rounded bg-teal-800 text-white flex items-center justify-center text-[8px] font-bold">
                    TP
                  </div>
                  <span className="font-bold text-neutral-600 uppercase">
                    {notif.company || "TRAININGANDPLACEMENTS"}
                  </span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span>{notif.time}</span>
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
                  )}
                </div>
              </div>

              {/* Title & snippet */}
              <h4 className="text-xs font-bold text-[#111318] truncate">
                {notif.title}
              </h4>
              <p className="text-[11px] font-medium text-teal-800 truncate mt-0.5">
                {notif.subtitle}
              </p>
              <p className="text-[11px] text-neutral-600 mt-1 line-clamp-2 leading-relaxed">
                {notif.message}
              </p>

              {/* Action footer */}
              <div className="mt-3 pt-2.5 border-t border-[#f0f0ea] flex items-center justify-between text-[11px]">
                <Link
                  to={notif.link}
                  className="font-semibold text-teal-800 hover:underline flex items-center space-x-1"
                >
                  <span>Open Details</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
                {notif.tag && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600">
                    {notif.tag}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

