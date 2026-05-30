import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { MapPin, DollarSign, Briefcase, Clock, FileText, CheckCircle2, ChevronLeft, Loader2, Award, Calendar } from "lucide-react";

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [hasApplied, setHasApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchJobDetails();
    if (user && user.role === "student") {
      checkAppliedStatus();
    }
  }, [id, user]);

  const fetchJobDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.get(`/job/get/${id}`);
      if (data.success) {
        setJob(data.job);
      } else {
        setError(data.message || "Failed to load job details.");
      }
    } catch (err) {
      setError(err.message || "Failed to load job details.");
    } finally {
      setLoading(false);
    }
  };

  const checkAppliedStatus = async () => {
    try {
      const data = await api.get("/application/get");
      if (data.success && data.application) {
        const alreadyApplied = data.application.some(
          (app) => app.job?._id === id
        );
        setHasApplied(alreadyApplied);
      }
    } catch (err) {
      console.warn("Could not fetch application history for status verification", err);
    }
  };

  const handleApply = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "student") {
      setError("Only candidates are allowed to apply to jobs.");
      return;
    }

    setApplying(true);
    setError("");
    setSuccessMsg("");

    try {
      const data = await api.get(`/application/apply/${id}`);
      if (data.success) {
        setHasApplied(true);
        setSuccessMsg("Applied successfully! The recruiter has been notified.");
      } else {
        setError(data.message || "Failed to apply.");
      }
    } catch (err) {
      setError(err.message || "Server error while applying.");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-white bg-slate-950">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-400">Loading position details...</p>
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-white bg-slate-950 px-6">
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 max-w-md text-center">
          <p className="font-bold text-lg mb-2">Error Occurred</p>
          <p className="text-sm mb-4">{error}</p>
          <button onClick={fetchJobDetails} className="bg-rose-600 hover:bg-rose-505 px-4 py-2 rounded-xl text-xs font-bold text-white transition">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link to="/jobs" className="inline-flex items-center space-x-2 text-sm text-slate-400 hover:text-white mb-8 transition">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Listings</span>
        </Link>

        {/* Main Content Card */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 glass shadow-2xl relative overflow-hidden">
          {/* Header section */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-800/80 mb-8">
            <div>
              <span className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-3.5 inline-block">
                {job.company?.name || "Independent"}
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">{job.title}</h1>
              
              <div className="flex flex-wrap gap-y-2 gap-x-5 text-sm text-slate-400 mt-4">
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 text-slate-500 mr-1.5" />
                  <span>{job.location}</span>
                </span>
                <span className="flex items-center">
                  <DollarSign className="w-4 h-4 text-slate-500 mr-0.5" />
                  <span>${job.salary?.toLocaleString()} / year</span>
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 text-slate-500 mr-1.5" />
                  <span>{job.jobType}</span>
                </span>
              </div>
            </div>

            {/* Action / Apply button */}
            <div className="shrink-0 w-full md:w-auto mt-4 md:mt-0">
              {hasApplied ? (
                <div className="flex items-center justify-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 py-3.5 px-8 rounded-xl font-bold text-sm w-full">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Already Applied</span>
                </div>
              ) : (
                <button
                  onClick={handleApply}
                  disabled={applying || (user && user.role !== "student")}
                  className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm py-3.5 px-8 rounded-xl transition duration-300 shadow-lg shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {applying ? (
                    <span className="flex items-center justify-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Applying...</span>
                    </span>
                  ) : user && user.role !== "student" ? (
                    <span>Logged in as Recruiter</span>
                  ) : (
                    <span>Apply Now</span>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Feedback alerts */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm font-semibold">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold">
              {successMsg}
            </div>
          )}

          {/* Detail specs */}
          <div className="grid sm:grid-cols-3 gap-6 mb-8 p-6 bg-slate-950/50 rounded-2xl border border-slate-800/80">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Experience Level</p>
              <p className="text-base font-bold text-white mt-1">{job.experienceLevel} years minimum</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Positions Available</p>
              <p className="text-base font-bold text-white mt-1">{job.position} vacancy</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Date Posted</p>
              <p className="text-base font-bold text-white mt-1">
                {new Date(job.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </div>

          {/* Job Description */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2 mb-3">
                <FileText className="w-5 h-5 text-indigo-400" />
                <span>Job Description</span>
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line bg-slate-950/20 p-4 rounded-xl border border-slate-800/30">
                {job.description}
              </p>
            </div>

            {/* Requirements list */}
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2 mb-3">
                <Award className="w-5 h-5 text-purple-400" />
                <span>Key Requirements</span>
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {job.requirements && job.requirements.map((req, idx) => (
                  <span
                    key={idx}
                    className="bg-indigo-500/5 border border-indigo-500/20 text-slate-300 py-2 px-4 rounded-xl text-xs font-semibold"
                  >
                    {req}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
