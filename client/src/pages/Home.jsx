import React, { Suspense, lazy, useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import Marquee from 'react-fast-marquee'
const Search = lazy(() => import("../components/Search"));
const Testimonials = lazy(() => import("../components/Testimonials"));
const FeaturedJobs = lazy(() => import("../components/FeaturedJobs"));
const BlogsSection = lazy(() => import("../components/BlogsSection"));
const LeaveReview = lazy(() => import("../components/LeaveReview"));


// React Icons
import { MdComputer, MdMessage } from "react-icons/md";       // IT & Software
import { MdCampaign } from "react-icons/md";       // Digital Marketing
import { MdDesignServices } from "react-icons/md"; // Design & Creative
import { MdAccountBalance } from "react-icons/md";
import { MdPeople } from "react-icons/md";
import { MdBusinessCenter } from "react-icons/md";
import { MdEngineering } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { MdFeaturedPlayList } from "react-icons/md";
import { MdRateReview } from "react-icons/md";
import { FaBloggerB } from "react-icons/fa";
import { FaBriefcase } from "react-icons/fa";

// Swiper Slides
import 'swiper/css';
import 'swiper/css/autoplay';
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Home = () => {
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
      <main className="py-6 w-[95vw] mx-auto">
        <section className="shadow-2xl py-14 bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] p-6 w-full rounded-2xl flex flex-col gap-4 items-center">
          <h1 className="text-white">
            Welcome to <span className="text-[var(--accent-color)] font-bold italic">Alfa Career</span>
          </h1>
          <p className="text-[var(--accent-color)] text-center">
            Find the perfect job for you in just a few clicks with Alfa Career
          </p>
          <Suspense fallback={<div>Loading...</div>}>
            <Search />
          </Suspense>
        </section>
        <section className="border z-0 rounded-2xl p-4 mt-4 shadow-xl">
          <Marquee className="z-0" pauseOnHover>
            <div className="flex flex-wrap items-center justify-evenly gap-10 md:gap-20 lg:gap-30 w-full">
              <img loading="lazy" src={assets.nt} alt="Netflix" className="w-20" />
              <img loading="lazy" src={assets.am} alt="Amazon" className="w-20" />
              <img loading="lazy" src={assets.sm} alt="samsung" className="w-20" />
              <img loading="lazy" src={assets.apple} alt="Apple" className="w-20" />
              <img loading="lazy" src={assets.tcs} alt="Tcs" className="w-15" />
              <img loading="lazy" src={assets.mt} alt="Microsoft" className="w-20" />
              <img loading="lazy" src={assets.fb} alt="Facebook" className="w-20" />
              <img loading="lazy" src={assets.nt} alt="Netflix" className="w-20" />
              <img loading="lazy" src={assets.am} alt="Amazon" className="w-20" />
              <img loading="lazy" src={assets.sm} alt="samsung" className="w-20" />
              <img loading="lazy" src={assets.apple} alt="Apple" className="w-20" />
              <img loading="lazy" src={assets.tcs} alt="Tcs" className="w-15" />
              <img loading="lazy" src={assets.mt} alt="Microsoft" className="w-20" />
              <img loading="lazy" src={assets.fb} alt="Facebook" className="w-20 mr-10 lg:mr-15" />
            </div>
          </Marquee>
        </section>
        <section className="mt-20">
          <h1 className="font-bold my-8 flex items-center gap-4">
            <FaBriefcase className="text-[var(--primary-color)]" /> Choose Your <span className="text-[var(--primary-color)]">Career Path</span>
          </h1>
          <div className="flex flex-col gap-4">
            {categories.length > 0 && (() => {
              const mid = Math.ceil(categories.length / 2);
              const firstHalf = categories.slice(0, mid);
              const secondHalf = categories.slice(mid);

              const renderCategory = (cat, index) => {
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
                  <h3
                    key={index}
                    className="flex-shrink-0 w-[400px] py-8 font-bold rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] border-2 border-[var(--primary-color)] hover:text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                    onClick={() => navigate('/category-jobs?category=' + encodeURIComponent(cat.name))}
                  >
                    <Icon size={30} />
                    {cat.name}
                  </h3>
                );
              };

              return (
                <>
                  <Marquee className="z-0" pauseOnHover gradient={false} speed={40}>
                    <div className="flex gap-8">
                      {firstHalf.map(renderCategory)}
                    </div>
                  </Marquee>
                  <Marquee className="z-0" pauseOnHover pauseOnClick speed={60} gradient={false}>
                    <div className="flex gap-8">
                      {secondHalf.map(renderCategory)}
                    </div>
                  </Marquee>
                </>
              );
            })()}
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
          <h1 className="font-bold flex items-center gap-4">
            <FaBloggerB className="text-[var(--primary-color)] my-4" /> Our <span className="text-[var(--primary-color)]">Blogs</span>
          </h1>
          <Suspense fallback={<div>Loading Featured Jobs...</div>}>
            <BlogsSection className={'grid-cols-1 lg:grid-cols-2'} />
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