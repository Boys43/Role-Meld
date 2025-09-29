import React, { useContext, useEffect, useState } from 'react'
import Search from '../components/Search'
import { useLocation, } from 'react-router-dom'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import FeaturedJobs from '../components/FeaturedJobs'
import JobCard from '../components/JobCard'
import NotFound404 from '../components/NotFound404'
import Loading from '../components/Loading'
import CoverLetterModal from '../components/CoverLetterModal'
import LoginReminderModal from '../components/LoginReminderModal'

// React Icons
import { FaFilter } from "react-icons/fa";
import { FaClockRotateLeft } from "react-icons/fa6";
import { MdFeaturedPlayList } from "react-icons/md";

const FindJobs = () => {
  const location = useLocation();
  const { backendUrl, userData } = useContext(AppContext)
  const [loading, setLoading] = useState(false);

  // Using Parameters for getting the job 
  const search = new URLSearchParams(location.search);
  const Param = search.get('job');
  const categoryParam = search.get('category');

  const [searchedCategories, setSearchedCategories] = useState([]);
  const [approvedCategoryJobs, setApprovedCategoryJobs] = useState([]);
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        if (Param !== null) {
          const { data } = await axios.post(`${backendUrl}/api/jobs/searchjobs`, { search: Param });
          if (data.success) {
            setSearchedCategories(data.categorySet);
            setApprovedCategoryJobs(data.approvedCategoryJobs);
          }
        } else {
          const { data } = await axios.get(`${backendUrl}/api/jobs/getapprovedjobs`);
          if (data.success) {
            setSearchedCategories(data.categorySet);
            setApprovedCategoryJobs(data.jobs);
          }
        }
      } catch (error) {
        toast.error(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [Param, backendUrl]);


  const [filterCateogry, setFilterCateogry] = useState(categoryParam || 'category');
  const [filterLocationType, setFilterLocationType] = useState('locationType');
  const [filterJobType, setFilterJobType] = useState('jobType');

  const filteredJobs = approvedCategoryJobs?.filter((job) => {
    return (
      (filterCateogry === "category" || job.category === filterCateogry) &&
      (filterLocationType === "locationType" || job.locationType === filterLocationType) &&
      (filterJobType === "jobType" || job.jobType === filterJobType)
    );
  });

  const [toggleApplyJob, setToggleApplyJob] = useState(false)
  const [applJobId, setapplJobId] = useState('');
  const [coverLetter, setCoverLetter] = useState('');

  const applyJob = async (id) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/applyjob', { jobId: id, resume: userData?.resume, coverLetter: coverLetter });

      if (data.success) {
        toast.success(data.message);
        setToggleApplyJob(false);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  // Login Reminder Pop Up
  const [loginReminder, setLoginReminder] = useState(false);


  // Loading
  if (loading) {
    return <Loading />
  }

  return (
    <>
      <div className='px-6 min-h-[calc(100vh-4.6rem)]'>
        <div className='sticky top-0 z-2 py-6'>
          <Search Param={Param} />
        </div>
        <div className='my-10 px-2 md:px-5 lg:px-10'>
          {/* Jobs */}
          {Param || categoryParam ? <h1>
            <span className='font-bold'>Search Results For:</span> {Param || categoryParam}
          </h1> : null}

          <section className='flex flex-wrap items-center gap-8 mt-8'>
            <h3 className='flex items-center gap-3 font-semibold'>
              <FaFilter size={20} className='text-[var(--primary-color)]' /> Filter:
            </h3>
            <select
              name="category"
              id="category"
              onChange={(e) => setFilterCateogry(e.target.value)}
              className="border border-gray-300 rounded-lg py-2 px-4 shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800 transition-all"
            >
              <option value="category">Category</option>
              {searchedCategories?.map((category, i) => (
                <option
                  key={i}
                  value={category || "Empty"}
                  className="px-4 py-2 bg-white hover:bg-blue-50"
                >
                  {category || "Empty"}
                </option>
              ))}
            </select>
            <select name="jobType" id="jobType"
              className="border border-gray-300 rounded-lg py-2 px-4 shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800 transition-all"
              onChange={(e) => setFilterJobType(e.target.value)}
            >
              <option value="jobType">Job Type</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Contract">Contract</option>
            </select>

            <select name="LocationType" id="LocationType"
              className="border border-gray-300 rounded-lg py-2 px-4 shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800 transition-all"
              onChange={(e) => setFilterLocationType(e.target.value)}
            >
              <option value="locationType">Location Type</option>
              <option value="Remote">Remote</option>
              <option value="On Site">On Site</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </section>
          <section className='my-4'>
            <h3 className='mt-8 mb-4 flex items-center gap-3 font-semibold'>
              <FaClockRotateLeft className='text-[var(--primary-color)]' /> Recent Jobs
            </h3>
            <ul className='grid gird-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7'>
              {filteredJobs.length !== 0 ? filteredJobs
                ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))?.map((e, i) => (
                  <>
                    <JobCard setLoginReminder={setLoginReminder} setToggleApplyJob={setToggleApplyJob} setapplJobId={setapplJobId} key={i} e={e} />
                    {i === 5 &&
                      <li className='col-span-full'>
                        <h3 className='flex items-center gap-3 font-semibold'>
                          <MdFeaturedPlayList className='text-[var(--primary-color)]' /> Sponsored Jobs
                        </h3>
                        <FeaturedJobs />
                      </li>
                    }
                  </>
                )) :
                <NotFound404 margin={"mt-20"} value={
                  <div>
                    No Matches Found related <span className='font-bold'>"{Param || categoryParam}"</span>
                  </div>
                } />
              }
            </ul>
          </section>
        </div>
      </div >

      {/* Apply Job Modal */}
      <CoverLetterModal
        isOpen={toggleApplyJob}
        onClose={() => setToggleApplyJob(false)}
        coverLetter={coverLetter}
        setCoverLetter={setCoverLetter}
        onApply={() => applyJob(applJobId)}
      />

      {/* Login Reminder Modal */}
      <LoginReminderModal
        isOpen={loginReminder}
        onClose={() => setLoginReminder(false)}
        showLoginForm={true}
      />
    </>
  )
}
export default FindJobs;