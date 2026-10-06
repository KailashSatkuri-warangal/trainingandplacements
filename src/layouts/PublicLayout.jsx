import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import CustomCursor from "../components/CustomCursor/CustomCursor";
import ScrollProgress from "../components/ScrollProgress/ScrollProgress";
import ScrollToTop from "../components/ScrollToTop";

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbf9] text-[#111318] selection:bg-[#0f766e] selection:text-white relative">
      <ScrollProgress />
      <CustomCursor />
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
