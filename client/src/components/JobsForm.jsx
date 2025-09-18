import React, { useRef, useState, useContext } from "react";
import JoditEditor from "jodit-react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

const JobForm = () => {
  const { backendUrl, userData } = useContext(AppContext);
  const [jobData, setJobData] = useState({});
  const editor = useRef(null);

  const handleJobChange = (e) => {
    setJobData({
      ...jobData,
      [e.target.name]: e.target.value,
      companyProfile: userData.profilePicture,
      company: userData.company,
    });
  };

  const postJob = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/jobs/addjob`, {
        jobData,
      });
      if (data.success) {
        toast.success(data.message);
        setJobData({}); // clear form
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

        {/* Location Type */}
        <h3 className="font-medium">Details</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Location Type</label>
            <select
              name="locationType"
              value={jobData.locationType || ""}
              onChange={handleJobChange}
              className="py-2 px-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Location Type</option>
              <option value="remote">Remote</option>
              <option value="on-site">On-site</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          {/* Job Category */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Job Category</label>
            <select
              name="category"
              value={jobData.category || ""}
              onChange={handleJobChange}
              className="py-2 px-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Category</option>
              <option value="frontend">Frontend Developer</option>
              <option value="backend">Backend Developer</option>
              <option value="fullstack">Full Stack Developer</option>
              <option value="mobile">Mobile App Developer</option>
              <option value="uiux">UI/UX Designer</option>
              <option value="datascientist">Data Scientist</option>
              <option value="mlai">AI / ML Engineer</option>
              <option value="devops">DevOps Engineer</option>
              <option value="qa">QA / Tester</option>
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