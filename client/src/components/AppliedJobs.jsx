import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaBriefcase, FaClock } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";

const AppliedJobs = () => {
    const { backendUrl } = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [jobData, setJobData] = useState([]);

    const getJobDetails = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${backendUrl}/api/applications/appliedjobs`);
            if (data.success) {
                setJobData(data.applications);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getJobDetails();
    }, [])

    console.log('', jobData);


    return (
        <div className='p-5'>
            {loading ? <div>Loading...</div> : <>
                <h1 className='font-bold'>Applied Jobs</h1>
                <ul className='flex flex-col gap-4 mt-4'>
                    {jobData?.map((application, index) => (
                        <li key={index} className='py-2 px-4 shadow-xl rounded-2xl border-2 border-[var(--primary-color)] flex items-center justify-between bg-[var(--primary-color)]/10'>
                            <div className='flex gap-5 items-center'>
                                <h2 className='font-semibold w-40 text-lg'>
                                    {application?.job?.title || "Title not found"}
                                </h2>
                                <h5 className='flex items-center w-50 text-sm gap-2 italic'><FaBriefcase className='text-[var(--primary-color)]' /> {application?.job?.company || "Company not found"}</h5>

                                <h5 className='flex items-center w-30 text-sm gap-2 italic font-semibold'><FaClock className='text-[var(--primary-color)]' /> {new Date(application?.appliedAt).toLocaleString() || "Company not found"}</h5>
                                
                                <h5 onClick={(e)=>
                                    window.open(`/jobdetails/${application?.job?._id}`, "_blank")
                                } className='flex items-center justify-center w-30 text-sm gap-2 italic font-semibold'><FaRegEye size={20} className='cursor-pointer' /> View Details</h5>
                            </div>
                            
                            <div>
                                <span className={`text-sm px-4 py-1 rounded-xl border ${application?.status === "applied" ? "bg-yellow-200 text-yellow-800" : application?.status === "hired" ? "bg-green-200 text-green-800" : application?.status === "rejected" ? "bg-red-200 text-red-800" : "bg-gray-200 text-gray-800"}`}>
                                    {application?.status || "Status not found"}
                                </span>
                            </div>

                        </li>
                    ))}
                </ul>
            </>}

        </div>
    )
}

export default AppliedJobs
