import React, { useContext, useState } from 'react'
import { Briefcase, X, ExternalLink, Mail, Phone as PhoneIcon, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Pencil } from 'lucide-react'
import { User } from 'lucide-react'
import { Phone } from 'lucide-react'
import { LinkIcon } from 'lucide-react'
import { MapPin } from 'lucide-react'
import { Globe } from 'lucide-react'
import { FileBadge } from 'lucide-react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const ApplyJobPortal = ({ applyJobModel, setApplyJobModel, id, jobData, getJob }) => {
    const navigate = useNavigate();
    const { userData, backendUrl } = useContext(AppContext);
    const [applying, setApplying] = useState(false);

    // Check if profile is complete for internal applications
    const isProfileComplete = () => {
        if (!userData) return false;

        // Required fields
        const hasRequiredFields = userData.name && userData.email && userData.phone;

        // Check if user has resume (if resume field exists in userData)
        const hasResume = userData.resume; // This should be a PDF file path/URL

        return hasRequiredFields && hasResume;
    };

    const handleApply = async () => {
        const applyType = jobData?.jobApplyType;

        // Handle different application methods
        switch (applyType) {
            case 'External':
                // Redirect to external URL
                if (jobData?.externalUrl) {
                    window.open(jobData.externalUrl, '_blank');
                    setApplyJobModel(false);
                } else {
                    toast.error('External application URL not available');
                }
                break;

            case 'Email':
                // Open email client with pre-filled data
                if (jobData?.userEmail) {
                    const subject = encodeURIComponent(`Application for ${jobData.title} at ${jobData.company}`);
                    const body = encodeURIComponent(`Dear Hiring Manager,\n\nI am writing to express my interest in the ${jobData.title} position at ${jobData.company}.\n\nPlease find my details below:\nName: ${userData?.name}\nEmail: ${userData?.email}\nPhone: ${userData?.phone}\nExperience: ${userData?.experience || 'N/A'}\n\nBest regards,\n${userData?.name}`);

                    window.location.href = `mailto:${jobData.userEmail}?subject=${subject}&body=${body}`;
                    setApplyJobModel(false);
                } else {
                    toast.error('Email address not available');
                }
                break;

            case 'Call':
                // Open phone dialer
                if (jobData?.callNumber) {
                    window.location.href = `tel:${jobData.callNumber}`;
                    setApplyJobModel(false);
                } else {
                    toast.error('Phone number not available');
                }
                break;

            case 'Internal':
            default:
                // Internal application - submit via backend
                if (!isProfileComplete()) {
                    toast.error('Please complete your profile and upload your resume before applying');
                    navigate('/my-profile');
                    setApplyJobModel(false);
                    return;
                }

                setApplying(true);
                try {
                    const { data } = await axios.post(backendUrl + '/api/user/applyjob', {
                        jobId: id,
                        // Optional: send CV if available
                        cv: userData?.cv || null
                    });

                    if (data.success) {
                        toast.success(data.message);
                        setApplyJobModel(false);
                        if (getJob) getJob();
                    } else {
                        toast.error(data.message);
                    }
                } catch (error) {
                    toast.error(error.response?.data?.message || 'Application failed');
                } finally {
                    setApplying(false);
                }
                break;
        }
    };

    // Get button text and icon based on application type
    const getApplyButtonContent = () => {
        const applyType = jobData?.jobApplyType;

        switch (applyType) {
            case 'External':
                return { text: 'Apply on External Site', icon: <ExternalLink size={18} /> };
            case 'Email':
                return { text: 'Apply via Email', icon: <Mail size={18} /> };
            case 'Call':
                return { text: 'Call to Apply', icon: <PhoneIcon size={18} /> };
            case 'Internal':
            default:
                return { text: 'Submit Application', icon: <Briefcase size={18} /> };
        }
    };

    const buttonContent = getApplyButtonContent();
    const showProfileWarning = jobData?.jobApplyType === 'Internal' && !isProfileComplete();

    console.log(jobData)

    return (<>
        {applyJobModel && (
            <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xs flex items-center justify-center z-999 p-4">
                {/* Alfa Careers Profile Card */}
                <div className="group relative border-2 border-gray-200 rounded-2xl bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between max-w-2xl w-full">
                    <X
                        onClick={() => setApplyJobModel(false)}
                        className="absolute top-7 right-6 cursor-pointer text-black hover:rotate-90 transition-all duration-300 z-20"
                        size={24}
                    />
                    {/* Edit Button */}
                    <span
                        onClick={() => navigate("/my-profile")}
                        className="absolute top-5 right-15 bg-white hover:bg-blue-50 p-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group/edit cursor-pointer"
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
                                {jobData?.jobApplyType === 'Internal' ? 'Alfa Careers Profile' : 'Application Method'}
                            </h4>
                            <span className="text-xs text-gray-500">
                                {jobData?.jobApplyType === 'Internal'
                                    ? 'Your professional profile'
                                    : `Apply via ${jobData?.jobApplyType}`}
                            </span>
                        </div>
                    </div>

                    {/* Show profile details only for Internal applications */}
                    {jobData?.jobApplyType === 'Internal' && (
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
                                <h4 className="text-[var(--primary-color)] font-semibold mb-2 flex items-center gap-2">
                                    <MapPin size={16} /> Location
                                </h4>

                                <div className="flex items-center gap-2">
                                    <MapPin size={14} className="text-[var(--primary-color)]" />
                                    <span>{userData?.address || "—"}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Globe size={14} className="text-[var(--primary-color)]" />
                                    <span>{userData?.city || "—"}, {userData?.country || "—"}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <FileBadge size={14} className="text-[var(--primary-color)]" />
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

                                <div className="flex items-center gap-2">
                                    <FileBadge size={14} className="text-purple-500" />
                                    <span>Resume: {userData?.resume ? '✓ Uploaded' : '✗ Not uploaded'}</span>
                                </div>

                                {userData?.cv && (
                                    <div className="flex items-center gap-2">
                                        <FileBadge size={14} className="text-purple-500" />
                                        <span>CV: ✓ Uploaded (Optional)</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Warning for incomplete profile */}
                    {showProfileWarning && (
                        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                            <AlertCircle size={18} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-yellow-800">
                                <p className="font-semibold">Profile Incomplete</p>
                                <p>Please complete your profile and upload your resume (PDF) to apply for this job.</p>
                            </div>
                        </div>
                    )}

                    {/* Apply Button */}
                    <button
                        onClick={handleApply}
                        disabled={applying || showProfileWarning}
                        className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold px-4 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm ${(applying || showProfileWarning) ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        {buttonContent.icon}
                        {applying ? 'Applying...' : buttonContent.text}
                    </button>

                    <div className="mt-3 text-center">
                        <span className="text-xs text-black">
                            {jobData?.jobApplyType === 'Internal'
                                ? 'Your information is secure and will only be shared with the employer'
                                : jobData?.jobApplyType === 'Email'
                                    ? 'Your email client will open with pre-filled application details'
                                    : jobData?.jobApplyType === 'Call'
                                        ? 'Click to call the employer directly'
                                        : 'You will be redirected to the external application page'}
                        </span>
                    </div>
                </div>
            </div>
        )}
    </>
    )
}

export default ApplyJobPortal