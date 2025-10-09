import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useLocation, useNavigate } from 'react-router-dom';

// Lucide React Icons for consistency (replacing mixed imports)
import { Heart, Clock, MapPin } from 'lucide-react';
import { FaPaperPlane } from 'react-icons/fa';
import Img from './Image';
import Currency from './CurrencyCovertor';

const JobCard = ({ e }) => {
    const { backendUrl, isLoggedIn, toggleSaveJob, savedJobs } = useContext(AppContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Check if job is saved or applied
    const isSaved = [...savedJobs].includes(e?._id);

    // Function to calculate relative time (kept from original)
    const timeSince = (createdAt) => {
        if (!createdAt) return "Unknown";
        const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
        const diff = (new Date() - new Date(createdAt)) / 1000; // in seconds

        if (diff < 60) return rtf.format(-Math.floor(diff), "second");
        if (diff < 3600) return rtf.format(-Math.floor(diff / 60), "minute");
        if (diff < 86400) return rtf.format(-Math.floor(diff / 3600), "hour");
        if (diff < 2592000) return rtf.format(-Math.floor(diff / 86400), "day");
        if (diff < 31536000) return rtf.format(-Math.floor(diff / 2592000), "month");
        return rtf.format(-Math.floor(diff / 31536000), "year");
    };

    // --- Main Render ---

    return (
        <li className='p-6 cursor-pointer border border-gray-200 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between gap-4'

        >
            <div className='flex flex-col gap-4'>
                {/* 1. Header: Company Info and Save Button */}
                <div className='flex items-start justify-between'>
                    <div className='flex items-center gap-4'>
                        {/* Company Logo/Initial */}
                        {e?.companyProfile ? (
                            <Img
                                style="w-14 h-14 rounded-lg object-cover border border-gray-100 flex-shrink-0"
                                src={backendUrl + "/uploads/" + e?.companyProfile}
                            />
                        ) : (
                            <div className="w-14 h-14 rounded-lg border border-gray-300 flex items-center justify-center bg-gray-100 text-[var(--primary-color)] font-bold text-xl flex-shrink-0">
                                {e?.company?.slice(0, 1)?.toUpperCase()}
                            </div>
                        )}

                        {/* Company Name & Followers */}
                        <div>
                            <h4 className='font-semibold text-lg text-gray-800'>
                                {e?.company}
                            </h4>
                            <span className='text-xs text-gray-500'>
                                {e?.followers ? `${e.followers} Followers` : `View Company`}
                            </span >
                        </div>
                    </div>

                    {/* Save Button (Absolute positioning removed for cleaner flow) */}
                    <span
                        onClick={() => toggleSaveJob(e?._id)}
                        className={`p-2 rounded-full transition-all duration-200 flex-shrink-0
                        ${isSaved
                                ? 'bg-[var(--primary-color)] text-white hover:bg-[var(--primary-color)]/90 shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:text-[var(--primary-color)] hover:bg-gray-200'
                            }`}
                        aria-label={isSaved ? "Unsave job" : "Save job"}
                        disabled={!isLoggedIn}
                    >
                        {isSaved ? <Heart size={20} fill='white' /> : <Heart size={20} />}
                    </span>
                </div>
                <div onClick={() => navigate('/jobDetails/' + e._id)}>
                    <div className='w-full flex justify-between items-center gap-4'>
                        <span className='text-xs'>
                            {e?.category} / {e?.subCategory}
                        </span>
                        {e?.locationType !== "remote" && <span className='text-xs flex items-center gap-1'>
                            <MapPin size={15} /> {e?.location}
                        </span>}
                    </div>

                    {/* 2. Job Title & Salary */}
                    <div className='flex flex-col gap-2'>
                        {/* Job Title - Bold and Prominent */}
                        <h4 className='mt-2 line-clamp-1 font-bold text-[var(--secondary-color)] leading-snug'>
                            {e?.title}
                        </h4>

                        {/* Salary Badge - Themed */}
                        <div className='flex items-center gap-2  font-semibold text-xs'>
                            {/* <DollarSign size={14} /> */}
                            <span className='w-max px-3 py-1 rounded-md bg-[var(--primary-color)]/10  text-[var(--primary-color)]'>

                                {e?.salaryType === "fixed" ? <span>
                                    <Currency amount={e?.fixedSalary} from={e?.jobsCurrency} />
                                </span> : <span>
                                    
                                    <Currency amount={e?.minSalary} from={e?.jobsCurrency} /> - <Currency amount={e?.maxSalary} from={e?.jobsCurrency} /></span>}
                            </span>
                            <span className='flex w-max px-3 py-1 rounded-md bg-[var(--primary-color)]/10  text-[var(--primary-color)]'>
                                {e?.jobType}
                            </span>
                        </div>
                    </div>


                    {/* 4. Footer: Actions and Timestamp */}
                    <div className='flex items-center justify-between pt-3 border-t border-gray-100'>

                        {/* Action Buttons */}
                        {location.pathname !== "/dashboard" && <div className='flex gap-3 items-center'>
                            <span className='text-sm flex items-center gap-3'>
                                <FaPaperPlane className='text-[var(--primary-color)]' />
                                {e?.applicationMethod[0]?.toUpperCase() + e?.applicationMethod?.substring(1) || "Apply"}
                            </span>
                        </div>}

                        {/* Time Since Posted */}
                        <span className='flex text-xs items-center gap-1 text-gray-500'>
                            <Clock size={14} />
                            {timeSince(e?.createdAt)}
                        </span>
                    </div>
                </div>
            </div>
        </li>
    );
}

export default JobCard;