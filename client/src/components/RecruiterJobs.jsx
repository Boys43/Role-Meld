import axios from 'axios';
import React, { use, useContext, useEffect, useState } from 'react'
import { FaCircleCheck } from "react-icons/fa6";
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { MdCancel } from "react-icons/md";
import { FaClock } from "react-icons/fa";
import { FaRegListAlt } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";

const RecruiterJobs = () => {
    const { userData, backendUrl } = useContext(AppContext);
    const [filter, setFilter] = useState('all')
    const [jobs, setJobs] = useState([]);
    const getJobs = async () => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/jobs/getcompanyjobsbyid`, { id: userData.authId });
            if (data.success) {
                setJobs(data.companyJobs);
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    useEffect(() => {
        getJobs();
    }, [])

    // Remove Job
    const removeJob = async (jobId) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/jobs/removejob`, { jobId });
            if (data.success) {
                toast.success(data.message);
                getJobs();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const approvedJobs = jobs.filter(job => job.approved === "approved");
    const rejectedJobs = jobs.filter(job => job.approved === "rejected");
    const pendingJobs = jobs.filter(job => job.approved === "pending");

    const filteredJobs = jobs.filter((job) => {
        return filter === 'all' ? true : job.approved === filter;
    });

    return (
        <div className='w-full p-6 h-[calc(100vh-4.6rem)] rounded-lg overflow-y-auto '>
            <div className='p-4 bg-white border rounded-lg shadow-lg'>
                <h1 className='flex my-4 font-semibold gap-3 items-center'>
                    <FaRegListAlt className='text-[var(--primary-color)]' /> Listed Jobs
                </h1>
                <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-center'>
                    <div className='flex shadow-xl flex-1 flex-col items-center gap-2 py-4 px-8 border-2 border-green-500 bg-green-300 rounded-2xl'>
                        <h3 className='font-bold text-shadow-md text-white flex items-center gap-2'
                            onClick={() => setFilter('approved')}
                        >
                            Approved Jobs<FaCircleCheck className='text-green-600' />
                        </h3>
                        <h6>
                            {approvedJobs.length > 0 ? <div className='bg-white text-green-600 font-bold px-4 py-1 rounded-full'>{approvedJobs.length}</div> : <div className='bg-white text-green-600 font-bold px-4 py-1 rounded-full'>0</div>}
                        </h6>
                    </div>

                    <div className='flex flex-1 shadow-xl flex-col items-center gap-2 py-4 px-8 border-2 border-red-500 bg-red-300 rounded-2xl'
                        onClick={() => setFilter('rejected')}
                    >
                        <h3 className='font-bold text-shadow-md text-white flex items-center gap-2'>
                            Rejected Jobs<MdCancel className='text-red-600' />
                        </h3>
                        <h5>
                            {rejectedJobs.length > 0 ? <div className='bg-white text-red-600 font-bold px-4 py-1 rounded-full'>{rejectedJobs.length}</div> : <div className='bg-white text-red-600 font-bold px-4 py-1 rounded-full'>0</div>}
                        </h5>
                    </div>

                    <div className='flex flex-1 shadow-xl flex-col items-center gap-2 py-4 px-8 border-2 border-yellow-500 bg-yellow-300 rounded-2xl'>
                        <h3 className='font-bold text-shadow-md text-white flex items-center gap-2'>
                            Pending Jobs<FaClock className='text-yellow-600' />
                        </h3>
                        <h5>
                            {pendingJobs.length > 0 ? <div className='bg-white text-yellow-600 font-bold px-4 py-1 rounded-full'>{pendingJobs.length}</div> : <div className='bg-white text-yellow-600 font-bold px-4 py-1 rounded-full'>0</div>}
                        </h5>
                    </div>
                </div>

                <div className='flex items-center flex-wrap p-4 border border-gray-300 mt-4 rounded-md gap-4'>
                    <span className='px-4 py-1 bg-white border border-gray-300 rounded-md'
                    onClick={() => setFilter('all')}
                    >
                        All Job <span className='ml-2 font-bold text-[var(--primary-color)]'>{jobs.length}</span>
                    </span>
                    <span className='px-4 py-1 bg-green-200 border border-green-500 rounded-md'
                    onClick={() => setFilter('approved')}
                    >
                        Approved <span className='ml-2 font-bold text-green-500'>{jobs.filter(job => job.approved === 'approved').length}</span>
                    </span>
                    <span className='px-4 py-1 bg-red-200 border border-red-500 rounded-md'
                    onClick={() => setFilter('rejected')}
                    >
                        Rejected <span className='ml-2 font-bold text-red-500'>{jobs.filter(job => job.status === 'rejected').length}</span>
                    </span>
                    <span className='px-4 py-1 bg-yellow-200 border border-yellow-500 rounded-md'
                    onClick={() => setFilter('pending')}
                    >
                        Pending <span className='ml-2 font-bold text-yellow-500'>{jobs.filter(job => job.status === 'pending').length}</span>
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border shadow-lg rounded-lg overflow-x-scroll">
                        <thead>
                            <tr className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-left">
                                <th className="px-6 py-3 text-sm font-semibold">#</th>
                                <th className="px-6 py-3 text-sm font-semibold">Job Title</th>
                                <th className="px-6 py-3 text-sm font-semibold">Job Category</th>
                                <th className="px-6 py-3 text-sm font-semibold">Active Till</th>
                                <th className="px-6 py-3 text-sm font-semibold">Status</th>
                                <th className="px-6 py-3 text-sm font-semibold">Sponsored</th>
                                <th className="px-6 py-3 text-sm font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredJobs.map((job, idx) => (

                                <tr
                                    key={job._id}
                                    className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                                        } hover:bg-gray-100 transition`}
                                >
                                    <td className="px-6 py-3 font-medium text-gray-700">{idx + 1}</td>
                                    <td className="px-6 py-3 font-semibold text-gray-700">{job.title}</td>
                                    <td className="px-6 py-3 font-semibold text-gray-700">{job.category}</td>
                                    <td className="px-6 py-3 text-gray-600">{new Date(job.applicationDeadline).toLocaleString()}</td>
                                    <td className="px-6 py-3">
                                        {job.approved === "approved" && (
                                            <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700 font-semibold">
                                                Approved
                                            </span>
                                        )}
                                        {job.approved === "rejected" && (
                                            <span className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-700 font-semibold">
                                                Rejected
                                            </span>
                                        )}
                                        {job.approved === "pending" && (
                                            <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-700 font-semibold">
                                                Pending
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-3 font-semibold text-gray-700">
                                        <span className='bg-gray-300 px-2 rounded-md'>

                                            {job.sponsored ? "Yes" : "No"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 font-medium text-gray-700">
                                        <div className='w-full flex justify-center items-center'
                                            onClick={() => removeJob(job._id)}
                                        >
                                            <FaTrash className='text-red-300 cursor-pointer' />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    )
}

export default RecruiterJobs
