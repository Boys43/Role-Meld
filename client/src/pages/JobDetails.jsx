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
import { TbListDetails } from "react-icons/tb";
import { IoIosMail } from "react-icons/io";
import JobCard from '../components/JobCard';

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

    const [toggleApplyJob, setToggleApplyJob] = useState(false)
    const [applJobId, setapplJobId] = useState('')
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
        return <div className="flex fixed top-1/2 left-1/2 tanslate-1/2 justify-center items-center py-10">
            <div className="w-8 h-8 border-4 border-[var(--primary-color)] border-t-transparent rounded-full animate-spin"></div>
        </div>
    }

    return (
        <main className='p-6'>
            <section className='p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                <div className='col-span-2'>
                    <h4 className='p-4 flex items-center text-lg gap-4 font-semibold'>
                        <IoHomeOutline size={25} className='' /> <span className='text-[var(--primary-color)]'>/</span> {jobData?.category} <span className='text-[var(--primary-color)]'>/</span> {jobData?.subCategory}
                    </h4>
                    <div className='my-4 border rounded-2xl p-4 shadow-lg bg-[var(--primary-color)]/10 flex items-center justify-between'>
                        <div>
                            <div className='flex items-center gap-4'>
                                <img src={`${backendUrl}/uploads/${jobData?.companyProfile}`} alt={jobData?.companyProfile} className='w-8 object-cover h-8 rounded-full border-2 border-[var(--primary-color)]' />
                                <h4 className='font-bold'>
                                    {jobData?.company}
                                </h4>
                            </div>
                            <h3 className='font-bold my-4 flex items-center gap-4'>
                                <MdTitle size={30} className='text-[var(--primary-color)]' /> {jobData?.title}
                            </h3>
                        </div>
                    </div>
                    <div className='p-4 flex flex-col gap-4'>
                        <h2 className='font-bold flex items-center gap-4'>
                            <TbListDetails className='text-[var(--primary-color)]' /> Job Details:
                        </h2>
                        <div className='flex items-center gap-4 ml-6'>
                            <span className='bg-red-300 rounded-lg text-white border border-red-500 px-2 py-1 '>{jobData?.jobType}</span>
                            <span className='bg-green-300 rounded-lg text-white border border-green-500 px-2 py-1 '>{jobData?.locationType}</span>
                        </div>
                    </div>
                    <div className='p-4 flex flex-col gap-4 h-screen'>
                        <h2 className='font-bold flex items-center gap-4'>
                            <FaAudioDescription className='text-[var(--primary-color)]' /> Job Description:
                        </h2>
                        <div className='ml-8' dangerouslySetInnerHTML={{ __html: jobData?.description }} />
                    </div>
                </div>
                <div className=''>
                    <div className='border p-4 shadow-lg flex flex-col  sticky top-0'>
                        <h2 className='font-bold flex items-center gap-4 bg-gray-300 border-2 border-[var(--secondary-color)] px-4 py-2 rounded-lg'>
                            <FaDollarSign />{jobData?.salary}
                        </h2>
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
                        <div className='p-2 border-2 border-[var(--primary-color)] bg-[var(--primary-color)]/10 rounded-lg'>
                            {userData?.resume ? <h4><span className='text-[var(--primary-color)] font-bold'>Resume:</span>{userData?.resume}</h4> : <h4 className='text-red-500 flex gap-4 items-center'>No resume uploaded <span onClick={() => isLoggedIn ? navigate('/dashboard') : setLoginReminder(true)} className='text-sm underline text-black'>Upload</span></h4>}
                        </div>
                        <button className='mt-4'
                            onClick={() => isLoggedIn ? setapplJobId(true) : setLoginReminder(true)}
                        >
                            Apply Now
                        </button>
                    </div>
                </div>
            </section>

            <section className='my-4 min-h-[40vh] w-full'>
                <h2 className='font-semibold'>More Jobs from <span className='font-bold'>{jobData?.company}</span></h2>
                <ul className='grid gird-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {companyJobs?.filter(job => job._id !== jobData?._id).length > 0 ? companyJobs?.filter(job => job._id !== jobData?._id)?.map((e, i) => (
                        <JobCard key={i} e={e} />
                    )) :
                        <h4 className='font-semibold  mt-8 '>
                            No Jobs Posted from {jobData?.company}
                        </h4>
                    }
                </ul>
            </section>


            {/* Apply Job Pop Up */}
            <div className={`fixed top-0 backdrop-blur-sm left-0 w-full h-screen flex items-center justify-center ${toggleApplyJob ? 'flex' : 'hidden'}`}>
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
        </main>
    )
}

export default JobDetails
