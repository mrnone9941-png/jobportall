import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { Search, MapPin, DollarSign, Briefcase, Clock, Calendar, ChevronRight, Loader2, SlidersHorizontal } from "lucide-react";

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchKeyword = searchParams.get("search") || "";

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters State
  const [searchQuery, setSearchQuery] = useState(searchKeyword);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedSalary, setSelectedSalary] = useState("");

  // Populate filter options dynamically from jobs
  const [locations, setLocations] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, [searchKeyword]);

  const fetchJobs = async () => {
    setLoading(true);
    setError("");
    try {
      // API call: /job/get?keyword=...
      const data = await api.get(`/job/get?keyword=${encodeURIComponent(searchKeyword)}`);
      if (data.success) {
        setJobs(data.jobs || []);
        
        // Extract unique locations and job types for filter choices
        const locs = [...new Set((data.jobs || []).map(j => j.location).filter(Boolean))];
        const types = [...new Set((data.jobs || []).map(j => j.jobType).filter(Boolean))];
        setLocations(locs);
        setJobTypes(types);
      } else {
        setError(data.message || "Failed to load jobs.");
      }
    } catch (err) {
      setError(err.message || "Failed to load jobs.");
    } finally {
      setLoading(false);
    }
  };

  // Filter effect
  useEffect(() => {
    let result = jobs;

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        j =>
          (j.title && j.title.toLowerCase().includes(q)) ||
          (j.description && j.description.toLowerCase().includes(q)) ||
          (j.requirements && j.requirements.some(r => r.toLowerCase().includes(q)))
      );
    }

    // Location match
    if (selectedLocation) {
      result = result.filter(j => j.location === selectedLocation);
    }

    // Job Type match
    if (selectedType) {
      result = result.filter(j => j.jobType === selectedType);
    }

    // Salary match
    if (selectedSalary) {
      if (selectedSalary === "low") {
        result = result.filter(j => Number(j.salary) < 50000);
      } else if (selectedSalary === "mid") {
        result = result.filter(j => Number(j.salary) >= 50000 && Number(j.salary) <= 150000);
      } else if (selectedSalary === "high") {
        result = result.filter(j => Number(j.salary) > 150000);
      }
    }

    setFilteredJobs(result);
  }, [jobs, searchQuery, selectedLocation, selectedType, selectedSalary]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams(searchQuery ? { search: searchQuery } : {});
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedLocation("");
    setSelectedType("");
    setSelectedSalary("");
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Page title & Search bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Available Positions</h1>
            <p className="text-sm text-slate-400 mt-2">Explore opportunities suited to your unique skillset</p>
          </div>
          
          <form onSubmit={handleSearchSubmit} className="flex bg-slate-900 border border-slate-800 p-1.5 rounded-xl glass max-w-md w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, skills..."
              className="bg-transparent border-none text-white text-sm focus:outline-none w-full px-3 placeholder-slate-500"
            />
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-sm font-bold transition duration-200">
              Search
            </button>
          </form>
        </div>

        {/* Layout grid */}
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 p-6 bg-slate-900/40 border border-slate-800 rounded-2xl glass-card h-fit space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <span className="flex items-center space-x-2 text-sm font-bold tracking-wider text-indigo-400 uppercase">
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
              </span>
              <button onClick={clearFilters} className="text-xs text-slate-400 hover:text-white transition">
                Clear All
              </button>
            </div>

            {/* Filter by Location */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500"
              >
                <option value="">All Locations</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Filter by Job Type */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Job Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500"
              >
                <option value="">All Types</option>
                {jobTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Filter by Salary */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Salary Range</label>
              <select
                value={selectedSalary}
                onChange={(e) => setSelectedSalary(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500"
              >
                <option value="">Any Salary</option>
                <option value="low">Under $50k</option>
                <option value="mid">$50k - $150k</option>
                <option value="high">Over $150k</option>
              </select>
            </div>
          </div>

          {/* Job Feed */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
                <p className="text-slate-400">Fetching listings...</p>
              </div>
            ) : error ? (
              <div className="p-6 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">
                {error}
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-20 bg-slate-900/10 border border-dashed border-slate-800 rounded-2xl">
                <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-1">No Jobs Found</h3>
                <p className="text-sm text-slate-400">Try adjusting your filters or search keywords.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredJobs.map((job) => (
                  <div
                    key={job._id}
                    className="p-6 bg-slate-900/30 border border-slate-800 rounded-2xl hover:border-slate-700 transition duration-300 flex flex-col justify-between glass-card hover:scale-[1.01]"
                  >
                    <div>
                      {/* Top row: Company details */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">
                            {job.company?.name || "Independent"}
                          </span>
                          <h3 className="text-xl font-bold text-white mt-0.5 line-clamp-1">{job.title}</h3>
                        </div>
                        <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 py-1 px-2.5 rounded-full font-bold uppercase tracking-wider">
                          {job.jobType}
                        </span>
                      </div>

                      {/* Job metadata tags */}
                      <div className="flex flex-wrap gap-y-2 gap-x-4 text-xs text-slate-400 mb-4">
                        <span className="flex items-center">
                          <MapPin className="w-3.5 h-3.5 text-slate-500 mr-1 shrink-0" />
                          <span>{job.location}</span>
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="w-3.5 h-3.5 text-slate-500 mr-0.5 shrink-0" />
                          <span>${job.salary?.toLocaleString()}</span>
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3.5 h-3.5 text-slate-500 mr-1 shrink-0" />
                          <span>{job.experienceLevel} Yrs Exp</span>
                        </span>
                      </div>

                      {/* Description snippet */}
                      <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                        {job.description}
                      </p>
                    </div>

                    {/* Requirements & Action button */}
                    <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between mt-auto">
                      <div className="flex flex-wrap gap-1 max-w-[70%]">
                        {job.requirements?.slice(0, 3).map((req, idx) => (
                          <span key={idx} className="bg-slate-900 border border-slate-800 text-slate-400 text-[10px] py-0.5 px-2 rounded-md font-medium">
                            {req}
                          </span>
                        ))}
                        {job.requirements?.length > 3 && (
                          <span className="text-[10px] text-slate-500 self-center pl-1">
                            +{job.requirements.length - 3} more
                          </span>
                        )}
                      </div>
                      
                      <button
                        onClick={() => navigate(`/jobs/${job._id}`)}
                        className="flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 font-bold text-xs group"
                      >
                        <span>View Details</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
