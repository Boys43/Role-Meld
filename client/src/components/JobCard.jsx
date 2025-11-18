import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useLocation, useNavigate } from 'react-router-dom';

// Lucide React Icons for consistency (replacing mixed imports)
import { Heart, Clock, MapPin } from 'lucide-react';
import { FaPaperPlane } from 'react-icons/fa';
import Img from './Image';
import Currency from './CurrencyCovertor';

const JobCard = ({ e, className }) => {
    const { isLoggedIn, toggleSaveJob, savedJobs } = useContext(AppContext);
    const navigate = useNavigate();
    const location = useLocation()

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
        <li
            className={`
    p-6 cursor-pointer border border-gray-200 bg-white rounded-2xl hover:shadow-lg shadow-black/5 
    transition-all duration-300 flex flex-col justify-between gap-4 
    min-w-full sm:min-w-[250px] md:min-w-[300px] 
    ${e?.sponsored ? 'border-2 border-yellow-300' : ''}
  `}
            onClick={() => {
                if (location.pathname !== '/find-jobs') navigate('/jobDetails/' + e._id)
            }}
        >
            <div className='flex flex-col gap-4'>
                {/* 1. Header: Company Info and Save Button */}
                <div className='flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-0'>
                    <div className='flex items-center gap-4'>
                        {e?.companyProfile ? (
                            <Img
                                style='w-14 h-14 rounded-full object-cover border border-gray-100 flex-shrink-0'
                                src={e?.companyProfile}
                            />
                        ) : (
                            <div
                                className='w-14 h-14 rounded-full border border-gray-300 flex items-center justify-center bg-gray-100 text-[var(--primary-color)] font-bold text-xl flex-shrink-0'
                                onClick={(ev) => {
                                    ev.stopPropagation()
                                    navigate('/company-profile/' + e?.postedBy)
                                }}
                            >
                                {e?.company?.slice(0, 1)?.toUpperCase()}
                            </div>
                        )}

                        {/* Company Name & Category */}
                        <div className='flex flex-col'>
                            <h4 className='font-semibold text-lg text-gray-800 line-clamp-1'>
                                {e?.title || '...'}
                            </h4>
                            <span className='text-md text-gray-500 line-clamp-1'>
                                by <span className='font-semibold'>{e?.company || '...'}</span> in{' '}
                                <span className='font-semibold text-[var(--primary-color)]'>{e?.category || '...'}</span>
                            </span>
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={(event) => {
                            event.stopPropagation()
                            toggleSaveJob(e?._id)
                        }}
                        className={`p-2 rounded-full transition-all duration-200 flex-shrink-0
          ${isSaved
                                ? 'bg-[var(--primary-color)] text-white hover:bg-[var(--primary-color)]/90 shadow-md'
                                : 'text-gray-600 hover:text-[var(--primary-color)] hover:bg-gray-200'
                            }`}
                        aria-label={isSaved ? 'Unsave job' : 'Save job'}
                        disabled={!isLoggedIn}
                    >
                        {isSaved ? <Heart size={24} fill='white' /> : <Heart size={24} />}
                    </button>
                </div>

                {/* 2. Job Info */}
                <div className='flex flex-col gap-2 mt-2'>
                    <div className='flex flex-wrap items-center gap-2 font-semibold text-xs'>
                        <span className='flex px-3 py-1 rounded-full bg-[#e9e0f2] text-[#6c4cbe]'>
                            {e?.jobType?.replace('-', ' ') || 'N/A'}
                        </span>
                        <span className='flex gap-1 items-center px-3 py-1 rounded-full bg-[var(--accent-color)] text-[var(--primary-color)]'>
                            <MapPin size={14} /> {e?.location || 'Remote'}
                        </span>
                        <span className='w-max px-3 py-1 rounded-full bg-[var(--primary-color)]/10 text-[var(--primary-color)]'>
                            {e?.salaryType === 'fixed' ? (
                                <Currency amount={e?.fixedSalary} from={e?.jobsCurrency} />
                            ) : (
                                <>
                                    <Currency amount={e?.minSalary} from={e?.jobsCurrency} /> -{' '}
                                    <Currency amount={e?.maxSalary} from={e?.jobsCurrency} />
                                </>
                            )}
                        </span>
                    </div>
                </div>

                {/* 3. Footer */}
                <div className='flex flex-col sm:flex-row sm:items-center justify-between mt-4 pt-3 gap-2 sm:gap-0'>
                    <span>
                        {(() => {
                            const d = new Date(e?.applicationDeadline)
                            const diff = Math.ceil((d - new Date()) / (1000 * 60 * 60 * 24))
                            return diff > 0 ? (
                                <div>
                                    <span className='font-semibold text-[var(--primary-color)]'>{diff} </span> days left to apply
                                </div>
                            ) : (
                                'Deadline passed'
                            )
                        })()}
                    </span>
                </div>
            </div>
        </li>
    );
}

export default JobCard;