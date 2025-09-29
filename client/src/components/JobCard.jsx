import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom';

// React Icons
import { IoMdHeart } from "react-icons/io";
import { CiHeart } from "react-icons/ci";
import { FaChevronRight } from "react-icons/fa";
import assets from '../assets/assets';
import { FaDollarSign } from "react-icons/fa";
import { FaClock } from "react-icons/fa";

const JobCard = ({ e, setLoginReminder, setToggleApplyJob, setapplJobId }) => {
    const { backendUrl, isLoggedIn, userData, toggleSaveJob, savedJobs } = useContext(AppContext);

    const navigate = useNavigate();

    return (
        <>
            <li className='p-4 border relative border-gray-300 rounded-lg hover:shadow-md transition-shadow flex flex-col gap-4 cursor-pointer'>
                {/* Company Info */}
                <div className='flex items-center gap-3'>
                    {e?.companyProfile ? (
                        <>
                            <img
                                className="w-12  h-12 rounded-xl object-cover border border-gray-300"
                                src={backendUrl + "/uploads/" + e?.companyProfile}
                                alt={e?.company}
                            />
                        </>
                    ) : (
                        <div className="w-12 h-12 rounded-xl border border-gray-300 flex items-center justify-center bg-gray-100 text-gray-700 font-bold">
                            {e?.company?.slice(0, 1)?.toUpperCase()}
                        </div>
                    )}

                    <div>
                        <h4 className='font-semibold text-lg text-gray-800'>{e?.company}</h4>
                        <span className='text-xs'>Net Followers</span>
                    </div>
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
                <div className='text-gray-600 font-medium px-2 rounded border border-gray-300 bg-gray-200 flex items-center gap-3 w-max'>
                    <FaDollarSign className='text-[var(--primary-color)]' /> {e?.salary}$
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
                    className='text-[var(--primary-color)] text-sm mt-2 cursor-pointer absolute top-3 right-3 p-2 border border-gray-300 rounded-lg'>
                    <span>
                        {[...savedJobs].includes(e?._id) ? <IoMdHeart size={20} /> : <CiHeart size={20} />}
                    </span>
                </span>
                <span className='flex text-sm self-end items-center gap-2 '>
                    <FaClock className='text-gray-400' size={15}/>
                    {e?.createdAt ? (() => {
                        const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
                        const diff = (new Date() - new Date(e?.createdAt)) / 1000; // in seconds

                        if (diff < 60) return rtf.format(-Math.floor(diff), "second");
                        if (diff < 3600) return rtf.format(-Math.floor(diff / 60), "minute");
                        if (diff < 86400) return rtf.format(-Math.floor(diff / 3600), "hour");
                        if (diff < 2592000) return rtf.format(-Math.floor(diff / 86400), "day");
                        if (diff < 31536000) return rtf.format(-Math.floor(diff / 2592000), "month");
                        return rtf.format(-Math.floor(diff / 31536000), "year");
                    })() : "Unknown"}
                </span>
            </li>


        </>
    )
}

export default JobCard
