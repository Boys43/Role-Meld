import React, { useEffect } from 'react'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MdCancel } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const JobCard = ({ e }) => {
    const { backendUrl, isLoggedIn, userData } = useContext(AppContext);
    const [toggleApplyJob, setToggleApplyJob] = useState(false)
    const [applJobId, setapplJobId] = useState('')
    const navigate = useNavigate();
    const [coverLetter, setCoverLetter] = useState('')
    const applyJob = async (id) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/applyjob', { jobId: id, resume: userData?.resume, coverLetter: coverLetter });

            if (data.success) {
                toast.success(data.message);
                setToggleApplyJob(false);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    // Login Reminder Pop Up
    const [loginReminder, setLoginReminder] = useState(false);

    function vewDetails(id) {
        navigate(`/jobdetails/` + id);
    }

    return (
        <>
            <li className='p-6 border border-blue-500 rounded-lg shadow hover:shadow-lg transition-shadow flex flex-col gap-4 bg-blue-50'>
                {/* Company Info */}
                <div className='flex items-center gap-3'>
                    <img
                        className='w-12 h-12 rounded-full object-cover border border-gray-300'
                        src={backendUrl + "/uploads/" + e?.companyProfile}
                        alt={e?.company}
                    />
                    <h3 className='font-semibold text-lg text-gray-800'>{e?.company}</h3>
                </div>

                {/* Job Title */}
                <h2 className='font-bold text-xl text-gray-900'>{e?.title}</h2>

                {/* Job Badges */}
                <div className='flex flex-wrap items-center gap-2'>
                    <span className='px-3 py-1 text-sm rounded-full bg-blue-500 text-white font-medium'>{e?.jobType}</span>
                    <span className='px-3 py-1 text-sm rounded-full bg-red-500 text-white font-medium'>{e?.locationType}</span>
                    <span className='px-3 py-1 text-sm rounded-full bg-green-500 text-white font-medium'>{e?.category}</span>
                </div>

                {/* Salary */}
                <div className='text-gray-700 font-medium px-3 py-1 rounded border border-gray-500 bg-gray-300 w-max'>
                    {e?.salary} $
                </div>

                {/* Buttons */}
                <div className='flex gap-4 mt-2'>
                    <button
                        disabled={userData?.appliedJobs?.includes(e?._id)}
                        onClick={() => {
                            if (isLoggedIn) {
                                setapplJobId(e?._id)
                                setToggleApplyJob(true)
                            } else {
                                setLoginReminder(true)
                            }
                        }} className='flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded transition'

                    >
                        Apply Now
                    </button>
                    <button className='flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded transition'
                        onClick={() => vewDetails(e?._id)}
                    >
                        View Details
                    </button>
                </div>
            </li>

            {/* Apply Job Pop Up */}
            <div className={`fixed top-0 backdrop-blur-sm left-0 w-full h-screen flex items-center z-100 justify-center ${toggleApplyJob ? 'flex' : 'hidden'}`}>
                <div className='w-[500px] relative bg-white shadow-2xl rounded-lg p-8'>
                    <span className='absolute top-4 right-4 cursor-pointer'>
                        <MdCancel onClick={() => setToggleApplyJob(false)} />
                    </span>
                    <h1>
                        Briefly Explain Your Self
                    </h1>
                    <textarea value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} name="coverLetter" className='w-full h-[50%] rounded-2xl resize-none p-4 border shadow-lg my-10' placeholder='Enter Your Brief Interest In the Job...' id="coverLetter">
                    </textarea>
                    <button onClick={() => applyJob(applJobId)}>
                        Apply
                    </button>
                </div>
            </div>


            {/* Login Reminder Pop up */}
            <div className={`fixed top-0 backdrop-blur-sm left-0 w-full h-screen flex items-center z-100 justify-center ${loginReminder ? 'flex' : 'hidden'}`}>
                <div className='relative bg-white flex flex-col items-center gap-4 shadow-2xl rounded-lg p-8'>
                    <span className='absolute top-4 right-4 cursor-pointer'>
                        <MdCancel onClick={() => setLoginReminder(false)} />
                    </span>
                    <h3 className='font-bold'>
                        Please Login First
                    </h3>
                    <button className='w-full' onClick={() => navigate('/login')}>
                        Login
                    </button>
                    <p>
                        You need to be <span className='font-semibold'>Login</span> to continue
                    </p>
                </div>
            </div>
        </>
    )
}

export default JobCard
