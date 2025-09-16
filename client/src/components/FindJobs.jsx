import React, { useContext, useEffect, useMemo } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
// import Search from '../components/Search'
import { useState } from 'react';
import { GrSearch } from "react-icons/gr";
import { IoLocationOutline } from "react-icons/io5";
import { CiBookmark } from "react-icons/ci";
import { CiPaperplane } from "react-icons/ci";
import { IoBookmark } from "react-icons/io5";
import { FaBriefcase } from "react-icons/fa";
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaDollarSign } from "react-icons/fa";

import ReactPaginate from "react-paginate";
import Sidebar from './Sidebar';


const FindJobs = () => {

  const navigate = useNavigate();
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);

  const [jobs, setJobs] = useState([]);

  const itemsPerPage = 6; // how many items per page

  // Filter Items
  const [filterJobType, setFilterJobType] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterLocationType, setFilterLocationType] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchJob, setSearchJob] = useState('');

  const { backendUrl, userData, setJobId } = useContext(AppContext);

  const getJobs = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs/getalljobs`);
      if (data.success) {
        setJobs(data.jobs)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    getJobs();
  }, [])

  const stopWords = [
    'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'any', 'are', 'aren\'t', 'as', 'at',
    'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
    'can', 'cannot', 'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during',
    'each', 'few', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having',
    'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s',
    'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself',
    'let\'s', 'me', 'more', 'most', 'mustn\'t', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
    'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such',
    'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'this', 'those', 'through', 'to', 'too',
    'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t',
    'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t',
    'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves'
  ];

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesLocation = searchLocation ? job.location.toLowerCase().includes(searchLocation.toLowerCase()) : true;
      const matchesLocationType = filterLocationType
        ? job.locationType.toLowerCase() === filterLocationType.toLowerCase()
        : true;

      const matchesJobType = filterJobType
        ? job.jobType.toLowerCase() === filterJobType.toLowerCase()
        : true;
      const matchesCategory = filterRole ? job.category?.toLowerCase() === filterRole.toLowerCase() : true;

      return matchesLocation && matchesLocationType && matchesJobType && matchesCategory;
    });
  }, [jobs, searchJob, searchLocation, filterJobType, filterRole, filterLocationType]);

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(filteredJobs.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(filteredJobs.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, filteredJobs]);


  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % filteredJobs.length;
    setItemOffset(newOffset);
  };

  const { savedJobs, toggleSaveJob } = useContext(AppContext);

  function viewDetails(id) {
    navigate(`/jobdetails/${id}`)
  }

  const applyJob = async (jobId) => {

    try {
      const applicantDetails = {
        resume: userData?.resume,
        name: userData.name,
        email: userData.email
      }
      const { data } = await axios.post(`${backendUrl}/api/user/applyjob`, { jobId, applicantDetails });
      if (data.success) {
        toast.success(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <>
      <div className='h-screen relative w-full flex'>
        <main className='p-10 h-screen w-full flex flex-col gap-10'>
          <section
            id="search"
            className="shadow-2xl border-[1px] border-black mx-auto rounded-2xl"
          >
            <form className="flex items-center">
              <div className="flex relative w-1/2">
                <GrSearch
                  size={15}
                  className="absolute left-6 top-1/2 -translate-y-1/2 "
                />
                <input
                  value={searchJob}
                  onChange={(e) => setSearchJob(e.target.value)}
                  className="border-3 border-transparent focus:border-[var(--primary-color)] 
                  focus:outline-none py-3 pl-14 rounded-2xl w-full transition-all"
                  type="text"
                  placeholder="Job title, keywords, or company"
                />
              </div>
              <div className="w-[1px] h-[2rem] bg-gray-300"></div>
              <div className="flex relative w-1/2">
                <IoLocationOutline
                  size={20}
                  className="absolute left-6 top-1/2 -translate-y-1/2 "
                />
                <input
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="border-3 border-transparent focus:border-[var(--primary-color)] focus:outline-none focus:border-3 transition-all p-3 pl-14 rounded-2xl w-full"
                  type="text"
                  placeholder="City, state, zip code, or 'remote'"
                />
              </div>
              <div className='p-2'>
                <button className='bg-[var(--primary-color)]'>
                  Find Jobs
                </button>
              </div>
            </form>
          </section>
          {/* Filter Jobs */}
          <section className='w-full flex gap-5 justify-center'>
            <select name="location" id="location" className='py-1 px-4 border-[1px] border-black rounded' onChange={(e) => setFilterLocationType(e.target.value)}>
              <option value="">All Locations</option>
              <option value="remote">Remote</option>
              <option value="on-site">Onsite</option>
            </select>
            <select name="job-type" id="job-type" className='py-1 px-4 border-[1px] border-black rounded' onChange={(e) => setFilterJobType(e.target.value)}>
              <option value="">All Job Types</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="contract">Contract</option>
            </select>
            <select name="role" id="role" className='py-1 select: px-4 border-[1px] border-black rounded' onChange={(e) => setFilterRole(e.target.value)}>
              <option value="">All Roles</option>
              <option value="developer">Developer</option>
              <option value="designer">Designer</option>
              <option value="manager">Manager</option>
              <option value="qa">QA</option>
              <option value="programmer">Programmer</option>
            </select>
          </section>
          <div className='flex relative w-full'>
            <aside className='border w-[15rem]'>

            </aside>
            <section className='gap-4 '>
              <div className='px-4 w-full'>
                <ul className='grid lg:grid-cols-2 md:grid-cols-1 w-full sm:grid-cols-1 gap-5'>
                  {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => <div
                      key={job._id}
                      className='relative flex flex-col justify-between w-full gap-3 items-start border-[1px] p-5 rounded-2xl shadow-xl mb-5'>
                      <div className=' top-3 flex gap-2 right-3 text-[0.8rem]'>
                        <span className={`px-2 rounded bg-yellow-200`}>
                          {job.jobType}
                        </span>
                        <span className={`px-2 rounded bg-green-200`}>
                          {job.locationType}
                        </span>
                        <span className={`px-2 rounded bg-red-200`}>
                          {job.category}
                        </span>
                      </div>
                      <h3 className='font-semibold h-10'>{job.title.split(" ").slice(0, 3).join(" ")}</h3>
                      <div id='company' className=''>
                        <h4 className='font-semibold text-gray-500 flex items-center gap-2 '><FaBriefcase size={15} />{job.company}</h4>
                        <h5 className='text-gray-500 flex items-center gap-2 '><IoLocationOutline />{job.location}</h5>
                      </div>
                      <h5 className='bg-gray-100 py-1 px-2 text-[0.8rem] flex items-center gap-2 rounded'><FaDollarSign />{job.salary}</h5>
                      <div className='flex items-center gap-4 justify-between w-full'>
                        <button onClick={() => viewDetails(job._id)} className='flex w-1/2 bg-[var(--primary-color)]/50 border-2 border-[var(--primary-color)]  items-center gap-4'>
                          View Details <CiPaperplane />
                        </button>
                        <button onClick={(e) => {
                          e.preventDefault();
                          applyJob(job._id)
                        }} className='flex bg-green-400 w-1/2 border-2 border-green-500  items-center gap-4'>
                          Apply Now <CiPaperplane />
                        </button>
                      </div>
                      <span
                        onClick={() => toggleSaveJob(job._id)}
                        className='absolute top-5 right-5 text-[1.5rem] cursor-pointer'>
                        {savedJobs.has(job._id) ? <IoBookmark /> : <CiBookmark />}
                      </span>
                    </div>)
                  ) : (
                    <p>No jobs found.</p>
                  )}
                </ul>

                {/* Pagination */}
                <ReactPaginate
                  breakLabel="..."
                  nextLabel={<FaChevronRight className='text-[var(--primary-color)]' />}
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={3}
                  pageCount={pageCount}
                  previousLabel={<FaChevronLeft className='text-[var(--primary-color)]' />}
                  renderOnZeroPageCount={null}
                  containerClassName="flex gap-2 mt-4 justify-center"
                  pageClassName="px-3 py-1 rounded cursor-pointer"
                  activeClassName="bg-[var(--primary-color)] text-white"
                  previousClassName="px-2 flex items-center rounded-full py-1 rounded cursor-pointer"
                  nextClassName="px-3 flex items-center py-1 rounded cursor-pointer"
                />
              </div>
            </section>
          </div>
        </main>
      </div>

    </>
  )
}

export default FindJobs