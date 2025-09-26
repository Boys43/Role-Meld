import React from 'react'
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { FaUsers } from 'react-icons/fa';

const AdminJobs = () => {
  const { backendUrl } = useContext(AppContext);
  const [jobs, setJobs] = React.useState([]);

  const getJobs = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs/getalljobs`);
      if (data.success) {
        setJobs(data.jobs);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  }

  React.useEffect(() => {
    getJobs()
  }, [])
  

  return (
    <div className='p-6 bg-white rounded-lg w-full overflow-y-auto h-[calc(100vh-4.6rem)]'>
      <h1 className='text-2xl font-bold mb-4 flex items-center gap-2'>
        <FaUsers /> Jobs
      </h1>
      <div className='flex p-4 shadow-lg flex-col gap-4 w-full rounded-2xl border'>
        <div className='flex justify-center gap-4 text-2xl font-bold w-full items-center bg-gradient-to-br px-10 py-4 rounded-2xl from-red-500 to-red-700 text-white'>
          <FaUsers size={32} /> {jobs.length} Jobs
        </div>
        <div>
          <h2 className="text-center font-bold mb-4 text-xl text-gray-700">All Jobs</h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-md">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-800 text-white sticky top-0">
                <tr>
                  <th className="px-6 py-3">#</th>
                  <th className="px-6 py-3">Posted At</th>
                  <th className="px-6 py-3">Salary</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Company</th>
                  <th className="px-6 py-3 text-center">Deadline Date</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job, index) => (
                  <tr
                    key={job.id}
                    className={`transition duration-200 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-blue-50`}
                  >
                    <td className="px-6 py-4 font-medium">{index + 1}</td>
                    <td className="px-6 py-4">{new Date(job.postedAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{job.salary} $</td>
                    <td className="px-6 py-4">
                      {job.approved ? job.approved : <span className="text-gray-400">N/A</span>}
                    </td>
                    <td className="px-6 py-4">
                      {job.company ? job.company : <span className="text-gray-400">N/A</span>}
                    </td>

                    <td className="px-6 py-4 text-center">

                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                        {
                          new Date(job.applicationDeadline) < new Date()
                            ? "Expired"
                            : job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : "N/A"
                        }
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminJobs
