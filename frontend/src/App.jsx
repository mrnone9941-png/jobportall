import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

// User Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import Profile from "./pages/Profile";

// Recruiter/Admin Pages
import Companies from "./pages/admin/Companies";
import CompanyEdit from "./pages/admin/CompanyEdit";
import JobCreate from "./pages/admin/JobCreate";
import JobsManage from "./pages/admin/JobsManage";
import Applicants from "./pages/admin/Applicants";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Candidate/Guest Browse Routes */}
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<JobDetail />} />

              {/* Protected Candidate Routes */}
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/applications"
                element={
                  <PrivateRoute allowedRoles={["student"]}>
                    <Profile />
                  </PrivateRoute>
                }
              />

              {/* Protected Recruiter Routes */}
              <Route
                path="/admin/companies"
                element={
                  <PrivateRoute allowedRoles={["recruiter"]}>
                    <Companies />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/companies/:id"
                element={
                  <PrivateRoute allowedRoles={["recruiter"]}>
                    <CompanyEdit />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/jobs"
                element={
                  <PrivateRoute allowedRoles={["recruiter"]}>
                    <JobsManage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/jobs/create"
                element={
                  <PrivateRoute allowedRoles={["recruiter"]}>
                    <JobCreate />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/jobs/:id/applicants"
                element={
                  <PrivateRoute allowedRoles={["recruiter"]}>
                    <Applicants />
                  </PrivateRoute>
                }
              />

              {/* Fallback to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Premium Footer */}
          <footer className="bg-slate-950 border-t border-slate-900 py-8 px-6 text-center text-slate-500 text-xs">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <p>&copy; {new Date().getFullYear()} UrNext. All rights reserved.</p>
              <div className="flex space-x-6">
                <a href="#" className="hover:text-slate-350 transition">Privacy Policy</a>
                <a href="#" className="hover:text-slate-350 transition">Terms of Service</a>
                <a href="#" className="hover:text-slate-350 transition">Support</a>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}
