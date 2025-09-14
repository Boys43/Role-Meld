import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios';
import { FaBriefcase, FaDollarSign, FaArrowRight } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { IoIosWarning } from "react-icons/io";
import { toast } from 'react-toastify';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { CiBookmark } from "react-icons/ci";
import { CiPaperplane } from "react-icons/ci";
import { IoBookmark } from "react-icons/io5"; 

const JobDetails = () => {
    const { backendUrl } = useContext(AppContext);
    const [jobData, setJobData] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();

    const [companyJobs, setCompanyJobs] = useState([])

    const getJob = async () => {
        // let jobId = "68c3d4c1e99d7a75af562c95";
        try {
            const { data } = await axios.post(backendUrl + '/api/jobs/getJob', { id });
            if (data.success) {
                setJobData(data.job)
            } else {
                setJobData(null);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const getCompanyJobs = async () => {
        let company = jobData?.company;
        console.log(jobData);

        console.log(company);

        try {
            const { data } = await axios.post(`${backendUrl}/api/jobs/getcompanyjobs`, { company })
            if (data.success) {
                setCompanyJobs(data.companyJobs);
                console.log(companyJobs);
            } else {
                setCompanyJobs([]);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        getJob();
    }, []);

    useEffect(() => {
        if (jobData?.company) {
            getCompanyJobs();
        }
    }, [jobData]);

      const {savedJobs, toggleSaveJob} = useContext(AppContext);
    

    function viewDetails(id) {
        navigate(`/jobdetails/${id}`)
    }

    return (
        <>
            <div className='p-4 sm:p-6 md:p-8 lg:p-10 h-screen flex flex-col gap-8'>
                <div className='w-full flex items-center justify-between p-4 sm:p-6 md:p-8 lg:p-10 border bg-[var(--primary-color)]/20 rounded-2xl shadow-2xl'>
                    <div className='flex gap-4'>
                        <div className='w-20 h-20 rounded-full overflow-hidden border-4 border-[var(--primary-color)]'>
                            <img src={`${backendUrl + '/uploads/' + jobData?.companyProfile}` ?? jobData?.company ?? '?'} alt="" />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <h1 className='font-medium'>{jobData?.title}</h1>
                            <h4 className='italic flex items-center gap-4'>
                                <span className='flex items-center gap-2'>
                                    <FaBriefcase size={17} className='text-[var(--text-color)]' />Google
                                </span>
                                <span className='flex items-center gap-2'>
                                    <FaDollarSign size={19} /> {jobData?.salary} $
                                </span>
                                <span className='flex items-center gap-2'>
                                    <MdLocationOn size={20} /> {jobData?.location}
                                </span>
                            </h4>
                        </div>
                    </div>
                    <div className='flex flex-col gap-2 items-center'>
                        <button className='flex gap-2 items-center'>
                            Apply Now <FaArrowRight size={15} />
                        </button>
                        <h4 className='flex font-semibold italic gap-2 items-center'>
                            Last Date: <div className='text-red-500 flex items-center gap-2 font-medium'> <IoIosWarning size={19} /> {jobData?.applicationDeadline ? new Date(jobData.applicationDeadline).toISOString().split("T")[0] : "No deadline"}</div>
                        </h4>
                    </div>
                </div>
                <div className='flex rounded-2xl gap-4'>
                    <div className='w-[60%] rounded-3xl border py-4 sm:py-6 shadow-xl lg:py-8 px-8 h-screen'>
                        <div className='flex min-h-[40vh] flex-col gap-2'>
                            <h1 className='font-bold'>
                                Job Description
                            </h1>
                            <div dangerouslySetInnerHTML={{ __html: jobData?.description }} />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <h1 className='font-bold'>Key Points</h1>
                            <ul className='list-disc list-inside'>
                                <li className='text-xl'>
                                    The Job is <span className='font-medium text-[var(--primary-color)] italic'>{jobData?.jobType}</span>
                                </li>
                                <li className='text-xl'>
                                    The Job is for <span className='font-medium text-[var(--primary-color)] italic capitalize'>{jobData?.category}</span>
                                </li>
                                <li className='text-xl'>
                                    The Applicant must be <span className='font-medium text-[var(--primary-color)] italic capitalize'>{jobData?.locationType}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className='w-[40%] py-4 sm:py-6 lg:py-8 shadow-xl border rounded-3xl px-8 h-screen'>
                        <h1 className='font-bold'>More Jobs from <span className='italic text-[var(--primary-color)]'>{jobData?.company || "Google"}</span></h1>
                        <div>
                            {companyJobs <= 0 ? "No Jobs Found" : companyJobs.map((e, i) => (
                                <div
                                    key={i}
                                    className='relative flex flex-col gap-2 items-start w-full border-[1px] border-black p-5 rounded-2xl h-[37vh] shadow-lg mb-5'>
                                    <div className=' top-3 flex gap-2 right-3 text-[0.8rem]'>
                                        <span className={`px-2 rounded bg-yellow-200`}>
                                            {e?.jobType}
                                        </span>
                                        <span className={`px-2 rounded bg-green-200`}>
                                            {e?.locationType}
                                        </span>
                                        <span className={`px-2 rounded bg-red-200`}>
                                            {e?.category}
                                        </span>
                                    </div>
                                    <h3 className='font-semibold h-10'>{e?.title.split(" ").slice(0, 3).join(" ")}</h3>
                                    <div id='company' className=''>
                                        <h4 className='font-semibold text-gray-500'>{e?.company}</h4>
                                        <h5 className='text-gray-500 '>{e?.location}</h5>
                                    </div>
                                    <h5 className='bg-gray-100 py-1 px-2 text-[0.8rem] rounded'>$ {e?.salary}</h5>
                                    <button onClick={() => viewDetails(e._id)} className='flex items-center gap-4'>
                                        View Details <CiPaperplane />
                                    </button>
                                    <span
                                        onClick={() => toggleSaveJob(e._id)}
                                        className='absolute top-5 right-5 text-[1.5rem] cursor-pointer'>
                                        {savedJobs.has(e._id) ? <IoBookmark /> : < CiBookmark />}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default JobDetails
