import React from 'react'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { FaCamera } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { LuGitPullRequest } from "react-icons/lu";
import { IoPersonAddSharp } from "react-icons/io5";
import { useState } from 'react';

const EmployeeDashboard = () => {
  const { userData, backendUrl, setUserData } = useContext(AppContext);
  const [profilePicture, setProfilePicture] = React.useState(null);
  const [showSubmit, setShowSubmit] = React.useState(false);


  const [formData, setFormData] = useState({})
  const changePicture = async (e) => {
    const formData = new FormData();
    console.log(profilePicture);

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

  const [jobData, setJobData] = React.useState({});

  const handleJobChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  }

  const postJob = async (e) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/jobs/addjob`, { jobData: jobData })
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }

  }

  return (
    <>
      <div className='min-h-screen flex flex-col p-10'>
        <div className='flex items-center px-10 gap-4 w-full h-full border'>
          <div className="relative w-20 h-20 border">
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
                changePicture(e);
                setShowSubmit(false); // hide button again after upload
              }}
              className="mt-2"
            >
              {/* Hidden File Input */}
              <input
                type="file"
                id="profilePicture"
                name="profilePicture"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  setProfilePicture(e.target.files[0]);
                  setShowSubmit(true); // show button after file chosen
                }}
              />

              {/* Camera Icon as Label */}
              <label
                htmlFor="profilePicture"
                className="absolute bottom-0 right-0 bg-white rounded-full p-1 cursor-pointer shadow"
              >
                <FaCamera className="text-gray-600 text-sm" />
              </label>

              {/* Show Submit Button only after file chosen */}
              {showSubmit && (
                <button
                  type="submit"
                >
                  Upload
                </button>
              )}
            </form>
          </div>
          <div>
            <h1 className='text-2xl font-bold text-[var(--primary-color)]'>{userData?.name}</h1>
            <p className='text-gray-600 italic'>{userData?.headline || 'No headline Set'}</p>
          </div>
        </div>
        <div className='grid grid-cols-3 gap-6 mt-5 w-full'>
          <div className='hover:translate-y-[-5px] hover:shadow-xl transition-all shadow-lg rounded-2xl border p-4 cursor-pointer flex flex-col items-center justify-center' >
            <h2 className='text-[var(--primary-color)] flex items-center gap-4   font-semibold '><LuGitPullRequest />Total Applications</h2>
            <h1>0</h1>
          </div>
          <div className='hover:translate-y-[-5px] hover:shadow-xl transition-all shadow-lg rounded-2xl border p-4 cursor-pointer flex flex-col items-center justify-center' >
            <h2 className='text-[var(--primary-color)] flex items-center gap-4   font-semibold '><IoPersonAddSharp />Total Active Jobs</h2>
            <h1>0</h1>
          </div>
        </div>
        <div className='mt-10 border p-4 rounded-lg flex flex-col justify-center cursor-pointer '>
          <h1 className='text-[var(--primary-color)] font-semibold'>List New Jobs</h1>
          <form onSubmit={postJob} className='flex flex-col gap-2 mt-4'>
            <label htmlFor="title" className="font-medium">Title</label>
            <input type="text"
              name="title"
              value={jobData?.title || jobData?.title} onChange={handleJobChange} className="p-2 border-2 focus:border-[var(--primary-color)] focus:outline-0 transition-all focus:shadow-lg shadow-sm rounded" placeholder='Title' />

            <label htmlFor="description" className="font-medium">Description</label>
            <textarea
              name="description"
              value={jobData?.description || jobData?.description} onChange={handleJobChange} className="p-2 border-2 min-h-[250px] focus:border-[var(--primary-color)] focus:outline-0 transition-all focus:shadow-lg shadow-sm rounded" placeholder='Description' />

            <h2>Job Types</h2>

            <label htmlFor="locationType" className="font-medium">Location Type</label>
            <select name="locationType" id="locationType" className='py-1 px-2 border'>
              <option value="remote">Remote</option>
              <option value="on-site">On-site</option>
              <option value="hybrid">Hybrid</option>
            </select>
          
          </form>
        </div>

      </div>
    </>
  )
}

export default EmployeeDashboard