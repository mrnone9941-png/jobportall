import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../utils/api";
import { Building, Plus, Search, Edit2, Link as LinkIcon, MapPin, Loader2 } from "lucide-react";

export default function Companies() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Registration form state
  const [newCompanyName, setNewCompanyName] = useState("");
  const [registering, setRegistering] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.get("/company");
      if (data.success) {
        setCompanies(data.companies || []);
      } else {
        // Handled as fallback
        setCompanies([]);
      }
    } catch (err) {
      if (err.message.includes("No companies found")) {
        setCompanies([]);
      } else {
        setError(err.message || "Failed to load companies.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterCompany = async (e) => {
    e.preventDefault();
    if (!newCompanyName.trim()) return;

    setRegistering(true);
    setRegisterError("");
    setRegisterSuccess("");

    try {
      const data = await api.post("/company", { companyName: newCompanyName.trim() });
      if (data.success) {
        setRegisterSuccess("Company registered successfully!");
        setNewCompanyName("");
        fetchCompanies();
        setTimeout(() => {
          setIsRegisterOpen(false);
          setRegisterSuccess("");
          // Navigate to edit details immediately for UX!
          navigate(`/admin/companies/${data.company._id}`);
        }, 1500);
      } else {
        setRegisterError(data.message || "Failed to register company.");
      }
    } catch (err) {
      setRegisterError(err.message || "Server error occurred.");
    } finally {
      setRegistering(false);
    }
  };

  const filteredCompanies = companies.filter(c =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header and top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Your Registered Companies</h1>
            <p className="text-sm text-slate-400 mt-2">Manage the brands and companies you hire for</p>
          </div>
          
          <button
            onClick={() => setIsRegisterOpen(true)}
            className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm py-3 px-6 rounded-xl transition duration-200 shadow-lg shadow-indigo-600/10 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>Add Company</span>
          </button>
        </div>

        {/* Search & Statistics */}
        <div className="flex bg-slate-900 border border-slate-800 p-2 rounded-xl glass max-w-md">
          <Search className="w-5 h-5 text-slate-500 mr-2 self-center pl-1" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by company name..."
            className="bg-transparent border-none text-white text-sm focus:outline-none w-full placeholder-slate-500"
          />
        </div>

        {/* Error Banners */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">
            {error}
          </div>
        )}

        {/* Company list display */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
            <p className="text-slate-400">Loading companies...</p>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/10 border border-dashed border-slate-800 rounded-2xl">
            <Building className="w-12 h-12 text-slate-600 mx-auto mb-4 animate-bounce" />
            <h3 className="text-lg font-bold text-white mb-1">No Companies Registered</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto mb-6">
              Create a company profile first, and then you'll be able to publish job listings under its brand.
            </p>
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-xs font-bold py-2 px-5 rounded-lg text-white transition"
            >
              Add Your First Company
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <div
                key={company._id}
                className="p-6 bg-slate-900/30 border border-slate-800 rounded-2xl glass-card flex flex-col justify-between hover:border-slate-700 transition"
              >
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-bold text-indigo-400 uppercase text-lg shrink-0">
                      {company.name ? company.name.substring(0, 2) : "CO"}
                    </div>
                    <h3 className="text-lg font-bold text-white line-clamp-1">{company.name}</h3>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-6">
                    {company.description || "No description provided yet. Click edit to add descriptions, locations, and websites."}
                  </p>

                  <div className="space-y-2 text-xs text-slate-500 mb-6">
                    {company.location && (
                      <span className="flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
                        <span>{company.location}</span>
                      </span>
                    )}
                    {company.website && (
                      <span className="flex items-center">
                        <LinkIcon className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
                        <a href={company.website} target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition truncate">
                          {company.website}
                        </a>
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/admin/companies/${company._id}`)}
                  className="w-full flex items-center justify-center space-x-2 bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-800 py-2.5 rounded-xl text-xs font-bold transition hover:text-white"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Details</span>
                </button>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Register Company Modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-8 shadow-2xl glass relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsRegisterOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white transition"
            >
              <Building className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-white mb-2">Register Company</h2>
            <p className="text-xs text-slate-400 mb-6">Provide the official company name. Details can be added next.</p>

            {registerError && (
              <div className="mb-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
                {registerError}
              </div>
            )}

            {registerSuccess && (
              <div className="mb-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                {registerSuccess}
              </div>
            )}

            <form onSubmit={handleRegisterCompany} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  required
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  placeholder="e.g. Acme Corporation"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl p-3 text-sm text-white"
                />
              </div>

              <button
                type="submit"
                disabled={registering || !newCompanyName.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-500 py-3.5 px-4 rounded-xl font-bold text-sm text-white transition flex items-center justify-center space-x-2 disabled:opacity-50 mt-6"
              >
                {registering ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Register Company</span>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
