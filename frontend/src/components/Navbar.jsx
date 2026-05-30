import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Briefcase, Menu, X, LogOut, User as UserIcon, Building2, ClipboardList, PlusCircle } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  const navLinks = [
    { name: "Home", path: "/", roles: ["guest", "student", "recruiter"] },
    { name: "Browse Jobs", path: "/jobs", roles: ["guest", "student"] },
    { name: "My Applications", path: "/applications", roles: ["student"] },
    { name: "Companies", path: "/admin/companies", roles: ["recruiter"] },
    { name: "Manage Jobs", path: "/admin/jobs", roles: ["recruiter"] },
  ];

  const visibleLinks = navLinks.filter(link => {
    if (!user) return link.roles.includes("guest");
    return link.roles.includes(user.role);
  });

  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 text-indigo-400 font-extrabold text-2xl tracking-wide">
          <Briefcase className="w-8 h-8 text-indigo-500 animate-pulse" />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            UrNext
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center space-x-8">
          {visibleLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-semibold transition-colors duration-200 ${
                isActive(link.path)
                  ? "text-indigo-400 border-b-2 border-indigo-400 pb-1"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* User Info / Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-3 bg-slate-800 hover:bg-slate-700 py-1.5 px-3.5 rounded-full border border-slate-700 transition duration-200"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white uppercase text-sm">
                  {user.fullname ? user.fullname.substring(0, 2) : "US"}
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-white leading-tight max-w-[120px] truncate">{user.fullname}</p>
                  <span className="text-[10px] text-indigo-300 capitalize">{user.role}</span>
                </div>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 glass-card">
                  <div className="px-4 py-2.5 border-b border-slate-800">
                    <p className="text-sm text-slate-400">Signed in as</p>
                    <p className="text-xs font-medium text-white truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
                  >
                    <UserIcon className="w-4 h-4 text-indigo-400" />
                    <span>My Profile</span>
                  </Link>
                  {user.role === "recruiter" && (
                    <>
                      <Link
                        to="/admin/companies"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
                      >
                        <Building2 className="w-4 h-4 text-purple-400" />
                        <span>Manage Companies</span>
                      </Link>
                      <Link
                        to="/admin/jobs/create"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
                      >
                        <PlusCircle className="w-4 h-4 text-pink-400" />
                        <span>Post a New Job</span>
                      </Link>
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-rose-400 hover:bg-slate-800 hover:text-rose-300 transition text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-sm font-semibold text-slate-300 hover:text-white transition duration-200"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 px-5 rounded-lg transition duration-200 shadow-md shadow-indigo-600/30 hover:scale-[1.02]"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-300 hover:text-white focus:outline-none">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Links */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-slate-800 flex flex-col space-y-4">
          {visibleLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`text-base font-semibold px-2 py-1 rounded transition duration-200 ${
                isActive(link.path)
                  ? "text-indigo-400 bg-slate-800/40"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <hr className="border-slate-800" />
          {user ? (
            <div className="flex flex-col space-y-3 px-2">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm">
                  {user.fullname ? user.fullname.substring(0, 2) : "US"}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{user.fullname}</p>
                  <span className="text-[10px] text-indigo-300 capitalize">{user.role}</span>
                </div>
              </div>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm text-slate-300 hover:text-white py-1 flex items-center space-x-2"
              >
                <UserIcon className="w-4 h-4 text-indigo-400" />
                <span>My Profile</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-rose-400 hover:text-rose-300 py-1 text-left flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-3 px-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center text-sm font-semibold text-slate-300 hover:text-white py-2 rounded-lg border border-slate-800 transition"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
