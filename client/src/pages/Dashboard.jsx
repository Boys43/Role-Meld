import React, { useContext, useState } from "react";
import Sidebar from "../components/Sidebar";
import ApplicantDashboard from "../components/ApplicantDashboard";
import SavedJobs from "../components/SavedJobs";
import AppliedJobs from "../components/AppliedJobs";
import EmployeeDashboard from "../components/EmployeeDashboard";
import Applications from "../components/Applications";
import JobForm from "../components/JobsForm";
import { AppContext } from "../context/AppContext";
import RecruiterJobs from "../components/RecruiterJobs";
import AdminBlog from "../components/AdminBlog";
import MyResume from "../components/MyResume";
import MyProfile from "../components/MyProfile";
import ChangePassword from "../components/ChangePassword";
import DeleteProfile from "../components/DeleteProfile";
import RecruiterProfile from "../components/RecruiterProfile";

const Dashboard = () => {
  const { userData } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState(userData?.role === "user" ? "userdashboard" : "recruiterdashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "userdashboard":
        return <ApplicantDashboard setActiveTab={setActiveTab} />;
      case "savedjobs":
        return <SavedJobs />;
      case "applied-jobs":
        return <AppliedJobs />
      case "recruiterdashboard":
        return <EmployeeDashboard />;
      case "applications":
        return <Applications />;
      case "list-job":
        return <JobForm setActiveTab={setActiveTab} />
      case "listed-jobs":
        return <RecruiterJobs />
      case "my-resume":
        return <MyResume />
      case "my-profile":
        return <MyProfile />
      case "recruiter-profile":
        return <RecruiterProfile />
      case "change-password":
        return <ChangePassword />
      case "delete-account":
        return <DeleteProfile setActiveTab={setActiveTab} />
      default:
        if (userData?.role === "user") return <ApplicantDashboard />;
        if (userData?.role === "recruiter") return <EmployeeDashboard />;
        return null;

    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      {renderContent()}
    </div>
  );
};

export default Dashboard;