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

const Dashboard = () => {
  const { userData } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState(userData?.role === "user" ? "userdashboard" : "recruiterdashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "userdashboard":
        return <ApplicantDashboard />;
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
      default:
        if (userData?.role === "user") return <ApplicantDashboard />;
        if (userData?.role === "recruiter") return <EmployeeDashboard />;
        return null;

    }
  };

  return (
    <div className="flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      {renderContent()}
    </div>
  );
};

export default Dashboard;