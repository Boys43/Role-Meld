import React, { useContext, useEffect, useRef, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { FaCamera } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { LuGitPullRequest } from "react-icons/lu";
import { IoPersonAddSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

// ChatJs 2
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Legend, LineElement, PointElement, CategoryScale, LinearScale, BarElement } from 'chart.js/auto'
import Img from './Image';
import { Clipboard, ClipboardList, ClipboardPenLine, Loader, User } from 'lucide-react';
ChartJS.register(LineElement, ArcElement, Legend, PointElement, CategoryScale, LinearScale, BarElement);

const EmployeeDashboard = () => {
  const { userData, backendUrl, setUserData } = useContext(AppContext);

  const navigate = useNavigate()

  const [pictureLoading, setPictureLoading] = useState(false)
  const changePicture = async (profilePicture) => {
    setPictureLoading(true)
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
    } finally {
      setPictureLoading(false)
    }
  };

  const [bannerLoading, setBannerLoading] = useState(false)
  const updateBanner = async (banner) => {
    setBannerLoading(true)
    const formData = new FormData();
    formData.append("banner", banner);

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/updatebanner`,
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
    } finally {
      setBannerLoading(false)
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
    <div className='flex flex-col w-full p-6 bg-white rounded-lg min-h-screen overflow-y-auto border border-gray-300'>
      <div className="relative w-full">
        {/* Profile Circle */}
        <div className="w-full h-[30vh] border-2 border-gray-300 rounded-2xl overflow-hidden flex items-center justify-center bg-gray-200 text-xl font-semibold">
          {bannerLoading ?
            <span className='animate-spin'><Loader /></span> :
            userData?.banner ? (
              <Img
                src={userData?.banner}
                style={"w-full h-full object-cover"}
              />
            ) : (
              userData?.name?.[0] || "?"
            )
          }
        </div>

        {/* Upload Form */}
        <form
          className="mt-2"
        >
          <input
            type="file"
            id="banner"
            name="banner"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              e.preventDefault();
              updateBanner(e.target.files[0]);
            }}
          />
          <label
            htmlFor="banner"
            className="absolute bottom-0 right-0 bg-white rounded-full p-1 cursor-pointer shadow"
          >
            <FaCamera className="text-gray-600 text-sm" />
          </label>
        </form>
      </div>
      {/* Profile Section */}
      <div className='flex items-center gap-6 pb-4'>
        <div className="relative w-20 h-20">
          {/* Profile Circle */}
          <div className="w-20 h-20 border-2 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 text-xl font-semibold">
            {pictureLoading ?
              <span className='animate-spin'><Loader /></span> :
              userData?.profilePicture ? (
                <Img
                  src={userData?.profilePicture}
                  style={"w-full h-full object-cover"}
                />
              ) : (
                userData?.name?.[0] || "?"
              )
            }
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
          <h1 className='font-semibold'>
            Hi, {" "}
            <span className="text-[var(--primary-color)]">
              {userData?.company === "Individual" ? userData?.name : userData?.company}
            </span>
          </h1>
        </div>
        <button className='primary-btn'
          onClick={() => navigate(`/company-profile/${userData?.authId}`)}
        >
          View Profile Page
        </button>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5 w-full'>
        <div className='flex justify-between p-6 border border-gray-300 rounded-lg items-center'>
          <div className='flex flex-col gap-3'>
            <span className='text-gray-600 font-semibold'>
              POSTED JOBS
            </span>
            <div className='text-5xl text-black font-semibold'>
              {Jobs.length}
            </div>
          </div>
          <div className='p-3 rounded-full h-15 w-15 bg-[#b3e5fb] flex items-center justify-center'>
            <ClipboardPenLine />
          </div>
        </div>
        <div className='flex justify-between p-6 border border-gray-300 rounded-lg items-center'>
          <div className='flex flex-col gap-3'>
            <span className='text-gray-600 font-semibold'>
              APPLICATIONS
            </span>
            <div className='text-5xl text-black font-semibold'>
              {Applications.length}
            </div>
          </div>
          <div className='p-3 rounded-full h-15 w-15 bg-[#cabffd] flex items-center justify-center'>
            <ClipboardList />
          </div>
        </div>
        <div className='flex justify-between p-6 border border-gray-300 rounded-lg items-center'>
          <div className='flex flex-col gap-3'>
            <span className='text-gray-600 font-semibold'>
              MY FOLLOWERS
            </span>
            <div className='text-5xl text-black font-semibold'>
              {userData.followers}
            </div>
          </div>
          <div className='p-3 rounded-full h-15 w-15 bg-[#b7e4cb] flex items-center justify-center'>
            <User />
          </div>
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
    </div>

  )
}

export default EmployeeDashboard