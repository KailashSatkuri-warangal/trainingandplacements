import { useState } from "react";
import { Navigate, useNavigate, useLocation, Link } from "react-router-dom";
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  UserPlus
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function AdminLogin() {
  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [email, setEmail] = useState("admin@trainingandplacements.com");
  const [password, setPassword] = useState("Admin@123456");
  const [fullName, setFullName] = useState("Sandru Anudeep");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const { signIn, signUp, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already authenticated, redirect cleanly via Navigate component
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || "/admin";
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      if (mode === "signin") {
        await signIn(email, password);
        const from = location.state?.from?.pathname || "/admin";
        navigate(from, { replace: true });
      } else {
        await signUp(email, password, { name: fullName });
        setSuccessMsg("Account created! You can now sign in.");
        setMode("signin");
      }
    } catch (err) {
      console.error("Auth action error:", err);
      setErrorMsg(
        err.message || "Invalid recruiter login credentials. Please verify your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e1117] text-white flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
      {/* Top Brand Link */}
      <div className="max-w-md w-full mx-auto">
        <Link
          to="/"
          className="inline-flex items-center space-x-2.5 text-neutral-400 hover:text-white transition-colors text-xs font-semibold"
        >
          <div className="w-7 h-7 rounded bg-teal-800 text-white flex items-center justify-center font-bold text-xs">
            TP
          </div>
          <span>Return to TrainingAndPlacements Portal</span>
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto bg-[#171b23] border border-neutral-800 rounded-3xl p-8 sm:p-10 shadow-2xl my-auto">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-teal-800/20 border border-teal-700/40 text-teal-400 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Recruiter Admin Portal
          </h2>
          <p className="text-xs text-neutral-400 mt-1.5">
            Sign in to manage hiring drives, applicant resumes, and placements.
          </p>
        </div>

        {/* Tabs: Sign In / Create Account */}
        <div className="flex items-center rounded-xl bg-neutral-900/80 p-1 mb-5 border border-neutral-800">
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setErrorMsg("");
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              mode === "signin"
                ? "bg-teal-800 text-white shadow-xs"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setErrorMsg("");
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              mode === "signup"
                ? "bg-teal-800 text-white shadow-xs"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Register Admin
          </button>
        </div>

        {/* Error / Success Feedback */}
        {errorMsg && (
          <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start space-x-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-5 p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-start space-x-2.5 text-xs text-emerald-300">
            <span>{successMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Sandru Anudeep"
                className="w-full bg-[#0e1117] border border-neutral-700 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-teal-700"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@trainingandplacements.com"
                className="w-full bg-[#0e1117] border border-neutral-700 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-teal-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#0e1117] border border-neutral-700 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-teal-700"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl text-xs transition-all disabled:opacity-50 shadow-md"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : mode === "signin" ? (
                <>
                  <span>Sign In to Admin Desk</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Admin Account</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-neutral-800 text-center">
          <p className="text-[11px] text-neutral-500">
            Powered by Supabase Auth & PostgreSQL Security
          </p>
        </div>
      </div>

      <div className="text-center text-xs text-neutral-600">
        © 2026 TrainingAndPlacements. Direct Desk Hotline: +91 8309740722
      </div>
    </div>
  );
}
