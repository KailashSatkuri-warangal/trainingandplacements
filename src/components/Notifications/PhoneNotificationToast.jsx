import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ExternalLink,
  Briefcase,
  Mail,
  Smartphone,
  CheckCircle2,
  Bell
} from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";

export default function PhoneNotificationToast() {
  const { activeToast, dismissToast, markAsRead } = useNotifications();

  useEffect(() => {
    if (!activeToast) return;
    const timer = setTimeout(() => {
      dismissToast();
    }, 6500);
    return () => clearTimeout(timer);
  }, [activeToast, dismissToast]);

  if (!activeToast) return null;

  const getIcon = () => {
    switch (activeToast.type) {
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
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[94%] sm:w-[440px] pointer-events-auto">
        <motion.div
          initial={{ y: -60, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -40, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 420, damping: 28 }}
          className="relative overflow-hidden rounded-2xl bg-[#0f1117]/95 backdrop-blur-xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-white p-3.5"
        >
          {/* Top Smartphone Header */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-[11px]">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded-md bg-teal-800 flex items-center justify-center font-bold text-[9px] text-white shadow-xs">
                TP
              </div>
              <span className="font-bold tracking-wider uppercase text-neutral-300 font-mono text-[10px]">
                TRAININGANDPLACEMENTS
              </span>
              <span className="text-neutral-500">•</span>
              <span className="text-neutral-400 font-medium font-mono text-[10px]">NOW</span>
            </div>

            <button
              type="button"
              onClick={dismissToast}
              className="p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              title="Dismiss phone notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Main Body */}
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              {getIcon()}
            </div>

            <div className="flex-grow min-w-0 pr-1">
              <div className="flex items-center space-x-2">
                <h4 className="text-xs font-bold text-white truncate">
                  {activeToast.title}
                </h4>
                {activeToast.tag && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {activeToast.tag}
                  </span>
                )}
              </div>
              <p className="text-[11px] font-medium text-emerald-400 truncate mt-0.5">
                {activeToast.subtitle}
              </p>
              <p className="text-[11px] text-neutral-300 leading-relaxed mt-1 line-clamp-2">
                {activeToast.message}
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={dismissToast}
              className="text-[11px] font-semibold text-neutral-400 hover:text-white transition-colors"
            >
              Dismiss
            </button>

            <Link
              to={activeToast.link}
              onClick={() => {
                markAsRead(activeToast.id);
                dismissToast();
              }}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-teal-800 hover:bg-teal-700 text-white rounded-lg font-semibold text-[11px] transition-all shadow-xs"
            >
              <span>Open in Desk</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          {/* Subtle auto-dismiss progress bar */}
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 6.5, ease: "linear" }}
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-teal-400 to-emerald-400 origin-left"
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
