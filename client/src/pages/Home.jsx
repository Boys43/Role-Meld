import axios from "axios";
import assets from "../assets/assets";
import Search from "../components/Search";
import Marquee from 'react-fast-marquee'
import Testimonials from "../components/Testimonials";
import FeaturedJobs from "../components/FeaturedJobs";
import BlogsSection from "../components/BlogsSection";
import LeaveReview from "../components/LeaveReview";


// React Icons
import { MdComputer, MdMessage } from "react-icons/md";       // IT & Software
import { MdCampaign } from "react-icons/md";       // Digital Marketing
import { MdDesignServices } from "react-icons/md"; // Design & Creative
import { MdAccountBalance } from "react-icons/md"; // Finance & Accounting
import { MdPeople } from "react-icons/md";         // Human Resources
import { MdBusinessCenter } from "react-icons/md"; // Business Development
import { MdEngineering } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { MdFeaturedPlayList } from "react-icons/md";
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { MdRateReview } from "react-icons/md";
import { FaBloggerB } from "react-icons/fa";
import { FaBriefcase } from "react-icons/fa";

// Swiper Slides
import 'swiper/css';
import 'swiper/css/autoplay';

const Home = () => {
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  const [sponsoredJobs, setSponsoredJobs] = useState([])
  // Getting Sponsored Jobs
  const getSponsoredJobs = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs/getsponsoredjobs`);
      if (data.success) {
        setSponsoredJobs(data.sponsoredJobs);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

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
          <Search />
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
            <FaBriefcase className="text-[var(--primary-color)]" />  Choose Your <span className="text-[var(--primary-color)]">Career Path</span>
          </h1>
          <div className="flex flex-col gap-4">
            <Marquee className="z-0" pauseOnHover gradient={false} speed={40}>
              <div className="flex gap-8">
                <h3 className="flex-shrink-0 w-[400px] py-8 font-bold rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] border-2 border-[var(--primary-color)] hover:text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300"

                  onClick={() => navigate('/category-jobs?category=' + encodeURIComponent("IT & Software"))}
                >
                  <MdComputer size={30} />
                  IT & Software
                </h3>
                <h3 className="flex-shrink-0 w-[400px] py-8 font-bold rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] border-2 border-[var(--primary-color)] hover:text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300"

                  onClick={() => navigate('/category-jobs?category=' + encodeURIComponent("Digital Marketing"))}
                >
                  <MdCampaign size={30} />
                  Digital Marketing
                </h3>
                <h3 className="flex-shrink-0 w-[400px] py-8 font-bold rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] border-2 border-[var(--primary-color)] hover:text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300"

                  onClick={() => navigate('/category-jobs?category=' + encodeURIComponent("Design & Creative"))}
                >
                  <MdDesignServices size={30} />
                  Design & Creative
                </h3>
                <h3 className="flex-shrink-0 w-[400px] py-8 font-bold rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] border-2 border-[var(--primary-color)] hover:text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  onClick={() => navigate('/category-jobs?category=' + encodeURIComponent("Finance & Accounting"))}
                >
                  <MdAccountBalance size={30} />
                  Finance & Accounting
                </h3>
                <h3 className="flex-shrink-0 w-[400px] py-8 font-bold rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] border-2 border-[var(--primary-color)] hover:text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  onClick={() => navigate('/category-jobs?category=' + encodeURIComponent("IT & Software"))}>
                  <MdComputer size={30} />
                  IT & Software
                </h3>
                <h3 className="flex-shrink-0 w-[400px] py-8 font-bold rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] border-2 border-[var(--primary-color)] hover:text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300"

                  onClick={() => navigate('/category-jobs?category=' + encodeURIComponent("Digital Marketing"))}
                >
                  <MdCampaign size={30} />
                  Digital Marketing
                </h3>
                <h3 className="flex-shrink-0 w-[400px] py-8 font-bold rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] border-2 border-[var(--primary-color)] hover:text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300"

                  onClick={() => navigate('/category-jobs?category=' + encodeURIComponent("Design & Creative"))}
                >
                  <MdDesignServices size={30} />
                  Design & Creative
                </h3>
                <h3 className="flex-shrink-0 w-[400px] py-8 font-bold rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] border-2 border-[var(--primary-color)] hover:text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  onClick={() => navigate('/category-jobs?category=' + encodeURIComponent("Finance & Accounting"))}
                >
                  <MdAccountBalance size={30} />
                  Finance & Accounting
                </h3>
                <h3 className="flex-shrink-0 w-[400px] py-8 font-bold rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] border-2 border-[var(--primary-color)] hover:text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  onClick={() => navigate('/category-jobs?category=' + encodeURIComponent("IT & Software"))}>
                  <MdComputer size={30} />
                  IT & Software
                </h3>
                <h3 className="flex-shrink-0 w-[400px] py-8 font-bold rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] border-2 border-[var(--primary-color)] hover:text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300"

                  onClick={() => navigate('/category-jobs?category=' + encodeURIComponent("Digital Marketing"))}
                >
                  <MdCampaign size={30} />
                  Digital Marketing
                </h3>
                <h3 className="flex-shrink-0 w-[400px] py-8 font-bold rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] border-2 border-[var(--primary-color)] hover:text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300"

                  onClick={() => navigate('/category-jobs?category=' + encodeURIComponent("Design & Creative"))}
                >
                  <MdDesignServices size={30} />
                  Design & Creative
                </h3>
                <h3 className="flex-shrink-0 w-[400px] py-8 font-bold rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] border-2 border-[var(--primary-color)] hover:text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 mr-10"
                  onClick={() => navigate('/category-jobs?category=' + encodeURIComponent("Finance & Accounting"))}
                >
                  <MdAccountBalance size={30} />
                  Finance & Accounting
                </h3>
              </div>
            </Marquee>
            <Marquee className="z-0" pauseOnHover pauseOnClick speed={60} direction="">
              <div className="flex gap-8">
                <h3 className="py-8 w-[400px] font-bold rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] border-2 border-[var(--primary-color)] hover:text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  onClick={() => navigate('/category-jobs?category=' + encodeURIComponent("Human Resources"))}
                >
                  <MdPeople size={30} />
                  Human Resources
                </h3>
                <h3 className="py-8 w-[400px] font-bold rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] border-2 border-[var(--primary-color)] hover:text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300"

                  onClick={() => navigate('/category-jobs?category=' + encodeURIComponent("Sales & Business Development"))}
                >
                  <MdBusinessCenter size={30} />
                  Business Development
                </h3>
                <h3 className="py-8 w-[400px] font-bold rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] border-2 border-[var(--primary-color)] hover:text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300"

                  onClick={() => navigate('/category-jobs?category=' + encodeURIComponent("Engineering & Architecture"))}
                >
                  <MdEngineering size={30} />
                  Engineering
                </h3>
                <h3 className="py-8 w-[400px] font-bold rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] border-2 border-[var(--primary-color)] hover:text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  onClick={() => navigate('/category-jobs?category=' + encodeURIComponent("Human Resources"))}
                >
                  <MdPeople size={30} />
                  Human Resources
                </h3>
                <h3 className="py-8 w-[400px] font-bold rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] border-2 border-[var(--primary-color)] hover:text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300"

                  onClick={() => navigate('/category-jobs?category=' + encodeURIComponent("Sales & Business Development"))}
                >
                  <MdBusinessCenter size={30} />
                  Business Development
                </h3>
                <h3 className="py-8 w-[400px] font-bold rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] border-2 border-[var(--primary-color)] hover:text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300"

                  onClick={() => navigate('/category-jobs?category=' + encodeURIComponent("Engineering & Architecture"))}
                >
                  <MdEngineering size={30} />
                  Engineering
                </h3>

                <h3 className="py-8 w-[400px] font-bold rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] border-2 border-[var(--primary-color)] hover:text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  onClick={() => navigate('/category-jobs?category=' + encodeURIComponent("Human Resources"))}
                >
                  <MdPeople size={30} />
                  Human Resources
                </h3>
                <h3 className="py-8 w-[400px] font-bold rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] border-2 border-[var(--primary-color)] hover:text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300"

                  onClick={() => navigate('/category-jobs?category=' + encodeURIComponent("Sales & Business Development"))}
                >
                  <MdBusinessCenter size={30} />
                  Business Development
                </h3>
                <h3 className="py-8 w-[400px] font-bold rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gradient-to-br from-[var(--primary-color)] mr-10 to-[var(--secondary-color)] border-2 border-[var(--primary-color)] hover:text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300"

                  onClick={() => navigate('/category-jobs?category=' + encodeURIComponent("Engineering & Architecture"))}
                >
                  <MdEngineering size={30} />
                  Engineering
                </h3>
              </div>
            </Marquee>
          </div>
        </section>
        <section className="p-4 w-full mt-20">
          <h1 className="font-bold flex items-center gap-4">
            <MdFeaturedPlayList className="text-[var(--primary-color)]" /> Featured <span className="text-[var(--primary-color)]">Jobs</span>
          </h1>
          <FeaturedJobs />
        </section>
        <section className="p-4 w-full mt-20">
          <h1 className="font-bold flex items-center gap-4">
            <MdRateReview className="text-[var(--primary-color)]" /> Testimonials
          </h1>
          <Testimonials />
        </section>
        {/* Blogs */}
        <section className="p-4 w-full mt-20">
          <h1 className="font-bold flex items-center gap-4">
            <FaBloggerB className="text-[var(--primary-color)] my-4" /> Our <span className="text-[var(--primary-color)]">Blogs</span>
          </h1>
          <BlogsSection className={'grid-cols-1 lg:grid-cols-2'} />
        </section>
        {/* Leave a Review */}
        <section className="p-4 w-full mt-20">
          <h1 className='flex items-center gap-3 font-bold'>
            <MdMessage className='text-[var(--primary-color)]' /> Leave a Review
          </h1>
          <LeaveReview />
        </section>
      </main>
    </>
  );
};

export default Home;