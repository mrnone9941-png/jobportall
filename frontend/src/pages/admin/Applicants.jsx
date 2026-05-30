import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../../utils/api";
import { ChevronLeft, Check, X, Mail, Phone, Award, User, Loader2, AlertCircle, Calendar } from "lucide-react";

export default function Applicants() {
  const { id } = useParams(); // Job ID

  const [jobTitle, setJobTitle] = useState("");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusLoadingMap, setStatusLoadingMap] = useState({});

  useEffect(() => {
    fetchApplicants();
  }, [id]);

  const fetchApplicants = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.get(`/application/${id}/applicants`);
      if (data.success && data.job) {
        setJobTitle(data.job.title || "Position Details");
        setApplications(data.job.applications || []);
      } else {
        setError(data.message || "Failed to load candidate list.");
      }
    } catch (err) {
      setError(err.message || "Server error while fetching candidates.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    setError("");
    setStatusLoadingMap((prev) => ({ ...prev, [appId]: true }));

    try {
      const data = await api.post(`/application/status/${appId}/update`, { status: newStatus });
      if (data.success) {
        // Update local state immediately for fast feedback
        setApplications((prevApps) =>
          prevApps.map((app) =>
            app._id === appId ? { ...app, status: newStatus.toLowerCase() } : app
          )
        );
      } else {
        setError(data.message || "Failed to update status.");
      }
    } catch (err) {
      setError(err.message || "Error updating application status.");
    } finally {
      setStatusLoadingMap((prev) => ({ ...prev, [appId]: false }));
    }
  };

  const getStatusDisplay = (status) => {
    const s = status ? status.toLowerCase() : "pending";
    if (s === "accepted") {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          Accepted
        </span>
      );
    }
    if (s === "rejected") {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 border border-rose-500/30 text-rose-400">
          Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400">
        Pending
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-[85vh] bg-slate-950 flex flex-col items-center justify-center text-white">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-400">Loading applicants...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white py-12 px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Back Link */}
        <Link to="/admin/jobs" className="inline-flex items-center space-x-2 text-sm text-slate-400 hover:text-white transition">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Manage Jobs</span>
        </Link>

        {/* Page Title */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Candidates for {jobTitle}</h1>
          <p className="text-sm text-slate-400 mt-2">
            Review applicant profiles and update application statuses
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">
            {error}
          </div>
        )}

        {applications.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/10 border border-dashed border-slate-800 rounded-2xl">
            <User className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-1">No Applicants Yet</h3>
            <p className="text-sm text-slate-400">
              When students apply to this position, their profile details will show up here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((app) => {
              const candidate = app.applicant;
              const isPending = !app.status || app.status.toLowerCase() === "pending";
              const isActionLoading = statusLoadingMap[app._id] || false;

              if (!candidate) return null;

              return (
                <div
                  key={app._id}
                  className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 glass-card flex flex-col md:flex-row md:items-start justify-between gap-6 hover:border-slate-700 transition"
                >
                  <div className="space-y-4">
                    {/* Basic details */}
                    <div className="flex items-center space-x-3.5">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-base uppercase shrink-0">
                        {candidate.fullname ? candidate.fullname.substring(0, 2) : "C"}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white leading-tight">{candidate.fullname}</h3>
                        <p className="text-slate-400 text-xs mt-1">
                          Applied: {new Date(app.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                    </div>

                    {/* Bio */}
                    {candidate.profile?.bio && (
                      <p className="text-slate-300 text-sm leading-relaxed max-w-2xl bg-slate-950/20 p-3 rounded-xl border border-slate-850/10">
                        {candidate.profile.bio}
                      </p>
                    )}

                    {/* Contact metadata */}
                    <div className="grid sm:grid-cols-2 gap-3 text-xs text-slate-400">
                      <span className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span className="truncate">{candidate.email}</span>
                      </span>
                      <span className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-purple-400 shrink-0" />
                        <span>{candidate.phoneNumber}</span>
                      </span>
                    </div>

                    {/* Skills */}
                    {candidate.profile?.skills && candidate.profile.skills.length > 0 && (
                      <div className="pt-2">
                        <h4 className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2 flex items-center">
                          <Award className="w-3.5 h-3.5 text-indigo-400 mr-1 shrink-0" />
                          <span>Candidate Skills</span>
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {candidate.profile.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="bg-slate-950 border border-slate-850 text-slate-300 py-1 px-2.5 rounded-lg text-xs font-semibold"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions and Status Column */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4 self-center md:self-start shrink-0">
                    <div className="text-right">
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Status</p>
                      {getStatusDisplay(app.status)}
                    </div>

                    {/* Decision buttons */}
                    {isPending && (
                      <div className="flex items-center space-x-2 pt-2">
                        <button
                          disabled={isActionLoading}
                          onClick={() => handleUpdateStatus(app._id, "accepted")}
                          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white w-9 h-9 rounded-lg flex items-center justify-center transition shadow-lg shadow-emerald-600/10 cursor-pointer"
                          title="Accept Candidate"
                        >
                          {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        </button>
                        <button
                          disabled={isActionLoading}
                          onClick={() => handleUpdateStatus(app._id, "rejected")}
                          className="bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white w-9 h-9 rounded-lg flex items-center justify-center transition shadow-lg shadow-rose-600/10 cursor-pointer"
                          title="Reject Candidate"
                        >
                          {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
