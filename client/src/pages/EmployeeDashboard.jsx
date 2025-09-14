import React, { useContext, useRef, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { FaCamera } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { LuGitPullRequest } from "react-icons/lu";
import { IoPersonAddSharp } from "react-icons/io5";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { MdCancel } from "react-icons/md";
import JoditEditor from 'jodit-react';

const EmployeeDashboard = () => {
  const { userData, backendUrl, setUserData } = useContext(AppContext);
  const [profilePicture, setProfilePicture] = useState(null);
  const [showSubmit, setShowSubmit] = useState(false);
  const [updatePopUpState, setUpdatePopUpState] = useState('hidden');
  const [formData, setFormData] = useState({});
  const [jobData, setJobData] = useState({});
  const editor = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const changePicture = async () => {
    const formData = new FormData();
    formData.append("profilePicture", profilePicture);

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/updateprofilepicture`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        setUserData(data.user);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };
  console.log(userData.company);

  const handleJobChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value, companyProfile: userData.profilePicture, company: userData.company });
  };  

  const postJob = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/jobs/addjob`, { jobData });
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

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/updateprofile`, { updateUser: formData });
      if (data.success) {
        setUserData(data.profile);
        setUpdatePopUpState("hidden")
        setFormData({}); // reset formData so updated userData reflects in UI
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className='min-h-screen flex flex-col p-10'>
      {/* Profile Section */}
      <div className='flex items-center px-10 gap-4 w-full h-full'>
        <div className="relative w-20 h-20">
          {/* Profile Circle */}
          <div className="w-20 h-20 border-2 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 text-xl font-semibold">
            {userData?.profilePicture ? (
              <img
                src={`${backendUrl}/uploads/${userData?.profilePicture}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              userData?.name?.[0] || "?"
            )}
          </div>

          {/* Upload Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              changePicture();
              setShowSubmit(false);
            }}
            className="mt-2"
          >
            <input
              type="file"
              id="profilePicture"
              name="profilePicture"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                setProfilePicture(e.target.files[0]);
                setShowSubmit(true);
              }}
            />
            <label
              htmlFor="profilePicture"
              className="absolute bottom-0 right-0 bg-white rounded-full p-1 cursor-pointer shadow"
            >
              <FaCamera className="text-gray-600 text-sm" />
            </label>
            {showSubmit && (
              <button type="submit" className="text-sm bg-[var(--primary-color)] text-white rounded px-2 py-1 mt-1">
                Upload
              </button>
            )}
          </form>
        </div>

        {/* User Info */}
        <div className='w-1/2'>
          <h1 className='text-2xl font-bold text-[var(--primary-color)]'>
            {userData?.company === "Individual" ? userData?.name : userData?.company}
          </h1>
        </div>
        <span>
          <HiOutlinePencilSquare
            onClick={() => setUpdatePopUpState('block')}
            className='text-[var(--primary-color)] cursor-pointer'
          />
        </span>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-3 gap-6 mt-5 w-full'>
        <div className='hover:translate-y-[-5px] hover:shadow-xl transition-all shadow-lg rounded-2xl border-2 border-[var(--primary-color)] p-4 cursor-pointer flex flex-col items-center justify-center'>
          <h3 className='flex items-center gap-4 font-semibold'><LuGitPullRequest />Total Applications</h3>
          <h1>0</h1>
        </div>
        <div className='hover:translate-y-[-5px] hover:shadow-xl transition-all shadow-lg rounded-2xl border-2 border-[var(--primary-color)] p-4 cursor-pointer flex flex-col items-center justify-center'>
          <h3 className='flex items-center gap-4 font-semibold'><IoPersonAddSharp />Total Active Jobs</h3>
          <h1>0</h1>
        </div>
      </div>

      {/* Job Posting Form */}
      <div className='mt-10 border p-4 rounded-lg flex flex-col justify-center cursor-pointer'>
        <h1 className='text-[var(--primary-color)] font-semibold'>List New Jobs</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            postJob();
          }}
          className='flex flex-col gap-2 mt-4'
        >
          <label htmlFor="title" className="font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={jobData.title || ""}
            onChange={handleJobChange}
            className="p-2 border-2 focus:border-[var(--primary-color)] rounded"
            placeholder='Title'
          />

          <label htmlFor="description" className="font-medium">Description</label>
          <JoditEditor
            ref={editor}
            value={jobData.description || ""}
            onChange={(content) => setJobData(prev => ({ ...prev, description: content }))}
          />

          <h3 className='font-medium'>Details</h3>
          <div className='flex flex-wrap gap-4'>
            {/* Location Type */}
            <div className="flex flex-col">
              <label htmlFor="locationType" className="text-sm font-semibold mb-1">Location Type</label>
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
              <label htmlFor="category" className="text-sm font-semibold mb-1">Job Category</label>
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
              <label htmlFor="jobType" className="text-sm font-semibold mb-1">Job Type</label>
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
            value={jobData.experience || ''}
            onChange={handleJobChange}
            className="p-2 border-2 focus:border-[var(--primary-color)] rounded"
            placeholder='Experience (e.g., 2 Years)'
          />

          {/* Application Deadline */}
          <label htmlFor="applicationDeadline">Application Deadline (in days)</label>
          <input
            type="number"
            name="applicationDeadline"
            value={jobData.applicationDeadline || ''}
            onChange={handleJobChange}
            className="p-2 border-2 focus:border-[var(--primary-color)] rounded"
            placeholder='30'
          />

          {/* City */}
          <label htmlFor="location">City</label>
          <input
            type="text"
            name="location"
            value={jobData.location || ''}
            onChange={handleJobChange}
            className="p-2 border-2 focus:border-[var(--primary-color)] rounded"
            placeholder='Enter City'
          />

          {/* Salary */}
          <label htmlFor="salary">Salary ($)</label>
          <input
            type="number"
            name="salary"
            value={jobData.salary || ''}
            onChange={handleJobChange}
            className="p-2 border-2 focus:border-[var(--primary-color)] rounded"
            placeholder='In Dollars $'
          />

          {/* Skills */}
          <label htmlFor="skills" className="font-medium mt-2">Skills</label>
          <input
            type="text"
            name="skills"
            value={jobData.skills || ''}
            onChange={handleJobChange}
            className="p-2 border-2 focus:border-[var(--primary-color)] rounded"
            placeholder="Enter Skills (comma separated)"
          />

          <button type='submit' className="bg-[var(--primary-color)] text-white px-4 py-2 rounded mt-2">
            Save
          </button>
        </form>
      </div>

      {/* Update Profile Modal */}
      <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-screen flex items-center justify-center backdrop-blur-sm ${updatePopUpState}`}>
        <div className="w-[70%] h-[70%] border relative bg-white shadow-2xl rounded-2xl overflow-y-auto p-4">
          <MdCancel onClick={() => setUpdatePopUpState('hidden')} size={20} className="absolute right-5 top-5 cursor-pointer" />
          <h1 className="text-[var(--primary-color)] font-semibold">Update Your Profile</h1>

          <form onSubmit={updateProfile} className="flex flex-col gap-2 mt-3">
            <label htmlFor="name" className="font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={userData?.name ?? ""}
              onChange={handleChange}
              className="p-2 border-2 focus:border-[var(--primary-color)] rounded"
              placeholder="Enter Name"
            />

            <label htmlFor="company" className="font-medium mt-2">Company Name</label>
            <input
              type="text"
              name="company"
              value={formData?.company ?? userData?.company ?? ""}
              onChange={handleChange}
              className="p-2 border-2 focus:border-[var(--primary-color)] rounded"
              placeholder="Enter Company Name"
            />

            <label htmlFor="members" className="font-medium mt-2">Members</label>
            <input
              type="text"
              name="members"
              value={formData?.members ?? userData?.members ?? ""}
              onChange={handleChange}
              className="p-2 border-2 focus:border-[var(--primary-color)] rounded"
              placeholder="Enter Members"
            />

            <button type="submit" className="bg-[var(--primary-color)] text-white px-4 py-2 rounded mt-2">Save</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EmployeeDashboard