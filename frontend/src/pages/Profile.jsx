import { useState, useEffect } from "react";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Phone, BookOpen, Award, Edit3, X, Loader2, Calendar, ClipboardCheck } from "lucide-react";

export default function Profile() {
  const { user, updateUser } = useAuth();
  
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullname, setFullname] = useState(user?.fullname || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [bio, setBio] = useState(user?.profile?.bio || "");
  const [skills, setSkills] = useState(user?.profile?.skills?.join(", ") || "");
  
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");
  const [modalSuccess, setModalSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setFullname(user.fullname || "");
      setEmail(user.email || "");
      setPhoneNumber(user.phoneNumber || "");
      setBio(user.profile?.bio || "");
      setSkills(user.profile?.skills?.join(", ") || "");

      if (user.role === "student") {
        fetchAppliedJobs();
      }
    }
  }, [user]);

  const fetchAppliedJobs = async () => {
    setLoadingApps(true);
    try {
      const data = await api.get("/application/get");
      if (data.success) {
        setAppliedJobs(data.application || []);
      }
    } catch (err) {
      console.warn("Error fetching application logs:", err.message);
    } finally {
      setLoadingApps(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setModalError("");
    setModalSuccess("");
    setModalLoading(true);

    try {
      const cleanPhone = phoneNumber.toString().replace(/\D/g, "");
      const data = await api.put("/user/profile/update", {
        fullname,
        email,
        phoneNumber: cleanPhone,
        bio,
        skills,
      });

      if (data.success) {
        updateUser(data.user);
        setModalSuccess("Profile updated successfully!");
        setTimeout(() => {
          setIsModalOpen(false);
          setModalSuccess("");
        }, 1500);
      } else {
        setModalError(data.message || "Failed to update profile.");
      }
    } catch (err) {
      setModalError(err.message || "Failed to update profile.");
    } finally {
      setModalLoading(false);
    }
  };

  const getStatusBadge = (status) => {
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
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400 animate-pulse">
        Pending
      </span>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center text-white">
        <p>Loading Profile data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white py-12 px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Profile Header Block */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 glass shadow-2xl relative">
          <button
            onClick={() => setIsModalOpen(true)}
            className="absolute top-6 right-6 flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/10"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-extrabold text-white text-3xl uppercase shrink-0 shadow-lg shadow-indigo-500/20">
              {user.fullname ? user.fullname.substring(0, 2) : "US"}
            </div>
            
            <div className="space-y-4 text-center md:text-left w-full">
              <div>
                <h1 className="text-3xl font-extrabold text-white">{user.fullname}</h1>
                <p className="text-indigo-400 text-xs font-bold uppercase tracking-wider mt-1">{user.role}</p>
              </div>

              {/* Bio */}
              <p className="text-sm text-slate-300 leading-relaxed max-w-2xl bg-slate-950/20 p-4 rounded-xl border border-slate-850/20">
                {user.profile?.bio || "No bio added yet. Tell us about yourself."}
              </p>

              {/* User Metadata */}
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-xl text-xs text-slate-400">
                <span className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </span>
                <span className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>{user.phoneNumber}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Skills */}
          {user.role === "student" && (
            <div className="mt-8 pt-6 border-t border-slate-800/80">
              <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase flex items-center mb-3">
                <Award className="w-4.5 h-4.5 text-indigo-400 mr-2" />
                <span>Skills</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {user.profile?.skills && user.profile.skills.length > 0 ? (
                  user.profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-indigo-500/5 border border-indigo-500/20 text-slate-300 py-1.5 px-3 rounded-lg text-xs font-semibold"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">No skills listed yet. Add them in edit profile.</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Candidate applied jobs logs */}
        {user.role === "student" && (
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 glass shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
              <ClipboardCheck className="w-5 h-5 text-indigo-400" />
              <span>Applied Jobs History</span>
            </h2>

            {loadingApps ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
              </div>
            ) : appliedJobs.length === 0 ? (
              <div className="text-center py-12 bg-slate-950/20 border border-slate-850 rounded-2xl">
                <p className="text-slate-500 text-sm">You haven't applied to any jobs yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-950/60 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-4 rounded-tl-xl">Job Details</th>
                      <th className="px-6 py-4">Company</th>
                      <th className="px-6 py-4">Date Applied</th>
                      <th className="px-6 py-4 rounded-tr-xl">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {appliedJobs.map((app) => (
                      <tr key={app._id} className="hover:bg-slate-800/25 transition">
                        <td className="px-6 py-4">
                          <p className="font-bold text-white text-sm">{app.job?.title || "Position Unavailable"}</p>
                          <span className="text-[10px] text-slate-500 capitalize">{app.job?.jobType} • {app.job?.location}</span>
                        </td>
                        <td className="px-6 py-4 text-slate-400">{app.job?.company?.name || "N/A"}</td>
                        <td className="px-6 py-4 text-slate-400 text-xs">
                          {new Date(app.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                        </td>
                        <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Edit Profile Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-8 shadow-2xl glass relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white transition"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-white mb-6">Update Profile</h2>

            {modalError && (
              <div className="mb-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
                {modalError}
              </div>
            )}

            {modalSuccess && (
              <div className="mb-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                {modalSuccess}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl p-3 text-sm text-white"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl p-3 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Phone</label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl p-3 text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows="3"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl p-3 text-sm text-white resize-none"
                  placeholder="Introduce yourself..."
                ></textarea>
              </div>

              {user.role === "student" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Skills (comma-separated)</label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="React, Express, Node.js, CSS"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl p-3 text-sm text-white"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={modalLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 py-3.5 px-4 rounded-xl font-bold text-sm text-white transition flex items-center justify-center space-x-2 disabled:opacity-50 mt-6"
              >
                {modalLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Save Changes</span>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
