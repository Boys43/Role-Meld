import React, { lazy, Suspense, useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Loader, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import FooterBottom from "../components/FooterBottom";

// Layout
const Sidebar = lazy(() => import("../components/Sidebar"));

// Applicant Components
const ApplicantDashboard = lazy(() => import("../components/ApplicantDashboard"));
const SavedJobs = lazy(() => import("../components/SavedJobs"));
const AppliedJobs = lazy(() => import("../components/AppliedJobs"));
const MyResume = lazy(() => import("../components/MyResume"));
const MyProfile = lazy(() => import("../components/MyProfile"));
const ChangePassword = lazy(() => import("../components/ChangePassword"));

// Employee Components
const EmployeeDashboard = lazy(() => import("../components/EmployeeDashboard"));
const EmployeeProfileRequests = lazy(() => import("../components/EmployeeProfileRequests"));

// Recruiter Components
const RecruiterJobs = lazy(() => import("../components/RecruiterJobs"));
const RecruiterProfile = lazy(() => import("../components/RecruiterProfile"));

// Admin Components
const AdminBlog = lazy(() => import("../components/AdminBlog"));
const AdminListedBlogs = lazy(() => import("../components/AdminListedBlogs"));
const AdminUsers = lazy(() => import("../components/AdminUsers"));
const AdminRecruiters = lazy(() => import("../components/AdminRecruiters"));
const CategoryManager = lazy(() => import("../components/CategoryManager"));
const AdminJobRequests = lazy(() => import("../components/AdminJobRequests"));
const JobForm = lazy(() => import("../components/JobsForm"));
const Applications = lazy(() => import("../components/Applications"));
const Settings = lazy(() => import("../components/Settings"));

const Dashboard = () => {
  // Auto Scroll to Top
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [])
  const { userData } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Map activeTab to lazy-loaded components
  const componentMap = {
    // New modern sidebar tabs
    dashboard: userData?.role === "user" ? ApplicantDashboard : EmployeeDashboard,
    jobs: RecruiterJobs,
    applicants: Applications,
    candidates: AdminUsers,
    package: SavedJobs,
    messages: () => <div className="p-6"><h1 className="text-2xl font-bold">Messages</h1><p>Messages feature coming soon...</p></div>,
    meetings: () => <div className="p-6"><h1 className="text-2xl font-bold">Meetings</h1><p>Meetings feature coming soon...</p></div>,
    company: () => <div className="p-6"><h1 className="text-2xl font-bold">Company</h1><p>Company management coming soon...</p></div>,
    "post-job": JobForm,
    
    // Legacy tabs for backward compatibility
    userdashboard: ApplicantDashboard,
    savedjobs: SavedJobs,
    "applied-jobs": AppliedJobs,
    recruiterdashboard: EmployeeDashboard,
    applications: Applications,
    "list-job": JobForm,
    "listed-jobs": RecruiterJobs,
    "my-resume": MyResume,
    "my-profile": MyProfile,
    "recruiter-profile": RecruiterProfile,
    "change-password": ChangePassword,
    settings: Settings,
    "blog-management": AdminListedBlogs,
    "add-blog": AdminBlog,
    "employee-profile-requests": EmployeeProfileRequests,
    users: AdminUsers,
    recruiters: AdminRecruiters,
    "cat-manager": CategoryManager,
    "job-requests": AdminJobRequests,
  };

  const ActiveComponent =
    componentMap[activeTab] ||
    (userData?.role === "user" ? ApplicantDashboard : EmployeeDashboard);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 ml-64">
        <Navbar />
        <main className="p-6">
          <Suspense
            fallback={
              <Loading />
            }
          >
            <ActiveComponent setActiveTab={setActiveTab} />
          </Suspense>
        </main>
        <FooterBottom />
      </div>
    </div>
  );
};

export default Dashboard;