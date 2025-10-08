import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
// React Icons
import { IoHomeOutline } from "react-icons/io5";
import { toast } from 'react-toastify';
import { MdCancel, MdTitle } from "react-icons/md";
import { IoIosWarning } from "react-icons/io";
import { FaDollarSign } from "react-icons/fa";
import { FaAudioDescription } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";
import JobCard from '../components/JobCard';
import Loading from '../components/Loading';
import Img from '../components/Image';
import { Clipboard, ExternalLink, File, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const JobDetails = () => {
    const { backendUrl, isLoggedIn, userData } = useContext(AppContext);
    const [loginReminder, setLoginReminder] = useState(false)
    const [jobData, setJobData] = useState(null);
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const { id } = useParams();

    const getJob = async () => {
        setLoading(true)
        try {
            const { data } = await axios.post(`${backendUrl}/api/jobs/getJob`, { id });
            if (data.success) {
                setJobData(data.job);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            setLoading(false)
        }
    }
    const [applyJobModel, setapplyJobModel] = useState(true)
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

    const [companyJobs, setCompanyJobs] = useState([])
    // Get More Related Jobs;
    const getCompanyJobs = async () => {
        setLoading(true)
        try {
            const { data } = await axios.post(`${backendUrl}/api/jobs/getcompanyjobs`, { company: jobData?.company });
            if (data.success) {
                setCompanyJobs(data.companyJobs);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getJob();
        getCompanyJobs();
    }, [])

    if (loading) {
        return <Loading />
    }

    return (
        <main className='p-2 md:p-4 min-h-screen lg:p-6'>
            <section className='p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                <div className='col-span-2 order-2 md:order-1'>
                    <h4 className='p-4 flex items-center text-lg gap-4 font-semibold'>
                        <IoHomeOutline size={25} onClick={() => navigate('/')} className='cursor-pointer' /> <span className='text-[var(--primary-color)]'>/</span> {jobData?.category} <span className='text-[var(--primary-color)]'>/</span> {jobData?.subCategory}
                    </h4>
                    <div className='my-4 w-full border rounded-2xl p-4 shadow-lg bg-[var(--primary-color)]/10 flex items-center justify-between'>
                        <div className=''>
                            <div className='flex items-center gap-4'>
                                <Img src={`${backendUrl}/uploads/${jobData?.companyProfile}`} style='w-8 object-cover h-8 rounded-lg' />
                                <h4 className='font-bold'>
                                    {jobData?.company}
                                </h4>
                            </div>
                            <h3 className='font-bold my-4 flex items-center gap-4 text-[var(--secondary-color)]'>
                                <MdTitle size={30} className='text-[var(--primary-color)]' /> {jobData?.title}
                            </h3>
                        </div>
                    </div>
                    <div className='w-full p-5 bg-white border border-gray-300 rounded-lg'>
                        {/* Header */}
                        <h2 className='text-lg font-bold text-slate-800 flex items-center gap-2 mb-4'>
                            {/* Using a hypothetical icon for consistency: 'TbListDetails' */}
                            <Clipboard className='text-green-500' />
                            Job Details
                        </h2>

                        {/* Details Grid */}
                        <div className='grid grid-cols-2 gap-4 text-center'>

                            {/* Job Type Card */}
                            <div className='flex flex-col p-3 bg-gray-50 rounded-md'>
                                <span className='text-xs font-medium text-gray-500 uppercase tracking-wider mb-1'>
                                    Job Type
                                </span>
                                <span className='text-base font-semibold text-slate-800'>
                                    {/* Use 'jobData?.jobType' for the actual data */}
                                    {jobData?.jobType || 'Contract'}
                                </span>
                            </div>

                            {/* Location Type Card */}
                            <div className='flex flex-col p-3 bg-gray-50 rounded-md'>
                                <span className='text-xs font-medium text-gray-500 uppercase tracking-wider mb-1'>
                                    Location Type
                                </span>
                                <span className='text-base font-semibold text-slate-800'>
                                    {/* Use 'jobData?.locationType' for the actual data */}
                                    {jobData?.locationType || 'On-site'}
                                </span>
                            </div>

                        </div>
                    </div>
                    <div className='p-4 flex flex-col gap-4 h-screen'>
                        <h2 className='font-bold flex items-center gap-4'>
                            <FaAudioDescription className='text-[var(--primary-color)]' /> Job Description
                        </h2>
                        <div className='px-10'>
                            <h4 className='text-lg font-semibold mb-4'>
                                Key Responsibities
                            </h4>
                            <ul className='list-disc list-inside'>
                                {jobData?.responsibilities?.map((res, index) => (
                                    <li>
                                        {res}
                                    </li>
                                ))}
                            </ul>
                            <h4 className='text-lg mt-8 font-semibold mb-4'>
                                About the Job
                            </h4>
                            <div className='min-h-[20vh] overflow-y-auto' dangerouslySetInnerHTML={{ __html: jobData?.description }} />
                        </div>
                    </div>
                </div>
                <div className='w-full order-1 md:order-2'>
                    <div className='border border-gray-300 rounded-lg p-2 md:p-4 sticky top-4 shadow-lg flex flex-col'>
                        <h3 className='font-semibold flex items-center gap-4 bg-gray-300 border-2 border-[var(--secondary-color)] px-4 py-2 rounded-lg'>
                            <FaDollarSign className='text-[var(--secondary-color)]' />{jobData?.salaryType === 'fixed' ? jobData?.fixedSalary : jobData?.minSalary + ' $' + ' - ' + jobData?.maxSalary + ' $'} monthly
                        </h3>
                        <Link className='mt-3 underline underline-offset-2 flex items-center text-blue-500 gap-3' to={'/company-profile/' + jobData?.postedBy}>
                            {jobData?.company} <ExternalLink size={20} />
                        </Link>
                        <span className='text-sm flex items-center gap-2 mt-3'>
                            <MapPin />
                            {jobData?.locationType !== 'remote' ?
                                <span>
                                    {jobData?.location}
                                </span>
                                : "Remote"}
                        </span>
                        <div className='flex gap-6 w-full py-4'>
                            <span className='flex items-center gap-2 text-red-500 bgrounded-md'>
                                <IoIosWarning />
                                {jobData?.applicationDeadline &&
                                    new Date(jobData.applicationDeadline).toLocaleDateString("en-US", {
                                        day: "2-digit",
                                        month: "long"
                                    })
                                }
                            </span>
                            <span className='flex items-center gap-2 text-green-500 py-1 rounded-md'>
                                <IoIosMail /> {jobData?.applicants.length} <span className='font-bold'>Applicants</span>
                            </span>
                        </div>
                        <div className='p-2 border-2 border-[var(--primary-color)] bg-[var(--primary-color)]/10 flex items-center gap-3 rounded-lg font-medium'>
                            <File className='text-yellow-800' /> Resume: <span className='font-bold'>
                                {jobData?.resumeRequirement === "false" ? "Not Required" : "Required"}
                            </span>
                        </div>
                        <button
                            disabled={userData?.appliedJobs?.includes(jobData?._id)}
                            // onClick={''}
                            className='mt-4'

                        >
                            Apply Now
                        </button>
                    </div>
                </div>
            </section>

            <hr className='my-8' />

            <section className='my-4 min-h-[40vh] w-full'>
                <h2 className='font-semibold'>More Jobs <span className='font-bold'>
                    {jobData?.company === "Individual" ? "" : 'from' + jobData?.company} </span></h2>
                <ul className='grid mt-4 gird-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {companyJobs?.filter(job => job._id !== jobData?._id).length > 0 ? companyJobs?.filter(job => job._id !== jobData?._id)?.map((e, i) => (
                        <JobCard key={i} e={e} />
                    )) :
                        <h4 className='font-semibold  mt-8 '>
                            No Jobs Posted from {jobData?.company}
                        </h4>
                    }
                </ul>
            </section>

            {/* Login */}
            <div className={`fixed top-0 backdrop-blur-sm left-0 w-full h-screen flex items-center justify-center ${loginReminder ? 'flex' : 'hidden'}`}>
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

            {/* Apply Job Model */}
            {applyJobModel && <div className='fixed w-full h-screen bg-black/40 top-0 left-0 flex items-center justify-center'>
                <div className='p-4 rounded-lg bg-white shadow-2xl'>

                </div>
            </div>}
            
        </main>
    )
}

export default JobDetails