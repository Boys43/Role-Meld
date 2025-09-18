import React from 'react'
import { useContext } from 'react';
import { FaUsers } from "react-icons/fa";
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { useEffect } from 'react';

const AdminUsers = () => {
  const { backendUrl } = useContext(AppContext);
  const [users, setUsers] = React.useState([]);

  const getUsers = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/allusers`);
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  useEffect(() => {
    getUsers();
  }, [])

  return (
    <div className='p-6 bg-white rounded-lg w-full overflow-y-scroll h-[calc(100vh-4.6rem)]'>
      <h1 className='text-2xl font-bold mb-4 flex items-center gap-2'>
        <FaUsers /> Users
      </h1>
      <div className='flex p-4 shadow-lg flex-col gap-4 w-full rounded-2xl border'>
        <div className='flex justify-center gap-4 text-2xl font-bold w-full items-center bg-gradient-to-br px-10 py-4 rounded-2xl from-green-500 to-green-700 text-white'>
          <FaUsers size={32} /> {users.length} Users
        </div>
        <div>
          <h2 className="text-center font-bold mb-4 text-xl text-gray-700">All Users</h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-md">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-800 text-white sticky top-0">
                <tr>
                  <th className="px-6 py-3">#</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Portfolio</th>
                  <th className="px-6 py-3">Resume</th>
                  <th className="px-6 py-3 text-center">Applied Jobs</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={user.id}
                    className={`transition duration-200 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-blue-50`}
                  >
                    <td className="px-6 py-4 font-medium">{index + 1}</td>
                    <td className="px-6 py-4">{user.name}</td>
                    <td className="px-6 py-4 text-blue-600 underline">{user.email}</td>
                    <td className="px-6 py-4">
                      {user.portfolio ? (
                        <a
                          href={user.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          View
                        </a>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {user.resume ? (
                        <a
                          href={user.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-500 hover:underline"
                        >
                          Download
                        </a>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                        {user.appliedJobs?.length || 0}
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

export default AdminUsers
