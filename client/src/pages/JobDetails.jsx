import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios';
import {  useNavigate, useParams } from 'react-router-dom';
// React Icons
import { IoHome, IoWarning } from "react-icons/io5";
import { toast } from 'react-toastify';
import { MdCancel } from "react-icons/md";
import { FaMoneyBill } from "react-icons/fa";
import JobCard from '../components/JobCard';
import Loading from '../components/Loading';
import Img from '../components/Image';
import { Clipboard, ExternalLink, Mail, MapPin, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Pencil, User, Briefcase } from "lucide-react";
import {
    Phone,
    Globe,
    GraduationCap,
    Link as LinkIcon,
    FileBadge,
} from "lucide-react";
import Currency from '../components/CurrencyCovertor';

const JobDetails = () => {
    // Auto Scroll to top
    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, []);

    const { backendUrl, userData } = useContext(AppContext);
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

    const [applyJobModel, setApplyJobModel] = useState(false);
    const applyJob = async () => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/applyjob', { jobId: id });

            if (data.success) {
                toast.success(data.message);
                setApplyJobModel(false);
                getJob();
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
    }, [id])

    if (loading) {
        return <Loading />
    }

    console.log(jobData);
    

    return (
        <main className='max-w-7xl mx-auto p-4 min-h-screen'>
            {/* Breadcrumb */}
            <nav className='mb-6'>
                <div className='flex items-center text-sm text-gray-600'>
                    <span onClick={() => navigate('/')} className='cursor-pointer hover:text-blue-600 flex items-center gap-1'>
                        <IoHome size={16} />
                        Home
                    </span>
                    <span className='mx-2'>/</span>
                    <span>Jobs</span>
                    <span className='mx-2'>/</span>
                    <span className='text-gray-900 font-medium'>{jobData?.category}</span>
                    {jobData?.subCategory && (
                        <>
                            <span className='mx-2'>/</span>
                            <span className='text-gray-900 font-medium'>{jobData?.subCategory}</span>
                        </>
                    )}
                </div>
            </nav>

            {/* Main Content */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                {/* Left Content */}
                <div className='lg:col-span-2 space-y-6'>
                    {/* Job Header */}
                    <div className='bg-white rounded-lg border border-gray-200 p-6'>
                        <div className='flex items-start gap-4'>
                            <Img src={jobData?.companyProfile} style='w-12 h-12 rounded-lg object-cover border' />
                            <div className='flex-1'>
                                <h1 className='text-2xl font-bold text-gray-900 mb-2'>{jobData?.title}</h1>
                                <div className='flex items-center gap-2 text-gray-600 mb-3'>
                                    <span className='font-medium'>by {jobData?.company}</span>
                                    <span>•</span>
                                    <span>{jobData?.location || 'Remote'}</span>
                                    <span>•</span>
                                    <span className='text-green-600 font-medium'>
                                        {new Date(jobData?.createdAt).toLocaleDateString('en-US', {
                                            day: 'numeric',
                                            month: 'short'
                                        })}
                                    </span>
                                </div>
                                <div className='flex items-center gap-4 text-sm text-gray-600'>
                                    <span className='bg-blue-50 text-blue-700 px-3 py-1 rounded-full'>
                                        {jobData?.jobType?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                    </span>
                                    <span className='bg-green-50 text-green-700 px-3 py-1 rounded-full'>
                                        {jobData?.locationType?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Job Role Insights */}
                    <div className='bg-white rounded-lg border border-gray-200 p-6'>
                        <h2 className='text-lg font-semibold text-gray-900 mb-4'>Job role insights</h2>
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                            <div className='flex items-center gap-3'>
                                <div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center'>
                                    <Clipboard size={16} className='text-blue-600' />
                                </div>
                                <div>
                                    <div className='text-xs text-gray-500'>Date posted</div>
                                    <div className='font-medium'>
                                        {new Date(jobData?.createdAt).toLocaleDateString('en-US', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className='flex items-center gap-3'>
                                <div className='w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center'>
                                    <IoWarning size={16} className='text-red-600' />
                                </div>
                                <div>
                                    <div className='text-xs text-gray-500'>Closing date</div>
                                    <div className='font-medium'>
                                        {jobData?.applicationDeadline ?
                                            new Date(jobData.applicationDeadline).toLocaleDateString('en-US', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            }) : 'Not specified'
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className='flex items-center gap-3'>
                                <div className='w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center'>
                                    <MapPin size={16} className='text-green-600' />
                                </div>
                                <div>
                                    <div className='text-xs text-gray-500'>Hiring location</div>
                                    <div className='font-medium'>{jobData?.location || 'Remote'}</div>
                                </div>
                            </div>
                            <div className='flex items-center gap-3'>
                                <div className='w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center'>
                                    <GraduationCap size={16} className='text-purple-600' />
                                </div>
                                <div>
                                    <div className='text-xs text-gray-500'>Experience</div>
                                    <div className='font-medium'>{jobData?.experience || 'Bachelor Degree'}</div>
                                </div>
                            </div>
                            <div className='flex items-center gap-3 col-span-2'>
                                <div className='w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center'>
                                    <FaMoneyBill size={16} className='text-purple-600' />
                                </div>
                                <div>
                                    <div className='text-xs text-gray-500'>Salary</div>
                                    <div className='font-medium'>
                                        {jobData?.salaryType === "fixed" ? <span>
                                            <Currency amount={jobData?.fixedSalary} from={jobData?.jobsCurrency} />
                                        </span> : <span>

                                            <Currency amount={jobData?.minSalary} from={jobData?.jobsCurrency} /> - <Currency amount={jobData?.maxSalary} from={jobData?.jobsCurrency} /></span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className='bg-white rounded-lg border border-gray-200 p-6'>
                        <h2 className='text-lg font-semibold text-gray-900 mb-4'>Description</h2>

                        <div className='space-y-6'>
                            <div>
                                <h3 className='font-semibold text-gray-900 mb-3'>Overview</h3>
                                <p className='text-gray-700 leading-relaxed'>{jobData?.description}</p>
                            </div>

                            {jobData?.responsibilities?.length > 0 && (
                                <div>
                                    <h3 className='font-semibold text-gray-900 mb-3'>Requirements</h3>
                                    <ul className='space-y-2'>
                                        {jobData.responsibilities.map((req, index) => (
                                            <li key={index} className='flex items-start gap-2'>
                                                <div className='w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0'></div>
                                                <span className='text-gray-700'>{req}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {jobData?.benefits?.length > 0 && (
                                <div>
                                    <h3 className='font-semibold text-gray-900 mb-3'>Benefits</h3>
                                    <ul className='space-y-2'>
                                        {jobData.benefits.map((benefit, index) => (
                                            <li key={index} className='flex items-start gap-2'>
                                                <div className='w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0'></div>
                                                <span className='text-gray-700'>{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Skills & Experience */}
                    <div className='bg-white rounded-lg border border-gray-200 p-6'>
                        <h2 className='text-lg font-semibold text-gray-900 mb-4'>Skill & Experience</h2>
                        <div className='space-y-4'>
                            {jobData?.experience && (
                                <div>
                                    <div className='flex items-start gap-2 mb-2'>
                                        <div className='w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0'></div>
                                        <span className='text-gray-700'>You have at least {jobData.experience} of experience working as a {jobData?.title}</span>
                                    </div>
                                </div>
                            )}
                            <div className='flex items-start gap-2'>
                                <div className='w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0'></div>
                                <span className='text-gray-700'>You have experience using {jobData?.locationType === 'remote' ? 'remote collaboration tools' : 'on-site work environments'}</span>
                            </div>
                        </div>

                        <div className='mt-6'>
                            <h3 className='font-semibold text-gray-900 mb-3'>Skills</h3>
                            <div className='flex flex-wrap gap-2'>
                                {jobData?.skills?.map((skill, index) => (
                                    <span key={index} className='bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm'>
                                        {skill.charAt(0).toUpperCase() + skill.slice(1)}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Photos Section */}
                    {jobData?.companyProfile && (
                        <div className='bg-white rounded-lg border border-gray-200 p-6'>
                            <h2 className='text-lg font-semibold text-gray-900 mb-4'>Photos</h2>
                            <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                                <div className='aspect-video bg-gray-100 rounded-lg overflow-hidden'>
                                    <Img src={jobData.companyProfile} style='w-full h-full object-cover' />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Sidebar */}
                <div className='lg:col-span-1 w-full'>
                    <div className='bg-white w-full rounded-lg border border-gray-200 p-6 sticky top-4'>
                        {/* Apply Section */}
                        <div className='mb-6 flex flex-col items-center'>
                            <h2 className='text-lg font-semibold text-gray-900 mb-4'>
                                Interseted in this Job
                            </h2>
                            <div className='text-sm text-gray-600 mb-2'>
                                {Math.ceil((new Date(jobData?.applicationDeadline) - new Date()) / (1000 * 60 * 60 * 24)) > 0
                                    ? `${Math.ceil((new Date(jobData.applicationDeadline) - new Date()) / (1000 * 60 * 60 * 24))} day(s) left`
                                    : 'Deadline passed'}
                            </div>
                            <span
                                disabled={userData?.appliedJobs?.includes(id)}
                                onClick={() => setApplyJobModel(true)}
                                className={`cursor-pointer bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors ${userData?.role === "recruiter" && "hidden"} ${userData?.appliedJobs?.includes(id) && "bg-gray-400 cursor-not-allowed"}`}
                            >
                                {userData?.appliedJobs?.includes(id) ? "Already Applied" : "Apply now"}
                            </span>
                        </div>

                        {/* Company Info */}
                        <div className='border-t pt-6'>
                            <div className='flex items-center gap-3 mb-4'>
                                <Img src={jobData?.companyProfile} style='w-12 h-12 rounded-lg object-cover border' />
                                <div>
                                    <h3 className='font-semibold text-gray-900'>{jobData?.company}</h3>
                                    <Link to={`/company-profile/${jobData?.postedBy?.authId}`} className='text-blue-600 mt-1 text-sm hover:underline flex items-center gap-2'>
                                        {jobData?.company} <ExternalLink size={18} />
                                    </Link>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className='flex border-b mb-4'>
                                <span className='px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600'>
                                    Overview
                                </span>
                            </div>

                            {/* Company Details */}
                            <div className='space-y-4 text-sm'>
                                <div>
                                    <div className='text-gray-600'>Industry</div>
                                    <div className='font-medium'>{jobData?.postedBy?.industry || "Tech Startup"}</div>
                                </div>

                                <div>
                                    <div className='text-gray-600'>Company size</div>
                                    <div className='font-medium'>{jobData?.postedBy?.members || '1'}</div>
                                </div>

                                <div>
                                    <div className='text-gray-600'>Founded in</div>
                                    <div className='font-medium'>{jobData?.postedBy?.foundedAt || '2010'}</div>
                                </div>

                                <div>
                                    <div className='text-gray-600'>Location</div>
                                    <div className='font-medium'>{jobData?.postedBy?.city + ", " + jobData?.postedBy?.country || 'Remote'}</div>
                                </div>

                                <div>
                                    <div className='text-gray-600'>Phone</div>
                                    <div className='font-medium'>{jobData?.postedBy?.contactNumber || '+1234567890'}</div>
                                </div>

                                <div>
                                    <div className='text-gray-600'>Email</div>
                                    <div className='font-medium text-blue-600'>contact@{jobData?.company?.toLowerCase().replace(/\s+/g, '')}.com</div>
                                </div>

                                <div>
                                    <div className='text-gray-600'>Website</div>
                                    <a href={jobData?.postedBy?.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className='font-medium text-blue-600 hover:underline flex items-center gap-1'>
                                        Visit {jobData?.postedBy?.website}
                                        <ExternalLink size={12} />
                                    </a>
                                </div>
                            </div>

                            {/* Send Message Button */}
                            <a className='w-full mt-6 border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2'
                            href={`mailto:${jobData?.postedBy?.email}`}
                            >
                                <Mail size={16} />
                                Send message
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Similar Jobs Section */}
            <div className='mt-12'>
                <div className='bg-white rounded-lg border border-gray-200 p-6'>
                    <div className='flex items-center justify-between mb-6'>
                        <h2 className='text-xl font-semibold text-gray-900'>Similar jobs</h2>
                        <Link to="/jobs" className='text-blue-600 text-sm hover:underline'>
                            View all jobs
                        </Link>
                    </div>

                    {companyJobs?.filter(job => job._id !== jobData?._id).length > 0 ?
                        companyJobs?.filter(job => job._id !== jobData?._id).map(job => (
                            <JobCard e={job} />
                        )) : (
                            <div className='text-center py-8'>
                                <div className='text-gray-400 mb-2'>
                                    <Briefcase size={48} className='mx-auto' />
                                </div>
                                <h3 className='font-semibold text-gray-600 mb-1'>No similar jobs found</h3>
                                <p className='text-gray-500 text-sm'>
                                    No other jobs available from {jobData?.company}
                                </p>
                            </div>
                        )}
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


            {/* Apply Job Modal */}
            {applyJobModel && (
                <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                    {/* Header Section with Gradient */}

                    {/* Content Section */}
                    {/* Alfa Careers Profile Card */}
                    <div className="group relative border-2 border-gray-200 rounded-2xl bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between">
                        <X
                            onClick={() => setApplyJobModel(false)}
                            className="absolute top-7 right-6 cursor-pointer text-black hover:rotate-90 transition-all duration-300 z-20"
                            size={24}
                        />
                        {/* Edit Button */}
                        <span
                            onClick={() => window.location.href = "/my-profile"}
                            className="absolute top-5 right-15 bg-white hover:bg-blue-50 p-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group/edit"
                        >
                            <Pencil size={16} className="text-blue-600 group-hover/edit:scale-110 transition-transform" />
                        </span>

                        {/* Header */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-md">
                                <User size={24} className="text-white" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-gray-800">
                                    Alfa Careers Profile
                                </h4>
                                <span className="text-xs text-gray-500">Your professional profile</span>
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-2 text-sm text-gray-700 mb-6">

                            {/* Personal Info */}
                            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm space-y-2">
                                <h4 className="text-blue-600 font-semibold mb-2 flex items-center gap-2">
                                    <User size={16} /> Personal Info
                                </h4>

                                <div className="flex items-center gap-2">
                                    <User size={14} className="text-blue-500" />
                                    <span>{userData?.name || "—"}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Phone size={14} className="text-blue-500" />
                                    <span>{userData?.phone || "—"}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <LinkIcon size={14} className="text-blue-500" />
                                    {userData?.portfolio ? (
                                        <a
                                            href={userData.portfolio}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 underline truncate max-w-[180px]"
                                        >
                                            {userData.portfolio}
                                        </a>
                                    ) : (
                                        <span>—</span>
                                    )}
                                </div>
                            </div>

                            {/* Location Info */}
                            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm space-y-2">
                                <h4 className="text-green-600 font-semibold mb-2 flex items-center gap-2">
                                    <MapPin size={16} /> Location
                                </h4>

                                <div className="flex items-center gap-2">
                                    <MapPin size={14} className="text-green-500" />
                                    <span>{userData?.address || "—"}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Globe size={14} className="text-green-500" />
                                    <span>{userData?.city || "—"}, {userData?.country || "—"}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <FileBadge size={14} className="text-green-500" />
                                    <span>Postal: {userData?.postal || "—"}</span>
                                </div>
                            </div>

                            {/* Work & Skills */}
                            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm sm:col-span-2 space-y-2">
                                <h4 className="text-purple-600 font-semibold mb-2 flex items-center gap-2">
                                    <Briefcase size={16} /> Work & Skills
                                </h4>

                                <div className="flex items-center gap-2">
                                    <Briefcase size={14} className="text-purple-500" />
                                    <span>Experience: {userData?.experience || "—"}</span>
                                </div>

                                <div className="flex items-start gap-2">
                                    <FileBadge size={14} className="text-purple-500 mt-[2px]" />
                                    <span className="truncate">
                                        {userData?.skills?.length ? userData.skills.join(", ") : "—"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Apply Button */}
                        <span
                            onClick={applyJob}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold px-4 py-2 rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                        >
                            <Briefcase size={18} />
                            Apply
                        </span>
                        <div className="mt-3 text-center">
                            <span className="text-xs text-black">
                                Your information is secure and will only be shared with the employer
                            </span>
                        </div>
                    </div>

                    {/* Footer Note */}
                </div>
            )}
        </main>
    )
}

export default JobDetails