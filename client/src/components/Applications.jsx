import React from 'react'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios';
import { useState, useEffect } from 'react';
import { IoLocationSharp, IoMail, IoSettings, IoPerson, IoSearch, IoFilter, IoCheckmarkCircle, IoCloseCircle, IoEye, IoDocument, IoCall, IoTime, IoCalendar, IoStar, IoSchool, IoBriefcase } from "react-icons/io5";
import { IoIosDownload, IoIosCheckmarkCircle } from "react-icons/io";
import { ImCancelCircle } from "react-icons/im";
import { toast } from 'react-toastify';
import Loading from './Loading';
import NotFound404 from './NotFound404';

const Applications = () => {
    const { backendUrl } = useContext(AppContext);
    const [loading, setLoading] = useState(false)
    const [Applications, setApplications] = useState([]);
    const fetchJobs = async () => {
        setLoading(true)
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/fetchapplicants`);
            if (data.success) {
                setApplications(data.applicants);
            } else {
                setApplications([])
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const updateStatus = async (applicationId, status) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/applications/update-status`, { applicationId, status })
            if (data.success) {
                setApplications((prev) =>
                    prev.map((a) =>
                        a._id === applicationId ? { ...a, status } : a
                    )
                );

                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        (async () => {
            await fetchJobs();
        })();
    }, [])

    const [filter, setFilter] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedApplication, setSelectedApplication] = useState(null)
    const [selectedApplications, setSelectedApplications] = useState([])
    const [feedback, setFeedback] = useState('')

    const filteredApplications = Applications.filter((application) => {
        const matchesFilter = filter === 'all' ? true : application.status === filter;
        const matchesSearch = searchTerm === '' ? true : 
            application.applicant?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            application.applicant?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            application.job?.title?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    })

    const handleBulkAction = async (action) => {
        if (selectedApplications.length === 0) {
            toast.error('Please select applications first');
            return;
        }

        try {
            const promises = selectedApplications.map(id => 
                axios.post(`${backendUrl}/api/applications/update-status`, { applicationId: id, status: action })
            );
            await Promise.all(promises);
            
            setApplications(prev => 
                prev.map(app => 
                    selectedApplications.includes(app._id) ? { ...app, status: action } : app
                )
            );
            
            setSelectedApplications([]);
            toast.success(`${selectedApplications.length} applications ${action} successfully`);
        } catch (error) {
            toast.error('Error updating applications');
        }
    };

    const toggleSelectApplication = (id) => {
        setSelectedApplications(prev => 
            prev.includes(id) ? prev.filter(appId => appId !== id) : [...prev, id]
        );
    };

    const selectAllApplications = () => {
        if (selectedApplications.length === filteredApplications.length) {
            setSelectedApplications([]);
        } else {
            setSelectedApplications(filteredApplications.map(app => app._id));
        }
    };

    return (
        <div className='flex w-full min-h-screen'>
            {/* Main Content - Three Panel Layout */}
            <div className='flex w-full h-full'>
                {/* Left Sidebar - Applicant List */}
                <div className='w-1/4 bg-white border-r border-[var(--primary-color)]/20 flex flex-col shadow-lg'>
                    {/* Search and Filters */}
                    <div className='p-3 border-b border-[var(--primary-color)]/10'>
                        <div className='relative mb-6'>
                            <IoSearch className='absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--primary-color)]' />
                            <input
                                type="text"
                                placeholder="Search by name, email, or job title..."
                                className='w-full pl-12 pr-4 py-3 border-2 border-[var(--primary-color)]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all duration-300 bg-white shadow-sm'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        {/* Status Filters */}
                        <div className='flex flex-wrap gap-3 mb-6'>
                            {[
                                { key: 'all', label: 'All', color: 'bg-[var(--secondary-color)]' },
                                { key: 'pending', label: 'Pending', color: 'bg-yellow-500' },
                                { key: 'hired', label: 'Hired', color: 'bg-green-500' },
                                { key: 'rejected', label: 'Rejected', color: 'bg-red-500' }
                            ].map((status) => (
                                <span
                                    key={status.key}
                                    onClick={() => setFilter(status.key)}
                                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md transform hover:scale-105 ${
                                        filter === status.key 
                                            ? `${status.color} text-white shadow-lg` 
                                            : 'bg-white text-[var(--text-color)] border-2 border-[var(--primary-color)]/20 hover:border-[var(--primary-color)]/40'
                                    }`}
                                >
                                    {status.label} 
                                    <span className='ml-1 px-2 py-0.5 rounded-full bg-white/20 text-xs'>
                                        {Applications.filter(app => status.key === 'all' || app.status === status.key).length}
                                    </span>
                                </span>
                            ))}
                        </div>

                        {/* Bulk Actions */}
                        {selectedApplications.length > 0 && (
                            <div className='flex gap-3 mb-4 p-4 bg-[var(--primary-color)]/5 rounded-xl border border-[var(--primary-color)]/20'>
                                <span
                                    onClick={() => handleBulkAction('hired')}
                                    className='flex-1 bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-600 transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2'
                                >
                                    <IoCheckmarkCircle />
                                    Approve ({selectedApplications.length})
                                </span>
                                <span
                                    onClick={() => handleBulkAction('rejected')}
                                    className='flex-1 bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-600 transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2'
                                >
                                    <IoCloseCircle />
                                    Reject ({selectedApplications.length})
                                </span>
                            </div>
                        )}

                        <span
                            onClick={selectAllApplications}
                            className='w-full text-sm text-[var(--primary-color)] hover:text-[var(--secondary-color)] font-semibold cursor-pointer transition-colors duration-300 text-center py-2 px-4 rounded-lg hover:bg-[var(--primary-color)]/10'
                        >
                            {selectedApplications.length === filteredApplications.length ? '✓ Deselect All' : '☐ Select All'}
                        </span>
                    </div>

                    {/* Applicant List */}
                    <div className='flex-1 overflow-y-auto'>
                        {loading ? (
                            <div className='p-4'><Loading /></div>
                        ) : filteredApplications.length === 0 ? (
                            <div className='p-4 text-center text-gray-500'>No applications found</div>
                        ) : (
                            filteredApplications.map((app) => (
                                <div
                                    key={app._id}
                                    onClick={() => setSelectedApplication(app)}
                                    className={`p-5 border-b border-[var(--primary-color)]/10 cursor-pointer hover:bg-[var(--accent-color)]/50 transition-all duration-300 ${
                                        selectedApplication?._id === app._id ? 'bg-[var(--primary-color)]/10 border-l-4 border-l-[var(--primary-color)] shadow-md' : ''
                                    }`}
                                >
                                    <div className='flex items-start gap-4'>
                                        <input
                                            type="checkbox"
                                            checked={selectedApplications.includes(app._id)}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                toggleSelectApplication(app._id);
                                            }}
                                            className='mt-1 w-4 h-4 text-[var(--primary-color)] border-2 border-[var(--primary-color)]/30 rounded focus:ring-[var(--primary-color)] focus:ring-2'
                                        />
                                        <div className='flex-1 min-w-0'>
                                            <div className='flex items-center gap-3 mb-2'>
                                                <h4 className='font-semibold text-sm text-[var(--secondary-color)] truncate'>{app.applicant?.name}</h4>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    app.status === 'hired' ? 'bg-green-100 text-green-700 border border-green-200' :
                                                    app.status === 'rejected' ? 'bg-red-100 text-red-700 border border-red-200' :
                                                    'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                                }`}>
                                                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                                </span>
                                            </div>
                                            <span className='block text-sm text-[var(--text-color)] font-medium truncate mb-1'>{app.job?.title}</span>
                                            <span className='block text-xs text-[var(--text-color)]/70 truncate mb-2'>{app.applicant?.email}</span>
                                            <div className='flex items-center gap-2'>
                                                <IoTime className='text-xs text-[var(--primary-color)]' />
                                                <span className='text-xs text-[var(--text-color)]/60 font-medium'>
                                                    {new Date(app.appliedAt || app.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Center Panel - Application Preview */}
                <div className='flex-1 bg-white flex flex-col shadow-lg'>
                    {selectedApplication ? (
                        <>
                            {/* Application Header */}
                            <div className='p-4 border-b border-[var(--primary-color)]/10 '>
                                <div className='flex items-start justify-between'>
                                    <div>
                                        <h3 className='text-2xl font-bold text-[var(--secondary-color)] mb-3'>
                                            {selectedApplication.applicant?.name}
                                        </h3>
                                        <span className='block text-lg text-[var(--text-color)] font-semibold mb-3'>Applied for: {selectedApplication.job?.title}</span>
                                        <div className='flex items-center gap-3 text-sm text-[var(--text-color)]'>
                                            <span className='flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm'>
                                                <IoCalendar className='text-[var(--primary-color)]' />
                                                Applied: {new Date(selectedApplication.appliedAt || selectedApplication.createdAt).toLocaleDateString()}
                                            </span>
                                            <span className='flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm'>
                                                <IoLocationSharp className='text-[var(--primary-color)]' />
                                                {selectedApplication.job?.location}
                                            </span>
                                        </div>
                                    </div>
                                    <span className={`px-4 py-2 rounded-xl text-sm font-semibold shadow-md ${
                                        selectedApplication.status === 'hired' ? 'bg-green-500 text-white' :
                                        selectedApplication.status === 'rejected' ? 'bg-red-500 text-white' :
                                        'bg-yellow-500 text-white'
                                    }`}>
                                        {selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}
                                    </span>
                                </div>
                            </div>

                            {/* Application Content */}
                            <div className='flex-1 overflow-y-auto p-8 bg-[var(--accent-color)]/30'>
                                {/* Resume Section */}
                                <div className='mb-8'>
                                    <h4 className='flex items-center gap-3 text-xl font-bold text-[var(--secondary-color)] mb-4'>
                                        <div className='p-2 bg-[var(--primary-color)]/10 rounded-xl'>
                                            <IoDocument className='text-[var(--primary-color)] text-lg' />
                                        </div>
                                        Resume & Documents
                                    </h4>
                                    <div className='bg-white p-3 rounded-xl shadow-md border border-[var(--primary-color)]/10'>
                                        {selectedApplication.resume ? (
                                            <a
                                                href={selectedApplication.resume}
                                                download={selectedApplication.resume}
                                                className='flex items-center gap-3 text-[var(--primary-color)] hover:text-[var(--secondary-color)] font-semibold transition-colors duration-300 bg-[var(--primary-color)]/5 p-4 rounded-lg hover:bg-[var(--primary-color)]/10'
                                            >
                                                <IoIosDownload className='text-xl' />
                                                Download Resume ({selectedApplication.resume})
                                            </a>
                                        ) : (
                                            <span className='text-[var(--text-color)]/60 italic'>No resume uploaded</span>
                                        )}
                                    </div>
                                </div>

                                {/* Cover Letter Section */}
                                <div className='mb-8'>
                                    <h4 className='flex items-center gap-3 text-xl font-bold text-[var(--secondary-color)] mb-4'>
                                        <div className='p-2 bg-green-100 rounded-xl'>
                                            <IoMail className='text-green-600 text-lg' />
                                        </div>
                                        Cover Letter
                                    </h4>
                                    <div className='bg-white p-3 rounded-xl shadow-md border border-[var(--primary-color)]/10'>
                                        <span className='text-[var(--text-color)] leading-relaxed'>
                                            {selectedApplication.coverLetter || 'No cover letter provided'}
                                        </span>
                                    </div>
                                </div>

                                {/* Job Details */}
                                <div className='mb-8'>
                                    <h4 className='flex items-center gap-3 text-xl font-bold text-[var(--secondary-color)] mb-4'>
                                        <div className='p-2 bg-orange-100 rounded-xl'>
                                            <IoBriefcase className='text-orange-600 text-lg' />
                                        </div>
                                        Job Details
                                    </h4>
                                    <div className='bg-white p-3 rounded-xl shadow-md border border-[var(--primary-color)]/10'>
                                        <h5 className='font-bold text-lg text-[var(--secondary-color)] mb-4'>{selectedApplication.job?.title}</h5>
                                        <div 
                                            className='text-sm text-[var(--text-color)] mb-4 leading-relaxed'
                                            dangerouslySetInnerHTML={{
                                                __html: selectedApplication.job?.description?.replace(/<[^>]+>/g, "")
                                            }}
                                        />
                                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                            <div className='bg-[var(--accent-color)]/50 p-3 rounded-lg'>
                                                <span className='text-sm font-semibold text-[var(--secondary-color)]'>Category:</span>
                                                <span className='block text-sm text-[var(--text-color)]'>{selectedApplication.job?.category}</span>
                                            </div>
                                            <div className='bg-[var(--accent-color)]/50 p-3 rounded-lg'>
                                                <span className='text-sm font-semibold text-[var(--secondary-color)]'>Type:</span>
                                                <span className='block text-sm text-[var(--text-color)]'>{selectedApplication.job?.jobType}</span>
                                            </div>
                                            <div className='bg-[var(--accent-color)]/50 p-3 rounded-lg'>
                                                <span className='text-sm font-semibold text-[var(--secondary-color)]'>Salary:</span>
                                                <span className='block text-sm text-[var(--text-color)]'>${selectedApplication.job?.minSalary} - ${selectedApplication.job?.maxSalary}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className='flex-1 flex items-center justify-center text-[var(--text-color)]/60'>
                            <div className='text-center p-8'>
                                <div className='p-3 bg-[var(--accent-color)] rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6'>
                                    <IoEye className='text-4xl text-[var(--primary-color)]' />
                                </div>
                                <span className='text-xl font-semibold text-[var(--secondary-color)]'>Select an application to view details</span>
                                <span className='block text-sm text-[var(--text-color)]/60 mt-2'>Choose an applicant from the left panel to see their complete profile</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Sidebar - Actions and Details */}
                <div className='w-80 bg-white border-l border-[var(--primary-color)]/20 flex flex-col shadow-lg'>
                    {selectedApplication ? (
                        <>
                            {/* Contact Information */}
                            <div className='p-3 border-b border-[var(--primary-color)]/10'>
                                <h4 className='font-bold mb-4 flex items-center gap-3 text-[var(--secondary-color)]'>
                                    <div className='p-2 bg-[var(--primary-color)]/10 rounded-lg'>
                                        <IoCall className='text-[var(--primary-color)]' />
                                    </div>
                                    Contact Information
                                </h4>
                                <div className='space-y-3'>
                                    <div className='flex items-center gap-3 text-sm bg-white p-3 rounded-lg shadow-sm'>
                                        <IoMail className='text-[var(--primary-color)]' />
                                        <span className='text-[var(--text-color)] font-medium'>{selectedApplication.applicant?.email}</span>
                                    </div>
                                    <div className='flex items-center gap-3 text-sm bg-white p-3 rounded-lg shadow-sm'>
                                        <IoCall className='text-[var(--primary-color)]' />
                                        <span className='text-[var(--text-color)] font-medium'>
                                            {selectedApplication.applicant?.phone || 'Not provided'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Application Status */}
                            <div className='p-3 border-b border-[var(--primary-color)]/10'>
                                <h4 className='font-bold mb-4 text-[var(--secondary-color)]'>Application Status</h4>
                                <select
                                    value={selectedApplication.status}
                                    onChange={(e) => updateStatus(selectedApplication._id, e.target.value)}
                                    className='w-full p-3 border-2 border-[var(--primary-color)]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all duration-300 bg-white shadow-sm font-medium text-[var(--text-color)]'
                                >
                                    <option value="pending">Pending Review</option>
                                    <option value="shortlisted">Shortlisted</option>
                                    <option value="interviewing">Interviewing</option>
                                    <option value="hired">Hired</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>

                            {/* Action Buttons */}
                            <div className='p-3 border-b border-[var(--primary-color)]/10'>
                                <h4 className='font-bold mb-4 text-[var(--secondary-color)]'>Quick Actions</h4>
                                <div className='space-y-3'>
                                    <span
                                        onClick={() => updateStatus(selectedApplication._id, "hired")}
                                        className='w-full bg-green-500 text-white px-4 py-3 rounded-xl hover:bg-green-600 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg transform hover:scale-105 font-semibold'
                                    >
                                        <IoCheckmarkCircle className='text-lg' />
                                        Approve Candidate
                                    </span>
                                    <span
                                        onClick={() => updateStatus(selectedApplication._id, "rejected")}
                                        className='w-full bg-red-500 text-white px-4 py-3 rounded-xl hover:bg-red-600 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg transform hover:scale-105 font-semibold'
                                    >
                                        <IoCloseCircle className='text-lg' />
                                        Reject Candidate
                                    </span>
                                    <span
                                        onClick={() => updateStatus(selectedApplication._id, "shortlisted")}
                                        className='w-full bg-[var(--primary-color)] text-white px-4 py-3 rounded-xl hover:bg-[var(--secondary-color)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg transform hover:scale-105 font-semibold'
                                    >
                                        <IoStar className='text-lg' />
                                        Shortlist Candidate
                                    </span>
                                </div>
                            </div>

                            {/* Feedback Section */}
                            <div className='p-3 flex-1'>
                                <h4 className='font-bold mb-4 text-[var(--secondary-color)]'>Internal Notes & Feedback</h4>
                                <textarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    placeholder="Add your notes about this candidate..."
                                    className='w-full h-32 p-4 border-2 border-[var(--primary-color)]/20 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all duration-300 bg-white shadow-sm'
                                />
                                <span
                                    onClick={() => {
                                        // Save feedback logic here
                                        toast.success('Feedback saved');
                                        setFeedback('');
                                    }}
                                    className='w-full mt-4 bg-[var(--secondary-color)] text-white px-4 py-3 rounded-xl hover:bg-[var(--primary-color)] transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg transform hover:scale-105 font-semibold flex items-center justify-center'
                                >
                                    Save Feedback
                                </span>
                            </div>
                        </>
                    ) : (
                        <div className='flex-1 flex items-center justify-center text-[var(--text-color)]/60'>
                            <div className='text-center p-8'>
                                <div className='p-3 bg-[var(--accent-color)] rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4'>
                                    <IoSettings className='text-3xl text-[var(--primary-color)]' />
                                </div>
                                <span className='text-lg font-semibold text-[var(--secondary-color)]'>Select an application to see actions</span>
                                <span className='block text-sm text-[var(--text-color)]/60 mt-2'>Choose an applicant to manage their application</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Applications
