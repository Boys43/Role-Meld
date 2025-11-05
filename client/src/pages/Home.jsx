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
      <main className="w-[95vw] mx-auto">
        <section className="relative grid grid-cols-2 max-h-[500px] p-8 w-full rounded-2xl overflow-hidden">
          {/* Main Content */}
          <div className="relative z-20 pt-10">
            <div className="mb-4">
              <span className="text-gray-600 text-lg">12k jobs in </span>
              <span className="text-gray-800 font-semibold text-lg">200 locations</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
              Your <span className="text-teal-600">Talents</span> is just a<br />
              search away!
            </h1>

            <Suspense fallback={<div>Loading...</div>}>
              <Search />
            </Suspense>

            <div className="mt-6">
              <span className="text-gray-600 text-sm">Popular Searches: </span>
              <span className="text-teal-600 text-sm">Experimentation, Marketing Manager</span>
            </div>
          </div>
          <Marquee direction="up" pauseOnHover speed={60} className="w-1/2">
            <div className="flex flex-col gap-6">
              <div className="ml-10 w-96 bg-[#f9a37f]/50 rounded-xl p-4 cursor-pointer" onClick={() => navigate('/find-jobs?job=Customer%20Success%20Manager')}>
                <span className="text-gray-600 text-sm">California</span>
                <h5 className="text-black font-semibold text-lg">Customer Success Manager</h5>
              </div>
              <div className="mr-10 w-96 bg-[#f46b99]/50 rounded-xl p-4 cursor-pointer" onClick={() => navigate('/find-jobs?job=Data%20Engineer')}>
                <span className="text-gray-600 text-sm">California</span>
                <h5 className="text-black font-semibold text-lg">Data Engineer</h5>
              </div>
              <div className="ml-10 w-96 bg-[#f49ec4]/50 rounded-xl p-4 cursor-pointer" onClick={() => navigate('/find-jobs?job=Marketing%20Manager')}>
                <span className="text-gray-600 text-sm">California</span>
                <h5 className="text-black font-semibold text-lg">Marketing Manager</h5>
              </div>
              <div className="mr-10 w-96 bg-[#f9d71c]/50 rounded-xl p-4 cursor-pointer" onClick={() => navigate('/find-jobs?job=Designer')}>
                <span className="text-gray-600 text-sm">California</span>
                <h5 className="text-black font-semibold text-lg">Designer</h5>
              </div>
              <div className="ml-10 w-96 bg-[#c6f19f]/50 rounded-xl p-4 cursor-pointer" onClick={() => navigate('/find-jobs?job=Software%20Engineer')}>
                <span className="text-gray-600 text-sm">California</span>
                <h5 className="text-black font-semibold text-lg">Software Engineer</h5>
              </div>
              <div className="mr-10 w-96 bg-[#f9a37f]/50 rounded-xl p-4 cursor-pointer" onClick={() => navigate('/find-jobs?job=Software%20Engineer')}>
                <span className="text-gray-600 text-sm">California</span>
                <h5 className="text-black font-semibold text-lg">Software Engineer</h5>
              </div>
            </div>
          </Marquee>
        </section>
        <section className="border z-0 rounded-2xl p-4 mt-4 shadow-xl">
          <Marquee className="z-0" pauseOnHover>
            <div className="flex flex-wrap items-center gap-10 md:gap-20 lg:gap-30 w-full mr-10 md:mr-20 lg:mr-30">
              <Img src={assets.nt} style="w-20" />
              <Img src={assets.am} style="w-20" />
              <Img src={assets.sm} style="w-20" />
              <Img src={assets.apple} style="w-20" />
              <Img src={assets.tcs} style="w-15" />
              <Img src={assets.mt} style="w-20" />
              <Img src={assets.fb} style="w-20" />
              <Img src={assets.nt} style="w-20" />
              <Img src={assets.am} style="w-20" />
              <Img src={assets.sm} style="w-20" />
              <Img src={assets.apple} style="w-20" />
              <Img src={assets.tcs} style="w-15" />
              <Img src={assets.mt} style="w-20" />
              <Img src={assets.fb} style="w-20 mr-10 lg:mr-15" />
            </div>
          </Marquee>
        </section>
        {/* Popular Categories Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Popular category</h2>
              <p className="text-gray-600 text-lg">Find and hire professionals across all skills</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {categories.length > 0 && categories.slice(0, 6).map((cat, index) => {
                let Icon;
                switch (cat.name) {
                  case "IT & Software": Icon = MdComputer; break;
                  case "Digital Marketing": Icon = MdCampaign; break;
                  case "Design & Creative": Icon = MdDesignServices; break;
                  case "Finance & Accounting": Icon = MdAccountBalance; break;
                  case "Human Resources": Icon = MdPeople; break;
                  case "Sales & Business Development": Icon = MdBusinessCenter; break;
                  case "Engineering & Architecture": Icon = MdEngineering; break;
                  default: Icon = MdComputer;
                }

                return (
                  <div 
                    key={index}
                    onClick={() => navigate('/category-jobs?category=' + encodeURIComponent(cat.name))}
                    className="group bg-gray-50 hover:bg-gray-100 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-md"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[var(--primary-color)]/80 rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{cat.name}</h3>
                        <p className="text-gray-500 text-sm">{cat.subcategories?.length || 0} jobs</p>
                      </div>
                    </div>
                  </div>
                );
              })}
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