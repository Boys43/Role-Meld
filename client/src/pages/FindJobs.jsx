import React, { Suspense, useContext, useEffect, useState } from 'react'
import Search from '../components/Search'
import { useLocation, } from 'react-router-dom'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
const FeaturedJobs = React.lazy(() => import('../components/FeaturedJobs'))
import JobCard from '../components/JobCard'
import NotFound404 from '../components/NotFound404'
import Loading from '../components/Loading'
import CoverLetterModal from '../components/CoverLetterModal'
import LoginReminderModal from '../components/LoginReminderModal'

// React Icons
import { FaFilter, FaDollarSign, FaStar, FaClock, FaMapMarkerAlt, FaBriefcase } from "react-icons/fa";
import { FaClockRotateLeft } from "react-icons/fa6";
import { MdFeaturedPlayList, MdClear } from "react-icons/md";
import { HiAdjustments } from "react-icons/hi";

const FindJobs = () => {
    // Auto Scroll to Top
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [])
  const location = useLocation();
  const { backendUrl, userData } = useContext(AppContext)
  const [loading, setLoading] = useState(false);

  // Using Parameters for getting the job 
  const search = new URLSearchParams(location.search);
  const Param = search.get('job');
  const categoryParam = search.get('category');
  const locationParam = search.get('location');

  const [searchedCategories, setSearchedCategories] = useState([]);
  const [approvedCategoryJobs, setApprovedCategoryJobs] = useState([]);
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        if (Param !== null) {
          const { data } = await axios.post(`${backendUrl}/api/jobs/searchjobs`, { search: Param, location: locationParam || "" });
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


  // Enhanced Filter States
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [selectedLocationTypes, setSelectedLocationTypes] = useState([]);
  const [salaryRange, setSalaryRange] = useState([0, 200000]);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [showRecentOnly, setShowRecentOnly] = useState(false);
  const [experienceLevel, setExperienceLevel] = useState([]);

  // Enhanced filtering logic
  const filteredJobs = approvedCategoryJobs?.filter((job) => {
    // Category filter
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(job.category);
    
    // Job type filter
    const jobTypeMatch = selectedJobTypes.length === 0 || selectedJobTypes.includes(job.jobType);
    
    // Location type filter
    const locationTypeMatch = selectedLocationTypes.length === 0 || selectedLocationTypes.includes(job.locationType);
    
    // Salary range filter
    const jobSalary = job.salaryType === 'fixed' ? job.fixedSalary : job.maxSalary || job.minSalary || 0;
    const salaryMatch = jobSalary >= salaryRange[0] && jobSalary <= salaryRange[1];
    
    // Featured filter
    const featuredMatch = !showFeaturedOnly || job.sponsored === true;
    
    // Recent filter (last 7 days)
    const recentMatch = !showRecentOnly || (new Date() - new Date(job.createdAt)) <= (7 * 24 * 60 * 60 * 1000);
    
    // Experience level filter
    const experienceMatch = experienceLevel.length === 0 || experienceLevel.includes(job.experience);
    
    return categoryMatch && jobTypeMatch && locationTypeMatch && salaryMatch && featuredMatch && recentMatch && experienceMatch;
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
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  // Login Reminder Pop Up
  const [loginReminder, setLoginReminder] = useState(false);

  // Filter helper functions
  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleJobTypeChange = (jobType) => {
    setSelectedJobTypes(prev => 
      prev.includes(jobType) 
        ? prev.filter(t => t !== jobType)
        : [...prev, jobType]
    );
  };

  const handleLocationTypeChange = (locationType) => {
    setSelectedLocationTypes(prev => 
      prev.includes(locationType) 
        ? prev.filter(l => l !== locationType)
        : [...prev, locationType]
    );
  };

  const handleExperienceChange = (experience) => {
    setExperienceLevel(prev => 
      prev.includes(experience) 
        ? prev.filter(e => e !== experience)
        : [...prev, experience]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedJobTypes([]);
    setSelectedLocationTypes([]);
    setSalaryRange([0, 200000]);
    setShowFeaturedOnly(false);
    setShowRecentOnly(false);
    setExperienceLevel([]);
  };

  const getActiveFiltersCount = () => {
    return selectedCategories.length + selectedJobTypes.length + selectedLocationTypes.length + 
           (showFeaturedOnly ? 1 : 0) + (showRecentOnly ? 1 : 0) + experienceLevel.length;
  };


  // Loading
  if (loading) {
    return <Loading />
  }

  return (
    <>
      <div className='min-h-[calc(100vh-4.6rem)]'>
        {/* Search Header */}
        <div className='sticky top-0 z-10 px-6 py-4'>
          <Search Param={Param} />
        </div>

        {/* Main Content */}
        <div className='flex max-w-7xl mx-auto'>
          {/* Sidebar Filters - 30% width */}
          <div className='w-full lg:w-[25%] bg-white border-r border-gray-200 p-6 h-[calc(100vh-120px)] overflow-y-auto sticky top-[120px]'>
            <div className='space-y-6'>
              {/* Filter Header */}
              <div className='flex items-center justify-between'>
                <h2 className='text-lg font-semibold text-gray-900 flex items-center gap-2'>
                  <HiAdjustments className='text-blue-600' />
                  Filters
                  {getActiveFiltersCount() > 0 && (
                    <span className='bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full'>
                      {getActiveFiltersCount()}
                    </span>
                  )}
                </h2>
                {getActiveFiltersCount() > 0 && (
                  <span 
                    onClick={clearAllFilters}
                    className='text-sm text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer'
                  >
                    <MdClear size={16} />
                    Clear All
                  </span>
                )}
              </div>

              {/* Salary Range Filter */}
              <div className='space-y-3'>
                <h3 className='font-medium text-gray-900 flex items-center gap-2'>
                  <FaDollarSign className='text-green-600' />
                  Salary Range
                </h3>
                <div className='space-y-3'>
                  <div className='flex items-center gap-2 text-sm text-gray-600'>
                    <span>${salaryRange[0].toLocaleString()}</span>
                    <span>-</span>
                    <span>${salaryRange[1].toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200000"
                    step="5000"
                    value={salaryRange[1]}
                    onChange={(e) => setSalaryRange([salaryRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className='grid grid-cols-2 gap-2'>
                    <input
                      type="number"
                      placeholder="Min"
                      value={salaryRange[0]}
                      onChange={(e) => setSalaryRange([parseInt(e.target.value) || 0, salaryRange[1]])}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={salaryRange[1]}
                      onChange={(e) => setSalaryRange([salaryRange[0], parseInt(e.target.value) || 200000])}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Categories Filter */}
              <div className='space-y-3'>
                <h3 className='font-medium text-gray-900 flex items-center gap-2'>
                  <FaBriefcase className='text-purple-600' />
                  Categories
                </h3>
                <div className='space-y-2 max-h-48 overflow-y-auto'>
                  {searchedCategories?.map((category, index) => (
                    <label key={index} className='flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors'>
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className='text-sm text-gray-700'>{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Job Type Filter */}
              <div className='space-y-3'>
                <h3 className='font-medium text-gray-900 flex items-center gap-2'>
                  <FaClock className='text-orange-600' />
                  Job Type
                </h3>
                <div className='space-y-2'>
                  {['full-time', 'part-time', 'contract', 'internship', 'temporary'].map((jobType) => (
                    <label key={jobType} className='flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors'>
                      <input
                        type="checkbox"
                        checked={selectedJobTypes.includes(jobType)}
                        onChange={() => handleJobTypeChange(jobType)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className='text-sm text-gray-700 capitalize'>
                        {jobType.split('-').join(' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location Type Filter */}
              <div className='space-y-3'>
                <h3 className='font-medium text-gray-900 flex items-center gap-2'>
                  <FaMapMarkerAlt className='text-red-600' />
                  Location Type
                </h3>
                <div className='space-y-2'>
                  {['remote', 'on-site', 'hybrid'].map((locationType) => (
                    <label key={locationType} className='flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors'>
                      <input
                        type="checkbox"
                        checked={selectedLocationTypes.includes(locationType)}
                        onChange={() => handleLocationTypeChange(locationType)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className='text-sm text-gray-700 capitalize'>
                        {locationType.split('-').join(' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience Level Filter */}
              <div className='space-y-3'>
                <h3 className='font-medium text-gray-900 flex items-center gap-2'>
                  <FaStar className='text-yellow-600' />
                  Experience Level
                </h3>
                <div className='space-y-2'>
                  {['Entry Level', 'Mid Level', 'Senior Level', 'Executive'].map((experience) => (
                    <label key={experience} className='flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors'>
                      <input
                        type="checkbox"
                        checked={experienceLevel.includes(experience)}
                        onChange={() => handleExperienceChange(experience)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className='text-sm text-gray-700'>{experience}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Special Filters */}
              <div className='space-y-3'>
                <h3 className='font-medium text-gray-900'>Special Filters</h3>
                <div className='space-y-2'>
                  <label className='flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors'>
                    <input
                      type="checkbox"
                      checked={showFeaturedOnly}
                      onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className='text-sm text-gray-700 flex items-center gap-2'>
                      <FaStar className='text-yellow-500' />
                      Featured Jobs Only
                    </span>
                  </label>
                  <label className='flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors'>
                    <input
                      type="checkbox"
                      checked={showRecentOnly}
                      onChange={(e) => setShowRecentOnly(e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className='text-sm text-gray-700 flex items-center gap-2'>
                      <FaClock className='text-green-500' />
                      Recent Jobs (Last 7 days)
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Jobs Grid - 70% width */}
          <div className='w-full lg:w-[75%] p-6'>
            <div className='space-y-6'>
              {/* Results Header */}
              <div className='flex items-center justify-between'>
                <div>
                  {Param || categoryParam ? (
                    <h1 className='text-2xl font-bold text-gray-900'>
                      Search Results for "{Param || categoryParam}"
                    </h1>
                  ) : (
                    <h1 className='text-2xl font-bold text-gray-900'>All Jobs</h1>
                  )}
                  <p className='text-gray-600 mt-1'>
                    {filteredJobs.length} jobs found
                  </p>
                </div>
              </div>

              {/* Jobs Grid */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {filteredJobs.length !== 0 ? filteredJobs
                  ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))?.map((job, index) => (
                    <div key={job._id}>
                      <JobCard 
                        setLoginReminder={setLoginReminder} 
                        setToggleApplyJob={setToggleApplyJob} 
                        setapplJobId={setapplJobId} 
                        e={job} 
                      />
                      {/* Insert Featured Jobs after every 6 jobs */}
                      {index === 5 && (
                        <div className='col-span-full my-8'>
                          <h3 className='text-xl font-semibold mb-4 flex items-center gap-3'>
                            <MdFeaturedPlayList className='text-blue-600' /> 
                            Sponsored Jobs
                          </h3>
                          <Suspense fallback={<div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>}>
                            <FeaturedJobs />
                          </Suspense>
                        </div>
                      )}
                    </div>
                  )) : (
                    <div className='col-span-full'>
                      <NotFound404 
                        margin={"mt-10"} 
                        value={
                          <div className='text-center'>
                            {Param || categoryParam ? (
                              <>
                                No matches found for <span className='font-bold'>"{Param || categoryParam}"</span>
                              </>
                            ) : (
                              "No jobs posted yet"
                            )}
                          </div>
                        } 
                      />
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </div>

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