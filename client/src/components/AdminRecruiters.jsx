import React from 'react'
import { useContext } from 'react';
import { useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { FaUsers } from "react-icons/fa";

const AdminRecruiters = () => {
  const { backendUrl } = useContext(AppContext);
  const [recruiters, setRecruiters] = React.useState([]);

  const getRecruiters = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/allrecruiters`);
      if (data.success) {
        setRecruiters(data.recruiters);
      }
    } catch (error) {
      console.error("Error fetching recruiters:", error);
    }
  }


  useEffect(() => {
    getRecruiters();
  }, [])

  return (
    <div className='p-6 bg-white rounded-lg w-full overflow-y-scroll h-[calc(100vh-4.6rem)]'>
      <h1 className='text-2xl font-bold mb-4 flex items-center gap-2'>
        <FaUsers /> Recruiters
      </h1>
      <div className='flex p-4 shadow-lg flex-col gap-4 w-full rounded-2xl border'>
        <div className='flex justify-center gap-4 text-2xl font-bold w-full items-center bg-gradient-to-br px-10 py-4 rounded-2xl from-red-500 to-red-700 text-white'>
          <FaUsers size={32} /> {recruiters.length} Recruiters
        </div>
        <div>
          <h2 className="text-center font-bold mb-4 text-xl text-gray-700">All Recruiters</h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-md">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-800 text-white sticky top-0">
                <tr>
                  <th className="px-6 py-3">#</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Members</th>
                  <th className="px-6 py-3">Company</th>
                  <th className="px-6 py-3 text-center">Posted Jobs</th>
                </tr>
              </thead>
              <tbody>
                {recruiters.map((recruiter, index) => (
                  <tr
                    key={recruiter.id}
                    className={`transition duration-200 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-blue-50`}
                  >
                    <td className="px-6 py-4 font-medium">{index + 1}</td>
                    <td className="px-6 py-4">{recruiter.name}</td>
                    <td className="px-6 py-4 text-blue-600 underline">{recruiter.email}</td>
                    <td className="px-6 py-4">
                      {recruiter.members ? recruiter.members : <span className="text-gray-400">N/A</span>}
                    </td>
                    <td className="px-6 py-4">
                      {recruiter.company ? recruiter.company : <span className="text-gray-400">N/A</span>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                        {recruiter.sentJobs?.length || 0}
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

export default AdminRecruiters
