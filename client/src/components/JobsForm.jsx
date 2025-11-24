import React, { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import CustomSelect from "./CustomSelect";
import SearchSelect from "./SelectSearch";
import JobCard from "./JobCard";
import JoditEditor from 'jodit-react';

const JobForm = ({ setActiveTab }) => {
  const { backendUrl, userData } = useContext(AppContext);

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const editor = useRef(null);

  // Form State
  const [jobData, setJobData] = useState({
    title: "",
    category: "",
    subCategory: "",
    jobType: "",
    skills: [],
    description: "",
    careerLevel: "",
    experience: "",
    qualifications: "",
    quantity: 1,
    gender: "Any",
    closingDays: 30,
    salaryType: "fixed",
    minSalary: "",
    maxSalary: "",
    fixedSalary: "",
    currency: "USD",
    salaryRate: "Monthly",
    jobApplyType: "Email",
    externalUrl: "",
    userEmail: "",
    location: "",
    coverImage: "",
    gallery: [],
    video: "",
    responsibilities: [],
    benefits: [],
    companyProfile: userData?.profilePicture,
  });

  const [currentSkill, setCurrentSkill] = useState("");

  const getCategories = async () => {
    setCategoriesLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/categories`);
      if (data.success) {
        setCategories(data.categories);
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

  const handleJobChange = (e) => {
    const { name, value } = e.target;

    if (name === "category") {
      const selectedCategory = categories.find((cat) => cat.name === value);
      setSubCategories(selectedCategory?.subcategories || []);
      setJobData((prev) => ({
        ...prev,
        category: value,
        subCategory: "",
      }));
    } else {
      setJobData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const addSkill = (e) => {
    if (e.key === "Enter" && currentSkill.trim() !== "") {
      e.preventDefault();
      setJobData((prev) => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()],
      }));
      setCurrentSkill("");
    }
  };

  const removeSkill = (index) => {
    setJobData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const postJob = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (!jobData.title || !jobData.category || !jobData.jobType || !jobData.description || !jobData.location) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const payload = {
        ...jobData,
        companyProfile: userData.profilePicture,
        company: userData.company,
      };

      const { data } = await axios.post(`${backendUrl}/api/jobs/addjob`, {
        jobData: payload,
        userId: userData._id,
      });

      if (data.success) {
        toast.success(data.message);
        setJobData({
          title: "",
          category: "",
          subCategory: "",
          jobType: "",
          skills: [],
          description: "",
          careerLevel: "",
          experience: "",
          qualifications: "",
          quantity: 1,
          gender: "Any",
          closingDays: 30,
          salaryType: "fixed",
          minSalary: "",
          maxSalary: "",
          fixedSalary: "",
          currency: "USD",
          salaryRate: "Monthly",
          jobApplyType: "Email",
          externalUrl: "",
          userEmail: "",
          location: "",
          coverImage: "",
          gallery: [],
          video: "",
          responsibilities: [],
          benefits: []
        });
        setActiveTab("listed-jobs");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const currencyOptions = [
    { code: "USD", name: "United States Dollar" },
    { code: "AED", name: "United Arab Emirates Dirham" },
    { code: "PKR", name: "Pakistani Rupee" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "British Pound" },
    { code: "INR", name: "Indian Rupee" },
  ];

  return (
    <main className="w-full p-6 bg-white rounded-lg shadow-sm overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Create a job post</h1>
        <div className="flex gap-3">
          <button type="button" onClick={() => setActiveTab("listed-jobs")} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
          <button type="button" className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Save as draft</button>
          <button type="button" onClick={postJob} className="px-6 py-2 bg-[var(--primary-color)] text-white rounded-md hover:opacity-90">Post Job</button>
        </div>
      </div>

      <div className="flex gap-6">
        <form className="flex flex-col gap-8 flex-1" onSubmit={postJob}>
          {/* Basic Info */}
          <section>
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Basic Info</h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                <input
                  type="text"
                  name="title"
                  value={jobData.title}
                  onChange={handleJobChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent outline-none"
                  placeholder="e.g. Senior Software Engineer"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Category *</label>
                  <CustomSelect
                    name="category"
                    value={jobData.category}
                    onChange={handleJobChange}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.name} value={cat.name}>{cat.name}</option>
                    ))}
                  </CustomSelect>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Type *</label>
                  <CustomSelect
                    name="jobType"
                    value={jobData.jobType}
                    onChange={handleJobChange}
                  >
                    <option value="">Select Job Type</option>
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="temporary">Temporary</option>
                  </CustomSelect>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skills *</label>
                <div className="flex flex-wrap gap-2 mb-2 p-2 border border-gray-300 rounded-lg min-h-[42px]">
                  {jobData.skills.map((skill, index) => (
                    <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-sm flex items-center gap-1">
                      {skill}
                      <button type="button" onClick={() => removeSkill(index)} className="text-gray-500 hover:text-red-500">×</button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    onKeyDown={addSkill}
                    className="flex-1 outline-none bg-transparent min-w-[120px]"
                    placeholder="Type skill and press Enter"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <JoditEditor
                  ref={editor}
                  value={jobData.description}
                  config={{
                    readonly: false,
                    height: 300,
                    uploader: { insertImageAsBase64URI: true },
                    toolbarSticky: false,
                  }}
                  onBlur={(newContent) => setJobData(prev => ({ ...prev, description: newContent }))}
                />
              </div>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Details Section */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Career Level</label>
                <CustomSelect name="careerLevel" value={jobData.careerLevel} onChange={handleJobChange}>
                  <option value="">Select Career Level</option>
                  <option value="Entry">Entry Level</option>
                  <option value="Mid">Mid Level</option>
                  <option value="Senior">Senior Level</option>
                  <option value="Executive">Executive</option>
                </CustomSelect>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                <CustomSelect name="experience" value={jobData.experience} onChange={handleJobChange}>
                  <option value="">Select Experience</option>
                  <option value="Fresh">Fresh</option>
                  <option value="1 Year">1 Year</option>
                  <option value="2 Years">2 Years</option>
                  <option value="3 Years">3 Years</option>
                  <option value="4 Years">4 Years</option>
                  <option value="5 Years+">5 Years+</option>
                </CustomSelect>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                <CustomSelect name="qualifications" value={jobData.qualifications} onChange={handleJobChange}>
                  <option value="">Select Qualification</option>
                  <option value="High School">High School</option>
                  <option value="Bachelor">Bachelor</option>
                  <option value="Master">Master</option>
                  <option value="PhD">PhD</option>
                </CustomSelect>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input type="number" name="quantity" value={jobData.quantity} onChange={handleJobChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" min="1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <CustomSelect name="gender" value={jobData.gender} onChange={handleJobChange}>
                  <option value="Any">Any</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </CustomSelect>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Closing Days</label>
                <input type="number" name="closingDays" value={jobData.closingDays} onChange={handleJobChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" min="1" />
              </div>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Salary Section */}
          <section>
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Salary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salary Type</label>
                <CustomSelect name="salaryType" value={jobData.salaryType} onChange={handleJobChange}>
                  <option value="fixed">Fixed</option>
                  <option value="range">Range</option>
                </CustomSelect>
              </div>
              <div>
                <SearchSelect options={currencyOptions} value={jobData.currency} onChange={handleJobChange} label="Currency" placeholder="Select Currency" />
              </div>

              {jobData.salaryType === 'range' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Salary</label>
                    <input type="number" name="minSalary" value={jobData.minSalary} onChange={handleJobChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" placeholder="Min" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Salary</label>
                    <input type="number" name="maxSalary" value={jobData.maxSalary} onChange={handleJobChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" placeholder="Max" />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fixed Salary</label>
                  <input type="number" name="fixedSalary" value={jobData.fixedSalary} onChange={handleJobChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" placeholder="Amount" />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rate</label>
                <CustomSelect name="salaryRate" value={jobData.salaryRate} onChange={handleJobChange}>
                  <option value="Hourly">Per Hour</option>
                  <option value="Monthly">Per Month</option>
                  <option value="Yearly">Per Year</option>
                </CustomSelect>
              </div>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Job Apply Type */}
          <section>
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Job Apply Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apply Method</label>
                <CustomSelect name="jobApplyType" value={jobData.jobApplyType} onChange={handleJobChange}>
                  <option value="Email">By Email</option>
                  <option value="External">External Link</option>
                </CustomSelect>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {jobData.jobApplyType === 'Email' ? 'Email Address' : 'External URL'}
                </label>
                <input
                  type={jobData.jobApplyType === 'Email' ? 'email' : 'url'}
                  name={jobData.jobApplyType === 'Email' ? 'userEmail' : 'externalUrl'}
                  value={jobData.jobApplyType === 'Email' ? jobData.userEmail : jobData.externalUrl}
                  onChange={handleJobChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
                  placeholder={jobData.jobApplyType === 'Email' ? 'Enter email address' : 'https://example.com/apply'}
                />
              </div>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Location (Simple) */}
          <section>
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Location</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location Address</label>
              <input
                type="text"
                name="location"
                value={jobData.location}
                onChange={handleJobChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
                placeholder="e.g. New York, NY, USA"
                required
              />
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Media */}
          <section>
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Media</h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
                <input
                  type="file"
                  name="coverImage"
                  onChange={(e) => setJobData(prev => ({ ...prev, coverImage: e.target.files[0] }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
                  accept="image/*"
                />
              </div>
            </div>
          </section>

          <div className="flex justify-end gap-4 mt-4">
            <button type="button" onClick={() => setActiveTab("listed-jobs")} className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-8 py-2 bg-[var(--primary-color)] text-white rounded-md hover:opacity-90 font-medium">Post Job</button>
          </div>
        </form>
        <div className="w-full max-w-md">
          <JobCard e={jobData} />
        </div>
      </div>
    </main>
  );
};

export default JobForm;