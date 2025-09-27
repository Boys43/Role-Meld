import React, { useContext, useEffect, useRef, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { FaCamera } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { LuGitPullRequest } from "react-icons/lu";
import { IoPersonAddSharp } from "react-icons/io5";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { MdCancel } from "react-icons/md";

// ChatJs 2
import { Line, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Legend, LineElement, PointElement, CategoryScale, LinearScale, BarElement, Filler } from 'chart.js/auto'
ChartJS.register(LineElement, ArcElement, Legend, PointElement, CategoryScale, LinearScale, BarElement);

const EmployeeDashboard = () => {
  const { userData, backendUrl, setUserData } = useContext(AppContext);
  const [profilePicture, setProfilePicture] = useState(null);
  const [showSubmit, setShowSubmit] = useState(false);
  const [updatePopUpState, setUpdatePopUpState] = useState('hidden');
  const [formData, setFormData] = useState({});
  const [jobData, setJobData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const changePicture = async (profilePicture) => {
    const formData = new FormData();
    formData.append("profilePicture", profilePicture);

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/updateprofilepicture`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        setUserData(data.user);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/updateprofile`, { updateUser: formData });
      if (data.success) {
        setUserData(data.profile);
        setUpdatePopUpState("hidden")
        setFormData({}); // reset formData so updated userData reflects in UI
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const [Applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false)
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

  const [Jobs, setJobs] = useState([])

  const jobs = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs/getalljobs`)
      if (data.success) {
        setJobs(data.jobs)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchJobs();
    jobs()
  }, [])

  return (
    <div className='flex flex-col w-full p-6 bg-white rounded-lg h-[calc(100vh-4.6rem)] overflow-y-auto'>
      {/* Profile Section */}
      <div className='flex items-center gap-6 pb-4'>
        <div className="relative w-20 h-20">
          {/* Profile Circle */}
          <div className="w-20 h-20 border-2 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 text-xl font-semibold">
            {userData?.profilePicture ? (
              <img
                src={`${backendUrl}/uploads/${userData?.profilePicture}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              userData?.name?.[0] || "?"
            )}
          </div>

          {/* Upload Form */}
          <form
            className="mt-2"
          >
            <input
              type="file"
              id="profilePicture"
              name="profilePicture"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                e.preventDefault();
                changePicture(e.target.files[0]);
              }}
            />
            <label
              htmlFor="profilePicture"
              className="absolute bottom-0 right-0 bg-white rounded-full p-1 cursor-pointer shadow"
            >
              <FaCamera className="text-gray-600 text-sm" />
            </label>
          </form>
        </div>

        {/* User Info */}
        <div className='w-1/2'>
          <h1 className='text-2xl font-bold text-[var(--primary-color)]'>
            {userData?.company === "Individual" ? userData?.name : userData?.company}
          </h1>
        </div>
        <span>
          <HiOutlinePencilSquare
            onClick={() => setUpdatePopUpState('block')}
            className='text-[var(--primary-color)] cursor-pointer'
          />
        </span>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5 w-full'>
        <div className='hover:translate-y-[-5px] hover:shadow-xl transition-all shadow-lg rounded-2xl border-2 border-red-500 p-4 cursor-pointer flex flex-col items-center justify-center'>
          <h3 className='flex items-center gap-4 font-semibold'><LuGitPullRequest />Total Applications</h3>
          <h1>
            {Applications.length}
          </h1>
        </div>
        <div className='hover:translate-y-[-5px] hover:shadow-xl transition-all shadow-lg rounded-2xl border-2 border-blue-500 p-4 cursor-pointer flex flex-col items-center justify-center'>
          <h3 className='flex items-center gap-4 font-semibold'><IoPersonAddSharp />Total Active Jobs</h3>
          <h1>
            {Jobs.filter((job) => {
              return job.isActive === true && job.company === userData.company;
            }).length}
          </h1>
        </div>
        <div className='hover:translate-y-[-5px] hover:shadow-xl transition-all shadow-lg rounded-2xl border-2 border-yellow-500 p-4 cursor-pointer flex flex-col items-center justify-center'>
          <h3 className='flex items-center gap-4 font-semibold'><IoPersonAddSharp />Total Pending Jobs</h3>
          <h1>
            {Jobs.filter((job) => {
              return job.approved === "pending" && job.company === userData.company;
            }).length}
          </h1>
        </div>
      </div>

      <section className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-5 gap-4">
        <div className="w-full flex justify-center items-center border border-gray-300 rounded-lg p-4 shadow h-80">
          <Doughnut
            data={{
              labels: ["Approved Jobs", "Rejected Jobs", "Pending Jobs"],
              datasets: [
                {
                  label: "Jobs Comparison",
                  data: [
                    Jobs.filter(job => job.approved === "approved" && job.company === userData.company).length,
                    Jobs.filter(job => job.approved === "rejected" && job.company === userData.company).length,
                    Jobs.filter(job => job.approved === "pending" && job.company === userData.company).length
                  ],
                  backgroundColor: [
                    "rgba(54, 162, 235, 0.7)",
                    "rgba(255, 99, 132, 0.7)",
                    "rgba(255, 206, 86, 0.7)"
                  ],
                  borderColor: [
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 99, 132, 1)",
                    "rgba(255, 206, 86, 1)"
                  ],
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "bottom",
                },
              },
            }}
          />
        </div>
      </section>


      {/* Update Profile Modal */}
      <div className={`fixed z-51 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-screen flex items-center justify-center backdrop-blur-sm ${updatePopUpState}`}>
        <div className="w-[70%] h-[70%] border relative bg-white shadow-2xl rounded-2xl overflow-y-auto p-4">
          <MdCancel onClick={() => setUpdatePopUpState('hidden')} size={20} className="absolute right-5 top-5 cursor-pointer" />
          <h1 className="text-[var(--primary-color)] font-semibold">Update Your Profile</h1>

          <form onSubmit={updateProfile} className="flex flex-col gap-2 mt-3">
            <label htmlFor="name" className="font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={userData?.name ?? ""}
              onChange={handleChange}
              className="p-2 border-2 focus:border-[var(--primary-color)] rounded"
              placeholder="Enter Name"
            />

            <label htmlFor="company" className="font-medium mt-2">Company Name</label>
            <input
              type="text"
              name="company"
              value={formData?.company ?? userData?.company ?? ""}
              onChange={handleChange}
              className="p-2 border-2 focus:border-[var(--primary-color)] rounded"
              placeholder="Enter Company Name"
            />

            <label htmlFor="members" className="font-medium mt-2">Members</label>
            <input
              type="text"
              name="members"
              value={formData?.members ?? userData?.members ?? ""}
              onChange={handleChange}
              className="p-2 border-2 focus:border-[var(--primary-color)] rounded"
              placeholder="Enter Members"
            />

            <button type="submit" className="bg-[var(--primary-color)] text-white px-4 py-2 rounded mt-2">Save</button>
          </form>
        </div>
      </div>
    </div>

  )
}

export default EmployeeDashboard