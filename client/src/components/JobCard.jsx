import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// React Icons
import { CiBookmark } from "react-icons/ci";
import { FaBookmark } from "react-icons/fa";
import { MdCancel } from 'react-icons/md';
import LoginModel from './LoginModel';
import { FaChevronRight } from "react-icons/fa";

const JobCard = ({ e }) => {
    const { backendUrl, isLoggedIn, userData, toggleSaveJob, savedJobs } = useContext(AppContext);

    const [toggleApplyJob, setToggleApplyJob] = useState(false)
    const [applJobId, setapplJobId] = useState('')
    const navigate = useNavigate();
    const [coverLetter, setCoverLetter] = useState('');
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
    
    return (
        <>
            <li className='p-3 border relative border-gray-300 rounded-lg hover:shadow-lg transition-shadow flex flex-col gap-5 cursor-pointer'>
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
                <h3 className='font-bold text-xl text-gray-900'>{e?.title}</h3>

                {/* Job Badges */}
                <div className='flex flex-wrap items-center gap-2'>
                    <span className='px-3 text-xs rounded bg-blue-300 border border-blue-500 text-white font-medium'>{e?.jobType}</span>
                    <span className='px-3 text-xs rounded bg-red-300 border border-red-500 text-white font-medium'>{e?.locationType}</span>
                    <span className='px-3 text-xs rounded bg-green-300 border border-green-500 text-white font-medium'>{e?.category}</span>
                </div>

                {/* Salary */}
                <div className='text-gray-700 font-medium px-2 rounded border border-gray-500 bg-gray-300 w-max'>
                    {e?.salary} $
                </div>

                {/* Buttons */}
                <div className='flex gap-4 '>
                    <button
                        disabled={userData?.appliedJobs?.includes(e?._id)}
                        onClick={() => {
                            if (isLoggedIn) {
                                setapplJobId(e?._id)
                                setToggleApplyJob(true)
                            } else {
                                setLoginReminder(true)
                            }
                        }}
                    >
                        Apply Now
                    </button>
                    <span className='flex gap-2 items-center relative font-semibold rounded transition after:w-0 hover:after:w-full after:h-[2px] after:bg-[var(--primary-color)] after:rounded-full after:transition-all after:duration-300  cursor-pointer after:left-0 after:absolute after:bottom-0'
                        onClick={() => navigate(`/jobdetails/` + e?._id)}
                    >
                        View Details <FaChevronRight size={15} />
                    </span>
                </div>
                <span
                    onClick={() => toggleSaveJob(e?._id)}
                    className='text-[var(--primary-color)] text-sm mt-2 cursor-pointer absolute top-3 right-3'>
                    {[...savedJobs].includes(e?._id) ? <FaBookmark size={25} /> : <CiBookmark size={30} />}
                </span>
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
                <div className='bg-white flex flex-col items-center gap-4 shadow-2xl rounded-lg p-8'>
                    <span className='cursor-pointer'>
                        <MdCancel onClick={() => setLoginReminder(false)} />
                    </span>
                    <LoginModel />
                </div>
            </div>
        </>
    )
}

export default JobCard
