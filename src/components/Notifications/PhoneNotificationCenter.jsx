import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  BellOff,
  BellRing,
  X,
  Check,
  CheckCheck,
  Trash2,
  Sparkles,
  Smartphone,
  Briefcase,
  Mail,
  ExternalLink,
  Volume2,
  VolumeX,
  Clock,
  Wifi,
  BatteryCharging
} from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";

export default function PhoneNotificationCenter() {
  const {
    notifications,
    unreadCount,
    soundEnabled,
    setSoundEnabled,
    isCenterOpen,
    setIsCenterOpen,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    simulatePhoneNotification
  } = useNotifications();

  const [activeTab, setActiveTab] = useState("all");

  if (!isCenterOpen) return null;

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "all") return true;
    if (activeTab === "applications") return n.type === "application";
    if (activeTab === "enquiries") return n.type === "enquiry";
    if (activeTab === "system") return n.type === "system" || n.type === "drive";
    return true;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case "application":
        return <Briefcase className="w-3.5 h-3.5 text-emerald-400" />;
      case "enquiry":
        return <Mail className="w-3.5 h-3.5 text-indigo-400" />;
      case "system":
        return <Smartphone className="w-3.5 h-3.5 text-teal-400" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
        {/* Backdrop click dismiss */}
        <div
          className="absolute inset-0"
          onClick={() => setIsCenterOpen(false)}
        />

        {/* Clean Notification Drawer */}
        <motion.div
          initial={{ x: "100%", opacity: 0.5 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0.5 }}
          transition={{ type: "spring", damping: 26, stiffness: 280 }}
          className="relative w-full max-w-md bg-[#0d1017] text-white h-full shadow-2xl flex flex-col border-l border-white/10 z-10"
        >
          {/* Header */}
          <div className="p-5 border-b border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-teal-800 text-white flex items-center justify-center shadow-xs">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white tracking-tight">
                    Notifications
                  </h3>
                  <p className="text-xs text-neutral-400">
                    {unreadCount > 0 ? (
                      <span className="text-emerald-400 font-semibold">
                        {unreadCount} unread alert{unreadCount > 1 ? "s" : ""}
                      </span>
                    ) : (
                      "All caught up"
                    )}
                  </p>
                </div>
              </div>

              {/* Action buttons: Sound Mute/Unmute & Close */}
              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`p-2 rounded-xl border text-xs flex items-center transition-all ${
                    soundEnabled
                      ? "bg-teal-950/60 border-teal-700/60 text-teal-300"
                      : "bg-white/5 border-white/10 text-neutral-400 hover:text-white"
                  }`}
                  title={soundEnabled ? "Notification sound enabled (click to mute)" : "Notification sound muted (click to enable)"}
                >
                  {soundEnabled ? (
                    <Volume2 className="w-3.5 h-3.5" />
                  ) : (
                    <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsCenterOpen(false)}
                  className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
                  title="Close notification drawer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Batch Actions Bar */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                Recruiter Desk Feed
              </span>

              <div className="flex items-center space-x-3 text-[11px]">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="text-neutral-400 hover:text-white transition-colors flex items-center space-x-1 font-medium"
                    title="Mark all as read"
                  >
                    <CheckCheck className="w-3 h-3" />
                    <span>Mark all read</span>
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-neutral-400 hover:text-rose-400 transition-colors flex items-center space-x-1 font-medium"
                    title="Clear notification history"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear all</span>
                  </button>
                )}
              </div>
            </div>

            {/* Tabs Filter */}
            <div className="flex space-x-1 bg-white/5 p-1 rounded-xl text-xs">
              {[
                { id: "all", label: "All", count: notifications.length },
                {
                  id: "applications",
                  label: "Applications",
                  count: notifications.filter((n) => n.type === "application").length
                },
                {
                  id: "enquiries",
                  label: "Enquiries",
                  count: notifications.filter((n) => n.type === "enquiry").length
                },
                {
                  id: "system",
                  label: "System",
                  count: notifications.filter((n) => n.type === "system" || n.type === "drive").length
                }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-1.5 rounded-lg font-medium text-[11px] transition-all flex items-center justify-center space-x-1 ${
                    activeTab === tab.id
                      ? "bg-teal-800 text-white font-bold shadow-xs"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className="text-[10px] opacity-75">({tab.count})</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications Scroll List */}
          <div data-lenis-prevent="true" className="flex-grow overflow-y-auto p-4 space-y-2.5">
            {filteredNotifications.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">No Phone Alerts</h4>
                  <p className="text-xs text-neutral-400 mt-1 max-w-[240px]">
                    No notifications in this filter. Tap "Simulate Phone Alert" above to trigger a live incoming test!
                  </p>
                </div>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <motion.div
                  key={notif.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`group relative rounded-2xl p-3.5 transition-all border ${
                    notif.isRead
                      ? "bg-white/[0.03] border-white/5 text-neutral-300"
                      : "bg-white/[0.08] border-teal-500/30 text-white shadow-xs"
                  }`}
                >
                  {/* Card Header (Phone Lock-Screen notification style) */}
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-1.5 font-mono">
                    <div className="flex items-center space-x-1.5">
                      <div className="w-4 h-4 rounded bg-teal-800 text-white flex items-center justify-center text-[8px] font-bold">
                        TP
                      </div>
                      <span className="font-semibold text-neutral-300 uppercase">
                        {notif.company || "TRAININGANDPLACEMENTS"}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span>{notif.time}</span>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                      )}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="flex items-start space-x-3">
                    <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notif.type)}
                    </div>

                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-xs font-bold truncate ${notif.isRead ? "text-neutral-200" : "text-white"}`}>
                          {notif.title}
                        </h4>
                        {notif.tag && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-neutral-300">
                            {notif.tag}
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] font-medium text-emerald-400 truncate mt-0.5">
                        {notif.subtitle}
                      </p>

                      <p className="text-[11px] text-neutral-300 mt-1 leading-snug line-clamp-2">
                        {notif.message}
                      </p>
                    </div>
                  </div>

                  {/* Action Link & Delete on Hover */}
                  <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                    <Link
                      to={notif.link}
                      onClick={() => {
                        markAsRead(notif.id);
                        setIsCenterOpen(false);
                      }}
                      className="text-[11px] font-semibold text-teal-400 hover:text-teal-300 flex items-center space-x-1"
                    >
                      <span>View in Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>

                    <div className="flex items-center space-x-2">
                      {!notif.isRead && (
                        <button
                          type="button"
                          onClick={() => markAsRead(notif.id)}
                          className="text-[10px] text-neutral-400 hover:text-white"
                          title="Mark read"
                        >
                          Mark read
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => deleteNotification(notif.id)}
                        className="text-neutral-500 hover:text-rose-400 transition-colors p-1"
                        title="Delete notification"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Footer Recruiter Helpline */}
          <div className="p-4 bg-[#141824] border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400">
            <span>Fast-track WhatsApp Desk:</span>
            <a
              href="https://wa.me/917780636263"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 hover:underline font-semibold"
            >
              +91 77806 36263
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
