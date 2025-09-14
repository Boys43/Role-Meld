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

const SavedJobs = () => {
  const { backendUrl, userData, toggleSaveJob } = useContext(AppContext);
  const [allsavedJobs, setAllsavedJobs] = useState([]);
  const navigte = useNavigate();
  console.log(userData.savedJobs);

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

  function viewDetails(id) {
    navigte(`/jobdetails/${id}`)
  }

  return (
    <div className='p-4 flex flex-col gap-4 max-w-[1500px] w-full mx-auto'>
      <h1 className='font-bold text-[var(--primary-color)] flex items-center gap-4'><FaBookmark size={30} />Saved Jobs</h1>
      <div className='flex flex-col gap-4'>
        {allsavedJobs.length > 0 ? allsavedJobs.map((e, i) => (
          <div key={i} className='py-2 px-4 grid grid-cols-2 items-center border rounded-xl bg-[var(--primary-color)]/10'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <h3 className='flex items-center gap-4 font-medium'><PiSubtitlesFill className='text-[var(--primary-color)]' size={20} /> {e?.title}</h3>
              <p className='flex items-center gap-4 italic'><FaBriefcase className='text-[var(--primary-color)]' size={10} /> {e?.company}</p>
              <p className='flex items-center gap-4 italic text-red-400'><IoIosWarning className='text-red-500' size={15} />{e?.applicationDeadline ? new Date(e?.applicationDeadline).toISOString().split("T")[0] : "No deadline"}</p>
            </div>
            <div className='flex items-center justify-evenly gap-4'>
              <button onClick={() => viewDetails(e?._id)}>
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
          <div className='w-full py-20 gap-4 flex flex-col items-center'>
            <IoBookmarkOutline size={50} className='text-[var(--primary-color)]' />
            <h3 className='font-bold '>No Saved Jobs</h3>
          </div>
        }

      </div>
    </div>
  )
}

export default SavedJobs
