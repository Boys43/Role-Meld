import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaTrash } from "react-icons/fa";
import { useLocation, useNavigate } from 'react-router-dom';
import NotFound404 from './NotFound404';

const SavedJobs = () => {
  const { backendUrl, userData, toggleSaveJob } = useContext(AppContext);
  const [allsavedJobs, setAllsavedJobs] = useState([]);
  const location = useLocation();

  const savedJobsIds = userData?.savedJobs || [];

  const getSavedJobs = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/jobs/getsavedjobs`, { savedJobsIds })

      if (data.success) {
        setAllsavedJobs(data.getSavedJobs);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    if (savedJobsIds.length > 0) {
      getSavedJobs();
    }
  }, [savedJobsIds, location.pathname]);

  return (
    <div className="p-6 w-full h-[calc(100vh-4.6rem)] overflow-y-auto">
      <>
        <h1 className="font-bold text-xl flex items-center gap-3">
          Saved Jobs
        </h1>

        <div className="mt-6">
          <div className="overflow-x-auto bg-white shadow-xl rounded-2xl border border-gray-200">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] text-white sticky top-0">
                <tr>
                  <th className="px-6 py-3 font-semibold">#</th>
                  <th className="px-6 py-3 font-semibold">Job Title</th>
                  <th className="px-6 py-3 font-semibold">Company</th>
                  <th className="px-6 py-3 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allsavedJobs?.length !== 0 ? (
                  allsavedJobs?.map((job, index) => (
                    <tr
                      key={job._id}
                      className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition"
                    >
                      {/* Index */}
                      <td className="px-6 py-4 text-gray-700">{index + 1}</td>

                      {/* Job Title */}
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {job?.title || "Title not found"}
                      </td>

                      {/* Company */}
                      <td className="px-6 py-4 text-gray-700">
                        <div className="flex font-semibold items-center gap-3">
                          <span className="border p-2 rounded-xl border-gray-300">
                            <img
                              src={job?.companyProfile ? `${backendUrl}/uploads/${job.companyProfile}` : "/default-company.png"}
                              alt="Company"
                              decoding="async"
                              loading="lazy"
                              width="30"
                              height="30"
                              className="rounded-md object-cover"
                            />
                          </span>
                          {job?.company || "Company not found"}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 text-center">
                        <span onClick={() => {
                          toggleSaveJob(job._id)
                          setAllsavedJobs(allsavedJobs.filter(job1 => job1._id !== job._id))
                        }} className="cursor-pointer text-red-600 hover:text-red-800">
                          <FaTrash size={18} />
                        </span>
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
  )
}

export default SavedJobs
