import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { FaTrash, FaUsers } from "react-icons/fa";
import { toast } from "react-toastify";
import { Ban, Mail, Unlock } from "lucide-react";

const AdminRecruiters = () => {
  const { backendUrl } = useContext(AppContext);
  const [recruiters, setRecruiters] = useState([]);

  const getRecruiters = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/allrecruiters`);
      if (data.success) setRecruiters(data.recruiters);
    } catch (error) {
      console.error("Error fetching recruiters:", error);
    }
  };

  useEffect(() => {
    getRecruiters();
  }, []);

  // Delete User
  const deleteUser = async (id) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/delete-user`, { id });
      if (data.success) {
        toast.success(data.message);
        await getRecruiters();
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ✅ Unified Ban/Unban Function
  const toggleBan = async (email, isBanned) => {
    const url = isBanned
      ? `${backendUrl}/api/auth/unban-user`
      : `${backendUrl}/api/auth/ban-user`;

    try {
      const { data } = await axios.post(url, { email });
      if (data.success) {
        toast.success(data.message);
        await getRecruiters();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg w-full overflow-y-auto min-h-screen">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-3">
        <FaUsers className="text-[var(--primary-color)]" /> Recruiters
      </h1>

      <div className="flex p-4 flex-col gap-4 w-full rounded-2xl">
        <div className="flex justify-center gap-4 text-2xl font-bold w-full items-center bg-gradient-to-br px-10 py-4 rounded-lg from-red-500 to-red-700 text-white">
          <FaUsers size={32} /> {recruiters.length} Recruiters
        </div>

        <div>
          <h2 className="text-center font-bold mb-4 text-xl text-gray-700">
            All Recruiters
          </h2>

          <div className="overflow-x-auto rounded-md border border-gray-200 shadow-md">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-800 text-white sticky top-0">
                <tr>
                  <th className="px-6 py-3">#</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Members</th>
                  <th className="px-6 py-3">Company</th>
                  <th className="px-6 py-3 text-center">Posted Jobs</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recruiters.map((recruiter, index) => (
                  <tr
                    key={recruiter._id || recruiter.id}
                    className={`transition duration-200 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-blue-50`}
                  >
                    <td className="px-6 py-4 font-medium">{index + 1}</td>
                    <td className="px-6 py-4">{recruiter.name}</td>
                    <td className="px-6 py-4 flex items-center gap-3">
                      <Mail size={15} /> {recruiter.email}
                    </td>
                    <td className="px-6 py-4">
                      {recruiter.members || <span className="text-gray-400">N/A</span>}
                    </td>
                    <td className="px-6 py-4">
                      {recruiter.company || <span className="text-gray-400">N/A</span>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                        {recruiter.sentJobs?.length || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center gap-4">
                        <FaTrash
                          size={20}
                          onClick={() => deleteUser(recruiter.authId)}
                          className="cursor-pointer text-red-400 hover:text-red-600"
                          title="Delete User"
                        />

                        {recruiter.isBanned ? (
                          <Unlock
                            size={20}
                            onClick={() => toggleBan(recruiter.email, true)}
                            className="cursor-pointer text-green-400 hover:text-green-600"
                            title="Unban User"
                          />
                        ) : (
                          <Ban
                            size={20}
                            onClick={() => toggleBan(recruiter.email, false)}
                            className="cursor-pointer text-red-400 hover:text-red-600"
                            title="Ban User"
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRecruiters;
