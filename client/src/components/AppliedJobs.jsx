import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaBriefcase, FaClock } from "react-icons/fa";
import { FaCircleCheck, FaRegEye } from "react-icons/fa6";
import Loading from './Loading';
import { VscGitStashApply } from "react-icons/vsc";
import NotFound404 from './NotFound404';
import { MdCancel } from 'react-icons/md';

const AppliedJobs = () => {
    const { backendUrl } = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [application, setApplication] = useState([]);

    const appliedJobs = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${backendUrl}/api/applications/appliedjobs`);
            if (data.success) {
                setApplication(data.applications);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        appliedJobs();
    }, []);

    const [filter, setFilter] = useState("all")

    const filteredApplications = application.filter((app) => {
        return filter === 'all' ? true : app.status === filter;
    });

    if (loading) {
        return <div className='w-full'>
            <Loading />;
        </div>
    }

    return (
        <div className="p-6 w-full h-[calc(100vh-4.6rem)] overflow-y-auto">
            <>
                <h1 className="font-bold text-xl flex items-center gap-3">
                    <VscGitStashApply className="text-[var(--primary-color)]" /> Applied Jobs
                </h1>
                {/* Filter Bar */}
                <div className='flex  items-center flex-wrap p-4 border border-gray-300 mt-4 rounded-md gap-4'>
                    <span className='cursor-pointer px-4 py-1 bg-white border border-gray-300 rounded-md'
                        onClick={() => setFilter('all')}
                    >
                        All Applications <span className='ml-2 font-bold text-[var(--primary-color)]'>{application.length}</span>
                    </span>
                    <span className='cursor-pointer px-4 py-1 bg-green-200 border border-green-500 rounded-md'
                        onClick={() => setFilter('hired')}
                    >
                        Approved <span className='ml-2 font-bold text-green-500'>{application.filter(app => app.status === 'approved').length}</span>
                    </span>
                    <span className='cursor-pointer px-4 py-1 bg-red-200 border border-red-500 rounded-md'
                        onClick={() => setFilter('rejected')}
                    >
                        Rejected <span className='ml-2 font-bold text-red-500'>{application.filter(app => app.status === 'rejected').length}</span>
                    </span>
                    <span className='cursor-pointer px-4 py-1 bg-yellow-200 border border-yellow-500 rounded-md'
                        onClick={() => setFilter('applied')}
                    >
                        Pending <span className='ml-2 font-bold text-yellow-500'>{application.filter(app => app.status === 'applied').length}</span>
                    </span>
                </div>

                <div className="mt-6">
                    <div className="overflow-x-auto bg-white shadow-xl rounded-2xl border border-gray-200">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead className="bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] text-white sticky top-0">
                                <tr>
                                    <th className="px-6 py-3 font-semibold">#</th>
                                    <th className="px-6 py-3 font-semibold">Job Title</th>
                                    <th className="px-6 py-3 font-semibold">Company</th>
                                    <th className="px-6 py-3 font-semibold">Applied At</th>
                                    <th className="px-6 py-3 font-semibold">Status</th>
                                    <th className="px-6 py-3 font-semibold text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredApplications?.length !== 0 ? (
                                    filteredApplications?.map((app, index) => (
                                        <tr
                                            key={index}
                                            className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition"
                                        >
                                            {/* Index */}
                                            <td className="px-6 py-4 text-gray-700">{index + 1}</td>

                                            {/* Job Title */}
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {app?.job?.title || "Title not found"}
                                            </td>

                                            {/* Company */}
                                            <td className="px-6 py-4 text-gray-700">
                                                <div className="flex font-semibold items-center gap-3">
                                                    <span className="border p-2 rounded-xl border-gray-300">
                                                        <img
                                                            src={app?.job?.companyProfile}
                                                            alt="Company"
                                                            decoding="async"
                                                            loading="lazy"
                                                            width="30"
                                                            height="30"
                                                            className="rounded-md object-cover"
                                                        />
                                                    </span>
                                                    {app?.job?.company || "Company not found"}
                                                </div>
                                            </td>

                                            {/* Applied At */}
                                            <td className="px-6 py-4 text-gray-700">
                                                {new Date(app?.createdAt).toLocaleDateString()}
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-3 py-1 text-xs font-semibold rounded-full ${app?.status === "applied"
                                                        ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                                                        : app?.status === "hired"
                                                            ? "bg-green-100 text-green-800 border border-green-300"
                                                            : app?.status === "rejected"
                                                                ? "bg-red-100 text-red-800 border border-red-300"
                                                                : "bg-gray-100 text-gray-800 border border-gray-300"
                                                        }`}
                                                >
                                                    {app?.status || "Status not found"}
                                                </span>
                                            </td>

                                            {/* Action */}
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() =>
                                                        window.open(`/jobdetails/${app?.job?._id}`, "_blank")
                                                    }
                                                    className="flex items-center justify-center gap-2 px-4 py-2 text-[var(--primary-color)] border border-[var(--primary-color)] rounded-lg hover:bg-[var(--primary-color)] hover:text-white transition"
                                                >
                                                    <FaRegEye size={18} />
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-10">
                                            <NotFound404 value={"No  Jobs"} />
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        </div>
    );
};

export default AppliedJobs;
