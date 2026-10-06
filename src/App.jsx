import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { useLenis } from "./hooks/useLenis";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";

// Public Pages
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Admin Authentication
import AdminLogin from "./pages/AdminLogin";

// Admin Management Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminDrives from "./pages/AdminDrives";
import AdminDriveCreate from "./pages/AdminDriveCreate";
import AdminDriveEdit from "./pages/AdminDriveEdit";
import AdminCompanies from "./pages/AdminCompanies";
import AdminCategories from "./pages/AdminCategories";
import AdminApplications from "./pages/AdminApplications";
import AdminTestimonials from "./pages/AdminTestimonials";
import AdminEnquiries from "./pages/AdminEnquiries";

export default function App() {
  // Initialize Lenis smooth scroll synchronization
  useLenis();

  return (
    <AuthProvider>
      <NotificationProvider>
        <Routes>
          {/* Public Visitor Experience */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:slug" element={<JobDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Admin Login Gateway (Independent full-screen view) */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Recruiter / Admin Operations Console */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="drives" element={<AdminDrives />} />
            <Route path="drives/create" element={<AdminDriveCreate />} />
            <Route path="drives/:id/edit" element={<AdminDriveEdit />} />
            <Route path="companies" element={<AdminCompanies />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="applications" element={<AdminApplications />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="enquiries" element={<AdminEnquiries />} />
          </Route>
        </Routes>
      </NotificationProvider>
    </AuthProvider>
  );
}

