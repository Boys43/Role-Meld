import React, { Suspense, lazy, useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import Marquee from 'react-fast-marquee'
import Img from "../components/Image";
const Search = lazy(() => import("../components/Search"));
const Testimonials = lazy(() => import("../components/Testimonials"));
const LatestJobs = lazy(() => import("../components/LatestJobs"));
const BlogsSection = lazy(() => import("../components/BlogsSection"));
const LeaveReview = lazy(() => import("../components/LeaveReview"));
import { useNavigate } from "react-router-dom";

// React Icons
import { MdMessage } from "react-icons/md";

// Swiper Slides
import 'swiper/css';
import 'swiper/css/autoplay';
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import { Bell, Code, FileText, Timer } from "lucide-react";
import { Briefcase, Palette, PenTool, Headphones } from "lucide-react";

const Home = () => {
  // Auto Scroll to Top
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [])
  const navigate = useNavigate();

  const { backendUrl } = useContext(AppContext);
  const [categoriesLoading, setCategoriesLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const getCategories = async () => {
    setCategoriesLoading(true)
    try {
      const { data } = await axios.get(backendUrl + '/api/admin/categories');
      if (data.success) {
        setCategories(data.categories)
        setCategoriesLoading(false)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setCategoriesLoading(false)
    }
  }
  useEffect(() => {
    getCategories()
  }, [])

  return (
    <>
      <main className="">
        <section className={`h-160 bg-cover bg-center relative p-3 pt-0 md:p-6 md:pt-0 lg:pt-0 lg:p-8 w-full`} style={{ backgroundImage: `url(${assets.hero})`, overflow: 'hidden' }}>
          <Navbar />
          <div className="max-w-6xl h-full items-center mx-auto grid grid-cols-1 md:grid-cols-2">
            {/* Main Content */}
            <div className="relative z-20 w-full">
              <div className="mb-4">
                <span className="text-gray-600 text-lg">12k jobs in </span>
                <span className="text-gray-800 font-semibold text-lg">200 locations</span>
              </div>

              <span className="text-4xl md:text-5xl font-semibold text-gray-800 leading-tight">
                Your <span className="text-[var(--primary-color)]">Talents</span> is just a<br />
                search away!
              </span>

              <Suspense fallback={<div>Loading...</div>}>
                <div className="my-4">
                  <Search />
                </div>
              </Suspense>

              <div className="mt-6">
                <span className="text-gray-600 text-md">Popular Searches: </span>
                <span className="text-[var(--primary-color)] text-md">Experimentation, Marketing Manager</span>
              </div>
            </div>
            <div className="hidden md:flex">
              <Marquee direction="up" pauseOnHover speed={60} className="">
                <div className="flex flex-col gap-15 justify-around">
                  <div className="ml-10 w-96 bg-[#f9a37f]/90 rounded-xl p-4 cursor-pointer" onClick={() => navigate('/find-jobs?job=Customer%20Success%20Manager')}>
                    <span className="text-gray-600 text-sm">California</span>
                    <h5 className="text-black font-semibold text-lg">Customer Success Manager</h5>
                  </div>
                  <div className="mr-10 w-96 bg-[#f9a37f]/90 rounded-xl p-4 cursor-pointer" onClick={() => navigate('/find-jobs?job=Customer%20Success%20Manager')}>
                    <span className="text-gray-600 text-sm">California</span>
                    <h5 className="text-black font-semibold text-lg">Customer Success Manager</h5>
                  </div>
                  <div className="ml-10 w-96 bg-[#f46b99]/90 rounded-xl p-4 cursor-pointer" onClick={() => navigate('/find-jobs?job=Data%20Engineer')}>
                    <span className="text-gray-600 text-sm">California</span>
                    <h5 className="text-black font-semibold text-lg">Data Engineer</h5>
                  </div>
                  <div className="mr-10 w-96 bg-[#f9d71c]/90 rounded-xl p-4 cursor-pointer" onClick={() => navigate('/find-jobs?job=Designer')}>
                    <span className="text-gray-600 text-sm">California</span>
                    <h5 className="text-black font-semibold text-lg">Designer</h5>
                  </div>
                </div>
              </Marquee>
            </div>
          </div>
        </section>


        <section className="max-w-6xl py-4 md:py-8 lg:py-12 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 z-0">
          <div className="flex flex-col md:flex-row text-center md:text-left items-center gap-4 ">
            <div className="p-5 inline-flex rounded-full bg-[var(--accent-color)]">
              <FileText />
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-md font-semibold">
                Create your resume
              </h4>
              <p className="text-sm text-gray-600">
                Upload your resume and let employers find you
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row text-center md:text-left items-center gap-4 ">
            <div className="p-5 inline-flex rounded-full bg-[var(--accent-color)]">
              <Timer />
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-md font-semibold">
                Get matched in minutes
              </h4>
              <p className="text-sm text-gray-600">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row text-center md:text-left items-center gap-4 ">
            <div className="p-5 inline-flex rounded-full bg-[var(--accent-color)]">
              <Bell />
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-md font-semibold">
                Never miss an opportunity
              </h4>
              <p className="text-sm text-gray-600">
                Never miss an opportunity to apply for jobs
              </p>
            </div>
          </div>
        </section>

        <hr className="border-gray-200" />
        {/* Popular Categories Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center flex flex-col gap-2 mb-12">
              <span className="text-2xl md:text-3xl font-bold text-gray-900">Popular category</span>
              <p className="text-gray-600 text-lg">Find and hire professionals across all skills</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div
                onClick={() => navigate('/category-jobs?category=' + encodeURIComponent('Development & IT'))}
                className="group bg-[var(--accent-color)] shadow-gray-100 hover:shadow rounded-xl p-6 cursor-pointer transition-all duration-300 border-gray-200 border"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[var(--primary-color)]/80 rounded-full flex items-center justify-center flex-shrink-0">
                    <Code size={24} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Development & IT</h4>
                    <p className="text-gray-500 text-sm">16 jobs</p>
                  </div>
                </div>
              </div>
              <div
                onClick={() => navigate('/category-jobs?category=' + encodeURIComponent('Marketing & Sales'))}
                className="group bg-[var(--accent-color)] shadow-gray-100 hover:shadow rounded-xl p-6 cursor-pointer transition-all duration-300 border-gray-200 border"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[var(--primary-color)]/80 rounded-full flex items-center justify-center flex-shrink-0">
                    <Briefcase size={24} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Marketing & Sales</h4>
                    <p className="text-gray-500 text-sm">4 jobs</p>
                  </div>
                </div>
              </div>
              <div
                onClick={() => navigate('/category-jobs?category=' + encodeURIComponent('Design & Creative'))}
                className="group bg-[var(--accent-color)] shadow-gray-100 hover:shadow rounded-xl p-6 cursor-pointer transition-all duration-300 border-gray-200 border"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[var(--primary-color)]/80 rounded-full flex items-center justify-center flex-shrink-0">
                    <Palette size={24} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Design & Creative</h4>
                    <p className="text-gray-500 text-sm">5 jobs</p>
                  </div>
                </div>
              </div>
              <div
                onClick={() => navigate('/category-jobs?category=' + encodeURIComponent('Writing & Translation'))}
                className="group bg-[var(--accent-color)] shadow-gray-100 hover:shadow rounded-xl p-6 cursor-pointer transition-all duration-300 border-gray-200 border"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[var(--primary-color)]/80 rounded-full flex items-center justify-center flex-shrink-0">
                    <PenTool size={24} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Writing & Translation</h4>
                    <p className="text-gray-500 text-sm">1 jobs</p>
                  </div>
                </div>
              </div>
              <div
                onClick={() => navigate('/category-jobs?category=' + encodeURIComponent('Customer Service'))}
                className="group bg-[var(--accent-color)] shadow-gray-100 hover:shadow rounded-xl p-6 cursor-pointer transition-all duration-300 border-gray-200 border"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[var(--primary-color)]/80 rounded-full flex items-center justify-center flex-shrink-0">
                    <Headphones size={24} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Customer Service</h4>
                    <p className="text-gray-500 text-sm">8 jobs</p>
                  </div>
                </div>
              </div>
              <div
                onClick={() => navigate('/category-jobs?category=' + encodeURIComponent('Product Management'))}
                className="group bg-[var(--accent-color)] shadow-gray-100 hover:shadow rounded-xl p-6 cursor-pointer transition-all duration-300 border-gray-200 border"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[var(--primary-color)]/80 rounded-full flex items-center justify-center flex-shrink-0">
                    <Briefcase size={24} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Product Management</h4>
                    <p className="text-gray-500 text-sm">6 jobs</p>
                  </div>
                </div>
              </div>
            </div>

            {/* View All Categories Link */}
            <div className="text-center">
              <span
                onClick={() => navigate('/categories')}
                className="text-[var(--primary-color)] cursor-pointer hover:text-[var(--primary-color)] font-medium text-md underline underline-offset-6 transition-colors"
              >
                View all categories
              </span>
            </div>
          </div>
        </section>

        {/* Latest Jobs Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="relative">
              <Suspense fallback={
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
              }>
                <LatestJobs />
              </Suspense>
            </div>
          </div>
        </section>

        {/* Featured Companies */}
        <section>
          {/* Soon ... */}
        </section>

        {/* Post a Job  */}
        <section className="bg-[#faf6eb] relative py-10 z-1">
          <div className="absolute top-1/2 z-0 -translate-1/2 left-1/2 w-full h-full">
            <Img src={assets.wave_bg} style={"w-full h-full"} />
          </div>
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 relative z-2">
            <div className="flex items-center justify-center">
              <Img src={assets.girl_illus} />
            </div>
            <div className="relative z-10 p-8 md:p-12 flex flex-col justify-center">
              <h4 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                Discover why more companies are using Civi to make hiring easy
              </h4>

              <p className="text-gray-600 text-lg mb-8 max-w-lg">
                Faucibus sed diam lorem nibh nibh risus dui ultricies purus eget
                convallis auctor massa.
              </p>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Candidate Applied</p>
                  <p className="text-4xl font-bold text-[var(--primary-color)]">24k+</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Company Reviews</p>
                  <p className="text-4xl font-bold text-[var(--primary-color)]">10k+</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Jobs submitted</p>
                  <p className="text-4xl font-bold text-[var(--primary-color)]">60k+</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Monthly Users</p>
                  <p className="text-4xl font-bold text-[var(--primary-color)]">30k+</p>
                </div>
              </div>

              <button
                onClick={() => navigate('/post-job')}
              >
                Post your job for FREE
              </button>
            </div>
          </div>
        </section>

        {/* Featured Jobs */}
        {/* <section className="p-4 w-full mt-20">
          <h1 className="font-bold flex items-center gap-4">
            <MdFeaturedPlayList className="text-[var(--primary-color)]" /> Featured <span className="text-[var(--primary-color)]">Jobs</span>
          </h1>
          <Suspense fallback={<div>Loading Featured Jobs...</div>}>
            <FeaturedJobs />
          </Suspense>
        </section> */}

        {/* Featured Companies */}

        {/* Testimonials */}
        <section className="max-w-6xl mx-auto p-4 w-full mt-20">
          <div className="flex md:w-1/2 text-center mx-auto flex-col items-center gap-2">
            <span className="text-3xl font-semibold">
              Trusted by leading brands and startups
            </span>
            <p className="text-lg">
              Here’s what they say about us
            </p>
          </div>
          <Suspense fallback={<div>Loading Testimonials Jobs...</div>}>
            <Testimonials />
          </Suspense>
        </section>

        {/* Post a Job 2  */}
        <section className="max-w-6xl mx-3 mt-10 relative md:mx-auto rounded-4xl bg-[#faf6eb] pt-15 flex flex-col md:flex-row z-1">
          <div className="absolute top-1/2 left-0 z-0 -translate-y-1/2 w-[60%] h-full">
            <Img src={assets.wave_2} style={"w-full h-full"} />
          </div>
          <div className="md:w-[40%] relative z-1 p-8 md:p-12 flex flex-col justify-center">
            <div className="mb-6">
              <span className="text-[var(--primary-color)] font-semibold text-sm uppercase tracking-wide">
                EMPLOYERS
              </span>
            </div>

            <span className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              Looking to post a job?
            </span>

            <p className="text-gray-600 text-lg mb-8 max-w-md">
              Find professionals from around the world and across all skills.
            </p>

            <button
              onClick={() => navigate('/post-job')}
              className="bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 w-fit"
            >
              Post your job for FREE
            </button>
          </div>
          <div className="md:w-[60%] relative z-1">
            <Img src={assets.post_job} style="" />
          </div>
        </section>


        {/* Blogs */}
        <section className="p-4 w-full mt-20">
          <div className="flex md:w-1/2 text-center mx-auto flex-col items-center gap-2">
            <span className="text-3xl md:text-4xl font-semibold">
              Latest from our blog
            </span>
            <p className="text-lg">
              Get interesting insights, articles, and news
            </p>
          </div>
          <Suspense fallback={<div>Loading Featured Jobs...</div>}>
            <BlogsSection className={'grid-cols-1 mt-10 md:grid-cols-2 lg:grid-cols-3'} />
          </Suspense>
        </section>
      </main>
    </>
  );
};

export default Home;