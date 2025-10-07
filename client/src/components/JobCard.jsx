import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom';

// Lucide React Icons for consistency (replacing mixed imports)
import { Heart, HeartOff, Clock, DollarSign, MapPin, Briefcase, ChevronRight, CheckCircle } from 'lucide-react';

const JobCard = ({ e, setLoginReminder, setToggleApplyJob, setapplJobId }) => {
    const { backendUrl, isLoggedIn, userData, toggleSaveJob, savedJobs } = useContext(AppContext);
    const navigate = useNavigate();
    
    // Check if job is saved or applied
    const isSaved = [...savedJobs].includes(e?._id);
    const isApplied = userData?.appliedJobs?.includes(e?._id);

    // --- Utility Functions ---
    
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
        <li className='p-6 border border-gray-200 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col gap-5'>
            
            {/* 1. Header: Company Info and Save Button */}
            <div className='flex items-start justify-between'>
                <div className='flex items-center gap-4'>
                    {/* Company Logo/Initial */}
                    {e?.companyProfile ? (
                        <img
                            loading='lazy'
                            className="w-14 h-14 rounded-lg object-cover border border-gray-100 flex-shrink-0"
                            src={backendUrl + "/uploads/" + e?.companyProfile}
                            alt={e?.company}
                        />
                    ) : (
                        <div className="w-14 h-14 rounded-lg border border-gray-300 flex items-center justify-center bg-gray-100 text-[var(--primary-color)] font-bold text-xl flex-shrink-0">
                            {e?.company?.slice(0, 1)?.toUpperCase()}
                        </div>
                    )}

                    {/* Company Name & Followers */}
                    <div 
                        onClick={() => navigate(`/company-profile/` + e?.postedBy)}
                        className='cursor-pointer'
                    >
                        <h4 className='font-semibold text-lg text-gray-800 hover:text-[var(--primary-color)] transition-colors'>
                            {e?.company}
                        </h4>
                        <span className='text-xs text-gray-500'>
                            {e?.followers ? `${e.followers} Followers` : `View Company`}
                        </span>
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
            
            {/* 2. Job Title & Salary */}
            <div className='flex flex-col gap-2'>
                {/* Job Title - Bold and Prominent */}
                <h3 className='font-extrabold text-2xl text-[var(--secondary-color)] leading-snug'>
                    {e?.title}
                </h3>

                {/* Salary Badge - Themed */}
                <div className='flex items-center gap-2 w-max px-3 py-1 rounded-full bg-[var(--primary-color)]/10 text-[var(--primary-color)] font-semibold text-sm'>
                    <DollarSign size={16} />
                    <span>{e?.salary}$</span>
                </div>
            </div>

            {/* 3. Job Badges (Attributes) */}
            <div className='flex flex-wrap items-center gap-2 text-xs font-medium'>
                {/* Job Type (Full-time, Part-time, etc.) */}
                <span className='px-3 py-1 rounded-full bg-gray-200 text-gray-700 flex items-center gap-1'>
                    <Briefcase size={14} className='text-gray-500'/> {e?.jobType}
                </span>
                
                {/* Location Type (Remote, On-site) */}
                <span className='px-3 py-1 rounded-full bg-gray-200 text-gray-700 flex items-center gap-1'>
                    <MapPin size={14} className='text-gray-500'/> {e?.locationType}
                </span>
                
                {/* Category/Field */}
                <span className='px-3 py-1 rounded-full bg-[var(--primary-color)]/20 text-[var(--primary-color)]'>
                    {e?.category}
                </span>
            </div>

            {/* 4. Footer: Actions and Timestamp */}
            <div className='flex items-center justify-between pt-3 border-t border-gray-100'>
                
                {/* Action Buttons */}
                <div className='flex gap-3 items-center'>
                    <button
                        disabled={isApplied}
                        onClick={() => {
                            if (isLoggedIn) {
                                setapplJobId(e?._id);
                                setToggleApplyJob(true);
                            } else {
                                setLoginReminder(true);
                            }
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                            isApplied 
                                ? 'bg-green-100 text-green-700 cursor-not-allowed flex items-center gap-1' 
                                : 'bg-[var(--primary-color)] text-white hover:bg-[var(--primary-color)]/90 shadow-md'
                        }`}
                    >
                        {isApplied ? (
                            <>
                                <CheckCircle size={16} /> Applied
                            </>
                        ) : (
                            'Apply Now'
                        )}
                    </button>
                    
                    {/* View Details Link */}
                    <span 
                        onClick={() => navigate(`/jobdetails/` + e?._id)}
                        className='flex gap-1 items-center font-medium text-gray-600 hover:text-[var(--primary-color)] cursor-pointer transition-colors text-sm'
                    >
                        Details <ChevronRight size={15} />
                    </span>
                </div>

                {/* Time Since Posted */}
                <span className='flex text-xs items-center gap-1 text-gray-500'>
                    <Clock size={14} />
                    {timeSince(e?.createdAt)}
                </span>
            </div>
        </li>
    );
}

export default JobCard;