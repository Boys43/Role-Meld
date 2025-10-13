import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { FaUsers, FaTrash } from "react-icons/fa";
import { Ban, Unlock, Mail, Filter } from "lucide-react";
import CustomSelect from "./CustomSelect";

const AdminRecruiters = () => {
  const { backendUrl } = useContext(AppContext);
  const [recruiters, setRecruiters] = useState([]);
  const [filteredRecruiters, setFilteredRecruiters] = useState([]);

  // Filters
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [timeFilter, setTimeFilter] = useState("");

  const getRecruiters = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/allrecruiters`);
      if (data.success) {
        setRecruiters(data.recruiters);
        setFilteredRecruiters(data.recruiters);
      }
    } catch (error) {
      console.error("Error fetching recruiters:", error);
    }
  };

  useEffect(() => {
    getRecruiters();
  }, []);

  // Delete user
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

  // Ban / Unban user
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

  // Apply filters
  useEffect(() => {
    let filtered = [...recruiters];

    if (selectedCity) {
      filtered = filtered.filter((r) => r.city?.toLowerCase() === selectedCity.toLowerCase());
    }
    if (selectedRole) {
      filtered = filtered.filter((r) => r.role?.toLowerCase() === selectedRole.toLowerCase());
    }
    if (selectedStatus) {
      filtered = filtered.filter((r) => r.status === selectedStatus);
    }

    if (timeFilter) {
      const now = new Date();
      filtered = filtered.filter((r) => {
        const createdAt = new Date(r.createdAt);
        if (timeFilter === "7days") return now - createdAt <= 7 * 24 * 60 * 60 * 1000;
        if (timeFilter === "month") return now - createdAt <= 30 * 24 * 60 * 60 * 1000;
        if (timeFilter === "3months") return now - createdAt <= 90 * 24 * 60 * 60 * 1000;
        return true;
      });
    }

    if (sortOrder === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOrder === "oldest") {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortOrder === "a-z") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === "z-a") {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    }

    setFilteredRecruiters(filtered);
  }, [selectedCity, selectedRole, selectedStatus, timeFilter, sortOrder, recruiters]);

  // Count stats
  const approvedCount = recruiters.filter((r) => r.reviewStatus === "approved").length;
  const pendingCount = recruiters.filter((r) => r.reviewStatus === "pending").length;
  const rejectedCount = recruiters.filter((r) => r.reviewStatus === "rejected").length;
  const underReviewCount = recruiters.filter((r) => r.reviewStatus === "udnerReview").length;

  return (
    <div className="p-6 bg-white rounded-xl w-full min-h-screen shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-3 text-gray-800">
          <FaUsers className="text-[var(--primary-color)]" /> Recruiters Management
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 bg-gradient-to-br from-green-100 to-green-50 rounded-lg shadow-md border border-green-200">
          <p className="text-gray-600 font-medium">Approved</p>
          <h2 className="text-3xl font-bold text-green-600 mt-1">{approvedCount}</h2>
        </div>
        <div className="p-5 bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-lg shadow-md border border-yellow-200">
          <p className="text-gray-600 font-medium">Pending</p>
          <h2 className="text-3xl font-bold text-yellow-600 mt-1">{pendingCount}</h2>
        </div>
        <div className="p-5 bg-gradient-to-br from-red-100 to-red-50 rounded-lg shadow-md border border-red-200">
          <p className="text-gray-600 font-medium">Rejected</p>
          <h2 className="text-3xl font-bold text-red-600 mt-1">{rejectedCount}</h2>
        </div>
        <div className="p-5 bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg shadow-md border border-red-200">
          <p className="text-gray-600 font-medium">Requests</p>
          <h2 className="text-3xl font-bold text-orange-600 mt-1">{underReviewCount}</h2>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2 text-gray-700 font-semibold">
            <Filter size={18} /> Filters:
          </div>

          <div className="w-full grid grid-cols-2 md:grid-cols- lg:grid-cols-4 gap-2">
            <CustomSelect
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="">All Cities</option>
              {[...new Set(recruiters.map((r) => r.city))].map(
                (city) => city && <option key={city} value={city}>{city}</option>
              )}
            </CustomSelect>

            <CustomSelect
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
              <option value="underReview">Under Review</option>
            </CustomSelect>

            <CustomSelect
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
            >
              <option value="">All Time</option>
              <option value="7days">Last 7 Days</option>
              <option value="month">Last Month</option>
              <option value="3months">Last 3 Months</option>
            </CustomSelect>

            <CustomSelect
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="a-z">A–Z</option>
              <option value="z-a">Z–A</option>
            </CustomSelect>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-[var(--primary-color)] text-white uppercase text-xs tracking-wide">
            <tr>
              <th className="px-6 py-3">#</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">City</th>
              <th className="px-6 py-3">Company</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3 text-center">Jobs</th>
              <th className="px-6 py-3 text-center">Status</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecruiters.map((r, i) => (
              <tr
                key={r._id}
                className={`transition duration-200 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50`}
              >
                <td className="px-6 py-4 font-medium">{i + 1}</td>
                <td className="px-6 py-4 font-semibold text-gray-800">{r.name}</td>
                <td className="px-6 py-4 flex items-center gap-2">
                  <Mail size={15} className="text-gray-500" /> {r.email}
                </td>
                <td className="px-6 py-4">{r.city || <span className="text-gray-400">N/A</span>}</td>
                <td className="px-6 py-4">{r.company || <span className="text-gray-400">N/A</span>}</td>
                <td className="px-6 py-4">{r.role || <span className="text-gray-400">N/A</span>}</td>
                <td className="px-6 py-4 text-center">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                    {r.sentJobs?.length || 0}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-semibold ${r.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : r.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                      }`}
                  >
                    {r.status || "N/A"}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center items-center gap-4">
                    <span
                      onClick={() => deleteUser(r.authId)}
                      className="cursor-pointer text-red-500 hover:text-red-700 transition"
                      title="Delete"
                    >
                      <FaTrash size={18} />
                    </span>
                    {r.isBanned ? (
                      <span
                        onClick={() => toggleBan(r.email, true)}
                        className="cursor-pointer text-green-500 hover:text-green-700 transition"
                        title="Unban"
                      >
                        <Unlock size={18} />
                      </span>
                    ) : (
                      <span
                        onClick={() => toggleBan(r.email, false)}
                        className="cursor-pointer text-red-500 hover:text-red-700 transition"
                        title="Ban"
                      >
                        <Ban size={18} />
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRecruiters;
