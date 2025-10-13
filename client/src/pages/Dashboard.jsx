import React, { lazy, Suspense, useContext, useState } from "react";
import { AppContext } from "../context/AppContext";

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
const RecruiterApprovalRequests = lazy(() => import("../components/RecruiterApprovalRequests"));

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
  const { userData } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState(
    userData?.role === "user" ? "userdashboard" : "recruiterdashboard"
  );

  // Map activeTab to lazy-loaded components
  const componentMap = {
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
    "employee-requests": RecruiterApprovalRequests,
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
    <div className="flex min-h-screen">
      <Suspense
        fallback={
          <div className="w-full h-screen flex items-center justify-center">
            Loading...
          </div>
        }
      >
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <ActiveComponent setActiveTab={setActiveTab} />
      </Suspense>
    </div>
  );
};

export default Dashboard;