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
import Loading from './Loading';
import BtnLoading from './BtnLoading';
import NotFound404 from './NotFound404';
import { FaChevronRight } from "react-icons/fa";
import { MdOutlinePayment } from "react-icons/md";
import { MdCancel } from "react-icons/md";

const AdminJobRequests = () => {
  const { backendUrl } = useContext(AppContext);
  const [pendingJobs, setPendingJobs] = useState([]);
  const [loadingA, setLoadingA] = useState(false)
  const [loadingB, setLoadingB] = useState(false)
  const getPendingJobs = async () => {
    setLoadingA(true)
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs/getpendingjobs`);
      if (data.success) {
        setPendingJobs(data.jobs);
      }
    } catch (error) {
      toast.error("Error Fetching Pending Jobs" + error.message);
    } finally {
      setLoadingA(false);
    }
  }

  useEffect(() => {
    getPendingJobs();
  }, [])

  const updateJobStatus = async (id, status) => {
    setLoadingB(true)
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
    } finally { setLoadingB(false) }
  }

  const navigate = useNavigate();
  function viewDetails(id) {
    navigate(`/jobDetails/${id}`);
  }

  const [showPaymentDetails, setshowPaymentDetails] = useState(false)

  return (
    <div className='p-6 bg-white w-full rounded-lg '>
      <h1 className='text-2xl font-bold mb-4 flex items-center gap-4'>
        <FaCodePullRequest className='text-[var(--primary-color)]' /> Job Requests
      </h1>
      {pendingJobs.length === 0 ? (
        <NotFound404 margin={"mt-10"} value={"No Job Requests"} />
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
              <span className={`absolute right-2 top-2 px-4 rounded-lg py-1 text-sm ${job.approved === "pending" ? "bg-yellow-200 text-yellow-900" :
                job.approved === "approved" ? "bg-green-200 text-green-900" :
                  "bg-red-200 text-red-900"
                }`}>{job?.approved}</span>

              {job.sponsored && <span className='absolute right-2 top-12 px-4 rounded-lg py-1 text-sm bg-blue-200 text-blue-900'>Sponsored</span>}
              <span
                onClick={() => viewDetails(job._id)}
                className='flex items-center cursor-pointer underline underline-offset-8 gap-2  text-sm mt-4 text-gray-600'>
                <FaRegEye className='text-[var(--primary-color)]' /> View Details {'>'}
              </span>

              <div className='flex gap-2 mt-4'>
                <button
                  onClick={() => updateJobStatus(job._id, "approved")}
                  className='mt-4 bg-green-300 border-2 border-green-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-green-600 transition flex items-center gap-2'
                  disabled={loadingB}
                >
                  {loadingB ?
                    <>
                      "Loading"
                    </> :
                    <>
                      Approve < FaCheckCircle className='text-green-500' />
                    </>
                  }
                </button>
                <button
                  onClick={() => updateJobStatus(job._id, "rejected")}
                  className='mt-4 bg-red-300 border-2 border-red-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-red-600 transition flex items-center gap-2'
                >
                  {loadingB ?
                    <>
                      "Loading"
                    </> :
                    <>
                      Reject < GiCancel className='text-red-500' />
                    </>
                  }
                </button>
                {job?.sponsored && <span className='self-end flex items-center gap-2 hover:underline cursor-pointer underline-offset-8 text-[var(--primary-color)] underline-[var(--primary-color)]'
                  onClick={() => setshowPaymentDetails(true)}
                >
                  Payment Details <FaChevronRight size={15} className='text-gray-500 ' />
                </span>}
              </div>

              {/* Payment Details */}
              {showPaymentDetails &&
                <div className='flex items-center justify-center fixed top-0 left-0 h-screen w-full backdrop-blur-sm'>
                  {/* Container */}
                  <div className=' bg-white shadow-lg relative rounded-2xl p-4 border border-gray-300 w-1/2 '>
                    <MdCancel className='absolute top-2 right-2' onClick={() => setshowPaymentDetails(false)} />
                    <h2 className='font-semibold flex items-center gap-3'>
                      <MdOutlinePayment className='text-[var(--primary-color)]' /> Payment Details
                    </h2>
                    <div className='mt-4 flex flex-col'>
                      <h4 className='font-semibold'>
                        Payment Name
                      </h4>
                      <span className='text-sm'>
                        {job.cardName}
                      </span>
                      <h4 className='font-semibold mt-4'>
                        Card Number
                      </h4>
                      <span className='text-sm'>
                        {job.cardNumber}
                      </span>
                      <div className='flex items-center w-1/2 justify-between'>
                        <div>
                          <h4 className='font-semibold mt-4'>
                            Expiry Date
                          </h4>
                          <span className='text-sm'>
                            {job.expiryDate}
                          </span>
                        </div>
                        <div>
                          <h4 className='font-semibold mt-4'>
                            CVV
                          </h4>
                          <span className='text-sm'>
                            {job.cvv}
                          </span>
                        </div>
                      </div>
                      <h4 className='font-semibold mt-4'>
                        Payment Amount
                      </h4>
                      <span className='text-sm'>
                        10 $
                      </span>
                    </div>
                  </div>
                </div>
              }
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default AdminJobRequests
