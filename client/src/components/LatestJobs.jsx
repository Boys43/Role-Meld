import React, { useContext, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaMapMarkerAlt, FaDollarSign, FaClock, FaBuilding } from "react-icons/fa";
import { MdWork, MdAccessTime } from "react-icons/md";
import JobCard from "./JobCard";

const LatestJobs = () => {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const [latestJobs, setLatestJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savedJobs, setSavedJobs] = useState(new Set());

  const getLatestJobs = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs/getalljobs`);
      if (data.success) {
        // Sort by creation date and get the latest 20 jobs (for 5 slides of 4 jobs each)
        const sortedJobs = data.jobs
          .filter(job => job.applicationDeadline > new Date())
          .sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt))
          .slice(0, 20);
        setLatestJobs(sortedJobs);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLatestJobs();
  }, []);

  const toggleSaveJob = (jobId) => {
    setSavedJobs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  const formatSalary = (minSalary, maxSalary) => {
    if (minSalary && maxSalary) {
      return `$${minSalary} - $${maxSalary}/month`;
    } else if (minSalary) {
      return `$${minSalary}+/month`;
    }
    return "Negotiable Price";
  };

  const getDaysLeft = (deadline) => {
    if (!deadline) return "No deadline";
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Expired";
    if (diffDays === 0) return "Today";
    return `${diffDays} days left to apply`;
  };

  const getCompanyInitials = (companyName) => {
    if (!companyName) return "C";
    return companyName
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRandomColor = () => {
    const colors = [
      "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-pink-500",
      "bg-indigo-500", "bg-red-500", "bg-yellow-500", "bg-teal-500"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Helper function to group jobs into slides of 4
  const groupJobsIntoSlides = (jobs) => {
    const slides = [];
    for (let i = 0; i < jobs.length; i += 4) {
      slides.push(jobs.slice(i, i + 4));
    }
    return slides;
  };

  const jobSlides = groupJobsIntoSlides(latestJobs);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="flex gap-2 mb-4">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (latestJobs.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 mb-4">
          <MdWork size={64} className="mx-auto" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
        <p className="text-gray-600">Check back later for new opportunities.</p>
      </div>
    );
  }

  return (
    <>
      <h1 className="flex flex-col justify-center w-full items-center mb-8">
        <span className="font-bold flex items-center gap-2">
          <MdWork className=" text-[var(--primary-color)] my-4" /> Latest <span className="text-[var(--primary-color)]">Jobs</span>
        </span>
        <span className='text-gray-600 text-lg'>2025 jobs live - {latestJobs.filter(job => new Date(job.createdAt).toDateString() === new Date().toDateString()).length} uploaded today </span>
      </h1>
      <div className="relative max-w-5xl mx-auto">
        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={24}
          slidesPerView={1}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          className="pb-12"
        >
          {jobSlides.map((slideJobs, slideIndex) => (
            <SwiperSlide key={slideIndex}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {slideJobs.map((job, jobIndex) => (
                  <div key={job._id || jobIndex} className="w-full">
                    <JobCard e={job} />
                  </div>
                ))}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <span className="swiper-button-prev-custom w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </span>
          <span className="swiper-button-next-custom w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </>
  );
};

export default LatestJobs;
