import React, { useContext, useEffect, useState } from 'react'
import Search from '../components/Search'
import { useLocation, } from 'react-router-dom'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

// React Icons
import { FaFilter } from "react-icons/fa";
import JobCard from '../components/JobCard'

const FindJobs = () => {
  const location = useLocation();
  const { backendUrl, userData } = useContext(AppContext)

  const [loading, setLoading] = useState(false)

  // Using Parameters for getting the job 
  const search = new URLSearchParams(location.search);
  const Param = search.get('job');
  const categoryParam = search.get('category');

  const [searchedCategories, setSearchedCategories] = useState([]);
  const [approvedCategoryJobs, setApprovedCategoryJobs] = useState([]);
  if (Param) {
    const seachedJobs = async () => {
      try {
        const { data } = await axios.post(`${backendUrl}/api/jobs/searchjobs`, { search: Param })
        if (data.success) {
          setSearchedCategories(data.categorySet);
          setApprovedCategoryJobs(data.approvedCategoryJobs);
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
    useEffect(() => {
      seachedJobs();
    }, [Param]);
  } else {
    const gettAllJobs = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/jobs/getalljobs`)
        if (data.success) {
          setSearchedCategories(data.categorySet);
          setApprovedCategoryJobs(data.approvedCategoryJobs);
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  }



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

  // Loading
  if (loading) {
    return <div className="flex fixed top-1/2 left-1/2 tanslate-1/2 justify-center items-center py-10">
      <div className="w-8 h-8 border-4 border-[var(--primary-color)] border-t-transparent rounded-full animate-spin"></div>
    </div>
  }

  // View Details

  return (
    <>
      <div className=''>
        <div className='p-6'>
          <Search Param={Param} />
          <div className='my-6 px-10'>
            {/* Jobs */}
            <h1>
              <span className='font-bold'>Results For:</span> {Param}
            </h1>
            <section className='flex items-center gap-8 mt-6'>
              <h3 className='flex items-center gap-2 font-semibold'>
                <FaFilter size={20} className='text-[var(--primary-color)]' /> Filter:
              </h3>
              <select
                name="category"
                id="category"
                onChange={(e) => setFilterCateogry(e.target.value)}
                className="border border-gray-300 rounded-lg py-2 px-4 shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800 transition-all"
              >
                <option value="category">Category</option>
                {searchedCategories.map((category, i) => (
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
              <ul className='grid gird-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {filteredJobs?.map((e, i) => (
                  <JobCard key={i} e={e} />
                ))}
              </ul>
            </section>
          </div>
        </div >
      </div>
    </>
  )
}
export default FindJobs
