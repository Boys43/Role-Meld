import React, { useRef, useState, useContext } from "react";
import JoditEditor from "jodit-react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import "react-step-progress-bar/styles.css";
import { ProgressBar } from "react-step-progress-bar";
import { AnimatePresence, motion } from "framer-motion";

// React Icons
import { MdSubtitles } from "react-icons/md";
import { IoChevronBack } from "react-icons/io5";
import JobCard from "./JobCard";

// Categories & subcategories
const categories = {
  "IT & Software": [
    "Frontend Developer", "Backend Developer", "Full Stack Developer", "Mobile App Developer",
    "UI/UX Designer", "Data Scientist", "AI / ML Engineer", "DevOps Engineer", "QA / Tester",
  ],
  "Digital Marketing": [
    "SEO Specialist", "Content Marketing", "Social Media Marketing", "Email Marketing",
    "PPC / Ads", "Affiliate Marketing",
  ],
  "Design & Creative": [
    "Graphic Designer", "Illustrator", "Animator", "Product Designer", "Presentation Designer",
  ],
  "Finance & Accounting": [
    "Accountant", "Bookkeeper", "Financial Analyst", "Tax Consultant", "Audit & Compliance",
  ],
  "Human Resources": [
    "HR Manager", "Recruiter", "Training & Development", "Virtual Assistant",
  ],
  "Sales & Business Development": [
    "Sales Executive", "Business Development Manager", "Account Manager", "Lead Generation",
  ],
  "Engineering & Architecture": [
    "Civil Engineer", "Mechanical Engineer", "Electrical Engineer", "Architect", "Project Manager",
  ],
};

// Motion variants for sliding animation
const variants = {
  enter: (direction) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction > 0 ? -300 : 300, opacity: 0 }),
};

