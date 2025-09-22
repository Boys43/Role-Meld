import React, { useRef, useState, useContext } from "react";
import JoditEditor from "jodit-react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

// Define categories and subcategories
const categories = {
  "IT & Software": [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Mobile App Developer",
    "UI/UX Designer",
    "Data Scientist",
    "AI / ML Engineer",
    "DevOps Engineer",
    "QA / Tester",
  ],
  "Digital Marketing": [
    "SEO Specialist",
    "Content Marketing",
    "Social Media Marketing",
    "Email Marketing",
    "PPC / Ads",
    "Affiliate Marketing",
  ],
  "Design & Creative": [
    "Graphic Designer",
    "Illustrator",
    "Animator",
    "Product Designer",
    "Presentation Designer",
  ],
  "Finance & Accounting": [
    "Accountant",
    "Bookkeeper",
    "Financial Analyst",
    "Tax Consultant",
    "Audit & Compliance",
  ],
  "Human Resources": [
    "HR Manager",
    "Recruiter",
    "Training & Development",
    "Virtual Assistant",
  ],
  "Sales & Business Development": [
    "Sales Executive",
    "Business Development Manager",
    "Account Manager",
    "Lead Generation",
  ],
  "Engineering & Architecture": [
    "Civil Engineer",
    "Mechanical Engineer",
    "Electrical Engineer",
    "Architect",
    "Project Manager",
  ],
};

const JobForm = () => {
  const { backendUrl, userData } = useContext(AppContext);
  const [jobData, setJobData] = useState({});
  const [subCategories, setSubCategories] = useState([]);
  const editor = useRef(null);

  const handleJobChange = (e) => {
    const { name, value } = e.target;

    // If main category changes, update subcategories
    if (name === "category") {
      setSubCategories(categories[value] || []);
      setJobData((prev) => ({
        ...prev,
        category: value,
        subCategory: "", // reset subcategory when category changes
        companyProfile: userData.profilePicture,
        company: userData.company,
      }));
    } else {
      setJobData((prev) => ({
        ...prev,
        [name]: value,
        companyProfile: userData.profilePicture,
        company: userData.company,
      }));
    }
  };

  const postJob = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/jobs/addjob`, {
        jobData,
      });
      if (data.success) {
        toast.success(data.message);
        setJobData({});
        setSubCategories([]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="w-full p-6 h-[calc(100vh-4.6rem)] rounded-lg overflow-y-auto cursor-pointer">
      <h1 className="text-[var(--primary-color)] font-semibold">List New Jobs</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          postJob();
        }}
        className="flex flex-col gap-2 mt-4"
      >
        {/* Title */}
        <label htmlFor="title" className="font-medium">
          Title
        </label>
        <input
          type="text"
          name="title"
          value={jobData.title || ""}
          onChange={handleJobChange}
          className="p-2 border-2 focus:border-[var(--primary-color)] rounded"
          placeholder="Title"
        />

        {/* Description */}
        <label htmlFor="description" className="font-medium">
          Description
        </label>
        <JoditEditor
          ref={editor}
          value={jobData.description || ""}
          onChange={(content) =>
            setJobData((prev) => ({ ...prev, description: content }))
          }
        />

        {/* Details */}
        <h3 className="font-medium">Details</h3>
        <div className="flex flex-wrap gap-4">
          {/* Location Type */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Location Type</label>
            <select
              name="locationType"
              value={jobData.locationType || ""}
              onChange={handleJobChange}
              className="py-2 px-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Location Type</option>
              <option value="Remote">Remote</option>
              <option value="On Site">On-site</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          {/* Main Category */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Job Category</label>
            <select
              name="category"
              value={jobData.category || ""}
              onChange={handleJobChange}
              className="py-2 px-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Category</option>
              {Object.keys(categories).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Sub Category */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Sub Category</label>
            <select
              name="subCategory"
              value={jobData.subCategory || ""}
              onChange={handleJobChange}
              className="py-2 px-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              disabled={!subCategories.length}
            >
              <option value="">Select Sub Category</option>
              {subCategories.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          {/* Job Type */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Job Type</label>
            <select
              name="jobType"
              value={jobData.jobType || ""}
              onChange={handleJobChange}
              className="py-2 px-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Job Type</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Contract">Contract</option>
            </select>
          </div>
        </div>

        {/* Experience */}
        <label htmlFor="experience">Experience Required</label>
        <input
          type="text"
          name="experience"
          value={jobData.experience || ""}
          onChange={handleJobChange}
          className="p-2 border-2 focus:border-[var(--primary-color)] rounded"
          placeholder="Experience (e.g., 2 Years)"
        />

        {/* Application Deadline */}
        <label htmlFor="applicationDeadline">Application Deadline (in days)</label>
        <input
          type="number"
          name="applicationDeadline"
          value={jobData.applicationDeadline || ""}
          onChange={handleJobChange}
          className="p-2 border-2 focus:border-[var(--primary-color)] rounded"
          placeholder="30"
        />

        {/* City */}
        <label htmlFor="location">City</label>
        <input
          type="text"
          name="location"
          value={jobData.location || ""}
          onChange={handleJobChange}
          className="p-2 border-2 focus:border-[var(--primary-color)] rounded"
          placeholder="Enter City"
        />

        {/* Salary */}
        <label htmlFor="salary">Salary ($)</label>
        <input
          type="number"
          name="salary"
          value={jobData.salary || ""}
          onChange={handleJobChange}
          className="p-2 border-2 focus:border-[var(--primary-color)] rounded"
          placeholder="In Dollars $"
        />

        {/* Skills */}
        <label htmlFor="skills" className="font-medium mt-2">
          Skills
        </label>
        <input
          type="text"
          name="skills"
          value={jobData.skills || ""}
          onChange={handleJobChange}
          className="p-2 border-2 focus:border-[var(--primary-color)] rounded"
          placeholder="Enter Skills (comma separated)"
        />

        <button
          type="submit"
          className="bg-[var(--primary-color)] text-white px-4 py-2 rounded mt-2"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default JobForm;