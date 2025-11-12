import React, { useContext, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import "swiper/css/pagination";
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


  // Static data for 5 job cards
  const staticJobs = [
    {
      _id: "1",
      title: "Senior Frontend Developer",
      company: "TechCorp Solutions",
      location: "New York, NY",
      jobType: "full-time",
      jobsCurrency: "PKR",
      locationType: "hybrid",
      salaryType: "fixed",
      fixedSalary: 80000,
      applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      category: "Technology",
      subCategory: "Web Development",
      description: "Join our dynamic team as a Senior Frontend Developer and help build cutting-edge web applications.",
      skills: ["React", "JavaScript", "TypeScript", "CSS", "HTML"],
      experience: "3-5 years"
    },
    {
      _id: "2",
      title: "Digital Marketing Manager",
      jobsCurrency: "PKR",
      company: "Creative Agency Inc",
      location: "Los Angeles, CA",
      jobType: "full-time",
      locationType: "remote",
      minSalary: 60000,
      maxSalary: 85000,
      applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
      postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      category: "Marketing",
      subCategory: "Digital Marketing",
      description: "Lead our digital marketing initiatives and drive brand growth across multiple channels.",
      skills: ["SEO", "Google Ads", "Social Media", "Analytics", "Content Marketing"],
      experience: "2-4 years"
    },
    {
      _id: "3",
      title: "UX/UI Designer",
      jobsCurrency: "PKR",
      company: "Design Studio Pro",
      location: "San Francisco, CA",
      jobType: "contract",
      locationType: "on-site",
      minSalary: 70000,
      maxSalary: 95000,
      applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
      postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      category: "Design",
      subCategory: "UI/UX Design",
      description: "Create intuitive and beautiful user experiences for our diverse portfolio of clients.",
      skills: ["Figma", "Adobe XD", "Sketch", "Prototyping", "User Research"],
      experience: "2-3 years"
    },
    {
      _id: "4",
      title: "Data Scientist",
      jobsCurrency: "PKR",
      company: "Analytics Hub",
      location: "Chicago, IL",
      jobType: "full-time",
      locationType: "hybrid",
      minSalary: 90000,
      maxSalary: 130000,
      applicationDeadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000), // 35 days from now
      postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      category: "Technology",
      subCategory: "Data Science",
      description: "Analyze complex datasets and build predictive models to drive business insights.",
      skills: ["Python", "R", "SQL", "Machine Learning", "Statistics"],
      experience: "3-6 years"
    },
    {
      _id: "5",
      title: "Product Manager",
      jobsCurrency: "PKR",
      company: "Innovation Labs",
      location: "Austin, TX",
      jobType: "full-time",
      locationType: "remote",
      minSalary: 85000,
      maxSalary: 115000,
      applicationDeadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), // 28 days from now
      postedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      category: "Management",
      subCategory: "Product Management",
      description: "Drive product strategy and execution for our innovative software solutions.",
      skills: ["Product Strategy", "Agile", "User Stories", "Analytics", "Leadership"],
      experience: "4-7 years"
    }
  ];

  const jobSlides = groupJobsIntoSlides(staticJobs);


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

  if (staticJobs.length === 0) {
    return (
      <>
        <h1 className="flex flex-col justify-center w-full items-center mb-8">
          <span className="font-bold flex items-center gap-2">
            Latest <span className="text-[var(--primary-color)]">Jobs</span>
          </span>
          <span className='text-gray-600 text-lg'>2025 jobs live - {latestJobs.filter(job => new Date(job.createdAt).toDateString() === new Date().toDateString()).length} uploaded today </span>
        </h1>
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <MdWork size={64} className="mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-600">Check back later for new opportunities.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col justify-center w-full items-center mb-8">
        <span className="text-xl md:text-2xl lg:text-3xl font-semibold">
          Latest jobs
        </span>
        <span className='text-gray-600 text-lg'>2025 jobs live - {latestJobs.filter(job => new Date(job.createdAt).toDateString() === new Date().toDateString()).length} uploaded today </span>
      </div>
      <div className="relative max-w-5xl mx-auto">
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={24}
          slidesPerView={1} // default
          breakpoints={{
            768: { // md
              slidesPerView: 1, // still 1 slide per view
            },
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          pagination={{
            clickable: true,
            el: '.swiper-pagination-custom',
            bulletClass: 'swiper-pagination-bullet-custom',
            bulletActiveClass: 'swiper-pagination-bullet-active-custom',
          }}
          className="pb-16"
        >
          {jobSlides.map((slideJobs, slideIndex) => (
            <SwiperSlide key={slideIndex}>
              <div className="grid grid-cols-1 grid-rows-2 md:grid-cols-2 gap-6">
                {slideJobs.map((job, jobIndex) => (
                  <div key={job._id || jobIndex} className="w-full">
                    <JobCard e={job} />
                  </div>
                ))}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>


        {/* Custom Pagination Dots */}
        <div className="swiper-pagination-custom flex justify-center gap-2 mt-6"></div>
      </div>
    </>
  );
};

export default LatestJobs;
