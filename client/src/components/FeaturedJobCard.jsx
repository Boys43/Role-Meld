import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify';
import { MdCancel } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

// React Icons
import { IoHomeOutline } from "react-icons/io5";
import { FaBookmark, FaClock } from "react-icons/fa";
import { CiBookmark } from 'react-icons/ci';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

const FeaturedJobCard = () => {
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

    function vewDetails(id) {
        navigate(`/jobdetails/` + id);
    }

    return (
        <>
            <div className='px-4 py-8 w-full grid gird-cols-1 md:grid-cols-2 rounded-lg bg-white border border-gray-300'>
                <div className='w-full flex flex-col gap-6'>
                    <span className='absolute top-4 right-4 bg-gray-300 px-3 text-sm rounded '>
                        Sponsored
                    </span>
                    <div className='flex items-center gap-2 px-4 font-semibold'>
                        <IoHomeOutline /> <span className='text-[var(--primary-color)]'>/</span> Category <span className='text-[var(--primary-color)]'>/</span> Subcategory
                    </div>
                    <div className='p-4'>
                        <h3 className='font-semibold mb-4 flex items-center gap-4'>
                            <img src="" alt="Alt" className='h-13 w-13 object-cover rounded-full border' />Company
                        </h3>
                        <h2 className='font-medium mb-4'>
                            Title Here
                        </h2>
                        {/* <div dangerouslySetInnerHTML={{_html: "Description Here"}}/> */}
                        <span className='bg-gray-300 px-4 rounded font-medium '>
                            100,000 - 200,000 Rs
                        </span>
                        <div className='flex mt-4 items-center flex-wrap gap-4'>
                            <span className='text-white border border-green-500 bg-green-300 px-4 rounded'>
                                Full Time
                            </span>

                            <span className='text-white border border-red-500 bg-red-300 px-4 rounded'>
                                On Site
                            </span>
                        </div>
                    </div>
                    <span className='px-4 text-sm flex items-center gap-2 text-gray-500'>
                        <FaClock /> 5 Minutes ago
                    </span>
                </div>
                <div className='w-full relative p-4'>
                    <span
                        // onClick={() => toggleSaveJob(e?._id)}
                        className='text-[var(--primary-color)] right- text-sm mt-2 cursor-pointer top-4 w-full flex justify-end'>
                        {/* {[...savedJobs].includes ? <FaBookmark size={25} /> : <CiBookmark size={30} />} */}
                        <FaBookmark size={25} />
                    </span>
                    <div className='flex h-full items-end justify-end gap-4 py-10'>
                        <button
                            // disabled={userData?.appliedJobs?.includes(e?._id)}
                            onClick={() => {
                                if (isLoggedIn) {
                                    // setapplJobId(e?._id)
                                    setToggleApplyJob(true)
                                } else {
                                    setLoginReminder(true)
                                }
                            }} className='flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded transition'

                        >
                            Apply Now
                        </button>
                        <button className='flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded transition'
                            // onClick={() => vewDetails(e?._id)}
                        >
                            View Details
                        </button>
                    </div>
                </div>
            </div>
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

export default FeaturedJobCard
