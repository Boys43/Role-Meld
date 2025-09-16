import React, { useContext, useState } from "react";
import Sidebar from "../components/Sidebar";
import ApplicantDashboard from "../components/ApplicantDashboard";
import SavedJobs from "../components/SavedJobs";
import FindJobs from "../components/FindJobs";
import AppliedJobs from "../components/AppliedJobs";
import EmployeeDashboard from "../components/EmployeeDashboard";
import Applications from "../components/Applications";
import JobForm from "../components/JobsForm";
import { AppContext } from "../context/AppContext";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("userdashboard");
  const { userData } = useContext(AppContext);

  const renderContent = () => {
    switch (activeTab) {
      case "userdashboard":
        return <ApplicantDashboard />;
      case "savedjobs":
        return <SavedJobs />;
      case "find-jobs":
        return <FindJobs />;
      case "applied-jobs":
        return <AppliedJobs />
      case "recruiterdashboard":
        return <EmployeeDashboard />;
      case "applications":
        return <Applications />;
      case "list-job":
        return <JobForm />
      default:
        if (userData?.role === "user") return <ApplicantDashboard />;
        if (userData?.role === "recruiter") return <EmployeeDashboard />;
        return null;

    }
  };

  return (
    <div className="flex w-full h-screen">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">{renderContent()}</div>
    </div>
  );
};

export default Dashboard;