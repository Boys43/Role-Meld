import { useEffect } from 'react'
import { Line, Bar } from 'react-chartjs-2'
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, BarElement, Filler } from 'chart.js/auto'
import axios from 'axios'
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useState } from 'react';
import { toast } from 'react-toastify';
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, BarElement);
// React Icons
import { FaUsers, FaBriefcase, FaUser } from "react-icons/fa";
import { TbBrandGoogleAnalytics } from "react-icons/tb";
import Loading from './Loading';
const AnalyticDashboard = () => {

  const { backendUrl, } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [jobData, setJobData] = useState([]);
  const [userData, setuserData] = useState([])
  const [recruiterData, setRecruiterData] = useState([])

  const weeklyData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/analytics/weekly-analytics`);
      if (data.success) {
        setJobData(data.jobs);
        setuserData(data.users);
        setRecruiterData(data.recruiters);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    weeklyData();
  }, [])


  if (loading) {
    return <div className='w-full'>
      <Loading />
    </div>
  }

  return (
    <div className='p-10 w-full h-[100vh-4.6rem] overflow-y-auto'>
      <h1 className='font-bold mb-4 flex items-center gap-4'>
        <TbBrandGoogleAnalytics className='text-[var(--primary-color)]' /> Analytic Dashboard
      </h1>
      <div className='w-full'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-between'>
          <div className='flex w-full flex-col items-center gap-2 justify-center p-4 rounded-2xl shadow-lg bg-green-200 border-2 border-green-500'>
            <div className='flex items-center gap-4'>
              <FaBriefcase size={25} className='text-green-500' />
              <h3 className='font-bold'>Jobs this Week</h3>
            </div>
            <span className='bg-white rounded-full p-2 font-semibold text-green-500'>
              {jobData.reduce((total, job) => total + job.jobs, 0)}
            </span>
          </div>

          <div className='flex w-full flex-col items-center gap-2 justify-center p-4 rounded-2xl shadow-lg bg-red-200 border-2 border-red-500'>
            <div className='flex items-center gap-4'>
              <FaUsers size={25} className='text-red-500' />
              <h3 className='font-bold'>Users this Week</h3>
            </div>
            <span className='bg-white rounded-full p-2 font-semibold text-red-500'>
              {userData.reduce((total, job) => total + job.users, 0)}
            </span>
          </div>

          <div className='flex w-full flex-col items-center gap-2 justify-center p-4 rounded-2xl shadow-lg bg-yellow-200 border-2 border-yellow-500'>
            <div className='flex items-center gap-4'>
              <FaUser size={25} className='text-yellow-500' />
              <h3 className='font-bold'>Recruiters this Week</h3>
            </div>
            <span className='bg-white rounded-full p-2 font-semibold text-yellow-500'>
              {recruiterData.reduce((total, job) => total + job.recruiters, 0)}
            </span>
          </div>
        </div>

        {/* Analytics */}
        <div className='grid mt-4 w-full grid-cols-1 lg:grid-cols-2 gap-4'>
          <div className='shadow-lg border p-4 rounded-2xl'>
            <Line
              data={{
                labels: jobData.map((job) => job.day.split("-")[1] + '-' + job.day.split("-")[2]),
                datasets: [
                  {
                    label: "Jobs",
                    data: jobData.map((job) => job.jobs),
                    borderColor: "rgb(0, 201, 81)",
                    backgroundColor: "rgb(185, 248, 207)",
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>

          <div className='shadow-lg border p-4 rounded-2xl'>
            <Bar
              data={{
                labels: userData.map((user) => user.day.split("-")[1] + '-' + user.day.split("-")[2]),
                datasets: [
                  {
                    label: "Users",
                    data: userData.map((user) => user.users),
                    borderColor: "rgb(251, 44, 54)",
                    backgroundColor: "rgb(255, 201, 201)",
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>

          <div className='shadow-lg border p-4 rounded-2xl'>
            <Line
              data={{
                labels: recruiterData.map((recruiters) => recruiters.day.split("-")[1] + '-' + recruiters.day.split("-")[2]),
                datasets: [
                  {
                    fill: true,
                    label: "Recruiters",
                    data: recruiterData.map((recruiters) => recruiters.users),
                    borderColor: "rgb(240, 177, 0)",
                    backgroundColor: "rgb(255, 240, 133)",
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticDashboard
