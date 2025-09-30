import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios';
import { toast } from 'react-toastify';
import { PiSubtitlesFill } from "react-icons/pi";
import { FaBriefcase } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";
import { FaTrashAlt } from "react-icons/fa";
import { IoBookmarkOutline } from "react-icons/io5";
import { FaBookmark } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import NotFound404 from './NotFound404';

const SavedJobs = () => {
  const { backendUrl, userData, toggleSaveJob } = useContext(AppContext);
  const [allsavedJobs, setAllsavedJobs] = useState([]);
  const navigte = useNavigate();

  const savedJobsIds = userData.savedJobs;

  const getSavedJobs = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/jobs/getsavedjobs`, { savedJobsIds })

      if (data.success) {
        setAllsavedJobs(data.getSavedJobs);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    getSavedJobs();
  }, [])
  return (
    <>
      <div className='p-6 flex flex-col w-full min-h-[calc(100vh-4.6rem)] overflow-y-auto'>
        <h1 className='font-bold flex items-center gap-4'><FaBookmark className='text-[var(--primary-color)] ' size={30} />Saved Jobs</h1>
        <div className='flex flex-col gap-4'>
          {allsavedJobs.length > 0 ? allsavedJobs.map((e, i) => (
            <div key={i} className='py-2 px-4 grid grid-cols-2 items-center border rounded-xl bg-[var(--primary-color)]/10'>
              <div className='grid grid-cols-4 items-center gap-4'>
                <h3 className='flex items-center gap-4 font-medium'><PiSubtitlesFill className='text-[var(--primary-color)]' size={20} /> {e?.title}</h3>
                <p className='flex items-center gap-4 italic'><FaBriefcase className='text-[var(--primary-color)]' size={10} /> {e?.company}</p>
                <p className='flex items-center gap-4 italic text-red-400'><IoIosWarning className='text-red-500' size={15} />{e?.applicationDeadline ? new Date(e?.applicationDeadline).toISOString().split("T")[0] : "No deadline"}</p>
              </div>
              <div className='flex items-center justify-evenly gap-4'>
                <button onClick={() => navigte(`/jobdetails/${e?.id}`)}>
                  View Details
                </button>
                <span
                  onClick={() => {
                    toggleSaveJob(e?._id);
                    setAllsavedJobs((prev) => prev.filter((job) => job._id !== e._id));
                  }}
                  className='p-3 bg-red-300 border border-red-500 rounded-full'>
                  <FaTrashAlt className='text-red-500 cursor-pointer' />
                </span>
              </div>
            </div>
          )) :
            <NotFound404 value={"No Saved Job"} margin={"mt-20"} />
          }
        </div>
      </div>
    </>
  )
}

export default SavedJobs
