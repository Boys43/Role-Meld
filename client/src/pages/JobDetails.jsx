import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
// React Icons
import { IoHomeOutline, IoWarning } from "react-icons/io5";
import { toast } from 'react-toastify';
import { MdCancel, MdTitle } from "react-icons/md";
import { IoIosWarning } from "react-icons/io";
import { FaDollarSign } from "react-icons/fa";
import { FaAudioDescription } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";
import JobCard from '../components/JobCard';
import Loading from '../components/Loading';
import Img from '../components/Image';
import { Clipboard, ExternalLink, File, Mail, MapPin, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Pencil, FileText, User, Briefcase } from "lucide-react";
import {
    Phone,
    Globe,
    GraduationCap,
    Link as LinkIcon,
    FileBadge,
} from "lucide-react";


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
    const [applyJobModel, setApplyJobModel] = useState(false);
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
                                <span className="text-base font-semibold text-slate-800">
                                    {/* Job Type (formatted nicely, e.g., 'Full time') */}
                                    {jobData?.jobType
                                        ? jobData.jobType
                                            .split("-")
                                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                            .join(" ")
                                        : "N/A"}{" "}

                                    {/* Job Type Specific Details */}
                                    {(() => {
                                        switch (jobData?.jobType) {
                                            case "full-time":
                                                return jobData?.hoursPerWeek ? ` - ${jobData.hoursPerWeek} Hours/Week` : "";
                                            case "part-time":
                                                return jobData?.shift ? ` - ${jobData.shift} Shift` : "";
                                            case "contract":
                                                return jobData?.contractDuration ? ` - ${jobData.contractDuration} Years` : "";
                                            case "internship":
                                                return jobData?.internshipDuration ? ` - ${jobData.internshipDuration}` : "";
                                            case "temporary":
                                                return jobData?.temporaryDuration ? ` - ${jobData.temporaryDuration}` : "";
                                            default:
                                                return "";
                                        }
                                    })()}
                                </span>

                            </div>

                            {/* Location Type Card */}
                            <div className='flex flex-col p-3 bg-gray-50 rounded-md'>
                                <span className='text-xs font-medium text-gray-500 uppercase tracking-wider mb-1'>
                                    Location Type
                                </span>
                                <span className='text-base font-semibold text-slate-800'>
                                    {/* Use 'jobData?.locationType' for the actual data */}
                                    {jobData?.locationType?.split("-").join(" ")[0].toUpperCase() + jobData?.locationType?.split("-").join(" ").slice(1) || 'On-site'}
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
                            <span className='text-sm'>
                                {jobData?.description}
                            </span>
                            {jobData?.benefits?.length > 0 &&
                                <>
                                    <h4 className='text-lg mt-8 font-semibold mb-4'>
                                        Benefits
                                    </h4>
                                    <ul className='list-disc list-inside'>
                                        {jobData?.benefits?.map((ben, index) => (
                                            <li key={index}>
                                                {ben}
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            }
                            <h4 className='text-lg mt-8 font-semibold mb-4'>
                                Skills
                            </h4>
                            <ul className='list-disc flex flex-col gap-2 list-inside'>
                                {jobData?.skills?.map((skill, index) => (
                                    <li className='bg-gray-300 max-w-50 py-1 px-2 rounded-md shadow-md' key={index}>
                                        {skill[0].toUpperCase() + skill.slice(1)}
                                    </li>
                                ))}
                            </ul>
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
                        <div className='flex justify-between w-full py-4'>
                            <span className='flex items-center gap-2 text-red-500 bgrounded-md'>
                                <IoWarning size={20} />
                                {jobData?.applicationDeadline &&
                                    new Date(jobData.applicationDeadline).toLocaleDateString("en-US", {
                                        day: "2-digit",
                                        month: "long"
                                    })
                                }
                            </span>
                            <span className='flex items-center gap-3 py-1 rounded-md'>
                                <Mail /> <span className='font-semibold'>{jobData?.applicants.length} </span> Applicants
                            </span>
                        </div>
                        <div className='p-2 border-2 border-[var(--primary-color)] bg-[var(--primary-color)]/10 flex items-center gap-3 rounded-lg font-medium'>
                            <File className='text-yellow-800' /> Resume: <span className='font-bold'>
                                {jobData?.resumeRequirement === "false" ? "Not Required" : "Required"}
                            </span>
                        </div>
                        <button
                            disabled={userData?.appliedJobs?.includes(jobData?._id)}
                            onClick={() => setApplyJobModel(true)}
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


            {/* Apply Job Modal */}
            {applyJobModel && (
                <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        {/* Header Section with Gradient */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 relative">
                            <X
                                onClick={() => setApplyJobModel(false)}
                                className="absolute top-6 right-6 cursor-pointer text-white/80 hover:text-white hover:rotate-90 transition-all duration-300"
                                size={24}
                            />
                            <h3 className="text-3xl font-bold text-white">
                                Choose Your Application Method
                            </h3>
                        </div>

                        {/* Content Section */}
                        <div className="p-4">
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Alfa Careers Profile Card */}
                                <div className="group relative border-2 border-gray-200 rounded-2xl bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between">
                                    {/* Edit Button */}
                                    <span
                                        onClick={() => window.location.href = "/my-profile"}
                                        className="absolute top-5 right-5 bg-white hover:bg-blue-50 p-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group/edit"
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
                                        onClick={() => console.log("Apply via Alfa Careers")}
                                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold px-4 py-2 rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                                    >
                                        <Briefcase size={18} />
                                        Apply via Profile
                                    </span>
                                </div>

                                {/* CV Upload Card */}
                                <div className="group relative border-2 border-gray-200 rounded-2xl bg-gradient-to-br from-green-50 to-white p-6 shadow-sm hover:shadow-xl hover:border-green-300 transition-all duration-300 flex flex-col justify-between">
                                    {/* Edit Button */}
                                    <span
                                        onClick={() => console.log("Upload new CV")}
                                        className="absolute top-5 right-5 bg-white hover:bg-green-50 p-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group/edit"
                                    >
                                        <Pencil size={16} className="text-green-600 group-hover/edit:scale-110 transition-transform" />
                                    </span>

                                    {/* Header */}
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-md">
                                            <FileText size={24} className="text-white" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-gray-800">
                                                Upload CV/Resume
                                            </h4>
                                            <span className="text-xs text-gray-500">Your latest document</span>
                                        </div>
                                    </div>

                                    {/* CV Preview */}
                                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-green-300 rounded-xl p-4 bg-white/50 mb-6 hover:bg-white transition-all duration-300">
                                        <span className="text-sm font-semibold text-gray-800">resume_nouman.pdf</span>
                                        <span className="text-xs text-gray-500 mt-1">Last updated 3 days ago</span>
                                        <div className="mt-3 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                            Ready to apply
                                        </div>
                                    </div>

                                    {/* Apply Button */}
                                    <span
                                        onClick={() => console.log("Apply via CV")}
                                        className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold px-4 py-2 rounded-xl hover:from-green-700 hover:to-green-800 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                                    >
                                        <FileText size={18} />
                                        Apply with CV
                                    </span>
                                </div>
                            </div>

                            {/* Footer Note */}
                            <div className="mt-3 text-center">
                                <span className="text-xs text-gray-500">
                                    Your information is secure and will only be shared with the employer
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}

export default JobDetails