const JobForm = () => {
  const { backendUrl, userData } = useContext(AppContext);
  const editor = useRef(null);

  const [jobData, setJobData] = useState({});
  const [subCategories, setSubCategories] = useState([]);
  const [jobSteps, setJobSteps] = useState(0);
  const [direction, setDirection] = useState(0);

  const totalSteps = 7;

  const handleJobChange = (e) => {
    const { name, value } = e.target;
    if (name === "category") {
      setSubCategories(categories[value] || []);
      setJobData((prev) => ({
        ...prev,
        category: value,
        subCategory: "",
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
      const { data } = await axios.post(`${backendUrl}/api/jobs/addjob`, { jobData });
      if (data.success) {
        toast.success(data.message);
        setJobData({});
        setJobSteps(0);
        setSubCategories([]);
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const nextStep = () => {
    setDirection(1);
    setJobSteps((prev) => Math.min(prev + 1, totalSteps - 1));
  };

  const prevStep = () => {
    setDirection(-1);
    setJobSteps((prev) => Math.max(prev - 1, 0));
  };

  return (
    <main className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-x-hidden p-6 h-[calc(100vh-4.6rem)] rounded-lg overflow-y-auto">
      <section className="lg:col-span-2">
        <h1 className="text-[var(--primary-color)] mb-8 font-semibold">List New Jobs</h1>

        <ProgressBar
          percent={((jobSteps + 1) / totalSteps) * 100}
          filledBackground="linear-gradient(to right, var(--primary-color), var(--secondary-color))"
        />

        <div className="mt-4 flex items-center justify-between mb-6">
          <button
            type="button"
            disabled={jobSteps === 0}
            className="h-9 w-9 text-[var(--primary-color)]"
            onClick={prevStep}
          >
            <IoChevronBack />
          </button>
          <span>Step {jobSteps + 1} of {totalSteps}</span>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (jobSteps === totalSteps - 1) postJob();
          }}
          className="flex flex-col gap-4 px-16 py-10 mt-4"
        >
          <AnimatePresence mode="wait" custom={direction}>

            {/*  Sponsored or not */}
            {jobSteps === 0 && (
              <motion.div key={jobSteps} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }}>
                <h2 className="font-semibold flex items-center gap-3">
                  Sponsor
                </h2>
                <div className="w-full flex flex-col mt-2">
                  <label htmlFor="sponsored" className="font-medium">Sponsored</label>
                  <select
                    name="sponsored"
                    required
                    value={jobData.sponsored || ""}
                    onChange={handleJobChange}
                    className="py-2 px-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">--- Select ---</option>
                    <option value="true">Sponsored</option>
                    <option value="false">Not Sponsored</option>
                  </select>
                </div>
                
              </motion.div>
            )}

            {/* Step 0: Title & Main Category */}
            {jobSteps === 1 && (
              <motion.div key={jobSteps} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }}>
                <h2 className="font-semibold flex items-center gap-3">
                  <MdSubtitles className="text-[var(--primary-color)]" /> Add Title
                </h2>
                <div className="flex flex-col mt-2">
                  <label htmlFor="title" className="font-medium">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={jobData.title || ""}
                    onChange={handleJobChange}
                    className="px-4 py-2 focus:outline-3 outline-[var(--primary-color)] hover:shadow-md transition-all outline-offset-2 border-2 focus:border-[var(--primary-color)] rounded-xl"
                    placeholder="Title"
                  />
                </div>
                <div className="flex flex-col mt-4">
                  <label className="text-sm font-semibold mb-1">Job Category</label>
                  <select
                    name="category"
                    value={jobData.category || ""}
                    onChange={handleJobChange}
                    className="py-2 px-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">--- Select ---</option>
                    {Object.keys(categories).map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <button type="button" className="mt-4 px-4 py-2 bg-[var(--primary-color)] text-white rounded"
                  onClick={() => (!jobData.title || !jobData.category ? toast.error("Missing Details") : nextStep())}>
                  Next
                </button>
              </motion.div>
            )}

            {/* Step 1: Sub Category & Job Details */}
            {jobSteps === 2 && (
              <motion.div key={jobSteps} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }}>
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
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>

                <h3 className="font-medium mt-4">Details</h3>
                <div className="flex flex-wrap gap-4 mt-2">
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

                <button type="button" className="mt-4 px-4 py-2 bg-[var(--primary-color)] text-white rounded"
                  onClick={() => (!jobData.subCategory || !jobData.jobType || !jobData.locationType ? toast.error("Job Details Required") : nextStep())}>
                  Next
                </button>
              </motion.div>
            )}

            {/* Step 2: Description */}
            {jobSteps === 3 && (
              <motion.div key={jobSteps} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }}>
                <h3 className="font-bold mb-4">Description</h3>
                <JoditEditor
                  ref={editor}
                  defaultValue={jobData.description || ""}
                  config={{
                    readonly: false,
                    height: 400,
                    uploader: { insertImageAsBase64URI: true },
                    buttons: ["bold", "italic", "|", "paragraph", "h1", "h2", "h3", "|", "link", "image", "blockquote"],
                    toolbarAdaptive: false,
                  }}
                  onBlur={(newContent) => setJobData((prev) => ({ ...prev, description: newContent }))}
                />
                <button type="button" className="mt-4 px-4 py-2 bg-[var(--primary-color)] text-white rounded"
                  onClick={() => (!jobData.description ? toast.error("Missing Description") : nextStep())}>
                  Next
                </button>
              </motion.div>
            )}

            {/* Step 3: Experience */}
            {jobSteps === 4 && (
              <motion.div key={jobSteps} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }} className="flex flex-col gap-6">
                <h3 className="font-bold">Experience</h3>
                <div className="flex flex-col gap-2">
                  <label htmlFor="experience">Experience Required</label>
                  <input type="text" name="experience" value={jobData.experience || ""} onChange={handleJobChange}
                    className="px-4 py-2 focus:outline-3 outline-[var(--primary-color)] hover:shadow-md transition-all outline-offset-2 border-2 focus:border-[var(--primary-color)] rounded-xl"
                    placeholder="Experience (e.g., 2 Years)" />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="applicationDeadline">Application Deadline (in days)</label>
                  <input type="number" name="applicationDeadline" value={jobData.applicationDeadline || ""} onChange={handleJobChange}
                    className="px-4 py-2 focus:outline-3 outline-[var(--primary-color)] hover:shadow-md transition-all outline-offset-2 border-2 focus:border-[var(--primary-color)] rounded-xl"
                    placeholder="30" />
                </div>
                <button type="button" className="mt-4 px-4 py-2 bg-[var(--primary-color)] text-white rounded"
                  onClick={() => (!jobData.experience || !jobData.applicationDeadline ? toast.error("Experience Details Required") : nextStep())}>
                  Next
                </button>
              </motion.div>
            )}

            {/* Step 4: Location */}
            {jobSteps === 5 && (
              <motion.div key={jobSteps} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }} className="flex flex-col gap-2">
                <h3 className="font-bold">Location Details</h3>
                <label htmlFor="location" className="mt-4">City</label>
                <input type="text" name="location" value={jobData.location || ""} onChange={handleJobChange}
                  className="px-4 py-2 focus:outline-3 outline-[var(--primary-color)] hover:shadow-md transition-all outline-offset-2 border-2 focus:border-[var(--primary-color)] rounded-xl"
                  placeholder="Enter City" />
                <button type="button" className="mt-4 px-4 py-2 bg-[var(--primary-color)] text-white rounded"
                  onClick={() => (!jobData.location ? toast.error("Location Details Required") : nextStep())}>
                  Next
                </button>
              </motion.div>
            )}

            {/* Step 5: Salary */}
            {jobSteps === 6 && (
              <motion.div key={jobSteps} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }} className="flex flex-col gap-2">
                <h3 className="font-bold">Salary</h3>
                <input type="number" name="salary" value={jobData.salary || ""} onChange={handleJobChange}
                  className="px-4 py-2 focus:outline-3 outline-[var(--primary-color)] hover:shadow-md transition-all outline-offset-2 border-2 focus:border-[var(--primary-color)] rounded-xl"
                  placeholder="In Dollars $" />
                <button type="button" className="mt-4 px-4 py-2 bg-[var(--primary-color)] text-white rounded"
                  onClick={() => (!jobData.salary ? toast.error("Salary Details Required") : nextStep())}>
                  Next
                </button>
              </motion.div>
            )}

            {/* Step 6: Skills & Submit */}
            {jobSteps === 7 && (
              <motion.div key={jobSteps} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }} className="flex flex-col gap-2">
                <h3 className="font-bold">Skills Needed</h3>
                <label htmlFor="skills" className="font-medium mt-4">Skills</label>
                <input type="text" name="skills" value={jobData.skills || ""} onChange={handleJobChange}
                  className="px-4 py-2 focus:outline-3 outline-[var(--primary-color)] hover:shadow-md transition-all outline-offset-2 border-2 focus:border-[var(--primary-color)] rounded-xl"
                  placeholder="Enter Skills (comma separated)" />
                <button type="submit" className="bg-[var(--primary-color)] text-white px-4 py-2 rounded mt-2">List Job</button>
              </motion.div>
            )}

          </AnimatePresence>
        </form>
      </section>
      <section className="p-2 sticky top-4 hidden lg:block">
        <h1>Preview</h1>
        <JobCard e={jobData} />
      </section>
    </main>
  );
};

export default JobForm;