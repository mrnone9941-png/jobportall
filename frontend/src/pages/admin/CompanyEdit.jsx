import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../../utils/api";
import { ChevronLeft, Loader2, Save, FileText, Globe, MapPin, Building } from "lucide-react";

export default function CompanyEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchCompanyDetails();
  }, [id]);

  const fetchCompanyDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.get(`/company/${id}`);
      if (data.success) {
        setName(data.company.name || "");
        setDescription(data.company.description || "");
        setWebsite(data.company.website || "");
        setLocation(data.company.location || "");
      } else {
        setError(data.message || "Failed to load company details.");
      }
    } catch (err) {
      setError(err.message || "Failed to load company details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const data = await api.put(`/company/${id}`, {
        name,
        description,
        website,
        location,
      });

      if (data.success) {
        setSuccess("Company updated successfully!");
        setTimeout(() => {
          navigate("/admin/companies");
        }, 1500);
      } else {
        setError(data.message || "Failed to update company.");
      }
    } catch (err) {
      setError(err.message || "Server error while saving changes.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[85vh] bg-slate-950 flex flex-col items-center justify-center text-white">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-400">Loading company details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Back Link */}
        <Link to="/admin/companies" className="inline-flex items-center space-x-2 text-sm text-slate-400 hover:text-white mb-8 transition">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Companies</span>
        </Link>

        {/* Content Box */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 glass shadow-2xl relative overflow-hidden">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold flex items-center space-x-3">
              <Building className="w-8 h-8 text-indigo-500" />
              <span>Edit Company Profile</span>
            </h1>
            <p className="text-xs text-slate-400 mt-2">Update information about {name || "this company"}</p>
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
            
            {/* Company Name */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Company Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl p-3 text-sm text-white transition"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>About the Company</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                placeholder="Brief description of company operations, mission, culture..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl p-3 text-sm text-white resize-none transition"
              ></textarea>
            </div>

            {/* Website & Location grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              
              {/* Website */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-500" />
                  <span>Website URL</span>
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl p-3 text-sm text-white transition"
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>Office Location</span>
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Bangalore, IN"
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
                  <Save className="w-5 h-5" />
                  <span>Save Profile Details</span>
                </>
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
