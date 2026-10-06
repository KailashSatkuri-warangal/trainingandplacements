import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { playPhoneNotificationSound } from "../utils/phoneAudio";

const NotificationContext = createContext(null);

const STORAGE_KEY = "tp_admin_notifications";
const SOUND_KEY = "tp_admin_notification_sound";

const INITIAL_PHONE_NOTIFICATIONS = [
  {
    id: "notif-1",
    type: "application",
    title: "New Candidate Application",
    subtitle: "Priya Sharma • Cognizant",
    message: "Applied for Software Engineer (8.5 LPA) in Hyderabad. Resume attached.",
    time: "2m ago",
    timestamp: Date.now() - 2 * 60 * 1000,
    isRead: false,
    link: "/admin/applications",
    company: "Cognizant",
    tag: "High Priority"
  },
  {
    id: "notif-2",
    type: "application",
    title: "New Candidate Application",
    subtitle: "Rahul Reddy • Teleperformance",
    message: "Applied for Customer Success Specialist (3.6 LPA) in Begumpet.",
    time: "14m ago",
    timestamp: Date.now() - 14 * 60 * 1000,
    isRead: false,
    link: "/admin/applications",
    company: "Teleperformance",
    tag: "Awaiting Review"
  },
  {
    id: "notif-3",
    type: "enquiry",
    title: "Corporate Recruiter Enquiry",
    subtitle: "Sneha Nair • HR Operations",
    message: "Inquiry regarding bulk 2026 batch hiring for Capgemini cloud roles.",
    time: "45m ago",
    timestamp: Date.now() - 45 * 60 * 1000,
    isRead: false,
    link: "/admin/enquiries",
    company: "Capgemini",
    tag: "Corporate Partner"
  },
  {
    id: "notif-4",
    type: "drive",
    title: "Hiring Drive Published",
    subtitle: "R1 RCM • Revenue Operations",
    message: "Drive successfully published live to candidates on public portal.",
    time: "2h ago",
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
    isRead: true,
    link: "/admin/drives",
    company: "R1 RCM",
    tag: "System Live"
  },
  {
    id: "notif-5",
    type: "system",
    title: "Fast-Track WhatsApp Alert",
    subtitle: "Sandru Anudeep (+91 8328246487)",
    message: "Candidate tapped WhatsApp fast-track routing for immediate interview slot.",
    time: "3h ago",
    timestamp: Date.now() - 3 * 60 * 60 * 1000,
    isRead: true,
    link: "/admin/applications",
    company: "TrainingAndPlacements",
    tag: "Recruiter Fast-Track"
  }
];

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_PHONE_NOTIFICATIONS;
  });

  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem(SOUND_KEY);
      return saved !== null ? JSON.parse(saved) : true;
    } catch (e) {
      return true;
    }
  });

  const [activeToast, setActiveToast] = useState(null);
  const [isCenterOpen, setIsCenterOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch (e) {}
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem(SOUND_KEY, JSON.stringify(soundEnabled));
    } catch (e) {}
  }, [soundEnabled]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const triggerNotification = useCallback(
    ({
      type = "application",
      title,
      subtitle,
      message,
      link = "/admin/applications",
      company = "TrainingAndPlacements",
      tag = "New Alert"
    }) => {
      const newNotif = {
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        type,
        title,
        subtitle,
        message,
        time: "Just now",
        timestamp: Date.now(),
        isRead: false,
        link,
        company,
        tag
      };

      setNotifications((prev) => [newNotif, ...prev]);
      setActiveToast(newNotif);

      // Play phone chime sound if enabled
      if (soundEnabled) {
        playPhoneNotificationSound();
      }

      // Try browser push notification if granted
      if ("Notification" in window && Notification.permission === "granted") {
        try {
          new Notification(title, {
            body: `${subtitle} — ${message}`,
            icon: "/favicon.svg"
          });
        } catch (e) {}
      }
    },
    [soundEnabled]
  );

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const deleteNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const dismissToast = useCallback(() => {
    setActiveToast(null);
  }, []);

  // Request browser native push permissions on demand
  const requestPushPermission = async () => {
    if ("Notification" in window) {
      const perm = await Notification.requestPermission();
      return perm;
    }
    return "denied";
  };

  // Demo simulator for immediate user testing
  const simulatePhoneNotification = useCallback(() => {
    const scenarios = [
      {
        type: "application",
        title: "New Candidate Application",
        subtitle: "Vikram Rathod • Tech Mahindra",
        message: "Submitted resume for Full Stack Engineer (7.2 LPA). High screening match score (94%).",
        company: "Tech Mahindra",
        tag: "High Match",
        link: "/admin/applications"
      },
      {
        type: "application",
        title: "New Candidate Application",
        subtitle: "Ayesha Fatima • Deloitte",
        message: "Applied for Analyst - Technology Consulting (9.0 LPA) in Hitec City, Hyderabad.",
        company: "Deloitte",
        tag: "Top Tier",
        link: "/admin/applications"
      },
      {
        type: "enquiry",
        title: "Corporate Recruiter Enquiry",
        subtitle: "Suresh Babu • HR Director",
        message: "Requested placement brochure and schedule for 2026 Batch on-campus drive.",
        company: "Concentrix",
        tag: "Campus Drive",
        link: "/admin/enquiries"
      },
      {
        type: "system",
        title: "WhatsApp Fast-Track Ping",
        subtitle: "Sandru Anudeep (+91 8328246487)",
        message: "New candidate initiated direct WhatsApp interview verification.",
        company: "TrainingAndPlacements",
        tag: "Fast-Track",
        link: "/admin/applications"
      }
    ];

    const pick = scenarios[Math.floor(Math.random() * scenarios.length)];
    triggerNotification(pick);
  }, [triggerNotification]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        soundEnabled,
        setSoundEnabled,
        isCenterOpen,
        setIsCenterOpen,
        toggleCenter: () => setIsCenterOpen((prev) => !prev),
        activeToast,
        dismissToast,
        triggerNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        requestPushPermission,
        simulatePhoneNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return ctx;
}
