import React from 'react'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios';
import { useState, useEffect } from 'react';
import { IoLocationSharp, IoMail, IoSettings, IoPerson } from "react-icons/io5";
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

    const filteredApplications = Applications.filter((application) => {
        return filter === 'all' ? true : application.status === filter;
    })

    return (
        <div className='flex w-full h-[calc(100vh-4.6rem)] overflow-y-auto flex-col gap-4 p-8'>
            <h2 className='flex items-center gap-4 font-bold'><IoSettings className='text-[var(--text-color)]' />Job Applications</h2>

            <div className='flex gap-6'>
                <div className='py-2 px-4 rounded-xl font-semibold border bg-white cursor-pointer'
                    onClick={() => setFilter('all')}
                >
                    All <span className='bg-white py-1 px-2.5 border  ml-2 rounded-2xl'>{Applications.length}</span>
                </div>

                <div className='py-2 px-4 rounded-xl border font-semibold border-yellow-950 bg-yellow-400 cursor-pointer'
                    onClick={() => setFilter('pending')}
                >
                    Pending <span className='bg-white py-1 px-2.5  ml-2 rounded-2xl'>{Applications.filter((job) => {
                        return job.status === 'pending';
                    }).length}</span>
                </div>
                <div className='py-2 px-4 rounded-xl border font-semibold border-red-950 bg-red-400 cursor-pointer'
                    onClick={() => setFilter('rejected')}
                >
                    Rejected <span className='bg-white py-1 px-2.5  ml-2 rounded-2xl'>{Applications.filter((job) => {
                        return job.status === 'rejected';
                    }).length}</span>
                </div>
                <div className='py-2 px-4 rounded-xl border font-semibold border-green-950 bg-green-400  cursor-pointer'
                    onClick={() => setFilter('hired')}
                >
                    Approved <span className='bg-white py-1 px-2.5  ml-2 rounded-2xl'>{Applications.filter((job) => {
                        return job.status === 'hired';
                    }).length}</span>
                </div>

            </div>

            {loading ? (
                <Loading />
            ) : Applications.length === 0 ? (
                <NotFound404 margin={"mt-20"} value={"No JObs Found"} />
            ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredApplications?.length !== 0 ? filteredApplications?.map((app) => (
                        <li
                            key={app._id}
                            className={`rounded-2xl border shadow-md transition-all duration-300 overflow-hidden
                                ${app.status === "hired" ? "bg-green-300 border-green-400" : ""}
                                ${app.status === "rejected" ? "bg-red-100 border-red-400" : "bg-white"}
                            `}
                        >
                            <div className="p-5 flex flex-col gap-3">
                                {/* Job Info */}
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {app.job?.title}
                                </h3>
                                <div
                                    className="text-sm text-gray-600 line-clamp-2"
                                    dangerouslySetInnerHTML={{
                                        __html: app.job?.description
                                            .replace(/<[^>]+>/g, "") // strip tags
                                            .split(" ")
                                            .slice(0, 20)
                                            .join(" ") + "...",
                                    }}
                                />

                                {/* Location */}
                                <p className="text-sm text-gray-500 flex items-center gap-2">
                                    <IoLocationSharp className="text-[var(--primary-color)] text-base" />
                                    <span>
                                        <b>Location:</b> {app.job?.location}
                                    </span>
                                </p>

                                {/* Applicant Info */}
                                <div className="mt-3 bg-gray-50 p-3 rounded-lg flex flex-col gap-2">
                                    <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <IoPerson className="text-[var(--primary-color)] text-base" />
                                        {app.applicant?.name}
                                    </p>
                                    <p className="text-xs text-gray-500 flex items-center gap-2">
                                        <IoMail className="text-[var(--primary-color)] text-base" />
                                        {app.applicant?.email}
                                    </p>
                                </div>

                                {/* Download Button */}
                                <a
                                    href={`${backendUrl}/uploads/${app.resume}`}
                                    download={app.resume}
                                    className="mt-4 inline-block"
                                >
                                    <button className="w-full bg-[var(--primary-color)]/50 text-white px-4 py-2 rounded-xl hover:bg-[var(--primary-color)] border-2 border-[var(--primary-color)] transition-colors duration-200 flex items-center justify-center gap-2">
                                        <IoIosDownload className="text-lg" />
                                        Download Resume
                                    </button>
                                </a>
                                <div className='flex items-center gap-2'>

                                    <button className="w-full bg-green-400 text-white px-4 py-2 rounded-xl hover:bg-green-500 border-2 border-green-500 transition-colors duration-200 flex items-center justify-center gap-2 "
                                        onClick={() => updateStatus(app._id, "hired")}
                                        disabled={app.status !== "applied"}
                                    >
                                        <IoIosCheckmarkCircle className="text-lg" />
                                        Approve
                                    </button>
                                    <button className="w-full bg-red-400 text-white px-4 py-2 rounded-xl hover:bg-red-500 border-2 border-red-500 transition-colors duration-200 flex items-center justify-center gap-2"
                                        onClick={() => updateStatus(app._id, "rejected")}
                                        disabled={app.status !== "applied"}
                                    >
                                        <ImCancelCircle className="text-lg" />
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))
                :
                <NotFound404 margin={"mt-20"} value={"No Jobs Found"} />
                }
                </ul>
            )}
        </div>
    )
}

export default Applications
