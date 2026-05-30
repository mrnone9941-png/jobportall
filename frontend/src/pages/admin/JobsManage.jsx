import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../../utils/api";
import { Briefcase, Plus, Users, Calendar, ArrowRight, Loader2, Search } from "lucide-react";

export default function JobsManage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAdminJobs();
  }, []);

  const fetchAdminJobs = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.get("/job/getAdminjobs");
      if (data.success) {
        setJobs(data.jobs || []);
      } else {
        setError(data.message || "Failed to load job posts.");
      }
    } catch (err) {
      if (err.message.includes("Jobs not found")) {
        setJobs([]);
      } else {
        setError(err.message || "Failed to retrieve job posts.");
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(j =>
    j.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header and top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Manage Posted Jobs</h1>
            <p className="text-sm text-slate-400 mt-2">Publish new positions and review candidate submissions</p>
          </div>
          
          <button
            onClick={() => navigate("/admin/jobs/create")}
            className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm py-3 px-6 rounded-xl transition duration-200 shadow-lg shadow-indigo-600/10 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>Post a Job</span>
          </button>
        </div>

        {/* Search filter input */}
        <div className="flex bg-slate-900 border border-slate-800 p-2 rounded-xl glass max-w-md">
          <Search className="w-5 h-5 text-slate-500 mr-2 self-center pl-1" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by job title..."
            className="bg-transparent border-none text-white text-sm focus:outline-none w-full placeholder-slate-500"
          />
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">
            {error}
          </div>
        )}

        {/* Jobs display */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
            <p className="text-slate-400">Loading postings...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/10 border border-dashed border-slate-800 rounded-2xl">
            <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-4 animate-pulse" />
            <h3 className="text-lg font-bold text-white mb-1">No Jobs Posted Yet</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto mb-6">
              Publish a job description to start accepting applications from candidates.
            </p>
            <button
              onClick={() => navigate("/admin/jobs/create")}
              className="bg-indigo-600 hover:bg-indigo-500 text-xs font-bold py-2.5 px-5 rounded-xl text-white transition"
            >
              Post Your First Job
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto bg-slate-900/20 border border-slate-800 rounded-3xl p-6 glass">
            <table className="w-full text-left text-sm text-slate-350">
              <thead className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Job Title</th>
                  <th className="px-6 py-4">Date Posted</th>
                  <th className="px-6 py-4">Applicants</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredJobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-800/10 transition">
                    <td className="px-6 py-4">
                      <p className="font-bold text-white text-sm">{job.title}</p>
                      <span className="text-[10px] text-slate-500 capitalize">{job.jobType} • {job.location}</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {new Date(job.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center space-x-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 py-1 px-3 rounded-full text-xs font-bold">
                        <Users className="w-3.5 h-3.5" />
                        <span>{job.applications?.length || 0}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                        className="inline-flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 font-bold text-xs group"
                      >
                        <span>View Applicants</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
