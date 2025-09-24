import React, { useRef, useState, useContext } from "react";
import JoditEditor from "jodit-react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import "react-step-progress-bar/styles.css";
import { ProgressBar } from "react-step-progress-bar";

// React Icons
import { MdSubtitles } from "react-icons/md";
import { IoChevronBack } from "react-icons/io5";

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
        setjobSteps(0)
        setSubCategories([]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const [jobSteps, setjobSteps] = useState(0);
  console.log(jobData.title);


  return (
    <div className="w-full p-6 h-[calc(100vh-4.6rem)] rounded-lg overflow-y-auto">
      <h1 className="text-[var(--primary-color)] mb-8 font-semibold">List New Jobs</h1>
      <ProgressBar
        percent={jobSteps * 14.285714285714286 + 14.285714285714286}
        filledBackground="linear-gradient(to right, var(--primary-color), var(--secondary-color)"
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          postJob();
        }}
        className="flex flex-col gap-4 px-16 py-10 mt-4"
      >
        <button className="h-9 w-9"
          disabled={jobSteps === 0}
        >
          <IoChevronBack />
        </button>
        {jobSteps === 0 && <>
          <h2 className="font-semibold flex items-center gap-3">
            <MdSubtitles className="text-[var(--primary-color)]" /> Add Title
          </h2>
          <div className="flex flex-col mt-2">
            {/* Title */}
            <label htmlFor="title" className="font-medium">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={jobData.title || ""}
              onChange={handleJobChange}
              className="px-4 py-2 focus:outline-3 outline-[var(--primary-color)] hover:shadow-md transition-all outline-offset-2 border-2 focus:border-[var(--primary-color)] rounded-xl"
              placeholder="Title"
            />

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

          <button type="button" onClick={(e) => {
            if (!jobData.title && !jobData.category) {
              toast.error('Missing Details')
            } else {
              setjobSteps(1);
            }
          }}>
            Next
          </button>
        </>}

        {jobSteps === 1 && <>
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

          <button type="button" onClick={() => {
            if (!jobData.subCategory && !jobData.jobType && !jobData.locationType) {
              toast.error("Job Details Required")
            } else {
              setjobSteps(2);
            }
          }}>
            Next
          </button>
        </>}

        {jobSteps === 2 && <div>
          {/* Description */}
          <h3 className="font-bold mb-4">
            Description
          </h3>
          <JoditEditor
            ref={editor}
            // remove value here OR set defaultValue
            defaultValue={jobData.description || ""}
            config={{
              readonly: false,
              height: 400,
              uploader: { insertImageAsBase64URI: true },
              buttons: [
                "bold",
                "italic",
                "|",
                "paragraph",
                "h1",
                "h2",
                "h3",
                "|",
                "link",
                "image",
                "blockquote",
              ],
              toolbarAdaptive: false,
            }}
            onBlur={(newContent) =>
              setJobData((prev) => ({ ...prev, description: newContent }))
            }
          />
          <button type="button" className="mt-4" onClick={() => {
            if (!jobData.description) {
              toast.error("Missing Description")
            } else {
              setjobSteps(3);
            }
          }}>
            Next
          </button>
        </div>}


        {jobSteps === 3 && <div className="flex flex-col gap-6">
          {/* Experience */}
          <h3 className="font-bold">
            Experience
          </h3>

          <div className="flex flex-col gap-2">
            <label htmlFor="experience">Experience Required</label>
            <input
              type="text"
              name="experience"
              value={jobData.experience || ""}
              onChange={handleJobChange}
              className="px-4 py-2 focus:outline-3 outline-[var(--primary-color)] hover:shadow-md transition-all outline-offset-2 border-2 focus:border-[var(--primary-color)] rounded-xl"
              placeholder="Experience (e.g., 2 Years)"
            />
          </div>

          <div className="flex flex-col gap-2">

            {/* Application Deadline */}
            <label htmlFor="applicationDeadline">Application Deadline (in days)</label>
            <input
              type="number"
              name="applicationDeadline"
              value={jobData.applicationDeadline || ""}
              onChange={handleJobChange}
              className="px-4 py-2 focus:outline-3 outline-[var(--primary-color)] hover:shadow-md transition-all outline-offset-2 border-2 focus:border-[var(--primary-color)] rounded-xl"
              placeholder="30"
            />
          </div>

          <button type="button" className="mt-4" onClick={() => {
            if (!jobData.experience && !jobData.applicationDeadline) {
              toast.error('Experience Details Required')
            } else {
              setjobSteps(4);
            }
          }}>
            Next
          </button>
        </div>}

        {jobSteps === 4 && <div className="flex flex-col gap-2">
          <h3 className="font-bold">Location Details</h3>
          {/* City */}
          <label htmlFor="location" className="mt-8">City</label>
          <input
            type="text"
            name="location"
            value={jobData.location || ""}
            onChange={handleJobChange}
            className="px-4 py-2 focus:outline-3 outline-[var(--primary-color)] hover:shadow-md transition-all outline-offset-2 border-2 focus:border-[var(--primary-color)] rounded-xl"
            placeholder="Enter City"
          />

          <button type="button" onClick={() => {
            if (!jobData.location) {
              toast.error('Location Details Required')
            } else {
              setjobSteps(5);
            }
          }}>
            Next
          </button>
        </div>}

        {jobSteps === 5 && <div className="flex flex-col gap-2">
          <h3 className="font-bold">Salary</h3>
          <input
            type="number"
            name="salary"
            value={jobData.salary || ""}
            onChange={handleJobChange}
            className="px-4 py-2 focus:outline-3 outline-[var(--primary-color)] hover:shadow-md transition-all outline-offset-2 border-2 focus:border-[var(--primary-color)] rounded-xl"
            placeholder="In Dollars $"
          />
          <button type="button" onClick={() => {
            if (!jobData.salary) {
              toast.error('Salary Details Required')
            } else {
              setjobSteps(6);
            }
          }}>
            Next
          </button>
        </div>}
        {/* Salary */}

        {jobSteps === 6 && <div className="flex flex-col gap-2">
          {/* Skills */}
          <h3 className="font-bold">
            Skills Needed
          </h3>
          <label htmlFor="skills" className="font-medium mt-8">
            Skills
          </label>
          <input
            type="text"
            name="skills"
            value={jobData.skills || ""}
            onChange={handleJobChange}
            className="px-4 py-2 focus:outline-3 outline-[var(--primary-color)] hover:shadow-md transition-all outline-offset-2 border-2 focus:border-[var(--primary-color)] rounded-xl"
            placeholder="Enter Skills (comma separated)"
          />
          <button
            type="submit"
            className="bg-[var(--primary-color)] text-white px-4 py-2 rounded mt-2"
          >
            List
          </button>
        </div>}
      </form>
    </div>
  );
};

export default JobForm;