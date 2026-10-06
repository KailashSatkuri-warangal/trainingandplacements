import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  Building2,
  FolderTree,
  FileCheck2,
  Quote,
  Mail,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Bell,
  Sparkles,
  Smartphone
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useNotifications } from "../context/NotificationContext";
import PhoneNotificationToast from "../components/Notifications/PhoneNotificationToast";
import PhoneNotificationCenter from "../components/Notifications/PhoneNotificationCenter";
import ScrollToTop from "../components/ScrollToTop";

export default function AdminLayout() {
  const { user, profile, loading, signOut } = useAuth();
  const { unreadCount, toggleCenter, simulatePhoneNotification } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If loading, show clean loader
  if (loading) {
    return (
      <div className="min-h-screen bg-[#090b0e] text-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">
            Verifying Admin Session...
          </span>
        </div>
      </div>
    );
  }

  // If unauthenticated, redirect to /admin/login
  if (!user) {
    navigate("/admin/login", { replace: true, state: { from: location } });
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Hiring Drives", path: "/admin/drives", icon: Briefcase },
    { name: "Post Drive", path: "/admin/drives/create", icon: PlusCircle },
    { name: "Companies", path: "/admin/companies", icon: Building2 },
    { name: "Categories", path: "/admin/categories", icon: FolderTree },
    { name: "Applications", path: "/admin/applications", icon: FileCheck2 },
    { name: "Testimonials", path: "/admin/testimonials", icon: Quote },
    { name: "Enquiries", path: "/admin/enquiries", icon: Mail }
  ];

  return (
    <div className="min-h-screen bg-[#f4f4f0] flex flex-col md:flex-row text-[#111318]">
      <ScrollToTop />

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col justify-between w-64 bg-[#0e1117] text-white p-5 border-r border-neutral-800 flex-shrink-0 min-h-screen sticky top-0 h-screen overflow-y-auto">
        <div className="space-y-6">
          {/* Brand Monogram */}
          <Link to="/admin" className="flex items-center space-x-3 text-white">
            <div className="w-9 h-9 rounded-lg bg-teal-800 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              TP
            </div>
            <div>
              <span className="font-bold tracking-tight text-sm uppercase block leading-none">
                TrainingAndPlacements
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 mt-1 block">
                Recruiter Admin Desk
              </span>
            </div>
          </Link>

          {/* User Profile Card */}
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-300">
                {profile?.role || "ADMIN"}
              </span>
            </div>
            <p className="text-xs font-semibold text-white truncate">
              {profile?.name || user?.email}
            </p>
            <p className="text-[10px] text-neutral-400 font-mono truncate">
              {user?.email}
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 pt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === "/admin"}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                      isActive
                        ? "bg-teal-800 text-white shadow-xs font-bold"
                        : "text-neutral-400 hover:text-white hover:bg-white/5"
                    }`
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-neutral-800 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <span className="flex items-center space-x-2">
              <span>View Live Website</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center space-x-2.5 px-3.5 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#0e1117] text-white p-4 flex items-center justify-between sticky top-0 z-40 border-b border-neutral-800">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded bg-teal-800 text-white flex items-center justify-center font-bold text-xs">
            TP
          </div>
          <span className="font-bold text-xs tracking-tight uppercase">Admin Desk</span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Mobile Phone Notification Bell Button */}
          <button
            type="button"
            onClick={toggleCenter}
            className="relative p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Open phone notification center"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-emerald-500 text-white text-[9px] font-bold ring-2 ring-[#0e1117]">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 top-[57px] z-30 bg-[#0e1117] text-white p-6 space-y-6 overflow-y-auto">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs">
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
              Logged in as {profile?.role || "ADMIN"}
            </span>
            <p className="font-bold text-white mt-0.5">{profile?.name || user?.email}</p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === "/admin"}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold ${
                      isActive ? "bg-teal-800 text-white" : "text-neutral-300"
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-neutral-800 space-y-3">
            <Link
              to="/"
              target="_blank"
              className="flex items-center justify-between text-xs text-neutral-400"
            >
              <span>View Public Portal</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-rose-500/10 text-rose-400 rounded-xl text-xs font-bold"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Admin Content Area with Global Top Header */}
      <div className="flex-grow flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Desktop Top Header Bar */}
        <header className="hidden md:flex items-center justify-between px-8 py-3.5 bg-white border-b border-[#e6e6df] sticky top-0 z-30">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-neutral-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>RECRUITMENT OPERATIONS DESK</span>
            </span>
            <span className="text-neutral-300">•</span>
            <span className="text-xs text-neutral-500">
              Hyderabad Region (Telangana)
            </span>
          </div>

          {/* Right Header Action Items: Notification Bell & Live Portal */}
          <div className="flex items-center space-x-3">
            {/* Notification Bell with Unread Badge */}
            <button
              type="button"
              onClick={toggleCenter}
              className="relative p-2 rounded-xl bg-white border border-[#e6e6df] hover:border-neutral-400 text-neutral-700 hover:text-black transition-all shadow-2xs"
              title="Open Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-teal-800 text-white text-[10px] font-bold shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-neutral-600 hover:text-black text-xs font-semibold"
            >
              <span>Live Site</span>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
            </Link>
          </div>
        </header>

        {/* Main Routed Page Content */}
        <main className="p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full flex-grow">
          <Outlet />
        </main>
      </div>

      {/* Floating Phone Notification Toast (iOS push banner) */}
      <PhoneNotificationToast />

      {/* Phone Notification Center Drawer */}
      <PhoneNotificationCenter />
    </div>
  );
}
