import React, { useRef, useState, useContext, useEffect } from "react";
import JoditEditor from "jodit-react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import "react-step-progress-bar/styles.css";
import { ProgressBar } from "react-step-progress-bar";
import { AnimatePresence, motion } from "framer-motion";

// React Icons
import { IoChevronBack } from "react-icons/io5";
import JobCard from "./JobCard";
import { debounce } from "lodash";
// Motion variants for sliding animation
const variants = {
  enter: (direction) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction > 0 ? -300 : 300, opacity: 0 }),
};

const JobForm = ({ setActiveTab }) => {
  const { backendUrl, userData } = useContext(AppContext);
  const [currentRes, setCurrentRes] = useState('')
  const [currentSkill, setCurrentSkill] = useState('')
  const [currentBenefit, setCurrentBenefit] = useState('')

  // Remove the static categories object

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const getCategories = async () => {
    setCategoriesLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/categories`);
      if (data.success) {
        setCategories(data.categories); // Expecting data.categories = [{name, subcategories: []}]
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);


  const [jobData, setJobData] = useState({});
  const [jobSteps, setJobSteps] = useState(0);
  const [direction, setDirection] = useState(0);

  const totalSteps = 9;

  const handleJobChange = (e) => {
    const { name, value } = e.target;

    if (name === "category") {
      const selectedCategory = categories.find(cat => cat.name === value);
      setSubCategories(selectedCategory?.subcategories || []);
      setJobData(prev => ({
        ...prev,
        category: value,
        subCategory: "", // reset subcategory
        companyProfile: userData.profilePicture,
        company: userData.company,
      }));
    } else {
      setJobData(prev => ({
        ...prev,
        [name]: value,
        companyProfile: userData.profilePicture,
        company: userData.company,
      }));
    }
  };


  const postJob = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/jobs/addjob`, { jobData, userId: userData._id });
      if (data.success) {
        toast.success(data.message);
        setJobData({});
        setJobSteps(0);
        setSubCategories([]);
        setActiveTab("listed-jobs")
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
    <main className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-x-hidden p-6 h-[calc(100vh-4.6rem)] rounded-lg overflow-y-auto relative">
      <section className="lg:col-span-2">
        <h1 className="text-[var(--primary-color)] mb-8 font-semibold">Publish New Jobs</h1>

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
          className="flex flex-col gap-4 px-8 py-5 mt-4"
        >
          <AnimatePresence mode="wait" custom={direction}>

            {/* Step 0: Job Title & Company */}
            {jobSteps === 0 && (
              <motion.div key={jobSteps} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }}>
                <h2 className="font-semibold text-lg mb-4">Step 1: Job Title & Company</h2>

                {/* Job Title */}
                <div className="flex flex-col mt-2">
                  <label htmlFor="title" className="font-medium mb-2">Job Title *</label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={jobData.title || ""}
                    onChange={handleJobChange}
                    className="px-4 py-2 focus:outline-3 outline-[var(--primary-color)] hover:shadow-md transition-all outline-offset-2 border-2 focus:border-[var(--primary-color)] rounded-xl"
                    placeholder="e.g., Senior Frontend Developer"
                  />
                </div>

                <hr className="my-8" />

                {/* Location Type */}
                <div className="flex flex-col mt-4">
                  <label className="font-medium mb-2">Location Type *</label>
                  <div className="relative">
                    <select
                      name="locationType"
                      required
                      value={jobData.locationType || ""}
                      onChange={handleJobChange}
                      className="py-2.5 px-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 appearance-none bg-white cursor-pointer transition duration-200"
                    >
                      <option value="">Select Location Type</option>
                      <option value="remote">🌍 Remote</option>
                      <option value="on-site">🏢 On-site</option>
                      <option value="hybrid">⚙️ Hybrid</option>
                    </select>

                    {/* Custom dropdown arrow */}
                    <svg
                      className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>


                {/* Location (conditional) */}
                {(jobData.locationType === "on-site" || jobData.locationType === "hybrid") && (
                  <div className="flex flex-col mt-4">
                    <label htmlFor="location" className="font-medium mb-2">Location *</label>
                    <input
                      type="text"
                      name="location"
                      required
                      value={jobData.location || ""}
                      onChange={handleJobChange}
                      className="px-4 py-2 focus:outline-3 outline-[var(--primary-color)] hover:shadow-md transition-all outline-offset-2 border-2 focus:border-[var(--primary-color)] rounded-xl"
                      placeholder="City, State/Country"
                    />
                  </div>
                )}

                <button type="button" className="mt-6 px-4 py-2 bg-[var(--primary-color)] text-white rounded"
                  onClick={() => {
                    if (!jobData.title || !jobData.company) {
                      toast.error("Please fill all required fields");
                    } else {
                      nextStep();
                    }
                  }}>
                  Next
                </button>
              </motion.div>
            )}

            {/* Step 1: Location & Job Type */}
            {jobSteps === 1 && (
              <motion.div key={jobSteps} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }}>
                <h2 className="font-semibold text-lg mb-4">Step 2: Location & Job Type</h2>

                {/* Job Type */}
                <div className="flex flex-col my-6">
                  <label className="font-medium mb-2">Job Type *</label>
                  <select
                    name="jobType"
                    required
                    value={jobData.jobType || ""}
                    onChange={handleJobChange}
                    className="py-2 px-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Select Job Type</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="temporary">Temporary</option>
                  </select>
                </div>


                {/* Conditional fields based on Job Type */}
                {jobData.jobType === "full-time" && (
                  <div className="flex flex-col mb-4">
                    <hr className="my-8" />
                    <label htmlFor="hoursPerWeek" className="font-medium mb-2">Hours per Week *</label>
                    <input
                      type="number"
                      name="hoursPerWeek"
                      required
                      value={jobData.hoursPerWeek || ""}
                      onChange={handleJobChange}
                      className="px-4 py-2 focus:outline-3 outline-[var(--primary-color)] hover:shadow-md transition-all outline-offset-2 border-2 focus:border-[var(--primary-color)] rounded-xl"
                      placeholder="40"
                      min="1"
                      max="80"
                    />
                  </div>
                )}

                {jobData.jobType === "part-time" && (
                  <div className="flex flex-col mb-4">
                    <label htmlFor="shift" className="font-medium mb-2">Shift *</label>
                    <select
                      name="shift"
                      required
                      value={jobData.shift || ""}
                      onChange={handleJobChange}
                      className="py-2 px-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="">Select Shift</option>
                      <option value="morning">Morning</option>
                      <option value="evening">Evening</option>
                      <option value="night">Night</option>
                    </select>
                  </div>
                )}

                {jobData.jobType === "contract" && (
                  <div className="flex flex-col mb-4">
                    <label htmlFor="contractDuration" className="font-medium mb-2">Contract Duration *</label>
                    <input
                      type="text"
                      name="contractDuration"
                      required
                      value={jobData.contractDuration || ""}
                      onChange={handleJobChange}
                      className="px-4 py-2 focus:outline-3 outline-[var(--primary-color)] hover:shadow-md transition-all outline-offset-2 border-2 focus:border-[var(--primary-color)] rounded-xl"
                      placeholder="e.g., 6 months, 1 year"
                    />
                  </div>
                )}

                {jobData.jobType === "internship" && (
                  <div className="flex flex-col mb-4">
                    <label htmlFor="internshipDuration" className="font-medium mb-2">Internship Duration</label>
                    <input
                      type="text"
                      name="internshipDuration"
                      value={jobData.internshipDuration || ""}
                      onChange={handleJobChange}
                      className="px-4 py-2 focus:outline-3 outline-[var(--primary-color)] hover:shadow-md transition-all outline-offset-2 border-2 focus:border-[var(--primary-color)] rounded-xl"
                      placeholder="e.g., 3 months"
                    />
                  </div>
                )}

                {jobData.jobType === "temporary" && (
                  <div className="flex flex-col mb-4">
                    <label htmlFor="temporaryDuration" className="font-medium mb-2">Temporary Duration</label>
                    <input
                      type="text"
                      name="temporaryDuration"
                      value={jobData.temporaryDuration || ""}
                      onChange={handleJobChange}
                      className="px-4 py-2 focus:outline-3 outline-[var(--primary-color)] hover:shadow-md transition-all outline-offset-2 border-2 focus:border-[var(--primary-color)] rounded-xl"
                      placeholder="e.g., 2 weeks, 1 month"
                    />
                  </div>
                )}

                <button type="button" className="mt-6 px-4 py-2 bg-[var(--primary-color)] text-white rounded"
                  onClick={() => {
                    const requiredFields = ['locationType', 'jobType'];
                    const locationRequired = jobData.locationType === 'on-site' || jobData.locationType === 'hybrid';
                    if (locationRequired) requiredFields.push('location');

                    const missingFields = requiredFields.filter(field => !jobData[field]);
                    if (missingFields.length > 0) {
                      toast.error("Please fill all required fields");
                    } else {
                      nextStep();
                    }
                  }}>
                  Next
                </button>
              </motion.div>
            )}

            {/* Step 2: Job Type Specifics & Categories */}
            {jobSteps === 2 && (
              <motion.div key={jobSteps} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }}>
                <h2 className="font-semibold text-lg mb-4">Step 3: Job Type Specifics & Categories</h2>

                {/* Job Category */}
                <div className="flex flex-col mb-4">
                  <label className="font-medium mb-2">Job Category</label>
                  <select
                    name="category"
                    value={jobData.category || ""}
                    onChange={handleJobChange}
                    className="py-2 px-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">--- Select Category ---</option>
                    {categories.map((cat) => (
                      <option key={cat.name} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>


                {/* Sub Category */}
                {jobData.category && (
                  <div className="flex flex-col mb-4">
                    <hr className="my-8" />
                    <label className="font-medium mb-2">Sub Category</label>
                    <select
                      name="subCategory"
                      value={jobData.subCategory || ""}
                      onChange={handleJobChange}
                      className="py-2 px-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="">Select Sub Category</option>
                      {subCategories.map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>
                )}
                <button type="button" className="mt-6 px-4 py-2 bg-[var(--primary-color)] text-white rounded"
                  onClick={() => {
                    let isValid = true;
                    let errorMessage = "";

                    if (jobData.jobType === "full-time" && !jobData.hoursPerWeek) {
                      isValid = false;
                      errorMessage = "Hours per week is required for full-time jobs";
                    } else if (jobData.jobType === "part-time" && !jobData.shift) {
                      isValid = false;
                      errorMessage = "Shift is required for part-time jobs";
                    } else if (jobData.jobType === "contract" && !jobData.contractDuration) {
                      isValid = false;
                      errorMessage = "Contract duration is required for contract jobs";
                    }

                    if (!isValid) {
                      toast.error(errorMessage);
                    } else {
                      nextStep();
                    }
                  }}>
                  Next
                </button>
              </motion.div>
            )}

            {/* Step 3: Salary Range */}
            {jobSteps === 3 && (
              <motion.div
                key={jobSteps}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4 }}
              >
                <h2 className="font-semibold text-lg mb-4">Step 4: Salary</h2>

                {/* Salary Type */}
                <div className="flex flex-col mb-4">
                  <label htmlFor="salaryType mb-1" className="font-medium mb-2">Salary Type *</label>
                  <select
                    name="salaryType"
                    value={jobData.salaryType || ""}
                    onChange={handleJobChange}
                    className="py-2 px-3 border rounded-lg focus:ring-2 focus:ring-[var(--primary-color)]"
                  >
                    <option value="">--- Choose Salary Type ---</option>
                    <option value="fixed">Fixed</option>
                    <option value="range">Range</option>
                  </select>
                </div>

                {/* Salary Inputs */}
                {jobData?.salaryType === "range" &&
                  <>

                    <hr className="my-8" />
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="flex flex-col">
                        <label htmlFor="minSalary" className="font-medium mb-2">Min Salary (USD)</label>
                        <input
                          type="number"
                          name="minSalary"
                          value={jobData.minSalary || ""}
                          onChange={handleJobChange}
                          className="px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[var(--primary-color)] hover:shadow-md transition-all"
                          placeholder="50000"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="maxSalary" className="font-medium mb-2">Max Salary (USD)</label>
                        <input
                          type="number"
                          name="maxSalary"
                          value={jobData.maxSalary || ""}
                          onChange={handleJobChange}
                          className="px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[var(--primary-color)] hover:shadow-md transition-all"
                          placeholder="80000"
                        />
                      </div>
                    </div>
                  </>
                }

                {jobData?.salaryType === "fixed" &&
                  <div className="flex flex-col mt-4">
                    <hr className="my-8" />
                    <label htmlFor="fixedSalary" className="font-medium mb-2">Salary (USD)</label>
                    <input
                      type="number"
                      name="fixedSalary"
                      value={jobData.fixedSalary || ""}
                      onChange={handleJobChange}
                      className="px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[var(--primary-color)] hover:shadow-md transition-all"
                      placeholder="80000"
                    />
                  </div>
                }

                {/* Next Button with validation */}
                <button
                  type="button"
                  className="mt-6 px-4 py-2 bg-[var(--primary-color)] text-white rounded transition-all hover:opacity-90"
                  onClick={() => {
                    const { salaryType, minSalary, maxSalary, fixedSalary } = jobData;

                    // Check if salary type selected
                    if (!salaryType) {
                      toast.error("Please select a salary type");
                      return;
                    }

                    // If range type
                    if (salaryType === "range") {
                      if (!minSalary || !maxSalary) {
                        toast.error("Please fill both minimum and maximum salary");
                        return;
                      }
                      if (Number(maxSalary) <= Number(minSalary)) {
                        toast.error("Max salary must be greater than min salary");
                        return;
                      }
                    }

                    // If fixed type
                    if (salaryType === "fixed" && !fixedSalary) {
                      toast.error("Please enter a salary amount");
                      return;
                    }

                    nextStep();
                  }}
                >
                  Next
                </button>
              </motion.div>
            )}


            {/* Step 4: Job Description */}
            {jobSteps === 4 && (
              <motion.div key={jobSteps} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }}>
                <h2 className="font-semibold text-lg mb-4">Step 5: Job Description</h2>

                {/* Job Description */}
                <div className="mb-4">
                  <label className="font-medium mb-2 block">About the Job *</label>
                  <textarea
                    name="description"
                    className="px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[var(--primary-color)] hover:shadow-md transition-all w-full"
                    rows="5"
                    value={jobData?.description || ""}
                    onChange={handleJobChange}
                    placeholder="About the Job..."
                  />
                </div>

                <button type="button" className="mt-6 px-4 py-2 bg-[var(--primary-color)] text-white rounded"
                  onClick={() => {
                    if (!jobData.description) {
                      toast.error("Job description is required");
                    } else {
                      nextStep();
                    }
                  }}>
                  Next
                </button>
              </motion.div>
            )}

            {/* Step 5: Requirements & Experience */}
            {jobSteps === 5 && (
              <motion.div key={jobSteps} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }}>
                <h2 className="font-semibold text-lg mb-4">Step 6: Requirements & Experience</h2>

                {/* Qualifications */}
                <div className="flex flex-col mb-4">
                  <label htmlFor="qualifications" className="font-medium mb-2">Qualifications / Required Skills *</label>
                  <select
                    name="qualifications"
                    value={jobData.qualifications || ""}
                    onChange={handleJobChange}
                    className="py-2 px-3 mb-8 border rounded-lg focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">--- Select Qualification ---</option>
                    <option value="Entry">Entry</option>
                    <option value="Mid">Mid</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Senior">Senior</option>
                  </select>
                </div>

                {/* Experience */}
                <hr className="my-8" />
                <div className="flex flex-col mb-4">
                  <label htmlFor="experience" className="font-medium mb-2">Experience</label>
                  <select
                    name="experience"
                    value={jobData.experience || ""}
                    onChange={handleJobChange}
                    className="py-2 px-3 mb-8 border rounded-lg focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Select Experience</option>
                    <option value="6 Months - 1 Year">6 Months - 1 Year</option>
                    <option value="1 Year - 2 Years">1 Year - 2 Years</option>
                    <option value="2 Years - 3 Years">2 Years - 3 Years</option>
                    <option value="3 Years - 4 Years">3 Years - 4 Years</option>
                    <option value="4 Years - 5 Years">4 Years - 5 Years</option>
                    <option value="5 Years+">5 Years+</option>
                  </select>
                </div>

                <hr className="my-8" />
                <div className="flex flex-col mb-4">
                  <label htmlFor="skills" className="font-medium mb-2">Skills *</label>
                  <input
                    type="text"
                    name="skills"
                    required
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    onKeyUp={(e) => {
                      if (e.key === "Enter" && currentSkill.trim() !== "") {
                        e.preventDefault();
                        setJobData((prev) => ({
                          ...prev,
                          skills: [...(prev.skills || []), currentSkill.trim()],
                        }));
                        setCurrentSkill(""); // ✅ clears input after adding
                      }
                    }}
                    className="px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[var(--primary-color)] hover:shadow-md transition-all outline-none"
                    placeholder="Press Tab skills (comma separated), e.g., JavaScript, React, Node.js"
                  />
                </div>
                <div className="flex min-h-[20vh] rounded-2xl mb-4 flex-wrap border border-gray-300 gap-2 mt-3 p-3">
                  {jobData?.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-[var(--primary-color)] bg-[var(--primary-color)]/10 border border-[var(--primary-color)] rounded-lg hover:bg-[var(--primary-color)] hover:text-white transition-all cursor-pointer group h-6"
                    >
                      {skill}
                      <span
                        type="button"
                        onClick={() =>
                          setJobData((prev) => ({
                            ...prev,
                            skills: prev.skills.filter((_, i) => i !== index),
                          }))
                        }
                        className="text-[var(--primary-color)] group-hover:text-white focus:outline-none"
                      >
                        ✕
                      </span>
                    </span>
                  ))}
                </div>

                {/* Skills */}
                <button type="button" className="mt-6 px-4 py-2 bg-[var(--primary-color)] text-white rounded"
                  onClick={() => {
                    const { qualifications, experience, skills } = jobData;

                    if (
                      !qualifications?.trim() ||
                      !experience?.trim() ||
                      !skills ||
                      skills.length === 0
                    ) {
                      toast.error("Please fill all required fields");
                      return;
                    }

                    nextStep();
                  }}
                >
                  Next
                </button>
              </motion.div>
            )}

            {/* Step 6: Additional Details */}
            {jobSteps === 6 && (
              <motion.div key={jobSteps} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }}>
                <h2 className="font-semibold text-lg mb-4">Step 7: Additional Details</h2>

                {/* Responsibilities */}
                <div className="flex flex-col mb-4">
                  <label htmlFor="responsibilities" className="font-medium mb-2">Responsibilities (Optional but recommended)</label>
                  <input
                    type="text"
                    name="responsibilities"
                    required
                    value={currentRes}
                    onChange={(e) => setCurrentRes(e.target.value)}
                    onKeyUp={(e) => {
                      if (e.key === "Enter" && currentRes.trim() !== "") {
                        e.preventDefault();
                        setJobData((prev) => ({
                          ...prev,
                          responsibilities: [...(prev.responsibilities || []), currentRes.trim()],
                        }));
                        setCurrentRes("");
                      }
                    }}
                    className="px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[var(--primary-color)] hover:shadow-md transition-all outline-none"
                    placeholder="Press Enter skills (comma separated), e.g., JavaScript, React, Node.js"
                  />

                  <div className="p-4 border border-gray-300 rounded-md mt-4">
                    <ul className="list-disc list-inside">
                      {jobData?.responsibilities?.map((res, index) => (
                        <li key={index}>
                          {res}
                          <span
                            type="button"
                            onClick={() =>
                              setJobData((prev) => ({
                                ...prev,
                                responsibilities: prev.responsibilities.filter((_, i) => i !== index),
                              }))
                            }
                            className="ml-3 border border-gray-300 px-2 rounded-lg text-[var(--primary-color)] group-hover:text-white focus:outline-none"
                          >
                            ✕
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <hr className="my-8" />

                {/* Education */}
                <div className="flex flex-col mb-4">
                  <label htmlFor="education" className="font-medium mb-2">Education (Optional)</label>
                  <input
                    type="text"
                    name="education"
                    value={jobData.education || ""}
                    onChange={handleJobChange}
                    className="px-4 py-2 focus:outline-3 outline-[var(--primary-color)] hover:shadow-md transition-all outline-offset-2 border-2 focus:border-[var(--primary-color)] rounded-xl"
                    placeholder="e.g., Bachelor's Degree, High School Diploma"
                  />
                </div>

                <hr className="my-8" />

                {/* Perks & Benefits */}
                <div className="flex flex-col mb-4">
                  <label htmlFor="benefits" className="font-medium mb-2">Benefits (Optional)</label>
                  <input
                    type="text"
                    name="benefits"
                    required
                    value={currentBenefit}
                    onChange={(e) => setCurrentBenefit(e.target.value)}
                    onKeyUp={(e) => {
                      if (e.key === "Enter" && currentBenefit.trim() !== "") {
                        e.preventDefault();
                        setJobData((prev) => ({
                          ...prev,
                          benefits: [...(prev.benefits || []), currentBenefit.trim()],
                        }));
                        setCurrentBenefit("");
                      }
                    }}
                    className="px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[var(--primary-color)] hover:shadow-md transition-all outline-none"
                    placeholder="e.g, Paid Vacaotions, Health Insurance"
                  />
                  <div className="p-4 border border-gray-300 rounded-md mt-4">
                    <ul className="list-disc list-inside">
                      {jobData?.benefits?.map((ben, index) => (
                        <li key={index}>
                          {ben}
                          <span
                            type="button"
                            onClick={() =>
                              setJobData((prev) => ({
                                ...prev,
                                benefits: prev.benefits.filter((_, i) => i !== index),
                              }))
                            }
                            className="ml-3 border border-gray-300 px-2 rounded-lg text-[var(--primary-color)] group-hover:text-white focus:outline-none"
                          >
                            ✕
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button type="button" className="mt-6 px-4 py-2 bg-[var(--primary-color)] text-white rounded"
                  onClick={nextStep}>
                  Next
                </button>
              </motion.div>
            )}

            {/* Step 7: Application Settings */}
            {jobSteps === 7 && (
              <motion.div key={jobSteps} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }}>
                <h2 className="font-semibold text-lg mb-4">Step 8: Application Settings</h2>

                {/* Application Deadline */}
                <div className="flex flex-col mb-4">
                  <label htmlFor="applicationDeadline" className="font-medium mb-2">Application Deadline (in days) *</label>
                  <input
                    type="number"
                    name="applicationDeadline"
                    required
                    value={jobData.applicationDeadline || ""}
                    onChange={handleJobChange}
                    className="px-4 py-2 focus:outline-3 outline-[var(--primary-color)] hover:shadow-md transition-all outline-offset-2 border-2 focus:border-[var(--primary-color)] rounded-xl"
                    placeholder="30"
                    min="1"
                    max="365"
                  />
                </div>

                <hr className="my-8" />

                {/* Application Method */}
                <div className="flex flex-col mb-4">
                  <label className="font-medium mb-2">Application Method *</label>
                  <select
                    name="applicationMethod"
                    required
                    value={jobData.applicationMethod || "easy"}
                    onChange={handleJobChange}
                    className="py-2 px-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="easy">Easy Apply</option>
                    <option value="external">External link</option>
                  </select>
                </div>


                {/* Apply Link (conditional) */}
                {jobData.applicationMethod === "external" && (
                  <div className="flex flex-col mb-4">
                    <hr className="my-8" />
                    <label htmlFor="applyLink" className="font-medium">Apply Link *</label>
                    <input
                      type="url"
                      name="applyLink"
                      required
                      value={jobData.applyLink || ""}
                      onChange={handleJobChange}
                      className="px-4 py-2 focus:outline-3 outline-[var(--primary-color)] hover:shadow-md transition-all outline-offset-2 border-2 focus:border-[var(--primary-color)] rounded-xl"
                      placeholder="https://company.com/apply"
                    />
                  </div>
                )}

                <hr className="my-8" />

                {/* Resume Requirement */}
                <div className="flex flex-col mb-4">
                  <label className="font-medium mb-2">Resume Requirement</label>
                  <select
                    name="resumeRequirement"
                    value={jobData.resumeRequirement || "false"}
                    onChange={handleJobChange}
                    className="py-2 px-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>

                <button type="button" className="mt-6 px-4 py-2 bg-[var(--primary-color)] text-white rounded"
                  onClick={() => {
                    const requiredFields = ['applicationDeadline'];
                    if (jobData.applicationMethod === 'external') requiredFields.push('applyLink');

                    const missingFields = requiredFields.filter(field => !jobData[field]);
                    if (missingFields.length > 0) {
                      toast.error("Please fill all required fields");
                    } else {
                      nextStep();
                    }
                  }}>
                  Next
                </button>
              </motion.div>
            )}

            {/* Step 9: Payment / Featured Job Fields */}
            {jobSteps === 8 && (
              <motion.div key={jobSteps} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }}>
                <h2 className="font-semibold text-lg mb-4"> Optional Payment / Featured Job Fields</h2>

                {/* Sponsored */}
                <div className="flex flex-col mb-4">
                  <label htmlFor="sponsored" className="font-medium mb-2">Sponsored</label>
                  <select
                    name="sponsored"
                    value={jobData.sponsored || "false"}
                    onChange={handleJobChange}
                    className="py-2 px-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="false">Not Sponsored</option>
                    <option value="true">Sponsored</option>
                  </select>
                </div>

                <div className="text-sm text-gray-600 text-center mb-4">
                  Non Sponsored Jobs will be Listed as Simple Jobs
                </div>

                {jobData.sponsored === "true" && (
                  <div className="flex flex-col gap-4 p-4 border rounded-lg bg-gray-50">
                    <h3 className="font-medium">Payment Details</h3>
                    {/* Cardholder Name */}
                    <div>
                      <label htmlFor="cardName" className="block font-medium mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        value={jobData.cardName || ""}
                        onChange={handleJobChange}
                        placeholder="John Doe"
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                      />
                    </div>

                    {/* Card Number */}
                    <div>
                      <label htmlFor="cardNumber" className="block font-medium mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={jobData.cardNumber || ""}
                        onChange={handleJobChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength="16"
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                      />
                    </div>

                    {/* Expiry & CVV */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="expiryDate" className="block font-medium mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="month"
                          name="expiryDate"
                          value={jobData.expiryDate || ""}
                          onChange={handleJobChange}
                          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                      <div>
                        <label htmlFor="cvv" className="block font-medium mb-1">
                          CVV
                        </label>
                        <input
                          type="password"
                          name="cvv"
                          value={jobData.cvv || ""}
                          onChange={handleJobChange}
                          placeholder="123"
                          maxLength="4"
                          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                    </div>

                    {/* Amount */}
                    <div>
                      <label htmlFor="amount" className="block font-medium mb-1">
                        Amount (USD)
                      </label>
                      <input
                        type="number"
                        name="amount"
                        value="10"
                        readOnly
                        className="w-full border rounded-lg px-3 py-2 bg-gray-100"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full mt-6 bg-[var(--primary-color)] hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold transition"
                >
                  {jobData.sponsored === "true" ? "Pay & Publish Job" : "Publish Job"}
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </form>
      </section>
      <section className="p-2 hidden relative lg:block">
        <div className="sticky top-2">
          <h1>Preview</h1>
          <JobCard e={jobData} />
        </div>
      </section>
    </main>
  );
};

export default JobForm;