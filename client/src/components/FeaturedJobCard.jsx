import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';

// React Icons
import { IoHomeOutline } from "react-icons/io5";
import { FaClock } from "react-icons/fa";
import { IoMdHeart } from "react-icons/io";
import { CiHeart } from "react-icons/ci";
import { AppContext } from '../context/AppContext';

const FeaturedJobCard = ({ data, setToggleApplyJob, setapplJobId, setLoginReminder }) => {
    const { backendUrl, isLoggedIn, userData, toggleSaveJob, savedJobs } = useContext(AppContext);

    const navigate = useNavigate();

    return (
        <>
            <div className='px-4 py-8 w-full grid gird-cols-1 md:grid-cols-2 rounded-lg bg-white border border-gray-300'>
                <div className='w-full flex flex-col gap-6'>
                    <span className='absolute top-4 right-4 bg-gray-300 px-3 text-sm rounded '>
                        Sponsored
                    </span>
                    <div className='flex w-full whitespace-nowrap items-center gap-2 px-4 font-semibold'>
                        <IoHomeOutline size={15} /> <span className='text-[var(--primary-color)]'>/</span> {data.category} <span className='text-[var(--primary-color)]'>/</span> {data.subCategory}
                    </div>
                    <div className='p-4'>
                        <h3 className='font-semibold mb-4 flex items-center gap-4'>
                            <img src={`${backendUrl}/uploads/${data.companyProfile}`} alt="Alt" className='h-13 w-13 object-cover rounded-full border' />{data.company}
                        </h3>
                        <h2 className='font-medium mb-4 whitespace-nowrap'>
                            {data.title}
                        </h2>
                        {/* <div dangerouslySetInnerHTML={{_html: "Description Here"}}/> */}
                        <span className='bg-gray-300 px-4 rounded font-medium '>
                            {data.salary ? `${data.salary} $` : `${data.minSalary} - ${data.maxSalary}`}
                        </span>
                        <div className='flex mt-4 items-center flex-wrap gap-4'>
                            <span className='text-white border border-green-500 bg-green-300 px-4 rounded'>
                                {data.jobType}
                            </span>

                            <span className='text-white border border-red-500 bg-red-300 px-4 rounded'>
                                {data.locationType}
                            </span>
                        </div>
                    </div>
                    <span className='px-4 text-sm flex items-center gap-2 text-gray-500'>
                        <FaClock />{" "}
                        {data.createdAt
                            ? new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
                                -Math.floor(
                                    (new Date() - new Date(data.createdAt)) / (1000 * 60 * 60 * 24)
                                ),
                                "day"
                            )
                            : "Unknown"}
                    </span>
                </div>
                <div className='w-full relative p-4'>
                    <span
                        onClick={() => toggleSaveJob(data?._id)}
                        className='absolute p-2 border border-gray-200 rounded-md text-[var(--primary-color)] right-3 text-sm mt-2 cursor-pointer top-4'>
                        <span>
                            {[...savedJobs].includes(data?._id) ? <IoMdHeart size={20} /> : <CiHeart size={20} />}
                        </span>
                    </span>
                    <div className='flex h-full items-end justify-end gap-4 py-10'>
                        <button
                            disabled={userData?.appliedJobs?.includes(data?._id)}
                            onClick={() => {
                                if (isLoggedIn) {
                                    setapplJobId(data?._id)
                                    setToggleApplyJob(true)
                                } else {
                                    setLoginReminder(true)
                                }
                            }} className='flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded transition'

                        >
                            Apply Now
                        </button>
                        <button className='flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded transition'
                            onClick={() => navigate('/jobDetails/' + data._id)}
                        >
                            View Details
                        </button>
                    </div>
                </div>
            </div>

        </>
    )
}

export default FeaturedJobCard
