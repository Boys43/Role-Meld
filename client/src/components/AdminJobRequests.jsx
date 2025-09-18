import React from 'react'
import { useContext } from 'react';
import { FaCodePullRequest, FaRegEye } from "react-icons/fa6";
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { MdOutlineTitle } from "react-icons/md";
import { FaBriefcase } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";

const AdminJobRequests = () => {
  const { backendUrl } = useContext(AppContext);
  const [pendingJobs, setPendingJobs] = useState([]);
  const getPendingJobs = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs/getpendingjobs`);
      if (data.success) {
        setPendingJobs(data.jobs);
      }
    } catch (error) {
      toast.error("Error Fetching Pending Jobs" + error.message);
    }
  }

  useEffect(() => {
    getPendingJobs();
  }, [])

  const updateJobStatus = async (id, status) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/jobs/updatejobstatus`, { jobId: id, status });
      if (data.success) {
        setPendingJobs(prev =>
          prev.map(job => job._id === id ? { ...job, approved: status } : job)
        );
        toast.success("Job status updated successfully");
        getPendingJobs();
      }
    } catch (error) {
      toast.error("Error updating job status" + error.message);
    }
  }

  const navigate = useNavigate();
  function viewDetails(id) {
    navigate(`/jobDetails/${id}`);
  }

  return (
    <div className='p-6 bg-white w-full rounded-lg '>
      <h1 className='text-2xl font-bold mb-4 flex items-center gap-2'>
        <FaCodePullRequest /> Job Requests
      </h1>
      {pendingJobs.length === 0 ? (
        <p>No Pending Job Requests</p>
      ) : (
        <ul className='p-4 grid gap-4 overflow-y-auto grid-cols-auto-fit'>
          {pendingJobs.map((job) => (
            <li className={`p-4 shadow-lg relative border-yellow-500 ${job.approved === "pending" ? "border-l-4 bg-yellow-50" :
              job.approved === "approved" ? "border-l-4 bg-green-50" :
                "border-l-4 bg-red-50"
              }`} key={job.id}>
              <h5 className='flex items-center gap-2 text-lg font-semibold mb-2'>
                <MdOutlineTitle className='text-[var(--primary-color)]' />{job.title}
              </h5>
              <span className='flex items-center gap-2 text-sm font-semibold mb-2'>
                <FaBriefcase size={13} className='text-[var(--primary-color)]' />{job.company}
              </span>
              <span className='absolute right-2 top-2 bg-yellow-200 px-4 rounded-lg py-1 text-sm text-amber-800'>{job?.approved}</span>
              <span
                onClick={() => viewDetails(job._id)}
                className='flex items-center cursor-pointer underline underline-offset-8 gap-2  text-sm mt-4 text-gray-600'>
                <FaRegEye className='text-[var(--primary-color)]' /> View Details {'>'}
              </span>

              <div className='flex mt-4'>
                <button 
                  onClick={() => updateJobStatus(job._id, "approved")} 
                  className='mt-4 bg-green-300 border-2 border-green-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-green-600 transition flex items-center gap-2'
                  >
                  Approve <FaCheckCircle className='text-green-500'/>
                </button>
                <button 
                  onClick={() => updateJobStatus(job._id, "rejected")} 
                  className='mt-4 bg-red-300 border-2 border-red-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-red-600 transition flex items-center gap-2'
                  >
                  Reject <GiCancel className='text-red-500'/>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default AdminJobRequests
