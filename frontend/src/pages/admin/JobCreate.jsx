import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../../utils/api";
import { ChevronLeft, Loader2, PlusCircle, Briefcase, DollarSign, MapPin, Award, Building, FileText } from "lucide-react";

export default function JobCreate() {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("Full-time");
  const [experience, setExperience] = useState("");
  const [position, setPosition] = useState("1");
  const [companyId, setCompanyId] = useState("");

  useEffect(() => {
    fetchRecruiterCompanies();
  }, []);

  const fetchRecruiterCompanies = async () => {
    setLoadingCompanies(true);
    try {
      const data = await api.get("/company");
      if (data.success && data.companies && data.companies.length > 0) {
        setCompanies(data.companies);
        setCompanyId(data.companies[0]._id); // default selection
      } else {
        setError("You need to register at least one company before posting a job.");
      }
    } catch (err) {
      setError("You must register a company first. Redirecting in 3 seconds...");
      setTimeout(() => {
        navigate("/admin/companies");
      }, 3000);
    } finally {
      setLoadingCompanies(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!companyId) {
      setError("Please select a company.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const data = await api.post("/job/post", {
        title,
        description,
        requirements,
        salary,
        location,
        jobType,
        experience,
        position,
        companyId,
      });

      if (data.success) {
        setSuccess("Job listing created successfully!");
        setTimeout(() => {
          navigate("/admin/jobs");
        }, 1500);
      } else {
        setError(data.message || "Failed to create job.");
      }
    } catch (err) {
      setError(err.message || "Server error while posting job.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingCompanies) {
    return (
      <div className="min-h-[85vh] bg-slate-950 flex flex-col items-center justify-center text-white">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-400">Loading your companies list...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Back Link */}
        <Link to="/admin/jobs" className="inline-flex items-center space-x-2 text-sm text-slate-400 hover:text-white mb-8 transition">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Jobs</span>
        </Link>

        {/* Form container */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 glass shadow-2xl relative overflow-hidden">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold flex items-center space-x-3">
              <PlusCircle className="w-8 h-8 text-purple-500" />
              <span>Post a New Job</span>
            </h1>
            <p className="text-xs text-slate-400 mt-2">Publish details for a new vacancy on our public search listings</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm font-semibold">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Grid 1: Title & Company */}
            <div className="grid sm:grid-cols-2 gap-6">
              
              {/* Title */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Job Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Lead React Developer"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl p-3 text-sm text-white transition"
                />
              </div>

              {/* Company Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                  <Building className="w-3.5 h-3.5 text-slate-500" />
                  <span>Hosting Company</span>
                </label>
                <select
                  required
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl p-3 text-sm text-white transition"
                >
                  {companies.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>Job Description</span>
              </label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                placeholder="Responsibilities, details of work, team layout, requirements details..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl p-3 text-sm text-white resize-none transition"
              ></textarea>
            </div>

            {/* Requirements (skills) */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Award className="w-3.5 h-3.5 text-slate-500" />
                <span>Key Skills / Requirements (comma-separated)</span>
              </label>
              <input
                type="text"
                required
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="React, CSS, Node, TypeScript, Git"
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl p-3 text-sm text-white transition"
              />
            </div>

            {/* Metadata inputs */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Salary */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-0.5">
                  <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                  <span>Salary (yearly)</span>
                </label>
                <input
                  type="number"
                  required
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="85000"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl p-3 text-sm text-white transition"
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>Location</span>
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="San Francisco, CA"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl p-3 text-sm text-white transition"
                />
              </div>

              {/* Job Type */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Job Type</label>
                <select
                  required
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl p-3 text-sm text-white transition"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Remote">Remote</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              {/* Experience level */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Required Exp (yrs)</label>
                <input
                  type="number"
                  required
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="2"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl p-3 text-sm text-white transition"
                />
              </div>

            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {/* Positions/Vacancy counts */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Vacancies</label>
                <input
                  type="number"
                  required
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="3"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl p-3 text-sm text-white transition"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm py-4 rounded-xl transition duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 hover:scale-[1.01]"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Briefcase className="w-5 h-5" />
                  <span>Publish Job Vacancy</span>
                </>
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
