import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, Briefcase, Users, Building, ArrowRight, Zap, Target, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(keyword.trim())}`);
    } else {
      navigate("/jobs");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden pb-16">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 pt-20">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-6 inline-block">
            🚀 The Premium Career Platform
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-none mb-6">
            Find & Land Your <br className="hidden md:inline" />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
              Dream Opportunity
            </span>
          </h1>
          <p className="text-lg text-slate-400 mb-8 max-w-xl mx-auto">
            Connect with leading recruiters, apply to top-tier roles, or hire outstanding talent. Start your journey today.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center bg-slate-900/80 border border-slate-800 p-2 rounded-xl sm:rounded-full shadow-2xl glass max-w-2xl mx-auto">
            <div className="flex items-center space-x-3 px-3 w-full mb-3 sm:mb-0">
              <Search className="w-5 h-5 text-indigo-400 shrink-0" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Job title, keywords, or skills..."
                className="bg-transparent border-none text-white text-sm focus:outline-none w-full placeholder-slate-500"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm py-3 px-8 rounded-lg sm:rounded-full transition duration-300 shadow-lg shadow-indigo-600/20 hover:scale-[1.02] cursor-pointer shrink-0"
            >
              Search Jobs
            </button>
          </form>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-20 text-center">
          <div className="p-6 bg-slate-900/30 rounded-2xl border border-slate-800 glass-card">
            <Briefcase className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
            <p className="text-3xl font-extrabold text-white">12k+</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Active Jobs</p>
          </div>
          <div className="p-6 bg-slate-900/30 rounded-2xl border border-slate-800 glass-card">
            <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-3xl font-extrabold text-white">450k+</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Job Seekers</p>
          </div>
          <div className="p-6 bg-slate-900/30 rounded-2xl border border-slate-800 glass-card col-span-2 md:col-span-1">
            <Building className="w-8 h-8 text-pink-400 mx-auto mb-2" />
            <p className="text-3xl font-extrabold text-white">800+</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Top Companies</p>
          </div>
        </div>

        {/* Feature Sections */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {/* Candidates feature card */}
          <div className="p-8 bg-gradient-to-br from-indigo-900/20 to-slate-900/50 rounded-3xl border border-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">For Candidates</h3>
              <p className="text-slate-400 mb-6 text-sm leading-relaxed">
                Discover curated opportunities, track application statuses in real-time, build your profile, and stand out to leading hiring teams.
              </p>
            </div>
            <Link
              to={user ? "/jobs" : "/signup"}
              className="inline-flex items-center space-x-2 text-indigo-400 font-bold hover:text-indigo-300 group-hover:translate-x-1 transition-transform"
            >
              <span>{user ? "Explore Jobs" : "Create Account"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Recruiters feature card */}
          <div className="p-8 bg-gradient-to-br from-purple-900/20 to-slate-900/50 rounded-3xl border border-purple-500/10 hover:border-purple-500/30 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">For Recruiters</h3>
              <p className="text-slate-400 mb-6 text-sm leading-relaxed">
                Register your brand, post job listings, review profiles, and efficiently manage candidates from registration to offer letters.
              </p>
            </div>
            <Link
              to={user ? "/admin/companies" : "/signup"}
              className="inline-flex items-center space-x-2 text-purple-400 font-bold hover:text-purple-300 group-hover:translate-x-1 transition-transform"
            >
              <span>{user ? "Post a Job" : "Start Hiring"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Why choose us */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white mb-12">Why Choose HireSphere?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 text-left">
              <ShieldCheck className="w-10 h-10 text-indigo-400 mb-4" />
              <h4 className="text-lg font-bold text-white mb-2">Verified Companies</h4>
              <p className="text-sm text-slate-400">All companies are vetted to ensure genuine listings and high-quality workspace experiences.</p>
            </div>
            <div className="p-6 text-left">
              <Building className="w-10 h-10 text-purple-400 mb-4" />
              <h4 className="text-lg font-bold text-white mb-2">Instant Feedback</h4>
              <p className="text-sm text-slate-400">Track application progress dynamically from 'Pending' through to decisions.</p>
            </div>
            <div className="p-6 text-left">
              <Target className="w-10 h-10 text-pink-400 mb-4" />
              <h4 className="text-lg font-bold text-white mb-2">Tailored Job Matches</h4>
              <p className="text-sm text-slate-400">Advanced filtering makes finding matching experience levels and positions straightforward.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
