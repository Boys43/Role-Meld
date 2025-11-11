import React, { Suspense, lazy, useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import Marquee from 'react-fast-marquee'
import Img from "../components/Image";
const Search = lazy(() => import("../components/Search"));
const Testimonials = lazy(() => import("../components/Testimonials"));
const FeaturedJobs = lazy(() => import("../components/FeaturedJobs"));
const LatestJobs = lazy(() => import("../components/LatestJobs"));
const BlogsSection = lazy(() => import("../components/BlogsSection"));
const LeaveReview = lazy(() => import("../components/LeaveReview"));
import { useNavigate } from "react-router-dom";


// React Icons
import { MdComputer, MdMessage } from "react-icons/md";       // IT & Software
import { MdCampaign } from "react-icons/md";       // Digital Marketing
import { MdDesignServices } from "react-icons/md"; // Design & Creative
import { MdAccountBalance } from "react-icons/md";
import { MdPeople } from "react-icons/md";
import { MdBusinessCenter } from "react-icons/md";
import { MdEngineering } from "react-icons/md";
import { MdFeaturedPlayList } from "react-icons/md";
import { MdRateReview } from "react-icons/md";

// Swiper Slides
import 'swiper/css';
import 'swiper/css/autoplay';
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import { HiDocument } from "react-icons/hi";
import { Bell, Code, FileText, Icon, Timer } from "lucide-react";
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
        <section className={`bg-cover bg-center w-full relative p-8 w-full`} style={{ backgroundImage: `url(${assets.hero})`, overflow: 'hidden' }}>
          <Navbar />
          <div className="max-w-6xl flex flex-col items-center mx-auto grid grid-cols-2">
            {/* Main Content */}
            <div className="relative z-20">
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
                <span className="text-gray-600 text-sm">Popular Searches: </span>
                <span className="text-[var(--primary-color)] text-sm">Experimentation, Marketing Manager</span>
              </div>
            </div>
            <Marquee direction="up" pauseOnHover speed={60} className="w-1/2">
              <div className="flex flex-col h-[500px] justify-between">
                <div className="ml-w-96 bg-[#f9a37f]/90 rounded-xl p-4 cursor-pointer" onClick={() => navigate('/find-jobs?job=Customer%20Success%20Manager')}>
                  <span className="text-gray-600 text-sm">California</span>
                  <h5 className="text-black font-semibold text-lg">Customer Success Manager</h5>
                </div>
                <div className="ml-w-96 bg-[#f9a37f]/90 rounded-xl p-4 cursor-pointer" onClick={() => navigate('/find-jobs?job=Customer%20Success%20Manager')}>
                  <span className="text-gray-600 text-sm">California</span>
                  <h5 className="text-black font-semibold text-lg">Customer Success Manager</h5>
                </div>
                <div className="mr-10 w-96 bg-[#f46b99]/90 rounded-xl p-4 cursor-pointer" onClick={() => navigate('/find-jobs?job=Data%20Engineer')}>
                  <span className="text-gray-600 text-sm">California</span>
                  <h5 className="text-black font-semibold text-lg">Data Engineer</h5>
                </div>

                <div className="ml-10 w-96 bg-[#f9d71c]/90 rounded-xl p-4 cursor-pointer" onClick={() => navigate('/find-jobs?job=Designer')}>
                  <span className="text-gray-600 text-sm">California</span>
                  <h5 className="text-black font-semibold text-lg">Designer</h5>
                </div>
              </div>
            </Marquee>
          </div>

        </section>
        <section className="py-4 md:py-8 lg:py-12 max-w-6xl mx-auto border-b border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 z-0">
          <div className="flex items-center gap-4 ">
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
          <div className="flex items-center gap-4 ">
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
          <div className="flex items-center gap-4 ">
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
        {/* Popular Categories Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Popular category</h2>
              <p className="text-gray-600 text-lg">Find and hire professionals across all skills</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div
                onClick={() => navigate('/category-jobs?category=' + encodeURIComponent('Development & IT'))}
                className="group bg-[var(--accent-color)] shadow-gray-100 hover:shadow rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg border-gray-200 border"
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
                className="group bg-[var(--accent-color)] shadow-gray-100 hover:shadow rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg border-gray-200 border"
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
                className="group bg-[var(--accent-color)] shadow-gray-100 hover:shadow rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg border-gray-200 border"
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
                className="group bg-[var(--accent-color)] shadow-gray-100 hover:shadow rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg border-gray-200 border"
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
                className="group bg-[var(--accent-color)] shadow-gray-100 hover:shadow rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg border-gray-200 border"
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
                className="group bg-[var(--accent-color)] shadow-gray-100 hover:shadow rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg border-gray-200 border"
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
                className="text-[var(--primary-color)] cursor-pointer hover:text-[var(--primary-color)] font-medium text-sm hover:underline transition-colors"
              >
                View all categories
              </span>
            </div>
          </div>
        </section>

        {/* Latest Jobs Section */}
        <section className="py-16 bg-gray-50">
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

        <section className="p-4 w-full mt-20">
          <h1 className="font-bold flex items-center gap-4">
            <MdFeaturedPlayList className="text-[var(--primary-color)]" /> Featured <span className="text-[var(--primary-color)]">Jobs</span>
          </h1>
          <Suspense fallback={<div>Loading Featured Jobs...</div>}>
            <FeaturedJobs />
          </Suspense>
        </section>
        <section className="p-4 w-full mt-20">
          <h1 className="font-bold flex items-center gap-4">
            <MdRateReview className="text-[var(--primary-color)]" /> Testimonials
          </h1>
          <Suspense fallback={<div>Loading Testimonials Jobs...</div>}>
            <Testimonials />
          </Suspense>
        </section>
        {/* Blogs */}
        <section className="p-4 w-full mt-20">
          <Suspense fallback={<div>Loading Featured Jobs...</div>}>
            <BlogsSection className={'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} />
          </Suspense>
        </section>
        {/* Leave a Review */}
        <section className="p-4 w-full mt-20">
          <h1 className='flex items-center gap-3 font-bold'>
            <MdMessage className='text-[var(--primary-color)]' /> Leave a Review
          </h1>
          <Suspense fallback={<div>Loading Featured Jobs...</div>}>
            <LeaveReview />
          </Suspense>
        </section>
      </main>
    </>
  );
};

export default Home;