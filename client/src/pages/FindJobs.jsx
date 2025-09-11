import React, { useContext, useEffect } from 'react'
import axios from 'axios'
// import Search from '../components/Search'
import { useState } from 'react';
import { GrSearch } from "react-icons/gr";
import { IoLocationOutline } from "react-icons/io5";
import { CiBookmark } from "react-icons/ci";
import { CiPaperplane } from "react-icons/ci";
import { IoBookmark } from "react-icons/io5";
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext';
import Sidebar from '../components/Sidebar';

const FindJobs = () => {

  const [searchLocation, setSearchLocation] = useState('');
  const [searchJob, setSearchJob] = useState('');
  const [selected, setSelected] = useState(null);

  const { backendUrl } = useContext(AppContext)

  const jobs = [
    { id: 1, title: "Jobs for Programmers", tags: ["Remote", "Full Time"], company: "Google", location: "Mountain View, CA", desc: "Find programming jobs in various domains.", salary: "Rs. 1,00,000 - Rs. 1,50,000" },
    { id: 2, title: "Frontend Developer Jobs", tags: ["Remote", "Part Time"], company: "Facebook", location: "Menlo Park, CA", desc: "Explore frontend developer positions.", salary: "Rs. 80,000 - Rs. 1,20,000" },
    { id: 3, title: "Backend Engineer Opportunities", tags: ["Onsite", "Full Time"], company: "Amazon", location: "Seattle, WA", desc: "Discover backend engineer roles.", salary: "Rs. 1,00,000 - Rs. 1,50,000" },
    { id: 4, title: "Data Scientist Roles", tags: ["Remote", "Contract"], company: "Microsoft", location: "Redmond, WA", desc: "Uncover data scientist job openings.", salary: "Rs. 1,20,000 - Rs. 1,80,000" },
    { id: 5, title: "Full Stack Programmer Jobs", tags: ["Remote", "Full Time"], company: "Apple", location: "Cupertino, CA", desc: "Find full stack programmer positions.", salary: "Rs. 1,00,000 - Rs. 1,50,000" },
    { id: 6, title: "Full Stack Programmer Jobs", tags: ["Remote", "Full Time"], company: "Apple", location: "Cupertino, CA", desc: "Find full stack programmer positions.", salary: "Rs. 1,00,000 - Rs. 1,50,000" },
    { id: 7, title: "Full Stack Programmer Jobs", tags: ["Remote", "Full Time"], company: "Apple", location: "Cupertino, CA", desc: "Find full stack programmer positions.", salary: "Rs. 1,00,000 - Rs. 1,50,000" },
    { id: 8, title: "Full Stack Programmer Jobs", tags: ["Remote", "Full Time"], company: "Apple", location: "Cupertino, CA", desc: "Find full stack programmer positions.", salary: "Rs. 1,00,000 - Rs. 1,50,000" },
  ];

  const stopWords = ["for", "to", "jobs", "is", "or", "the", "a", "an", "in"]

  const filteredJobs = jobs.filter((job) => {
    // Clean title → lowercase + split words
    const words = job.title
      .toLowerCase()
      .split(/\s+/) // split on spaces
      .filter((word) => !stopWords.includes(word)); // remove stop words

    // Rebuild the title without stop words
    const cleanedTitle = words.join(" ");

    return cleanedTitle.includes(searchJob.toLowerCase());
  });

  const [savedJobs, setSavedJobs] = useState(new Set());

  function toggleSaveJob(id) {
    setSavedJobs((prev) => {
      const newSet = new Set(prev); // copy previous state
      if (newSet.has(id)) {
        newSet.delete(id); // unsave
        toast.success("Job Unsaved")
      } else {
        newSet.add(id); // save
        toast.success("Job Saved")
      }
      var arrJobs = Array.from(newSet)
      console.log('arrJobs:', arrJobs);

      try {
        const { data } = axios.post(`${backendUrl}/api/user/savejob`, { savedJobs: arrJobs });
        if (data.success) {
          toast.success(data.message)
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error)
      }
      return newSet;
    });
  }

  return (
    <>
      <div className='flex h-screen w-full justify-center'>
        <main className='py-10 h-screen overflow-y-scroll no-scrollbar flex flex-col gap-10'>
          <section
            id="search"
            className="w-[70%] shadow-2xl border-[1px] border-black mx-auto rounded-2xl"
          >
            <form onSubmit={(e) => onSubmitHandler(e)} className="flex items-center">
              <div className="flex relative w-1/2">
                <GrSearch
                  size={15}
                  className="absolute left-6 top-1/2 -translate-y-1/2 "
                />
                <input
                  value={searchJob}
                  onChange={(e) => setSearchJob(e.target.value)}
                  className="border-3 border-transparent focus:border-[var(--primary-color)] focus:outline-none py-3 pl-14 rounded-2xl w-full transition-all"
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
              <div className="py-1 px-2">
                <button className="whitespace-nowrap">Find Jobs</button>
              </div>
            </form>
          </section>
          {/* Filter Jobs */}
          <section className='w-full flex gap-5 justify-center'>
            <select name="location" id="location" className='py-1 px-4 border-[1px] border-black rounded'>
              <option value="">All Locations</option>
              <option value="remote">Remote</option>
              <option value="onsite">Onsite</option>
            </select>
            <select name="job-type" id="job-type" className='py-1 px-4 border-[1px] border-black rounded'>
              <option value="">All Job Types</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
            </select>
            <select name="role" id="role" className='py-1 select: px-4 border-[1px] border-black rounded' >
              <option value="">All Roles</option>
              <option value="developer">Developer</option>
              <option value="designer">Designer</option>
              <option value="manager">Manager</option>
              <option value="qa">QA</option>
              <option value="programmer">Programmer</option>
            </select>
          </section>
          <div className='flex relative'>
            <aside className='border w-[20%]'>
              
            </aside>
            <section className='px-4 w-[80%] gap-4'>
              <div className=''>
                <ul className='grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-5'>
                  {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => <div
                      key={job.id}
                      className='relative flex flex-col gap-2 items-start w-full border-[1px] border-black p-5 rounded-2xl shadow-lg mb-5'>
                      <div className=' top-3 flex gap-2 right-3 text-[0.8rem]'>
                        {job.tags.map((tag, index) => (
                          <span key={index} className={`px-2 rounded ${tag === "Full Time" ? "bg-green-100" : tag === "Part Time" ? "bg-yellow-100" : tag === "Contract" ? "bg-blue-100" : "bg-purple-100"}`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className='font-semibold h-20'>{job.title}</h3>
                      <div id='company' className=''>
                        <h4 className='font-semibold text-gray-500'>{job.company}</h4>
                        <h5 className='text-gray-500 '>{job.location}</h5>
                      </div>
                      <h5 className='bg-gray-100 py-1 px-2 text-[0.8rem] rounded'>{job.salary}</h5>
                      <button onClick={() => setSelected(job.id)} className='flex items-center gap-4'>
                        View Details <CiPaperplane />
                      </button>
                      <span
                        onClick={() => toggleSaveJob(job.id)}
                        className='absolute top-5 right-5 text-[1.5rem] cursor-pointer'>
                        {savedJobs.has(job.id) ? <IoBookmark /> : < CiBookmark />}
                      </span>
                    </div>)
                  ) : (
                    <p>No jobs found.</p>
                  )}
                </ul>
              </div>
              <div>
              </div>

            </section>
          </div>
        </main>
      </div>

    </>
  )
}

export default FindJobs